"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  Download,
  Eye,
  Check,
  Palette,
  ShieldCheck,
} from "lucide-react";
import { PricingTable } from "@/components/services/pricing-table";
import { services } from "@/content/services";
import { getWhatsAppUrl } from "@/lib/utils";

export default function BrandIdentityPage() {
  const service = services.find((s) => s.slug === "brand-identity") || services[5];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Hero */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent">
          <Sparkles className="h-3.5 w-3.5" />
          BADARSH Brand &amp; Identity Atelier
        </span>
        <h1 className="mt-4 apple-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Brand Identity &amp; <span className="text-accent">Custom Logo Design</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          We design timeless logo marks, comprehensive typography systems, and brand guideline books that position your business as an undeniable industry leader. Inspect our portfolio of designed logos below, download sample vectors, or connect directly on WhatsApp to order your custom logo.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={getWhatsAppUrl(
              "Hi BADARSH! I want to order a custom logo design for my brand. Let's discuss requirements!",
              "Custom Logo Order"
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-heading text-xs font-bold text-white shadow-lg shadow-accent/25 hover:bg-accent-hover hover:scale-105 transition-all"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Order Your Custom Logo on WhatsApp</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* DESIGNED LOGOS SHOWCASE GALLERY */}
      {service.portfolioImages && service.portfolioImages.length > 0 && (
        <div className="mt-16 rounded-3xl border border-card-border bg-card/60 p-6 md:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                ✨ Designed Logos Gallery
              </span>
              <h2 className="mt-2 font-heading text-2xl font-black text-foreground">
                Our Designed Logos — Build Trust First
              </h2>
              <p className="text-xs text-muted">
                Inspect vector curves, balance, typography pairing, and monochrome adaptability.
              </p>
            </div>

            <a
              href="https://drive.google.com/drive/folders/BADARSH_SAMPLE_LOGOS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-card-border bg-background px-5 py-2.5 text-xs font-bold text-foreground hover:border-accent hover:text-accent transition-colors shrink-0"
            >
              <Download className="h-4 w-4 text-accent" />
              <span>Download Sample Logos</span>
            </a>
          </div>

          {/* Logo Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {service.portfolioImages.map((logoImg, lIdx) => (
              <div
                key={lIdx}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-card-border bg-white p-4 shadow-sm flex items-center justify-center"
              >
                <img
                  src={logoImg}
                  alt={`Logo Design ${lIdx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
                />
              </div>
            ))}
          </div>

          {/* WhatsApp Direct Order Callout */}
          <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/10 p-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Want a Custom Logo &amp; Brand System for Your Business?
              </h3>
              <p className="mt-1 text-xs text-muted">
                100% original vector concepts, AI/SVG/PDF vector sources, and full commercial copyright transfer.
              </p>
            </div>
            <a
              href={getWhatsAppUrl(
                "Hi BADARSH! I want to order a custom logo and brand system. Can we schedule a brief brand discovery call?",
                "Custom Logo Order"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-accent-hover shrink-0"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Order Custom Logo on WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Deliverables Checklist */}
      <div className="mt-16 rounded-3xl border border-card-border bg-card/40 p-6 md:p-8">
        <h3 className="font-heading text-base font-bold uppercase tracking-wider text-foreground">
          What&apos;s Included In Every Identity Suite:
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

      {/* Pricing Packages */}
      <div className="mt-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            Brand Identity Packages
          </span>
          <h2 className="mt-2 font-heading text-3xl font-extrabold text-foreground">
            Logo &amp; Brand System Packages
          </h2>
          <p className="mt-2 text-xs text-muted">
            All packages include vector AI, SVG, EPS, high-res PNG, and comprehensive brand guidelines.
          </p>
        </div>

        <PricingTable packages={service.packages} serviceTitle={service.title} />
      </div>

      {/* 4-Step Process */}
      {service.process && service.process.length > 0 && (
        <div className="mt-20 rounded-3xl border border-card-border bg-card/60 p-8 md:p-12">
          <h3 className="font-heading text-2xl font-bold text-foreground text-center mb-8">
            Our Brand Design Process
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
