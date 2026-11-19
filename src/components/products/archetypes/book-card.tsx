"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Download, Star, Eye, X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";

interface BookCardProps {
  product: Product;
  priority?: boolean;
}

export function BookCard({ product }: BookCardProps) {
  const router = useRouter();
  const { formatPrice: formatCurr } = useCurrency();
  const [lookInsideOpen, setLookInsideOpen] = useState(false);
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);

  const samplePages = product.samplePages || [
    product.images[0] || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    product.images[1] || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80",
  ];

  const pageCount = product.specs?.count || "120+ Pages";

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
          <img
            src={product.images[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"}
            alt={product.title}
            className="h-full w-full object-cover"
          />

          {/* Top Format Badge */}
          <div className="absolute top-3 right-3 z-20 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
            PDF &bull; Digital Edition
          </div>

          {/* Interactive Look Inside Hover Pill */}
          <div className="absolute inset-x-3 bottom-3 z-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLookInsideOpen(true);
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-white/95 py-2 text-xs font-bold text-neutral-900 shadow-md backdrop-blur-md transition-transform hover:scale-[1.02] active:scale-95"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Look Inside (Sample)</span>
            </button>
          </div>
        </div>

        {/* Book Details */}
        <div className="mt-5 flex flex-1 flex-col">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1 font-semibold text-foreground/80">
              <BookOpen className="h-3.5 w-3.5 text-accent" />
              {pageCount}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{product.rating}</span>
              <span>({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="mt-2.5 line-clamp-2 font-heading text-base font-bold text-foreground group-hover:text-accent transition-colors">
            {product.title}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-xs text-muted leading-relaxed">
            {product.description}
          </p>

          {/* Price & Action Row */}
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-card-border/60">
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
              <span className="text-[10px] text-muted">Instant PDF Download</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/templates/${product.slug}`);
              }}
              className="flex items-center gap-1 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-xs transition-opacity hover:opacity-90 active:scale-95"
            >
              <span>Get Book</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Look Inside Modal (Apple Books Style Sample Reader) */}
      <AnimatePresence>
        {lookInsideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-card border border-card-border p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-card-border">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                    Sample Preview
                  </span>
                  <h4 className="text-base font-bold text-foreground">{product.title}</h4>
                </div>
                <button
                  onClick={() => setLookInsideOpen(false)}
                  className="rounded-full p-1.5 text-muted hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sample Page Stage */}
              <div className="relative my-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-950 flex items-center justify-center">
                <img
                  src={samplePages[activeSampleIndex]}
                  alt={`Sample page ${activeSampleIndex + 1}`}
                  className="h-full w-full object-contain"
                />

                {samplePages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveSampleIndex((prev) => (prev > 0 ? prev - 1 : samplePages.length - 1))
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white hover:bg-black"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveSampleIndex((prev) => (prev < samplePages.length - 1 ? prev + 1 : 0))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white hover:bg-black"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted">
                  Page {activeSampleIndex + 1} of {samplePages.length} &bull; Full book contains {pageCount}
                </span>

                <div className="flex items-center gap-3">
                  <span className="font-heading text-lg font-bold text-foreground">
                    {formatCurr(product.price)}
                  </span>
                  <Link
                    href={`/templates/${product.slug}`}
                    className="flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-accent-hover"
                  >
                    <span>Unlock Full Book</span>
                    <Download className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
