"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "INR" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (inrAmount: number) => string;
  getRawPrice: (inrAmount: number) => { amount: number; symbol: string; code: string };
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Conversion helper with clean pricing psychology
function inrToUsd(inr: number): number {
  if (inr <= 299) return 5;
  if (inr <= 399) return 7;
  if (inr <= 499) return 9;
  if (inr <= 799) return 14;
  if (inr <= 999) return 19;
  if (inr <= 1499) return 25;
  if (inr <= 1999) return 29;
  if (inr <= 3999) return 49;
  if (inr <= 4999) return 69;
  if (inr <= 9999) return 129;
  if (inr <= 14999) return 199;
  return Math.round(inr / 75);
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("INR");

  useEffect(() => {
    const saved = localStorage.getItem("badarsh_currency") as Currency | null;
    if (saved === "INR" || saved === "USD") {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("badarsh_currency", c);
  };

  const formatPrice = (inrAmount: number): string => {
    if (currency === "INR") {
      return `₹${inrAmount.toLocaleString("en-IN")}`;
    }
    const usd = inrToUsd(inrAmount);
    return `$${usd}`;
  };

  const getRawPrice = (inrAmount: number) => {
    if (currency === "INR") {
      return { amount: inrAmount, symbol: "₹", code: "INR" };
    }
    return { amount: inrToUsd(inrAmount), symbol: "$", code: "USD" };
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, getRawPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Fallback for components rendered outside provider
    return {
      currency: "INR" as Currency,
      setCurrency: () => {},
      formatPrice: (amt: number) => `₹${amt.toLocaleString("en-IN")}`,
      getRawPrice: (amt: number) => ({ amount: amt, symbol: "₹", code: "INR" }),
    };
  }
  return context;
}

