"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Sparkles,
  Download,
  Star,
  CheckCircle2,
  ExternalLink,
  Search,
  Eye,
  Sliders,
  ArrowRight,
} from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { products as fallbackProducts } from "@/content/products";
import { useCurrency } from "@/context/currency-context";
import type { Product } from "@/types";

export default function PhotoPresetsPage() {
  const { formatPrice: formatCurr } = useCurrency();
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/products?category=photo-presets")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch((err) => console.error("Error loading live photo presets:", err));
  }, []);

  const presets = useMemo(() => {
    return productList.filter((p) => {
      const isPreset =
        p.category === "photo-presets" ||
        p.tags?.includes("preset") ||
        p.tags?.includes("lightroom");
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return isPreset && matchesSearch;
    });
  }, [productList, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Hero Header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent">
          <Camera className="h-3.5 w-3.5 text-accent" />
          1-Click Adobe Lightroom Presets
        </span>
        <h1 className="mt-4 font-heading text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Cinematic Mood &amp; Warm{" "}
          <span className="bg-gradient-to-r from-accent via-amber-400 to-orange-500 bg-clip-text text-transparent">
            Photo Presets
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Our team edits the photos and creates the preset share link. You click the link, it opens directly inside the free Adobe Lightroom Mobile app, you add your photo, and your edit is done! No manual DNG file imports or complex adjustments needed.
        </p>

        {/* 3 Steps */}
        <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">1</span>
            <span>Get Preset Link</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">2</span>
            <span>Opens in Lightroom Mobile</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">3</span>
            <span>Add Your Photo &bull; Applied!</span>
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
            placeholder="Search Lightroom presets (cinematic, warm tones, moody)..."
            className="w-full rounded-full border border-card-border bg-card pl-11 pr-5 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {presets.map((preset) => (
          <ProductCard key={preset.id} product={preset} priority />
        ))}
      </div>

      {/* Empty State */}
      {presets.length === 0 && (
        <div className="mt-16 rounded-3xl border border-card-border bg-card p-12 text-center">
          <Camera className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
            No photo presets matching &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-2 text-xs text-muted">
            Check back soon for new Lightroom collection drops!
          </p>
        </div>
      )}
    </div>
  );
}
