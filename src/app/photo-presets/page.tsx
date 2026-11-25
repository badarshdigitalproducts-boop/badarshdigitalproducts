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
  Sliders,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { products as fallbackProducts } from "@/content/products";
import { useCurrency } from "@/context/currency-context";
import { BeforeAfterSlider } from "@/components/presets/before-after-slider";
import { BeforeAfterSlider as HeroSlider } from "@/components/shared/before-after-slider";
import type { Product } from "@/types";

const PRESET_CATEGORIES = [
  { id: "all", label: "All Presets" },
  { id: "cinematic", label: "Cinematic & Film" },
  { id: "warm", label: "Warm Editorial" },
  { id: "moody", label: "Moody & Dark" },
  { id: "skin", label: "Skin & Portrait" },
];

export default function PhotoPresetsPage() {
  const { formatPrice: formatCurr } = useCurrency();
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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
        (p.category as string) === "presets" ||
        (p.category as string) === "preset" ||
        (p as any).productType === "photo-preset" ||
        (p as any).productType === "preset" ||
        p.tags?.includes("preset") ||
        p.tags?.includes("lightroom");
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

      return isPreset && matchesSearch && matchesCat;
    });
  }, [productList, search, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
      {/* Compact Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Adobe Lightroom Photo Presets
        </h1>
        <p className="mt-1 text-sm text-muted">
          Slide to inspect real color science and unlock .DNG Mobile &amp; .XMP Desktop profiles with one tap.
        </p>
      </div>

      {/* Featured Live Comparison Stage */}
      <div className="overflow-hidden rounded-3xl border border-card-border bg-card p-5 md:p-8 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <HeroSlider
              beforeImage="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=70&auto=format&fit=crop"
              afterImage="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80&auto=format&fit=crop"
              beforeLabel="Raw Smartphone Shot"
              afterLabel="BADARSH Film Grade"
              aspectRatio="aspect-[16/10]"
            />
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="rounded-md bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent w-fit">
              Master Color Profile
            </span>
            <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
              Tokyo Midnight &amp; Warm Editorial
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed">
              Trained on 35mm Kodak Portra film emulation. Balances natural warm skin highlights while crushing green casts and delivering deep cinematic blacks without pixel distortion.
            </p>

            <ul className="mt-5 space-y-2 text-xs text-foreground/90">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Compatible with iPhone, Samsung, Sony &amp; Canon RAW</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Includes .DNG (Lightroom Mobile) &amp; .XMP (Desktop)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Free Lightroom Mobile app (No Adobe subscription needed)</span>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-4">
              <a
                href={presets[0] ? `/templates/${presets[0].slug}` : "#"}
                className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-bold text-background shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                <span>Get This Preset</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="mt-14 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {PRESET_CATEGORIES.map((cat) => (
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
            placeholder="Search presets (film, warm, moody)..."
            className="w-full rounded-full border border-card-border bg-card pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Presets Grid with Interactive Before/After Sliders */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {presets.map((preset) => (
          <BeforeAfterSlider key={preset.id} product={preset} />
        ))}
      </div>

      {/* Empty State */}
      {presets.length === 0 && (
        <div className="mt-12 rounded-3xl border border-card-border bg-card p-12 text-center">
          <Camera className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
            No presets found matching &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-2 text-xs text-muted">
            Try adjusting your search terms or view all categories.
          </p>
        </div>
      )}
    </div>
  );
}
