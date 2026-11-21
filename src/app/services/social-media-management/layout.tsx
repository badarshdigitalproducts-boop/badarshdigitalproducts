import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Social Media Growth & Content Management Services",
  description:
    "End-to-end social media strategy, content production, scheduling, and community management for brands looking to dominate Instagram & LinkedIn.",
  canonical: "/services/social-media-management",
  keywords: [
    "social media management agency",
    "instagram growth service",
    "linkedin content strategy",
    "social media marketing",
    "creator brand management",
  ],
});

export default function SocialMediaManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
