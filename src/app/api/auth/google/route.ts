import { NextResponse } from "next/server";
import {
  upsertGoogleUser,
  createUserSessionToken,
  USER_COOKIE_NAME,
  USER_SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/user-auth";

export async function POST(request: Request) {
  try {
    const { email, name, photoURL } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Google account email is required." },
        { status: 400 }
      );
    }

    const user = await upsertGoogleUser(email, name, photoURL);

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
