import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { buildServiceSchemas } from "@/lib/seo-schema";

export const metadata: Metadata = constructMetadata({
  title: "Brand Identity & Logo Design Bengaluru",
  description:
    "Complete brand identity systems in Bengaluru: custom logo design, typography pairing, color palettes, brand guidelines, and social media launch kits.",
  canonical: "/services/brand-identity",
});

const { professionalServiceJsonLd, serviceJsonLd } = buildServiceSchemas({
  name: "Brand Identity & Logo Design Service",
  description:
    "Logo design, typography systems, color guidelines, and launch assets tailored for startups and creator brands in Bengaluru.",
  urlPath: "/services/brand-identity",
  serviceType: "Branding & Graphic Design Service",
  offers: [{ name: "Complete Brand Identity Suite", price: 4999 }],
});

export default function BrandIdentityLayout({
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
