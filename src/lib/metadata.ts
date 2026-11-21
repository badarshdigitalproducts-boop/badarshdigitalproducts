import type { Metadata } from "next";
import { siteConfig, BUSINESS_LOCATION } from "@/lib/constants";

interface ConstructMetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonical?: string;
}

const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "https://badarshdigitalproducts.vercel.app";
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
  canonical,
}: ConstructMetadataOptions = {}): Metadata {
  const fullTitle =
    title === siteConfig.name
      ? `${siteConfig.name} — Premium Digital Templates & Creative Services`
      : `${title} | ${siteConfig.name}`;

  const baseUrl = getBaseUrl();

  return {
    title: fullTitle,
    description,
    keywords: [
      "digital templates",
      "design templates",
      "canva templates",
      "instagram reels pack",
      "linkedin carousel templates",
      "pitch decks",
      "branding kits",
      "lightroom presets",
      "video editing bundles",
      "4k sound effects and overlays",
      "e-books",
      "digital planners",
      "website design agency",
      "creator tools",
      "BADARSH",
      "Bengaluru digital studio",
    ],
    authors: [{ name: siteConfig.name, url: baseUrl }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    alternates: {
      canonical: canonical || baseUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: baseUrl,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image.startsWith("http") ? image : `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.startsWith("http") ? image : `${baseUrl}${image}`],
      creator: "@badarsh",
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: "/favicon-16x16.png",
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    metadataBase: new URL(baseUrl),
    other: {
      "geo.region": "IN-KA",
      "geo.placename": BUSINESS_LOCATION,
      "geo.position": "12.9716;77.5946",
      ICBM: "12.9716, 77.5946",
      "format-detection": "telephone=no",
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
