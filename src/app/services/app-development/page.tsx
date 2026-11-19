"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Zap,
  Code2,
  Cpu,
  ShieldCheck,
  Check,
} from "lucide-react";
import { PricingTable } from "@/components/services/pricing-table";
import { services } from "@/content/services";
import { getWhatsAppUrl } from "@/lib/utils";

export default function AppDevelopmentPage() {
  const service = services.find((s) => s.slug === "app-development") || services[3];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Hero */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent">
          <Smartphone className="h-3.5 w-3.5" />
          Cross-Platform Mobile Studio
        </span>
        <h1 className="mt-4 font-heading text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Mobile App Development for{" "}
          <span className="bg-gradient-to-r from-accent via-blue-400 to-indigo-500 bg-clip-text text-transparent">
            iOS &amp; Android
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Turn your app concept into a production-ready mobile application on the Apple App Store and Google Play. We develop responsive cross-platform apps using React Native and Flutter with secure authentication, real-time database sync, push notifications, and payment processing.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={getWhatsAppUrl(
              "Hi BADARSH! I have an app idea. Can we schedule a scoping call to discuss development?",
              "Mobile App Inquiry"
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-heading text-xs font-bold text-white shadow-lg shadow-accent/25 hover:bg-accent-hover hover:scale-105 transition-all"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Discuss Your App on WhatsApp (+91 72042 50115)</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* TIERED APP DEVELOPMENT RATES */}
      <div className="mt-16 rounded-3xl border border-accent/30 bg-gradient-to-r from-accent/15 via-blue-900/10 to-card p-6 md:p-10 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
            📱 Tiered Mobile App Packages
          </span>
          <h2 className="mt-3 font-heading text-2xl font-black text-foreground sm:text-3xl">
            Flexible Mobile App Rates
          </h2>
          <p className="mt-1 text-xs text-muted">
            From quick MVP validation prototypes to full enterprise applications with complete source code ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Tier 1 */}
          <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm hover:border-accent/40 transition-colors">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Prototype Tier
            </span>
            <h3 className="mt-1 font-heading text-lg font-bold text-foreground">
              MVP Mobile Prototype
            </h3>
            <div className="mt-3 font-heading text-3xl font-extrabold text-foreground">
              ₹12,999
            </div>
            <p className="mt-2 text-xs text-muted">
              Fast validation build for Android APK or iOS TestFlight. Up to 5 screens with Firebase backend.
            </p>

            <ul className="mt-6 space-y-2 border-t border-card-border/60 pt-4 text-xs text-foreground/90">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Single platform (Android or iOS)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Up to 5 functional UI screens</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Firebase database &amp; auth</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Delivery in 14 to 18 business days</span>
              </li>
            </ul>

            <a
              href={getWhatsAppUrl(
                "Hi BADARSH! I'm interested in the MVP Mobile App package (₹12,999).",
                "MVP App Tier"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-card-border bg-background py-2.5 text-xs font-bold text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              <span>Scope MVP App</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Tier 2 */}
          <div className="relative rounded-2xl border-2 border-accent bg-card p-6 shadow-xl">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Most Popular
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Pro Tier
            </span>
            <h3 className="mt-1 font-heading text-lg font-bold text-foreground">
              Cross-Platform Pro
            </h3>
            <div className="mt-3 font-heading text-3xl font-extrabold text-foreground">
              ₹24,999
            </div>
            <p className="mt-2 text-xs text-muted">
              Both iOS &amp; Android builds, admin dashboard, in-app payments, and push notifications.
            </p>

            <ul className="mt-6 space-y-2 border-t border-card-border/60 pt-4 text-xs text-foreground/90">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Both iOS &amp; Android native builds</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Up to 12 responsive screens</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>UPI / Razorpay / Stripe integration</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Admin CMS control panel</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Delivery in 25 to 30 business days</span>
              </li>
            </ul>

            <a
              href={getWhatsAppUrl(
                "Hi BADARSH! I'm interested in the Cross-Platform Pro App package (₹24,999).",
                "Cross-Platform Pro App Tier"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent py-2.5 text-xs font-bold text-white shadow-md hover:bg-accent-hover transition-colors"
            >
              <span>Build Cross-Platform App</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Tier 3 */}
          <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm hover:border-accent/40 transition-colors">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Enterprise Tier
            </span>
            <h3 className="mt-1 font-heading text-lg font-bold text-foreground">
              Full Enterprise Mobile Platform
            </h3>
            <div className="mt-3 font-heading text-3xl font-extrabold text-foreground">
              ₹49,999+
            </div>
            <p className="mt-2 text-xs text-muted">
              Complex mobile systems with real-time chat, AI integration, and high-concurrency cloud backend.
            </p>

            <ul className="mt-6 space-y-2 border-t border-card-border/60 pt-4 text-xs text-foreground/90">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>15+ custom screens &amp; workflows</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Real-time chat, live streaming or AI</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>100% full source code ownership</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Store publishing compliance guarantee</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>6 months dedicated priority support</span>
              </li>
            </ul>

            <a
              href={getWhatsAppUrl(
                "Hi BADARSH! I'm interested in the Full Enterprise App Development package (₹49,999+).",
                "Enterprise App Tier"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-card-border bg-background py-2.5 text-xs font-bold text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              <span>Schedule Technical Scoping</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Deliverables Checklist */}
      <div className="mt-16 rounded-3xl border border-card-border bg-card/40 p-6 md:p-8">
        <h3 className="font-heading text-base font-bold uppercase tracking-wider text-foreground">
          What&apos;s Included In Every App Build:
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
