"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  Film,
  Award,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { GoogleIcon } from "@/components/auth/google-icon";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/bundles";

  const { signInWithGoogle, signUpWithEmail, demoLogin, error, clearError } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "Enter password", color: "bg-muted" };
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
        return { score: 3, label: "Good", color: "bg-sky-500" };
      case 4:
        return { score: 4, label: "Studio Strong", color: "bg-emerald-500" };
      default:
        return { score: 0, label: "Too short", color: "bg-muted" };
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
      setLocalError("Please agree to the Terms of Service to continue.");
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
    }
  };

  const handleDemoSignIn = () => {
    demoLogin(name || "New Studio Creator", email || "new.creator@badarsh.com");
    router.push(redirectUrl);
  };

  const activeError = localError || error;

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[500px] w-[750px] rounded-full bg-gradient-to-bl from-accent/15 via-orange-500/10 to-indigo-600/10 blur-[120px] -z-10" />
      <div className="pointer-events-none absolute -bottom-40 left-10 h-[400px] w-[500px] rounded-full bg-accent/10 blur-[130px] -z-10" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Creator Identity & Value (5 cols) */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1 text-xs font-bold text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            <span>JOIN THE COLLECTIVE</span>
          </div>

          <h1 className="apple-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.12]">
            Create your account &amp; <span className="text-accent">unlock the studio</span>.
          </h1>

          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-md mx-auto lg:mx-0">
            Join 14,000+ editors, filmmakers, and digital agency founders. Get instant cloud access to master bundles, presets, and commercial assets.
          </p>

          {/* Perks */}
          <div className="space-y-3 pt-2 max-w-md mx-auto lg:mx-0 text-left">
            <div className="flex items-center gap-3 rounded-2xl border border-card-border/60 bg-card/60 p-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Immediate 1-Click Vault Access</h4>
                <p className="text-[11px] text-muted">No waiting — instant Google Drive &amp; direct download delivery.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-card-border/60 bg-card/60 p-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Film className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Royalty-Free Client Licensing</h4>
                <p className="text-[11px] text-muted">Keep 100% of your earnings on all commercial client work.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-card-border/60 bg-card/60 p-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Free Lifetime Version Updates</h4>
                <p className="text-[11px] text-muted">When we update packs, your cloud library updates automatically.</p>
              </div>
            </div>
          </div>

          {/* Bottom Security Notice */}
          <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-muted pt-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>256-bit encrypted authentication &bull; Zero spam</span>
          </div>
        </div>

        {/* Right Column: Interactive Registration Card (7 cols) */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative rounded-3xl border border-card-border/80 bg-card/80 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-card-border/60 pb-5 mb-6">
              <div>
                <h2 className="apple-display text-2xl sm:text-3xl font-extrabold text-foreground">
                  Create Account
                </h2>
                <p className="text-xs text-muted mt-1">
                  Start creating with master-grade digital assets
                </p>
              </div>
              <Link
                href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
                className="rounded-full border border-card-border bg-muted/20 px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/40 transition-all active:scale-95"
              >
                Sign In &rarr;
              </Link>
            </div>

            {/* Error Notice */}
            <AnimatePresence>
              {activeError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="flex items-start gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                    <div className="flex-1 leading-relaxed">
                      <span className="font-semibold text-rose-200 block mb-0.5">Registration Notice</span>
                      {activeError}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 1-Click Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-card-border bg-background/80 hover:bg-background px-4 py-3.5 text-xs sm:text-sm font-semibold text-foreground shadow-xs hover:border-foreground/20 hover:shadow-md active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
              ) : (
                <GoogleIcon className="h-5 w-5" />
              )}
              <span>Sign Up with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="w-full border-t border-card-border/60" />
              <span className="absolute bg-card px-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                Or register with email
              </span>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Full Name / Studio Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Sharma"
                    className="w-full rounded-xl border border-card-border bg-background/50 pl-10 pr-4 py-3 text-xs sm:text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-hidden focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@growthagency.in"
                    className="w-full rounded-xl border border-card-border bg-background/50 pl-10 pr-4 py-3 text-xs sm:text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-hidden focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password (min 6 chars)"
                    className="w-full rounded-xl border border-card-border bg-background/50 pl-10 pr-10 py-3 text-xs sm:text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-hidden focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted">Password Strength:</span>
                      <span className="font-bold text-foreground">{passwordStrength.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.score >= step
                              ? passwordStrength.color
                              : "bg-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Agreement Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded-md border-card-border accent-accent"
                  />
                  <span className="text-xs text-muted leading-relaxed">
                    I agree to the BADARSH{" "}
                    <Link href="/terms" className="text-foreground underline underline-offset-2">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-foreground underline underline-offset-2">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {/* Primary Create Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-accent/20 hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating Creator Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Creator Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Instant Demo Sandbox Shortcut */}
            <div className="mt-6 pt-5 border-t border-card-border/60 text-center">
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="inline-flex items-center gap-2 rounded-full border border-card-border bg-muted/20 px-4 py-2 text-xs font-semibold text-muted hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span>Instant Demo Creator Access (1-Click)</span>
              </button>
            </div>

            {/* Card Footer Link */}
            <p className="mt-5 text-center text-xs text-muted">
              Already have an account?{" "}
              <Link
                href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
                className="font-bold text-accent hover:underline"
              >
                Sign In here &rarr;
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
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
