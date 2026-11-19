"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Sparkles,
  Download,
  Star,
  CheckCircle2,
  Play,
  Search,
  ExternalLink,
  Layers,
  Flame,
  ArrowRight,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { ProductCard } from "@/components/products/product-card";
import { CheckoutModal } from "@/components/products/checkout-modal";
import { products as fallbackProducts } from "@/content/products";
import { useCurrency } from "@/context/currency-context";
import type { Product } from "@/types";

export default function BundlesPage() {
  const { formatPrice: formatCurr } = useCurrency();
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [search, setSearch] = useState("");
  const [selectedBundle, setSelectedBundle] = useState<Product | null>(null);

  useEffect(() => {
    fetch("/api/products?category=bundles")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch((err) => console.error("Error loading live bundles:", err));
  }, []);

  const bundles = useMemo(() => {
    return productList.filter((p) => {
      const isBundle = p.category === "bundles" || p.tags?.includes("bundle");
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return isBundle && matchesSearch;
    });
  }, [productList, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Hero Header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent">
          <Flame className="h-3.5 w-3.5 text-accent" />
          BADARSH Mega Vaults
        </span>
        <h1 className="mt-4 apple-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          2026 All-in-One <span className="text-accent">Mega Bundles</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Everything an ambitious editor or founder needs in one unified download. Uploaded directly from BADARSH Studio Google Drive: 500+ sound effects, 100 transitions, 50 LUTs, title templates, and 4K green screen VFX elements. Save over 60% compared to individual items.
        </p>

        {/* Value Prop Badges */}
        <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Google Drive Direct Link</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>4K ProRes &amp; 24-bit Audio</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Lifetime Drive Access &amp; Updates</span>
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
            placeholder="Search bundles (video editing, graphics, sound packs)..."
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
          <Package className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
            No bundles matching &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-2 text-xs text-muted">
            Check back soon for new 2026 mega bundle drops!
          </p>
        </div>
      )}

      {/* Custom Bundle Request Banner */}
      <div className="mt-20 rounded-3xl border border-accent/20 bg-gradient-to-r from-accent/10 via-purple-950/20 to-card p-8 md:p-12 text-center">
        <h3 className="font-heading text-2xl font-bold text-foreground">
          Need a Custom Agency Editing Bundle for Your Team?
        </h3>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
          We curate personalized drives with your brand colors, custom intro sound effects, and tailored LUTs.
        </p>
        <a
          href="https://wa.me/917204250115?text=Hi+BADARSH!+I+want+a+custom+video+editing+bundle+for+my+team."
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-bold text-white shadow-lg shadow-accent/20 hover:bg-accent-hover"
        >
          <span>Request Custom Bundle on WhatsApp</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
