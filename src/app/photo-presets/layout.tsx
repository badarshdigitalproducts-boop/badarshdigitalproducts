import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Cinematic Lightroom Presets (.DNG & .XMP) for Mobile & Desktop | BADARSH",
  description:
    "Shop 1-tap Lightroom presets in .DNG and .XMP formats for portraits, street photography, weddings, and reels. Instant cloud download with commercial rights.",
  image: "/api/og?title=Cinematic+Lightroom+Presets&badge=DNG+%26+XMP+Presets",
  canonical: "/photo-presets",
});

export default function PhotoPresetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
