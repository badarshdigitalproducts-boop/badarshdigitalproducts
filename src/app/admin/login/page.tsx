"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { safeParseJson } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Fingerprint,
} from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get("next") || searchParams.get("from") || "/admin";
  const from = rawFrom.startsWith("/admin") && !rawFrom.startsWith("/admin/login") ? rawFrom : "/admin";

  const [passphrase, setPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase: passphrase.trim() }),
      });

      const data = await safeParseJson<any>(res, {});

      if (!res.ok) {
        setError(data.error || "Authentication failed. Access denied.");
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
        if (data.locked) {
          setIsLocked(true);
        }
        setShake(true);
        setTimeout(() => setShake(false), 500);
      } else {
        router.push(from);
        router.refresh();
      }
    } catch {
      setError("Secure gateway connection error. Please verify network connectivity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#06080D] px-4 text-zinc-100 selection:bg-rose-500 selection:text-white">
      {/* Background ambient grid & Z+ radar glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-rose-600/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293718_1px,transparent_1px),linear-gradient(to_bottom,#1f293718_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <motion.div
        animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="overflow-hidden rounded-3xl border border-rose-500/20 bg-slate-950/90 p-8 shadow-2xl shadow-rose-950/20 backdrop-blur-2xl">
          {/* Header */}
          <div className="text-center">
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 shadow-inner">
              <ShieldAlert className="h-8 w-8 text-rose-500" />
              <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="rounded-full bg-rose-500/15 px-3 py-0.5 text-[11px] font-mono font-bold tracking-widest text-rose-400 uppercase border border-rose-500/30">
                Z+ MILITARY PERIMETER ACTIVE
              </span>
            </div>

            <h1 className="mt-3 font-heading text-2xl font-black tracking-tight text-white">
              BADARSH FOUNDER VAULT
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Restricted Founder Command Center &bull; Authorized Personnel Only
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3.5 text-xs text-rose-300 space-y-1.5"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                  <span className="font-medium leading-relaxed">{error}</span>
                </div>
                {remainingAttempts !== null && remainingAttempts > 0 && !isLocked && (
                  <div className="pl-6 text-[11px] font-mono text-amber-400">
                    Warning: {remainingAttempts} attempt{remainingAttempts === 1 ? "" : "s"} remaining before 30-minute IP lockdown.
                  </div>
                )}
              </motion.div>
            )}

            <div>
              <label
                htmlFor="passphrase"
                className="flex items-center justify-between text-xs font-semibold text-slate-300"
              >
                <span>Master Security Key</span>
                <span className="font-mono text-[10px] text-slate-500">256-BIT PBKDF2</span>
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <KeyRound className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="passphrase"
                  type={showPassphrase ? "text" : "password"}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter Founder Master Key..."
                  required
                  autoFocus
                  disabled={loading || isLocked}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-2.5 pr-10 pl-10 text-xs font-mono text-white placeholder:text-slate-600 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 transition"
                  tabIndex={-1}
                >
                  {showPassphrase ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !passphrase.trim() || isLocked}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-rose-900/30 transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Verifying Master Credentials...</span>
                </div>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  <span>Verify Z+ Credentials</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Security footnote */}
          <div className="mt-8 border-t border-slate-800/80 pt-4 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1 text-slate-400">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                PBKDF2-100k
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Fingerprint className="h-3 w-3 text-blue-400" />
                Device Bound
              </span>
              <span>&bull;</span>
              <span className="text-slate-400">3-Strike Lockout</span>
            </div>
            <p className="mt-2 text-[10px] text-slate-600">
              Unlawful access attempts are permanently archived in statutory compliance logs.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#06080d]">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#FF5A36] border-t-transparent" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
