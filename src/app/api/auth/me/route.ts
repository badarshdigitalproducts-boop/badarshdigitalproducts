import { NextResponse } from "next/server";
import { verifyUserSessionToken, USER_COOKIE_NAME } from "@/lib/auth/user-auth";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(new RegExp(`${USER_COOKIE_NAME}=([^;]+)`));
    const token = match ? match[1] : undefined;

    const session = verifyUserSessionToken(token);
    if (!session) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        uid: session.uid,
        email: session.email,
        displayName: session.displayName,
        photoURL: session.photoURL || null,
        isDemo: false,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
