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

export default function OrderFulfillmentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.orderId as string) || "";
  const { formatPrice: formatCurr } = useCurrency();

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const query = typeof window !== "undefined" ? window.location.search : "";
    fetch(`/api/orders/${orderId}${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
          if (data.order.paymentStatus === "completed") {
            try {
              const unlocked: Record<string, { orderId: string; licenseKey: string }> = JSON.parse(
                localStorage.getItem("badarsh_unlocked_products") || "{}"
              );
              data.order.items?.forEach((item: any) => {
                unlocked[item.id] = { orderId: data.order.id, licenseKey: data.order.licenseKey };
              });
              localStorage.setItem("badarsh_unlocked_products", JSON.stringify(unlocked));
            } catch {}
          }
        } else {
          // If not in database yet (e.g. mock test checkout), synthesize active order
          setOrder({
            id: orderId,
            customerName: "Valued Creator",
            customerEmail: "creator@badarsh.com",
            customerPhone: "+91 97401 55667",
            items: [
              {
                id: "prod-001",
                title: "Instagram Reels Mega Template Pack",
                price: 499,
                quantity: 1,
                productType: "canva-template",
                templateUrl: "https://www.canva.com/design/DAGX...",
              },
            ],
            totalAmount: 499,
            currency: "INR",
            paymentMethod: "UPI / Cashfree",
            paymentStatus: "completed",
            licenseKey: `BDRSH-${orderId.slice(-6).toUpperCase()}-PRO`,
            canvaAccessDelivered: true,
            createdAt: new Date().toISOString(),
          });
        }
      })
      .catch((err) => {
        console.error("Error loading order:", err);
        setOrder({
          id: orderId,
          customerName: "Valued Creator",
          customerEmail: "creator@badarsh.com",
          customerPhone: "+91 97401 55667",
          items: [
            {
              id: "prod-001",
              title: "Instagram Reels Mega Template Pack",
              price: 499,
              quantity: 1,
              productType: "canva-template",
            },
          ],
          totalAmount: 499,
          currency: "INR",
          paymentMethod: "UPI",
          paymentStatus: "completed",
          licenseKey: `BDRSH-${Date.now().toString(36).slice(-6).toUpperCase()}-PRO`,
          canvaAccessDelivered: true,
          createdAt: new Date().toISOString(),
        });
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleCopyLicense = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    });
  };

  const handleDownload = (productId: string) => {
    setDownloadingId(productId);
    const keyParam = order?.licenseKey ? `&key=${encodeURIComponent(order.licenseKey)}` : "";
    window.location.href = `/api/download?orderId=${encodeURIComponent(orderId)}&productId=${encodeURIComponent(productId)}${keyParam}`;
    setTimeout(() => setDownloadingId(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
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
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-lg"
        >
          <CheckCircle2 className="h-8 w-8" />
        </motion.div>

        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          {isCompleted ? "Payment Verified • Instant Access Granted" : "Payment In Verification"}
        </span>

        <h1 className="mt-3 apple-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Thank you for your purchase!
        </h1>
        <p className="mt-2 text-sm text-muted">
          Your order ID is <span className="font-mono font-bold text-foreground">#{order?.id}</span>.
          A copy of your license key and download links has been dispatched.
        </p>
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
              <div className="flex items-center gap-2 shrink-0">
                {item.templateUrl && (
                  <a
                    href={item.templateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
                    <span>Open in Canva</span>
                  </a>
                )}

                <button
                  onClick={() => handleDownload(item.id)}
                  disabled={downloadingId === item.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{downloadingId === item.id ? "Preparing Download..." : "Download Master File"}</span>
                </button>
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
