import { NextRequest, NextResponse } from "next/server";
import {
  verifyUserCredentials,
  createUserSessionToken,
  USER_COOKIE_NAME,
  USER_SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/user-auth";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rate-limiter";
import { sanitizeEmail } from "@/lib/security/sanitize";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // Rate limit: 5 login attempts per 15 minutes per IP to block credential stuffing
  const rateLimit = checkRateLimit(request, {
    maxRequests: 5,
    windowSeconds: 900,
    prefix: "auth_login",
  });
  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  try {
    const { email, password } = await request.json();
    const cleanEmail = sanitizeEmail(email);

    if (!cleanEmail || !password) {
      return NextResponse.json(
        { error: "A valid email address and password are required." },
        { status: 400 }
      );
    }

    const user = await verifyUserCredentials(cleanEmail, password);
    if (!user) {
      return NextResponse.json(
        { error: "Incorrect email or password. Please verify and try again." },
        { status: 401 }
      );
    }

    const token = createUserSessionToken({
      uid: user.id,
      email: user.email,
      displayName: user.name,
      photoURL: user.photoURL,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        uid: user.id,
        email: user.email,
        displayName: user.name,
        photoURL: user.photoURL || null,
        isDemo: false,
      },
    });

    response.cookies.set(USER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: USER_SESSION_MAX_AGE_SECONDS,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
