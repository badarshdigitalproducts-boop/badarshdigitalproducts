import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Beat-Sync 9:16 Reels & XML Video Templates",
  description:
    "Shop beat-sync vertical video templates, velocity shakes, kinetic typography, and Alight Motion XML projects built for high-retention Reels and Shorts.",
  image: "/api/og?title=Beat-Sync+Video+Templates&badge=9:16+Reels+%26+XML+Projects",
  canonical: "/video-templates",
});

export default function VideoTemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
