import { NextRequest, NextResponse } from "next/server";
import { verifyCashfreeWebhookSignature } from "@/lib/cashfree";
import { getAdminOrders, saveAdminOrder } from "@/lib/admin/store";
import { fsSaveOrder, rtSaveOrder, isFirebaseConfigured } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const timestamp = request.headers.get("x-webhook-timestamp") || "";
    const signature = request.headers.get("x-webhook-signature") || "";
    const rawBody = await request.text();

    if (!timestamp || !signature || !rawBody) {
      return NextResponse.json(
        { error: "Missing webhook signature or payload." },
        { status: 400 }
      );
    }

    // Cryptographic signature check using Cashfree Secret Key
    const isValid = verifyCashfreeWebhookSignature(rawBody, timestamp, signature);
    if (!isValid) {
      console.warn("Invalid Cashfree webhook signature received:", { timestamp });
      return NextResponse.json(
        { error: "Unauthorized: Invalid webhook signature." },
        { status: 401 }
      );
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const eventType = payload.type;
    const orderData = payload.data?.order || payload.order;
    const paymentData = payload.data?.payment || payload.payment;
    const orderId = orderData?.order_id;
    const paymentStatus = paymentData?.payment_status;

    if (!orderId) {
      return NextResponse.json({ error: "Missing order_id in webhook" }, { status: 400 });
    }

    const isSuccess =
      paymentStatus === "SUCCESS" ||
      eventType === "ORDER_PAID" ||
      eventType === "PAYMENT_SUCCESS_WEBHOOK";

    if (isSuccess) {
      const orders = await getAdminOrders();
      const existingOrder = orders.find(
        (o) => o.id.toLowerCase() === orderId.toLowerCase()
      );

      if (existingOrder) {
        const cfPaymentId = paymentData?.cf_payment_id || `CF-${Date.now()}`;
        const updatedOrder = {
          ...existingOrder,
          paymentStatus: "completed" as const,
          paymentMethod: "Cashfree",
          canvaAccessDelivered: true,
          deliveryNotes: `Auto-verified via Cashfree Webhook [Payment ID: ${cfPaymentId}] on ${new Date().toISOString()}`,
        };

        await saveAdminOrder(updatedOrder);

        // Synchronize to Firebase cloud database if active
        if (isFirebaseConfigured()) {
          await Promise.allSettled([
            fsSaveOrder(updatedOrder),
            rtSaveOrder(updatedOrder),
          ]);
        }

        console.log(`Cashfree Webhook: Order #${orderId} marked as COMPLETED.`);
        return NextResponse.json({
          received: true,
          status: "completed",
          orderId,
        });
      } else {
        console.warn(`Cashfree Webhook: Order #${orderId} not found in database.`);
        return NextResponse.json(
          { received: true, note: "Order record not found" },
          { status: 200 }
        );
      }
    }

    return NextResponse.json({ received: true, event: eventType });
  } catch (err: any) {
    console.error("Cashfree webhook processing error:", err);
    return NextResponse.json(
      { error: "Internal webhook processing error" },
      { status: 500 }
    );
  }
}
