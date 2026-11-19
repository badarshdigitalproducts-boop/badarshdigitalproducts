"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, ShieldCheck, Cpu, Smartphone, Star, ArrowUpRight, Zap, Check } from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";

interface AppCardProps {
  product: Product;
  priority?: boolean;
}

export function AppCard({ product }: AppCardProps) {
  const router = useRouter();
  const { formatPrice: formatCurr } = useCurrency();

  const apkVersion = product.apkVersion || "v12.2 Pro Unlocked";
  const apkSize = product.fileSize || "185 MB";
  const apkArch = product.apkArchitecture || "Android 9.0+ / ARM64";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
      onClick={() => router.push(`/templates/${product.slug}`)}
      className="group relative flex flex-col rounded-2xl border border-card-border bg-card p-6 shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-foreground/20 hover:shadow-xl hover:shadow-black/5 cursor-pointer"
    >
      {/* Top Header Row — App Squircle & Metadata */}
      <div className="flex items-start gap-4">
        {/* App Squircle Icon (Apple App Store standard) */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[22%] border border-card-border bg-neutral-900 shadow-md transition-transform duration-300 group-hover:scale-105">
          <img
            src={product.images[0] || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"}
            alt={product.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 rounded-[22%] ring-1 ring-inset ring-white/10" />
        </div>

        {/* Title, Category & Ratings */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
              Pro APK
            </span>
            <span className="text-[11px] font-mono text-muted">{apkVersion}</span>
          </div>

          <h3 className="mt-1 font-heading text-base font-bold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
            {product.title}
          </h3>

          <div className="mt-1.5 flex items-center gap-2 text-xs text-muted">
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{product.rating}</span>
            </div>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {product.downloads.toLocaleString()}+ installs
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 line-clamp-2 text-xs text-muted leading-relaxed">
        {product.description}
      </p>

      {/* Technical Spec Dock (Microsoft Fluent Store style) */}
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-secondary/60 p-2.5 text-[11px]">
        <div className="flex items-center gap-1.5 text-muted">
          <Smartphone className="h-3.5 w-3.5 text-foreground/70" />
          <span className="truncate">{apkArch}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted">
          <Cpu className="h-3.5 w-3.5 text-foreground/70" />
          <span>Size: {apkSize}</span>
        </div>
      </div>

      {/* Verified Clean Badge */}
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>BADARSH Verified &bull; No Watermark &bull; 100% Virus-Free</span>
      </div>

      {/* Action Row */}
      <div className="mt-5 flex items-center justify-between border-t border-card-border/60 pt-4">
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
          <span className="text-[10px] text-muted">Direct APK Package</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/templates/${product.slug}`);
          }}
          className="flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-xs transition-opacity hover:opacity-90 active:scale-95"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Download APK</span>
        </button>
      </div>
    </motion.div>
  );
}
