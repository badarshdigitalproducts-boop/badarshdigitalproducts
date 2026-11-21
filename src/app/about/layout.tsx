import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "About BADARSH — Bengaluru Digital Studio & Creative Agency",
  description:
    "Learn the story behind BADARSH: Bengaluru-born digital design studio crafting premium templates, audio vaults, software tools, and creative services.",
  canonical: "/about",
  keywords: [
    "about badarsh",
    "bengaluru creative studio",
    "digital products company",
    "creator asset studio",
    "creative agency story",
  ],
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
