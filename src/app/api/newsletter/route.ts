import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/admin/store";

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    // Persist subscriber directly into the BADARSH Audience Engine
    const savedSub = await addSubscriber(email, source || "Website Footer");

    console.log("[BADARSH Newsletter Signup Saved]", {
      subscriberId: savedSub.id,
      email,
      signedUpAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully! Check your email for your 10 free templates.",
      subscriberId: savedSub.id,
    });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
