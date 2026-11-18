"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Shield, Lock, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [passphrase, setPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        body: JSON.stringify({ passphrase }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Access denied.");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      } else {
        router.push(from);
        router.refresh();
      }
    } catch {
      setError("Network or server connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#09090B] px-4 text-zinc-100 selection:bg-[#FF5A36] selection:text-white">
      {/* Background ambient grid & radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#FF5A36]/8 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <motion.div
        animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 shadow-inner">
              <Shield className="h-7 w-7 text-[#FF5A36]" />
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-medium tracking-wider text-zinc-400 uppercase">
                Zero-Trust Gate
              </span>
            </div>

            <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight text-white">
              BADARSH Founder Portal
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              Restricted management console. Authentication required.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label
                htmlFor="passphrase"
                className="block text-xs font-medium text-zinc-300"
              >
                Founder Secret Passphrase
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  id="passphrase"
                  type={showPassphrase ? "text" : "password"}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter secret passphrase..."
                  required
                  autoFocus
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pr-10 pl-10 text-sm text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none focus:ring-1 focus:ring-[#FF5A36] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300"
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
              disabled={loading || !passphrase.trim()}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FF5A36] py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-150 hover:bg-[#ff4620] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Unlock Admin Console</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Security footnote */}
          <div className="mt-8 border-t border-zinc-800/80 pt-4 text-center">
            <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                HMAC-SHA256
              </span>
              <span>•</span>
              <span>HttpOnly Cookies</span>
              <span>•</span>
              <span>Rate Limited</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

