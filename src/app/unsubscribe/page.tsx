"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MailX, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const successParam = searchParams.get("success") === "true";

  const [email, setEmail] = useState(emailParam);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(successParam);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (emailParam && successParam) {
      setSuccess(true);
      setEmail(emailParam);
    }
  }, [emailParam, successParam]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to unsubscribe.");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 md:py-24">
      <div className="rounded-3xl border border-card-border bg-card p-8 shadow-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/50 text-foreground mb-4">
          <MailX className="h-7 w-7 text-accent" />
        </div>

        <h1 className="font-heading text-2xl font-bold text-foreground">
          Newsletter Unsubscribe
        </h1>
        <p className="mt-2 text-xs text-muted max-w-xs mx-auto">
          We respect your inbox. You can remove yourself from the BADARSH studio community anytime.
        </p>

        {success ? (
          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-3">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
            <h2 className="text-sm font-bold text-foreground">
              You Have Been Successfully Unsubscribed
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              <strong>{email}</strong> has been removed from all promotional mailing lists. You will no longer receive weekly template drops or marketing updates.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary/80 transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Return to BADARSH Storefront
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUnsubscribe} className="mt-6 space-y-4 text-left">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-foreground">
                Your Registered Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="mt-1.5 w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full cursor-pointer rounded-xl bg-accent hover:bg-accent-hover py-2.5 text-xs font-semibold text-white shadow-md transition disabled:opacity-50"
            >
              {loading ? "Removing from list..." : "Confirm 1-Click Unsubscribe"}
            </button>

            <p className="text-center text-[11px] text-muted pt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> CAN-SPAM Act &amp; DPDP 2023 Compliant
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
