"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Download, Star, Eye, ChevronRight, Lock } from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { PdfViewerModal } from "@/components/pdf/pdf-viewer-modal";

interface BookCardProps {
  product: Product;
  priority?: boolean;
}

export function BookCard({ product }: BookCardProps) {
  const router = useRouter();
  const { formatPrice: formatCurr } = useCurrency();
  const [readerOpen, setReaderOpen] = useState(false);

  const pageCount = product.pageCount ? `${product.pageCount} Pages` : product.specs?.count || "120+ Pages";
  const pdfUrl = product.pdfUrl || product.downloadUrl || "https://drive.google.com/file/d/sample/view";
  const previewPdfUrl = product.previewPdfUrl || pdfUrl;
  const isFree = product.price === 0;

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
          <div className="absolute top-3 right-3 z-20 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md border border-white/10">
            {isFree ? "Free PDF" : "Digital Master PDF"}
          </div>

          {/* Interactive Look Inside Hover Pill */}
          <div className="absolute inset-x-3 bottom-3 z-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setReaderOpen(true);
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-white/95 py-2 text-xs font-bold text-neutral-900 shadow-md backdrop-blur-md transition-transform hover:scale-[1.02] active:scale-95"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Read In-Browser (PDF)</span>
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
                  {isFree ? "Free" : formatCurr(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-muted line-through">
                    {formatCurr(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted">{isFree ? "Instant Download" : "Full Digital License"}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/templates/${product.slug}`);
              }}
              className="flex items-center gap-1 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-xs transition-opacity hover:opacity-90 active:scale-95"
            >
              <span>{isFree ? "Get Free" : "Get Book"}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* In-Browser PDF Reader Modal */}
      <PdfViewerModal
        isOpen={readerOpen}
        onClose={() => setReaderOpen(false)}
        title={product.title}
        pdfUrl={pdfUrl}
        previewPdfUrl={previewPdfUrl}
        price={product.price}
        isFree={isFree}
        authorOrCategory={product.authorName || "BADARSH Publishing"}
        isCopyProtected={!isFree}
        slug={product.slug}
      />
    </>
  );
}
