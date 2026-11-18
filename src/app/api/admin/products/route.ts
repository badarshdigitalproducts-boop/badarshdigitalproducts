import { NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminProducts, saveAdminProduct, deleteAdminProduct } from "@/lib/admin/store";

function isAuthorized(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  return verifySessionToken(match ? match[1] : undefined);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await getAdminProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.title) {
      return NextResponse.json({ error: "Product title is required" }, { status: 400 });
    }

    const saved = await saveAdminProduct(data);
    return NextResponse.json({ success: true, product: saved });
  } catch (error) {
    console.error("Save Product error:", error);
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
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const success = await deleteAdminProduct(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Delete Product error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

