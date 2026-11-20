import { NextResponse } from "next/server";
import {
  verifyUserCredentials,
  createUserSessionToken,
  USER_COOKIE_NAME,
  USER_SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/user-auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await verifyUserCredentials(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Incorrect email or password. Please verify and try again." },
        { status: 401 }
      );
    }

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
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
