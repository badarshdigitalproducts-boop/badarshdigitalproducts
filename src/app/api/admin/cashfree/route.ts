import { NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin/auth";
import { testCashfreeConnection, getCashfreeCredentials } from "@/lib/cashfree";
import { updateSystemSettings, getSystemSettings } from "@/lib/admin/store";

function isAuthorized(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  return verifySessionToken(match ? match[1] : undefined);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const credentials = await getCashfreeCredentials();
  return NextResponse.json({
    configured: credentials.isConfigured,
    enabled: credentials.enabled,
    env: credentials.env,
    appIdMasked: credentials.appId
      ? `${credentials.appId.slice(0, 4)}...${credentials.appId.slice(-4)}`
      : "",
  });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { appId, secretKey, env = "TEST" } = await request.json();

    if (!appId || !secretKey) {
      return NextResponse.json(
        { error: "Cashfree App ID and Secret Key are required to test connection." },
        { status: 400 }
      );
    }

    const result = await testCashfreeConnection(appId, secretKey, env);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to test Cashfree connection" },
      { status: 500 }
    );
  }
}
