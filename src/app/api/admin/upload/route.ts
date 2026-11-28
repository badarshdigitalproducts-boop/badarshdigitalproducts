import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin/auth";
import { getDatabase, saveDatabase } from "@/lib/admin/store";

export const maxDuration = 60;

const ALLOWED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".pdf",
  ".mp3",
  ".wav",
  ".mp4",
  ".zip",
  ".dng",
  ".json",
]);

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "audio/mpeg",
  "audio/wav",
  "audio/mp3",
  "audio/x-wav",
  "video/mp4",
  "application/zip",
  "application/x-zip-compressed",
  "image/x-adobe-dng",
  "application/json",
]);

const DANGEROUS_EXTENSIONS = new Set([
  ".html",
  ".htm",
  ".svg",
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".php",
  ".js",
  ".mjs",
  ".ts",
  ".jsp",
  ".asp",
  ".cgi",
  ".vbs",
  ".scr",
]);

function isAuthorized(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  return verifySessionToken(match ? match[1] : undefined, request.headers.get("user-agent") || undefined);
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

    // STRICT FILE VALIDATION
    const originalName = file.name || "asset";
    const ext = path.extname(originalName).toLowerCase();
    const mime = (file.type || "").toLowerCase().trim();

    if (DANGEROUS_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `Executable and script files (${ext}) are prohibited for security reasons.` },
        { status: 400 }
      );
    }

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        {
          error: `File type "${ext}" is not supported. Allowed formats: PNG, JPG, WEBP, PDF, MP3, WAV, MP4, ZIP, DNG.`,
        },
        { status: 400 }
      );
    }

    if (mime && !ALLOWED_MIME_TYPES.has(mime) && mime !== "application/octet-stream") {
      return NextResponse.json(
        { error: `MIME type "${mime}" does not match allowed media profiles.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create clean path
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
      const safeMime = mime || "application/octet-stream";
      publicUrl = `data:${safeMime};base64,${buffer.toString("base64")}`;
    }

    // Log admin action to audit logs
    try {
      const db = await getDatabase();
      if (!db.auditLogs) db.auditLogs = [];
      db.auditLogs.unshift({
        id: `audit-${Date.now().toString(36)}-${crypto.randomBytes(2).toString("hex")}`,
        action: "ADMIN_FILE_UPLOAD",
        details: JSON.stringify({
          filename,
          originalName,
          size: file.size,
          mimeType: mime,
        }),
        timestamp: new Date().toISOString(),
      });
      await saveDatabase(db);
    } catch (auditErr) {
      console.warn("Audit log recording error:", auditErr);
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
