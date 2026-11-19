"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Layers, Sparkles, Smartphone, Video, Code, MessageCircle } from "lucide-react";
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
          {/* Eyebrow Label — Apple-grade minimalist micro-typography */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card/80 px-4 py-1.5 text-xs font-medium text-muted shadow-xs backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-accent" />
            <span className="font-semibold text-foreground">BADARSH Digital Studio</span>
            <span className="text-muted/50">&bull;</span>
            <span>Digital Products &amp; Production Agency</span>
          </motion.div>

          {/* Main Headline — Apple optical typography */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 apple-display text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-extrabold text-foreground tracking-[-0.035em] leading-[1.04]"
          >
            Everything Creators Need. <br className="hidden sm:inline" />
            Engineered To Convert.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-lg sm:text-xl leading-relaxed text-muted max-w-2xl mx-auto font-normal apple-subhead"
          >
            Production-grade video editing bundles, Lightroom presets, verified mobile creator apps, and high-conversion done-for-you digital services.
          </motion.p>

          {/* Apple-Grade Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Link
              href="/bundles"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-8 py-3.5 text-sm font-semibold shadow-xs transition-all duration-150 hover:opacity-90 active:scale-[0.97]"
            >
              <span>Explore Products</span>
              <ArrowRight className="h-4 w-4" />
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
              <span>4K Master Quality Assets</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Direct Cloud Drive Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Direct WhatsApp Support</span>
            </div>
          </motion.div>
        </div>

        {/* Product Showcase Bento Dock (The 3 Real Ecosystem Pillars) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Showcase 1: Editing Apps (APKs) */}
            <Link
              href="/editing-apps"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-card-border bg-card p-6 shadow-xs transition-all duration-300 hover:border-foreground/20 hover:shadow-xl hover:shadow-black/5 active:scale-[0.985]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <Smartphone className="h-3 w-3" /> Editing Apps
                  </span>
                  <span className="text-[11px] text-muted">Android APK</span>
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                  CapCut Pro &amp; Mobile Creator Suite
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Direct verified APK packages with VIP transitions, 4K 60fps export, and AI cutout features unlocked.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-card-border/60 pt-4 text-xs">
                <span className="font-semibold text-foreground">Verified Clean &bull; Instant Install</span>
                <span className="flex items-center gap-1 font-bold text-accent">
                  Download <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            {/* Showcase 2: Elevated Center: 2026 Video Mega Bundle & SFX */}
            <Link
              href="/bundles"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-accent/40 bg-card p-6 shadow-md transition-all duration-300 hover:border-accent hover:shadow-2xl hover:shadow-accent/10 active:scale-[0.985] md:-translate-y-2"
            >
              <div className="absolute top-0 right-0 rounded-bl-xl bg-accent px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Flagship Vault
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-bold text-accent">
                    <Video className="h-3 w-3" /> Mega Bundle
                  </span>
                  <span className="text-[11px] text-muted">700+ Assets</span>
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                  2026 Video Editing &amp; SFX Vault
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  500+ uncompressed WAV sound effects, 100 transitions, 50 LUTs, and 4K green screen VFX from BADARSH cloud drive.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-card-border/60 pt-4 text-xs">
                <span className="font-semibold text-foreground">Lifetime Cloud Access</span>
                <span className="flex items-center gap-1 font-bold text-accent">
                  Unlock Vault <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            {/* Showcase 3: Done-For-You Production & Web Services */}
            <Link
              href="/services"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-card-border bg-card p-6 shadow-xs transition-all duration-300 hover:border-foreground/20 hover:shadow-xl hover:shadow-black/5 active:scale-[0.985]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    <Code className="h-3 w-3" /> Client Services
                  </span>
                  <span className="text-[11px] text-muted">Web &bull; Video</span>
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                  Website Dev &amp; Video Production
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  High-converting Next.js websites (₹3k–₹15k), cinematic reel edits, and full brand identity systems with WhatsApp delivery.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-card-border/60 pt-4 text-xs">
                <span className="font-semibold text-foreground">Direct WhatsApp Consultation</span>
                <span className="flex items-center gap-1 font-bold text-accent">
                  View Tiers <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
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
