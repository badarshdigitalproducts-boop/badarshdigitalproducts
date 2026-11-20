"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Sparkles,
  Download,
  Star,
  CheckCircle2,
  ShieldCheck,
  Search,
  Zap,
  ArrowRight,
  Cpu,
  Layers,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { products as fallbackProducts } from "@/content/products";
import { useCurrency } from "@/context/currency-context";
import { AppCard } from "@/components/products/archetypes/app-card";
import type { Product } from "@/types";

const APP_CATEGORIES = [
  { id: "all", label: "All Creator Apps" },
  { id: "video", label: "Video Editors" },
  { id: "color", label: "Color & LUTs" },
  { id: "motion", label: "Motion & FX" },
];

export default function EditingAppsPage() {
  const { formatPrice: formatCurr } = useCurrency();
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetch("/api/products?category=editing-apps")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch((err) => console.error("Error loading live editing apps:", err));
  }, []);

  const apps = useMemo(() => {
    return productList.filter((p) => {
      const isApp =
        p.category === "editing-apps" ||
        p.tags?.includes("editing apps") ||
        p.tags?.includes("editing app") ||
        p.tags?.includes("mobile creator") ||
        p.tags?.includes("capcut");

      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      let matchesCat = true;
      if (selectedCategory === "video") {
        matchesCat = p.tags?.some((t) => ["video", "video editing", "capcut", "vn"].includes(t.toLowerCase())) || true;
      }

      return isApp && matchesSearch && matchesCat;
    });
  }, [productList, search, selectedCategory]);

  const featuredApp = apps[0] || fallbackProducts.find((p) => p.category === "editing-apps");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Hero Header — Apple App Store Style */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent">
          <Smartphone className="h-3.5 w-3.5 text-accent" />
          BADARSH App Store
        </span>
        <h1 className="mt-4 apple-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Verified Mobile <span className="text-accent">Editing Apps</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          Download high-performance mobile video editors and creator suites directly from BADARSH. Clean direct downloads with zero third-party ads, no expired links, and all VIP transitions, 4K 60fps exports, and auto-caption tools verified.
        </p>

        {/* Feature Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Direct High-Speed Cloud Downloads</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>100% Virus-Scanned &amp; Safe</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Watermark-Free 4K 60FPS Exports</span>
          </div>
        </div>
      </div>

      {/* Featured App Spotlight (Apple App Store 'App of the Day') */}
      {featuredApp && (
        <div className="mt-14 overflow-hidden rounded-3xl border border-card-border bg-linear-to-br from-card via-card to-secondary/40 p-6 md:p-10 shadow-lg relative">
          <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-start gap-5 min-w-0">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-[22%] border border-card-border bg-neutral-900 shadow-xl">
                <img
                  src={featuredApp.images[0] || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"}
                  alt={featuredApp.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                    Featured Choice
                  </span>
                  <span className="text-xs text-muted font-mono">
                    {featuredApp.appVersion || "v12.2 Pro Unlocked"}
                  </span>
                </div>

                <h2 className="mt-1 font-heading text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground">
                  {featuredApp.title}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-foreground">{featuredApp.rating}</span>
                    <span>({featuredApp.reviewCount} reviews)</span>
                  </div>
                  <span>&bull;</span>
                  <span>{featuredApp.downloads.toLocaleString()}+ verified installs</span>
                  <span>&bull;</span>
                  <span className="text-emerald-500 font-semibold">100% Virus-Free</span>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed line-clamp-2 max-w-2xl">
                  {featuredApp.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 w-full lg:w-auto shrink-0">
              <div className="text-center lg:text-right">
                <div className="font-heading text-2xl font-black text-foreground">
                  {featuredApp.price === 0 ? "Free" : formatCurr(featuredApp.price)}
                </div>
                <span className="text-[11px] text-muted">Instant Cloud Access</span>
              </div>

              <a
                href={`/templates/${featuredApp.slug}`}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-bold text-background shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                <Download className="h-4 w-4" />
                <span>{featuredApp.price === 0 ? "Get Free App" : "Get App"}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Search & Category Tabs */}
      <div className="mt-14 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {APP_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-secondary/70 text-muted hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search apps (CapCut, VN, Alight)..."
            className="w-full rounded-full border border-card-border bg-card pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <AppCard key={app.id} product={app} priority />
        ))}
      </div>

      {/* Empty State */}
      {apps.length === 0 && (
        <div className="mt-12 rounded-3xl border border-card-border bg-card p-12 text-center">
          <Smartphone className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
            No editing apps found matching &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-2 text-xs text-muted">
            Check back soon for new app version drops!
          </p>
        </div>
      )}

      {/* Installation Guide Banner (Professional Direct Download Guide) */}
      <div className="mt-20 rounded-3xl border border-card-border bg-card/60 p-8 md:p-12 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider mb-2">
          <ShieldCheck className="h-4 w-4" />
          <span>Smooth Installation</span>
        </div>
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          How to Install Mobile Apps on Your Device (3 Simple Steps)
        </h3>
        <p className="mt-2 text-xs text-muted max-w-2xl">
          All apps hosted on BADARSH are pre-verified, tested for malware, and guaranteed clean. Here is how easy it is to get started:
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 text-xs leading-relaxed text-muted">
          <div className="rounded-2xl border border-card-border bg-background p-6 shadow-xs">
            <span className="font-heading text-3xl font-black text-accent">01</span>
            <h4 className="mt-3 font-bold text-sm text-foreground">Direct Download</h4>
            <p className="mt-1.5">
              Click the download button right on the app card. The high-speed installer saves directly to your device storage.
            </p>
          </div>
          <div className="rounded-2xl border border-card-border bg-background p-6 shadow-xs">
            <span className="font-heading text-3xl font-black text-accent">02</span>
            <h4 className="mt-3 font-bold text-sm text-foreground">Confirm Permission</h4>
            <p className="mt-1.5">
              Tap the downloaded installer file. If your mobile system asks, enable &ldquo;Allow from this source&rdquo; to complete install.
            </p>
          </div>
          <div className="rounded-2xl border border-card-border bg-background p-6 shadow-xs">
            <span className="font-heading text-3xl font-black text-accent">03</span>
            <h4 className="mt-3 font-bold text-sm text-foreground">Launch &amp; Create</h4>
            <p className="mt-1.5">
              Open the app and start creating immediately: enjoy watermark-free exports, 4K at 60fps, and all VIP features unlocked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
