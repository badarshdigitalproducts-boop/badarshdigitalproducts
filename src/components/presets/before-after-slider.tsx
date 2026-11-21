"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sliders,
  Sparkles,
  Download,
  Smartphone,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  X,
  Share2,
} from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { CheckoutModal } from "@/components/products/checkout-modal";

interface BeforeAfterSliderProps {
  product: Product;
}

export function BeforeAfterSlider({ product }: BeforeAfterSliderProps) {
  const { formatPrice: formatCurr } = useCurrency();
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [guideModalOpen, setGuideModalOpen] = useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const beforeImg =
    product.beforeImage ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=70&sat=-50"; // desaturated/flat raw sample
  const afterImg =
    product.afterImage ||
    product.images[0] ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=85"; // graded rich warm sample

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(clamped);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseDown = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const isFree = product.price === 0;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFree) {
      if (product.presetLinkUrl || product.downloadUrl) {
        window.open(product.presetLinkUrl || product.downloadUrl, "_blank");
      } else {
        setGuideModalOpen(true);
      }
    } else {
      setCheckoutOpen(true);
    }
  };

  return (
    <>
      <div className="group relative flex flex-col rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs hover:shadow-2xl transition-all">
        {/* Interactive Draggable Split-Screen Stage */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchMove={handleTouchMove}
          className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl bg-neutral-950 cursor-ew-resize shadow-lg"
        >
          {/* AFTER Image (Background Base) */}
          <img
            src={afterImg}
            alt={`${product.title} - Graded After`}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />

          {/* BEFORE Image (Clipped Foreground Layer) */}
          <div
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <img
              src={beforeImg}
              alt={`${product.title} - RAW Before`}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Badges: RAW Before vs Graded After */}
          <div className="pointer-events-none absolute top-3 left-3 z-20 rounded-md bg-black/75 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider border border-white/10">
            RAW Flat Before
          </div>
          <div className="pointer-events-none absolute top-3 right-3 z-20 rounded-md bg-amber-500/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider shadow-xs">
            Graded After (1-Tap)
          </div>

          {/* Central Draggable Divider Bar & Handle */}
          <div
            style={{ left: `${sliderPosition}%` }}
            className="pointer-events-none absolute top-0 bottom-0 z-30 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.8)]"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-900 shadow-2xl border-2 border-neutral-900 font-bold text-[10px]">
              ◀ ▶
            </div>
          </div>

          {/* Hint Overlay for first-time interaction */}
          <div className="pointer-events-none absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[10px] font-medium text-white/90">
            Drag slider left or right to compare
          </div>
        </div>

        {/* Preset Info & Metadata */}
        <div className="mt-4 flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                <Sliders className="h-3.5 w-3.5 text-amber-500" />
                12 .DNG Mobile + 12 .XMP Desktop
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                Skin-Tone Calibrated
              </span>
            </div>

            <h3 className="font-heading text-base font-bold text-neutral-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
              {product.title}
            </h3>

            <p className="mt-1 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Action Row */}
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                {isFree ? "Free Preset" : "Mobile & Desktop"}
              </span>
              <div className="text-base font-bold text-neutral-900 dark:text-white">
                {isFree ? "Free" : formatCurr(product.price)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setGuideModalOpen(true)}
                className="flex items-center gap-1 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <Smartphone className="h-3.5 w-3.5 text-amber-500" />
                <span>How to Use</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 text-xs font-bold shadow-md hover:scale-102 active:scale-98 transition-transform"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>{isFree ? "Download .DNG" : "Get Preset"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Guide: How to Apply Preset in Lightroom Mobile in 30 Seconds */}
      <AnimatePresence>
        {guideModalOpen && (
          <div
            onClick={() => setGuideModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                    <Smartphone className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      How to Apply Preset on Lightroom Mobile
                    </h3>
                    <span className="text-[11px] text-neutral-400">100% Free • No Adobe Subscription Needed</span>
                  </div>
                </div>
                <button
                  onClick={() => setGuideModalOpen(false)}
                  className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Steps */}
              <div className="mt-5 space-y-3.5 text-xs">
                <div className="flex items-start gap-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 p-3.5 border border-neutral-100 dark:border-neutral-800">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white font-bold text-[11px] shrink-0">
                    1
                  </span>
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white">Download the .DNG file</h4>
                    <p className="mt-0.5 text-neutral-500 text-[11px]">
                      Save the `.DNG` file directly to your iPhone Files or Android Downloads folder.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 p-3.5 border border-neutral-100 dark:border-neutral-800">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white font-bold text-[11px] shrink-0">
                    2
                  </span>
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white">Open in Adobe Lightroom Mobile</h4>
                    <p className="mt-0.5 text-neutral-500 text-[11px]">
                      Launch the free Lightroom app, tap &ldquo;Add Photos&rdquo;, and select the downloaded DNG image.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 p-3.5 border border-neutral-100 dark:border-neutral-800">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white font-bold text-[11px] shrink-0">
                    3
                  </span>
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white">Save Preset with 1 Tap</h4>
                    <p className="mt-0.5 text-neutral-500 text-[11px]">
                      Tap the three dots (•••) in the top-right corner, select &ldquo;Create Preset&rdquo;, name it, and apply to any photo with one touch!
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Bottom CTA */}
              <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-500">Includes both Mobile (.DNG) &amp; Desktop (.XMP)</span>
                <button
                  onClick={handleDownload}
                  className="rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-5 py-2.5 text-xs font-bold shadow-lg hover:scale-102 transition-transform"
                >
                  {isFree ? "Instant Download .DNG" : `Get Preset Pack (${formatCurr(product.price)})`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        product={product}
      />
    </>
  );
}
