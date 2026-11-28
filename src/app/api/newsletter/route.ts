import { NextRequest, NextResponse } from "next/server";
import { addSubscriber } from "@/lib/admin/store";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rate-limiter";
import { sanitizeText, sanitizeEmail, isHoneypotTriggered } from "@/lib/security/sanitize";
import { sendNewsletterWelcomeEmail } from "@/lib/email/resend";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // 1. Rate limiting: 5 requests per 10 minutes per IP
  const rateLimit = checkRateLimit(request, {
    maxRequests: 5,
    windowSeconds: 600,
    prefix: "newsletter",
  });
  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  try {
    const data = await request.json();

    // 2. Honeypot bot protection
    if (isHoneypotTriggered(data)) {
      return NextResponse.json(
        { error: "Submission rejected by security policy." },
        { status: 400 }
      );
    }

    const email = sanitizeEmail(data.email);
    const source = sanitizeText(data.source, 60) || "Website Footer";

    if (!email) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    // Persist subscriber directly into the BADARSH Audience Engine
    const savedSub = await addSubscriber(email, source);
    const emailResult = await sendNewsletterWelcomeEmail(email).catch(() => ({ sent: false }));

    return NextResponse.json({
      success: true,
      emailSent: emailResult.sent,
      message: emailResult.sent
        ? "Subscribed! Check your inbox for your welcome note and free creator vault."
        : "Subscribed! All free sound effects and starter creator tools are unlocked for you on BADARSH.",
      subscriberId: savedSub.id,
    });
  } catch (error: any) {
    console.error("Newsletter API error:", error?.message);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
