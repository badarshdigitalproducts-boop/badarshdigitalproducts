import { NextResponse } from "next/server";
import { saveAdminOrder, getAdminCoupons, saveAdminCoupon, addLead } from "@/lib/admin/store";
import type { OrderItem } from "@/lib/admin/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      productId,
      productTitle,
      productPrice,
      productType,
      downloadUrl,
      canvaUrl,
      includeUpsell,
      couponCode,
      paymentMethod = "UPI",
    } = body;

    if (!customerName || !productTitle || !productPrice) {
      return NextResponse.json(
        { error: "Customer name and product details are required" },
        { status: 400 }
      );
    }

    const basePrice = Number(productPrice) || 299;
    const upsellPrice = includeUpsell ? 199 : 0;
    const subtotal = basePrice + upsellPrice;

    let discountAmount = 0;
    let appliedCoupon = null;

    // Validate and calculate coupon discount if provided
    if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
      const cleanCode = couponCode.trim().toUpperCase();
      const coupons = await getAdminCoupons();
      const matched = coupons.find(
        (c) => c.code.toUpperCase() === cleanCode && c.status === "active"
      );

      if (matched) {
        // Check minimum order amount if set
        if (!matched.minOrderAmount || subtotal >= matched.minOrderAmount) {
          // Check usage limit if set
          if (!matched.usageLimit || matched.usageCount < matched.usageLimit) {
            // Check expiry date if set
            const isNotExpired =
              !matched.expiresAt || new Date(matched.expiresAt).getTime() > Date.now();

            if (isNotExpired) {
              appliedCoupon = matched;
              if (matched.discountType === "percentage") {
                discountAmount = Math.round((subtotal * matched.discountValue) / 100);
              } else {
                discountAmount = Math.min(matched.discountValue, subtotal);
              }

              // Increment coupon usage count
              await saveAdminCoupon({
                ...matched,
                usageCount: matched.usageCount + 1,
              }).catch((e) => console.warn("Coupon usage increment error:", e));
            }
          }
        }
      }
    }

    const finalAmount = Math.max(subtotal - discountAmount, 0);

    // Build items array
    const items: OrderItem[] = [
      {
        id: productId || `item-${Date.now()}`,
        title: productTitle,
        price: basePrice,
        quantity: 1,
        productType: productType || "canva-template",
        downloadUrl: downloadUrl || "",
        templateUrl: canvaUrl || undefined,
        canvaUrl: canvaUrl || undefined,
      },
    ];

    if (includeUpsell) {
      items.push({
        id: "upsell-planner",
        title: "30-Day Viral Content Planner Bundle",
        price: 199,
        quantity: 1,
        productType: "planner",
        downloadUrl: "/downloads/30-day-content-planner.zip",
      });
    }

    // Generate unique license key
    const p1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const p2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const licenseKey = `BDRSH-${p1}-${p2}`;

    // Save order directly into the database (store.ts & Firebase Firestore)
    const order = await saveAdminOrder({
      customerName,
      customerEmail: customerEmail || "",
      customerPhone: customerPhone || "",
      items,
      totalAmount: finalAmount,
      currency: "INR",
      paymentMethod,
      paymentStatus: "completed",
      licenseKey,
      canvaAccessDelivered: true,
      deliveryNotes: `Online checkout ${appliedCoupon ? `[Coupon: ${appliedCoupon.code} -₹${discountAmount}]` : ""}`,
    });

    // Also auto-capture customer contact into CRM leads pipeline as a "won" paying customer
    if (customerEmail || customerPhone) {
      await addLead({
        name: customerName,
        email: customerEmail || "checkout@customer.com",
        phone: customerPhone,
        interest: `Purchased: ${productTitle}`,
        message: `Purchased order ${order.id} for ₹${finalAmount} with license ${licenseKey}`,
        budget: `₹${finalAmount}`,
      }).catch((e) => console.warn("Auto-lead capture error:", e));
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        totalAmount: order.totalAmount,
        discountAmount,
        appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
        licenseKey: order.licenseKey,
        items: order.items,
        downloadUrl: downloadUrl || `/downloads/${order.id}.zip`,
        canvaUrl: canvaUrl || null,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { error: "Internal error processing order" },
      { status: 500 }
    );
  }
}
