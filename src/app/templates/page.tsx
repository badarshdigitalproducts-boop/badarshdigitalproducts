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
        title="Design Templates &amp; Digital Creative Suites"
        subtitle="Download professionally designed social media packs, pitch decks, creator carousels, and digital tools. Designed in-house by BADARSH."
      />

      <div className="mt-8 mb-8">
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

      {/* Category Spotlight Banners */}
      {selectedCategory === "editing-bundles" && (
        <div className="mb-10 rounded-3xl border border-accent/30 bg-gradient-to-r from-accent/15 via-purple-900/10 to-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
                🎬 1-Click Video Editing Workflow
              </span>
              <h2 className="mt-2 font-heading text-2xl font-black text-foreground">
                Sound Effects &amp; BG Music, Light Leaks &amp; Overlays
              </h2>
              <p className="mt-1 text-sm text-muted max-w-2xl">
                Our team crafts the visual effects and provides direct template links. You click the link, it opens right inside CapCut or Premiere, you drop your own clip or photo in, and your edit is done!
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-card/80 border border-card-border px-4 py-3 text-xs font-medium text-foreground/90 shrink-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>CapCut &amp; Premiere Ready</span>
            </div>
          </div>
        </div>
      )}

      {selectedCategory === "photo-presets" && (
        <div className="mb-10 rounded-3xl border border-accent/30 bg-gradient-to-r from-accent/15 via-amber-900/10 to-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
                🎨 1-Click Lightroom Mobile Presets
              </span>
              <h2 className="mt-2 font-heading text-2xl font-black text-foreground">
                Cinematic Mood &amp; Warm Editorial Presets
              </h2>
              <p className="mt-1 text-sm text-muted max-w-2xl">
                Our team color-grades the photos and shares the direct Lightroom preset link. Click the link to open Adobe Lightroom Mobile (Free), add your photo, and your professional color grade is applied instantly!
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-card/80 border border-card-border px-4 py-3 text-xs font-medium text-foreground/90 shrink-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Free Lightroom App Compatible</span>
            </div>
          </div>
        </div>
      )}

      {selectedCategory === "editing-apps" && (
        <div className="mb-10 rounded-3xl border border-accent/30 bg-gradient-to-r from-accent/15 via-blue-900/10 to-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
                📱 Apps &amp; Workflows
              </span>
              <h2 className="mt-2 font-heading text-2xl font-black text-foreground">
                Verified Apps &amp; Mobile Tools
              </h2>
              <p className="mt-1 text-sm text-muted max-w-2xl">
                Download verified Android APKs directly from BADARSH cloud servers. All premium transitions, AI tools, and 4K exports unlocked without third-party redirects.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-card/80 border border-card-border px-4 py-3 text-xs font-medium text-foreground/90 shrink-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Virus-Scanned &amp; Tested</span>
            </div>
          </div>
        </div>
      )}

      {selectedCategory === "bundles" && (
        <div className="mb-10 rounded-3xl border border-accent/30 bg-gradient-to-r from-accent/15 via-purple-900/10 to-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
                🔥 Bundles &amp; Production Vaults
              </span>
              <h2 className="mt-2 font-heading text-2xl font-black text-foreground">
                2026 Video &amp; Graphics Master Vaults
              </h2>
              <p className="mt-1 text-sm text-muted max-w-2xl">
                Uploaded straight from BADARSH Studio cloud drive: 500+ sound effects, 100 transitions, 50 LUTs, title packs, and green screen elements. Instant cloud drive access after payment.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-card/80 border border-card-border px-4 py-3 text-xs font-medium text-foreground/90 shrink-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Google Drive Direct Link</span>
            </div>
          </div>
        </div>
      )}

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
