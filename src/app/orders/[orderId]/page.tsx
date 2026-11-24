"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Download,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  Layers,
  BookOpen,
  Camera,
  Smartphone,
  Music,
  Video,
  Package,
  MessageCircle,
  Clock,
  Printer,
} from "lucide-react";
import { useCurrency } from "@/context/currency-context";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import type { OrderRecord } from "@/lib/admin/types";
import { markProductAsUnlocked } from "@/hooks/use-product-access";
import { triggerDirectDownload } from "@/lib/download";

export default function OrderFulfillmentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.orderId as string) || "";
  const { formatPrice: formatCurr } = useCurrency();

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchOrderData = async () => {
    if (!orderId) return;
    setVerifying(true);

    try {
      const localToken = typeof window !== "undefined" ? localStorage.getItem(`badarsh_order_token_${orderId}`) : null;
      const search = typeof window !== "undefined" ? window.location.search : "";
      const baseParams = search ? search : `?token=${encodeURIComponent(localToken || orderId)}`;
      const query = localToken && !baseParams.includes("token=")
        ? `${baseParams}&token=${encodeURIComponent(localToken)}`
        : baseParams;

      const res = await fetch(`/api/orders/${orderId}${query}`);
      const data = await res.json();

      if (data.order) {
        setOrder(data.order);
        if (data.order.paymentStatus === "completed") {
          data.order.items?.forEach((item: any) => {
            markProductAsUnlocked(item.id, item.slug, data.order.id, data.order.licenseKey);
          });
        }
      }
    } catch (err) {
      console.error("Error loading order:", err);
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [orderId]);

  // Smart Auto-Polling: if payment is pending, check every 2.5s up to 4 times
  useEffect(() => {
    if (!order || order.paymentStatus === "completed") return;

    let pollAttempts = 0;
    const interval = setInterval(() => {
      pollAttempts++;
      if (pollAttempts > 4) {
        clearInterval(interval);
        return;
      }
      fetchOrderData();
    }, 2500);

    return () => clearInterval(interval);
  }, [order?.paymentStatus]);

  const handleCopyLicense = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    });
  };

  const handleDownload = (item: any) => {
    setDownloadingId(item.id);
    const keyParam = order?.licenseKey ? `&key=${encodeURIComponent(order.licenseKey)}` : "";
    const directTarget =
      item.downloadUrl &&
      (item.downloadUrl.includes("canva.com") || item.downloadUrl.includes("capcut.com/template"))
        ? item.downloadUrl
        : `/api/download?orderId=${encodeURIComponent(orderId)}&productId=${encodeURIComponent(item.id)}${keyParam}`;
    const filename = `${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-master`;
    triggerDirectDownload(directTarget, filename);
    setTimeout(() => setDownloadingId(null), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <Clock className="h-7 w-7 animate-pulse" />
        </div>
        <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
          Order Record Syncing
        </h2>
        <p className="mt-2 text-xs text-muted">
          Your order <span className="font-mono font-bold text-foreground">#{orderId}</span> is being processed by the payment gateway and synced to our database.
        </p>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <button
            onClick={fetchOrderData}
            disabled={verifying}
            className="cursor-pointer rounded-full bg-foreground px-6 py-3 text-xs font-bold text-background transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            {verifying ? "Checking Status..." : "Re-check Payment Status"}
          </button>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20BADARSH%20Support,%20checking%20my%20order%20%23${orderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-full border border-card-border bg-card px-6 py-3 text-xs font-semibold text-foreground hover:bg-secondary"
          >
            <MessageCircle className="h-4 w-4 text-emerald-500" />
            <span>WhatsApp Support</span>
          </a>
        </div>
      </div>
    );
  }

  const isCompleted = order?.paymentStatus === "completed";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Top Success Badge & Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border shadow-lg ${
            isCompleted
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
          }`}
        >
          {isCompleted ? <CheckCircle2 className="h-8 w-8" /> : <Clock className="h-8 w-8 animate-spin" />}
        </motion.div>

        <span
          className={`mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
            isCompleted
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
          }`}
        >
          {isCompleted ? (
            <>
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Payment Verified &bull; Instant Access Granted</span>
            </>
          ) : (
            <>
              <Clock className="h-3.5 w-3.5 animate-spin" />
              <span>Payment In Verification with Bank</span>
            </>
          )}
        </span>

        <h1 className="mt-3 apple-display text-3xl font-extrabold text-foreground sm:text-4xl">
          {isCompleted ? "Thank you for your purchase!" : "Confirming Your Payment..."}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Your order ID is <span className="font-mono font-bold text-foreground">#{order?.id}</span>.
          {isCompleted
            ? " A copy of your license key and download links has been dispatched."
            : " We are checking with your payment provider. This page will update automatically."}
        </p>

        {!isCompleted && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={fetchOrderData}
              disabled={verifying}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-xs font-bold text-white shadow hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {verifying ? "Checking Bank Status..." : "Re-check Status Now"}
            </button>
          </div>
        )}
      </div>

      {/* Main Order Card */}
      <div className="mt-10 overflow-hidden rounded-3xl border border-card-border bg-card shadow-xl">
        {/* Order Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-card-border/60 bg-secondary/40 px-6 py-4 text-xs">
          <div>
            <span className="text-muted">Order Date:</span>{" "}
            <span className="font-semibold text-foreground">
              {new Date(order?.createdAt || Date.now()).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div>
            <span className="text-muted">Amount Paid:</span>{" "}
            <span className="font-bold text-foreground">
              {formatCurr(order?.totalAmount || 0)}
            </span>
          </div>

          <div>
            <span className="text-muted">Payment:</span>{" "}
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 uppercase">
              {order?.paymentMethod || "UPI Confirmed"}
            </span>
          </div>
        </div>

        {/* License Key Banner */}
        {order?.licenseKey && (
          <div className="border-b border-card-border/60 bg-accent/5 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                Commercial License Key
              </span>
              <div className="font-mono text-sm font-bold text-foreground tracking-wide mt-0.5">
                {order.licenseKey}
              </div>
            </div>

            <button
              onClick={() => handleCopyLicense(order.licenseKey!)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
            >
              {copiedKey ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-muted" />
                  <span>Copy License</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Purchased Products List */}
        <div className="divide-y divide-card-border/60 p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
            Your Digital Deliverables:
          </h2>

          {order?.items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  {item.productType === "audio" ? (
                    <Music className="h-5 w-5" />
                  ) : item.productType === "ebook" ? (
                    <BookOpen className="h-5 w-5" />
                  ) : item.productType === "photo-preset" ? (
                    <Camera className="h-5 w-5" />
                  ) : item.productType === "app-license" ? (
                    <Smartphone className="h-5 w-5" />
                  ) : (
                    <Package className="h-5 w-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="font-heading text-sm font-bold text-foreground truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Quantity: {item.quantity || 1} &bull; Lifetime License &bull; Free Updates
                  </p>
                </div>
              </div>

              {/* Action Buttons for this item */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                {isCompleted ? (
                  <button
                    onClick={() => handleDownload(item)}
                    disabled={downloadingId === item.id}
                    className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                    <Download className="h-4 w-4" />
                    <span>{downloadingId === item.id ? "Downloading..." : "Download Master Files"}</span>
                  </button>
                ) : (
                  <button
                    onClick={fetchOrderData}
                    disabled={verifying}
                    className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-5 py-2.5 text-xs font-semibold text-amber-500 hover:bg-amber-500/20 transition-all"
                  >
                    <Clock className="h-3.5 w-3.5 animate-spin" />
                    <span>{verifying ? "Checking..." : "Awaiting Bank Confirmation"}</span>
                  </button>
                )}

                {/* Optional secondary link ONLY for authentic Canva templates */}
                {item.templateUrl && item.templateUrl.includes("canva.com/design/") && (
                  <a
                    href={item.templateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background px-4 py-2.5 text-xs font-semibold text-muted hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
                    <span>Open in Canva</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Security & Anti-Piracy Notice */}
        <div className="border-t border-card-border/60 bg-secondary/30 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-muted">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span>Secure Cloudflare R2 CDN Links &bull; Encrypted 4-Hour Access Tokens</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20BADARSH%20Studio,%20I%20just%20completed%20order%20%23${order?.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-semibold text-emerald-500 hover:underline"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 flex items-center justify-between">
        <Link
          href="/templates"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-foreground"
        >
          &larr; Back to Shop
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-card-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print Receipt</span>
        </button>
      </div>
    </div>
  );
}
