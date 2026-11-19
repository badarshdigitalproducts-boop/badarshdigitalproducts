"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, Download, Eye, Play, ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { TemplatePreviewModal } from "../template-preview-modal";

interface StandardTemplateCardProps {
  product: Product;
  priority?: boolean;
}

export function StandardTemplateCard({ product }: StandardTemplateCardProps) {
  const router = useRouter();
  const { formatPrice: formatCurr } = useCurrency();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    router.push(`/templates/${product.slug}`);
  };

  const coverImg = product.images?.[0];

  return (
    <>
      <motion.div
        onClick={handleCardClick}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-card-border bg-card shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-foreground/20 hover:shadow-xl hover:shadow-black/5 cursor-pointer"
      >
        {/* Product Visual Area */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
          {coverImg && !imageError ? (
            <img
              src={coverImg}
              alt={product.title}
              onError={() => setImageError(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <div className="rounded-xl border border-card-border bg-card/90 p-4 shadow-sm backdrop-blur-md">
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
          )}

          {/* Quick Preview Hover Trigger */}
          <div className="absolute bottom-3 right-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreviewOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-black/90 px-3 py-1.5 text-xs font-bold text-foreground shadow-sm backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Quick Preview</span>
            </button>
          </div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
            {product.isBestseller && (
              <span className="flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
                Bestseller
              </span>
            )}
            {product.isNew && (
              <span className="rounded-full bg-accent/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
                New
              </span>
            )}
          </div>

          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm pointer-events-none">
              Save {discountPercent}%
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="font-semibold uppercase tracking-wider text-accent text-[11px]">
              {product.category.replace("-", " ")}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{product.rating}</span>
              <span>({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="mt-2 line-clamp-2 font-heading text-base font-bold text-foreground transition-colors group-hover:text-accent">
            {product.title}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-xs text-muted leading-relaxed">
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
                  <span className="font-heading text-lg font-bold text-foreground">
                    {formatCurr(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-muted line-through">
                      {formatCurr(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/templates/${product.slug}`);
                }}
                className="flex items-center gap-1 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-xs transition-opacity hover:opacity-90 active:scale-95"
              >
                <span>View Details</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Preview Modal */}
      <TemplatePreviewModal
        product={product}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
}
