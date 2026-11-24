import { NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminBlogPosts, saveAdminBlogPost, deleteAdminBlogPost } from "@/lib/admin/store";

function isAuthorized(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  return verifySessionToken(match ? match[1] : undefined);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const blogPosts = await getAdminBlogPosts();
    return NextResponse.json({ blogPosts, posts: blogPosts });
  } catch (error) {
    console.error("Get Blog error:", error);
    return NextResponse.json({ blogPosts: [], posts: [], error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.title) {
      return NextResponse.json({ error: "Article title is required" }, { status: 400 });
    }

    const saved = await saveAdminBlogPost(data);
    return NextResponse.json({ success: true, blogPost: saved });
  } catch (error) {
    console.error("Save Blog error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Article slug required" }, { status: 400 });
    }

    const success = await deleteAdminBlogPost(slug);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Delete Blog error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
