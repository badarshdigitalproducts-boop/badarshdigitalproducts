"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { STATS } from "@/lib/constants";
import { AnimatedCounter } from "@/components/shared/animated-counter";

export function Hero() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background Glows & Gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[450px] w-[600px] rounded-full bg-accent/15 blur-[120px]" />
        <div className="absolute top-1/4 -right-20 h-[350px] w-[450px] rounded-full bg-amber-500/10 blur-[100px]" />
        <div className="absolute -bottom-10 -left-20 h-[350px] w-[450px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Brand Identity Emblem with Apple Spring Entrance */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
            className="mb-6 flex justify-center"
          >
            <div className="group relative flex h-20 w-20 items-center justify-center rounded-3xl border border-border/60 bg-gradient-to-tr from-accent/15 via-purple-500/10 to-amber-500/15 p-3 shadow-xl backdrop-blur-xl transition-[transform,box-shadow] duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 active:scale-95 dark:border-white/20 dark:bg-gradient-to-tr dark:from-accent/20 dark:via-purple-900/30 dark:to-amber-500/20">
              <div className="absolute inset-0 rounded-3xl bg-amber-500/10 blur-xl group-hover:bg-accent/20" />
              {/* Light Theme: Dark Emblem (/logo-icon-dark-v3.png) | Dark Theme: White Emblem (/logo-icon-light-v3.png) */}
              <Image
                src={isDark ? "/logo-icon-light-v3.png" : "/logo-icon-dark-v3.png"}
                alt="BADARSH Brand Identity"
                width={512}
                height={512}
                className="relative z-10 h-full w-full object-contain filter drop-shadow-md"
                priority
                unoptimized
              />
            </div>
          </motion.div>

          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
            <span>Premium Digital Marketplace &amp; Creative Agency</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            Your Business, <br />
            <span className="bg-gradient-to-r from-accent via-purple-500 to-amber-500 bg-clip-text text-transparent">
              Beautifully Digital
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg leading-relaxed text-muted sm:text-xl"
          >
            Stand out online with handcrafted Canva templates, high-impact e-books,
            and professional done-for-you video editing &amp; website building.
            Built for modern businesses, shops, and creators.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/templates"
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-heading text-base font-bold text-white shadow-lg shadow-accent/25 transition-[transform,background-color,box-shadow] duration-150 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/35 active:scale-[0.97] sm:w-auto"
            >
              <span>Explore Products</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/services"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-card-border/80 bg-card/80 px-8 py-4 font-heading text-base font-bold text-foreground backdrop-blur-md transition-[transform,border-color,background-color] duration-150 hover:border-accent/40 hover:bg-card active:scale-[0.97] sm:w-auto"
            >
              <span>Done-For-You Services</span>
            </Link>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
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

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 gap-4 rounded-3xl border border-card-border/80 bg-card/50 p-6 backdrop-blur-xl sm:grid-cols-4 sm:p-8"
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

