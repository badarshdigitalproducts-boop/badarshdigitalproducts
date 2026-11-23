import { NextRequest, NextResponse } from "next/server";
import { getDatabase, saveDatabase } from "@/lib/admin/store";
import { fsDeleteSubscriber } from "@/lib/firebase/db";
import { rtDeleteSubscriber } from "@/lib/firebase/rtdb";
import { sanitizeEmail } from "@/lib/security/sanitize";

export const dynamic = "force-dynamic";

/**
 * GET or POST /api/newsletter/unsubscribe
 * Implements CAN-SPAM Act & India IT Act 1-click unsubscribe.
 */
export async function GET(request: NextRequest) {
  const emailParam = request.nextUrl.searchParams.get("email");
  const email = sanitizeEmail(emailParam);

  if (!email) {
    const redirectUrl = new URL("/unsubscribe", request.url);
    redirectUrl.searchParams.set("error", "missing_email");
    return NextResponse.redirect(redirectUrl);
  }

  await performUnsubscribe(email);

  const redirectUrl = new URL("/unsubscribe", request.url);
  redirectUrl.searchParams.set("success", "true");
  redirectUrl.searchParams.set("email", email);
  return NextResponse.redirect(redirectUrl);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = sanitizeEmail(body.email);

    if (!email) {
      return NextResponse.json(
        { error: "A valid email address is required to unsubscribe." },
        { status: 400 }
      );
    }

    const removed = await performUnsubscribe(email);

    return NextResponse.json({
      success: true,
      message: "You have been successfully unsubscribed from the BADARSH newsletter.",
      removed,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to process unsubscribe request: " + error.message },
      { status: 500 }
    );
  }
}

async function performUnsubscribe(email: string): Promise<boolean> {
  const normalized = email.toLowerCase().trim();
  const db = await getDatabase();
  const initialCount = db.subscribers.length;

  const matching = db.subscribers.filter((s) => s.email.toLowerCase().trim() === normalized);
  db.subscribers = db.subscribers.filter((s) => s.email.toLowerCase().trim() !== normalized);

  if (db.subscribers.length !== initialCount) {
    await saveDatabase(db);
    for (const sub of matching) {
      fsDeleteSubscriber(sub.id).catch(() => {});
      rtDeleteSubscriber(sub.id).catch(() => {});
    }
    return true;
  }

  return false;
}
