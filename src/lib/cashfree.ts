/**
 * Cashfree Payment Gateway Integration Helper
 * Supports production and sandbox modes.
 * Managed directly via /admin/settings or environment variables (.env.local / Vercel).
 */

import { getSystemSettings } from "./admin/store";

export interface CreateCashfreeOrderParams {
  orderId: string;
  orderAmount: number;
  orderCurrency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  returnUrl?: string;
}

export async function getCashfreeCredentials() {
  const envAppId = process.env.CASHFREE_APP_ID;
  const envSecretKey = process.env.CASHFREE_SECRET_KEY;
  const envMode = (process.env.CASHFREE_ENV as "TEST" | "PROD") || undefined;

  let storeSettings = null;
  try {
    storeSettings = await getSystemSettings();
  } catch {
    // Fallback if running outside full node store
  }

  const appId = envAppId || storeSettings?.cashfree?.appId || "";
  const secretKey = envSecretKey || storeSettings?.cashfree?.secretKey || "";
  const env = envMode || storeSettings?.cashfree?.env || "TEST";
  const enabled =
    storeSettings?.cashfree?.enabled !== undefined
      ? storeSettings.cashfree.enabled
      : Boolean(appId && secretKey);

  return {
    appId,
    secretKey,
    env,
    enabled,
    isConfigured: Boolean(appId && secretKey),
  };
}

export async function createCashfreeOrder(params: CreateCashfreeOrderParams) {
  const { appId, secretKey, env, isConfigured } = await getCashfreeCredentials();

  if (!isConfigured) {
    return {
      success: false,
      error: "Cashfree API keys are under review / not configured yet.",
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
          return_url:
            params.returnUrl ||
            `${process.env.NEXT_PUBLIC_SITE_URL || "https://badarsh.com"}/orders/{order_id}`,
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

export async function testCashfreeConnection(appId: string, secretKey: string, env: "TEST" | "PROD") {
  const endpoint =
    env === "PROD"
      ? "https://api.cashfree.com/pg/orders"
      : "https://sandbox.cashfree.com/pg/orders";

  try {
    const startTime = Date.now();
    // Test auth by hitting orders endpoint with a dummy test payload that verifies authentication
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: `test_ping_${Date.now()}`,
        order_amount: 1,
        order_currency: "INR",
        customer_details: {
          customer_id: "test_probe",
          customer_email: "test@badarsh.com",
          customer_phone: "9999999999",
        },
      }),
    });

    const latencyMs = Date.now() - startTime;
    const data = await response.json().catch(() => ({}));

    // If 401/403: auth failure. If 200/201 or even order_id created or duplicate: auth succeeded!
    if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        latencyMs,
        error: data.message || "Invalid Cashfree Client ID or Secret Key.",
      };
    }

    return {
      success: true,
      latencyMs,
      env,
      message: response.ok
        ? "Cashfree API credentials authenticated successfully!"
        : (data.message || "Connected to Cashfree API."),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to reach Cashfree servers.",
    };
  }
}
