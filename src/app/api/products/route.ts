import { NextRequest, NextResponse } from "next/server";
import { getAdminProducts } from "@/lib/admin/store";
import { products as fallbackProducts } from "@/content/products";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  try {
    const adminProducts = await getAdminProducts();
    const allProducts =
      adminProducts && adminProducts.length > 0 ? adminProducts : fallbackProducts;
    const published = allProducts.filter((p: any) => p.status === "published" || !p.status);

    if (category && category !== "all") {
      const catLower = category.toLowerCase().trim();
      const filtered = published.filter((p: any) => {
        const pCat = (p.category || "").toLowerCase().trim();
        if (pCat === catLower) return true;

        // Bundles match
        if (catLower === "bundles" || catLower === "bundle") {
          return (
            pCat === "bundles" ||
            pCat === "bundle" ||
            pCat === "editing-bundle" ||
            p.tags?.some((t: string) => t.toLowerCase().includes("bundle"))
          );
        }

        // Apps match
        if (catLower === "editing-apps" || catLower === "apps" || catLower === "app") {
          return (
            pCat === "editing-apps" ||
            pCat === "apps" ||
            pCat === "app" ||
            p.tags?.some((t: string) =>
              ["app", "editing apps", "editing app", "mobile creator", "capcut"].includes(
                t.toLowerCase()
              )
            )
          );
        }

        // Photo Presets match
        if (catLower === "photo-presets" || catLower === "presets" || catLower === "preset") {
          return (
            pCat === "photo-presets" ||
            pCat === "presets" ||
            pCat === "preset" ||
            p.tags?.some((t: string) =>
              ["preset", "presets", "lightroom", "dng", "photo"].includes(t.toLowerCase())
            )
          );
        }

        // Sound Effects & BG Music match
        if (
          catLower === "editing-bundles" ||
          catLower === "sound-effects" ||
          catLower === "sfx" ||
          catLower === "audio"
        ) {
          return (
            pCat === "editing-bundles" ||
            pCat === "sound-effects" ||
            p.tags?.some((t: string) =>
              ["sfx", "sound", "bg music", "music", "audio", "overlays", "transitions"].includes(
                t.toLowerCase()
              )
            )
          );
        }

        // E-Books match
        if (catLower === "ebooks" || catLower === "ebook") {
          return (
            pCat === "ebooks" ||
            pCat === "ebook" ||
            p.tags?.some((t: string) =>
              ["ebook", "book", "guide", "pdf"].includes(t.toLowerCase())
            )
          );
        }

        // Planners match
        if (catLower === "planners" || catLower === "planner") {
          return (
            pCat === "planners" ||
            pCat === "planner" ||
            p.tags?.some((t: string) =>
              ["planner", "productivity", "system"].includes(t.toLowerCase())
            )
          );
        }

        // Video Templates match
        if (
          catLower === "video-templates" ||
          catLower === "video-template" ||
          catLower === "video" ||
          catLower === "alight-motion" ||
          catLower === "capcut"
        ) {
          return (
            pCat === "video-templates" ||
            (p.productType as string) === "video-template" ||
            (p.productType as any) === "video" ||
            p.tags?.some((t: string) =>
              ["video", "template", "capcut", "alight", "alight motion", "reels template", "reels"].includes(t.toLowerCase())
            )
          );
        }

        // Graphic Design Templates match
        if (
          catLower === "templates" ||
          catLower === "template" ||
          catLower === "canva-templates" ||
          catLower === "canva"
        ) {
          return (
            ["social-media", "presentations", "branding", "business-cards", "templates"].includes(pCat) ||
            p.productType === "canva-template" ||
            (p.productType as any) === "template" ||
            p.tags?.some((t: string) =>
              ["template", "canva", "social", "branding", "presentation", "instagram"].includes(t.toLowerCase())
            )
          );
        }

        return false;
      });

      return NextResponse.json({ products: filtered, total: filtered.length });
    }

    return NextResponse.json({ products: published, total: published.length });
  } catch (error: any) {
    if (error?.digest) throw error;
    console.error("Error reading products:", error);
    return NextResponse.json({ products: fallbackProducts, total: fallbackProducts.length });
  }
}
