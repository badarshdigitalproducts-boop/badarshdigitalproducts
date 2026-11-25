"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Film, Search, Sparkles, Play } from "lucide-react";
import { VideoTemplateCard } from "@/components/video-templates/video-template-card";
import { products as fallbackProducts } from "@/content/products";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import type { Product } from "@/types";

const VIDEO_CATEGORIES = [
  { id: "all", label: "All Templates" },
  { id: "velocity", label: "Velocity & Beat Sync" },
  { id: "lyrics", label: "3D Lyrics & Motion" },
  { id: "shakes", label: "Shakes & Glitch FX" },
  { id: "cinematic", label: "Cinematic Slow-Mo" },
];

/** Filter helper — same logic used in both initial state and after fetch */
function filterVideoTemplates(list: Product[]): Product[] {
  return list.filter(
    (p) =>
      p.category === "video-templates" ||
      (p as any).productType === "video-template" ||
      (p as any).productType === "video"
  );
}

/** Skeleton card matching the 9:16 aspect ratio of real cards */
function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm animate-pulse">
      <div className="relative aspect-[9/16] w-full max-h-[380px] rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-3 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-4 h-9 w-full rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  );
}

export default function VideoTemplatesPage() {
  // Seed with static products immediately — page never shows blank on first paint
  const [productList, setProductList] = useState<Product[]>(() =>
    filterVideoTemplates(fallbackProducts)
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchTemplates = useCallback(() => {
    setLoading(true);
    fetch("/api/products?category=video-templates")
      .then((res) => {
        if (!res.ok) throw new Error(`API ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data?.products && Array.isArray(data.products) && data.products.length > 0) {
          setProductList(filterVideoTemplates(data.products));
        }
        // If API returned empty, keep fallback products (already in state)
      })
      .catch(() => {
        // Keep fallback products on error — no blank page
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const templates = useMemo(() => {
    return productList.filter((p) => {
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      let matchesCat = true;
      if (selectedCategory !== "all") {
        matchesCat = Boolean(
          p.tags?.some((t) => t.toLowerCase().includes(selectedCategory)) ||
            p.title.toLowerCase().includes(selectedCategory)
        );
      }

      return matchesSearch && matchesCat;
    });
  }, [productList, search, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
      <Breadcrumbs items={[{ label: "Video Templates", href: "/video-templates" }]} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Film className="h-5 w-5 text-indigo-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
            9:16 Beat-Sync Templates
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
          Beat-Synced Video Templates
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
          Hover or tap any card to preview with audio — free templates launch directly in CapCut and paid
          packs unlock full source files and XML projects.
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {VIDEO_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates (velocity, lyrics)..."
            className="w-full rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-10 pr-4 py-2 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        /* Skeleton grid while API resolves */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : templates.length === 0 ? (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950 mb-4">
            <Play className="h-7 w-7 text-indigo-400" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">
            No templates found
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs">
            {search
              ? `No results for "${search}". Try a different keyword.`
              : "No templates in this category yet. Check back soon!"}
          </p>
          {(search || selectedCategory !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
              className="mt-4 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-5 py-2 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Clear filters
            </button>
          )}
        </motion.div>
      ) : (
        /* Real cards */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {templates.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <VideoTemplateCard product={template} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Stats bar when loaded */}
      {!loading && templates.length > 0 && (
        <p className="mt-8 text-center text-xs text-neutral-400 dark:text-neutral-600">
          {templates.length} template{templates.length !== 1 ? "s" : ""} available
          {selectedCategory !== "all" && ` in ${VIDEO_CATEGORIES.find((c) => c.id === selectedCategory)?.label}`}
        </p>
      )}
    </div>
  );
}
