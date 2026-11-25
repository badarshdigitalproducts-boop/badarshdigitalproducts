"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>("all");
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
        const matchesAspect =
          selectedAspectRatio === "all" ||
          product.aspectRatio === selectedAspectRatio ||
          (selectedAspectRatio === "9:16" && (product.tags?.includes("reels") || product.specs?.dimensions?.includes("1920"))) ||
          (selectedAspectRatio === "1:1" && (product.tags?.includes("carousel") || product.specs?.dimensions?.includes("1080x1080"))) ||
          (selectedAspectRatio === "16:9" && (product.category === "presentations" || product.specs?.dimensions?.includes("1920x1080"))) ||
          (selectedAspectRatio === "A4" && (product.category === "planners" || product.tags?.includes("printable")));

        return matchesCategory && matchesSearch && matchesAspect;
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
  }, [productList, selectedCategory, searchQuery, sortBy, selectedAspectRatio]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
      {/* Compact Canva-Style Marketplace Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Templates &amp; Design Systems
        </h1>
        <p className="mt-1 text-sm text-muted">
          Clean, customizable Canva &amp; Figma layouts built for instant creator deployment.
        </p>
      </div>

      {/* Unified Filter & Search Bar */}
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
          selectedAspectRatio={selectedAspectRatio}
          onAspectRatioChange={setSelectedAspectRatio}
          categoriesList={CATEGORIES}
          totalCount={filteredProducts.length}
        />
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={filteredProducts}
        emptyMessage={`No templates found${searchQuery ? ` matching "${searchQuery}"` : ""}. Try selecting "All Products" or clearing your filters.`}
      />
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
