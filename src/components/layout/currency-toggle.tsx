"use client";

import { useCurrency } from "@/context/currency-context";

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center rounded-full border border-card-border bg-card/60 p-0.5 text-[11px] font-bold text-muted shadow-sm">
      <button
        onClick={() => setCurrency("INR")}
        className={`cursor-pointer rounded-full px-2.5 py-1 transition-all ${
          currency === "INR"
            ? "bg-accent text-white shadow-xs"
            : "hover:text-foreground"
        }`}
        aria-label="Set currency to INR"
      >
        ₹ INR
      </button>
      <button
        onClick={() => setCurrency("USD")}
        className={`cursor-pointer rounded-full px-2.5 py-1 transition-all ${
          currency === "USD"
            ? "bg-accent text-white shadow-xs"
            : "hover:text-foreground"
        }`}
        aria-label="Set currency to USD"
      >
        $ USD
      </button>
    </div>
  );
}

