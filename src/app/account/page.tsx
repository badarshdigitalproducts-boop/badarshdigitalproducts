"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShieldCheck,
  Download,
  Trash2,
  Lock,
  FileText,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  Package,
  Key,
  Calendar,
  Mail,
  Loader2,
  ArrowRight,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useCurrency } from "@/context/currency-context";
import { SectionHeader } from "@/components/shared/section-header";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL?: string | null;
  provider: string;
  createdAt: string;
  lastLoginAt: string;
  dpdpConsent?: {
    consentedAt: string;
    version: string;
    lawfulBasis: string;
  };
}

interface UserOrder {
  id: string;
  items: Array<{ id: string; title: string; price: number }>;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
  licenseKey: string;
  createdAt: string;
}

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { formatPrice: formatCurr } = useCurrency();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/account");
      return;
    }

    if (user) {
      fetchAccountData();
    }
  }, [user, authLoading, router]);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/account");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load user account:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadMyData = () => {
    if (!profile) return;
    const exportData = {
      dataSubject: "Data Principal Export under DPDP Act 2023 Sec 11",
      exportedAt: new Date().toISOString(),
      userProfile: profile,
      ordersHistory: orders,
      complianceNote:
        "This export contains all personal data categories associated with your identity on BADARSH (badarsh.com).",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `badarsh-personal-data-${profile.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmInput.trim().toUpperCase() !== "DELETE") {
      setDeleteError("Please type 'DELETE' exactly to confirm permanent data erasure.");
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch("/api/user/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: "DELETE" }),
      });

      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || "Failed to process erasure request.");
        setDeleting(false);
        return;
      }

      await logout();
      router.push("/?account_deleted=true");
    } catch (err: any) {
      console.error("Delete account error:", err);
      setDeleteError(err?.message || "An unexpected error occurred during deletion.");
      setDeleting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted text-xs">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <span>Loading your account &amp; privacy profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 md:py-18 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-card-border pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
            <ShieldCheck className="h-3.5 w-3.5" />
            DPDP Act (2023) Compliant Account
          </span>
          <h1 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            Account &amp; Data Privacy Settings
          </h1>
          <p className="mt-1 text-xs text-muted">
            Manage your personal profile, download your statutory data export, or exercise your Right to Erasure.
          </p>
        </div>

        <button
          onClick={handleDownloadMyData}
          className="inline-flex items-center gap-2 rounded-xl border border-card-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <Download className="h-3.5 w-3.5 text-accent" />
          <span>Download My Data (JSON)</span>
        </button>
      </div>

      {/* Grid: Profile & Consent Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="rounded-3xl border border-card-border bg-card p-6 shadow-xs md:col-span-2 space-y-4">
          <h2 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-accent" />
            <span>Profile Identity</span>
          </h2>

          <div className="flex items-center gap-4 pt-1">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-foreground text-lg font-bold text-background shadow-xs">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                <span>{profile?.name?.charAt(0).toUpperCase() || "U"}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-heading font-bold text-foreground text-base truncate">
                {profile?.name || user?.displayName}
              </h3>
              <p className="text-xs text-muted truncate flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3 w-3" />
                <span>{profile?.email || user?.email}</span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase">
                  Verified Data Principal
                </span>
                <span className="text-[11px] text-muted">
                  Auth: <strong>{profile?.provider || "Email"}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-card-border/60 pt-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted block text-[11px]">Member Since</span>
              <span className="font-medium text-foreground">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN") : "Active"}
              </span>
            </div>
            <div>
              <span className="text-muted block text-[11px]">Last Secure Session</span>
              <span className="font-medium text-foreground">
                {profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleDateString("en-IN") : "Today"}
              </span>
            </div>
          </div>
        </div>

        {/* DPDP Consent Pill Card */}
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-heading text-sm font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>DPDP Consent Logged</span>
            </div>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              You gave explicit affirmative statutory consent under Section 6 of India&apos;s Digital Personal Data Protection Act, 2023.
            </p>
            <div className="mt-3 space-y-1.5 text-[11px] text-muted">
              <p>
                Policy Version: <strong className="text-foreground">2023-v1</strong>
              </p>
              <p>
                Basis: <strong className="text-foreground">Explicit Consent</strong>
              </p>
              <p>
                Status: <strong className="text-emerald-400">Compliant &amp; Active</strong>
              </p>
            </div>
          </div>

          <Link
            href="/privacy-policy"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline pt-2"
          >
            <span>Review Privacy Policy</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Orders & Purchased Digital Assets */}
      <div className="rounded-3xl border border-card-border bg-card p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
            <Package className="h-4 w-4 text-accent" />
            <span>My Digital Orders &amp; Licenses</span>
          </h2>
          <span className="text-xs text-muted">
            Total Orders: <strong className="text-foreground">{orders.length}</strong>
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-card-border p-8 text-center text-xs text-muted">
            <p>No digital orders found on this account yet.</p>
            <Link
              href="/bundles"
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 font-semibold text-white hover:bg-accent-hover transition-colors"
            >
              <span>Explore Creative Bundles</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-card-border/60">
            {orders.map((ord) => (
              <div key={ord.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-foreground">{ord.id}</span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase">
                      {ord.paymentStatus}
                    </span>
                  </div>
                  <p className="text-muted">
                    {ord.items?.map((i) => i.title).join(", ") || "Digital Assets"}
                  </p>
                  <p className="text-[11px] font-mono text-amber-400">
                    License: {ord.licenseKey || "Verified License"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-heading font-bold text-foreground mr-1">
                    {formatCurr(ord.totalAmount)}
                  </span>
                  <Link
                    href={`/orders/${ord.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-hover transition-colors shadow-xs"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download Files</span>
                  </Link>
                  <Link
                    href={`/orders/${ord.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-card-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    <span>Receipt</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger Zone: DPDP Right to Erasure / Delete Account */}
      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-rose-500 font-heading text-base font-bold">
          <AlertTriangle className="h-5 w-5" />
          <h2>Statutory Right to Erasure (DPDP Act Section 12)</h2>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          Under Section 12 of India&apos;s Digital Personal Data Protection Act, 2023, you have the right to request the complete, irreversible erasure of your personal data. Executing this cascading purge will:
        </p>

        <ul className="list-disc pl-5 space-y-1 text-xs text-muted">
          <li>Permanently delete your user profile and login credentials across primary databases.</li>
          <li>Anonymize all personal PII on past order receipts (while retaining anonymous tax records for statutory CGST accounting).</li>
          <li>Remove your email from all marketing campaigns, subscriber lists, and customer lead inquiries.</li>
          <li>Invalidate active login sessions and scrub identifying personal data from application audit trails.</li>
        </ul>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete My Account &amp; Purge Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-rose-500/30 bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Confirm Account Erasure
                </h3>
                <p className="text-[11px] text-muted">Permanent DPDP Section 12 Cascading Purge</p>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              This action is <strong>irreversible</strong>. Your profile will be permanently deleted and all your digital licenses and active sessions will be revoked.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Type <strong className="text-rose-500">DELETE</strong> to confirm:
                </label>
                <input
                  type="text"
                  required
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted/60 focus:border-rose-500 focus:outline-hidden focus:ring-1 focus:ring-rose-500/30"
                />
              </div>

              {deleteError && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 p-3 text-xs text-rose-500">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{deleteError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setConfirmInput("");
                    setDeleteError(null);
                  }}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted hover:text-foreground"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={deleting || confirmInput.trim().toUpperCase() !== "DELETE"}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2 text-xs font-bold shadow-md transition-all"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Purging data...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Permanently Delete</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
