"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Film,
  Sparkles,
  Download,
  Play,
  Search,
  CheckCircle2,
  ExternalLink,
  Zap,
  ArrowRight,
  Music,
} from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { products as fallbackProducts } from "@/content/products";
import { useCurrency } from "@/context/currency-context";
import type { Product } from "@/types";

export default function EditingBundlesPage() {
  const { formatPrice: formatCurr } = useCurrency();
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/products?category=editing-bundles")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch((err) => console.error("Error loading live editing bundles:", err));
  }, []);

  const bundles = useMemo(() => {
    return productList.filter((p) => {
      const isEditingBundle =
        p.category === "editing-bundles" ||
        p.tags?.includes("sfx") ||
        p.tags?.includes("overlays") ||
        p.tags?.includes("motion graphics");
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return isEditingBundle && matchesSearch;
    });
  }, [productList, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Hero Header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent">
          <Music className="h-3.5 w-3.5 text-accent" />
          Sound Effects &amp; BG Music
        </span>
        <h1 className="mt-4 apple-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Sound Effects &amp; <span className="text-accent">BG Music</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Uncompressed creator sound effects, cinematic background music tracks, and 1-click video motion overlays designed in-house by BADARSH. Drag and drop into your timeline for instant impact.
        </p>

        {/* 1-Click Workflow Pill Steps */}
        <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">1</span>
            <span>Download High-Bitrate WAV / MP3</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">2</span>
            <span>Drop Into Premiere, CapCut &amp; VN</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">3</span>
            <span>Royalty-Free &bull; Instant Polish</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="mx-auto mt-10 mb-12 max-w-md">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sound effects, background music, transitions..."
            className="w-full rounded-full border border-card-border bg-card pl-11 pr-5 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {bundles.map((bundle) => (
          <ProductCard key={bundle.id} product={bundle} priority />
        ))}
      </div>

      {/* Empty State */}
      {bundles.length === 0 && (
        <div className="mt-16 rounded-3xl border border-card-border bg-card p-12 text-center">
          <Music className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
            No audio tracks or sound effects found matching &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-2 text-xs text-muted">
            Check back soon for new audio drops!
          </p>
        </div>
      )}
    </div>
  );
}
