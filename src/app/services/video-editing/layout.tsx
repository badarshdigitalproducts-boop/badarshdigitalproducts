import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Professional Video Editing Services — Reels, Shorts & Long-Form YouTube",
  description:
    "High-retention video editing services for founders and creators. Viral hooks, sound design, motion graphics, and color grading delivered in 24-48 hours.",
  canonical: "/services/video-editing",
  keywords: [
    "video editing services",
    "reels editor hire",
    "youtube video editor",
    "short form video editing",
    "high retention video editor",
    "tiktok editing service",
  ],
});

export default function VideoEditingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
