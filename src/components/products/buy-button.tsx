"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, MessageCircle, ExternalLink, ShieldCheck, Sparkles, Download, CheckCircle2 } from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { CheckoutModal } from "./checkout-modal";
import { triggerDirectDownload } from "@/lib/download";
import { useProductAccess } from "@/hooks/use-product-access";

interface BuyButtonProps {
  price: number;
  currency?: string;
  productTitle: string;
  gumroadUrl?: string;
  product?: Product;
  className?: string;
}

export function BuyButton({
  price,
  productTitle,
  gumroadUrl,
  product,
  className,
}: BuyButtonProps) {
  const { formatPrice: formatCurr } = useCurrency();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // If a full product object wasn't passed, create a minimal fallback
  const productData: Product = product || {
    id: "temp",
    slug: "temp",
    title: productTitle,
    description: "",
    longDescription: "",
    price,
    currency: "INR",
    category: "social-media",
    tags: [],
    images: [],
    features: [],
    rating: 5,
    reviewCount: 20,
    downloads: 500,
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    format: "Design Template",
    gumroadUrl,
    createdAt: "2026-01-01",
  };

  const isFree = price === 0;
  const { isUnlocked, handleDownload } = useProductAccess(productData);

  const handleFreeDownload = () => {
    const editorUrl =
      productData.canvaUrl && (productData.canvaUrl.includes("canva.com") || productData.canvaUrl.includes("capcut.com/template"))
        ? productData.canvaUrl
        : productData.templateUrl && (productData.templateUrl.includes("canva.com") || productData.templateUrl.includes("capcut.com/template"))
        ? productData.templateUrl
        : null;
    const directUrl =
      editorUrl ||
      `/api/download?productId=${encodeURIComponent(productData.id || productData.slug)}`;
    triggerDirectDownload(directUrl, `${productTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-master`);
  };

  const handleWhatsAppQuick = () => {
    const msg = encodeURIComponent(
      `Hi BADARSH! I want to get "${productTitle}" (${isFree ? "Free Edition" : formatCurr(price)}). Please share the direct download link and details.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <>
      <div className={`space-y-3 ${className}`}>
        {/* Primary Action Button */}
        {isUnlocked ? (
          <button
            onClick={handleDownload}
            className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-emerald-600 px-8 py-4 font-heading text-base font-bold text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/35 active:scale-[0.98]"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-200" />
            <span>Download Master Files (Purchased)</span>
          </button>
        ) : isFree ? (
          <button
            onClick={handleFreeDownload}
            className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-emerald-600 px-8 py-4 font-heading text-base font-bold text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/35 active:scale-[0.98]"
          >
            <Download className="h-5 w-5" />
            <span>Download Free (Instant Access)</span>
            <Sparkles className="h-4 w-4 opacity-75" />
          </button>
        ) : (
          <button
            onClick={() => setCheckoutOpen(true)}
            className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-4 font-heading text-base font-bold text-white shadow-lg shadow-accent/25 transition-all duration-300 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/35 active:scale-[0.98]"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>
              Instant Access &bull; {formatCurr(price)}
            </span>
            <Sparkles className="h-4 w-4 opacity-75" />
          </button>
        )}

        {/* WhatsApp UPI Quick Option */}
        <button
          onClick={handleWhatsAppQuick}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 py-3 font-heading text-sm font-semibold text-emerald-600 transition-all duration-200 hover:bg-emerald-500 hover:text-white"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{isFree ? "Get Direct Link on WhatsApp" : "Buy with UPI on WhatsApp"}</span>
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Instant Download &bull; Commercial License &bull; Free Updates</span>
        </div>
      </div>

      <CheckoutModal
        product={productData}
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}
