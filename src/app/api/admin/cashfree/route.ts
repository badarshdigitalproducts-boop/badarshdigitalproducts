import { NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin/auth";
import { testCashfreeConnection, getCashfreeCredentials, getMaskedCashfreeCredentials } from "@/lib/cashfree";

function isAuthorized(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  return verifySessionToken(match ? match[1] : undefined);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const masked = await getMaskedCashfreeCredentials();
  return NextResponse.json(masked);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const creds = await getCashfreeCredentials();

    // Prioritize credentials from request or fallback to server env credentials
    const appId = body.appId?.includes("••••") || !body.appId ? creds.appId : body.appId;
    const secretKey = body.secretKey?.includes("••••") || !body.secretKey ? creds.secretKey : body.secretKey;
    const env = body.env || creds.env || "PROD";

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
