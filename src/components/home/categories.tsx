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
    gradient: "from-purple-500/10 to-pink-500/10 hover:border-purple-500/40",
    badgeColor: "text-purple-500",
  },
  {
    slug: "presentations",
    name: "Presentation Decks",
    desc: "Investor pitch decks, agency proposals, webinar slides",
    icon: Presentation,
    gradient: "from-blue-500/10 to-indigo-500/10 hover:border-blue-500/40",
    badgeColor: "text-blue-500",
  },
  {
    slug: "branding",
    name: "Brand Identity Kits",
    desc: "Logos, brand guidelines, typography systems",
    icon: Palette,
    gradient: "from-amber-500/10 to-orange-500/10 hover:border-amber-500/40",
    badgeColor: "text-amber-500",
  },
  {
    slug: "ebooks",
    name: "E-Books & Playbooks",
    desc: "Step-by-step blueprints for marketing & organic growth",
    icon: BookOpen,
    gradient: "from-emerald-500/10 to-teal-500/10 hover:border-emerald-500/40",
    badgeColor: "text-emerald-500",
  },
  {
    slug: "planners",
    name: "Digital Planners",
    desc: "30/60/90-day content calendars & business organizers",
    icon: CalendarCheck,
    gradient: "from-rose-500/10 to-fuchsia-500/10 hover:border-rose-500/40",
    badgeColor: "text-rose-500",
  },
  {
    slug: "business-cards",
    name: "Business Cards & Stationery",
    desc: "Luxury NFC-ready card layouts & shop invoices",
    icon: CreditCard,
    gradient: "from-cyan-500/10 to-blue-500/10 hover:border-cyan-500/40",
    badgeColor: "text-cyan-500",
  },
  {
    slug: "bundles",
    name: "Mega Starter Bundles",
    desc: "All-in-one business launch suites with 200+ assets",
    icon: Package,
    gradient: "from-violet-500/10 to-purple-500/10 hover:border-violet-500/40",
    badgeColor: "text-violet-500",
  },
  {
    slug: "assets",
    name: "Digital Graphics & Icons",
    desc: "Premium mockups, texture packs & UI elements",
    icon: Layers,
    gradient: "from-yellow-500/10 to-amber-500/10 hover:border-yellow-500/40",
    badgeColor: "text-amber-500",
  },
];

export function Categories() {
  return (
    <section className="border-t border-card-border/60 bg-card/20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Browse Collections"
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
                  className={`group flex h-full flex-col justify-between rounded-2xl border border-card-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg ${cat.gradient}`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-card-border/80 shadow-sm transition-transform duration-300 group-hover:scale-110">
                        <Icon className={`h-6 w-6 ${cat.badgeColor}`} />
                      </div>
                      <span className="text-xs font-semibold text-muted">
                        {count > 0 ? `${count} items` : "Featured"}
                      </span>
                    </div>

                    <h3 className="mt-5 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                      {cat.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-accent">
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
