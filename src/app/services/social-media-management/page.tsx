"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Check,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { PricingTable } from "@/components/services/pricing-table";
import { services } from "@/content/services";
import { getWhatsAppUrl } from "@/lib/utils";

export default function SocialMediaManagementPage() {
  const service = services.find((s) => s.slug === "social-media-management") || services[2];
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
            Social Media Management
          </h1>
          <p className="mt-1 text-sm text-muted">
            End-to-end content calendars, edited Reels, copywriting, scheduling, and community management.
          </p>
        </div>
        <a
          href={getWhatsAppUrl(
            "Hi BADARSH! I'm interested in monthly social media management for my brand. Let's schedule a kickoff call!",
            "Social Media Management Inquiry"
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-accent-hover transition-all shrink-0 self-start sm:self-auto"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Book Kickoff on WhatsApp</span>
        </a>
      </div>

      {/* 4 Pillars of Social Media Dominance */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-card-border bg-card/60 p-6">
          <Calendar className="h-8 w-8 text-accent mb-3" />
          <h4 className="font-heading text-base font-bold text-foreground">30-Day Strategy</h4>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            Every post, Reel, and story mapped out in advance for your approval before publishing.
          </p>
        </div>
        <div className="rounded-2xl border border-card-border bg-card/60 p-6">
          <Sparkles className="h-8 w-8 text-purple-400 mb-3" />
          <h4 className="font-heading text-base font-bold text-foreground">Custom Creatives</h4>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            Studio-grade graphics, carousels, and motion Reels matching Apple-level aesthetic standards.
          </p>
        </div>
        <div className="rounded-2xl border border-card-border bg-card/60 p-6">
          <TrendingUp className="h-8 w-8 text-emerald-500 mb-3" />
          <h4 className="font-heading text-base font-bold text-foreground">Organic Reach</h4>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            Hashtag science, viral hook pacing, and engagement tactics that convert views into leads.
          </p>
        </div>
        <div className="rounded-2xl border border-card-border bg-card/60 p-6">
          <MessageSquare className="h-8 w-8 text-blue-400 mb-3" />
          <h4 className="font-heading text-base font-bold text-foreground">Community Growth</h4>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            Daily replies to comments and prospective customer DMs during standard business hours.
          </p>
        </div>
      </div>

      {/* Deliverables Checklist */}
      <div className="mt-16 rounded-3xl border border-card-border bg-card/40 p-6 md:p-8">
        <h3 className="font-heading text-base font-bold uppercase tracking-wider text-foreground">
          What&apos;s Included In Every Management Retainer:
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
            Monthly Retainers
          </span>
          <h2 className="mt-2 font-heading text-3xl font-extrabold text-foreground">
            Monthly Social Media Growth Packages
          </h2>
          <p className="mt-2 text-xs text-muted">
            Flexible month-to-month contracts. Cancel or upgrade anytime with zero lock-in penalty.
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
