"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  CalendarCheck,
  Package,
  Smartphone,
  Video,
  Sliders,
  Layout,
  ArrowRight,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { products } from "@/content/products";

const shopCategories = [
  {
    slug: "editing-apps",
    name: "Editing Apps & APKs",
    desc: "Verified CapCut Pro & creator tools with VIP features unlocked and direct APK downloads.",
    icon: Smartphone,
    href: "/editing-apps",
    tag: "Direct APK",
  },
  {
    slug: "bundles",
    name: "All-in-One Mega Bundles",
    desc: "Complete 2026 video editing vaults: 500+ SFX, 100 transitions, 50 LUTs, and green screens.",
    icon: Package,
    href: "/bundles",
    tag: "Studio Vault",
  },
  {
    slug: "photo-presets",
    name: "Lightroom Presets",
    desc: "1-Click Adobe Lightroom Mobile (.DNG) and Desktop (.XMP) presets for cinematic skin and mood.",
    icon: Sliders,
    href: "/photo-presets",
    tag: "1-Click DNG",
  },
  {
    slug: "editing-bundles",
    name: "Video SFX & Motion Overlays",
    desc: "Master 24-bit WAV sound effects and 4K ProRes transparent alpha overlays for high retention.",
    icon: Video,
    href: "/editing-bundles",
    tag: "4K Master",
  },
  {
    slug: "ebooks",
    name: "Business E-Books",
    desc: "Battle-tested founder playbooks, organic growth blueprints, and monetization roadmaps.",
    icon: BookOpen,
    href: "/ebooks",
    tag: "Instant PDF",
  },
  {
    slug: "planners",
    name: "Productivity Planners",
    desc: "Life operating systems: career milestones, gym workout splits, nutrition logs, and habit trackers.",
    icon: CalendarCheck,
    href: "/planners",
    tag: "Interactive PDF",
  },
];

export function Categories() {
  return (
    <section className="border-t border-card-border/60 bg-secondary/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Creator Ecosystem"
          title="Dedicated Shop Collections"
          subtitle="Explore purpose-built creative assets, mobile software packages, and high-performance digital blueprints."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shopCategories.map((cat) => {
            const Icon = cat.icon;
            const count = products.filter((p) => p.category === cat.slug).length;

            return (
              <motion.div
                key={cat.slug}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
              >
                <Link
                  href={cat.href}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-card-border bg-card p-6 shadow-xs transition-all duration-300 hover:border-foreground/20 hover:shadow-xl hover:shadow-black/[0.04] active:scale-[0.985]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary border border-card-border text-foreground transition-transform duration-300 group-hover:scale-105 group-hover:text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                        {cat.tag}
                      </span>
                    </div>

                    <h3 className="mt-5 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                      {cat.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted font-normal">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-card-border/60 pt-4 text-xs font-semibold text-foreground group-hover:text-accent transition-colors">
                    <span>Enter Dedicated Shop</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
