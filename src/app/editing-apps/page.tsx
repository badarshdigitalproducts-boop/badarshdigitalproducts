"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Layers,
  ChevronRight,
  ExternalLink,
  Play,
  Eye,
} from "lucide-react";
import { products as fallbackProducts } from "@/content/products";
import { useCurrency } from "@/context/currency-context";
import { AppCard } from "@/components/products/archetypes/app-card";
import { AppStoreModal } from "@/components/apps/app-store-modal";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SmartImage } from "@/components/shared/smart-image";
import type { Product } from "@/types";

const APP_CATEGORIES = [
  { id: "all", label: "All Creator Apps" },
  { id: "video", label: "Video Editors" },
  { id: "xml", label: "XML & Motion FX" },
  { id: "color", label: "Color & LUTs" },
];

function filterApps(list: Product[]): Product[] {
  return list.filter((p) => {
    return (
      p.category === "editing-apps" ||
      (p.category as string) === "apps" ||
      (p.category as string) === "app" ||
      (p as any).productType === "app-license" ||
      (p as any).productType === "app" ||
      p.tags?.some((t) => ["editing apps", "editing app", "mobile creator", "vn editor", "capcut", "alight motion", "lightroom"].includes(t.toLowerCase()))
    );
  });
}

export default function EditingAppsPage() {
  const { formatPrice: formatCurr } = useCurrency();
  const [productList, setProductList] = useState<Product[]>(() => filterApps(fallbackProducts));
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFeaturedApp, setSelectedFeaturedApp] = useState<Product | null>(null);

  useEffect(() => {
    fetch("/api/products?category=editing-apps")
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data) => {
        if (data?.products && Array.isArray(data.products) && data.products.length > 0) {
          setProductList(filterApps(data.products));
        }
      })
      .catch(() => {
        // Keeps fallback products safely
      });
  }, []);

  const apps = useMemo(() => {
    return productList.filter((p) => {
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      let matchesCat = true;
      if (selectedCategory === "video") {
        matchesCat = Boolean(
          p.tags?.some((t) => ["video", "video editing", "vn editor", "capcut", "premiere", "davinci"].includes(t.toLowerCase()))
        );
      } else if (selectedCategory === "xml") {
        matchesCat = Boolean(
          p.tags?.some((t) => ["xml", "motion", "alight motion", "shakes", "velocity"].includes(t.toLowerCase()))
        );
      } else if (selectedCategory === "color") {
        matchesCat = Boolean(
          p.tags?.some((t) => ["lut", "color", "lightroom", "presets", "dng"].includes(t.toLowerCase()))
        );
      }

      return matchesSearch && matchesCat;
    });
  }, [productList, search, selectedCategory]);

  const featuredApp = apps[0] || productList[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
      <Breadcrumbs items={[{ label: "Creator Apps & APKs", href: "/editing-apps" }]} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#01875f] text-white font-black text-[10px]">
            ▶
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#01875f] dark:text-[#25b885]">
            Google Play &bull; Verified Creator Suite
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Creator Video Editors &amp; APK Suites
        </h1>
        <p className="mt-1 text-sm text-muted max-w-2xl">
          Verified mobile video editors, 4K 60fps export presets, XML shake engines, and color grading suites. Free 1-click install just like Google Play Store.
        </p>
      </div>

      {/* Featured App Spotlight (Google Play &lsquo;Editor&rsquo;s Choice&rsquo;) */}
      {featuredApp && (
        <div className="overflow-hidden rounded-3xl border border-card-border bg-gradient-to-br from-card via-card to-secondary/30 p-5 md:p-8 shadow-lg relative">
          <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-[#01875f]/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-start gap-5 min-w-0">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-[22%] border border-card-border bg-neutral-900 shadow-xl">
                <SmartImage
                  src={featuredApp.images[0] || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"}
                  alt={featuredApp.title}
                  fill
                  priority
                  sizes="112px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[#01875f]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#01875f] dark:text-[#25b885]">
                    Editor&apos;s Choice
                  </span>
                  <span className="text-xs text-muted font-mono">
                    {featuredApp.appVersion || "v2.5 Studio"}
                  </span>
                </div>

                <h2 className="mt-1 font-heading text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground">
                  {featuredApp.title}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                  <div className="flex items-center gap-1 font-semibold text-foreground">
                    <span>{featuredApp.rating || 4.9}</span>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </div>
                  <span>&bull;</span>
                  <span>{featuredApp.fileSize || "45 MB"}</span>
                  <span>&bull;</span>
                  <span className="text-emerald-500 font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified by Play Protect
                  </span>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed line-clamp-2 max-w-2xl">
                  {featuredApp.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 w-full lg:w-auto shrink-0">
              <div className="text-center lg:text-right">
                <div className="font-heading text-2xl font-black text-[#01875f] dark:text-[#25b885]">
                  Free Install
                </div>
                <span className="text-[11px] text-muted">Direct APK &amp; Config Download</span>
              </div>

              <button
                onClick={() => setSelectedFeaturedApp(featuredApp)}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#01875f] hover:bg-[#017250] text-white px-7 py-3.5 text-xs font-bold shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Install Now (Free)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Category Tabs */}
      <div className="mt-12 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {APP_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#01875f] text-white shadow-sm"
                  : "bg-secondary/70 text-muted hover:text-foreground hover:bg-secondary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search apps (VN, CapCut, Alight, 4K)..."
            className="w-full rounded-full border border-card-border bg-card pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted focus:border-[#01875f] focus:outline-none"
          />
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <AppCard key={app.id} product={app} priority />
        ))}
      </div>

      {/* Empty State */}
      {apps.length === 0 && (
        <div className="mt-12 rounded-3xl border border-card-border bg-card p-12 text-center">
          <Smartphone className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
            No creator apps found matching &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-2 text-xs text-muted">
            Try searching for &ldquo;VN&rdquo;, &ldquo;CapCut&rdquo;, &ldquo;Alight&rdquo;, or &ldquo;Lightroom&rdquo;.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
            }}
            className="mt-4 rounded-full bg-[#01875f] text-white px-5 py-2 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Google Play Protect Safe Guarantee Banner */}
      <div className="mt-16 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 md:p-12 shadow-sm">
        <div className="flex items-center gap-2.5 text-xs font-bold text-[#01875f] dark:text-[#25b885] uppercase tracking-wider mb-2">
          <ShieldCheck className="h-5 w-5" />
          <span>Google Play Protect Guarantee</span>
        </div>
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          Safe, Verified &amp; 100% Free Creator Installations
        </h3>
        <p className="mt-2 text-xs text-muted max-w-2xl leading-relaxed">
          Every APK installer, XML preset engine, and workflow guide on BADARSH is manually audited and scanned against malicious code, background trackers, and annoying ads. You get clean, high-performance tools engineered for real video editors.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 text-xs leading-relaxed text-muted">
          <div className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#01875f]/10 text-[#01875f] font-bold text-lg mb-4">
              01
            </div>
            <h4 className="font-bold text-sm text-foreground">Tap Install</h4>
            <p className="mt-1.5">
              Click Install on any app to launch the authentic Google Play download tray. Files save immediately to your device.
            </p>
          </div>
          <div className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#01875f]/10 text-[#01875f] font-bold text-lg mb-4">
              02
            </div>
            <h4 className="font-bold text-sm text-foreground">Allow Unknown Sources</h4>
            <p className="mt-1.5">
              If prompted by Android Security, tap Settings and enable &ldquo;Allow from this source&rdquo; to complete the installation.
            </p>
          </div>
          <div className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#01875f]/10 text-[#01875f] font-bold text-lg mb-4">
              03
            </div>
            <h4 className="font-bold text-sm text-foreground">Render in 4K 60fps</h4>
            <p className="mt-1.5">
              Import the pre-calibrated XML render profiles and export crisp Reels, TikToks, and Shorts without compression blur.
            </p>
          </div>
        </div>
      </div>

      {/* Featured App Modal */}
      {selectedFeaturedApp && (
        <AppStoreModal
          isOpen={Boolean(selectedFeaturedApp)}
          onClose={() => setSelectedFeaturedApp(null)}
          product={selectedFeaturedApp}
        />
      )}
    </div>
  );
}
