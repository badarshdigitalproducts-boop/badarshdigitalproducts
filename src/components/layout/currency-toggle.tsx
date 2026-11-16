"use client";

import { motion } from "framer-motion";
import { useCurrency } from "@/context/currency-context";

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="relative flex items-center rounded-full border border-card-border/80 bg-card/60 p-0.5 text-[11px] font-bold text-muted shadow-xs backdrop-blur-md">
      {(["INR", "USD"] as const).map((curr) => {
        const isActive = currency === curr;
        return (
          <motion.button
            key={curr}
            onClick={() => setCurrency(curr)}
            whileTap={{ scale: 0.94 }}
            className={`relative z-10 cursor-pointer rounded-full px-2.5 py-1 transition-colors duration-150 ${
              isActive ? "text-white" : "hover:text-foreground"
            }`}
            aria-label={`Set currency to ${curr}`}
          >
            {isActive && (
              <motion.div
                layoutId="activeCurrencyPill"
                className="absolute inset-0 -z-10 rounded-full bg-accent shadow-xs"
                transition={{ type: "spring", duration: 0.32, bounce: 0.15 }}
              />
            )}
            {curr === "INR" ? "₹ INR" : "$ USD"}
          </motion.button>
        );
      })}
    </div>
  );
}

