"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, CheckCircle2, AlertCircle, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,
  initialEmail = "",
}: ForgotPasswordModalProps) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await resetPassword(email);
    setLoading(false);

    if (res.success) {
      setSentSuccess(true);
    } else {
      setErrorMsg(res.error || "Failed to send reset email. Please try again.");
    }
  };

  const handleClose = () => {
    setSentSuccess(false);
    setErrorMsg(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-card-border/80 bg-card p-6 sm:p-8 shadow-2xl z-10"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 rounded-full p-2 text-muted hover:bg-muted/30 hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-4">
            <KeyRound className="h-6 w-6" />
          </div>

          <h3 className="apple-display text-xl sm:text-2xl font-bold text-foreground">
            Reset Password
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
            Enter the email address linked to your BADARSH account. We&apos;ll send you a secure link to create a new password.
          </p>

          {sentSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center"
            >
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
              <h4 className="mt-2 text-sm font-bold text-foreground">
                Reset Link Dispatched
              </h4>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Check your inbox at <span className="font-semibold text-foreground">{email}</span>. Click the link in the email to set a new password.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-accent-hover transition-colors"
              >
                Return to Sign In
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {errorMsg && (
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@badarsh.com"
                    className="w-full rounded-xl border border-card-border bg-background/50 pl-10 pr-4 py-3 text-xs sm:text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-hidden focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
