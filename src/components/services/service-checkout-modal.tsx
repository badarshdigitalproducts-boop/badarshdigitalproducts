"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  Sparkles,
  Lock,
} from "lucide-react";
import { useCurrency } from "@/context/currency-context";
import { getWhatsAppUrl } from "@/lib/utils";
import { CheckoutModal } from "@/components/products/checkout-modal";
import type { Product } from "@/types/product";

interface ServiceCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: string;
    name: string;
    price: number;
    period?: string;
    description?: string;
    features?: string[];
    turnaround?: string;
  };
  serviceTitle: string;
}

export function ServiceCheckoutModal({
  isOpen,
  onClose,
  plan,
  serviceTitle,
}: ServiceCheckoutModalProps) {
  const { formatPrice: formatCurr } = useCurrency();
  const [showDirectCheckout, setShowDirectCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    eventLocation: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Convert to Product for universal Cashfree / Razorpay checkout flow
  const serviceAsProduct: Product = {
    id: `svc-${plan.id}`,
    slug: `service-${plan.id}`,
    title: `${serviceTitle} — ${plan.name}`,
    description: plan.description || `Luxury professional ${serviceTitle} service.`,
    longDescription: plan.description || `Luxury professional ${serviceTitle} service.`,
    price: plan.price,
    currency: "INR",
    category: "social-media",
    tags: ["service", "photography", "cinema", "luxury"],
    images: ["https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80"],
    features: plan.features || [],
    rating: 5.0,
    reviewCount: 38,
    downloads: 180,
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    format: "On-Site Production & Delivery",
    createdAt: "2026-01-01",
  };

  const handleWhatsAppBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name || "Prospective Client",
          email: formData.email || "inquiry@client.com",
          interest: `${serviceTitle} — ${plan.name}`,
          message: `Booking Request: ${serviceTitle} (${plan.name} Package)
Event Date: ${formData.eventDate || "TBD"}
Location: ${formData.eventLocation || "Karnataka"}
Client Phone: ${formData.phone || "Not provided"}
Notes: ${formData.notes || "None"}`,
          budget: `₹${plan.price}`,
        }),
      });
    } catch {
      // Non-blocking
    } finally {
      setIsSubmitting(false);
    }

    const message = `Hi BADARSH! I'd like to book the ${serviceTitle} (${plan.name} - ${formatCurr(plan.price)}).
Name: ${formData.name}
Phone: ${formData.phone}
Date: ${formData.eventDate || "Flexible"}
Location: ${formData.eventLocation || "Local"}
${formData.notes ? `Notes: ${formData.notes}` : ""}`;

    const url = getWhatsAppUrl(message, `${serviceTitle} - ${plan.name}`);
    window.open(url, "_blank");
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0e0e11] text-white shadow-2xl"
          >
            {/* Header banner */}
            <div className="border-b border-white/10 bg-gradient-to-r from-zinc-900 to-[#18181b] p-5 sm:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#FF5A36]/15 border border-[#FF5A36]/30 px-3 py-1 text-[11px] font-bold text-[#FF5A36]">
                    <Sparkles className="h-3 w-3" />
                    <span>Selected Package</span>
                  </div>
                  <h3 className="mt-3 font-heading text-2xl font-bold tracking-tight text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    {serviceTitle} &bull; {plan.turnaround || "Express Turnaround"}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-full bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-heading text-3xl font-extrabold text-white">
                  {formatCurr(plan.price)}
                </span>
                <span className="text-xs text-zinc-400">
                  / {plan.period || "complete production"}
                </span>
              </div>
            </div>

            {/* Content & Booking Form */}
            <div className="p-5 sm:p-8 space-y-6">
              {/* Features summary */}
              {plan.features && plan.features.length > 0 && (
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2.5">
                    Included in this experience:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                    {plan.features.slice(0, 6).map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking form */}
              <form onSubmit={handleWhatsAppBooking} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300">
                      Your Full Name <span className="text-[#FF5A36]">*</span>
                    </label>
                    <div className="relative mt-1">
                      <User className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2.5 pr-3 pl-9 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300">
                      WhatsApp Phone Number <span className="text-[#FF5A36]">*</span>
                    </label>
                    <div className="relative mt-1">
                      <Phone className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2.5 pr-3 pl-9 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300">
                      Target Event Date / Month
                    </label>
                    <div className="relative mt-1">
                      <Calendar className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        placeholder="e.g. 18 Dec 2026 or Spring"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2.5 pr-3 pl-9 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300">
                      Shoot Location / City
                    </label>
                    <div className="relative mt-1">
                      <MapPin className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        value={formData.eventLocation}
                        onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                        placeholder="e.g. Bengaluru / Mysuru / Goa"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2.5 pr-3 pl-9 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="pt-2 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setShowDirectCheckout(true)}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#FF5A36] py-3.5 text-xs font-bold text-white shadow-lg shadow-[#FF5A36]/20 hover:opacity-90 active:scale-[0.99] transition-all"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Pay Booking Deposit ({formatCurr(plan.price)})</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 py-3 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 active:scale-[0.99] transition-all"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Lock Date &amp; Discuss on WhatsApp</span>
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-zinc-400 border-t border-white/5 pt-4">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Verified Master Crew</span>
                </div>
                <span>&bull;</span>
                <div className="flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-zinc-400" />
                  <span>UPI, Cards &amp; NetBanking Supported</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Online Payment Flow */}
      {showDirectCheckout && (
        <CheckoutModal
          product={serviceAsProduct}
          isOpen={true}
          onClose={() => setShowDirectCheckout(false)}
          initialCustomer={{
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          }}
        />
      )}
    </>
  );
}
