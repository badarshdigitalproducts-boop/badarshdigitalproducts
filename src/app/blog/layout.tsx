import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Founder & Creator Playbook — Design, Growth & Digital Products Blog",
  description:
    "Insights, guides, and tutorials on digital products, creator economy, UI/UX design trends, and scaling your online business with high-impact assets.",
  canonical: "/blog",
  keywords: [
    "creator economy blog",
    "digital product playbook",
    "canva tips and tricks",
    "video editing growth",
    "startup design guides",
  ],
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
