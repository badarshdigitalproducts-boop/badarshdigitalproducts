"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Play,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Clock,
  ShieldCheck,
  Check,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { PricingTable } from "@/components/services/pricing-table";
import { services } from "@/content/services";
import { getWhatsAppUrl } from "@/lib/utils";

export default function VideoEditingPage() {
  const service = services.find((s) => s.slug === "video-editing") || services[0];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Hero */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent">
          <Video className="h-3.5 w-3.5" />
          BADARSH Video Production Studio
        </span>
        <h1 className="mt-4 font-heading text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Professional Video Editing for{" "}
          <span className="bg-gradient-to-r from-accent via-red-400 to-purple-500 bg-clip-text text-transparent">
            Reels, YouTube &amp; Ads
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Transform your raw footage into cinematic, high-retention content that captivates audiences. We handle dynamic cuts, Hormozi-style subtitles, sound design, and color grading tailored to your brand aesthetic.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={getWhatsAppUrl(
              "Hi BADARSH! I'm interested in video editing for my brand. Can we discuss turnaround and footage upload?",
              "Video Editing Inquiry"
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-heading text-xs font-bold text-white shadow-lg shadow-accent/25 hover:bg-accent-hover hover:scale-105 transition-all"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Send Raw Footage on WhatsApp (+91 72042 50115)</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* PORTFOLIO VIDEO PLAYER SECTION */}
      {service.portfolioVideos && service.portfolioVideos.length > 0 && (
        <div className="mt-16 rounded-3xl border border-card-border bg-card/60 p-6 md:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-8">
            <div>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                🎬 Real Work Portfolio
              </span>
              <h2 className="mt-2 font-heading text-2xl font-black text-foreground">
                Watch Our Edits — Inspect Quality Before You Hire
              </h2>
              <p className="text-xs text-muted">
                These are actual client edits produced by BADARSH editors. Hit play to preview pacing, sound effects, and color grading.
              </p>
            </div>
            <span className="text-xs text-emerald-500 font-bold flex items-center gap-1 shrink-0">
              <Check className="h-4 w-4" /> 100% In-House Cuts
            </span>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {service.portfolioVideos.map((videoSrc, vIdx) => (
              <div
                key={vIdx}
                className="group relative overflow-hidden rounded-2xl border border-card-border bg-black shadow-lg aspect-video"
              >
                <video
                  src={videoSrc}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-card-border/60 pt-4 text-xs text-muted">
            <span>Liked what you saw? Send your raw clips via Google Drive or WhatsApp.</span>
            <a
              href={getWhatsAppUrl(
                "Hi BADARSH! I watched your video edits and I'd like to book an edit.",
                "Video Editing Book"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-accent hover:underline flex items-center gap-1"
            >
              <span>Get A Quote On WhatsApp</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Deliverables Checklist */}
      <div className="mt-16 rounded-3xl border border-card-border bg-card/40 p-6 md:p-8">
        <h3 className="font-heading text-base font-bold uppercase tracking-wider text-foreground">
          What&apos;s Included In Every Edit:
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
            Transparent Rates
          </span>
          <h2 className="mt-2 font-heading text-3xl font-extrabold text-foreground">
            Simple Per-Video &amp; Monthly Retainer Pricing
          </h2>
          <p className="mt-2 text-xs text-muted">
            No surprise invoices. Unlimited revisions included until you are completely thrilled with the final cut.
          </p>
        </div>

        <PricingTable packages={service.packages} serviceTitle={service.title} />
      </div>

      {/* 4-Step Process */}
      {service.process && service.process.length > 0 && (
        <div className="mt-20 rounded-3xl border border-card-border bg-card/60 p-8 md:p-12">
          <h3 className="font-heading text-2xl font-bold text-foreground text-center mb-8">
            Our 4-Step Production Process
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
