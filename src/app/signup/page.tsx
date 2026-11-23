"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { GoogleIcon } from "@/components/auth/google-icon";
import { GoogleAuthModal } from "@/components/auth/google-auth-modal";
import { BrandLogo } from "@/components/layout/brand-logo";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/bundles";

  const {
    signInWithGoogle,
    signInWithGoogleEmail,
    signUpWithEmail,
    error,
    clearError,
  } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Clean, subtle password strength
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "" };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-rose-500" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 3, label: "Good", color: "bg-blue-500" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-500" };
      default:
        return { score: 0, label: "" };
    }
  }, [password]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!name.trim()) {
      setLocalError("Please enter your name.");
      return;
    }
    if (!email || !password) {
      setLocalError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    if (!agreeTerms) {
      setLocalError("Explicit consent is required under India's DPDP Act, 2023. Please check the consent box to continue.");
      return;
    }

    setLoading(true);
    const res = await signUpWithEmail(name, email, password);
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
    } else if (
      res.code?.includes("permission-denied") ||
      res.code === "auth/unauthorized-domain" ||
      res.error?.includes("Identity Toolkit")
    ) {
      setGoogleModalOpen(true);
    }
  };

  const activeError = localError || error;

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4 py-10 relative bg-background">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-[400px]"
      >
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <BrandLogo variant="icon" />
            </div>
            <h1 className="apple-display text-2xl font-bold tracking-tight text-foreground">
              Create an account
            </h1>
            <p className="mt-1 text-xs text-muted">
              Get started with master-grade digital assets.
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

          {/* Google OAuth Button */}
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

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-foreground/80 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full rounded-xl border border-border bg-background/40 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted/60 focus:border-foreground/30 focus:outline-hidden focus:ring-1 focus:ring-foreground/20 transition-all"
              />
            </div>

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
              <label className="block text-[11px] font-semibold text-foreground/80 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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

              {/* Password strength mini track */}
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="grid grid-cols-4 gap-1 flex-1 h-1 bg-muted/40 rounded-full overflow-hidden">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score >= step
                            ? passwordStrength.color || "bg-accent"
                            : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>
                  {passwordStrength.label && (
                    <span className="text-[10px] text-muted font-medium">
                      {passwordStrength.label}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* DPDP Act 2023 Explicit Statutory Consent Checkbox */}
            <div className="pt-0.5 rounded-xl border border-card-border/80 bg-background/50 p-3">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border accent-accent cursor-pointer shrink-0"
                />
                <span className="text-[11px] text-muted leading-relaxed">
                  I confirm that I am at least <strong className="text-foreground">18 years of age</strong> (or possess verifiable parental/guardian consent under Section 9 of the <strong className="text-foreground">DPDP Act, 2023</strong>) and give my explicit, informed consent to the collection and processing of my personal data as described in the{" "}
                  <Link
                    href="/privacy-policy"
                    target="_blank"
                    className="font-semibold text-accent underline underline-offset-2 hover:text-accent-hover"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="font-semibold text-foreground underline underline-offset-2 hover:text-accent"
                  >
                    Terms of Service
                  </Link>
                  .
                </span>
              </label>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading || !agreeTerms}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-xs py-2.5 transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Under-Card Switch Link */}
        <div className="mt-5 text-center text-xs text-muted">
          Already have an account?{" "}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
            className="font-semibold text-foreground hover:text-accent transition-colors underline underline-offset-4"
          >
            Sign in
          </Link>
        </div>

        <p className="mt-4 text-center text-[11px] text-muted/60">
          Protected by BADARSH Studio Vault &bull; 256-bit SSL
        </p>
      </motion.div>

      <GoogleAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSubmit={signInWithGoogleEmail}
        onSuccess={() => router.push(redirectUrl)}
      />
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
