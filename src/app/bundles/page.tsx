"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Sparkles,
  Download,
  Star,
  CheckCircle2,
  Play,
  Search,
  ExternalLink,
  Layers,
  ArrowRight,
  HardDrive,
  Film,
  Video,
} from "lucide-react";
import { products as fallbackProducts } from "@/content/products";
import { useCurrency } from "@/context/currency-context";
import { BundleCard } from "@/components/products/archetypes/bundle-card";
import type { Product } from "@/types";

const BUNDLE_CATEGORIES = [
  { id: "all", label: "All Bundles" },
  { id: "clips", label: "Clips & Raw Shots" },
  { id: "vfx", label: "4K VFX & Overlays" },
  { id: "luts", label: "Color LUTs & Curves" },
];

export default function BundlesPage() {
  const { formatPrice: formatCurr } = useCurrency();
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetch("/api/products?category=bundles")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch((err) => console.error("Error loading live bundles:", err));
  }, []);

  const bundles = useMemo(() => {
    return productList.filter((p) => {
      const isBundle =
        p.category === "bundles" ||
        p.category === "editing-bundles" ||
        p.tags?.includes("bundle") ||
        (p as any).productType === "bundle";
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      let matchesCat = true;
      if (selectedCategory !== "all") {
        matchesCat = Boolean(
          p.tags?.some((t) => t.toLowerCase().includes(selectedCategory)) ||
          p.title.toLowerCase().includes(selectedCategory) ||
          p.description.toLowerCase().includes(selectedCategory)
        );
      }

      return isBundle && matchesSearch && matchesCat;
    });
  }, [productList, search, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent">
          <Package className="h-3.5 w-3.5 text-accent" />
          BADARSH Creator Vaults
        </span>
        <h1 className="mt-4 apple-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Cinematic Video <span className="text-accent">Editing Bundles</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          Master clips, raw cinematic footage, 4K motion graphics, transparent overlays, and sound design vaults designed for high-impact video creators and editors. Uploaded directly to high-speed cloud drive for one-click access.
        </p>

        {/* Value Prop Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>High-Speed Cloud Drive Access</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>4K ProRes &amp; Uncompressed 24-Bit WAV</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Commercial Rights for All Client Projects</span>
          </div>
        </div>
      </div>

      {/* Cinematic Asset Breakdown Row */}
      <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <Film className="h-5 w-5 text-accent mb-2" />
          <div className="font-heading text-2xl font-black text-foreground">4K Overlays</div>
          <p className="text-xs text-muted mt-1">Light leaks, film grains &amp; scratches</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <Video className="h-5 w-5 text-emerald-500 mb-2" />
          <div className="font-heading text-2xl font-black text-foreground">Raw Clips</div>
          <p className="text-xs text-muted mt-1">Aerial 4K, b-roll shots &amp; background textures</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <Layers className="h-5 w-5 text-amber-500 mb-2" />
          <div className="font-heading text-2xl font-black text-foreground">3D Titles</div>
          <p className="text-xs text-muted mt-1">Motion graphics &amp; cinematic typography</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <HardDrive className="h-5 w-5 text-purple-400 mb-2" />
          <div className="font-heading text-2xl font-black text-foreground">Instant Drive</div>
          <p className="text-xs text-muted mt-1">Lifetime cloud drive access &amp; free updates</p>
        </div>
      </div>

      {/* Search & Category Tabs */}
      <div className="mt-12 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {BUNDLE_CATEGORIES.map((cat) => (
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

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bundles (video editing, LUTs)..."
            className="w-full rounded-full border border-card-border bg-card pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {bundles.map((bundle) => (
          <BundleCard key={bundle.id} product={bundle} priority />
        ))}
      </div>

      {/* Empty State */}
      {bundles.length === 0 && (
        <div className="mt-12 rounded-3xl border border-card-border bg-card p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
            No editing bundles found matching &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-2 text-xs text-muted">
            Try adjusting your search terms or filter.
          </p>
        </div>
      )}
    </div>
  );
}
