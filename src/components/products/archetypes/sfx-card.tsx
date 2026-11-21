"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, Video, Star, Download, ExternalLink, Sparkles, Disc3 } from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { useAudioPlayer } from "@/context/audio-player-context";

interface SfxCardProps {
  product: Product;
  priority?: boolean;
}

export function SfxCard({ product }: SfxCardProps) {
  const router = useRouter();
  const { formatPrice: formatCurr } = useCurrency();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudioPlayer();

  const isThisPlaying = currentTrack?.id === product.id && isPlaying;

  const audioSrc =
    product.audioPreviewUrl ||
    "https://actions.google.com/sounds/v1/science_fiction/whoosh_cinematic.ogg";

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTrack({
      id: product.id,
      title: product.title,
      category: product.audioCategory || "Sound Effects",
      audioUrl: audioSrc,
      duration: product.audioDuration || "0:45",
      price: product.price,
      isFree: product.price === 0,
      slug: product.slug,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
      onClick={() => router.push(`/templates/${product.slug}`)}
      className="group relative flex flex-col rounded-2xl border border-card-border bg-card p-5 shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-foreground/20 hover:shadow-xl hover:shadow-black/5 cursor-pointer"
    >
      {/* Video & Motion Visual Stage (16:9 Studio Ratio) */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-neutral-950">
        <img
          src={product.images[0] || "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80"}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
        />

        {/* Ambient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Format Pill */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-black/90 px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/15">
          <Disc3 className={`h-3 w-3 ${isThisPlaying ? "animate-spin text-accent" : "text-accent"}`} />
          <span>24-Bit WAV &bull; {product.audioCategory || "SFX"}</span>
        </div>

        {/* Interactive Audio Waveform Scrub Bar on bottom of card */}
        <div className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between rounded-lg bg-black/95 px-3 py-2 border border-white/15">
          <button
            onClick={handlePlayToggle}
            aria-label="Preview sound effect"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-transform hover:scale-105 active:scale-95 shadow-md"
          >
            {isThisPlaying ? (
              <Pause className="h-4 w-4 fill-white" />
            ) : (
              <Play className="h-4 w-4 fill-white ml-0.5" />
            )}
          </button>

          {/* Animated Waveform Bars */}
          <div className="flex items-center gap-1 px-3 flex-1 justify-center">
            {[40, 75, 55, 90, 60, 30, 85, 45, 95, 70, 50, 80, 65, 35, 90, 55].map((height, i) => (
              <span
                key={i}
                className={`w-0.5 rounded-full transition-all duration-150 ${
                  isThisPlaying ? "bg-accent animate-pulse" : "bg-white/40"
                }`}
                style={{
                  height: isThisPlaying ? `${Math.max(8, (height * (i % 2 === 0 ? 0.9 : 1.2)) % 22)}px` : `${height * 0.2}px`,
                }}
              />
            ))}
          </div>

          <span className="text-[10px] font-mono font-medium text-white/80">
            {isThisPlaying ? "Playing..." : product.audioDuration || "Preview"}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="font-semibold text-accent">
            {product.audioCategory || "SFX & Music"}
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

        {/* Spec Row */}
        <div className="mt-3 flex items-center gap-2 text-[10px] text-muted">
          <span className="rounded bg-secondary px-2 py-0.5 font-medium text-foreground">
            Master WAV
          </span>
          <span className="rounded bg-secondary px-2 py-0.5 font-medium text-foreground">
            Royalty-Free Commercial
          </span>
        </div>

        {/* Action Row */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-card-border/60">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-lg font-bold text-foreground">
                {product.price === 0 ? "Free" : formatCurr(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-muted line-through">
                  {formatCurr(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-muted">Instant Cloud Vault</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/templates/${product.slug}`);
            }}
            className="flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-xs transition-opacity hover:opacity-90 active:scale-95"
          >
            <span>{product.price === 0 ? "Get Free" : "Get Asset"}</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
