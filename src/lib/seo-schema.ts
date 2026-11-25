import { SITE_URL, BUSINESS_LEGAL_NAME, siteConfig } from "@/lib/constants";

interface ServiceOfferSpec {
  name: string;
  price: number;
  description?: string;
}

interface BuildServiceSchemaOptions {
  name: string;
  description: string;
  urlPath: string;
  serviceType: string;
  offers: ServiceOfferSpec[];
}

export function buildServiceSchemas({
  name,
  description,
  urlPath,
  serviceType,
  offers,
}: BuildServiceSchemaOptions) {
  const fullUrl = `${SITE_URL}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`;

  const professionalServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: BUSINESS_LEGAL_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-dark-v3.png`,
    image: `${SITE_URL}/images/og/og-default.png`,
    priceRange: "₹250 - ₹25,000",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "City", name: "Bengaluru" },
      { "@type": "Country", name: "India" },
    ],
    sameAs: [
      siteConfig.links.instagram,
      siteConfig.links.youtube,
      siteConfig.links.pinterest,
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    url: fullUrl,
    provider: {
      "@type": "ProfessionalService",
      name: BUSINESS_LEGAL_NAME,
      url: SITE_URL,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
    },
    areaServed: {
      "@type": "City",
      name: "Bengaluru",
    },
    offers: offers.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      ...(offer.description ? { description: offer.description } : {}),
      price: offer.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: fullUrl,
    })),
  };

  return { professionalServiceJsonLd, serviceJsonLd };
}
