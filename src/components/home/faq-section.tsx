"use client";

import { useState } from "react";
import { ChevronDown, ShieldCheck, Zap, CheckCircle2, Lock } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { HOME_FAQS } from "@/content/faqs";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 md:py-28 border-t border-card-border/60 bg-secondary/20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Common Questions"
          title="Frequently Asked Questions"
          subtitle="Clear answers about file formats, commercial licenses, instant downloads, and founder support."
        />

        {/* Purchase Confidence Cues Banner */}
        <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-2.5 rounded-2xl border border-card-border bg-card p-3.5 shadow-xs">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-heading text-xs font-bold text-foreground block">Master Files</span>
              <span className="text-[10px] text-muted block">4K &bull; WAV &bull; Presets</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border border-card-border bg-card p-3.5 shadow-xs">
            <Zap className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-heading text-xs font-bold text-foreground block">Direct Download</span>
              <span className="text-[10px] text-muted block">Instant into your tray</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border border-card-border bg-card p-3.5 shadow-xs">
            <ShieldCheck className="h-5 w-5 text-blue-400 shrink-0" />
            <div>
              <span className="font-heading text-xs font-bold text-foreground block">Commercial License</span>
              <span className="text-[10px] text-muted block">Use on client projects</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border border-card-border bg-card p-3.5 shadow-xs">
            <Lock className="h-5 w-5 text-purple-400 shrink-0" />
            <div>
              <span className="font-heading text-xs font-bold text-foreground block">Secure Checkout</span>
              <span className="text-[10px] text-muted block">UPI, Cards &amp; NetBanking</span>
            </div>
          </div>
        </div>

        {/* Accordion List — Answers stay rendered in SSR HTML for SEO */}
        <div className="space-y-3.5">
          {HOME_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-card-border bg-card shadow-xs transition-colors"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggle(idx)}
                  className="flex w-full cursor-pointer items-center justify-between p-5 text-left text-sm font-bold text-foreground hover:text-accent transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>

                <div
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-200 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-card-border/60 px-5 pt-3 pb-5 text-xs leading-relaxed text-muted font-normal">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
