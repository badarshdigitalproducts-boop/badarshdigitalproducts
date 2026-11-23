import { NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  requireOwnership,
} from "@/lib/auth/access-control";
import {
  findUserById,
  deleteUserAccount,
  USER_COOKIE_NAME,
} from "@/lib/auth/user-auth";
import { getAdminOrders } from "@/lib/admin/store";

export async function GET(request: Request) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await findUserById(user.uid);
    if (!account) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    // Retrieve user's own orders (strictly matching customer email)
    const allOrders = await getAdminOrders();
    const userOrders = allOrders.filter(
      (o) => o.customerEmail && o.customerEmail.toLowerCase().trim() === user.email.toLowerCase().trim()
    );

    return NextResponse.json({
      success: true,
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        photoURL: account.photoURL || null,
        provider: account.provider,
        createdAt: account.createdAt,
        lastLoginAt: account.lastLoginAt,
        dpdpConsent: account.dpdpConsent || {
          consentedAt: account.createdAt,
          version: "2023-v1",
          lawfulBasis: "explicit_consent",
        },
      },
      orders: userOrders.map((o) => ({
        id: o.id,
        items: o.items,
        totalAmount: o.totalAmount,
        currency: o.currency,
        paymentStatus: o.paymentStatus,
        licenseKey: o.licenseKey,
        createdAt: o.createdAt,
      })),
    });
  } catch (err: any) {
    console.error("User account GET error:", err);
    return NextResponse.json({ error: "Failed to retrieve account details." }, { status: 500 });
  }
}

/**
 * DELETE /api/user/account
 * Cascading Data Purge under India's Digital Personal Data Protection Act, 2023 (Section 12).
 * Permanently removes user account, anonymizes order PII, and scrubs logs.
 */
export async function DELETE(request: Request) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Active session required." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const confirmation = body.confirmation;

    // Enforce explicit affirmative confirmation
    if (confirmation !== "DELETE" && confirmation !== "DELETE MY ACCOUNT") {
      return NextResponse.json(
        {
          error:
            "Confirmation required: Please type 'DELETE' to confirm irreversible account and personal data erasure under the DPDP Act.",
        },
        { status: 400 }
      );
    }

    // Execute cascading data purge across all persistent stores
    const purgeResult = await deleteUserAccount(user.uid);

    const response = NextResponse.json({
      success: true,
      message:
        "Your account and all associated personal data have been completely erased from BADARSH in compliance with Section 12 of India's DPDP Act, 2023.",
      purgedSummary: purgeResult.purgedRecords,
    });

    // Clear active session cookie immediately
    response.cookies.set(USER_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Cascading delete error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to process cascading account deletion." },
      { status: 500 }
    );
  }
}
