import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Canva Social Media & Pitch Deck Templates",
  description:
    "Explore editable Canva social media kits, Instagram reel covers, LinkedIn carousels, and founder pitch decks with zero extra subscriptions. Instant access.",
  image: "/api/og?title=Canva+%26+Design+Templates&badge=Reels,+Carousels+%26+Decks",
  canonical: "/templates",
});

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
