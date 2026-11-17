import { NextResponse } from "next/server";
import { addLead } from "@/lib/admin/store";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, phone, interest, message, budget } = data;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Persist lead directly into the BADARSH CRM
    const savedLead = await addLead({
      name,
      email,
      phone,
      interest: interest || "General Inquiry",
      message,
      budget,
    });

    console.log("[BADARSH Contact Inquiry Saved]", {
      leadId: savedLead.id,
      name,
      email,
      interest,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry received successfully. Our founder will be in touch shortly.",
      leadId: savedLead.id,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
