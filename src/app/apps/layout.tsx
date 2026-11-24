import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Editing Apps & Creator Tools — Best Apps for Video & Photo Editors",
  description:
    "Discover the best editing apps for creators, photographers, and videographers. Curated by professionals who use them every day.",
  canonical: "/apps",
  keywords: [
    "editing apps",
    "creator apps",
    "video editing apps",
    "photo editing apps",
    "capcut",
    "alight motion",
    "best apps for creators India",
  ],
});

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
