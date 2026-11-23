"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, ShieldCheck, X } from "lucide-react";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user already set preferences
    const stored = localStorage.getItem("badarsh_cookie_consent");
    if (!stored) {
      // Delay display slightly for smooth page load
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("badarsh_cookie_consent", "all");
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem("badarsh_cookie_consent", "essential");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl"
          role="region"
          aria-label="Cookie consent banner"
        >
          <div className="rounded-2xl border border-border/80 bg-card/95 p-5 shadow-2xl backdrop-blur-xl sm:p-6 text-foreground">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Text & Icon */}
              <div className="flex items-start gap-3.5 max-w-2xl">
                <div className="rounded-xl bg-accent/10 p-2.5 text-accent shrink-0 mt-0.5">
                  <Cookie className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-sm font-bold tracking-tight text-foreground">
                      Cookie &amp; Privacy Preferences
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500 border border-emerald-500/20">
                      <ShieldCheck className="h-3 w-3" /> DPDP 2023 Compliant
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    We use strictly necessary cookies to keep your account session secure and deliver your digital assets. We do not use third-party ad tracking. Learn more in our{" "}
                    <Link
                      href="/cookie-policy"
                      className="text-accent underline hover:text-accent-hover font-medium"
                    >
                      Cookie Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-accent underline hover:text-accent-hover font-medium"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleEssentialOnly}
                  className="rounded-xl border border-border/80 bg-secondary/60 hover:bg-secondary px-4 py-2 text-xs font-semibold text-foreground transition duration-150 cursor-pointer"
                >
                  Essential Only
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="rounded-xl bg-accent hover:bg-accent-hover px-4 py-2 text-xs font-semibold text-white shadow-md transition duration-150 cursor-pointer"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={handleEssentialOnly}
                  aria-label="Dismiss cookie banner"
                  className="rounded-lg p-1 text-muted hover:text-foreground transition ml-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
