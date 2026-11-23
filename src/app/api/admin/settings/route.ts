import { NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin/auth";
import { getSystemSettings, updateSystemSettings } from "@/lib/admin/store";

function isAuthorized(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  return verifySessionToken(match ? match[1] : undefined);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getSystemSettings();

  // Security Hardening: Never expose raw Cashfree Secret Key to admin frontend
  const isEnvConfigured = Boolean(
    process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY
  );
  const activeAppId = process.env.CASHFREE_APP_ID || settings.cashfree?.appId || "";

  const sanitizedSettings = {
    ...settings,
    cashfree: {
      enabled: settings.cashfree?.enabled ?? true,
      env: process.env.CASHFREE_ENV || settings.cashfree?.env || "PROD",
      isEnvConfigured,
      appId: activeAppId
        ? `${activeAppId.slice(0, 4)}••••••••${activeAppId.slice(-4)}`
        : "",
      secretKey: "", // Strictly omitted from API output
      secretKeyConfigured: Boolean(
        process.env.CASHFREE_SECRET_KEY || settings.cashfree?.secretKey
      ),
    },
  };

  return NextResponse.json({ settings: sanitizedSettings });
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updates = await request.json();

    // Prevent storing masked placeholders in database
    if (updates.cashfree) {
      if (
        updates.cashfree.appId?.includes("••••") ||
        updates.cashfree.appId === ""
      ) {
        delete updates.cashfree.appId;
      }
      if (
        updates.cashfree.secretKey?.includes("••••") ||
        updates.cashfree.secretKey === ""
      ) {
        delete updates.cashfree.secretKey;
      }
    }

    const updated = await updateSystemSettings(updates);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Update Settings error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
