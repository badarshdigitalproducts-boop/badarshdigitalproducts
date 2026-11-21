"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sliders, Sparkles, Star, Download, ExternalLink, Zap } from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { CheckoutModal } from "../checkout-modal";

interface PresetCardProps {
  product: Product;
  priority?: boolean;
}

export function PresetCard({ product }: PresetCardProps) {
  const router = useRouter();
  const { formatPrice: formatCurr } = useCurrency();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isFree = product.price === 0;

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFree) {
      const targetUrl = product.presetLinkUrl || product.downloadUrl || "https://lightroom.adobe.com/";
      window.open(targetUrl, "_blank");
    } else {
      setCheckoutOpen(true);
    }
  };

  // Default high-contrast before/after images if product doesn't have custom ones
  const beforeImg =
    product.beforeImage ||
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=70&auto=format&fit=crop";
  const afterImg =
    product.afterImage ||
    product.images[0] ||
    "https://images.unsplash.com/photo-1502759683299-cdcd1a7082fe?w=1200&q=80&auto=format&fit=crop";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
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
      {/* Interactive Before/After Split Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative aspect-[16/11] w-full overflow-hidden rounded-xl bg-neutral-900 select-none"
      >
        {/* AFTER Image (Background full width) */}
        <img
          src={afterImg}
          alt={`${product.title} After Preset`}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* BEFORE Image (Clipped by slider position) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImg}
            alt={`${product.title} Before Preset (Raw)`}
            className="absolute inset-0 h-full w-full object-cover max-w-none grayscale-[40%] contrast-90 brightness-95"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%" }}
          />
        </div>

        {/* Vertical Divider Line with Grab Handle */}
        <div
          className="absolute top-0 bottom-0 z-20 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-lg text-neutral-900">
            <Sliders className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Floating Labels */}
        <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
          RAW
        </div>
        <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-md bg-accent/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
          GRADED
        </div>

        {/* Helpful drag hint */}
        <div className="pointer-events-none absolute bottom-3 inset-x-0 z-10 text-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="rounded-full bg-black/75 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
            Drag or hover to compare grade
          </span>
        </div>
      </div>

      {/* Preset Details */}
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1 font-semibold text-accent">
            <Sparkles className="h-3 w-3" />
            1-Click Lightroom Mobile (.DNG)
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="mt-2 font-heading text-base font-bold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
          {product.title}
        </h3>

        <p className="mt-1 line-clamp-2 text-xs text-muted leading-relaxed">
          {product.description}
        </p>

        {/* Lightroom 1-Click Feature Tag */}
        <div className="mt-3 flex items-center gap-2 text-[11px] text-muted">
          <span className="rounded-md bg-secondary px-2 py-0.5 font-medium text-foreground">
            DNG &bull; XMP
          </span>
          <span>Free Lightroom Mobile Compatible</span>
        </div>

        {/* Action Row */}
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
            <span className="text-[10px] text-muted">Instant Preset Link</span>
          </div>

          <button
            onClick={handleActionClick}
            className="flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-xs transition-opacity hover:opacity-90 active:scale-95 cursor-pointer"
          >
            <span>{isFree ? "Get Free Preset" : "Get Preset"}</span>
            <ExternalLink className="h-3 w-3" />
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
