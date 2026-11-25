"use client";

import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  Smartphone,
  Layers,
  Layout,
  Palette,
  CreditCard,
  BookOpen,
  Calendar,
  Package,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

interface ProductFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  selectedAspectRatio?: string;
  onAspectRatioChange?: (ratio: string) => void;
  categoriesList?: readonly { value: string; label: string }[];
  totalCount?: number;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  all: Sparkles,
  "social-media": Smartphone,
  presentations: Layout,
  branding: Palette,
  "business-cards": CreditCard,
  ebooks: BookOpen,
  planners: Calendar,
  bundles: Package,
  "editing-apps": Smartphone,
  "editing-bundles": Layers,
  "photo-presets": Sparkles,
};

export function ProductFilter({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedAspectRatio,
  onAspectRatioChange,
  categoriesList = CATEGORIES,
  totalCount,
}: ProductFilterProps) {
  return (
    <div className="space-y-3.5">
      {/* Search & Controls Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Canva-grade search bar */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search templates (Reels, Carousels, Pitch Decks, Planners)..."
            className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-9 text-xs sm:text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-foreground/40 hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Aspect Ratio, Sort & Count */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 shrink-0">
          {typeof totalCount === "number" && (
            <span className="text-xs text-foreground/50 mr-1">
              {totalCount} {totalCount === 1 ? "template" : "templates"}
            </span>
          )}

          {onAspectRatioChange && (
            <select
              value={selectedAspectRatio || "all"}
              onChange={(e) => onAspectRatioChange(e.target.value)}
              aria-label="Filter by aspect ratio"
              className="cursor-pointer rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground focus:border-foreground focus:outline-none transition-colors"
            >
              <option value="all">All Sizes</option>
              <option value="9:16">9:16 Reels / Stories</option>
              <option value="1:1">1:1 / 4:5 Feed</option>
              <option value="16:9">16:9 Presentation</option>
              <option value="A4">A4 Print / PDF</option>
            </select>
          )}

          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-foreground/50" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort templates"
              className="cursor-pointer rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground focus:border-foreground focus:outline-none transition-colors"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Canva-style Category Pills with Spring Indicator */}
      <div className="no-scrollbar relative flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
        {categoriesList.map((cat) => {
          const isActive = selectedCategory === cat.value;
          const Icon = CATEGORY_ICONS[cat.value] || Sparkles;

          return (
            <button
              key={cat.value}
              onClick={() => onSelectCategory(cat.value)}
              className={`relative z-10 flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
                isActive
                  ? "text-background font-semibold"
                  : "border border-border bg-background text-foreground/70 hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 -z-10 rounded-full bg-foreground"
                  transition={{ type: "spring", duration: 0.25, bounce: 0.08 }}
                />
              )}
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
