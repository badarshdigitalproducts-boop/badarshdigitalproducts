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
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updates = await request.json();
    const updated = await updateSystemSettings(updates);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Update Settings error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

