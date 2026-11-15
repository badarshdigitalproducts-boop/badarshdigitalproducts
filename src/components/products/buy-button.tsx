"use client";

import { useState } from "react";
import { ShoppingBag, MessageCircle, ExternalLink, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface BuyButtonProps {
  price: number;
  currency?: string;
  productTitle: string;
  gumroadUrl?: string;
  className?: string;
}

export function BuyButton({
  price,
  currency = "INR",
  productTitle,
  gumroadUrl,
  className,
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    setLoading(true);
    if (gumroadUrl) {
      window.open(gumroadUrl, "_blank", "noopener,noreferrer");
    } else {
      const msg = encodeURIComponent(
        `Hi BADARSH! I want to purchase "${productTitle}" for ${formatPrice(price, currency)}. Please share the direct download link and UPI payment details.`
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    }
    setLoading(false);
  };

  const handleWhatsAppBuy = () => {
    const msg = encodeURIComponent(
      `Hi BADARSH! I want to purchase "${productTitle}" via WhatsApp UPI for ${formatPrice(price, currency)}.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Primary Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-4 font-heading text-base font-bold text-white shadow-lg shadow-accent/25 transition-all duration-300 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/35 active:scale-[0.98]"
      >
        <ShoppingBag className="h-5 w-5" />
        <span>
          Instant Download &bull; {formatPrice(price, currency)}
        </span>
        <ExternalLink className="h-4 w-4 opacity-75" />
      </button>

      {/* WhatsApp UPI Option */}
      <button
        onClick={handleWhatsAppBuy}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 py-3 font-heading text-sm font-semibold text-emerald-600 transition-all duration-200 hover:bg-emerald-500 hover:text-white"
      >
        <MessageCircle className="h-4 w-4" />
        <span>Buy with UPI on WhatsApp</span>
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-muted">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        <span>100% Secure Checkout &bull; Instant Access Link</span>
      </div>
    </div>
  );
}
