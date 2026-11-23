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

    const body = await request.json().catch(() => ({}));
    const passphrase = body.passphrase;

    if (!passphrase || typeof passphrase !== "string" || !passphrase.trim()) {
      return NextResponse.json(
        { error: "Master founder security key is required." },
        { status: 400 }
      );
    }

    // 1. Verify credentials with constant-time cryptographic check
    const isValid = verifyAdminPassphrase(passphrase);

    if (isValid) {
      // Valid credentials: reset any prior failed attempts and grant access
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
    }

    // 2. Invalid credentials: track failed attempt and apply strike limit
    recordFailedAttempt(ip);
    const updatedCheck = checkRateLimit(ip);

    await addAuditLog(
      "Z_PLUS_AUTH_FAILED",
      `Unauthorized admin access attempt from IP ${ip}. Strikes remaining: ${updatedCheck.remainingAttempts}`
    ).catch(() => {});

    // Artificial 500ms delay to thwart automated high-speed brute force scripts
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(
      {
        error: "Z+ Security Verification Failed. Invalid master founder credentials.",
        remainingAttempts: updatedCheck.remainingAttempts,
        locked: !updatedCheck.allowed,
        retryAfterSeconds: updatedCheck.retryAfterSeconds,
      },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Admin Auth Error:", error?.message);
    return NextResponse.json(
      { error: "Authentication processing failure. Please retry." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authenticated = verifySessionToken(token);
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
