/**
 * Cashfree Payment Gateway Integration Helper
 * Supports production and sandbox modes.
 * When account is live in ~2 days, set CASHFREE_APP_ID & CASHFREE_SECRET_KEY in .env.local
 */

export interface CreateCashfreeOrderParams {
  orderId: string;
  orderAmount: number;
  orderCurrency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  returnUrl?: string;
}

export async function createCashfreeOrder(params: CreateCashfreeOrderParams) {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  const env = process.env.CASHFREE_ENV || "TEST"; // "TEST" or "PROD"

  if (!appId || !secretKey) {
    return {
      success: false,
      error: "Cashfree API keys are not configured yet.",
      fallbackRequired: true,
    };
  }

  const endpoint =
    env === "PROD"
      ? "https://api.cashfree.com/pg/orders"
      : "https://sandbox.cashfree.com/pg/orders";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: params.orderId,
        order_amount: params.orderAmount,
        order_currency: params.orderCurrency || "INR",
        customer_details: {
          customer_id: `cust_${Date.now()}`,
          customer_name: params.customerName,
          customer_email: params.customerEmail,
          customer_phone: params.customerPhone || "9999999999",
        },
        order_meta: {
          return_url: params.returnUrl || `${process.env.NEXT_PUBLIC_SITE_URL || "https://badarsh.vercel.app"}/order-success?order_id={order_id}`,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to create Cashfree payment session.",
        fallbackRequired: true,
      };
    }

    return {
      success: true,
      paymentSessionId: data.payment_session_id,
      orderId: data.order_id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Network error communicating with Cashfree.",
      fallbackRequired: true,
    };
  }
}
