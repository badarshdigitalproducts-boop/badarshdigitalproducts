import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE_NAME = "badarsh_admin_session";
const DEFAULT_SESSION_SECRET = "badarsh_secure_hmac_session_secret_994821a8b3c4";

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || DEFAULT_SESSION_SECRET;
}

/**
 * Edge-compatible Web Crypto HMAC-SHA256 signature verification
 */
async function verifyAdminSessionEdge(token: string): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signatureB64Url] = parts;

  try {
    const secret = getSessionSecret();
    const encoder = new TextEncoder();

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const expectedSigBuffer = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      encoder.encode(payloadB64)
    );

    // Convert to base64url
    const bytes = new Uint8Array(expectedSigBuffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const expectedSigB64 = btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    if (signatureB64Url !== expectedSigB64) {
      return false;
    }

    // Decode and check expiry
    const payloadPadded = payloadB64
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(payloadB64.length + ((4 - (payloadB64.length % 4)) % 4), "=");
    const jsonStr = atob(payloadPadded);
    const payload = JSON.parse(jsonStr);

    if (payload.role !== "founder" || !payload.exp || Date.now() > payload.exp) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Force HTTPS in production
  const proto = request.headers.get("x-forwarded-proto");
  if (process.env.NODE_ENV === "production" && proto === "http") {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = "https:";
    return NextResponse.redirect(httpsUrl, 301);
  }

  // 2. Hide and protect admin pages (/admin/*)
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isValid = token ? await verifyAdminSessionEdge(token) : false;

    // Login page handling
    if (pathname === "/admin/login" || pathname === "/admin/login/") {
      if (isValid) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Protected admin pages: redirect immediately if unauthenticated
    if (!isValid) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl, 307);
    }
  }

  // 3. API CORS & Security controls
  if (pathname.startsWith("/api")) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    // Handle OPTIONS preflight requests
    if (request.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 204 });
      if (origin) {
        const isSameOrigin = origin.includes(host || "");
        if (isSameOrigin || process.env.NODE_ENV !== "production") {
          response.headers.set("Access-Control-Allow-Origin", origin);
          response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
          response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
          response.headers.set("Access-Control-Allow-Credentials", "true");
        }
      }
      return response;
    }

    const response = NextResponse.next();

    // Prevent caching on dynamic authenticated API endpoints
    if (pathname.startsWith("/api/admin") || pathname.startsWith("/api/user")) {
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|mp3|mp4|zip)$).*)",
  ],
};
