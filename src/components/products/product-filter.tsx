"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import type { ProductCategory } from "@/types/product";

interface ProductFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  categoriesList?: readonly { value: string; label: string }[];
}

export function ProductFilter({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  categoriesList = CATEGORIES,
}: ProductFilterProps) {
  return (
    <div className="space-y-6">
      {/* Top search & sort bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search templates, decks, planners..."
            className="w-full rounded-full border border-card-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted" />
          <span className="text-xs font-semibold text-muted">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="cursor-pointer rounded-full border border-card-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground focus:border-accent focus:outline-none"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Pills with Apple-grade Spring Pill */}
      <div className="no-scrollbar relative flex items-center gap-2 overflow-x-auto pb-2">
        {categoriesList.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <motion.button
              key={cat.value}
              onClick={() => onSelectCategory(cat.value)}
              whileTap={{ scale: 0.94 }}
              className={`relative z-10 cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-colors duration-150 ${
                isActive
                  ? "text-white"
                  : "border border-card-border/80 bg-card/60 text-muted hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 -z-10 rounded-full bg-accent shadow-sm shadow-accent/20"
                  transition={{ type: "spring", duration: 0.32, bounce: 0.15 }}
                />
              )}
              {cat.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

