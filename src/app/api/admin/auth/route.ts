import { NextResponse } from "next/server";
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

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Locked for security. Try again in ${rateCheck.retryAfterSeconds}s.`,
        },
        { status: 429 }
      );
    }

    const { passphrase } = await request.json();

    if (!passphrase) {
      return NextResponse.json({ error: "Passphrase is required" }, { status: 400 });
    }

    const isValid = verifyAdminPassphrase(passphrase);

    if (!isValid) {
      recordFailedAttempt(ip);
      const updatedCheck = checkRateLimit(ip);
      return NextResponse.json(
        {
          error: "Invalid admin passphrase. Access denied.",
          remainingAttempts: updatedCheck.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Success: reset rate limit & issue secure HttpOnly cookie
    resetRateLimit(ip);
    const token = createSessionToken();

    const response = NextResponse.json({
      success: true,
      message: "Founder authentication successful",
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
  } catch (error) {
    console.error("Admin Auth Error:", error);
    return NextResponse.json({ error: "Authentication internal error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  const token = match ? match[1] : undefined;

  const authenticated = verifySessionToken(token);
  return NextResponse.json({ authenticated });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
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
