import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Independent Bengaluru Creative Studio | BADARSH",
  description:
    "Meet BADARSH, an independent Bengaluru digital studio crafting commercial Lightroom presets, WAV sound effects, editing bundles, and custom web solutions.",
  image: "/api/og?title=About+BADARSH+Studio&badge=Bengaluru,+India",
  canonical: "/about",
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
