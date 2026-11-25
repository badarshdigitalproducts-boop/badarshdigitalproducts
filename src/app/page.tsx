import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import {
  SITE_URL,
  siteConfig,
  BUSINESS_LEGAL_NAME,
} from "@/lib/constants";
import { HOME_FAQS } from "@/content/faqs";
import { Hero } from "@/components/home/hero";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ServicesPreview } from "@/components/home/services-preview";
import { Testimonials } from "@/components/home/testimonials";
import { FaqSection } from "@/components/home/faq-section";
import { BlogPreview } from "@/components/home/blog-preview";

export const metadata: Metadata = constructMetadata({
  title: "Video Editing Assets, Lightroom Presets & SFX Packs | BADARSH",
  description:
    "Cinematic Lightroom presets, 24-bit WAV sound effects, LUTs and video editing bundles with commercial licenses. Plus video editing and Next.js web design in Bengaluru.",
  image: "/api/og?title=Video+Editing+Assets+%26+Presets&badge=BADARSH+Studio",
  canonical: "/",
});

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BADARSH",
  legalName: BUSINESS_LEGAL_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo-dark-v3.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  sameAs: [
    siteConfig.links.instagram,
    siteConfig.links.youtube,
    siteConfig.links.pinterest,
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BADARSH",
  url: SITE_URL,
  description:
    "Cinematic Lightroom presets, 24-bit WAV sound effects, LUTs and video editing bundles with commercial licenses. Plus video editing and Next.js web design in Bengaluru.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/templates?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const faqPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
      />
      <Hero />
      <FeaturedProducts />
      <ServicesPreview />
      <Testimonials />
      <FaqSection />
      <BlogPreview />
    </>
  );
}
