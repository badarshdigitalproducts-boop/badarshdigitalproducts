"use client";

import { Check, Sparkles, MessageCircle } from "lucide-react";
import type { ServicePackage } from "@/types";
import { formatPrice } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface PricingTableProps {
  packages: ServicePackage[];
  serviceTitle: string;
}

export function PricingTable({ packages, serviceTitle }: PricingTableProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {packages.map((pkg) => {
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          pkg.whatsappMessage ||
            `Hi BADARSH! I'm interested in the ${pkg.name} package for ${serviceTitle}. Can we discuss details?`
        )}`;

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
                    {formatPrice(pkg.price, pkg.currency)}
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

            <div className="mt-8 border-t border-card-border/60 pt-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-full py-3.5 font-heading text-xs font-bold transition-all duration-200 ${
                  pkg.isPopular
                    ? "bg-accent text-white shadow-md shadow-accent/20 hover:bg-accent-hover hover:shadow-lg"
                    : "border border-card-border bg-background text-foreground hover:border-accent hover:bg-accent hover:text-white"
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                <span>{pkg.ctaText || "Inquire via WhatsApp"}</span>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
