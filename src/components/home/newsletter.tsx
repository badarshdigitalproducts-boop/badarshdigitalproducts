"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, CheckCircle, ArrowRight, MessageSquare, ShieldCheck } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate or call API
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // fallback
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/15 via-purple-900/20 to-card p-8 md:p-16 shadow-2xl">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-background/60 px-4 py-1.5 text-xs font-semibold text-accent backdrop-blur-md">
              <Gift className="h-4 w-4" />
              <span>Free Founder Gift</span>
            </div>

            <h2 className="mt-6 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Download 10 Free Viral Instagram Templates
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              Join 5,000+ business owners receiving weekly marketing tactics, free Canva design drops, and high-converting copy frameworks.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center backdrop-blur-md"
              >
                <CheckCircle className="mx-auto h-10 w-10 text-emerald-500" />
                <h3 className="mt-2 font-heading text-lg font-bold text-foreground">
                  You're in! Check your inbox.
                </h3>
                <p className="mt-1 text-xs text-muted">
                  Your 10 Free Canva Templates link is on its way. In the meantime, feel free to join our WhatsApp VIP list for flash discounts!
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    "Hi BADARSH! I just subscribed for the 10 free templates and want to join the WhatsApp VIP list."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                >
                  <MessageSquare className="h-4 w-4" />
                  Join VIP WhatsApp Community
                </a>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your business email..."
                  required
                  className="w-full rounded-full border border-card-border bg-background/80 px-6 py-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 sm:max-w-md backdrop-blur-md"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-heading text-sm font-bold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl sm:w-auto"
                >
                  <span>{loading ? "Sending..." : "Claim Free Pack"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Zero spam. Unsubscribe anytime.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

