import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Brand Identity Design & Logo Creation Services",
  description:
    "Cohesive brand identity packages: logo design, brand guideline book, typography hierarchy, color palette, and social media branding kits.",
  canonical: "/services/brand-identity",
  keywords: [
    "brand identity design",
    "logo design services",
    "brand guidelines",
    "corporate visual identity",
    "startup branding package",
  ],
});

export default function BrandIdentityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
