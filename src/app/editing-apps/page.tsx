"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Smartphone,
  Sparkles,
  Download,
  Star,
  CheckCircle2,
  ShieldCheck,
  Search,
  Zap,
  ArrowRight,
  Cpu,
  FileCheck,
} from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { products as fallbackProducts } from "@/content/products";
import { useCurrency } from "@/context/currency-context";
import type { Product } from "@/types";

export default function EditingAppsPage() {
  const { formatPrice: formatCurr } = useCurrency();
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/products?category=editing-apps")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch((err) => console.error("Error loading live editing apps:", err));
  }, []);

  const apps = useMemo(() => {
    return productList.filter((p) => {
      const isApp = p.category === "editing-apps" || p.tags?.includes("apk") || p.tags?.includes("editing apps");
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return isApp && matchesSearch;
    });
  }, [productList, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Hero Header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent">
          <Smartphone className="h-3.5 w-3.5 text-accent" />
          Direct Creator Tools &amp; APKs
        </span>
        <h1 className="mt-4 font-heading text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Verified Mobile Video{" "}
          <span className="bg-gradient-to-r from-accent via-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Editing Apps &amp; APKs
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Download video editing APKs directly from BADARSH. No shady third-party popups, no expired links. All VIP transitions, auto-captions, and 4K 60fps exports unlocked and verified by our technical team.
        </p>

        {/* Feature Badges */}
        <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Direct High-Speed APK Download</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>100% Virus-Scanned &amp; Verified</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>No Watermark on 4K Exports</span>
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
            placeholder="Search editing apps (CapCut, VN, Premiere shortcuts)..."
            className="w-full rounded-full border border-card-border bg-card pl-11 pr-5 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <ProductCard key={app.id} product={app} priority />
        ))}
      </div>

      {/* Empty State */}
      {apps.length === 0 && (
        <div className="mt-16 rounded-3xl border border-card-border bg-card p-12 text-center">
          <Smartphone className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
            No editing apps found matching &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-2 text-xs text-muted">
            Check back soon for new app version drops!
          </p>
        </div>
      )}

      {/* Installation FAQ Banner */}
      <div className="mt-20 rounded-3xl border border-card-border bg-card/60 p-8 md:p-12">
        <h3 className="font-heading text-xl font-bold text-foreground mb-4">
          How to Install APKs on Android (Step-by-Step)
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 text-xs leading-relaxed text-muted">
          <div className="rounded-2xl border border-card-border bg-background p-5">
            <span className="font-heading text-2xl font-black text-accent">01</span>
            <h4 className="mt-2 font-bold text-sm text-foreground">Download APK</h4>
            <p className="mt-1">
              Click the direct download button right after checkout. The APK file saves directly to your device.
            </p>
          </div>
          <div className="rounded-2xl border border-card-border bg-background p-5">
            <span className="font-heading text-2xl font-black text-accent">02</span>
            <h4 className="mt-2 font-bold text-sm text-foreground">Allow Unknown Sources</h4>
            <p className="mt-1">
              If prompted by Android, enable &ldquo;Install from this source&rdquo; in your device settings.
            </p>
          </div>
          <div className="rounded-2xl border border-card-border bg-background p-5">
            <span className="font-heading text-2xl font-black text-accent">03</span>
            <h4 className="mt-2 font-bold text-sm text-foreground">Open &amp; Edit</h4>
            <p className="mt-1">
              Open the app and enjoy full premium access: no watermark, 4K export, and all VIP effects ready to go.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
