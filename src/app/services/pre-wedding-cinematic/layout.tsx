import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Cinematic Pre-Wedding Films & Drone Shoots — BADARSH Cinema Unit",
  description:
    "Bollywood-grade 4K cinematic pre-wedding short films, drone cinematography, and exotic destination shoots in Goa, Bengaluru palaces, and Coorg hills.",
  canonical: "/services/pre-wedding-cinematic",
  keywords: [
    "pre-wedding shoot Bengaluru",
    "cinematic pre-wedding film",
    "drone pre-wedding video",
    "wedding filmmaker India",
    "destination couple shoot",
  ],
});

export default function PreWeddingCinematicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
