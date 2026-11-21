import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Lightroom Presets — DNG Mobile & XMP Desktop 1-Tap Presets",
  description:
    "Transform your photography with one click. Professional Adobe Lightroom presets for portraits, moody street photography, travel, and warm vintage aesthetic.",
  canonical: "/photo-presets",
  keywords: [
    "lightroom presets",
    "mobile presets dng",
    "desktop presets xmp",
    "instagram photo presets",
    "moody portrait presets",
    "color grading photography",
  ],
});

export default function PhotoPresetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
