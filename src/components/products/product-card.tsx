"use client";

import { useState } from "react";
import Link from "next/link";
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
  const { formatPrice: formatCurr } = useCurrency();
  const [previewOpen, setPreviewOpen] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Visual gradient based on category
  const getCategoryGradient = (cat: string) => {
    switch (cat) {
      case "social-media":
        return "from-purple-600/25 via-pink-600/15 to-indigo-600/25 border-purple-500/20";
      case "presentations":
        return "from-blue-600/25 via-cyan-600/15 to-indigo-600/25 border-blue-500/20";
      case "branding":
        return "from-amber-600/25 via-orange-600/15 to-yellow-600/25 border-amber-500/20";
      case "ebooks":
        return "from-emerald-600/25 via-teal-600/15 to-green-600/25 border-emerald-500/20";
      case "planners":
        return "from-rose-600/25 via-fuchsia-600/15 to-pink-600/25 border-rose-500/20";
      default:
        return "from-violet-600/25 via-purple-600/15 to-indigo-600/25 border-violet-500/20";
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5"
      >
        {/* Product Visual Area */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br">
          <Link
            href={`/templates/${product.slug}`}
            className="absolute inset-0 block"
            aria-label={`View ${product.title}`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(
                product.category
              )} transition-transform duration-500 group-hover:scale-105`}
            />

            {/* Template Card Art Frame */}
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <div className="rounded-xl border border-white/20 bg-background/70 p-4 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:border-accent/40 group-hover:bg-background/90">
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                  {product.format}
                </span>
                <p className="mt-1 line-clamp-1 font-heading text-sm font-bold text-foreground">
                  {product.title}
                </p>
                <span className="mt-1 block text-[10px] text-muted">
                  50+ Custom Slides &bull; 1080x1920 HD
                </span>
              </div>
            </div>
          </Link>

          {/* Quick Preview Hover Trigger */}
          <div className="absolute bottom-3 right-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-card-border bg-card/90 px-3 py-1.5 text-xs font-bold text-foreground shadow-md backdrop-blur-md transition hover:bg-accent hover:text-white"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
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

          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 rounded-full bg-rose-500/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm pointer-events-none">
              Save {discountPercent}%
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

          <Link href={`/templates/${product.slug}`} className="mt-2 block">
            <h3 className="line-clamp-2 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent">
              {product.title}
            </h3>
          </Link>

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
                  {product.originalPrice && (
                    <span className="text-xs text-muted line-through">
                      {formatCurr(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewOpen(true)}
                  className="hidden sm:inline-flex cursor-pointer items-center rounded-lg border border-card-border bg-background p-1.5 text-muted hover:border-accent hover:text-accent"
                  title="Preview Slides"
                >
                  <Eye className="h-4 w-4" />
                </button>

                <Link
                  href={`/templates/${product.slug}`}
                  className="flex items-center gap-1 rounded-xl bg-accent px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent-hover hover:shadow"
                >
                  Get Template
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
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
