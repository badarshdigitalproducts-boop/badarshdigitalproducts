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
  Sliders,
} from "lucide-react";
import { PricingTable } from "@/components/services/pricing-table";
import { BeforeAfterSlider } from "@/components/shared/before-after-slider";
import { services } from "@/content/services";
import { getWhatsAppUrl } from "@/lib/utils";

export default function PhotoEditingPage() {
  const service = services.find((s) => s.slug === "photo-editing") || services[4];
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
            Commercial Photo Retouching
          </h1>
          <p className="mt-1 text-sm text-muted">
            Drag the comparison sliders below to inspect frequency separation skin texture, lighting, and commercial grading.
          </p>
        </div>
        <a
          href={getWhatsAppUrl(
            "Hi BADARSH! I have photos that need retouching. Can I send 1-2 sample photos to test your quality?",
            "Photo Retouching Inquiry"
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-accent-hover transition-all shrink-0 self-start sm:self-auto"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Send Sample on WhatsApp</span>
        </a>
      </div>

      {/* INTERACTIVE BEFORE & AFTER SLIDER SHOWCASE */}
      <div className="rounded-3xl border border-card-border bg-card/60 p-5 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-8">
          <div>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
              Interactive Quality Inspection
            </span>
            <h2 className="mt-2 font-heading text-2xl font-black text-foreground">
              Drag Slider to Inspect Retouching Quality
            </h2>
            <p className="text-xs text-muted">
              Slide back and forth to see skin texture preservation, frequency separation, lighting refinement, and color grading.
            </p>
          </div>
          <span className="text-xs text-emerald-500 font-bold flex items-center gap-1 shrink-0">
            <Check className="h-4 w-4" /> Studio-Grade Standard
          </span>
        </div>

        {/* 2 Interactive Comparison Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <BeforeAfterSlider
              beforeImage="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=70&auto=format&fit=crop"
              afterImage="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80&auto=format&fit=crop"
              beforeLabel="Raw Camera Shot"
              afterLabel="BADARSH Retouched"
              aspectRatio="aspect-[4/3]"
            />
            <div className="mt-2.5 text-center text-xs text-muted font-medium">
              Editorial Portrait &bull; Frequency Separation &amp; Skin Texture
            </div>
          </div>

          <div>
            <BeforeAfterSlider
              beforeImage="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=1200&q=70&auto=format&fit=crop"
              afterImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&auto=format&fit=crop"
              beforeLabel="Unedited Raw"
              afterLabel="Commercial Grade"
              aspectRatio="aspect-[4/3]"
            />
            <div className="mt-2.5 text-center text-xs text-muted font-medium">
              Fashion Campaign &bull; Blemish Clean &amp; Contrast Polish
            </div>
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {service.portfolioImages && service.portfolioImages.length > 0 && (
          <div className="mt-10 pt-8 border-t border-card-border/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
              More Work Samples
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-[11px] font-bold text-white">
                      BADARSH Commercial Retouch
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-card-border/60 pt-4 text-xs text-muted">
          <span>Need 1 photo retouched or 500 catalog images? We deliver in 24 to 48 hours.</span>
          <a
            href={getWhatsAppUrl(
              "Hi BADARSH! I saw your before/after retouching samples and want to send my photos.",
              "Photo Editing Booking"
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-accent hover:underline flex items-center gap-1"
          >
            <span>Message on WhatsApp</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Deliverables Checklist */}
      <div className="mt-16 rounded-3xl border border-card-border bg-card/40 p-6 md:p-8">
        <h3 className="font-heading text-base font-bold uppercase tracking-wider text-foreground">
          What&apos;s Included In Every Retouch:
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

      {/* Pricing Packages (₹150 to ₹799) */}
      <div className="mt-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            Transparent Pricing
          </span>
          <h2 className="mt-2 font-heading text-3xl font-extrabold text-foreground">
            Per-Photo &amp; Catalog Retouching Rates
          </h2>
          <p className="mt-2 text-xs text-muted">
            Simple rates starting at ₹150. Free sample edit available for bulk projects.
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
