import { type ReactNode } from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { fontHeading, fontBody } from "@/lib/fonts";
import { constructMetadata, SITE_URL } from "@/lib/metadata";
import { StorefrontNav, StorefrontFooter } from "@/components/layout/storefront-shell";
import { CookieConsentBanner } from "@/components/layout/cookie-banner";
import { CurrencyProvider } from "@/context/currency-context";
import { AudioPlayerProvider } from "@/context/audio-player-context";
import { AuthProvider } from "@/context/auth-context";
import "./globals.css";

const baseMetadata = constructMetadata();

export const metadata: Metadata = {
  ...baseMetadata,
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fontHeading.variable} ${fontBody.variable} h-full antialiased`}
      suppressHydrationWarning
    >
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
                <CookieConsentBanner />
              </AudioPlayerProvider>
            </CurrencyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
