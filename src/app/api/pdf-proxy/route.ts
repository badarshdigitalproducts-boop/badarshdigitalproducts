import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    // Security: Validate http/https protocol
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      return NextResponse.json({ error: "Invalid URL protocol" }, { status: 400 });
    }

    // Fetch PDF upstream with standard desktop browser User-Agent
    const upstreamRes = await fetch(targetUrl, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "application/pdf,application/octet-stream,*/*",
      },
    });

    if (!upstreamRes.ok) {
      console.warn(`PDF Proxy upstream error: ${upstreamRes.status} for ${targetUrl}`);
      return NextResponse.json(
        { error: `Upstream resource returned HTTP ${upstreamRes.status}` },
        { status: upstreamRes.status }
      );
    }

    const arrayBuffer = await upstreamRes.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="preview.pdf"',
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        "Access-Control-Allow-Origin": "*",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Content-Security-Policy": "frame-ancestors 'self'",
      },
    });
  } catch (err: any) {
    console.error("PDF Proxy error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to load PDF document" },
      { status: 500 }
    );
  }
}
