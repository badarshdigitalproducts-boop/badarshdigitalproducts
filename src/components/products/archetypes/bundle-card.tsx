"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Layers, Sparkles, Star, Download, ExternalLink, HardDrive, Eye } from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { CheckoutModal } from "../checkout-modal";
import { DrivePreviewModal } from "@/components/bundles/drive-preview-modal";
import { useProductAccess } from "@/hooks/use-product-access";
import { SmartImage } from "@/components/shared/smart-image";

interface BundleCardProps {
  product: Product;
  priority?: boolean;
}

export function BundleCard({ product }: BundleCardProps) {
  const router = useRouter();
  const { formatPrice: formatCurr } = useCurrency();
  const { isUnlocked, handleDownload } = useProductAccess(product);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [drivePreviewOpen, setDrivePreviewOpen] = useState(false);

  const totalAssets = product.totalAssetsCount || product.specs?.count || "700+ Assets";
  const bundleSize = product.fileSize || "2.1 GB";

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnlocked) {
      handleDownload(e);
      return;
    }
    setCheckoutOpen(true);
  };

  return (
    <>
      <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
      onClick={() => router.push(`/templates/${product.slug}`)}
      className="group relative flex flex-col rounded-2xl border-2 border-accent/20 bg-card p-6 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-accent hover:shadow-xl hover:shadow-accent/5 cursor-pointer"
    >
      {/* Visual Bundle Stack Stage */}
      <div className="relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-xl bg-neutral-900 shadow-md">
        {/* Layer Stack illusion behind main visual */}
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-neutral-900 to-purple-900/30" />
        
        <SmartImage
          src={product.images[0] || "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80"}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-accent px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
          <Layers className="h-3 w-3" />
          <span>Complete Studio Vault</span>
        </div>

        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 z-10 rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
            Save {discountPercent}%
          </div>
        )}

        {/* Floating Asset Counter Pill */}
        <div className="absolute bottom-3 left-3 z-10 rounded-lg bg-black/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/10 flex items-center gap-2">
          <Package className="h-3.5 w-3.5 text-accent" />
          <span>{totalAssets}</span>
          <span className="text-white/40">&bull;</span>
          <span className="text-[11px] font-normal text-white/80">{bundleSize}</span>
        </div>
      </div>

      {/* Bundle Info */}
      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="font-semibold uppercase tracking-wider text-accent">
            All-In-One Mega Suite
          </span>
          <span className="text-[11px] font-medium text-muted">Commercial License</span>
        </div>

        <h3 className="mt-2 font-heading text-lg font-bold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
          {product.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-xs text-muted leading-relaxed">
          {product.description}
        </p>

        {/* Breakdown Chips */}
        <div className="mt-4 flex flex-wrap gap-1.5 text-[10px]">
          {(product.features && product.features.length > 0
            ? product.features.slice(0, 4)
            : ["500+ SFX (WAV)", "100 Transitions", "50 LUTs", "4K Green Screen"]
          ).map((feat, i) => (
            <span key={i} className="rounded-md bg-secondary px-2 py-1 font-medium text-foreground">
              {feat}
            </span>
          ))}
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto pt-5 flex items-center justify-between border-t border-card-border/60">
          <div>
            {isUnlocked ? (
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                Purchased
              </span>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-xl font-bold text-foreground">
                  {formatCurr(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-muted line-through">
                    {formatCurr(product.originalPrice)}
                  </span>
                )}
              </div>
            )}
            <span className="text-[10px] text-muted block mt-0.5">{isUnlocked ? "Lifetime Drive Access" : "Google Drive Direct Cloud Access"}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDrivePreviewOpen(true);
              }}
              className="flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <Eye className="h-3.5 w-3.5 text-blue-500" />
              <span>Browse Drive</span>
            </button>
            <button
              onClick={handleActionClick}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer ${
                isUnlocked
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-accent text-white hover:bg-accent-hover hover:scale-105"
              }`}
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isUnlocked ? "Download Master" : "Unlock"}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>

    {/* Live Google Drive Cloud Tree Preview Modal */}
    <DrivePreviewModal
      isOpen={drivePreviewOpen}
      onClose={() => setDrivePreviewOpen(false)}
      product={product}
      onUnlock={(prod) => {
        setDrivePreviewOpen(false);
        setCheckoutOpen(true);
      }}
    />

    {/* Instant Checkout Modal */}
    <CheckoutModal
      product={product}
      isOpen={checkoutOpen}
      onClose={() => setCheckoutOpen(false)}
    />
  </>
  );
}
