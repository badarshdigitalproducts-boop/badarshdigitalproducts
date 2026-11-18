"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, Download, Sparkles, ArrowUpRight, Eye } from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { TemplatePreviewModal } from "./template-preview-modal";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { formatPrice: formatCurr } = useCurrency();
  const [previewOpen, setPreviewOpen] = useState(false);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  // Visual backdrop tint based on category — subtle Apple studio tones
  const getCategoryGradient = (cat: string) => {
    switch (cat) {
      case "social-media":
        return "from-accent/8 via-card to-accent/4";
      case "presentations":
        return "from-blue-500/8 via-card to-indigo-500/4";
      case "branding":
        return "from-amber-500/8 via-card to-orange-500/4";
      case "ebooks":
        return "from-emerald-500/8 via-card to-teal-500/4";
      case "planners":
        return "from-rose-500/8 via-card to-pink-500/4";
      case "bundles":
        return "from-purple-500/8 via-card to-indigo-500/4";
      default:
        return "from-accent/8 via-card to-accent/4";
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if click wasn't on a preview button or interactive control
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    router.push(`/templates/${product.slug}`);
  };

  return (
    <>
      <motion.div
        onClick={handleCardClick}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-card-border bg-card shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-foreground/20 hover:shadow-xl hover:shadow-black/[0.04] cursor-pointer"
      >
        {/* Product Visual Area */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary/50">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(
              product.category
            )} transition-transform duration-500 group-hover:scale-105`}
          />

          {/* Template Card Art Frame */}
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <div className="rounded-xl border border-card-border bg-card/90 p-4 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:border-accent/40 group-hover:shadow-md">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                {product.format}
              </span>
              <p className="mt-1 line-clamp-1 font-heading text-sm font-bold text-foreground">
                {product.title}
              </p>
              <span className="mt-1 block text-[10px] text-muted">
                {product.specs?.count || product.format} &bull; {product.specs?.dimensions || "HD Resolution"}
              </span>
            </div>
          </div>

          {/* Quick Preview Hover Trigger */}
          <div className="absolute bottom-3 right-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreviewOpen(true);
              }}
              aria-label={`Quick preview slides for ${product.title}`}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-card-border/80 bg-card/90 px-3 py-1.5 text-xs font-bold text-foreground shadow-sm backdrop-blur-md transition-[transform,background-color] duration-150 hover:bg-accent hover:text-white active:scale-90"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Quick Preview</span>
            </button>
          </div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
            {product.isBestseller && (
              <span className="flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm">
                <Sparkles className="h-3 w-3" /> Bestseller
              </span>
            )}
            {product.isNew && (
              <span className="rounded-full bg-accent/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm">
                New
              </span>
            )}
          </div>

          {/* Honest Bundle Savings (Only shown on real bundle discounts) */}
          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm pointer-events-none">
              Bundle Value &bull; Save {discountPercent}%
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="font-semibold uppercase tracking-wider text-accent">
              {product.category.replace("-", " ")}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{product.rating}</span>
              <span>({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="mt-2 line-clamp-2 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent">
            {product.title}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-sm text-muted">
            {product.description}
          </p>

          {/* Footer info & CTA */}
          <div className="mt-auto pt-4">
            <div className="mb-3 flex items-center justify-between text-xs text-muted">
              <span className="flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                {product.downloads.toLocaleString()}+ downloads
              </span>
              <span className="font-medium text-foreground">{product.format}</span>
            </div>

            <div className="flex items-center justify-between border-t border-card-border/60 pt-3">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-xl font-bold text-foreground">
                    {formatCurr(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-muted line-through">
                      {formatCurr(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewOpen(true);
                  }}
                  className="hidden sm:inline-flex cursor-pointer items-center rounded-lg border border-card-border bg-background p-1.5 text-muted hover:border-accent hover:text-accent"
                  title="Preview Slides"
                  aria-label={`Preview slides for ${product.title}`}
                >
                  <Eye className="h-4 w-4" />
                </button>

                <span
                  className="flex items-center gap-1 rounded-xl bg-accent px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 group-hover:bg-accent-hover group-hover:shadow"
                >
                  Get Template
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <TemplatePreviewModal
        product={product}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
}
