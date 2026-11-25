import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Video Editing, Next.js Web & Brand Agency",
  description:
    "Hire BADARSH in Bengaluru for high-retention video editing, custom Next.js website development, social media management, photography, and brand identity.",
  image: "/api/og?title=Creative+Studio+Services&badge=Bengaluru+Digital+Agency",
  canonical: "/services",
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
