import { NextRequest, NextResponse } from "next/server";
import net from "net";
import { getAdminProducts } from "@/lib/admin/store";
import { products as fallbackProducts } from "@/content/products";

export const dynamic = "force-dynamic";

const MAX_PDF_BYTES = 15 * 1024 * 1024; // 15 MB cap

const STATIC_ALLOWED_HOSTS = new Set(["www.badarsh.com", "badarsh.com"]);

function isPrivateOrDisallowedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === "localhost" ||
    lower.endsWith(".localhost") ||
    lower.endsWith(".local") ||
    lower.endsWith(".internal")
  ) {
    return true;
  }

  // Strip IPv6 brackets if present
  const bare = lower.startsWith("[") && lower.endsWith("]") ? lower.slice(1, -1) : lower;
  if (net.isIP(bare) !== 0) {
    // Reject all raw IP addresses to block metadata/loopback/RFC1918 SSRF
    return true;
  }
  return false;
}

async function isAllowedPdfTarget(parsed: URL, rawTarget: string): Promise<boolean> {
  if (parsed.protocol !== "https:") return false;
  if (parsed.username || parsed.password) return false;
  if (parsed.port && parsed.port !== "443") return false;
  if (isPrivateOrDisallowedHost(parsed.hostname)) return false;

  const host = parsed.hostname.toLowerCase();

  // 1. First-party PDF assets on badarsh.com
  if (STATIC_ALLOWED_HOSTS.has(host)) {
    return parsed.pathname.startsWith("/downloads/") || parsed.pathname.endsWith(".pdf");
  }

  // 2. Configured Cloudflare R2 public CDN host
  const r2PublicUrl = process.env.R2_PUBLIC_URL?.trim();
  if (r2PublicUrl) {
    try {
      const r2Host = new URL(r2PublicUrl).hostname.toLowerCase();
      if (host === r2Host) {
        return true;
      }
    } catch {
      // ignore invalid R2_PUBLIC_URL
    }
  }

  // 3. Exact match against published catalog preview/download PDF URLs
  try {
    const adminProds = await getAdminProducts().catch(() => []);
    const allProducts = [...fallbackProducts, ...adminProds];
    for (const prod of allProducts) {
      if (
        prod.previewPdfUrl === rawTarget ||
        prod.pdfUrl === rawTarget ||
        prod.downloadUrl === rawTarget
      ) {
        return true;
      }
    }
  } catch {
    // Fall back to static list only
  }

  return false;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get("url")?.trim();

    if (!targetUrl) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(targetUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const allowed = await isAllowedPdfTarget(parsed, targetUrl);
    if (!allowed) {
      return NextResponse.json(
        { error: "Forbidden: URL is not an authorized catalog PDF resource" },
        { status: 403 }
      );
    }

    // Fetch upstream without following redirects so allowlist cannot be bypassed via 302
    const upstreamRes = await fetch(parsed.toString(), {
      redirect: "error",
      signal: AbortSignal.timeout(12000),
      headers: {
        "User-Agent": "BADARSH-PDF-Viewer/1.0",
        Accept: "application/pdf",
      },
    });

    if (!upstreamRes.ok) {
      return NextResponse.json(
        { error: `Upstream resource returned HTTP ${upstreamRes.status}` },
        { status: upstreamRes.status >= 400 && upstreamRes.status < 600 ? upstreamRes.status : 502 }
      );
    }

    const contentLengthHeader = upstreamRes.headers.get("content-length");
    if (contentLengthHeader) {
      const declaredSize = parseInt(contentLengthHeader, 10);
      if (Number.isFinite(declaredSize) && declaredSize > MAX_PDF_BYTES) {
        return NextResponse.json(
          { error: "PDF file exceeds maximum preview size" },
          { status: 413 }
        );
      }
    }

    const arrayBuffer = await upstreamRes.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_PDF_BYTES) {
      return NextResponse.json(
        { error: "PDF file exceeds maximum preview size" },
        { status: 413 }
      );
    }

    // Verify authentic %PDF- magic header before serving with application/pdf
    const header = Buffer.from(arrayBuffer.slice(0, 5)).toString("ascii");
    if (header !== "%PDF-") {
      return NextResponse.json(
        { error: "Upstream response is not a valid PDF document" },
        { status: 415 }
      );
    }

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="preview.pdf"',
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Content-Security-Policy": "frame-ancestors 'self'",
      },
    });
  } catch (err) {
    console.error("PDF Proxy error:", err);
    return NextResponse.json(
      { error: "Failed to load PDF document" },
      { status: 502 }
    );
  }
}
