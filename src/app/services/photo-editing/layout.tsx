import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { buildServiceSchemas } from "@/lib/seo-schema";

export const metadata: Metadata = constructMetadata({
  title: "Photo Retouching & Grading Services",
  description:
    "Editorial photo retouching, color grading, skin texture preservation, and ecommerce product photography edits tailored for creators and brands in India.",
  canonical: "/services/photo-editing",
});

const { professionalServiceJsonLd, serviceJsonLd } = buildServiceSchemas({
  name: "Photo Retouching & Color Grading Service",
  description:
    "Commercial photo retouching, editorial color grading, and product shoot post-production in Bengaluru.",
  urlPath: "/services/photo-editing",
  serviceType: "Photo Editing Service",
  offers: [{ name: "Commercial Retouch Package", price: 1499 }],
});

export default function PhotoEditingLayout({
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
