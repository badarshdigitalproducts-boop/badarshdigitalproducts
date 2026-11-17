"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Share2,
  Presentation,
  Palette,
  CreditCard,
  BookOpen,
  CalendarCheck,
  Package,
  Layers,
  ArrowRight,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { products } from "@/content/products";

const categoryMeta = [
  {
    slug: "social-media",
    name: "Social Media Templates",
    desc: "Reels covers, Instagram carousels, post packs",
    icon: Share2,
  },
  {
    slug: "presentations",
    name: "Presentation Decks",
    desc: "Investor pitch decks, agency proposals, webinar slides",
    icon: Presentation,
  },
  {
    slug: "branding",
    name: "Brand Identity Kits",
    desc: "Logos, brand guidelines, typography systems",
    icon: Palette,
  },
  {
    slug: "ebooks",
    name: "E-Books & Playbooks",
    desc: "Step-by-step blueprints for marketing & organic growth",
    icon: BookOpen,
  },
  {
    slug: "planners",
    name: "Digital Planners",
    desc: "30/60/90-day content calendars & business organizers",
    icon: CalendarCheck,
  },
  {
    slug: "business-cards",
    name: "Business Cards & Stationery",
    desc: "Luxury NFC-ready card layouts & shop invoices",
    icon: CreditCard,
  },
  {
    slug: "bundles",
    name: "Mega Starter Bundles",
    desc: "All-in-one business launch suites with 200+ assets",
    icon: Package,
  },
  {
    slug: "assets",
    name: "Digital Graphics & Icons",
    desc: "Premium mockups, texture packs & UI elements",
    icon: Layers,
  },
];

export function Categories() {
  return (
    <section className="border-t border-card-border/60 bg-secondary/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Curated Collections"
          title="Engineered For Every Need"
          subtitle="Explore tailored creative suites built to save hundreds of design hours."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categoryMeta.map((cat) => {
            const Icon = cat.icon;
            const count = products.filter((p) => p.category === cat.slug).length;

            return (
              <motion.div
                key={cat.slug}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={`/templates?category=${cat.slug}`}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-card-border bg-card p-6 shadow-xs transition-all duration-300 hover:border-foreground/20 hover:shadow-xl hover:shadow-black/[0.04] active:scale-[0.985]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary border border-card-border text-foreground transition-transform duration-300 group-hover:scale-105 group-hover:text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-semibold text-muted">
                        {count > 0 ? `${count} items` : "Featured"}
                      </span>
                    </div>

                    <h3 className="mt-5 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                      {cat.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted font-normal">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:text-accent transition-colors">
                    <span>Browse Collection</span>
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

