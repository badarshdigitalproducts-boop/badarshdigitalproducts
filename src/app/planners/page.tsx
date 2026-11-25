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
import { AestheticPlannerCard } from "@/components/planners/aesthetic-planner-card";
import { PdfViewerModal } from "@/components/pdf/pdf-viewer-modal";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
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
      const isPlanner =
        p.category === "planners" ||
        (p.category as string) === "planner" ||
        (p as any).productType === "planner" ||
        p.tags?.includes("planner");
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
      <Breadcrumbs items={[{ label: "Planners", href: "/planners" }]} />
      {/* Compact Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Productivity &amp; Life Planners
        </h1>
        <p className="mt-1 text-sm text-muted">
          Preview templates in our protected PDF viewer and download iPad-ready GoodNotes &amp; printable layouts.
        </p>
      </div>

      {/* Category Tabs & Search */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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

      {/* iPad Aesthetic Planners Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {planners.map((planner) => (
          <AestheticPlannerCard key={planner.id} product={planner} />
        ))}
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
