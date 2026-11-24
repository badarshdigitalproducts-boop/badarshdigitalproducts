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
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { products } from "@/content/products";

const shopCategories = [
  {
    slug: "bundles",
    name: "Bundles",
    desc: "Complete video editing master packs: 500+ sound effects, 100 transitions, 50 LUTs, and film overlays.",
    icon: Package,
    href: "/bundles",
    tag: "Master Packs",
  },
  {
    slug: "editing-apps",
    name: "Apps",
    desc: "Tested mobile editing software configurations, 4K export presets, and creator workflow guides.",
    icon: Smartphone,
    href: "/editing-apps",
    tag: "Mobile Tools",
  },
  {
    slug: "photo-presets",
    name: "Lightroom Presets",
    desc: "1-Click Adobe Lightroom Mobile (.DNG) and Desktop (.XMP) presets for natural skin tones and cinematic color.",
    icon: Sliders,
    href: "/photo-presets",
    tag: "1-Click DNG",
  },
  {
    slug: "editing-bundles",
    name: "Sound Effects & Audio",
    desc: "Master 24-bit WAV audio: Hollywood whooshes, impacts, ambient textures, and 4K motion overlays.",
    icon: Video,
    href: "/editing-bundles",
    tag: "Master Audio",
  },
  {
    slug: "ebooks",
    name: "E-Books",
    desc: "Practical founder playbooks, organic audience growth blueprints, and digital monetization guides.",
    icon: BookOpen,
    href: "/ebooks",
    tag: "Instant PDF",
  },
  {
    slug: "planners",
    name: "Planners",
    desc: "Personal operating systems: annual goals, workout tracking, nutrition logs, and daily habit systems.",
    icon: CalendarCheck,
    href: "/planners",
    tag: "Interactive PDF",
  },
  {
    slug: "templates",
    name: "Templates",
    desc: "Clean design templates: Instagram Reels, carousel slide decks, pitch presentations, and brand kits.",
    icon: LayoutGrid,
    href: "/templates",
    tag: "Design Files",
  },
];

export function Categories() {
  return (
    <section className="border-t border-card-border/60 bg-secondary/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Shop by Category"
          title="Curated Creative Toolkit"
          subtitle="Explore purpose-built assets for video editing, color grading, sound design, and creator business operations."
        />

        {/* Apple Horizontal Inertial Snap Carousel on Mobile / Clean Grid on Desktop */}
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none px-4 -mx-4 pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:px-0 sm:mx-0">
          {shopCategories.map((cat) => {
            const Icon = cat.icon;
            const count = products.filter((p) => p.category === cat.slug).length;

            return (
              <motion.div
                key={cat.slug}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
                className="w-[85vw] shrink-0 snap-center sm:w-auto"
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
                    <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-[#86868B] mt-2 sm:hidden">
          Swipe sideways to view collections &rarr;
        </p>
      </div>
    </section>
  );
}
