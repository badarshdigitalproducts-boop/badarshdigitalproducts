import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin/auth";

export const maxDuration = 60;

function isAuthorized(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  return verifySessionToken(match ? match[1] : undefined);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized. Please log in to admin." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided for upload" }, { status: 400 });
    }

    const fileSizeMb = file.size / (1024 * 1024);

    // Vercel serverless functions have a strict 4.5MB request payload limit
    if (file.size > 4.5 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: `File is ${fileSizeMb.toFixed(1)} MB, which exceeds the direct serverless upload limit (4.5 MB). For large E-Books, Planners, or Bundles, please paste a Google Drive link (recommended for digital downloads).`,
        },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create clean path
    const originalName = file.name || "asset";
    const ext = path.extname(originalName) || "";
    const cleanBaseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 50);

    const filename = `${cleanBaseName}-${Date.now()}${ext}`;

    let publicUrl = "";

    // In local development or persistent server, write to public/uploads
    // On Vercel / Cloudflare edge runtime, gracefully fallback to base64 Data URL
    try {
      const cwd = typeof process !== "undefined" && typeof process.cwd === "function" ? process.cwd() : "";
      if (cwd) {
        const uploadDir = path.join(cwd, "public", "uploads");
        await mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);
        publicUrl = `/uploads/${filename}`;
      } else {
        throw new Error("No filesystem available in edge isolate");
      }
    } catch (fsErr: any) {
      console.warn("Local filesystem write skipped (serverless/edge environment), encoding as Data URL:", fsErr?.message);
      const mime = file.type || "application/octet-stream";
      publicUrl = `data:${mime};base64,${buffer.toString("base64")}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: originalName,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error: any) {
    console.error("Admin upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process file upload. Please paste a Google Drive link instead." },
      { status: 500 }
    );
  }
}
