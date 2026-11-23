import { NextResponse } from "next/server";
import { getAdminOrders } from "@/lib/admin/store";
import { canAccessOrder } from "@/lib/auth/access-control";

interface RouteParams {
  params: Promise<{ orderId: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { orderId } = await params;
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token") || searchParams.get("key");

    const orders = await getAdminOrders();
    const order = orders.find(
      (o) => o.id.toLowerCase() === orderId.toLowerCase() || o.licenseKey === orderId
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // Strict IDOR ownership validation
    const hasAccess = canAccessOrder(request, order, token);
    if (!hasAccess) {
      return NextResponse.json(
        {
          error:
            "Forbidden: You do not have permission to view this customer order (DPDP IDOR Protection enforced).",
        },
        { status: 403 }
      );
    }

    // Return sanitized customer order record
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        items: order.items,
        totalAmount: order.totalAmount,
        currency: order.currency,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        licenseKey: order.licenseKey,
        canvaAccessDelivered: order.canvaAccessDelivered,
        deliveryNotes: order.deliveryNotes,
        createdAt: order.createdAt,
      },
    });
  } catch (err: any) {
    console.error("Order fulfillment API error:", err);
    return NextResponse.json(
      { error: "Internal server error retrieving order." },
      { status: 500 }
    );
  }
}
