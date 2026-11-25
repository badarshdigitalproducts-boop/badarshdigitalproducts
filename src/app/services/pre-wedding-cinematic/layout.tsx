import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { buildServiceSchemas } from "@/lib/seo-schema";

export const metadata: Metadata = constructMetadata({
  title: "Cinematic Pre-Wedding Films Bengaluru",
  description:
    "4K cinematic pre-wedding films, aerial drone cinematography, and destination shoots crafted across Bengaluru, Coorg, and Goa by BADARSH Cinema Unit.",
  canonical: "/services/pre-wedding-cinematic",
});

const { professionalServiceJsonLd, serviceJsonLd } = buildServiceSchemas({
  name: "Cinematic Pre-Wedding Films & Drone Shoots",
  description:
    "4K cinematic pre-wedding short films and aerial drone cinematography across Bengaluru and destination venues.",
  urlPath: "/services/pre-wedding-cinematic",
  serviceType: "Videography Service",
  offers: [{ name: "Cinematic Pre-Wedding Film Package", price: 14999 }],
});

export default function PreWeddingCinematicLayout({
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
