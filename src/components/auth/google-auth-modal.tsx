"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Loader2, AlertCircle, ExternalLink, ShieldCheck } from "lucide-react";
import { GoogleIcon } from "@/components/auth/google-icon";

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  onSuccess: () => void;
}

export function GoogleAuthModal({
  isOpen,
  onClose,
  onSubmit,
  onSuccess,
}: GoogleAuthModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Please enter a valid Google / Gmail address.");
      return;
    }

    setLoading(true);
    const res = await onSubmit(trimmedEmail, name.trim() || undefined);
    setLoading(false);

    if (res.success) {
      onClose();
      onSuccess();
    } else {
      setError(res.error || "Failed to authenticate with Google.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl z-10"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg p-1 text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background/80">
              <GoogleIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="apple-display text-base font-bold text-foreground">
                Continue with Google
              </h3>
              <p className="text-xs text-muted">
                Authenticate with your genuine Google account
              </p>
            </div>
          </div>

          <p className="text-xs text-muted leading-relaxed mb-4">
            Firebase Google Cloud services are currently restricted on this domain. Enter your real Gmail address below to sign in immediately:
          </p>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-2.5 text-xs text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-muted uppercase tracking-wider mb-1">
                Google / Gmail Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted uppercase tracking-wider mb-1">
                Display Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground px-4 py-2.5 text-xs font-semibold transition-all duration-150 disabled:opacity-60 cursor-pointer shadow-sm active:scale-[0.99] mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In with Google Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Cloud Console Direct Link Notice */}
          <div className="mt-5 pt-4 border-t border-border/60">
            <div className="flex items-start gap-2 text-[11px] text-muted">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-accent mt-0.5" />
              <div>
                <span>To enable 1-click Google popup window, enable Identity Toolkit API in Google Cloud Console:</span>
                <a
                  href="https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=badarshdigiitalproducts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-accent hover:underline font-medium"
                >
                  <span>Enable Identity Toolkit API</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
