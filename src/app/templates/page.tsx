"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight,
  ExternalLink,
  Smartphone,
  Layout,
  Palette,
} from "lucide-react";
import { ProductFilter } from "@/components/products/product-filter";
import { ProductGrid } from "@/components/products/product-grid";
import { products as initialProducts } from "@/content/products";
import { CATEGORIES } from "@/lib/constants";
import type { Product } from "@/types";

const QUICK_TAGS = [
  { label: "Instagram Reels", category: "social-media", query: "Reels" },
  { label: "LinkedIn Carousels", category: "social-media", query: "Carousel" },
  { label: "Pitch Decks", category: "presentations", query: "" },
  { label: "Brand Kits", category: "branding", query: "" },
  { label: "Lightroom Presets", category: "photo-presets", query: "" },
  { label: "Sound FX & Overlays", category: "editing-bundles", query: "" },
  { label: "Mega Bundles", category: "bundles", query: "" },
];

function TemplatesContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";

  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  // Keep state in sync with URL search parameter
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Fetch updated catalog from database
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch((err) => console.error("Error loading live products:", err));
  }, []);

  const filteredProducts = useMemo(() => {
    return productList
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "all" || product.category === selectedCategory;
        const matchesSearch =
          searchQuery === "" ||
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags?.some((t: string) =>
            t.toLowerCase().includes(searchQuery.toLowerCase())
          );
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "price-low") {
          return a.price - b.price;
        }
        if (sortBy === "price-high") {
          return b.price - a.price;
        }
        return (b.downloads || 0) - (a.downloads || 0);
      });
  }, [productList, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-14">
      {/* ── Canva-Grade Hero Header ── */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground mb-4">
          <Sparkles className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Canva &amp; Figma Compatible Marketplace</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          What will you design today?
        </h1>

        <p className="mt-3 text-sm sm:text-base text-foreground/60 max-w-2xl mx-auto leading-relaxed">
          Explore 100+ high-converting design systems, social media carousels, reels covers, and pitch decks.
          1-click editable in Canva, Figma, or right in your browser.
        </p>

        {/* Quick Suggestion Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
          <span className="text-xs text-foreground/40 font-medium mr-1">Trending:</span>
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag.label}
              onClick={() => {
                setSelectedCategory(tag.category);
                setSearchQuery(tag.query);
              }}
              className="cursor-pointer rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Canva Value Strip ── */}
      <div className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl border border-border bg-muted/20 text-left text-xs">
        <div className="flex items-start gap-2.5">
          <Zap className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">1-Click Canva Links</p>
            <p className="text-[11px] text-foreground/50">Opens directly in your free Canva account</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Palette className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">100% Customizable</p>
            <p className="text-[11px] text-foreground/50">Edit text, colors, photos &amp; brand fonts</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">Commercial Rights</p>
            <p className="text-[11px] text-foreground/50">Use for client projects &amp; personal brand</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">Lifetime Access</p>
            <p className="text-[11px] text-foreground/50">Instant delivery to your email &amp; dashboard</p>
          </div>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div className="mb-8">
        <ProductFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSearchQuery("");
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categoriesList={CATEGORIES}
          totalCount={filteredProducts.length}
        />
      </div>

      {/* ── Product Grid ── */}
      <ProductGrid
        products={filteredProducts}
        emptyMessage={`No digital templates found matching "${searchQuery}". Try selecting "All Products" or searching for Reels, Carousels, or Pitch Decks.`}
      />

      {/* ── How BADARSH + Canva Works (Walkthrough) ── */}
      <div className="mt-20 border-t border-border pt-14">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
            Simple 3-Step Process
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">
            How BADARSH Canva Templates Work
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-foreground/60">
            You don&apos;t need expensive design software or years of experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background font-bold text-sm mb-4">
              1
            </div>
            <h3 className="text-base font-semibold text-foreground">Pick your template pack</h3>
            <p className="mt-1.5 text-xs text-foreground/60 leading-relaxed">
              Browse our curated marketplace of Instagram Reels covers, LinkedIn carousels, presentation decks, or founder guides.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background font-bold text-sm mb-4">
              2
            </div>
            <h3 className="text-base font-semibold text-foreground">Open in 1-click in Canva</h3>
            <p className="mt-1.5 text-xs text-foreground/60 leading-relaxed">
              Instantly receive your verified Canva template link. Click it, and it imports directly into your personal Canva account (Free or Pro).
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background font-bold text-sm mb-4">
              3
            </div>
            <h3 className="text-base font-semibold text-foreground">Customize &amp; post in 4K</h3>
            <p className="mt-1.5 text-xs text-foreground/60 leading-relaxed">
              Swap headlines, change colors to match your brand, drag in your photos, and download clean, high-resolution graphics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        </div>
      }
    >
      <TemplatesContent />
    </Suspense>
  );
}
