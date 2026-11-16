import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    console.log("[BADARSH Newsletter Signup]", {
      email,
      signedUpAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully. Check your email for your 10 free templates!",
    });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

