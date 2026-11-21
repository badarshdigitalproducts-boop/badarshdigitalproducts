"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Sparkles,
  Download,
  Eye,
  Star,
  CheckCircle2,
  Target,
  Dumbbell,
  Search,
  Lock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { products as fallbackProducts } from "@/content/products";
import { useCurrency } from "@/context/currency-context";
import { PdfViewerModal } from "@/components/pdf/pdf-viewer-modal";
import type { Product } from "@/types";

export default function PlannersPage() {
  const { formatPrice: formatCurr } = useCurrency();
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeViewerProduct, setActiveViewerProduct] = useState<Product | null>(null);

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

  // Dynamically extract categories from admin data or fallback categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    productList
      .filter((p) => p.category === "planners" || p.tags?.includes("planner"))
      .forEach((p) => {
        if (p.plannerCategory) set.add(p.plannerCategory);
        p.tags?.forEach((t) => {
          if (!["planner", "productivity", "pdf", "digital"].includes(t.toLowerCase())) {
            set.add(t);
          }
        });
      });
    return ["all", ...Array.from(set).slice(0, 5)];
  }, [productList]);

  const planners = useMemo(() => {
    return productList.filter((p) => {
      const isPlanner = p.category === "planners" || p.tags?.includes("planner");
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        (p.plannerCategory && p.plannerCategory.toLowerCase().includes(search.toLowerCase()));

      let matchesCat = true;
      if (selectedCategory !== "all") {
        matchesCat =
          (p.plannerCategory && p.plannerCategory.toLowerCase() === selectedCategory.toLowerCase()) ||
          p.tags?.some((t) => t.toLowerCase() === selectedCategory.toLowerCase());
      }

      return isPlanner && matchesSearch && matchesCat;
    });
  }, [productList, search, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent">
          <Calendar className="h-3.5 w-3.5" />
          Productivity Systems
        </span>
        <h1 className="mt-4 apple-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Original Productivity &amp; <span className="text-accent">Life Planners</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          Designed by our team to organize every aspect of your life — daily routines, career sprints, fitness routines, and finance tracking. Preview live inside our secure reader with copy protection and download instantly.
        </p>

        {/* Feature Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground shadow-2xs">
            <Lock className="h-3.5 w-3.5 text-emerald-500" />
            <span>Secure In-Browser PDF Reader</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>GoodNotes, Notability &amp; Printable PDF</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Instant High-Res Cloud Delivery</span>
          </div>
        </div>
      </div>

      {/* Category Tabs & Search */}
      <div className="mt-14 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-secondary/70 text-muted hover:text-foreground"
              }`}
            >
              {cat === "all" ? "All Planners" : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search planners (habits, finance, gym)..."
            className="w-full rounded-full border border-card-border bg-card pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Planners Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {planners.map((planner) => {
          const isFree = planner.price === 0;
          return (
            <motion.div
              key={planner.id}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.985 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
              onClick={() => setActiveViewerProduct(planner)}
              className="group relative flex flex-col rounded-2xl border border-card-border bg-card p-5 shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-foreground/20 hover:shadow-xl hover:shadow-black/5 cursor-pointer"
            >
              {/* Planner Mockup Stage */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-900 shadow-md">
                <img
                  src={planner.images[0] || "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80"}
                  alt={planner.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Category Pill */}
                <div className="absolute top-3 left-3 z-10 rounded-full bg-black/85 px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
                  {planner.plannerCategory || "Productivity"}
                </div>

                {/* Free / Paid Pill */}
                <div className="absolute top-3 right-3 z-10 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  {isFree ? "Free PDF" : "Digital Planner"}
                </div>

                {/* Look Inside Overlay */}
                <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex w-full items-center justify-center gap-1.5 rounded-full bg-white py-2 text-xs font-bold text-neutral-900 shadow-md">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Open In-Browser Reader</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="mt-4 flex flex-1 flex-col">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="font-semibold text-accent">
                    {planner.specs?.count || "90-Day OS"}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-foreground">{planner.rating}</span>
                    <span>({planner.reviewCount})</span>
                  </div>
                </div>

                <h3 className="mt-2 font-heading text-base font-bold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                  {planner.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-xs text-muted leading-relaxed">
                  {planner.description}
                </p>

                {/* Action Row */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-card-border/60">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-lg font-bold text-foreground">
                        {isFree ? "Free" : formatCurr(planner.price)}
                      </span>
                      {planner.originalPrice && planner.originalPrice > planner.price && (
                        <span className="text-xs text-muted line-through">
                          {formatCurr(planner.originalPrice)}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted">Tablet &amp; Print Ready</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveViewerProduct(planner);
                    }}
                    className="flex items-center gap-1 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-xs transition-opacity hover:opacity-90 active:scale-95"
                  >
                    <span>{isFree ? "Read / Download" : "Preview"}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {planners.length === 0 && (
        <div className="mt-12 rounded-3xl border border-card-border bg-card p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
            No planners found matching &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-2 text-xs text-muted">
            Try adjusting your search query or view all planners.
          </p>
        </div>
      )}

      {/* Protected In-Browser PDF Reader Modal */}
      {activeViewerProduct && (
        <PdfViewerModal
          isOpen={!!activeViewerProduct}
          onClose={() => setActiveViewerProduct(null)}
          title={activeViewerProduct.title}
          pdfUrl={activeViewerProduct.pdfUrl || activeViewerProduct.downloadUrl || "https://drive.google.com/file/d/sample/view"}
          previewPdfUrl={activeViewerProduct.previewPdfUrl || activeViewerProduct.pdfUrl || activeViewerProduct.downloadUrl}
          price={activeViewerProduct.price}
          isFree={activeViewerProduct.price === 0}
          authorOrCategory={activeViewerProduct.plannerCategory || "Productivity Planner"}
          isCopyProtected={activeViewerProduct.price > 0}
          slug={activeViewerProduct.slug}
        />
      )}
    </div>
  );
}
