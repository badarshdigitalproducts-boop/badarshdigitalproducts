import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { buildServiceSchemas } from "@/lib/seo-schema";

export const metadata: Metadata = constructMetadata({
  title: "Next.js Website Design & Development in Bengaluru | BADARSH",
  description:
    "Custom Next.js website design and full-stack development in Bengaluru. SEO-ready storefronts, fast landing pages, and business websites starting at ₹3,000.",
  image: "/api/og?title=Next.js+Website+Development&badge=Bengaluru+Web+Studio",
  canonical: "/services/website-building",
});

const { professionalServiceJsonLd, serviceJsonLd } = buildServiceSchemas({
  name: "Next.js Website Design & Development in Bengaluru",
  description:
    "Responsive Next.js websites, technical SEO setup, payment integrations, and admin CMS dashboards built in Bengaluru.",
  urlPath: "/services/website-building",
  serviceType: "Web Design & Development Service",
  offers: [
    { name: "Landing Page Starter Site", price: 3999, description: "1 to 3 responsive sections, WhatsApp & SEO" },
    { name: "Business Website (5-8 Pages)", price: 9999, description: "Multi-page SEO website with admin CMS" },
    { name: "Enterprise & E-Commerce Site (15-20 Pages)", price: 15000, description: "Full-stack storefront with UPI & SSR SEO" },
  ],
});

export default function WebsiteBuildingLayout({
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
