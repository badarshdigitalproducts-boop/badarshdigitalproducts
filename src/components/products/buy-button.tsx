"use client";

import { useState } from "react";
import { ShoppingBag, MessageCircle, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { CheckoutModal } from "./checkout-modal";

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
    format: "Canva Template",
    gumroadUrl,
    createdAt: "2026-01-01",
  };

  const handleWhatsAppQuick = () => {
    const msg = encodeURIComponent(
      `Hi BADARSH! I want to purchase "${productTitle}" for ${formatCurr(price)}. Please share the direct download link and UPI payment details.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <>
      <div className={`space-y-3 ${className}`}>
        {/* Primary Checkout Button */}
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

        {/* WhatsApp UPI Quick Option */}
        <button
          onClick={handleWhatsAppQuick}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 py-3 font-heading text-sm font-semibold text-emerald-600 transition-all duration-200 hover:bg-emerald-500 hover:text-white"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Buy with UPI on WhatsApp</span>
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
