"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Star,
  Eye,
  Sparkles,
  Tablet,
  CheckCircle2,
  Download,
  Check,
  Layers,
} from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { PdfViewerModal } from "@/components/pdf/pdf-viewer-modal";
import { CheckoutModal } from "@/components/products/checkout-modal";
import { triggerDirectDownload } from "@/lib/download";

interface AestheticPlannerCardProps {
  product: Product;
}

export function AestheticPlannerCard({ product }: AestheticPlannerCardProps) {
  const router = useRouter();
  const { formatPrice: formatCurr } = useCurrency();
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "habits" | "budget">("daily");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const isFree = product.price === 0;
  const coverImg = product.images[0] || "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80";

  // Tab samples
  const spreads = {
    daily: { name: "Daily Focus Spread", tag: "Time-Blocking & 80/20 Priorities" },
    weekly: { name: "Weekly Overview", tag: "7-Day High-Level Roadmap" },
    habits: { name: "Habit Tracker", tag: "365-Day Consistency Grid" },
    budget: { name: "Financial Ledger", tag: "Income, Expenses & Savings Goals" },
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFree) {
      if (product.downloadUrl) {
        triggerDirectDownload(product.downloadUrl, `${product.title.toLowerCase().replace(/\s+/g, "-")}-planner.pdf`);
      } else {
        setPreviewOpen(true);
      }
    } else {
      setCheckoutOpen(true);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
        onClick={() => setPreviewOpen(true)}
        className="group relative flex flex-col rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs hover:shadow-2xl transition-all cursor-pointer"
      >
        {/* iPad Pro Aesthetic Mockup Frame */}
        <div className="relative aspect-[4/3] w-full rounded-2xl bg-neutral-900 p-2.5 shadow-xl ring-1 ring-white/10 overflow-hidden">
          {/* Subtle iPad Front Camera Sensor */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-neutral-700 z-30" />

          {/* iPad Inner Screen */}
          <div className="relative h-full w-full rounded-xl overflow-hidden bg-neutral-950">
            <img
              src={coverImg}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Hyperlinked Month Tabs Simulation (Top/Right edge) */}
            <div className="absolute top-2 right-2 z-20 flex flex-col gap-0.5">
              {["JAN", "FEB", "MAR", "APR"].map((m, idx) => (
                <span
                  key={idx}
                  className="rounded-xs bg-black/70 backdrop-blur-md px-1 py-0.5 text-[8px] font-mono font-bold text-white/90 border border-white/10"
                >
                  {m}
                </span>
              ))}
            </div>

            {/* Category Pill */}
            <div className="absolute top-2.5 left-2.5 z-20 rounded-md bg-black/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/15">
              {product.plannerCategory || "GoodNotes PDF"}
            </div>

            {/* Interactive Look Inside Overlay */}
            <div className="absolute inset-x-3 bottom-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewOpen(true);
                }}
                className="flex w-full items-center justify-center gap-1.5 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md py-2 text-xs font-bold text-neutral-900 dark:text-white shadow-lg border border-black/10 hover:scale-102 transition-transform"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Open Interactive Planner Tour</span>
              </button>
            </div>
          </div>
        </div>

        {/* Spread Quick Switcher Pills */}
        <div className="mt-4 flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
          {(["daily", "weekly", "habits", "budget"] as const).map((tab) => (
            <button
              key={tab}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab(tab);
              }}
              className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Planner Details */}
        <div className="mt-3 flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              <span className="font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                {spreads[activeTab].tag}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-bold text-neutral-900 dark:text-white">{product.rating}</span>
                <span>({product.reviewCount})</span>
              </div>
            </div>

            <h3 className="font-heading text-base font-bold text-neutral-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {product.title}
            </h3>

            <p className="mt-1 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                {isFree ? "Printable PDF" : "Digital System"}
              </span>
              <div className="text-base font-bold text-neutral-900 dark:text-white">
                {isFree ? "Free Download" : formatCurr(product.price)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewOpen(true);
                }}
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                Look Inside
              </button>
              <button
                onClick={handleActionClick}
                className="flex items-center gap-1 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 text-xs font-bold shadow-md hover:scale-102 active:scale-98 transition-transform"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>{isFree ? "Download" : "Get Planner"}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interactive PDF Page Tour Modal */}
      <PdfViewerModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={product.title}
        pdfUrl={product.pdfUrl || product.downloadUrl || ""}
        price={product.price}
        isFree={isFree}
        product={product}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        product={product}
      />
    </>
  );
}
