"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Sparkles,
  Download,
  Eye,
  Star,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
} from "lucide-react";
import { products as fallbackProducts } from "@/content/products";
import { useCurrency } from "@/context/currency-context";
import { Interactive3dBook } from "@/components/books/interactive-3d-book";
import { ChapterReaderModal } from "@/components/books/chapter-reader-modal";
import { CheckoutModal } from "@/components/products/checkout-modal";
import type { Product } from "@/types";

const EBOOK_CATEGORIES = [
  { id: "all", label: "All E-Books" },
  { id: "finance", label: "Wealth & Finance" },
  { id: "habits", label: "Habits & Productivity" },
  { id: "business", label: "Business & Product Design" },
];

export default function EbooksPage() {
  const { formatPrice: formatCurr } = useCurrency();
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [readerProduct, setReaderProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch("/api/products?category=ebooks")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch((err) => console.error("Error loading live ebooks:", err));
  }, []);

  const ebooks = useMemo(() => {
    return productList.filter((p) => {
      const isEbook = p.category === "ebooks" || p.tags?.includes("ebook");
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      let matchesCat = true;
      if (selectedCategory === "finance") {
        matchesCat = Boolean(
          p.tags?.some((t) => ["finance", "investing", "wealth", "money", "rich dad poor dad", "cashflow"].includes(t.toLowerCase())) ||
          p.title.toLowerCase().includes("money") ||
          p.title.toLowerCase().includes("rich") ||
          p.title.toLowerCase().includes("cashflow")
        );
      } else if (selectedCategory === "habits") {
        matchesCat = Boolean(
          p.tags?.some((t) => ["habits", "productivity", "self improvement", "atomic habits"].includes(t.toLowerCase())) ||
          p.title.toLowerCase().includes("habit")
        );
      } else if (selectedCategory === "business") {
        matchesCat = Boolean(
          p.tags?.some((t) => ["business", "startups", "ux", "product design", "hooked"].includes(t.toLowerCase())) ||
          p.title.toLowerCase().includes("business") ||
          p.title.toLowerCase().includes("hooked")
        );
      }

      return isEbook && matchesSearch && matchesCat;
    });
  }, [productList, search, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent">
          <BookOpen className="h-3.5 w-3.5" />
          BADARSH Digital Library
        </span>
        <h1 className="mt-4 apple-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Original E-Books &amp; <span className="text-accent">Creator Playbooks</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          No recycled AI summaries or generic advice. Proprietary step-by-step monetization playbooks, viral script frameworks, and growth systems written and executed by the BADARSH studio team.
        </p>

        {/* Value Prop Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Interactive In-Browser PDF Reader</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Direct High-Res PDF Downloads</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Commercial Implementation License</span>
          </div>
        </div>
      </div>

      {/* Search & Category Pills */}
      <div className="mt-14 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {EBOOK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-secondary/70 text-muted hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books & playbooks..."
            className="w-full rounded-full border border-card-border bg-card pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* 3D Physical Books Interactive Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {ebooks.map((ebook) => (
          <Interactive3dBook
            key={ebook.id}
            product={ebook}
            onReadPreview={(prod) => setReaderProduct(prod)}
            onBuy={(prod) => setCheckoutProduct(prod)}
          />
        ))}
      </div>

      {/* In-Browser Chapter 1 & 2 Free Reader */}
      <ChapterReaderModal
        isOpen={Boolean(readerProduct)}
        onClose={() => setReaderProduct(null)}
        product={readerProduct}
        onUnlock={(prod) => {
          setReaderProduct(null);
          setCheckoutProduct(prod);
        }}
      />

      {/* 1-Click Instant Checkout */}
      {checkoutProduct && (
        <CheckoutModal
          isOpen={Boolean(checkoutProduct)}
          onClose={() => setCheckoutProduct(null)}
          product={checkoutProduct}
        />
      )}

      {/* Empty State */}
      {ebooks.length === 0 && (
        <div className="mt-12 rounded-3xl border border-card-border bg-card p-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
            No e-books found matching &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-2 text-xs text-muted">
            Try adjusting your search query or view all books.
          </p>
        </div>
      )}
    </div>
  );
}
