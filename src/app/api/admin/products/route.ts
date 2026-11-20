import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminProducts, saveAdminProduct, deleteAdminProduct } from "@/lib/admin/store";

function isAuthorized(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  return verifySessionToken(match ? match[1] : undefined);
}

function revalidateCatalog(slug?: string) {
  try {
    revalidatePath("/templates");
    revalidatePath("/bundles");
    revalidatePath("/editing-apps");
    revalidatePath("/photo-presets");
    revalidatePath("/editing-bundles");
    revalidatePath("/ebooks");
    revalidatePath("/planners");
    if (slug) {
      revalidatePath(`/templates/${slug}`);
      revalidatePath(`/ebooks/${slug}`);
    }
  } catch (err) {
    // Non-blocking in background
  }
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
    revalidateCatalog(saved.slug);

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
    revalidateCatalog();

    return NextResponse.json({ success });
  } catch (error) {
    console.error("Delete Product error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
