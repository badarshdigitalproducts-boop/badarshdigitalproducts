import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Canva & Social Media Templates — Instagram Reels, LinkedIn & Pitch Decks",
  description:
    "Explore 100+ high-converting Canva & Figma templates. Instagram reels, carousel decks, presentation slides, and brand kits built for creators and modern founders.",
  canonical: "/templates",
  keywords: [
    "canva templates",
    "instagram reels templates",
    "linkedin carousel pack",
    "pitch deck templates",
    "social media templates",
    "brand kit templates",
  ],
});

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
