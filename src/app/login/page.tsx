"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { GoogleIcon } from "@/components/auth/google-icon";
import { GoogleAuthModal } from "@/components/auth/google-auth-modal";
import { ForgotPasswordModal } from "@/components/auth/forgot-password-modal";
import { BrandLogo } from "@/components/layout/brand-logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/bundles";

  const {
    signInWithGoogle,
    signInWithGoogleEmail,
    signInWithEmail,
    error,
    clearError,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    const res = await signInWithEmail(email, password);
    setLoading(false);

    if (res.success) {
      router.push(redirectUrl);
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setLocalError(null);
    setGoogleLoading(true);
    const res = await signInWithGoogle();
    setGoogleLoading(false);

    if (res.success) {
      router.push(redirectUrl);
    } else if (res.code !== "auth/popup-closed-by-user") {
      setGoogleModalOpen(true);
    }
  };

  const activeError = localError || error;

  return (
    <>
      <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4 py-10 relative bg-background">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-[400px]"
        >
          {/* Apple Minimal Solid Card */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            {/* Header: Studio Emblem & Clean Title */}
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <BrandLogo variant="icon" />
              </div>
              <h1 className="apple-display text-2xl font-bold tracking-tight text-foreground">
                Sign in to BADARSH
              </h1>
              <p className="mt-1 text-xs text-muted">
                Welcome back. Enter your account details below.
              </p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {activeError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-5 overflow-hidden"
                >
                  <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-400">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                    <span className="leading-relaxed">{activeError}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google OAuth Button (Linear / Apple styled) */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-border bg-background/60 hover:bg-background px-4 py-2.5 text-xs font-semibold text-foreground transition-all duration-150 hover:border-foreground/20 active:scale-[0.99] disabled:opacity-60 cursor-pointer shadow-2xs"
              >
                {googleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                ) : (
                  <GoogleIcon className="h-4 w-4" />
                )}
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="w-full border-t border-border/60" />
              <span className="absolute bg-card px-3 text-[10px] font-medium uppercase tracking-wider text-muted">
                or
              </span>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-foreground/80 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-border bg-background/40 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted/60 focus:border-foreground/30 focus:outline-hidden focus:ring-1 focus:ring-foreground/20 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-foreground/80">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-[11px] text-muted hover:text-foreground transition-colors"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-border bg-background/40 pl-3.5 pr-9 py-2.5 text-xs text-foreground placeholder:text-muted/60 focus:border-foreground/30 focus:outline-hidden focus:ring-1 focus:ring-foreground/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border accent-accent"
                  />
                  <span className="text-[11px] text-muted">Remember this device</span>
                </label>
              </div>

              {/* Confident Apple-Grade Primary Action */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-xs py-2.5 transition-all duration-150 active:scale-[0.98] disabled:opacity-60 cursor-pointer shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Under-Card Switch Link */}
          <div className="mt-5 text-center text-xs text-muted">
            Don&apos;t have an account?{" "}
            <Link
              href={`/signup?redirect=${encodeURIComponent(redirectUrl)}`}
              className="font-semibold text-foreground hover:text-accent transition-colors underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>

          <p className="mt-4 text-center text-[11px] text-muted/60">
            Protected by BADARSH Studio Vault &bull; 256-bit SSL
          </p>
        </motion.div>
      </div>

      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        initialEmail={email}
      />

      <GoogleAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSubmit={signInWithGoogleEmail}
        onSuccess={() => router.push(redirectUrl)}
      />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
