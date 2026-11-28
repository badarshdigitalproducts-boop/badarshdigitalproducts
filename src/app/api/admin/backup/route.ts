import { NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin/auth";
import { getDatabase } from "@/lib/admin/store";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  const userAgent = request.headers.get("user-agent") || undefined;
  const authorized = verifySessionToken(match ? match[1] : undefined, userAgent);

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDatabase();
  const jsonContent = JSON.stringify(db, null, 2);

  return new Response(jsonContent, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="badarsh-system-backup-${new Date()
        .toISOString()
        .slice(0, 10)}.json"`,
    },
  });
}

