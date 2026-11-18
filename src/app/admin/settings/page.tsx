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
} from "lucide-react";
import type { SystemSettings } from "@/lib/admin/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

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
      setSettings(data.settings || null);
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
    } catch (err) {
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
              Global System Settings
            </h1>
          </div>
          <p className="text-xs text-zinc-400">
            Configure Firebase cloud database, announcement bar, currency exchange, and WhatsApp support.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
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
              <RefreshCw
                className={`h-3.5 w-3.5 ${testingFirebase ? "animate-spin" : ""}`}
              />
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
                Used for live currency switcher across the website.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300">
                Official WhatsApp Business Number
              </label>
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
                Used for instant 1-click customer WhatsApp discussions.
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
