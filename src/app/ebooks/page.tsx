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
import { triggerDirectDownload } from "@/lib/download";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
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
      const isEbook =
        p.category === "ebooks" ||
        (p.category as string) === "ebook" ||
        (p as any).productType === "ebook" ||
        p.tags?.includes("ebook") ||
        p.tags?.includes("book") ||
        p.tags?.includes("guide");
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      let matchesCat = true;
      if (selectedCategory === "finance") {
        matchesCat = Boolean(
          p.tags?.some((t) => ["finance", "pricing", "wealth", "cashflow"].includes(t.toLowerCase())) ||
          p.title.toLowerCase().includes("wealth") ||
          p.title.toLowerCase().includes("cashflow")
        );
      } else if (selectedCategory === "habits") {
        matchesCat = Boolean(
          p.tags?.some((t) => ["habits", "productivity", "workflow", "systems"].includes(t.toLowerCase())) ||
          p.title.toLowerCase().includes("habit") ||
          p.title.toLowerCase().includes("systems")
        );
      } else if (selectedCategory === "business") {
        matchesCat = Boolean(
          p.tags?.some((t) => ["business", "agency", "ux", "retention", "product design"].includes(t.toLowerCase())) ||
          p.title.toLowerCase().includes("agency") ||
          p.title.toLowerCase().includes("retention")
        );
      }

      return isEbook && matchesSearch && matchesCat;
    });
  }, [productList, search, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
      <Breadcrumbs items={[{ label: "E-Books", href: "/ebooks" }]} />
      {/* Compact Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          E-Books &amp; Creator Playbooks
        </h1>
        <p className="mt-1 text-sm text-muted">
          Practical monetization guides and creative frameworks with an interactive in-browser preview reader.
        </p>
      </div>

      {/* Search & Category Pills */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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
            onBuy={(prod) => {
              if (prod.price === 0) {
                triggerDirectDownload(
                  `/api/download?productId=${encodeURIComponent(prod.id)}`,
                  `${prod.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-master.pdf`
                );
              } else {
                setCheckoutProduct(prod);
              }
            }}
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
