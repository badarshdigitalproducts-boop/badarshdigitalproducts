import { NextRequest, NextResponse } from "next/server";
import { getAdminProducts } from "@/lib/admin/store";
import { products as fallbackProducts } from "@/content/products";

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category");
    const adminProducts = await getAdminProducts();

    const allProducts = adminProducts && adminProducts.length > 0 ? adminProducts : fallbackProducts;
    const published = allProducts.filter((p: any) => p.status === "published" || !p.status);

    if (category && category !== "all") {
      const filtered = published.filter((p: any) => p.category === category);
      return NextResponse.json({ products: filtered, total: filtered.length });
    }

    return NextResponse.json({ products: published, total: published.length });
  } catch (error) {
    console.error("Error reading products:", error);
    return NextResponse.json({ products: fallbackProducts, total: fallbackProducts.length });
  }
}
