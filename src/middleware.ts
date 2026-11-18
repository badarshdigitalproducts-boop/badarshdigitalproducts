import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("badarsh_admin_session")?.value;

    // Check if valid token structure & not expired
    let isValidSession = false;
    if (sessionCookie && sessionCookie.includes(".")) {
      try {
        const [payloadB64] = sessionCookie.split(".");
        // Decode base64url payload
        const decoded = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
        const payload = JSON.parse(decoded);
        if (payload.role === "founder" && payload.exp && Date.now() < payload.exp) {
          isValidSession = true;
        }
      } catch {
        isValidSession = false;
      }
    }

    // 1. If trying to access /admin/login while already authenticated -> redirect to dashboard
    if (pathname === "/admin/login") {
      if (isValidSession) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // 2. If trying to access protected /admin routes without valid session -> redirect to login
    if (!isValidSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

