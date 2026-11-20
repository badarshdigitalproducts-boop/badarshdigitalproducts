import { NextResponse } from "next/server";
import { USER_COOKIE_NAME } from "@/lib/auth/user-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(USER_COOKIE_NAME, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}
