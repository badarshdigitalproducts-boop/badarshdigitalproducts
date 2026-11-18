"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SectionHeader } from "@/components/shared/section-header";
import { ProductFilter } from "@/components/products/product-filter";
import { ProductGrid } from "@/components/products/product-grid";
import { products as initialProducts } from "@/content/products";
import { CATEGORIES } from "@/lib/constants";
import type { Product } from "@/types";

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

  // Fetch updated catalog from admin database
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
        // Popular: sort by downloads
        return (b.downloads || 0) - (a.downloads || 0);
      });
  }, [productList, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      <SectionHeader
        badge="Marketplace"
        title="Canva Templates &amp; Digital Creative Suites"
        subtitle="Download professionally designed social media packs, video editing assets, apps, pitch decks, and digital tools."
      />

      <div className="mt-8 mb-12">
        <ProductFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categoriesList={CATEGORIES}
        />
      </div>

      <ProductGrid
        products={filteredProducts}
        emptyMessage={`No digital templates found matching "${searchQuery}". Try searching for Reels, Video Editing, or Pitch Decks.`}
      />
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      }
    >
      <TemplatesContent />
    </Suspense>
  );
}
