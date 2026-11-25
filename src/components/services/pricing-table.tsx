"use client";

import { useState } from "react";
import { Check, Sparkles, MessageCircle, CreditCard, Lock } from "lucide-react";
import type { ServicePackage } from "@/types";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { getWhatsAppUrl } from "@/lib/utils";
import { CheckoutModal } from "@/components/products/checkout-modal";

interface PricingTableProps {
  packages: ServicePackage[];
  serviceTitle: string;
}

export function PricingTable({ packages, serviceTitle }: PricingTableProps) {
  const { formatPrice: formatCurr } = useCurrency();
  const [selectedServiceProduct, setSelectedServiceProduct] = useState<Product | null>(null);

  const handleInquireClick = (pkg: ServicePackage) => {
    try {
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Prospective Client",
          email: "inquiry@client.com",
          interest: `${serviceTitle} - ${pkg.name}`,
          message:
            pkg.whatsappMessage ||
            `Client initiated WhatsApp inquiry for ${serviceTitle} (${pkg.name} Package - ₹${pkg.price})`,
          budget: `₹${pkg.price}`,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Non-blocking
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {packages.map((pkg) => {
        const whatsappUrl = getWhatsAppUrl(
          pkg.whatsappMessage ||
            `Hi BADARSH! I'm interested in the ${pkg.name} package for ${serviceTitle}. Can we discuss details?`,
          `${serviceTitle} - ${pkg.name}`
        );

        return (
          <div
            key={pkg.name}
            className={`relative flex flex-col justify-between rounded-3xl border p-8 transition-all duration-300 ${
              pkg.isPopular
                ? "border-accent bg-card shadow-xl shadow-accent/10 ring-2 ring-accent"
                : "border-card-border bg-card/60 shadow-sm hover:border-accent/40 hover:shadow-lg"
            }`}
          >
            {pkg.isPopular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="flex items-center gap-1 rounded-full bg-accent px-4 py-1 text-xs font-bold text-white shadow-md">
                  <Sparkles className="h-3 w-3" /> Most Popular
                </span>
              </div>
            )}

            <div>
              <h3 className="font-heading text-xl font-bold text-foreground">
                {pkg.name}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {pkg.description}
              </p>

              <div className="mt-6 border-t border-card-border/60 pt-6">
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-3xl font-extrabold text-foreground">
                    {formatCurr(pkg.price)}
                  </span>
                  {pkg.period && (
                    <span className="text-xs text-muted">
                      / {pkg.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Feature checklist */}
              <ul className="mt-6 space-y-3">
                {pkg.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-foreground/90">
                    <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-card-border/60 pt-6 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedServiceProduct({
                    id: `svc-${serviceTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${pkg.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
                    slug: `service-${serviceTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
                    title: `${serviceTitle} — ${pkg.name}`,
                    description: pkg.description,
                    longDescription: pkg.description,
                    price: pkg.price,
                    currency: (pkg.currency as any) || "INR",
                    category: "social-media",
                    tags: ["service", serviceTitle.toLowerCase()],
                    images: ["https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80"],
                    features: pkg.features,
                    rating: 5,
                    reviewCount: 28,
                    downloads: 140,
                    isFeatured: true,
                    isNew: false,
                    isBestseller: pkg.isPopular || false,
                    format: "Custom Agency Service",
                    createdAt: "2026-01-01",
                  });
                }}
                className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-full py-3.5 font-heading text-xs font-bold transition-all duration-200 ${
                  pkg.isPopular
                    ? "bg-accent text-white shadow-md shadow-accent/20 hover:bg-accent-hover hover:shadow-lg"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Book &amp; Pay Online</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleInquireClick(pkg)}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-card-border bg-background py-3 font-heading text-xs font-semibold text-foreground hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200"
              >
                <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>{pkg.ctaText || "Inquire via WhatsApp"}</span>
              </a>
            </div>
          </div>
        );
      })}

      {selectedServiceProduct && (
        <CheckoutModal
          product={selectedServiceProduct}
          isOpen={true}
          onClose={() => setSelectedServiceProduct(null)}
        />
      )}
    </div>
  );
}
