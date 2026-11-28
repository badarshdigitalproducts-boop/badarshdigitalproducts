import { NextRequest, NextResponse } from "next/server";
import { generateR2UploadUrl, isR2Configured } from "@/lib/storage/r2";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin/auth";
import path from "path";

function isAuthorized(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  return verifySessionToken(match ? match[1] : undefined, request.headers.get("user-agent") || undefined);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized. Please log in as admin." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { filename, fileType, folder = "uploads" } = body;

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const ext = path.extname(filename) || "";
    const cleanBaseName = path
      .basename(filename, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 40);

    const key = `${folder}/${cleanBaseName}-${Date.now()}${ext}`;
    const contentType = fileType || "application/octet-stream";

    const { uploadUrl, publicUrl } = await generateR2UploadUrl(key, contentType, 3600);

    return NextResponse.json({
      success: true,
      uploadUrl,
      key,
      publicUrl: publicUrl || `/api/download?key=${encodeURIComponent(key)}`,
      isR2Active: isR2Configured(),
    });
  } catch (error: any) {
    console.error("R2 Upload URL Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate pre-signed upload URL" },
      { status: 500 }
    );
  }
}
