import { NextRequest, NextResponse } from "next/server";
import { addLead } from "@/lib/admin/store";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rate-limiter";
import {
  sanitizeText,
  sanitizeEmail,
  sanitizePhone,
  isHoneypotTriggered,
  isSubmissionUnnaturallyFast,
} from "@/lib/security/sanitize";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // 1. Rate limiting: 5 requests per 10 minutes per IP
  const rateLimit = checkRateLimit(request, {
    maxRequests: 5,
    windowSeconds: 600,
    prefix: "contact",
  });
  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit.resetInSeconds);
  }

  try {
    const data = await request.json();

    // 2. Honeypot & bot timing protection
    if (isHoneypotTriggered(data) || isSubmissionUnnaturallyFast(data._renderedAt, 600)) {
      return NextResponse.json(
        { error: "Submission rejected by security policy." },
        { status: 400 }
      );
    }

    // 3. Sanitize inputs
    const name = sanitizeText(data.name, 80);
    const email = sanitizeEmail(data.email);
    const phone = sanitizePhone(data.phone);
    const interest = sanitizeText(data.interest, 60) || "General Inquiry";
    const message = sanitizeText(data.message, 2000);
    const budget = sanitizeText(data.budget, 40);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Valid name, email, and message are required" },
        { status: 400 }
      );
    }

    // Persist lead directly into the BADARSH CRM
    const savedLead = await addLead({
      name,
      email,
      phone,
      interest,
      message,
      budget,
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry received successfully. Our founder will be in touch shortly.",
      leadId: savedLead.id,
    });
  } catch (error: any) {
    console.error("Contact API error:", error?.message);
    return NextResponse.json(
      { error: "Failed to process inquiry. Please try again." },
      { status: 500 }
    );
  }
}
