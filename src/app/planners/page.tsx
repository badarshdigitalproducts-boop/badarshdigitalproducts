"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Sparkles,
  Download,
  Eye,
  Star,
  CheckCircle2,
  Dumbbell,
  Target,
  Utensils,
  TrendingUp,
  FileText,
  Search,
  X,
  Tablet,
  Check,
} from "lucide-react";
import { CheckoutModal } from "@/components/products/checkout-modal";
import { products as fallbackProducts } from "@/content/products";
import { useCurrency } from "@/context/currency-context";
import type { Product } from "@/types";

export default function PlannersPage() {
  const { formatPrice: formatCurr } = useCurrency();
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  // Modals state
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch("/api/products?category=planners")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch((err) => console.error("Error loading live planners:", err));
  }, []);

  const planners = useMemo(() => {
    return productList.filter((p) => {
      const isPlanner = p.category === "planners" || p.tags?.includes("planner");
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesTag =
        selectedTag === "all" ||
        (selectedTag === "fitness" && (p.tags?.includes("gym") || p.tags?.includes("diet") || p.tags?.includes("fitness"))) ||
        (selectedTag === "career" && (p.tags?.includes("career") || p.tags?.includes("freelance") || p.tags?.includes("agency"))) ||
        (selectedTag === "content" && (p.tags?.includes("content calendar") || p.tags?.includes("social media")));

      return isPlanner && matchesSearch && matchesTag;
    });
  }, [productList, search, selectedTag]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Hero Header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent">
          <Calendar className="h-3.5 w-3.5" />
          BADARSH Productivity &amp; Lifestyle OS
        </span>
        <h1 className="mt-4 apple-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Life, Career, Gym &amp; Diet <span className="text-accent">Personal Planners</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          We planned everything for your peak performance. No copy-paste templates: every page is engineered for your daily routine, gym workouts, nutrition macros, and 12-month career goals. Read, preview, and download as printable or tablet-ready PDF.
        </p>

        {/* 4 Pillars of Planning */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-card-border bg-card/60 p-3.5 text-center">
            <Target className="mx-auto h-5 w-5 text-accent mb-1" />
            <h4 className="font-bold text-xs text-foreground">Career &amp; Income</h4>
            <p className="text-[10px] text-muted">Quarterly sprint targets</p>
          </div>
          <div className="rounded-2xl border border-card-border bg-card/60 p-3.5 text-center">
            <Dumbbell className="mx-auto h-5 w-5 text-emerald-500 mb-1" />
            <h4 className="font-bold text-xs text-foreground">Gym &amp; Workout</h4>
            <p className="text-[10px] text-muted">Progressive overload log</p>
          </div>
          <div className="rounded-2xl border border-card-border bg-card/60 p-3.5 text-center">
            <Utensils className="mx-auto h-5 w-5 text-amber-500 mb-1" />
            <h4 className="font-bold text-xs text-foreground">Diet &amp; Nutrition</h4>
            <p className="text-[10px] text-muted">Daily macros &amp; hydration</p>
          </div>
          <div className="rounded-2xl border border-card-border bg-card/60 p-3.5 text-center">
            <TrendingUp className="mx-auto h-5 w-5 text-purple-400 mb-1" />
            <h4 className="font-bold text-xs text-foreground">Habit Building</h4>
            <p className="text-[10px] text-muted">Streak trackers &amp; routine</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mt-12 flex flex-col items-center justify-between gap-4 md:flex-row">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Planners" },
            { id: "fitness", label: "Gym, Diet & Fitness" },
            { id: "career", label: "Career & Client Systems" },
            { id: "content", label: "365-Day Content Calendars" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTag(tab.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                selectedTag === tab.id
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "border border-card-border bg-card text-muted hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search gym, career, diet planners..."
            className="w-full rounded-full border border-card-border bg-card pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Planners Grid */}
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {planners.map((planner, idx) => (
          <motion.div
            key={planner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-card-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5"
          >
            <div>
              {/* Top Meta */}
              <div className="flex items-center justify-between text-xs">
                <span className="rounded-full bg-accent/10 px-3 py-1 font-bold text-accent flex items-center gap-1">
                  <Tablet className="h-3 w-3" />
                  {planner.format || "PDF Planner"}
                </span>
                <div className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span>{planner.rating || 4.9}</span>
                  <span className="text-muted font-normal">({planner.downloads || 600}+ users)</span>
                </div>
              </div>

              {/* Cover Image Visual */}
              <div className="relative mt-5 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-card-border/60 to-card">
                {planner.images?.[0] ? (
                  <img
                    src={planner.images[0]}
                    alt={planner.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-accent/5 text-accent">
                    <Calendar className="h-16 w-16 opacity-40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="rounded-md bg-emerald-500/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                    Hand-Crafted • Zero Copy-Paste
                  </span>
                  <span className="text-[11px] font-medium text-white/90">
                    {planner.specs?.count || "180 Pages"}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-5">
                <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                  {planner.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">
                  {planner.description}
                </p>
              </div>

              {/* Key Features Bullet points */}
              {planner.features && planner.features.length > 0 && (
                <div className="mt-4 space-y-1.5 border-t border-card-border/60 pt-4">
                  {planner.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-foreground/80">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Action Buttons */}
            <div className="mt-6 border-t border-card-border/60 pt-5">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-xs text-muted">Complete Life OS</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-2xl font-black text-foreground">
                      {formatCurr(planner.price)}
                    </span>
                    {planner.originalPrice && planner.originalPrice > planner.price && (
                      <span className="text-xs text-muted line-through">
                        {formatCurr(planner.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-500">
                  Instant PDF Download
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Preview Button */}
                <button
                  type="button"
                  onClick={() => setPreviewProduct(planner)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-card-border bg-card px-3 py-2.5 text-xs font-bold text-foreground transition-all hover:border-accent hover:bg-accent/5 hover:text-accent"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview Pages</span>
                </button>

                {/* Buy Button */}
                <button
                  type="button"
                  onClick={() => setCheckoutProduct(planner)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-accent px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover hover:scale-[1.02]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Get My Plan</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {planners.length === 0 && (
        <div className="mt-16 rounded-3xl border border-card-border bg-card p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
            No planners found matching &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-2 text-xs text-muted">
            Try adjusting your search query or reset the filters.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedTag("all");
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-xs font-bold text-white"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* PLANNER PREVIEW MODAL */}
      <AnimatePresence>
        {previewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-card-border bg-card p-6 shadow-2xl sm:p-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setPreviewProduct(null)}
                className="absolute right-5 top-5 rounded-full border border-card-border bg-card p-2 text-muted hover:border-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                  🗓️ Planner Architecture Preview
                </span>
                <span className="text-xs text-muted">Original BADARSH Layouts</span>
              </div>

              <h2 className="mt-3 font-heading text-2xl font-black text-foreground sm:text-3xl">
                {previewProduct.title}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {previewProduct.longDescription || previewProduct.description}
              </p>

              {/* What We Planned Breakdown */}
              <div className="mt-6 rounded-2xl border border-card-border bg-background p-6">
                <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-accent mb-4">
                  What&apos;s Included In This Complete Personal OS:
                </h4>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {previewProduct.features.map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl border border-card-border/60 bg-card/60 p-3 text-xs"
                    >
                      <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                      <span className="text-foreground/90 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Compatibility & Format */}
                <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-500">
                    <Tablet className="h-4 w-4" />
                    <span>Format &amp; Compatibility Guarantee</span>
                  </div>
                  <p className="mt-1 text-muted">
                    Compatible with Apple iPad (GoodNotes, Notability, Apple Books), Android Tablets (Samsung Notes, Xodo), and printable on standard A4 &amp; US Letter home printers.
                  </p>
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-card-border pt-4 sm:flex-row">
                <div>
                  <span className="text-xs text-muted">Instant PDF format</span>
                  <div className="font-heading text-2xl font-black text-foreground">
                    {formatCurr(previewProduct.price)}
                  </div>
                </div>

                <div className="flex w-full items-center gap-3 sm:w-auto">
                  <button
                    onClick={() => setPreviewProduct(null)}
                    className="flex-1 rounded-xl border border-card-border px-4 py-2.5 text-xs font-bold text-muted hover:text-foreground sm:flex-none"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const p = previewProduct;
                      setPreviewProduct(null);
                      setCheckoutProduct(p);
                    }}
                    className="flex-1 rounded-xl bg-accent px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-accent/25 hover:bg-accent-hover sm:flex-none"
                  >
                    Download Planner ({formatCurr(previewProduct.price)})
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHECKOUT MODAL */}
      {checkoutProduct && (
        <CheckoutModal
          product={checkoutProduct}
          isOpen={!!checkoutProduct}
          onClose={() => setCheckoutProduct(null)}
        />
      )}
    </div>
  );
}
