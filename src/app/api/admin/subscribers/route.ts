import { NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin/auth";
import { getSubscribers, deleteSubscriber } from "@/lib/admin/store";

function isAuthorized(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  return verifySessionToken(match ? match[1] : undefined);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");

    const subscribers = await getSubscribers();

    if (format === "csv") {
      const csvHeader = "ID,Email,Source,Status,CreatedAt\n";
      const csvRows = subscribers
        .map(
          (s) =>
            `"${s.id}","${s.email}","${s.source}","${s.status}","${s.createdAt}"`
        )
        .join("\n");
      const csvContent = csvHeader + csvRows;

      return new Response(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="badarsh-subscribers-${new Date()
            .toISOString()
            .slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error("Get Subscribers error:", error);
    return NextResponse.json({ subscribers: [], error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Subscriber ID required" }, { status: 400 });
    }

    const success = await deleteSubscriber(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Delete Subscriber error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

