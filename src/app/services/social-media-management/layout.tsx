import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { buildServiceSchemas } from "@/lib/seo-schema";

export const metadata: Metadata = constructMetadata({
  title: "Social Media Management Agency Bengaluru",
  description:
    "End-to-end Instagram Reels production, LinkedIn carousels, calendar scheduling, and organic social media growth for creators and founders across Bengaluru.",
  image: "/api/og?title=Social+Media+Management&badge=Reels+%26+LinkedIn+Growth",
  canonical: "/services/social-media-management",
});

const { professionalServiceJsonLd, serviceJsonLd } = buildServiceSchemas({
  name: "Social Media Management Agency Bengaluru",
  description:
    "Content production, Instagram Reels strategy, LinkedIn carousels, and social growth retainers.",
  urlPath: "/services/social-media-management",
  serviceType: "Social Media Management Service",
  offers: [
    { name: "Social Media Growth Starter", price: 9999, description: "Monthly content strategy & scheduling" },
    { name: "Full Creator Retainer", price: 18999, description: "Complete Reels + carousel production" },
  ],
});

export default function SocialMediaManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {children}
    </>
  );
}
