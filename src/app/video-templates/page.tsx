"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Film,
  Sparkles,
  Download,
  Search,
  Music2,
  CheckCircle2,
  Zap,
  Play,
} from "lucide-react";
import { VideoTemplateCard } from "@/components/video-templates/video-template-card";
import { products as fallbackProducts } from "@/content/products";
import type { Product } from "@/types";

const VIDEO_CATEGORIES = [
  { id: "all", label: "All Templates" },
  { id: "velocity", label: "Velocity & Beat Sync" },
  { id: "lyrics", label: "3D Lyrics & Motion" },
  { id: "shakes", label: "Shakes & Glitch FX" },
  { id: "cinematic", label: "Cinematic Slow-Mo" },
];

export default function VideoTemplatesPage() {
  const [productList, setProductList] = useState<Product[]>(() =>
    fallbackProducts.filter(
      (p) =>
        p.category === "video-templates" ||
        (p as any).productType === "video-template" ||
        (p as any).productType === "video"
    )
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetch("/api/products?category=video-templates")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          setProductList(data.products);
        }
      })
      .catch((err) => console.error("Error loading video templates:", err))
      .finally(() => setLoading(false));
  }, []);

  const templates = useMemo(() => {
    const adminTemplates = productList.filter(
      (p) =>
        p.category === "video-templates" ||
        (p as any).productType === "video-template" ||
        (p as any).productType === "video"
    );

    return adminTemplates.filter((p) => {
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
      {/* Compact Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
          Beat-Synced Video Templates
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Hover or tap any card to preview with audio — free templates launch directly and paid packs unlock full source files.
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

      {/* Video Templates 9:16 Vertical Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <VideoTemplateCard key={template.id} product={template} />
        ))}
      </div>
    </div>
  );
}
