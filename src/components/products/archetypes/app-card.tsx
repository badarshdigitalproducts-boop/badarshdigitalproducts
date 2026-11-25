"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  ShieldCheck,
  Cpu,
  Smartphone,
  Star,
  CheckCircle2,
  Eye,
} from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { CheckoutModal } from "../checkout-modal";
import { AppStoreModal } from "@/components/apps/app-store-modal";
import { useProductAccess } from "@/hooks/use-product-access";
import { SmartImage } from "@/components/shared/smart-image";

interface AppCardProps {
  product: Product;
  priority?: boolean;
}

export function AppCard({ product }: AppCardProps) {
  const { formatPrice: formatCurr } = useCurrency();
  const { isUnlocked, handleDownload } = useProductAccess(product);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [appStoreOpen, setAppStoreOpen] = useState(false);

  const appVersion = product.appVersion || "v2.5 Studio Suite";
  const appSize = product.fileSize || "45 MB";
  const appPlatform = product.appPlatform || "Android & iOS";
  const isFree = product.price === 0;
  const rating = product.rating || 4.9;

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnlocked) {
      handleDownload(e);
      return;
    }
    setAppStoreOpen(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
        onClick={() => setAppStoreOpen(true)}
        className="group relative flex flex-col rounded-3xl border border-card-border bg-card p-5 sm:p-6 shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-[#01875f]/40 hover:shadow-xl hover:shadow-black/5 cursor-pointer"
      >
        {/* Top Header Row — App Squircle & Metadata (Play Store style) */}
        <div className="flex items-start gap-4">
          {/* App Squircle Icon (Google Play Store 22% curvature) */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[22%] border border-card-border bg-neutral-900 shadow-md transition-transform duration-300 group-hover:scale-105">
            <SmartImage
              src={product.images[0] || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"}
              alt={product.title}
              fill
              sizes="80px"
              className="object-cover"
            />
            <div className="absolute inset-0 rounded-[22%] ring-1 ring-inset ring-white/10" />
          </div>

          {/* Title, Category & Format */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#01875f]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#01875f] dark:text-[#25b885]">
                Creator App
              </span>
              <span className="text-[11px] font-mono text-muted">{appVersion}</span>
            </div>

            <h3 className="mt-1 font-heading text-base font-bold text-foreground line-clamp-1 group-hover:text-[#01875f] transition-colors">
              {product.title}
            </h3>

            <div className="mt-1 flex items-center gap-2 text-xs text-muted">
              <div className="flex items-center gap-1 font-semibold text-foreground/90">
                <span>{rating}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </div>
              <span>&bull;</span>
              <span>{appSize}</span>
              <span>&bull;</span>
              <span className="truncate">{appPlatform}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mt-3.5 line-clamp-2 text-xs text-muted leading-relaxed">
          {product.description}
        </p>

        {/* Google Play Protect Safe Badge */}
        <div className="mt-4 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Verified by Play Protect &bull; Clean &amp; Safe</span>
        </div>

        {/* Action Row */}
        <div className="mt-5 flex items-center justify-between border-t border-card-border/60 pt-4">
          <div>
            {isUnlocked ? (
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                Purchased
              </span>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-base font-bold text-[#01875f] dark:text-[#25b885]">
                  {isFree ? "Free Install" : formatCurr(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-muted line-through">
                    {formatCurr(product.originalPrice)}
                  </span>
                )}
              </div>
            )}
            <span className="text-[10px] text-muted block mt-0.5">
              {isUnlocked ? "Lifetime Re-download" : "Verified APK &amp; XML Configs"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setAppStoreOpen(true);
              }}
              className="flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-neutral-400" />
              <span>Details</span>
            </button>
            <button
              onClick={handleActionClick}
              className="flex items-center gap-1.5 rounded-full bg-[#01875f] hover:bg-[#017250] text-white px-4 py-2 text-xs font-bold shadow-xs hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isUnlocked ? "Download Files" : isFree ? "Install" : "Get App"}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Google Play Store Experience Modal */}
      <AppStoreModal
        isOpen={appStoreOpen}
        onClose={() => setAppStoreOpen(false)}
        product={product}
        onUnlock={(prod) => {
          setAppStoreOpen(false);
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
