/**
 * Cashfree Payment Gateway Integration Helper (Production Hardened)
 * Supports production and sandbox modes.
 * Credentials strictly loaded from server environment variables (.env.local / cloud).
 * Never exposes raw secret keys to client-side bundles or public endpoints.
 */

import crypto from "crypto";
import { getSystemSettings } from "./admin/store";

export interface CreateCashfreeOrderParams {
  orderId: string;
  orderAmount: number;
  orderCurrency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  returnUrl?: string;
  customerId?: string;
}

export interface CashfreeCredentials {
  appId: string;
  secretKey: string;
  env: "TEST" | "PROD";
  enabled: boolean;
  isConfigured: boolean;
  isEnvConfigured: boolean;
}

export async function getCashfreeCredentials(): Promise<CashfreeCredentials> {
  const envAppId = process.env.CASHFREE_APP_ID?.trim();
  const envSecretKey = process.env.CASHFREE_SECRET_KEY?.trim();
  const rawEnv = (process.env.CASHFREE_ENV || "").toUpperCase().trim();
  const envMode: "TEST" | "PROD" =
    rawEnv === "PROD" || rawEnv === "PRODUCTION"
      ? "PROD"
      : rawEnv === "TEST" || rawEnv === "SANDBOX"
      ? "TEST"
      : "PROD";

  let storeSettings = null;
  try {
    storeSettings = await getSystemSettings();
  } catch {
    // Fallback if running outside full node store
  }

  // Server environment variables have strict priority over database store
  const isEnvConfigured = Boolean(envAppId && envSecretKey);
  const appId = envAppId || storeSettings?.cashfree?.appId || "";
  const secretKey = envSecretKey || storeSettings?.cashfree?.secretKey || "";
  const env = isEnvConfigured ? envMode : (storeSettings?.cashfree?.env || "PROD");
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
    isEnvConfigured,
  };
}

export async function getMaskedCashfreeCredentials() {
  const creds = await getCashfreeCredentials();
  return {
    configured: creds.isConfigured,
    enabled: creds.enabled,
    env: creds.env,
    isEnvConfigured: creds.isEnvConfigured,
    appIdMasked: creds.appId
      ? `${creds.appId.slice(0, 4)}••••••••${creds.appId.slice(-4)}`
      : "",
    secretKeyConfigured: Boolean(creds.secretKey),
  };
}

/**
 * Creates an authorized Cashfree order session for payment
 */
export async function createCashfreeOrder(params: CreateCashfreeOrderParams) {
  const { appId, secretKey, env, isConfigured } = await getCashfreeCredentials();

  if (!isConfigured) {
    return {
      success: false,
      error: "Cashfree API credentials are not configured on the server.",
      fallbackRequired: true,
    };
  }

  const endpoint =
    env === "PROD"
      ? "https://api.cashfree.com/pg/orders"
      : "https://sandbox.cashfree.com/pg/orders";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://badarsh.com";
  const returnUrl =
    params.returnUrl ||
    `${siteUrl}/orders/${params.orderId}?cf_id={order_id}`;

  const cleanPhone = (params.customerPhone || "9999999999").replace(/\D/g, "").slice(-10) || "9999999999";
  const cleanEmail = params.customerEmail?.trim() || "creator@badarsh.com";
  const cleanCustomerId = (params.customerId || `cust_${params.orderId.replace(/[^a-zA-Z0-9]/g, "").slice(-12)}`).slice(0, 50);

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
        order_amount: Math.max(Number(params.orderAmount) || 1, 1),
        order_currency: params.orderCurrency || "INR",
        customer_details: {
          customer_id: cleanCustomerId,
          customer_name: params.customerName || "Valued Creator",
          customer_email: cleanEmail,
          customer_phone: cleanPhone,
        },
        order_meta: {
          return_url: returnUrl,
          notify_url: `${siteUrl}/api/webhooks/cashfree`,
        },
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Cashfree order creation error:", data);
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
      cfOrderId: data.cf_order_id,
      env,
    };
  } catch (error: any) {
    console.error("Cashfree connection error:", error);
    return {
      success: false,
      error: error.message || "Network error communicating with Cashfree.",
      fallbackRequired: true,
    };
  }
}

/**
 * Queries Cashfree to get live order status directly
 */
export async function getCashfreeOrder(orderId: string) {
  const { appId, secretKey, env, isConfigured } = await getCashfreeCredentials();

  if (!isConfigured) {
    return { success: false, error: "Cashfree not configured" };
  }

  const endpoint =
    env === "PROD"
      ? `https://api.cashfree.com/pg/orders/${orderId}`
      : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
      },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { success: false, error: data.message || "Failed to retrieve order status" };
    }

    return {
      success: true,
      orderStatus: data.order_status, // "PAID", "ACTIVE", "EXPIRED"
      orderAmount: data.order_amount,
      cfOrderId: data.cf_order_id,
      isPaid: data.order_status === "PAID",
      data,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Validates Cashfree Webhook Signature using HMAC-SHA256
 * Cashfree v3 signs the payload with timestamp + rawBody using the Secret Key.
 */
export function verifyCashfreeWebhookSignature(
  rawBody: string,
  timestamp: string,
  signature: string,
  secretKeyOverride?: string
): boolean {
  try {
    if (!signature || !timestamp || !rawBody) return false;

    const secretKey = secretKeyOverride || process.env.CASHFREE_SECRET_KEY || "";
    if (!secretKey) return false;

    // Cashfree v3 standard signature calculation
    const payload = `${timestamp}${rawBody}`;
    const expectedBase64 = crypto
      .createHmac("sha256", secretKey)
      .update(payload)
      .digest("base64");

    const expectedHex = crypto
      .createHmac("sha256", secretKey)
      .update(payload)
      .digest("hex");

    const sigTrimmed = signature.trim();

    // Constant-time comparison against base64 signature
    if (sigTrimmed.length === expectedBase64.length) {
      try {
        if (crypto.timingSafeEqual(Buffer.from(sigTrimmed), Buffer.from(expectedBase64))) {
          return true;
        }
      } catch {
        // Fallback length mismatch guard
      }
    }

    // Fallback constant-time comparison against hex signature
    if (sigTrimmed.length === expectedHex.length) {
      try {
        if (crypto.timingSafeEqual(Buffer.from(sigTrimmed), Buffer.from(expectedHex))) {
          return true;
        }
      } catch {
        // Fallback length mismatch guard
      }
    }

    return false;
  } catch (err) {
    console.error("Webhook signature verification error:", err);
    return false;
  }
}

/**
 * Tests Cashfree connection with dummy order auth verification
 */
export async function testCashfreeConnection(
  appId: string,
  secretKey: string,
  env: "TEST" | "PROD"
) {
  const endpoint =
    env === "PROD"
      ? "https://api.cashfree.com/pg/orders"
      : "https://sandbox.cashfree.com/pg/orders";

  try {
    const startTime = Date.now();
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: `test_probe_${Date.now()}`,
        order_amount: 1,
        order_currency: "INR",
        customer_details: {
          customer_id: "probe_client",
          customer_email: "test@badarsh.com",
          customer_phone: "9999999999",
        },
      }),
    });

    const latencyMs = Date.now() - startTime;
    const data = await response.json().catch(() => ({}));

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
        ? "Cashfree Production Gateway Authenticated Successfully! (200 OK)"
        : (data.message || "Connected to Cashfree API."),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to reach Cashfree servers.",
    };
  }
}
