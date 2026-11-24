"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import {
  siteConfig,
  WHATSAPP_DISPLAY,
  SUPPORT_EMAIL,
  BUSINESS_LEGAL_NAME,
  BUSINESS_LOCATION,
} from "@/lib/constants";
import { BrandLogo } from "./brand-logo";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" x2="12" y1="17" y2="22" />
      <path d="M5 17h2a2 2 0 0 0 2-2v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2h2" />
      <circle cx="12" cy="9" r="7" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Zm0 0a5 5 0 0 0 5 5m0 0h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1Z" />
    </svg>
  );
}

const productLinks = [
  { label: "Bundles", href: "/bundles" },
  { label: "Apps", href: "/editing-apps" },
  { label: "Lightroom Presets", href: "/photo-presets" },
  { label: "Sound Effects", href: "/sound-effects" },
  { label: "E-Books", href: "/ebooks" },
  { label: "Planners", href: "/planners" },
  { label: "Templates", href: "/templates" },
];

const serviceLinks = [
  { label: "Video Editing", href: "/services/video-editing" },
  { label: "Website Building", href: "/services/website-design" },
  { label: "Social Media Management", href: "/services/social-media-management" },
  { label: "Custom Design", href: "/services" },
];

export function Footer() {
  const currentYear = 2026;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "Footer Form" }),
      });
    } catch {
      // fallback
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <footer className="overflow-hidden border-t border-border/50 bg-card">
      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo />
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Independent digital studio and creative toolkit. Handcrafted video assets, color presets, sound design, and bespoke creative services.
            </p>

            {/* Social icons with accessible aria-labels */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-full border border-border/50 p-2 text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
                aria-label="Follow BADARSH on Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-full border border-border/50 p-2 text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
                aria-label="Subscribe to BADARSH on YouTube"
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.links.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-full border border-border/50 p-2 text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
                aria-label="Follow BADARSH on Pinterest"
              >
                <PinterestIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-full border border-border/50 p-2 text-muted transition-colors duration-200 hover:border-green-500 hover:text-green-500"
                aria-label="Chat with BADARSH on WhatsApp"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Products column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Digital Products
            </h3>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="cursor-pointer text-sm text-muted transition-colors duration-200 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Creative Services
            </h3>
            <ul className="mt-4 space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="cursor-pointer text-sm text-muted transition-colors duration-200 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust & Company column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Company &amp; Legal
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/about"
                  className="cursor-pointer text-sm text-muted transition-colors duration-200 hover:text-accent"
                >
                  About Our Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/license"
                  className="cursor-pointer text-sm text-muted transition-colors duration-200 hover:text-accent"
                >
                  Commercial License Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="cursor-pointer text-sm text-muted transition-colors duration-200 hover:text-accent"
                >
                  Refund &amp; Delivery Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="cursor-pointer text-sm text-muted transition-colors duration-200 hover:text-accent"
                >
                  Growth Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about#contact"
                  className="cursor-pointer text-sm text-muted transition-colors duration-200 hover:text-accent"
                >
                  Studio &amp; Inquiries
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter row */}
      <div className="border-t border-border/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Join the BADARSH Creator Community
            </h3>
            <p className="mt-1 text-xs text-muted">
              Subscribe for weekly studio design drops &amp; get 10 free starter templates.
            </p>
          </div>
          {submitted ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
              <span>Subscribed! Check your inbox for your 10 free templates.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 w-full max-w-md sm:w-auto">
              <form
                className="flex w-full gap-2 sm:w-auto"
                onSubmit={handleSubscribe}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 rounded-full border border-border/50 bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer whitespace-nowrap rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-hover disabled:opacity-50"
                >
                  {loading ? "..." : "Subscribe"}
                </button>
              </form>
              <p className="text-[11px] text-muted">
                🔒 Protected by our{" "}
                <Link href="/privacy-policy" className="underline hover:text-foreground">
                  Privacy Policy
                </Link>
                .{" "}
                <Link href="/unsubscribe" className="underline hover:text-foreground">
                  1-Click Unsubscribe
                </Link>{" "}
                anytime.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar with legal & entity info */}
      <div className="border-t border-border/50 bg-background/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-6 text-xs text-muted sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p>&copy; {currentYear} {BUSINESS_LEGAL_NAME}. All rights reserved.</p>
            <p className="text-[11px] text-muted/80 mt-0.5">
              {BUSINESS_LOCATION} &bull; Client Support: {SUPPORT_EMAIL}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/privacy-policy"
              className="cursor-pointer transition-colors duration-200 hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="cursor-pointer transition-colors duration-200 hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              href="/refund-policy"
              className="cursor-pointer transition-colors duration-200 hover:text-foreground"
            >
              Refund Policy
            </Link>
            <Link
              href="/cookie-policy"
              className="cursor-pointer transition-colors duration-200 hover:text-foreground"
            >
              Cookie Policy
            </Link>
            <Link
              href="/license"
              className="cursor-pointer transition-colors duration-200 hover:text-foreground"
            >
              Commercial License
            </Link>
            <Link
              href="/unsubscribe"
              className="cursor-pointer transition-colors duration-200 hover:text-foreground"
            >
              Unsubscribe
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
