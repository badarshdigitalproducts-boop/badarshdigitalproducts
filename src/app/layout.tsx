import { Suspense, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { fontHeading, fontBody } from "@/lib/fonts";
import { constructMetadata } from "@/lib/metadata";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsappButton } from "@/components/shared/whatsapp-button";
import { SocialProofToast } from "@/components/shared/social-proof-toast";
import { CurrencyProvider } from "@/context/currency-context";
import "./globals.css";

export const metadata = constructMetadata();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fontHeading.variable} ${fontBody.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-body">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider>
            <Suspense fallback={<div className="h-16 w-full bg-background" />}>
              <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsappButton />
            <SocialProofToast />
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
