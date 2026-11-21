import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Audio & Creator Bundles — BGM, Stems & Sound Packs",
  description:
    "Premium sound design bundles for YouTube creators, filmmakers, and reel editors. 24-bit 48kHz audio packs with commercial licensing.",
  canonical: "/editing-bundles",
  keywords: [
    "sound effects bundle",
    "creator sound pack",
    "background music youtube",
    "royalty free sfx",
    "cinematic audio stems",
  ],
});

export default function EditingBundlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
