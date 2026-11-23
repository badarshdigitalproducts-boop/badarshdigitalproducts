import { NextRequest, NextResponse } from "next/server";
import {
  createUserAccount,
  createUserSessionToken,
  USER_COOKIE_NAME,
  USER_SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/user-auth";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rate-limiter";
import { sanitizeText, sanitizeEmail, isHoneypotTriggered } from "@/lib/security/sanitize";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // Rate limit: 5 signups per 15 minutes per IP
  const rateLimit = checkRateLimit(request, {
    maxRequests: 5,
    windowSeconds: 900,
    prefix: "auth_signup",
  });
  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  try {
    const body = await request.json();

    if (isHoneypotTriggered(body)) {
      return NextResponse.json(
        { error: "Registration rejected by security policy." },
        { status: 400 }
      );
    }

    const { name, email, password, consentGiven } = body;
    const cleanName = sanitizeText(name, 80);
    const cleanEmail = sanitizeEmail(email);

    if (!cleanEmail || !password) {
      return NextResponse.json(
        { error: "A valid email and password are required." },
        { status: 400 }
      );
    }

    if (consentGiven === false) {
      return NextResponse.json(
        {
          error:
            "Statutory consent is required under India's Digital Personal Data Protection Act, 2023 (Section 6) to create an account.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const user = await createUserAccount(cleanName, cleanEmail, password, "email", undefined, true);

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
    return NextResponse.json(
      { error: error?.message || "Registration failed" },
      { status: 400 }
    );
  }
}
