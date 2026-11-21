import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Modern Website Design & Full-Stack Web Development Services",
  description:
    "Custom high-speed Next.js, Tailwind CSS, and Figma-to-code website design. SEO-optimized, ultra-responsive digital storefronts and landing pages.",
  canonical: "/services/website-design",
  keywords: [
    "website design services",
    "web development Bengaluru",
    "next.js developer hire",
    "landing page design",
    "ecommerce website development",
  ],
});

export default function WebsiteDesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
