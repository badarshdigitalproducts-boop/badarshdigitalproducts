"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/lib/constants";

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
  { label: "Social Media Templates", href: "/templates" },
  { label: "Presentation Templates", href: "/templates" },
  { label: "Branding Kits", href: "/templates" },
  { label: "E-Books", href: "/ebooks" },
  { label: "Digital Planners", href: "/planners" },
];

const serviceLinks = [
  { label: "Video Editing", href: "/services" },
  { label: "Website Building", href: "/services" },
  { label: "Social Media Management", href: "/services" },
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
        body: JSON.stringify({ email }),
      });
    } catch {
      // fallback
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <footer className="border-t border-border/50 bg-card">
      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="cursor-pointer text-2xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              BADARSH
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Premium digital templates, e-books &amp; creative services to make
              your brand stand out online.
            </p>

            {/* Social icons */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-full border border-border/50 p-2 text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-full border border-border/50 p-2 text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
                aria-label="YouTube"
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.links.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-full border border-border/50 p-2 text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
                aria-label="Pinterest"
              >
                <PinterestIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-full border border-border/50 p-2 text-muted transition-colors duration-200 hover:border-green-500 hover:text-green-500"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Products column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Products
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
              Services
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

          {/* Contact column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${siteConfig.links.email}`}
                  className="cursor-pointer text-sm text-muted transition-colors duration-200 hover:text-accent"
                >
                  {siteConfig.links.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer text-sm text-muted transition-colors duration-200 hover:text-green-500"
                >
                  WhatsApp Support
                </a>
              </li>
              <li>
                <Link
                  href="/about"
                  className="cursor-pointer text-sm text-muted transition-colors duration-200 hover:text-accent"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="cursor-pointer text-sm text-muted transition-colors duration-200 hover:text-accent"
                >
                  Blog
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
              Subscribe to our newsletter
            </h3>
            <p className="mt-1 text-xs text-muted">
              Get the latest Canva templates, tips &amp; 10 free gifts.
            </p>
          </div>
          {submitted ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
              <span>Subscribed! Check your inbox for the free templates link.</span>
            </div>
          ) : (
            <form
              className="flex w-full max-w-md gap-2 sm:w-auto"
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-full border border-border/50 bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer whitespace-nowrap rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-hover disabled:opacity-50"
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-5 text-xs text-muted sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; {currentYear} BADARSH. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
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
          </div>
        </div>
      </div>
    </footer>
  );
}
