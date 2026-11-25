import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { buildServiceSchemas } from "@/lib/seo-schema";

export const metadata: Metadata = constructMetadata({
  title: "Event & Portrait Photography Bengaluru",
  description:
    "Event and portrait photography in Bengaluru and across India for weddings, birthdays, corporate conferences, and model portfolios with fast teaser delivery.",
  canonical: "/services/event-photography",
});

const { professionalServiceJsonLd, serviceJsonLd } = buildServiceSchemas({
  name: "Event & Portrait Photography in Bengaluru",
  description:
    "Weddings, corporate conferences, birthday shoots, and model portfolios photographed with Sony G-Master optics.",
  urlPath: "/services/event-photography",
  serviceType: "Photography Service",
  offers: [{ name: "Half-Day Event Coverage", price: 7999 }],
});

export default function EventPhotographyLayout({
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
