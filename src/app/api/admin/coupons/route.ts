import { NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminCoupons, saveAdminCoupon, deleteAdminCoupon } from "@/lib/admin/store";

function isAuthorized(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  return verifySessionToken(match ? match[1] : undefined);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const coupons = await getAdminCoupons();
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Get Coupons error:", error);
    return NextResponse.json({ coupons: [], error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.code || data.discountValue === undefined) {
      return NextResponse.json({ error: "Coupon code and discount value required" }, { status: 400 });
    }

    const saved = await saveAdminCoupon(data);
    return NextResponse.json({ success: true, coupon: saved });
  } catch (error) {
    console.error("Save Coupon error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Coupon ID required" }, { status: 400 });
    }

    const success = await deleteAdminCoupon(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Delete Coupon error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
