import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPassphrase,
  createSessionToken,
  verifySessionToken,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  ADMIN_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/admin/auth";
import { addAuditLog } from "@/lib/admin/store";
import { getClientIp } from "@/lib/security/rate-limiter";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "unknown";

    // 1. Z+ Brute-Force Rate Limit & Automatic Lockout Check
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      await addAuditLog(
        "Z_PLUS_IP_LOCKOUT_TRIGGERED",
        `Brute force defense locked IP ${ip} for ${rateCheck.retryAfterSeconds}s`
      ).catch(() => {});

      return NextResponse.json(
        {
          error: `[Z+ SECURITY LOCKOUT] Maximum verification attempts exceeded. IP address temporarily blocked for security. Try again in ${rateCheck.retryAfterSeconds} seconds.`,
          locked: true,
          retryAfterSeconds: rateCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": (rateCheck.retryAfterSeconds || 1800).toString(),
          },
        }
      );
    }

    const { passphrase } = await request.json();

    if (!passphrase || typeof passphrase !== "string") {
      return NextResponse.json(
        { error: "Master founder security key is required." },
        { status: 400 }
      );
    }

    // 2. Cryptographic PBKDF2 100,000-iteration constant-time key verification
    const isValid = verifyAdminPassphrase(passphrase);

    if (!isValid) {
      recordFailedAttempt(ip);
      const updatedCheck = checkRateLimit(ip);

      await addAuditLog(
        "Z_PLUS_AUTH_FAILED",
        `Unauthorized admin access attempt with invalid master key from IP ${ip} (${userAgent}). Strikes remaining: ${updatedCheck.remainingAttempts}`
      ).catch(() => {});

      // Add 600ms artificial micro-delay to eliminate any external timing side-channels
      await new Promise((resolve) => setTimeout(resolve, 600));

      return NextResponse.json(
        {
          error: "Z+ Security Verification Failed. Invalid master founder credentials.",
          remainingAttempts: updatedCheck.remainingAttempts,
          locked: !updatedCheck.allowed,
        },
        { status: 401 }
      );
    }

    // 3. Authentication Success: Reset rate limits, log audit trail, issue bound HMAC session
    resetRateLimit(ip);
    const token = createSessionToken(ip, userAgent);

    await addAuditLog(
      "Z_PLUS_FOUNDER_AUTHENTICATED",
      `Authorized Founder Master Access granted from IP ${ip}`
    ).catch(() => {});

    const response = NextResponse.json({
      success: true,
      message: "Z+ Founder Master Authorization Verified. Welcome Commander.",
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error: any) {
    console.error("Admin Auth Error:", error?.message);
    return NextResponse.json(
      { error: "Internal authentication vault failure. Please retry." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") || "unknown";

  const authenticated = verifySessionToken(token, ip, userAgent);
  return NextResponse.json({ authenticated });
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Founder session safely terminated.",
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
