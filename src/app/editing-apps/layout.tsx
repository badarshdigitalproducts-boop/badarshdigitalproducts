import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Creator Software & Mobile Editing Apps — Verified & High-Speed",
  description:
    "Direct, high-speed mobile apps and creator software tools. Verified, virus-scanned APKs and mobile utilities for modern content creators.",
  canonical: "/editing-apps",
  keywords: [
    "mobile editing apps",
    "creator software",
    "video editor mobile",
    "capcut pro",
    "mobile creator utilities",
  ],
});

export default function EditingAppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
