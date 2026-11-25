import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "BADARSH Digital Studio").slice(0, 80);
  const badge = (searchParams.get("badge") || "Creators & Studios").slice(0, 40);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0c",
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(99, 102, 241, 0.28), transparent 45%), radial-gradient(circle at 15% 85%, rgba(16, 185, 129, 0.16), transparent 40%)",
          color: "#ffffff",
          padding: "64px 72px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: 800,
              }}
            >
              B
            </div>
            <span style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "0.08em" }}>
              BADARSH
            </span>
          </div>
          <div
            style={{
              padding: "10px 22px",
              borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.16)",
              backgroundColor: "rgba(255,255,255,0.06)",
              fontSize: "18px",
              fontWeight: 600,
              color: "#a5b4fc",
            }}
          >
            {badge}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "960px" }}>
          <div
            style={{
              fontSize: "60px",
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              color: "#fafafa",
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: "24px", color: "#a1a1aa", lineHeight: 1.4 }}>
            Commercial Creative Assets, Video Editing & Next.js Web Development — Bengaluru, India
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "24px",
            fontSize: "20px",
            color: "#d4d4d8",
          }}
        >
          <span>www.badarsh.com</span>
          <span>Instant Download &bull; Commercial License</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
