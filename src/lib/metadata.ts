import type { Metadata } from "next";
import { siteConfig, BUSINESS_LOCATION } from "@/lib/constants";

interface ConstructMetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonical?: string;
  keywords?: string[];
}

export const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "https://badarsh.vercel.app";
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
  canonical,
  keywords = [],
}: ConstructMetadataOptions = {}): Metadata {
  const fullTitle =
    title === siteConfig.name
      ? `${siteConfig.name} — Premium Digital Templates & Creative Services`
      : `${title} | ${siteConfig.name}`;

  const baseUrl = getBaseUrl();
  const canonicalUrl = canonical
    ? canonical.startsWith("http")
      ? canonical
      : `${baseUrl}${canonical.startsWith("/") ? canonical : `/${canonical}`}`
    : baseUrl;

  const defaultKeywords = [
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
  ];

  const mergedKeywords = Array.from(new Set([...defaultKeywords, ...keywords]));

  const ogImageUrl = image.startsWith("http")
    ? image
    : `${baseUrl}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    title: fullTitle,
    description,
    keywords: mergedKeywords,
    authors: [{ name: siteConfig.name, url: baseUrl }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImageUrl,
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
      images: [ogImageUrl],
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
    verification: {
      google: "BHjspiM_nBGBB2kH3AS9g5Bs47rBMjzB1hrkuSlGip0",
    },
    metadataBase: new URL(baseUrl),
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "geo.region": "IN-KA",
      "geo.placename": BUSINESS_LOCATION,
      "geo.position": "12.9716;77.5946",
      ICBM: "12.9716, 77.5946",
      "format-detection": "telephone=no",
    },
  };
}
