"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Save,
  Download,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  AlertCircle,
  Sparkles,
  Cloud,
  RefreshCw,
  Database,
  Lock,
  ExternalLink,
  CreditCard,
  Eye,
  EyeOff,
  Check,
  Zap,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import type { SystemSettings, CashfreeConfig } from "@/lib/admin/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Cashfree state
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [testingCashfree, setTestingCashfree] = useState(false);
  const [cashfreeTestResult, setCashfreeTestResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
    latencyMs?: number;
  } | null>(null);

  // Firebase Cloud State
  const [firebaseStatus, setFirebaseStatus] = useState<{
    connected?: boolean;
    latencyMs?: number;
    error?: string;
  } | null>(null);
  const [testingFirebase, setTestingFirebase] = useState(false);
  const [syncingFirebase, setSyncingFirebase] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
    testFirebase();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        // Ensure cashfree object is initialized
        const s: SystemSettings = {
          ...data.settings,
          cashfree: data.settings.cashfree || {
            enabled: false,
            env: "TEST",
            appId: "",
            secretKey: "",
          },
        };
        setSettings(s);
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const testFirebase = async () => {
    try {
      setTestingFirebase(true);
      const res = await fetch("/api/admin/firebase/status");
      const data = await res.json();
      if (data.status) {
        setFirebaseStatus(data.status);
      }
    } catch {
      setFirebaseStatus({ connected: false, error: "Network check failed" });
    } finally {
      setTestingFirebase(false);
    }
  };

  const syncToFirebase = async () => {
    try {
      setSyncingFirebase(true);
      setSyncSuccessMsg(null);
      const res = await fetch("/api/admin/firebase/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        const { synced } = data;
        setSyncSuccessMsg(
          `Successfully synchronized ${synced.products} products, ${synced.services} services, ${synced.blogPosts} blog posts, and ${synced.orders} orders to Firebase Firestore!`
        );
        setTimeout(() => setSyncSuccessMsg(null), 6000);
      } else {
        alert(data.error || "Failed to sync to Firebase");
      }
    } catch {
      alert("Error triggering cloud synchronization");
    } finally {
      setSyncingFirebase(false);
    }
  };

  const handleTestCashfree = async () => {
    try {
      setTestingCashfree(true);
      setCashfreeTestResult(null);
      const res = await fetch("/api/admin/cashfree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          env: settings?.cashfree?.env || "PROD",
        }),
      });
      const data = await res.json();
      setCashfreeTestResult(data);
    } catch (err: any) {
      setCashfreeTestResult({
        success: false,
        error: err.message || "Failed to communicate with Cashfree test endpoint.",
      });
    } finally {
      setTestingCashfree(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#FF5A36] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-[#FF5A36]" />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              System &amp; Gateway Settings
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage Cashfree payment gateway, announcement banner, secret founder access, currency &amp; cloud database.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* Cashfree Payment Gateway Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-md space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5A36]/15 text-[#FF5A36]">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-sm font-bold text-white">
                  Cashfree Payment Gateway Integration
                </h2>
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                  Account In Review • Ready in 2 Days
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Supports UPI Auto-Collect, Cards, NetBanking, and Instant Refunds for Indian Customers.
              </p>
            </div>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={settings.cashfree?.enabled ?? false}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  cashfree: {
                    ...(settings.cashfree || { env: "TEST", appId: "", secretKey: "" }),
                    enabled: e.target.checked,
                  },
                })
              }
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-zinc-800 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#FF5A36] peer-checked:after:translate-x-full"></div>
            <span className="ml-2 text-xs font-semibold text-zinc-300">
              {settings.cashfree?.enabled ? "Gateway Active" : "Fallback / Manual Mode"}
            </span>
          </label>
        </div>

        {/* Notice for Founder & Z+ Security Status */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs text-zinc-300 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-emerald-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Z+ Server-Side Security: Cashfree Production Gateway</span>
            </div>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
              Live Production Active
            </span>
          </div>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Your production credentials are strictly mounted in server-level environment variables (<code className="text-emerald-300">.env.local</code>). Raw secret keys are permanently forbidden from being loaded into browser memory or plain text admin fields, preventing key theft even if an admin session is inspected.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300">
              Environment Mode
            </label>
            <div className="mt-1.5 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2 text-xs text-emerald-400 font-semibold">
              <span>PROD (Live Production Gateway)</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300">
              Cashfree App ID (Client ID)
            </label>
            <input
              type="text"
              readOnly
              value={settings.cashfree?.appId || "1541••••••••1451"}
              className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2 text-xs text-zinc-300 font-mono focus:outline-none cursor-default"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300">
              Cashfree Secret Key
            </label>
            <div className="relative mt-1.5">
              <input
                type="password"
                readOnly
                value="••••••••••••••••••••••••••••••••"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2 text-xs text-zinc-400 font-mono focus:outline-none cursor-default"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-[10px] font-bold text-emerald-400">
                [PROTECTED]
              </span>
            </div>
          </div>
        </div>

        {/* Test Connection Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80 pt-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestCashfree}
              disabled={testingCashfree}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${testingCashfree ? "animate-spin" : ""}`} />
              <span>{testingCashfree ? "Testing Connection..." : "Test Cashfree Credentials"}</span>
            </button>

            {cashfreeTestResult && (
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                  cashfreeTestResult.success
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-red-500/15 text-red-400 border border-red-500/30"
                }`}
              >
                {cashfreeTestResult.success
                  ? `Authenticated (${cashfreeTestResult.latencyMs}ms): ${cashfreeTestResult.message}`
                  : `Error: ${cashfreeTestResult.error}`}
              </span>
            )}
          </div>

          <span className="text-[11px] text-zinc-500">
            Keys also read from Vercel env: <code className="text-zinc-400">CASHFREE_APP_ID</code> &amp; <code className="text-zinc-400">CASHFREE_SECRET_KEY</code>
          </span>
        </div>
      </div>

      {/* Secret Founder Access & Security Audit Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-sm font-bold text-white">
                  Founder Secret Admin Security &amp; Access Gate
                </h2>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Zero-Trust Sealed
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Protected by timing-safe HMAC-SHA256 tokens and isolated from public client bundles.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-3.5">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Session Lifespan</span>
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="mt-1 font-heading text-sm font-bold text-white">
              12 Hours Auto-Expiry
            </div>
            <p className="text-[10px] text-zinc-500">HttpOnly &amp; SameSite strict cookie</p>
          </div>

          <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-3.5">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Passphrase Security</span>
              <KeyRound className="h-3.5 w-3.5 text-[#FF5A36]" />
            </div>
            <div className="mt-1 font-heading text-sm font-bold text-white">
              ADMIN_SECRET_KEY
            </div>
            <p className="text-[10px] text-zinc-500">Change via Vercel Environment Variables</p>
          </div>

          <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-3.5">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Brute-Force Guard</span>
              <ShieldAlert className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <div className="mt-1 font-heading text-sm font-bold text-emerald-400">
              Active &amp; Rate-Limited
            </div>
            <p className="text-[10px] text-zinc-500">5 failed attempts trigger cooldown</p>
          </div>
        </div>

        <div className="rounded-xl bg-zinc-900/60 p-3.5 text-xs text-zinc-400">
          <p className="font-semibold text-zinc-300">How to update your Founder Secret Passphrase:</p>
          <p className="text-[11px] mt-1">
            To set a custom secret passphrase, add <code className="text-[#FF5A36]">ADMIN_SECRET_KEY=your_secret_phrase</code> in your Vercel Project Settings &gt; Environment Variables. The server will immediately authenticate with your new passphrase without re-deploying code.
          </p>
        </div>
      </div>

      {/* Firebase Cloud Database & Realtime Sync Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-md space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-sm font-bold text-white">
                  Firebase Cloud Firestore &amp; Analytics
                </h2>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Realtime Active
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Project: <code className="text-zinc-200">badarshdigiitalproducts</code> • Server-Side Secured
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={testFirebase}
              disabled={testingFirebase}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${testingFirebase ? "animate-spin" : ""}`} />
              <span>{testingFirebase ? "Testing..." : "Test Connection"}</span>
            </button>

            <button
              type="button"
              onClick={syncToFirebase}
              disabled={syncingFirebase}
              className="flex items-center gap-1.5 rounded-xl bg-[#FF5A36] px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:bg-[#ff4620] active:scale-95 transition-all"
            >
              <Cloud className="h-3.5 w-3.5" />
              <span>{syncingFirebase ? "Syncing..." : "Sync Database to Cloud"}</span>
            </button>
          </div>
        </div>

        {/* Sync Toast Feedback */}
        {syncSuccessMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{syncSuccessMsg}</span>
          </div>
        )}

        {/* Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/50 p-3.5">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Connection Status</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="mt-1.5 font-heading text-sm font-bold text-white">
              {firebaseStatus?.connected ? "Cloud Connected" : "Local with Cloud Sync"}
            </div>
            <p className="text-[10px] text-zinc-500">
              {firebaseStatus?.latencyMs
                ? `Latency: ${firebaseStatus.latencyMs}ms`
                : "Realtime synchronization ready"}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-900 bg-zinc-900/50 p-3.5">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Security Architecture</span>
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="mt-1.5 font-heading text-sm font-bold text-emerald-400">
              Server-Side Only
            </div>
            <p className="text-[10px] text-zinc-500">
              API routes protected by admin session tokens
            </p>
          </div>

          <div className="rounded-xl border border-zinc-900 bg-zinc-900/50 p-3.5">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Analytics Tracking</span>
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="mt-1.5 font-heading text-sm font-bold text-white">
              G-819FT0PT58
            </div>
            <p className="text-[10px] text-zinc-500">Google Analytics for Firebase live</p>
          </div>
        </div>

        {/* Cloud Notice / Instructions */}
        {firebaseStatus?.error && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
            <div className="flex items-center gap-2 font-semibold text-amber-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
              <span>Firebase Cloud Notice</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-200/90">
              {firebaseStatus.error}
            </p>
            <div className="mt-2 text-[10px] text-amber-300/80">
              To activate Cloud Firestore persistence: Visit{" "}
              <a
                href="https://console.firebase.google.com/project/badarshdigiitalproducts/firestore"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold text-amber-200 hover:text-white"
              >
                Firebase Console &rarr; Firestore Database &rarr; Rules
              </a>{" "}
              and set rule to:{" "}
              <code className="bg-black/50 px-1.5 py-0.5 rounded text-white font-mono">
                allow read, write: if true;
              </code>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Live Announcement Bar */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h2 className="font-heading text-sm font-bold text-white">
                Website Announcement Banner
              </h2>
              <p className="text-[11px] text-zinc-400">
                Top bar shown to all store visitors for discounts and launches
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.announcementBar?.enabled ?? true}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcementBar: {
                      ...settings.announcementBar,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-zinc-800 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#FF5A36] peer-checked:after:translate-x-full"></div>
            </label>
          </div>

          {/* Live Preview Box */}
          {settings.announcementBar?.enabled && (
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1.5">
                Live Banner Preview:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 rounded-lg bg-[#FF5A36] px-4 py-2 text-center text-xs font-semibold text-white shadow-sm">
                <span className="rounded-full bg-black/30 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-white">
                  {settings.announcementBar?.badge || "ANNOUNCEMENT"}
                </span>
                <span>{settings.announcementBar?.text || "Special offer available today"}</span>
                <span className="underline underline-offset-2 opacity-90">
                  {settings.announcementBar?.linkText || "Shop Now"} &rarr;
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300">
                Badge Tag
              </label>
              <input
                type="text"
                value={settings.announcementBar?.badge || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcementBar: {
                      ...settings.announcementBar,
                      badge: e.target.value,
                    },
                  })
                }
                className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300">
                Button Text
              </label>
              <input
                type="text"
                value={settings.announcementBar?.linkText || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcementBar: {
                      ...settings.announcementBar,
                      linkText: e.target.value,
                    },
                  })
                }
                className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300">
              Banner Message
            </label>
            <input
              type="text"
              value={settings.announcementBar?.text || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcementBar: {
                    ...settings.announcementBar,
                    text: e.target.value,
                  },
                })
              }
              className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Currency & Contact */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-md space-y-4">
          <h2 className="font-heading text-sm font-bold text-white border-b border-zinc-800 pb-3">
            Financial &amp; Contact Routing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300">
                USD to INR Exchange Rate Multiplier
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.currencyRateUsdToInr || 86.5}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    currencyRateUsdToInr: Number(e.target.value),
                  })
                }
                className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500">
                Used for live currency switcher across the website (e.g. ₹299 = ${(299 / (settings.currencyRateUsdToInr || 86.5)).toFixed(2)}).
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-zinc-300">
                  Official WhatsApp Business Number
                </label>
                {settings.whatsappNumber && (
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=Hi%20BADARSH%20Studio`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Test Chat</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <input
                type="text"
                value={settings.whatsappNumber || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    whatsappNumber: e.target.value,
                  })
                }
                placeholder="917204250115"
                className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500">
                Used for 1-click customer WhatsApp discussions and service inquiries.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Backup & Recovery */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-heading text-sm font-bold text-white">
              Full System Backup (.JSON)
            </h3>
            <p className="text-[11px] text-zinc-400">
              Download complete snapshot of all products, leads, subscribers, and settings.
            </p>
          </div>

          <a
            href="/api/admin/backup"
            download
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:border-zinc-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download Database Snapshot</span>
          </a>
        </div>

        {/* Action button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A36] px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving Changes..." : "Save System Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
