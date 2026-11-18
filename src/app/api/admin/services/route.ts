import { NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminServices, saveAdminService, deleteAdminService } from "@/lib/admin/store";

function isAuthorized(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  return verifySessionToken(match ? match[1] : undefined);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const services = await getAdminServices();
  return NextResponse.json({ services });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.title) {
      return NextResponse.json({ error: "Service title is required" }, { status: 400 });
    }

    const saved = await saveAdminService(data);
    return NextResponse.json({ success: true, service: saved });
  } catch (error) {
    console.error("Save Service error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Service ID required" }, { status: 400 });
    }

    const success = await deleteAdminService(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Delete Service error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
