"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Download, Star, CheckCircle2, Lock } from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { CheckoutModal } from "../checkout-modal";
import { useProductAccess } from "@/hooks/use-product-access";
import { triggerDirectDownload } from "@/lib/download";
import { SmartImage } from "@/components/shared/smart-image";

interface BookCardProps {
  product: Product;
  priority?: boolean;
}

export function BookCard({ product }: BookCardProps) {
  const router = useRouter();
  const { formatPrice: formatCurr } = useCurrency();
  const { isUnlocked, handleDownload } = useProductAccess(product);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const pageCount = product.pageCount ? `${product.pageCount} Pages` : product.specs?.count || "120+ Pages";
  const isFree = product.price === 0;

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnlocked) {
      handleDownload(e);
      return;
    }
    if (isFree) {
      triggerDirectDownload(
        `/api/download?productId=${encodeURIComponent(product.id)}`,
        `${product.title.toLowerCase().replace(/[^a-z0-9_-]+/g, "-")}-master.pdf`
      );
    } else {
      setCheckoutOpen(true);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
        onClick={() => router.push(`/templates/${product.slug}`)}
        className="group relative flex flex-col rounded-2xl border border-card-border bg-card p-5 shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-foreground/20 hover:shadow-xl hover:shadow-black/5 cursor-pointer"
      >
        {/* Book Presentation Stage — 3:4 Apple Books Portrait Aspect */}
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[240px] overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.02] bg-neutral-900">
          {/* Subtle Left Spine Shadow (gives physical book depth) */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-4 bg-gradient-to-r from-black/40 via-black/15 to-transparent" />
          <div className="pointer-events-none absolute left-3 top-0 bottom-0 z-20 w-[1px] bg-white/20" />

          {/* Book Cover Image */}
          <SmartImage
            src={product.images[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 80vw, 240px"
            className="object-cover"
          />

          {/* Top Format Badge */}
          <div className="absolute top-3 right-3 z-20 rounded-full bg-black/90 px-2.5 py-0.5 text-[10px] font-semibold text-white border border-white/15">
            {isUnlocked ? "Purchased" : isFree ? "Free PDF" : "Digital Master PDF"}
          </div>
        </div>

        {/* Book Details */}
        <div className="mt-5 flex flex-1 flex-col">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1 font-semibold text-foreground/80">
              <BookOpen className="h-3.5 w-3.5 text-accent" />
              {pageCount}
            </span>
            <span className="text-[11px] font-medium text-muted">Digital PDF</span>
          </div>

          <h3 className="mt-2.5 line-clamp-2 font-heading text-base font-bold text-foreground group-hover:text-accent transition-colors">
            {product.title}
          </h3>
          {product.authorName && (
            <p className="mt-0.5 text-xs font-semibold text-accent">
              By {product.authorName}
            </p>
          )}

          <p className="mt-1.5 line-clamp-2 text-xs text-muted leading-relaxed">
            {product.description}
          </p>

          {/* Price & Action Row */}
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-card-border/60">
            <div>
              {isUnlocked ? (
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                  Purchased
                </span>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-lg font-bold text-foreground">
                    {isFree ? "Free" : formatCurr(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-muted line-through">
                      {formatCurr(product.originalPrice)}
                    </span>
                  )}
                </div>
              )}
              <span className="text-[10px] text-muted block mt-0.5">
                {isUnlocked ? "Lifetime Re-download" : isFree ? "Instant Download" : "Full Digital License"}
              </span>
            </div>

            <button
              onClick={handleActionClick}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold shadow-xs transition-opacity hover:opacity-90 active:scale-95 cursor-pointer ${
                isUnlocked ? "bg-emerald-600 text-white" : "bg-foreground text-background"
              }`}
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isUnlocked ? "Download PDF (Purchased)" : isFree ? "Download PDF" : "Get Book"}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Instant Checkout Modal */}
      <CheckoutModal
        product={product}
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}
