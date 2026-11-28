import { NextResponse } from "next/server";
import { getAdminOrders, saveAdminOrder } from "@/lib/admin/store";
import { canAccessOrder } from "@/lib/auth/access-control";
import { getCashfreeOrder } from "@/lib/cashfree";
import { fsSaveOrder, rtSaveOrder, isFirebaseConfigured } from "@/lib/firebase";
import { sendOrderConfirmationEmail } from "@/lib/email/resend";

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
    const token = searchParams.get("token") || searchParams.get("key") || searchParams.get("cf_id");

    const orders = await getAdminOrders();
    let order = orders.find(
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

    // Auto-verify pending order against Cashfree Production Gateway
    if (order.paymentStatus !== "completed") {
      try {
        const cfResult = await getCashfreeOrder(order.id);
        if (cfResult.success && cfResult.isPaid) {
          order = {
            ...order,
            paymentStatus: "completed",
            paymentMethod: "Online (UPI / Card)",
            canvaAccessDelivered: true,
            deliveryNotes: `Auto-verified on customer redirect (${cfResult.cfOrderId || "PAID"})`,
          };
          await saveAdminOrder(order);

          if (isFirebaseConfigured()) {
            await Promise.allSettled([
              fsSaveOrder(order),
              rtSaveOrder(order),
            ]);
          }
          await sendOrderConfirmationEmail(order).catch(() => {});
        }
      } catch (cfErr) {
        console.warn("Cashfree status check warning:", cfErr);
      }
    }

    const publicPaymentMethod =
      order.paymentMethod?.toLowerCase() === "cashfree"
        ? "Online (UPI / Card)"
        : order.paymentMethod || "Online (UPI / Card)";

    const isPaid = order.paymentStatus === "completed";

    // Return sanitized customer order record (omit licenseKey until paid)
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
        paymentMethod: publicPaymentMethod,
        paymentStatus: order.paymentStatus,
        ...(isPaid
          ? {
              licenseKey: order.licenseKey,
              canvaAccessDelivered: order.canvaAccessDelivered,
            }
          : {
              canvaAccessDelivered: false,
            }),
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
