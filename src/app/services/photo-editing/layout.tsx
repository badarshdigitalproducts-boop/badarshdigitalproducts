import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Professional Photo Retouching & Color Grading Services",
  description:
    "Editorial photo retouching, high-end commercial grading, skin texture preservation, and background removal for brands and photographers.",
  canonical: "/services/photo-editing",
  keywords: [
    "photo retouching service",
    "photo editing agency",
    "commercial color grading",
    "editorial skin retouching",
    "product photography editing",
  ],
});

export default function PhotoEditingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
