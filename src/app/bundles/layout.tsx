import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "2026 Video Editing Bundle: 500+ SFX, 100 Transitions, 50 LUTs | BADARSH",
  description:
    "Download 500+ WAV sound effects, 100 seamless transitions, 50 cinema LUTs, and 4K overlays with lifetime commercial licensing. Instant download from BADARSH.",
  image: "/api/og?title=2026+Video+Editing+Bundles&badge=SFX,+LUTs+%26+Overlays",
  canonical: "/bundles",
});

export default function BundlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
