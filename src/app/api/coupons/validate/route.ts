import { NextResponse } from "next/server";
import { getAdminCoupons } from "@/lib/admin/store";

export async function POST(request: Request) {
  try {
    const { code, amount } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { valid: false, message: "Please enter a coupon code" },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const orderAmount = Number(amount) || 0;
    const coupons = await getAdminCoupons();
    const coupon = coupons.find(
      (c) => c.code.toUpperCase() === cleanCode && c.status === "active"
    );

    if (!coupon) {
      return NextResponse.json({
        valid: false,
        message: "Invalid promo code or code is inactive",
      });
    }

    // Check minimum spend
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        message: `This coupon requires a minimum spend of ₹${coupon.minOrderAmount}`,
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({
        valid: false,
        message: "This coupon code has reached its maximum redemption limit",
      });
    }

    // Check expiry
    if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({
        valid: false,
        message: "This coupon code has expired",
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((orderAmount * coupon.discountValue) / 100);
    } else {
      discountAmount = Math.min(coupon.discountValue, orderAmount);
    }

    const finalAmount = Math.max(orderAmount - discountAmount, 0);

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      finalAmount,
      message:
        coupon.discountType === "percentage"
          ? `${coupon.discountValue}% discount applied!`
          : `₹${coupon.discountValue} flat discount applied!`,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { valid: false, message: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
