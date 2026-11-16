"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";

interface TemplatePreviewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onBuyClick?: () => void;
}

// Generate realistic simulated slides based on template theme
function getSampleSlides(product: Product) {
  return [
    {
      title: "Hero & Cover Hook",
      badge: "SLIDE 01",
      headline: product.title,
      sub: "Optimized 1080x1920 / 16:9 layout designed for 3-second retention.",
      color: "from-accent/30 via-purple-900/40 to-background",
    },
    {
      title: "Core Framework & Problem",
      badge: "SLIDE 02",
      headline: "The #1 Mistake 90% of Businesses Make",
      sub: "Structured typography hierarchy that keeps readers engaged until the end.",
      color: "from-blue-600/30 via-indigo-900/40 to-background",
    },
    {
      title: "Actionable Steps & Diagram",
      badge: "SLIDE 03",
      headline: "Step-by-Step Execution Guide",
      sub: "Plug-and-play visual cards, icon placeholders, and list callouts.",
      color: "from-amber-600/30 via-orange-900/40 to-background",
    },
    {
      title: "Offer & Conversion Close",
      badge: "SLIDE 04",
      headline: "Transform Your Business Results Today",
      sub: "High-converting Call to Action template with social proof anchors.",
      color: "from-emerald-600/30 via-teal-900/40 to-background",
    },
  ];
}

export function TemplatePreviewModal({
  product,
  isOpen,
  onClose,
  onBuyClick,
}: TemplatePreviewModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { formatPrice: formatCurr } = useCurrency();
  const slides = getSampleSlides(product);

  const prev = () => setCurrentSlide((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrentSlide((c) => (c === slides.length - 1 ? 0 : c + 1));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.36, bounce: 0.15 }}
          className="relative z-10 flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-card-border/80 bg-card shadow-2xl backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-card-border/60 px-6 py-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                Interactive Design Preview
              </span>
              <h3 className="font-heading text-lg font-bold text-foreground">
                {product.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer rounded-full p-2 text-muted transition-[transform,background-color] duration-150 hover:bg-muted/20 hover:text-foreground active:scale-90"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main Slide Stage */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-background/50 p-6 sm:p-10">
            {/* Animated Slide Card Display with Emil blur crossfade */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                className={`relative flex aspect-[16/10] w-full max-w-2xl flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br ${slides[currentSlide].color} p-8 shadow-2xl backdrop-blur-xl`}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent backdrop-blur-md">
                    {slides[currentSlide].badge}
                  </span>
                  <span className="text-xs font-semibold text-muted">
                    Slide {currentSlide + 1} of {slides.length}
                  </span>
                </div>

                <div className="my-auto py-4">
                  <h2 className="font-heading text-2xl font-black text-foreground sm:text-3xl">
                    {slides[currentSlide].headline}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                    {slides[currentSlide].sub}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-muted">
                  <span>{product.format} &bull; Canva Free &amp; Pro</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 100% Fully Editable
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Left/Right arrow controls */}
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full border border-card-border bg-card/85 p-3 text-foreground shadow-lg backdrop-blur-md transition-[transform,background-color] duration-150 hover:bg-card hover:scale-105 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full border border-card-border bg-card/85 p-3 text-foreground shadow-lg backdrop-blur-md transition-[transform,background-color] duration-150 hover:bg-card hover:scale-105 active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Footer Controls & CTA */}
          <div className="flex flex-col gap-4 border-t border-card-border/60 bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Thumbnails */}
            <div className="flex gap-2">
              {slides.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-10 w-16 cursor-pointer rounded-lg border text-[10px] font-bold transition-[transform,border-color,background-color] duration-150 active:scale-95 ${
                    currentSlide === idx
                      ? "border-accent bg-accent/20 text-accent scale-105 shadow-xs"
                      : "border-card-border bg-background text-muted opacity-60 hover:opacity-100"
                  }`}
                >
                  Slide {idx + 1}
                </button>
              ))}
            </div>

            {/* Buy CTA inside modal */}
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[11px] text-muted">Instant Access:</span>
                <p className="font-heading text-lg font-bold text-foreground">
                  {formatCurr(product.price)}
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  if (onBuyClick) onBuyClick();
                }}
                className="flex cursor-pointer items-center gap-2 rounded-full bg-accent px-6 py-2.5 font-heading text-xs font-bold text-white shadow-md transition-[transform,background-color] duration-150 hover:bg-accent-hover active:scale-[0.96]"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Buy This Pack</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

