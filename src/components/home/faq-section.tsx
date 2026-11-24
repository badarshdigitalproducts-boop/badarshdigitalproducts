"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShieldCheck, Zap, Sparkles, HelpCircle, CheckCircle2, Lock } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { WHATSAPP_DISPLAY } from "@/lib/constants";

const faqs = [
  {
    q: "Do I need any paid software subscription to customize the design templates?",
    a: "Zero paid subscriptions required. Every design template in the BADARSH library is 100% ready to edit and export right in your browser or desktop using free tools and open Google Fonts. You will never encounter watermarks, paywalls, or surprise upgrade prompts.",
  },
  {
    q: "What can I do with the included Commercial License?",
    a: "You can customize and publish unlimited designs for both your personal brand and paying freelance or agency clients. You can use the assets in sponsored ads, client presentations, video overlays, and physical print collateral. The only restriction is that you cannot resell or redistribute the raw editable template files.",
  },
  {
    q: "How does instant digital delivery work after payment?",
    a: "The moment your payment is confirmed, an instant access window appears on your screen with direct 'Access Design Template' buttons and cloud download links. A permanent backup copy is also dispatched immediately to your email address for lifetime access.",
  },
  {
    q: "What if I face an issue with a link or need technical help?",
    a: `We provide dedicated founder support via WhatsApp (${WHATSAPP_DISPLAY}) and email (hello@badarsh.com). If any link is ever broken or you need assistance getting started, our team resolves issues within 2-4 hours. We also offer a 100% replacement guarantee.`,
  },
  {
    q: "Can I customize the templates with my own brand colors and fonts?",
    a: "Yes! You can select any template element, pick your brand hex color, and tap 'Change All'. Your entire 50-post pack or 25-slide deck updates in under 60 seconds with cohesive brand identity.",
  },
  {
    q: "How do your done-for-you creative services (Video & Websites) work?",
    a: "Simply tap 'Discuss Your Project' or contact us on WhatsApp. We conduct a fast 15-minute discovery chat, align on your goals, and begin production. Every project includes two complimentary revision cycles and direct communication with our senior creatives.",
  },
];

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

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-card-border bg-card shadow-xs transition-colors"
              >
                <button
                  type="button"
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

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="border-t border-card-border/60 px-5 pt-3 pb-5 text-xs leading-relaxed text-muted font-normal">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
