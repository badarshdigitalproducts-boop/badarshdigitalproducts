"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gift, CheckCircle, ArrowRight, MessageSquare, ShieldCheck } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "Homepage 10 Free Templates Section" }),
      });
    } catch {
      // fallback
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section className="overflow-hidden py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-card-border bg-card p-8 md:p-16 shadow-xl">
          {/* Decorative subtle glow — strictly bounded */}
          <div className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-full bg-accent/8 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-accent shadow-2xs">
              <Gift className="h-4 w-4" />
              <span>Free Founder Gift</span>
            </div>

            <h2 className="mt-6 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Get The BADARSH Creator Starter Pack
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              Join 15,000+ creators receiving free uncompressed SFX samples, mobile editing workflows, Lightroom color grading tips, and conversion frameworks every week.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center"
              >
                <CheckCircle className="mx-auto h-10 w-10 text-emerald-500" />
                <h3 className="mt-2 font-heading text-lg font-bold text-foreground">
                  You're in! Check your inbox.
                </h3>
                <p className="mt-1 text-xs text-muted">
                  Your 10 Free Studio Templates link is on its way. In the meantime, join our priority broadcast for flash discounts!
                </p>
                <a
                  href={getWhatsAppUrl(
                    "Hi BADARSH! I just subscribed for the 10 free templates and want to join the WhatsApp VIP list.",
                    "Newsletter Welcome"
                  )}
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
                  className="w-full rounded-full border border-border bg-background px-6 py-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:max-w-md"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-foreground text-background px-8 py-4 font-heading text-sm font-bold shadow-xs transition-all hover:opacity-90 active:scale-[0.97] sm:w-auto"
                >
                  <span>{loading ? "Sending..." : "Get 10 Free Templates"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            <p className="mt-4 text-center text-xs text-muted">
              🔒 By subscribing, you consent to receive design updates in accordance with our{" "}
              <Link href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
              . Zero spam. Unsubscribe anytime with 1 click.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
