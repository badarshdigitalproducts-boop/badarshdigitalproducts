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
  Tag,
  Key,
  Download,
  ArrowRight,
  Lock,
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

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [includeUpsell, setIncludeUpsell] = useState(false);

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    discountAmount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Tabs & Submission State
  const [activeTab, setActiveTab] = useState<"online" | "qr" | "whatsapp">("online");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);
  const [copiedLicense, setCopiedLicense] = useState(false);

  const basePrice = product.price;
  const upsellPrice = includeUpsell ? (currency === "INR" ? 199 : 5) : 0;
  const subtotal = basePrice + upsellPrice;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(subtotal - discountAmount, 0);

  const upiId = "badarsh@upi"; // Official UPI ID

  const loadCashfreeSdk = () => {
    return new Promise<any>((resolve) => {
      if ((window as any).Cashfree) {
        resolve((window as any).Cashfree);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      script.onload = () => resolve((window as any).Cashfree);
      script.onerror = () => resolve(null);
      document.body.appendChild(script);
    });
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleCopyLicense = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedLicense(true);
    setTimeout(() => setCopiedLicense(false), 2500);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, amount: subtotal }),
      });
      const data = await res.json();

      if (data.valid) {
        setAppliedCoupon({
          code: data.code,
          discountType: data.discountType,
          discountValue: data.discountValue,
          discountAmount: data.discountAmount,
        });
      } else {
        setCouponError(data.message || "Invalid coupon code");
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError("Failed to validate coupon");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleCompleteOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customerName.trim()) {
      alert("Please enter your name");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          productId: product.id,
          productTitle: product.title,
          productPrice: product.price,
          productType: product.format,
          canvaUrl: product.canvaUrl || "",
          downloadUrl: product.downloadUrl || product.pdfUrl || product.appDownloadUrl || product.googleDriveUrl || "",
          includeUpsell,
          couponCode: appliedCoupon?.code,
          paymentMethod: activeTab === "online" ? "Cashfree" : activeTab === "qr" ? "UPI QR" : "WhatsApp",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.paymentRequired && data.paymentSessionId) {
          try {
            const Cashfree = await loadCashfreeSdk();
            if (Cashfree) {
              const cf = Cashfree({
                mode: data.cfEnv === "TEST" ? "sandbox" : "production",
              });
              cf.checkout({
                paymentSessionId: data.paymentSessionId,
                redirectTarget: "_self",
              });
              return;
            }
          } catch (cfErr) {
            console.warn("Cashfree SDK checkout fallback:", cfErr);
          }

          const cfUrl =
            data.cfEnv === "TEST"
              ? `https://sandbox.cashfree.com/order/#${data.paymentSessionId}`
              : `https://payments.cashfree.com/order/#${data.paymentSessionId}`;
          window.location.href = cfUrl;
          return;
        }

        setOrderConfirmed(data.order);
      } else {
        alert(data.error || "Failed to process order");
      }
    } catch {
      alert("Error connecting to checkout service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppCheckout = () => {
    const orderItems = includeUpsell
      ? `${product.title} + 30-Day Content Planner Bundle`
      : product.title;
    const msg = encodeURIComponent(
      `Hi BADARSH! I'm ordering: ${orderItems} (${formatCurr(finalTotal)}).\nPlease share the direct download link and UPI QR code to complete payment.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  const handleWhatsAppDelivery = (order: any) => {
    const rawPhone = order.customerPhone || "";
    const cleanPhone = rawPhone.replace(/\D/g, "");
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone || WHATSAPP_NUMBER;
    const msg = encodeURIComponent(
      `Hi ${order.customerName}! 🚀 Here is your order confirmation:\n\n📦 Order ID: ${order.id}\n📁 Product: ${product.title}\n🔑 Verified License Key: ${order.licenseKey}\n\nOur team is ready to assist you!`
    );
    window.open(`https://wa.me/${targetPhone}?text=${msg}`, "_blank");
  };

  const handleModalClose = () => {
    setOrderConfirmed(null);
    setAppliedCoupon(null);
    setCouponCode("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleModalClose}
          className="fixed inset-0 bg-black/80"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.36, bounce: 0.15 }}
          className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-y-auto rounded-3xl border border-card-border/80 bg-card p-6 shadow-2xl sm:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-card-border/60 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                {orderConfirmed ? "Order Confirmed" : "Express Checkout"}
              </span>
              <h3 className="font-heading text-lg font-bold text-foreground">
                {orderConfirmed ? "Access Your Digital Assets" : "Complete Your Order"}
              </h3>
            </div>
            <button
              onClick={handleModalClose}
              className="cursor-pointer rounded-full p-2 text-muted transition-[transform,background-color] duration-150 hover:bg-muted/20 hover:text-foreground active:scale-90"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* SCREEN 2: ORDER CONFIRMATION & INSTANT FULFILLMENT */}
          {orderConfirmed ? (
            <div className="mt-6 space-y-6 animate-fadeIn">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="mt-3 font-heading text-lg font-bold text-foreground">
                  Payment Verified &amp; Unlocked!
                </h4>
                <p className="mt-1 text-xs text-muted">
                  Thank you, <strong className="text-foreground">{orderConfirmed.customerName}</strong>! Your order has been recorded into our cloud database.
                </p>
                <span className="mt-2 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-400">
                  {orderConfirmed.id}
                </span>
              </div>

              {/* License Key Box */}
              <div className="rounded-2xl border border-card-border bg-background p-4">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-foreground">
                    <Key className="h-3.5 w-3.5 text-accent" />
                    <span>Your Commercial License Key</span>
                  </span>
                  <span className="text-[11px] text-emerald-500 font-semibold">Active &bull; Lifetime</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-dashed border-accent/40 bg-accent/5 p-3">
                  <span className="font-mono text-sm font-bold text-foreground tracking-wider">
                    {orderConfirmed.licenseKey}
                  </span>
                  <button
                    onClick={() => handleCopyLicense(orderConfirmed.licenseKey)}
                    className="cursor-pointer rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-accent-hover transition-colors"
                  >
                    {copiedLicense ? "Copied!" : "Copy Key"}
                  </button>
                </div>
              </div>

              {/* Smart Context-Aware Delivery Buttons */}
              <div className="space-y-3">
                {/* 1. Direct App Download (for Editing Apps) */}
                {(product.appDownloadUrl || (product as any).appApkUrl || product.category === "editing-apps") && (
                  <a
                    href={product.appDownloadUrl || (product as any).appApkUrl || orderConfirmed.downloadUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald-600 py-3.5 font-heading text-xs font-bold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-95"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download App Directly ({product.fileSize || "Mobile App"})</span>
                  </a>
                )}

                {/* 2. Direct Lightroom Preset Link */}
                {(product.presetLinkUrl || product.category === "photo-presets") && (
                  <a
                    href={product.presetLinkUrl || orderConfirmed.downloadUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent py-3.5 font-heading text-xs font-bold text-white shadow-lg transition-all hover:bg-accent-hover active:scale-95"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Open in Adobe Lightroom (Import Preset)</span>
                  </a>
                )}

                {/* 3. Direct CapCut / Premiere Overlay Link */}
                {(product.overlayLinkUrl || product.category === "editing-bundles") && (
                  <a
                    href={product.overlayLinkUrl || orderConfirmed.downloadUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent py-3.5 font-heading text-xs font-bold text-white shadow-lg transition-all hover:bg-accent-hover active:scale-95"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Launch Template in CapCut / Premiere</span>
                  </a>
                )}

                {/* 4. Google Drive Mega Bundle Access */}
                {(product.googleDriveUrl || product.category === "bundles") && (
                  <a
                    href={product.googleDriveUrl || orderConfirmed.downloadUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent py-3.5 font-heading text-xs font-bold text-white shadow-lg transition-all hover:bg-accent-hover active:scale-95"
                  >
                    <Download className="h-4 w-4" />
                    <span>Access Google Drive Mega Bundle (ZIP &amp; 4K Assets)</span>
                  </a>
                )}

                {/* 5. PDF E-Book / Planner Direct Download */}
                {(product.category === "ebooks" || product.category === "planners") && (
                  <a
                    href={product.downloadUrl || orderConfirmed.downloadUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent py-3.5 font-heading text-xs font-bold text-white shadow-lg transition-all hover:bg-accent-hover active:scale-95"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Master PDF ({product.fileSize || "Full Version"})</span>
                  </a>
                )}

                {/* 6. Generic File Download Fallback */}
                {orderConfirmed.downloadUrl &&
                  product.category !== "editing-apps" &&
                  product.category !== "photo-presets" &&
                  product.category !== "editing-bundles" &&
                  product.category !== "bundles" &&
                  product.category !== "ebooks" &&
                  product.category !== "planners" && (
                    <a
                      href={orderConfirmed.downloadUrl}
                      download
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent py-3.5 font-heading text-xs font-bold text-white shadow-lg transition-all hover:bg-accent-hover active:scale-95"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Product Files (ZIP / Assets)</span>
                    </a>
                  )}

                {/* 7. Template Link if applicable */}
                {orderConfirmed.canvaUrl && !orderConfirmed.canvaUrl.includes("gumroad") && (
                  <a
                    href={orderConfirmed.canvaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-card-border bg-card py-3 font-heading text-xs font-bold text-foreground shadow-sm transition-all hover:border-accent hover:text-accent active:scale-95"
                  >
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span>Open Ready-to-Edit Project</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

                {/* 8. WhatsApp Confirmation & Personal Concierge Delivery */}
                <button
                  onClick={() => handleWhatsAppDelivery(orderConfirmed)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 py-3.5 font-heading text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 active:scale-95 transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Receive Instant Copy on WhatsApp</span>
                </button>
              </div>
            </div>
          ) : (
            /* SCREEN 1: CHECKOUT FORM & PAYMENT */
            <div className="mt-5 space-y-5">
              {/* Item Summary */}
              <div className="rounded-2xl border border-card-border bg-background/60 p-4">
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
                      + 30-Day Viral Content Planner Bundle
                    </span>
                    <span className="font-bold text-accent">
                      {formatCurr(199)}
                    </span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="mt-3 flex items-start justify-between border-t border-card-border/60 pt-3 text-xs text-emerald-500 font-semibold">
                    <span>
                      Coupon ({appliedCoupon.code})
                    </span>
                    <span>-{formatCurr(appliedCoupon.discountAmount)}</span>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-card-border/60 pt-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">
                    Total Due:
                  </span>
                  <div className="text-right">
                    {appliedCoupon && (
                      <span className="mr-2 text-xs line-through text-muted">
                        {formatCurr(subtotal)}
                      </span>
                    )}
                    <span className="font-heading text-2xl font-black text-foreground">
                      {formatCurr(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Contact Details Form */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Customer Information:
                </span>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp Phone Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address (for instant receipt & backup link)"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>

              {/* Promo Code Input */}
              <div className="rounded-2xl border border-card-border bg-background/40 p-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      placeholder="Have a promo code? (e.g. BADARSH50)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full rounded-xl border border-card-border bg-background py-1.5 pl-9 pr-3 font-mono text-xs uppercase text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponCode.trim()}
                    className="cursor-pointer rounded-xl bg-accent px-4 py-1.5 text-xs font-bold text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
                  >
                    {applyingCoupon ? "..." : "Apply"}
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Coupon {appliedCoupon.code} applied! You saved {formatCurr(appliedCoupon.discountAmount)}.</span>
                  </p>
                )}
                {couponError && (
                  <p className="mt-2 text-[11px] font-medium text-red-500">
                    {couponError}
                  </p>
                )}
              </div>

              {/* 1-Click Upsell Offer Banner */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 transition-colors">
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
                      <span>ONE-TIME UPSELL OFFER (Save 60%)</span>
                    </div>
                    <p className="mt-0.5 text-xs font-medium text-foreground">
                      Add 30-Day Viral Content Planner for just {formatCurr(199)}
                    </p>
                    <p className="text-[11px] text-muted">
                      Includes 90 viral hooks, caption frameworks &amp; scheduled posting tracker.
                    </p>
                  </div>
                </label>
              </div>

              {/* Free Asset Direct Download vs Payment Flow */}
              {finalTotal === 0 ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-500">
                      <Sparkles className="h-3.5 w-3.5" /> 100% Free Asset
                    </span>
                    <h4 className="mt-3 font-heading text-base font-bold text-foreground">
                      Instant Direct Download
                    </h4>
                    <p className="mt-1 text-xs text-muted">
                      No payment required. Click below to download the master files directly to your device.
                    </p>
                  </div>

                  <a
                    href={
                      product.freeDownloadUrl ||
                      product.downloadUrl ||
                      product.googleDriveUrl ||
                      product.pdfUrl ||
                      product.appDownloadUrl ||
                      "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    onClick={() => {
                      setTimeout(handleModalClose, 800);
                    }}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald-600 py-4 font-heading text-xs font-bold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-[0.98]"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Free Asset Now (Instant)</span>
                  </a>
                </div>
              ) : (
                <>
                  {/* Payment Method Selector */}
                  <div className="relative flex gap-2 border-b border-card-border/60 pb-3">
                    {[
                      { id: "online", label: "Instant Pay (UPI / Cards)" },
                      { id: "qr", label: "Direct UPI QR" },
                      { id: "whatsapp", label: "WhatsApp" },
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

                  {/* Tab Content */}
                  <div>
                    {activeTab === "online" && (
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-card-border bg-background p-4 text-center space-y-3">
                          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-500">
                            <ShieldCheck className="h-4 w-4" />
                            <span>Cashfree Official Production Gateway</span>
                          </div>
                          <p className="text-xs text-muted">
                            Fast &amp; secure checkout supporting all UPI Apps, Credit/Debit Cards &amp; NetBanking.
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-muted font-medium">
                            <span className="rounded-md bg-secondary px-2.5 py-1">Google Pay</span>
                            <span className="rounded-md bg-secondary px-2.5 py-1">PhonePe</span>
                            <span className="rounded-md bg-secondary px-2.5 py-1">Paytm</span>
                            <span className="rounded-md bg-secondary px-2.5 py-1">Cards / RuPay</span>
                            <span className="rounded-md bg-secondary px-2.5 py-1">NetBanking</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCompleteOrder()}
                          disabled={submitting}
                          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent py-4 font-heading text-xs font-bold text-white shadow-lg transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-50"
                        >
                          {submitting ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              <span>Connecting to Cashfree Secure Checkout...</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4" />
                              <span>Pay {formatCurr(finalTotal)} &bull; Instant File Delivery</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {activeTab === "qr" && (
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-card-border bg-background p-4 text-center">
                          <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-2xl border border-card-border bg-white p-2 shadow-sm">
                            <img
                              src={`https://quickchart.io/qr?text=${encodeURIComponent(
                                `upi://pay?pa=7204250115@ybl&pn=BADARSH%20STUDIO&am=${finalTotal}&cu=INR&tn=${encodeURIComponent(
                                  product.title.slice(0, 20)
                                )}`
                              )}&size=160&margin=1`}
                              alt="Scan to Pay via UPI"
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <h4 className="mt-3 font-heading text-sm font-bold text-foreground">
                            Scan with Any UPI App to Pay
                          </h4>
                          <p className="text-xs text-muted">
                            PhonePe &bull; Google Pay &bull; Paytm &bull; BHIM &bull; CRED
                          </p>
                          <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-accent/40 bg-accent/5 p-2.5">
                            <span className="font-mono text-xs font-bold text-foreground">
                              {upiId}
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyUpi}
                              className="cursor-pointer rounded-md bg-accent px-2.5 py-1 text-[11px] font-bold text-white hover:bg-accent-hover transition-colors"
                            >
                              {copiedUpi ? "Copied!" : "Copy"}
                            </button>
                          </div>

                          {/* Mobile Intent link */}
                          <div className="mt-3">
                            <a
                              href={`upi://pay?pa=7204250115@ybl&pn=BADARSH%20STUDIO&am=${finalTotal}&cu=INR&tn=${encodeURIComponent(
                                product.title.slice(0, 20)
                              )}`}
                              className="inline-flex sm:hidden items-center gap-1.5 text-xs font-bold text-accent hover:underline"
                            >
                              <span>Tap here to launch UPI App on Phone</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCompleteOrder()}
                          disabled={submitting}
                          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent py-4 font-heading text-xs font-bold text-white shadow-lg transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-50"
                        >
                          {submitting ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              <span>Verifying &amp; Unlocking Assets...</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4" />
                              <span>I Have Paid &bull; Unlock Instant Access ({formatCurr(finalTotal)})</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {activeTab === "whatsapp" && (
                      <div className="space-y-4 text-center">
                        <p className="text-xs text-muted">
                          Order directly through our verified business WhatsApp. Receive instant download links and dedicated support.
                        </p>
                        <button
                          type="button"
                          onClick={handleWhatsAppCheckout}
                          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald-600 py-4 font-heading text-xs font-bold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-[0.98]"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Complete on WhatsApp &bull; {formatCurr(finalTotal)}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Guarantee */}
              <div className="flex items-center justify-center gap-2 border-t border-card-border/60 pt-4 text-xs text-muted">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>100% Satisfaction Guarantee &bull; Lifetime Updates</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
