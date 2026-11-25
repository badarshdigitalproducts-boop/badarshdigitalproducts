import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Creator Economy & Video Editing Blog",
  description:
    "Actionable guides on digital product creation, short-form video editing workflows, Lightroom color grading, and Next.js website conversion strategy today.",
  image: "/api/og?title=BADARSH+Editorial+Blog&badge=Creator+%26+Editing+Guides",
  canonical: "/blog",
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
