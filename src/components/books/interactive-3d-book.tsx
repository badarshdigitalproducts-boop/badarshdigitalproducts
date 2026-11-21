"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { BookOpen, Star, Eye, Sparkles, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";

interface Interactive3dBookProps {
  product: Product;
  onReadPreview: (product: Product) => void;
  onBuy: (product: Product) => void;
}

export function Interactive3dBook({ product, onReadPreview, onBuy }: Interactive3dBookProps) {
  const { formatPrice: formatCurr } = useCurrency();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Limit rotation angle between -15 and +15 degrees
    const rX = -(mouseY / (rect.height / 2)) * 12;
    const rY = (mouseX / (rect.width / 2)) * 15;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const isFree = product.price === 0;
  const pageCount = product.pageCount ? `${product.pageCount} Pages` : product.specs?.count || "240+ Pages";
  const coverImg = product.images[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className="group relative flex flex-col rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm hover:shadow-2xl transition-all duration-300"
    >
      {/* 3D Physical Book Stage */}
      <div className="relative py-4 flex items-center justify-center">
        <motion.div
          animate={{
            rotateX,
            rotateY,
            scale: rotateX !== 0 || rotateY !== 0 ? 1.04 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative aspect-[3/4.2] w-full max-w-[220px] rounded-r-xl rounded-l-xs overflow-hidden shadow-2xl shadow-black/40 cursor-pointer bg-neutral-950"
          onClick={() => onReadPreview(product)}
        >
          {/* Left Hardcover Spine Shadow & Embossed Crease */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-5 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="pointer-events-none absolute left-4 top-0 bottom-0 z-20 w-[1px] bg-white/25 shadow-sm" />
          <div className="pointer-events-none absolute left-5 top-0 bottom-0 z-20 w-[1px] bg-black/40" />

          {/* Right Paper Edge Texture Stack */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-1.5 bg-gradient-to-l from-amber-100/30 to-transparent" />

          {/* Book Cover Image */}
          <img
            src={coverImg}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500"
          />

          {/* Top Badge: Free Chapter 1 & 2 Preview */}
          <div className="absolute top-3 right-3 z-30 rounded-full bg-black/85 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-bold text-white border border-white/20 tracking-wider">
            FREE PREVIEW (CH 1 & 2)
          </div>

          {/* Interactive Hover "Open & Read" Overlay */}
          <div className="absolute inset-x-3 bottom-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReadPreview(product);
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-white py-2 text-xs font-bold text-neutral-900 shadow-xl hover:scale-102 active:scale-98 transition-transform border border-black/10"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Read Free Preview</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Book Metadata & Trust Attributes */}
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1.5">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
              {pageCount}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-neutral-900 dark:text-white">{product.rating}</span>
              <span>({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-heading text-base font-bold text-neutral-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-2 flex items-center gap-2 text-[10px] text-neutral-400">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="h-3 w-3" />
              Verified Master PDF
            </span>
            <span>•</span>
            <span>Highlightable</span>
            <span>•</span>
            <span>Kindle/iPad Ready</span>
          </div>
        </div>

        {/* Dual Actions: Read Free Preview vs Unlock Complete Book */}
        <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
              {isFree ? "Full Edition" : "Lifetime Access"}
            </span>
            <div className="text-base font-bold text-neutral-900 dark:text-white">
              {isFree ? "Free" : formatCurr(product.price)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onReadPreview(product)}
              className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              Look Inside
            </button>
            <button
              onClick={() => onBuy(product)}
              className="flex items-center gap-1 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 text-xs font-bold shadow-md hover:scale-102 active:scale-98 transition-transform"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>{isFree ? "Download" : "Unlock Book"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
