import { NextResponse } from "next/server";
import {
  createUserAccount,
  createUserSessionToken,
  USER_COOKIE_NAME,
  USER_SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/user-auth";

export async function POST(request: Request) {
  try {
    const { name, email, password, consentGiven } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
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

    const user = await createUserAccount(name, email, password, "email", undefined, true);

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
