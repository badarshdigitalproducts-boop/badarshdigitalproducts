"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Sparkles,
  ExternalLink,
  Film,
  Music2,
  Layers,
  Star,
  CheckCircle2,
  Volume2,
  VolumeX,
  Lock,
} from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { CheckoutModal } from "@/components/products/checkout-modal";
import { useProductAccess } from "@/hooks/use-product-access";

interface VideoTemplateCardProps {
  product: Product;
}

export function VideoTemplateCard({ product }: VideoTemplateCardProps) {
  const { formatPrice: formatCurr } = useCurrency();
  const { isUnlocked, handleDownload } = useProductAccess(product);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoUrl =
    product.videoUrl ||
    product.previewVideoUrl ||
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4";

  const handleMouseEnter = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const isFree = product.price === 0;

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnlocked) {
      handleDownload(e);
      return;
    }
    if (isFree) {
      window.open(product.capcutUrl || "https://www.capcut.com/template", "_blank", "noopener,noreferrer");
    } else {
      setCheckoutOpen(true);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", duration: 0.35 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          if (videoRef.current) {
            if (isPlaying) {
              videoRef.current.pause();
              setIsPlaying(false);
            } else {
              videoRef.current.play().catch(() => {});
              setIsPlaying(true);
            }
          }
        }}
        className="group relative flex flex-col rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm hover:shadow-2xl transition-all cursor-pointer"
      >
        {/* 9:16 Vertical Video Frame */}
        <div className="relative aspect-[9/16] w-full max-h-[380px] overflow-hidden rounded-2xl bg-black shadow-lg">
          <video
            ref={videoRef}
            src={videoUrl}
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Video Status Overlay */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
            <span className="rounded-md bg-black/80 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider border border-white/10">
              9:16 BEAT-SYNC
            </span>
            {product.bpm && (
              <span className="rounded-md bg-indigo-500/90 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-bold text-white">
                {product.bpm} BPM
              </span>
            )}
          </div>

          {/* Pricing Pill */}
          <div className="absolute top-3 right-3 z-20">
            {isUnlocked ? (
              <span className="rounded-full bg-emerald-500/90 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-bold text-white shadow-xs flex items-center gap-1">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Purchased
              </span>
            ) : isFree ? (
              <span className="rounded-full bg-emerald-500/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
                FREE TEMPLATE
              </span>
            ) : (
              <span className="rounded-full bg-black/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/15">
                {formatCurr(product.price)}
              </span>
            )}
          </div>

          {/* Audio Unmute Toggle Button */}
          <button
            onClick={toggleAudio}
            className="absolute bottom-3 right-3 z-20 rounded-full bg-black/75 backdrop-blur-md p-2 text-white/90 hover:bg-black hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-amber-400" />}
          </button>

          {/* Center Play Icon when paused */}
          {!isPlaying && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-xl">
                <Play className="h-5 w-5 fill-current ml-0.5" />
              </div>
            </div>
          )}

          {/* Required Clips Indicator */}
          <div className="absolute bottom-3 left-3 z-20 rounded-lg bg-black/75 backdrop-blur-md px-2.5 py-1 text-[10px] font-medium text-white/90 border border-white/10">
            {product.requiredClipsCount ? `${product.requiredClipsCount} Clips Required` : "12-16 Clips Required"}
          </div>
        </div>

        {/* Video Template Metadata */}
        <div className="mt-4 flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              <span className="font-semibold flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                <Music2 className="h-3 w-3" />
                Trending Audio Included
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-bold text-neutral-900 dark:text-white">{product.rating}</span>
                <span>({product.reviewCount})</span>
              </div>
            </div>

            <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white line-clamp-1">
              {product.title}
            </h3>

            <p className="mt-1 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Action: Download if purchased, USE if free, Buy if paid */}
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-2">
            {isUnlocked ? (
              <button
                onClick={handleAction}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 text-xs font-bold shadow-md hover:scale-102 active:scale-98 transition-transform cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Download Master Files (Purchased)</span>
              </button>
            ) : isFree ? (
              <button
                onClick={handleAction}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 text-xs font-bold shadow-md hover:scale-102 active:scale-98 transition-transform cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>USE (Free Template)</span>
              </button>
            ) : (
              <button
                onClick={handleAction}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-2.5 text-xs font-bold shadow-md hover:scale-102 active:scale-98 transition-transform cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                <span>Buy Now ({formatCurr(product.price)})</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        product={product}
      />
    </>
  );
}
