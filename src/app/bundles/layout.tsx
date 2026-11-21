import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Video Editing Bundles — 4K VFX, Alpha Overlays & Cinematic LUTs",
  description:
    "Supercharge your video edits with drag-and-drop creator assets. Uncompressed 4K video overlays, film grains, sound transitions, and color grading LUTs.",
  canonical: "/bundles",
  keywords: [
    "video editing bundles",
    "4k overlays",
    "film grain pack",
    "cinematic luts",
    "video editing assets",
    "premiere pro transitions",
  ],
});

export default function BundlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
