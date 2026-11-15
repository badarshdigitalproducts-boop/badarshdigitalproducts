"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Download, Sparkles, ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Visual gradient based on category
  const getCategoryGradient = (cat: string) => {
    switch (cat) {
      case "social-media":
        return "from-purple-600/20 via-pink-600/10 to-indigo-600/20 border-purple-500/20";
      case "presentations":
        return "from-blue-600/20 via-cyan-600/10 to-indigo-600/20 border-blue-500/20";
      case "branding":
        return "from-amber-600/20 via-orange-600/10 to-yellow-600/20 border-amber-500/20";
      case "ebooks":
        return "from-emerald-600/20 via-teal-600/10 to-green-600/20 border-emerald-500/20";
      case "planners":
        return "from-rose-600/20 via-fuchsia-600/10 to-pink-600/20 border-rose-500/20";
      default:
        return "from-violet-600/20 via-purple-600/10 to-indigo-600/20 border-violet-500/20";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5"
    >
      {/* Product Visual Area */}
      <Link
        href={`/templates/${product.slug}`}
        className="relative block aspect-[16/10] w-full overflow-hidden bg-gradient-to-br"
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(
            product.category
          )} transition-transform duration-500 group-hover:scale-105`}
        />

        {/* Decorative pattern / badge */}
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <div className="rounded-xl border border-white/20 bg-background/60 p-4 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:border-accent/40 group-hover:bg-background/80">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              {product.format}
            </span>
            <p className="mt-1 line-clamp-1 font-heading text-base font-bold text-foreground">
              {product.title}
            </p>
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
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
          <div className="absolute top-3 right-3 rounded-full bg-rose-500/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm">
            Save {discountPercent}%
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="font-medium uppercase tracking-wider text-accent/90">
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
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-muted line-through">
                    {formatPrice(product.originalPrice, product.currency)}
                  </span>
                )}
              </div>
            </div>

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
    </motion.div>
  );
}
