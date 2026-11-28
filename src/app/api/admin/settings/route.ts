import { NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin/auth";
import { getSystemSettings, updateSystemSettings } from "@/lib/admin/store";

function isAuthorized(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  return verifySessionToken(match ? match[1] : undefined, request.headers.get("user-agent") || undefined);
}

function sanitizeSettings(settings: any) {
  const isEnvConfigured = Boolean(
    process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY
  );
  const activeAppId = process.env.CASHFREE_APP_ID || settings.cashfree?.appId || "";

  return {
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
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getSystemSettings();
    return NextResponse.json({ settings: sanitizeSettings(settings) });
  } catch (error) {
    console.error("Get Settings error:", error);
    return NextResponse.json({ settings: null, error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updates = await request.json();

    // Prevent storing raw secret keys or masked placeholders in database
    if (updates.cashfree) {
      delete updates.cashfree.secretKey;
      if (
        updates.cashfree.appId?.includes("••••") ||
        updates.cashfree.appId === ""
      ) {
        delete updates.cashfree.appId;
      }
    }

    const updated = await updateSystemSettings(updates);
    return NextResponse.json({ success: true, settings: sanitizeSettings(updated) });
  } catch (error) {
    console.error("Update Settings error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
