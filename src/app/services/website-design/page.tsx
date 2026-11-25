"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Zap,
  Code2,
  Search,
  ShieldCheck,
  Check,
} from "lucide-react";
import { PricingTable } from "@/components/services/pricing-table";
import { services } from "@/content/services";
import { getWhatsAppUrl } from "@/lib/utils";

export default function WebsiteDesignPage() {
  const service = services.find((s) => s.slug === "website-building") || services[1];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
      {/* Compact Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Website Design &amp; Next.js Development
          </h1>
          <p className="mt-1 text-sm text-muted">
            Sub-second responsive storefronts and SaaS sites engineered for SEO and direct checkout.
          </p>
        </div>
        <a
          href={getWhatsAppUrl(
            "Hi BADARSH! I need a website designed for my business. Can we discuss pages and get a quote on WhatsApp?",
            "Website Development Inquiry"
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-accent-hover transition-all shrink-0 self-start sm:self-auto"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Get Quote on WhatsApp</span>
        </a>
      </div>

      {/* LIVE WEBSITES PORTFOLIO SHOWCASE */}
      <div className="rounded-3xl border border-card-border bg-card/60 p-5 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
              Live Client Work
            </span>
            <h2 className="mt-2 font-heading text-2xl font-black text-foreground">
              Websites Engineered by BADARSH
            </h2>
            <p className="text-xs text-muted">
              Inspect responsive design, micro-interactions, dark/light themes, and sub-second load times live in production.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-background px-4 py-2 text-xs font-semibold text-emerald-500 shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>98+ Google Lighthouse Score</span>
          </div>
        </div>

        {/* Live Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "BADARSH Creator Engine",
              type: "E-Commerce & Digital Store",
              desc: "Full Next.js 16 e-commerce suite with dynamic cart, real-time currency conversion, and sub-second page transitions.",
              image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
              link: "https://badarshdigitalproducts.vercel.app",
              tags: ["Next.js 16", "Tailwind", "Framer Motion"],
            },
            {
              title: "Luxe Minimalist Portfolio",
              type: "High-End Agency Platform",
              desc: "Apple-level typography hierarchy, fluid physics animations, dynamic lead engine, and dark/light mode toggle.",
              image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&q=80",
              link: "https://badarshdigitalproducts.vercel.app/about",
              tags: ["TypeScript", "Bespoke CSS", "SEO Dominance"],
            },
            {
              title: "Interactive Audio Player Vault",
              type: "Media Streaming App",
              desc: "Spotify-style background audio engine with real-time waveform bars and one-click cloud asset delivery.",
              image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80",
              link: "https://badarshdigitalproducts.vercel.app/editing-bundles",
              tags: ["Web Audio API", "Instant Streaming", "Cloudflare"],
            },
          ].map((project, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-card-border bg-card p-4 shadow-sm hover:border-accent/40 hover:shadow-xl transition-all flex flex-col"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-900 mb-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-md">
                    {project.type}
                  </span>
                </div>
              </div>

              <h3 className="font-heading text-base font-bold text-foreground group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed line-clamp-2">
                {project.desc}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-foreground/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between border-t border-card-border/60">
                <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live Production
                </span>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                >
                  <span>Visit Site</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRANSPARENT TIERED RATE CARDS */}
      <div className="mt-16 rounded-3xl border border-accent/30 bg-gradient-to-r from-accent/15 via-purple-900/10 to-card p-6 md:p-10 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
            ⚡ Flexible Rate Breakdown
          </span>
          <h2 className="mt-3 font-heading text-2xl font-black text-foreground sm:text-3xl">
            Custom Pricing Based on Your Page Requirements
          </h2>
          <p className="mt-1 text-xs text-muted">
            All tiers include 100% mobile responsive design, technical SEO, SSL security, and WhatsApp click-to-chat.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Tier 1 */}
          <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm hover:border-accent/40 transition-colors">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Starter Tier
            </span>
            <h3 className="mt-1 font-heading text-lg font-bold text-foreground">
              Normal / Landing Page
            </h3>
            <div className="mt-3 font-heading text-3xl font-extrabold text-foreground">
              ₹3,000 – ₹6,000
            </div>
            <p className="mt-2 text-xs text-muted">
              Ideal for personal brands, consultants, freelancers, and local business portfolios.
            </p>

            <ul className="mt-6 space-y-2 border-t border-card-border/60 pt-4 text-xs text-foreground/90">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>1 to 3 responsive sections / pages</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Next.js speed (under 2s load time)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>WhatsApp chat &amp; contact form</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Basic Google SEO setup</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Delivery in 4 to 6 business days</span>
              </li>
            </ul>

            <a
              href={getWhatsAppUrl(
                "Hi BADARSH! I'm interested in the Normal/Landing Page package (₹3,000–₹6,000).",
                "Normal Website Tier"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-card-border bg-background py-2.5 text-xs font-bold text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              <span>Get Landing Page Quote</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Tier 2 */}
          <div className="relative rounded-2xl border-2 border-accent bg-card p-6 shadow-xl">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Most Popular
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Business Tier
            </span>
            <h3 className="mt-1 font-heading text-lg font-bold text-foreground">
              5 to 8 Pages Business Site
            </h3>
            <div className="mt-3 font-heading text-3xl font-extrabold text-foreground">
              ₹9,000 – ₹11,000
            </div>
            <p className="mt-2 text-xs text-muted">
              Complete corporate presence for growing agencies, clinics, firms, and service brands.
            </p>

            <ul className="mt-6 space-y-2 border-t border-card-border/60 pt-4 text-xs text-foreground/90">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>5 to 8 custom designed pages</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Home, About, Services, Portfolio, Blog</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Full On-Page SEO + Search Console setup</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Admin CMS dashboard to update content</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Delivery in 10 to 14 business days</span>
              </li>
            </ul>

            <a
              href={getWhatsAppUrl(
                "Hi BADARSH! I'm interested in the 5-8 Pages Business Website (₹9,000–₹11,000).",
                "Business Website Tier"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent py-2.5 text-xs font-bold text-white shadow-md hover:bg-accent-hover transition-colors"
            >
              <span>Book 5–8 Pages Site</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Tier 3 */}
          <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm hover:border-accent/40 transition-colors">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Enterprise Tier
            </span>
            <h3 className="mt-1 font-heading text-lg font-bold text-foreground">
              15 to 20 Pages Enterprise / E-Com
            </h3>
            <div className="mt-3 font-heading text-3xl font-extrabold text-foreground">
              ₹15,000+
            </div>
            <p className="mt-2 text-xs text-muted">
              Full-scale digital platform with online store, customer accounts, and advanced SEO dominance.
            </p>

            <ul className="mt-6 space-y-2 border-t border-card-border/60 pt-4 text-xs text-foreground/90">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>15 to 20 comprehensive pages</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>UPI, Razorpay or Stripe payments</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Full Next.js SSR for maximum SEO reach</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Dedicated admin portal &amp; lead engine</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>6 months free maintenance &amp; hosting</span>
              </li>
            </ul>

            <a
              href={getWhatsAppUrl(
                "Hi BADARSH! I'm interested in the 15-20 Pages Enterprise Website (₹15,000+).",
                "Enterprise Website Tier"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-card-border bg-background py-2.5 text-xs font-bold text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              <span>Scope Enterprise Portal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Deliverables Checklist */}
      <div className="mt-16 rounded-3xl border border-card-border bg-card/40 p-6 md:p-8">
        <h3 className="font-heading text-base font-bold uppercase tracking-wider text-foreground">
          What&apos;s Included In Every Build:
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {service.features.map((feat, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-foreground/90">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Step Process */}
      {service.process && service.process.length > 0 && (
        <div className="mt-20 rounded-3xl border border-card-border bg-card/60 p-8 md:p-12">
          <h3 className="font-heading text-2xl font-bold text-foreground text-center mb-8">
            How We Build Your Website
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step) => (
              <div key={step.step} className="rounded-2xl border border-card-border bg-background p-6">
                <span className="font-heading text-3xl font-black text-accent/50">
                  0{step.step}
                </span>
                <h4 className="mt-2 font-heading text-base font-bold text-foreground">
                  {step.title}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs */}
      {service.faq && service.faq.length > 0 && (
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="font-heading text-xl font-bold text-foreground text-center mb-6">
            Frequently Asked Questions
          </h3>
          <div className="divide-y divide-card-border/60 rounded-2xl border border-card-border bg-card">
            {service.faq.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="p-5">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full cursor-pointer items-center justify-between text-left"
                  >
                    <span className="font-heading text-sm font-bold text-foreground">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-accent" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3 text-xs leading-relaxed text-muted">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
