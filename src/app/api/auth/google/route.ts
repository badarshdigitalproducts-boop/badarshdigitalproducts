import { NextResponse } from "next/server";
import {
  upsertGoogleUser,
  createUserSessionToken,
  USER_COOKIE_NAME,
  USER_SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/user-auth";
import { firebaseConfig } from "@/lib/firebase/config";

interface FirebaseLookupUser {
  localId?: string;
  email?: string;
  emailVerified?: boolean;
  displayName?: string;
  photoUrl?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken, name, photoURL } = body || {};

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "Verified Google authentication token is required." },
        { status: 401 }
      );
    }

    // Cryptographically verify Firebase Auth ID token via Identity Toolkit lookup
    const verifyRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseConfig.apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        cache: "no-store",
      }
    );

    if (!verifyRes.ok) {
      return NextResponse.json(
        { error: "Invalid or expired Google sign-in token. Please try again." },
        { status: 401 }
      );
    }

    const verifyData = (await verifyRes.json()) as { users?: FirebaseLookupUser[] };
    const verifiedUser = verifyData?.users?.[0];

    if (!verifiedUser?.email) {
      return NextResponse.json(
        { error: "Could not verify Google account email." },
        { status: 401 }
      );
    }

    const verifiedEmail = verifiedUser.email.toLowerCase().trim();
    const resolvedName = verifiedUser.displayName || name || verifiedEmail.split("@")[0];
    const resolvedPhoto = verifiedUser.photoUrl || photoURL || undefined;

    const user = await upsertGoogleUser(verifiedEmail, resolvedName, resolvedPhoto);

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
      { error: error?.message || "Google authentication failed" },
      { status: 500 }
    );
  }
}
