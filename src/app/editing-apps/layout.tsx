import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Creator Export Presets & Workflow Guides",
  description:
    "Studio-tested 4K video export configs, DaVinci and Premiere shortcut maps, XML workflow presets, and illustrated creator setup guides by BADARSH Bengaluru.",
  image: "/api/og?title=Creator+Workflows+%26+Configs&badge=Export+Presets+%26+Guides",
  canonical: "/editing-apps",
});

export default function EditingAppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
