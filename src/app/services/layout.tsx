import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Creative Agency Services — Video Editing, Web Design & Branding",
  description:
    "Done-for-you creative services from Bengaluru. Premium high-retention video editing, custom Next.js websites, mobile apps, and full brand identities.",
  canonical: "/services",
  keywords: [
    "creative agency Bengaluru",
    "video editing agency",
    "web design agency India",
    "brand identity studio",
    "app development agency",
    "social media growth services",
  ],
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
