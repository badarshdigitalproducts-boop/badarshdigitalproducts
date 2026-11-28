import { NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminOrders, saveAdminOrder, deleteAdminOrder } from "@/lib/admin/store";

function isAuthorized(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  return verifySessionToken(match ? match[1] : undefined, request.headers.get("user-agent") || undefined);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await getAdminOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Get Orders error:", error);
    return NextResponse.json({ orders: [], error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.customerName || data.totalAmount === undefined) {
      return NextResponse.json({ error: "Customer name and total amount required" }, { status: 400 });
    }

    const saved = await saveAdminOrder(data);
    return NextResponse.json({ success: true, order: saved });
  } catch (error) {
    console.error("Save Order error:", error);
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
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const success = await deleteAdminOrder(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Delete Order error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
