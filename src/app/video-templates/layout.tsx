import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Beat-Sync Video Templates — CapCut & Alight Motion XML Projects",
  description:
    "Trending 9:16 vertical video editing templates. Velocity beat shakes, kinetic typography, and anime motion graphics ready to use in CapCut and Alight Motion.",
  canonical: "/video-templates",
  keywords: [
    "capcut templates",
    "alight motion xml",
    "velocity edit template",
    "beat sync reels",
    "tiktok video templates",
    "instagram reels xml",
  ],
});

export default function VideoTemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
