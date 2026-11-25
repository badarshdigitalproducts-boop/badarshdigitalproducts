import type { Metadata } from "next";
import { SITE_URL, siteConfig, BUSINESS_LOCATION } from "@/lib/constants";

export { SITE_URL };

interface ConstructMetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonical?: string;
  keywords?: string[];
  ogType?: "website" | "article";
}

export const getBaseUrl = (): string => SITE_URL;

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
  canonical,
  ogType = "website",
}: ConstructMetadataOptions = {}): Metadata {
  const fullTitle =
    title === siteConfig.name
      ? "Video Editing Assets, Lightroom Presets & SFX Packs | BADARSH"
      : title.includes(`| ${siteConfig.name}`)
        ? title
        : `${title} | ${siteConfig.name}`;

  const baseUrl = SITE_URL;
  const canonicalPath = canonical
    ? canonical.startsWith("http")
      ? canonical.replace(/^https?:\/\/(www\.)?badarsh\.com/, "") || "/"
      : canonical.startsWith("/")
        ? canonical
        : `/${canonical}`
    : undefined;

  const fullPageUrl = canonicalPath
    ? `${baseUrl}${canonicalPath === "/" ? "" : canonicalPath}`
    : baseUrl;

  const safeImage =
    !image || image.startsWith("data:") || image.startsWith("blob:")
      ? `/api/og?title=${encodeURIComponent(title.slice(0, 60))}&badge=BADARSH+Store`
      : image;

  const ogImageUrl = safeImage.startsWith("http")
    ? safeImage
    : `${baseUrl}${safeImage.startsWith("/") ? safeImage : `/${safeImage}`}`;

  return {
    title: fullTitle,
    description,
    authors: [{ name: siteConfig.name, url: baseUrl }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    ...(canonicalPath
      ? {
          alternates: {
            canonical: canonicalPath,
          },
        }
      : {}),
    openGraph: {
      type: ogType,
      locale: "en_IN",
      url: fullPageUrl,
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
