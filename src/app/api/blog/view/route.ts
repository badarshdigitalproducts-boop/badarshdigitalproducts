import { NextResponse } from "next/server";
import { getAdminBlogPosts, saveAdminBlogPost } from "@/lib/admin/store";

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: "Article slug is required" }, { status: 400 });
    }

    const posts = await getAdminBlogPosts();
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const updatedViews = (post.views || 0) + 1;
    await saveAdminBlogPost({
      ...post,
      views: updatedViews,
    });

    return NextResponse.json({ success: true, views: updatedViews });
  } catch (error) {
    console.error("View increment error:", error);
    return NextResponse.json({ error: "Failed to increment view" }, { status: 500 });
  }
}
