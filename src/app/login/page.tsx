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
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  FolderLock,
  Headphones,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { GoogleIcon } from "@/components/auth/google-icon";
import { ForgotPasswordModal } from "@/components/auth/forgot-password-modal";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/bundles";

  const { signInWithGoogle, signInWithEmail, demoLogin, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Please enter both email and password.");
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
    }
  };

  const handleDemoSignIn = () => {
    demoLogin("Alex Rivera (Creator Demo)", "alex.rivera@badarsh.com");
    router.push(redirectUrl);
  };

  const activeError = localError || error;

  return (
    <>
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient Studio Lighting (Apple aesthetic) */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[750px] rounded-full bg-gradient-to-tr from-accent/15 via-orange-500/10 to-purple-600/10 blur-[120px] -z-10" />
        <div className="pointer-events-none absolute -bottom-40 right-10 h-[400px] w-[500px] rounded-full bg-accent/10 blur-[130px] -z-10" />

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Visual Brand & Credibility (5 cols) */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1 text-xs font-bold text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              <span>BADARSH CREATOR VAULT</span>
            </div>

            <h1 className="apple-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              Welcome back to your <span className="text-accent">studio sanctuary</span>.
            </h1>

            <p className="text-sm sm:text-base text-muted leading-relaxed max-w-md mx-auto lg:mx-0">
              Access your lifetime purchased editing packs, Lightroom DNG presets, 48kHz audio stems, and direct WhatsApp team support.
            </p>

            {/* Benefit Highlights */}
            <div className="space-y-3 pt-2 max-w-md mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-3 rounded-2xl border border-card-border/60 bg-card/60 p-3.5 backdrop-blur-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Instant Unlocked Downloads</h4>
                  <p className="text-[11px] text-muted">Never lose a file — download anytime in uncompressed 4K &amp; WAV.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-card-border/60 bg-card/60 p-3.5 backdrop-blur-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <FolderLock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Commercial License Included</h4>
                  <p className="text-[11px] text-muted">Use on unlimited client videos, YouTube monetized channels &amp; ads.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-card-border/60 bg-card/60 p-3.5 backdrop-blur-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Headphones className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Priority Agency Pipeline</h4>
                  <p className="text-[11px] text-muted">Direct fast-lane for custom video editing &amp; website development.</p>
                </div>
              </div>
            </div>

            {/* Creator Social Proof Avatar Stack */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-3">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
                  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80",
                  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Creator"
                    className="h-8 w-8 rounded-full border-2 border-background object-cover"
                  />
                ))}
              </div>
              <div className="text-left text-xs">
                <div className="flex items-center gap-1 font-bold text-foreground">
                  <span>4.98 / 5.0</span>
                  <span className="text-amber-400">★★★★★</span>
                </div>
                <p className="text-[10px] text-muted">Trusted by 14,000+ creators &amp; agency editors</p>
              </div>
            </div>
          </div>

          {/* Right Column: Apple Glassmorphism Auth Card (7 cols) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="relative rounded-3xl border border-card-border/80 bg-card/80 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl"
            >
              {/* Tab Switcher Header */}
              <div className="flex items-center justify-between border-b border-card-border/60 pb-5 mb-6">
                <div>
                  <h2 className="apple-display text-2xl sm:text-3xl font-extrabold text-foreground">
                    Sign In
                  </h2>
                  <p className="text-xs text-muted mt-1">
                    Enter your email or continue with 1-click Google sign in
                  </p>
                </div>
                <Link
                  href={`/signup?redirect=${encodeURIComponent(redirectUrl)}`}
                  className="rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-bold text-accent hover:bg-accent hover:text-white transition-all active:scale-95"
                >
                  Create Account &rarr;
                </Link>
              </div>

              {/* Error Toast */}
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
                        <span className="font-semibold text-rose-200 block mb-0.5">Authentication Notice</span>
                        {activeError}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 1-Click Google Sign In */}
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
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative my-6 flex items-center justify-center">
                <div className="w-full border-t border-card-border/60" />
                <span className="absolute bg-card px-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                  Or continue with email
                </span>
              </div>

              {/* Email + Password Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                      placeholder="creator@badarsh.com"
                      className="w-full rounded-xl border border-card-border bg-background/50 pl-10 pr-4 py-3 text-xs sm:text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-hidden focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-[11px] font-semibold text-accent hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
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
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded-md border-card-border accent-accent"
                    />
                    <span className="text-xs text-muted">Keep me signed in on this device</span>
                  </label>
                </div>

                {/* Primary Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-accent/20 hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Studio</span>
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
                Don&apos;t have a creator account?{" "}
                <Link
                  href={`/signup?redirect=${encodeURIComponent(redirectUrl)}`}
                  className="font-bold text-accent hover:underline"
                >
                  Create one in 30 seconds &rarr;
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        initialEmail={email}
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
