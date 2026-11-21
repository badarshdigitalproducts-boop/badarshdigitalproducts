"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ExternalLink,
  Eye,
  Download,
  Star,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { CheckoutModal } from "@/components/products/checkout-modal";

interface CanvaTemplateCardProps {
  product: Product;
  priority?: boolean;
}

export function CanvaTemplateCard({ product }: CanvaTemplateCardProps) {
  const router = useRouter();
  const { formatPrice: formatCurr } = useCurrency();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [quickPreviewOpen, setQuickPreviewOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Generate multi-slide previews from product.images or synthesized slides
  const slides = useMemo(() => {
    if (product.slides && product.slides.length > 0) return product.slides;
    if (product.images && product.images.length > 1) return product.images;
    // Curated high-aesthetic presentation slides for Canva demo
    const baseImg = product.images[0] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80";
    return [
      baseImg,
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=70",
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=70",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=70",
    ];
  }, [product]);

  // Color palette simulation for the template
  const colorPalette = useMemo(() => {
    return [
      { name: "Primary", hex: "#0F172A" },
      { name: "Accent", hex: "#6366F1" },
      { name: "Warm Neutral", hex: "#F8FAFC" },
      { name: "Secondary", hex: "#94A3B8" },
    ];
  }, []);

  const aspectRatioClass = useMemo(() => {
    const ratio = product.aspectRatio || "16:9";
    if (ratio === "9:16") return "aspect-[9/16] max-h-[360px]";
    if (ratio === "1:1") return "aspect-square";
    if (ratio === "4:5") return "aspect-[4/5]";
    return "aspect-[16/10]"; // Default Canva deck / presentation
  }, [product.aspectRatio]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, x / rect.width));
    const nextIndex = Math.min(slides.length - 1, Math.floor(progress * slides.length));
    if (nextIndex !== activeSlideIndex) {
      setActiveSlideIndex(nextIndex);
    }
  };

  const handleMouseLeave = () => {
    setActiveSlideIndex(0);
  };

  const handleUseTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.price === 0) {
      if (product.canvaUrl) {
        window.open(product.canvaUrl, "_blank");
      } else if (product.downloadUrl) {
        window.open(product.downloadUrl, "_blank");
      } else {
        router.push(`/templates/${product.slug}`);
      }
    } else {
      setCheckoutOpen(true);
    }
  };

  const copyHex = (hex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const isFree = product.price === 0;

  return (
    <>
      <motion.div
        ref={cardRef}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", duration: 0.3 }}
        onClick={() => router.push(`/templates/${product.slug}`)}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs hover:shadow-xl transition-all cursor-pointer"
      >
        {/* Top Media Frame with Canva-Style Slide Scrubber */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`relative w-full ${aspectRatioClass} overflow-hidden bg-neutral-100 dark:bg-neutral-950`}
        >
          {/* Active Slide Image */}
          <img
            src={slides[activeSlideIndex]}
            alt={`${product.title} - Slide ${activeSlideIndex + 1}`}
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
          />

          {/* Canva Badge & Format Pill */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            <span className="rounded-md bg-black/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/10 uppercase tracking-wide">
              {(product as any).platform ? (product as any).platform.toUpperCase() : "CANVA"}
            </span>
            {product.aspectRatio && (
              <span className="rounded-md bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-semibold text-neutral-800 dark:text-neutral-200">
                {product.aspectRatio}
              </span>
            )}
          </div>

          {/* Pricing Pill */}
          <div className="absolute top-3 right-3 z-10">
            {isFree ? (
              <span className="rounded-full bg-emerald-500/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                FREE TEMPLATE
              </span>
            ) : (
              <span className="rounded-full bg-black/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/15">
                {formatCurr(product.price)}
              </span>
            )}
          </div>

          {/* Hover Slide Scrubber Dots */}
          <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  activeSlideIndex === idx
                    ? "w-5 bg-white shadow-md"
                    : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Hover Action Floating Bar (Canva Style) */}
          <div className="absolute inset-x-3 bottom-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuickPreviewOpen(true);
              }}
              className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-white/95 dark:bg-neutral-800/95 backdrop-blur-md py-2 text-xs font-bold text-neutral-900 dark:text-white shadow-lg hover:scale-102 active:scale-98 transition-transform border border-black/5 dark:border-white/10"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview ({slides.length} Slides)</span>
            </button>
            <button
              onClick={handleUseTemplate}
              className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-neutral-900 dark:bg-white py-2 text-xs font-bold text-white dark:text-neutral-900 shadow-lg hover:scale-102 active:scale-98 transition-transform"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>{isFree ? "Use in Canva" : "Get Template"}</span>
            </button>
          </div>
        </div>

        {/* Card Body & Metadata */}
        <div className="p-4 flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              <span className="font-medium flex items-center gap-1">
                <Layers className="h-3 w-3 text-neutral-400" />
                {product.specs?.count || `${slides.length} Customizable Slides`}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-neutral-900 dark:text-white">{product.rating}</span>
                <span>({product.reviewCount})</span>
              </div>
            </div>

            <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {product.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quick Color Palette Preview Swatches */}
          <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-neutral-400 mr-1">Palette:</span>
              {colorPalette.map((col, idx) => (
                <button
                  key={idx}
                  title={`Copy ${col.name} (${col.hex})`}
                  onClick={(e) => copyHex(col.hex, e)}
                  style={{ backgroundColor: col.hex }}
                  className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-2xs hover:scale-125 transition-transform relative"
                />
              ))}
              {copiedColor && (
                <span className="text-[9px] text-emerald-500 font-semibold ml-1 animate-pulse">
                  Copied!
                </span>
              )}
            </div>

            <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
              {product.specs?.dimensions || "1080 × 1920"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Canva-Style Full Screen Quick Preview Modal */}
      <AnimatePresence>
        {quickPreviewOpen && (
          <div
            onClick={() => setQuickPreviewOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      CANVA & FIGMA COMPATIBLE
                    </span>
                    <span className="text-xs text-neutral-500">
                      {product.specs?.dimensions || "1080 × 1920 HD"}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
                    {product.title}
                  </h2>
                </div>
                <button
                  onClick={() => setQuickPreviewOpen(false)}
                  className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Slide By Slide Horizontal Filmstrip */}
              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  All Included Slides & Layouts ({slides.length} Slides)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {slides.map((slideUrl, idx) => (
                    <div
                      key={idx}
                      className="group/slide relative rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 shadow-xs"
                    >
                      <img
                        src={slideUrl}
                        alt={`Slide ${idx + 1}`}
                        className="w-full aspect-[9/16] object-cover"
                      />
                      <div className="absolute top-2 left-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Specs & Color System */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/50 p-4 border border-neutral-100 dark:border-neutral-800">
                <div>
                  <h5 className="text-xs font-bold text-neutral-900 dark:text-white">
                    Design System & Font Hierarchy
                  </h5>
                  <p className="text-xs text-neutral-500 mt-1">
                    Typography: Syne Bold (Display) + Inter Medium (Body). 100% free Google Fonts included.
                  </p>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-neutral-900 dark:text-white mb-1.5">
                    Curated Color Palette
                  </h5>
                  <div className="flex gap-2">
                    {colorPalette.map((col, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => copyHex(col.hex, e)}
                        className="flex items-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2 py-1 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 hover:border-indigo-500"
                      >
                        <span
                          style={{ backgroundColor: col.hex }}
                          className="h-2.5 w-2.5 rounded-full"
                        />
                        <span>{col.hex}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Action Bar */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <div>
                  <span className="text-xs text-neutral-500">Commercial License Included</span>
                  <div className="text-lg font-bold text-neutral-900 dark:text-white">
                    {isFree ? "Free Download" : formatCurr(product.price)}
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => router.push(`/templates/${product.slug}`)}
                    className="flex-1 sm:flex-none rounded-xl border border-neutral-200 dark:border-neutral-700 px-5 py-2.5 text-xs font-bold text-neutral-800 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    View Product Page
                  </button>
                  <button
                    onClick={handleUseTemplate}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-2.5 text-xs font-bold shadow-lg hover:scale-102 transition-transform"
                  >
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>{isFree ? "Open Template in Canva" : "Get Complete Template"}</span>
                  </button>
                </div>
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
