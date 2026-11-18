import { NextRequest, NextResponse } from "next/server";
import { getAdminBlogPosts } from "@/lib/admin/store";
import { blogPosts as fallbackPosts } from "@/content/blog";

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category");
    const adminPosts = await getAdminBlogPosts();
    const allPosts = adminPosts && adminPosts.length > 0 ? adminPosts : fallbackPosts;
    const published = allPosts.filter((p: any) => p.status === "published" || !p.status);

    if (category && category !== "all") {
      const filtered = published.filter((p: any) => p.category === category);
      return NextResponse.json({ posts: filtered, total: filtered.length });
    }

    return NextResponse.json({ posts: published, total: published.length });
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return NextResponse.json({ posts: fallbackPosts, total: fallbackPosts.length });
  }
}
