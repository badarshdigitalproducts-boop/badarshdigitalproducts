"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, CheckCircle2, ShieldCheck, Zap, Smartphone, Video, Code2 } from "lucide-react";
import { STATS } from "@/lib/constants";
import { AnimatedCounter } from "@/components/shared/animated-counter";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28">
      {/* Background Ambience — Subtle Apple Keynote Specular Radial Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[420px] w-[900px] max-w-[95vw] rounded-full bg-gradient-to-b from-accent/10 via-foreground/[0.03] to-transparent blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow Label — Apple micro-typography */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
              BADARSH 2026 &bull; PRO CREATIVE ECOSYSTEM
            </span>
          </motion.div>

          {/* Main Headline — Apple Display Typography (Theme-Aware, High-Contrast) */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 apple-display text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold text-foreground tracking-[-0.035em] leading-[1.03]"
          >
            Pro tools. <br className="hidden sm:inline" />
            <span className="text-foreground/75">Pure impact.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 apple-subhead text-base sm:text-xl leading-relaxed text-muted max-w-2xl mx-auto font-normal"
          >
            Master video editing vaults, sound effects &amp; BG music, 1-click Lightroom presets, verified creator apps, and custom web engineering. Zero fluff. Pure production quality.
          </motion.p>

          {/* Apple-Exact Button Duo: Solid Pill + Retinal Blue Chevron Link */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/bundles"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-foreground text-background hover:opacity-90 px-7 py-2.5 text-sm font-semibold tracking-tight shadow-sm active:scale-[0.97] transition-all"
            >
              <span>Explore Shop</span>
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-normal text-accent hover:underline px-4 py-2 group transition-colors"
            >
              <span>Our Done-For-You Services</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>4K Master Assets</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Direct Cloud Access</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              <span>WhatsApp Founder Desk</span>
            </div>
          </motion.div>
        </div>

        {/* Product Showcase Bento Dock (Mobile Inertial Snap Carousel / Desktop Grid) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 max-w-5xl mx-auto"
        >
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none px-4 -mx-4 pb-4 md:grid md:grid-cols-3 md:px-0 md:mx-0">
            {/* Card 1: Editing Apps */}
            <Link
              href="/editing-apps"
              className="group relative flex w-[85vw] shrink-0 snap-center sm:w-[340px] md:w-auto flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-xs transition-all duration-300 hover:border-foreground/25 hover:shadow-xl active:scale-[0.985]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
                    <Smartphone className="h-3 w-3 text-emerald-500" /> Mobile Apps
                  </span>
                  <span className="text-[11px] text-muted">Creator Pro</span>
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                  CapCut Pro &amp; Creator Apps
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Verified mobile tools with VIP transitions, 4K 60fps export, and AI cutout features unlocked.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs">
                <span className="font-medium text-muted">Direct Download</span>
                <span className="flex items-center gap-1 font-semibold text-accent group-hover:underline">
                  Get App <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            {/* Card 2: Elevated Center Flagship Vault */}
            <Link
              href="/bundles"
              className="group relative flex w-[85vw] shrink-0 snap-center sm:w-[340px] md:w-auto flex-col justify-between overflow-hidden rounded-2xl border border-accent/50 bg-card p-6 shadow-md transition-all duration-300 hover:border-accent hover:shadow-2xl hover:shadow-accent/10 active:scale-[0.985] md:-translate-y-2"
            >
              <div className="absolute top-0 right-0 rounded-bl-xl bg-accent px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Flagship
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 rounded-md bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                    <Video className="h-3 w-3" /> Master Pack
                  </span>
                  <span className="text-[11px] text-muted">700+ Assets</span>
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                  2026 Video Editing Vault
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  500+ uncompressed WAV sound effects, 100 transitions, 50 LUTs, and 4K green screen VFX elements.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs">
                <span className="font-medium text-muted">Cloud Drive Access</span>
                <span className="flex items-center gap-1 font-semibold text-accent">
                  Unlock Vault <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            {/* Card 3: Agency Production & Web */}
            <Link
              href="/services"
              className="group relative flex w-[85vw] shrink-0 snap-center sm:w-[340px] md:w-auto flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-xs transition-all duration-300 hover:border-foreground/25 hover:shadow-xl active:scale-[0.985]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
                    <Code2 className="h-3 w-3 text-blue-500" /> Agency
                  </span>
                  <span className="text-[11px] text-muted">₹3k – ₹15k</span>
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                  Website Dev &amp; Video Editing
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  High-speed Next.js websites, cinematic reel edits, and full brand identities with WhatsApp delivery.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs">
                <span className="font-medium text-muted">Direct Consultation</span>
                <span className="flex items-center gap-1 font-semibold text-accent group-hover:underline">
                  View Tiers <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Stats Strip — Apple-grade minimalist dock */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-xl shadow-xs"
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
