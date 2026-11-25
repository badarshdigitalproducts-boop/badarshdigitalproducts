import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { buildServiceSchemas } from "@/lib/seo-schema";

export const metadata: Metadata = constructMetadata({
  title: "Mobile & Web App Development Bengaluru",
  description:
    "Cross-platform iOS, Android, and Next.js web application development in Bengaluru for modern brands, startups, and creator commerce platforms.",
  canonical: "/services/app-development",
});

const { professionalServiceJsonLd, serviceJsonLd } = buildServiceSchemas({
  name: "Mobile & Web App Development Service",
  description:
    "Cross-platform Flutter, React Native, and Next.js web application engineering in Bengaluru.",
  urlPath: "/services/app-development",
  serviceType: "Mobile & Web Application Development",
  offers: [{ name: "MVP Mobile & Web App", price: 15000 }],
});

export default function AppDevelopmentLayout({
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
