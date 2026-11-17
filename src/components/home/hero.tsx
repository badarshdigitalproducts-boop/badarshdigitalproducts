"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Layers, Sparkles, Layout, Palette } from "lucide-react";
import { STATS } from "@/lib/constants";
import { AnimatedCounter } from "@/components/shared/animated-counter";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background Ambience — strictly centered, zero horizontal overflow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] max-w-[90vw] rounded-full bg-accent/6 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow Badge — Apple-grade minimalist pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card/80 px-4 py-1.5 text-xs font-medium text-muted shadow-xs backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-accent" />
            <span className="font-semibold text-foreground">BADARSH Creative Studio</span>
            <span className="text-muted/50">•</span>
            <span>Canva Templates &amp; Pro Services</span>
          </motion.div>

          {/* Main Headline — Apple bold typographic hierarchy */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-extrabold tracking-[-0.035em] text-foreground leading-[1.06]"
          >
            Your Business, <br className="hidden sm:inline" />
            Beautifully Digital.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-lg sm:text-xl leading-relaxed text-muted max-w-2xl mx-auto font-normal tracking-tight"
          >
            Handcrafted Canva templates, high-conversion playbooks, and done-for-you creative services engineered to elevate your brand presence.
          </motion.p>

          {/* Apple-Grade Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Link
              href="/templates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-8 py-3.5 text-sm font-semibold shadow-xs transition-all duration-150 hover:opacity-90 active:scale-[0.97]"
            >
              <span>Explore Products</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-card-border bg-card/80 backdrop-blur-md px-8 py-3.5 text-sm font-semibold text-foreground shadow-xs transition-all duration-150 hover:bg-card hover:border-foreground/20 active:scale-[0.97]"
            >
              <span>Done-For-You Services</span>
            </Link>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>100% Canva Editable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Instant Download</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Commercial License Included</span>
            </div>
          </motion.div>
        </div>

        {/* Apple-Grade Product Showcase Stage (Interactive Bento Dock) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Showcase Card 1: Social Media Carousel */}
            <Link
              href="/templates/instagram-reels-template-pack"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-card-border bg-card p-6 shadow-xs transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 active:scale-[0.985]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-bold text-accent">
                    Social Media
                  </span>
                  <span className="text-[11px] text-muted">65+ Templates</span>
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                  Viral Instagram Carousel &amp; Reels Suite
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  High-converting layouts for educational carousels, video covers, and viral story hooks.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-card-border/60 pt-4 text-xs">
                <span className="font-semibold text-foreground">Canva Free &bull; 1080x1350</span>
                <span className="flex items-center gap-1 font-bold text-accent">
                  View <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            {/* Showcase Card 2: Elevated Center Brand Kit */}
            <Link
              href="/templates"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-accent/30 bg-card p-6 shadow-md transition-all duration-300 hover:border-accent hover:shadow-2xl hover:shadow-accent/10 active:scale-[0.985] md:-translate-y-2"
            >
              <div className="absolute top-0 right-0 rounded-bl-xl bg-accent px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Featured System
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    Full Identity
                  </span>
                  <span className="text-[11px] text-muted">200+ Assets</span>
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                  Master Brand Identity &amp; Launch System
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Complete brand guideline book, typography scales, logo suites, and NFC business cards.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-card-border/60 pt-4 text-xs">
                <span className="font-semibold text-foreground">Turnkey Kit &bull; Instant Access</span>
                <span className="flex items-center gap-1 font-bold text-accent">
                  Explore <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            {/* Showcase Card 3: Pitch Decks & Proposals */}
            <Link
              href="/templates/linkedin-carousel-templates"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-card-border bg-card p-6 shadow-xs transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 active:scale-[0.985]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    Pitch &amp; Sales
                  </span>
                  <span className="text-[11px] text-muted">40+ Slides</span>
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                  Investor Pitch Deck &amp; Agency Proposal
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Tested presentation architecture designed to close enterprise deals and secure funding.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-card-border/60 pt-4 text-xs">
                <span className="font-semibold text-foreground">16:9 4K &bull; PPTX &amp; Canva</span>
                <span className="flex items-center gap-1 font-bold text-accent">
                  View <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Stats Strip — Apple-grade minimalist dock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-card-border bg-card/60 p-6 backdrop-blur-xl shadow-xs"
        >
          {STATS.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

