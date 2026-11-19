"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Check,
  Eye,
} from "lucide-react";
import { PricingTable } from "@/components/services/pricing-table";
import { services } from "@/content/services";
import { getWhatsAppUrl } from "@/lib/utils";

export default function PhotoEditingPage() {
  const service = services.find((s) => s.slug === "photo-editing") || services[4];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Hero */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent">
          <Camera className="h-3.5 w-3.5" />
          BADARSH Retouching Studio
        </span>
        <h1 className="mt-4 font-heading text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl">
          High-End Commercial{" "}
          <span className="bg-gradient-to-r from-accent via-amber-400 to-orange-500 bg-clip-text text-transparent">
            Photo Editing &amp; Retouching
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Studio-grade frequency separation skin retouching, reflection cleanup, e-commerce pure-white cutouts, and color grading that meets the exacting standards of luxury brands and top marketplaces.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={getWhatsAppUrl(
              "Hi BADARSH! I have photos that need retouching. Can I send 1-2 samples to test your quality?",
              "Photo Retouching Inquiry"
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-heading text-xs font-bold text-white shadow-lg shadow-accent/25 hover:bg-accent-hover hover:scale-105 transition-all"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Send Sample Photos on WhatsApp (+91 72042 50115)</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* PORTFOLIO RETOUCHING GALLERY */}
      {service.portfolioImages && service.portfolioImages.length > 0 && (
        <div className="mt-16 rounded-3xl border border-card-border bg-card/60 p-6 md:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-8">
            <div>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                📸 Retouching &amp; Color Grading Portfolio
              </span>
              <h2 className="mt-2 font-heading text-2xl font-black text-foreground">
                Our Retouched Commercial Work
              </h2>
              <p className="text-xs text-muted">
                Inspect skin texture preservation, hair cleanup, metal reflection polishing, and natural shadows.
              </p>
            </div>
            <span className="text-xs text-emerald-500 font-bold flex items-center gap-1 shrink-0">
              <Check className="h-4 w-4" /> Studio-Grade Standard
            </span>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {service.portfolioImages.map((imgSrc, pIdx) => (
              <div
                key={pIdx}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm"
              >
                <img
                  src={imgSrc}
                  alt={`Retouched Work ${pIdx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-[11px] font-bold text-white">
                    BADARSH High-End Edit
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-card-border/60 pt-4 text-xs text-muted">
            <span>Need batch e-commerce processing? We deliver 20-50 photo batches in 48 hours.</span>
            <a
              href={getWhatsAppUrl(
                "Hi BADARSH! I need a batch of commercial photos edited.",
                "Photo Batch Order"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-accent hover:underline flex items-center gap-1"
            >
              <span>Get Batch Quote On WhatsApp</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Deliverables Checklist */}
      <div className="mt-16 rounded-3xl border border-card-border bg-card/40 p-6 md:p-8">
        <h3 className="font-heading text-base font-bold uppercase tracking-wider text-foreground">
          What&apos;s Included In Every Retouching Project:
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
            Fixed Package Rates
          </span>
          <h2 className="mt-2 font-heading text-3xl font-extrabold text-foreground">
            E-Commerce &amp; Commercial Retouching Packages
          </h2>
          <p className="mt-2 text-xs text-muted">
            High-resolution print export, 300 DPI CMYK, and pure white web PNGs included.
          </p>
        </div>

        <PricingTable packages={service.packages} serviceTitle={service.title} />
      </div>

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
