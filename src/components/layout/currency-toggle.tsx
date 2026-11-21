"use client";

import { motion } from "framer-motion";
import { useCurrency } from "@/context/currency-context";

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="relative flex items-center rounded-full border border-border bg-background p-0.5 text-[11px] font-medium text-foreground/60">
      {(["INR", "USD"] as const).map((curr) => {
        const isActive = currency === curr;
        return (
          <button
            key={curr}
            onClick={() => setCurrency(curr)}
            className={`relative z-10 cursor-pointer rounded-full px-2.5 py-0.5 transition-colors duration-150 ${
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
            {curr === "INR" ? "₹ INR" : "$ USD"}
          </button>
        );
      })}
    </div>
  );
}
