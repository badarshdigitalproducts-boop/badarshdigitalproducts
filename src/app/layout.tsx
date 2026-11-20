import { Suspense, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { fontHeading, fontBody } from "@/lib/fonts";
import { constructMetadata } from "@/lib/metadata";
import { StorefrontNav, StorefrontFooter } from "@/components/layout/storefront-shell";
import { CurrencyProvider } from "@/context/currency-context";
import { AudioPlayerProvider } from "@/context/audio-player-context";
import { AuthProvider } from "@/context/auth-context";
import {
  siteConfig,
  WHATSAPP_NUMBER,
  BUSINESS_LEGAL_NAME,
} from "@/lib/constants";
import "./globals.css";

export const metadata = constructMetadata();

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  legalName: BUSINESS_LEGAL_NAME,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo-dark-v3.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: `+${WHATSAPP_NUMBER}`,
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
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
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/templates?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fontHeading.variable} ${fontBody.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-body overflow-x-clip max-w-[100vw]">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <CurrencyProvider>
              <AudioPlayerProvider>
                <StorefrontNav />
                <main className="flex-1">{children}</main>
                <StorefrontFooter />
              </AudioPlayerProvider>
            </CurrencyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
