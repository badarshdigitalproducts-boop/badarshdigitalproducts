"use client";

import { motion } from "framer-motion";
import { useCurrency } from "@/context/currency-context";

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="relative inline-flex items-center rounded-full border border-border bg-background p-0.5 text-xs font-medium text-foreground/60 select-none">
      {(["INR", "USD"] as const).map((curr) => {
        const isActive = currency === curr;
        return (
          <button
            key={curr}
            type="button"
            onClick={() => setCurrency(curr)}
            className={`relative z-10 cursor-pointer rounded-full px-2 py-0.5 sm:px-2.5 sm:py-0.5 text-[11px] transition-colors duration-150 ${
              isActive ? "text-background font-semibold" : "hover:text-foreground"
            }`}
            aria-label={`Set currency to ${curr}`}
          >
            {isActive && (
              <motion.div
                layoutId="activeCurrencyPill"
                className="absolute inset-0 -z-10 rounded-full bg-foreground"
                transition={{ type: "spring", duration: 0.2, bounce: 0.05 }}
              />
            )}
            {/* Mobile: compact ₹ / $ icon pill */}
            <span className="sm:hidden font-bold">{curr === "INR" ? "₹" : "$"}</span>
            {/* Desktop / Tablet: full label */}
            <span className="hidden sm:inline font-semibold">{curr === "INR" ? "₹ INR" : "$ USD"}</span>
          </button>
        );
      })}
    </div>
  );
}
