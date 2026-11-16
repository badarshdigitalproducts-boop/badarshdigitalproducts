"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageCircle,
  Sparkles,
  QrCode,
  CreditCard,
  Plus,
} from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface CheckoutModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ product, isOpen, onClose }: CheckoutModalProps) {
  const { currency, formatPrice: formatCurr } = useCurrency();
  const [includeUpsell, setIncludeUpsell] = useState(false);
  const [activeTab, setActiveTab] = useState<"upi" | "card" | "whatsapp">("upi");
  const [copiedUpi, setCopiedUpi] = useState(false);

  const upsellPrice = currency === "INR" ? 199 : 5;
  const totalPrice = product.price + (includeUpsell ? 199 : 0);

  const upiId = "badarsh@upi"; // Official UPI ID

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleWhatsAppCheckout = () => {
    const orderItems = includeUpsell
      ? `${product.title} + 30-Day Content Planner Bundle`
      : product.title;
    const msg = encodeURIComponent(
      `Hi BADARSH! I'm ordering: ${orderItems} (${formatCurr(totalPrice)}).\nPlease share the direct download link and UPI QR code to complete payment.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.36, bounce: 0.15 }}
          className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-y-auto rounded-3xl border border-card-border/80 bg-card p-6 shadow-2xl backdrop-blur-2xl sm:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-card-border/60 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                Express Checkout
              </span>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Complete Your Order
              </h3>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer rounded-full p-2 text-muted transition-[transform,background-color] duration-150 hover:bg-muted/20 hover:text-foreground active:scale-90"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Item Summary */}
          <div className="mt-5 rounded-2xl border border-card-border bg-background/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-heading text-sm font-bold text-foreground">
                  {product.title}
                </h4>
                <p className="mt-0.5 text-xs text-muted">
                  {product.format} &bull; Commercial License &bull; Instant Access
                </p>
              </div>
              <span className="font-heading text-base font-bold text-foreground">
                {formatCurr(product.price)}
              </span>
            </div>

            {includeUpsell && (
              <div className="mt-3 flex items-start justify-between border-t border-card-border/60 pt-3 text-xs">
                <span className="text-foreground/90 font-medium">
                  + 30-Day Social Media Content Planner (Add-on)
                </span>
                <span className="font-bold text-accent">
                  {formatCurr(199)}
                </span>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-card-border/60 pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                Total Due:
              </span>
              <span className="font-heading text-2xl font-black text-foreground">
                {formatCurr(totalPrice)}
              </span>
            </div>
          </div>

          {/* 1-Click Upsell Offer Banner */}
          <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 transition-colors">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={includeUpsell}
                onChange={(e) => setIncludeUpsell(e.target.checked)}
                className="mt-1 h-4 w-4 rounded accent-accent"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>SPECIAL ONE-TIME UPSELL (Save 60%)</span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-foreground">
                  Add the 30-Day Viral Content Planner for just {formatCurr(199)}
                </p>
                <p className="text-[11px] text-muted">
                  Includes 90 viral hooks, caption frameworks &amp; scheduled posting tracker.
                </p>
              </div>
            </label>
          </div>

          {/* Payment Method Tabs with Apple-Grade Spring Pill */}
          <div className="relative mt-6 flex gap-2 border-b border-card-border/60 pb-3">
            {[
              { id: "upi", label: "UPI / QR (India)" },
              { id: "whatsapp", label: "WhatsApp 1-Click" },
              { id: "card", label: "Card / Global" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative z-10 flex-1 cursor-pointer rounded-xl py-2 text-xs font-bold transition-colors duration-150 active:scale-95 ${
                    isActive
                      ? "text-white"
                      : "border border-card-border/60 bg-background/50 text-muted hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="checkoutPaymentTab"
                      className={`absolute inset-0 -z-10 rounded-xl shadow-xs ${
                        tab.id === "whatsapp" ? "bg-emerald-600" : "bg-accent"
                      }`}
                      transition={{ type: "spring", duration: 0.32, bounce: 0.15 }}
                    />
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content with Blur Crossfade */}
          <div className="mt-5 flex-1">
            <AnimatePresence mode="wait">
              {activeTab === "upi" && (
                <motion.div
                  key="upi"
                  initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="space-y-4"
                >
                  <div className="rounded-2xl border border-card-border bg-background p-4 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <QrCode className="h-7 w-7" />
                    </div>
                    <h4 className="mt-2 font-heading text-sm font-bold text-foreground">
                      Scan &amp; Pay via Any UPI App
                    </h4>
                    <p className="text-xs text-muted">
                      Google Pay &bull; PhonePe &bull; Paytm &bull; BHIM &bull; CRED
                    </p>

                    <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-dashed border-accent/40 bg-accent/5 p-3">
                      <span className="font-mono text-xs font-bold text-foreground">
                        {upiId}
                      </span>
                      <button
                        onClick={handleCopyUpi}
                        className="cursor-pointer rounded-md bg-accent px-2.5 py-1 text-[11px] font-bold text-white transition-[transform,background-color] duration-150 hover:bg-accent-hover active:scale-95"
                      >
                        {copiedUpi ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleWhatsAppCheckout}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald-600 py-3.5 font-heading text-xs font-bold text-white shadow-md transition-[transform,background-color] duration-150 hover:bg-emerald-700 active:scale-[0.97]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Send Payment Proof &amp; Unlock Instant Link</span>
                  </button>
                </motion.div>
              )}

              {activeTab === "whatsapp" && (
                <motion.div
                  key="whatsapp"
                  initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="space-y-4 text-center"
                >
                  <p className="text-xs text-muted">
                    Order directly through our verified business WhatsApp. Receive instant download links and dedicated support.
                  </p>
                  <button
                    onClick={handleWhatsAppCheckout}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald-600 py-4 font-heading text-sm font-bold text-white shadow-lg transition-[transform,background-color] duration-150 hover:bg-emerald-700 active:scale-[0.97]"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Complete Order on WhatsApp &bull; {formatCurr(totalPrice)}</span>
                  </button>
                </motion.div>
              )}

              {activeTab === "card" && (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="space-y-4 text-center"
                >
                  <p className="text-xs text-muted">
                    International credit card, debit card, Apple Pay, and PayPal checkout via Gumroad.
                  </p>
                  <a
                    href={product.gumroadUrl || `https://badarsh.gumroad.com/l/${product.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent py-4 font-heading text-sm font-bold text-white shadow-lg transition-[transform,background-color] duration-150 hover:bg-accent-hover active:scale-[0.97]"
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Pay with Card / PayPal &bull; {formatCurr(totalPrice)}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Guarantee */}
          <div className="mt-6 flex items-center justify-center gap-2 border-t border-card-border/60 pt-4 text-xs text-muted">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>100% Satisfaction Guarantee &bull; Lifetime Updates</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

