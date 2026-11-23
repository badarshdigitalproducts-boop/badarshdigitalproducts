"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Download,
  Lock,
  Maximize2,
  Minimize2,
  BookOpen,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Share2,
  ExternalLink,
} from "lucide-react";
import { useCurrency } from "@/context/currency-context";
import { CheckoutModal } from "@/components/products/checkout-modal";
import type { Product } from "@/types/product";

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl: string;
  previewPdfUrl?: string;
  price: number;
  isFree?: boolean;
  authorOrCategory?: string;
  isCopyProtected?: boolean;
  slug?: string;
  product?: Product;
}

export function PdfViewerModal({
  isOpen,
  onClose,
  title,
  pdfUrl,
  previewPdfUrl,
  price,
  isFree = false,
  authorOrCategory,
  isCopyProtected = true,
  slug,
  product,
}: PdfViewerModalProps) {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [downloadLockedNotice, setDownloadLockedNotice] = useState<boolean>(false);
  const { formatPrice } = useCurrency();

  // If a full product object wasn't passed, synthesize one for the checkout modal
  const productData: Product = product || {
    id: slug || `book-${Date.now()}`,
    slug: slug || "book-preview",
    title,
    description: `Full Digital License & Uncompressed Master PDF for "${title}". Instant offline download, commercial usage rights, and lifetime updates.`,
    longDescription: "",
    price,
    currency: "INR",
    category: "ebooks",
    tags: ["ebook", "pdf", "master-edition"],
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"],
    features: [
      "Full uncompressed master PDF",
      "Instant offline download & print rights",
      "Compatible with Kindle, Apple Books, and reMarkable",
      "Lifetime updates and verified license key",
    ],
    rating: 5,
    reviewCount: 48,
    downloads: 850,
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    format: "Digital Master PDF",
    downloadUrl: pdfUrl,
    pdfUrl: pdfUrl,
    createdAt: "2026-01-01",
  };

  // Keyboard shortcut blockers (Ctrl+S, Ctrl+P, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (checkoutOpen) {
          setCheckoutOpen(false);
        } else {
          onClose();
        }
      }
      // Intercept Save & Print shortcuts to enforce offline download locking
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "p")) {
        if (!isFree && price > 0) {
          e.preventDefault();
          setDownloadLockedNotice(true);
          setTimeout(() => setDownloadLockedNotice(false), 3500);
        }
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, isFree, price, checkoutOpen]);

  if (!isOpen) return null;

  // Decide source URL: use previewPdfUrl if available, else pdfUrl
  const rawUrl = previewPdfUrl || pdfUrl;
  let viewerSrc = rawUrl || "";

  if (rawUrl) {
    if (rawUrl.includes("drive.google.com")) {
      viewerSrc = rawUrl.replace(/\/view(\?.*)?$/, "/preview").replace(/\/edit(\?.*)?$/, "/preview");
      if (!viewerSrc.includes("/preview")) {
        viewerSrc = viewerSrc.endsWith("/") ? `${viewerSrc}preview` : `${viewerSrc}/preview`;
      }
    } else if (
      !rawUrl.includes("blob:") &&
      !rawUrl.startsWith("data:") &&
      (rawUrl.startsWith("http://") || rawUrl.startsWith("https://"))
    ) {
      // Stream through same-origin PDF proxy to bypass X-Frame-Options: deny and CSP blocks
      viewerSrc = `/api/pdf-proxy?url=${encodeURIComponent(rawUrl)}`;
    }
  }

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFree || price === 0) {
      // Free download direct trigger
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-master.pdf`;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Paid download: open checkout modal
      setCheckoutOpen(true);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
        onContextMenu={isCopyProtected ? (e) => e.preventDefault() : undefined}
      >
        <div
          className={`relative flex flex-col rounded-2xl sm:rounded-3xl border border-card-border/80 bg-card shadow-2xl transition-all duration-300 overflow-hidden ${
            isFullscreen
              ? "h-full w-full rounded-none sm:rounded-none"
              : "h-[92vh] w-full max-w-5xl"
          }`}
        >
          {/* ── Top Header Bar ── */}
          <div className="flex items-center justify-between border-b border-card-border px-4 py-3 sm:px-6 sm:py-3.5 bg-background select-none">
            {/* Title & Author */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-heading text-sm sm:text-base font-bold text-foreground">
                    {title}
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Reader Active
                  </span>
                </div>
                {authorOrCategory && (
                  <p className="truncate text-[11px] text-muted">
                    {authorOrCategory} &bull; Reading Sample &bull; In-Browser Viewer
                  </p>
                )}
              </div>
            </div>

            {/* Top Right Action Dock */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Copy Protection Pill */}
              {isCopyProtected && !isFree && price > 0 && (
                <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-card-border bg-secondary/70 px-3 py-1 text-[11px] font-medium text-muted">
                  <Lock className="h-3 w-3 text-amber-500" />
                  <span>Offline Download Locked</span>
                </div>
              )}

              {/* Download / Unlock Button */}
              {isFree || price === 0 ? (
                <button
                  onClick={handleDownloadClick}
                  className="flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Free Download</span>
                </button>
              ) : (
                <button
                  onClick={handleDownloadClick}
                  className="flex items-center gap-1.5 rounded-full bg-accent hover:bg-accent-hover px-4 py-1.5 text-xs font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer"
                  title="Unlock offline PDF download and print rights"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Unlock Offline PDF ({formatPrice(price)})</span>
                </button>
              )}

              {/* Open in New Window */}
              <a
                href={viewerSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex rounded-full p-2 text-muted hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                title="Open PDF in new window"
              >
                <ExternalLink className="h-4 w-4" />
              </a>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hidden sm:flex rounded-full p-2 text-muted hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                aria-label="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="rounded-full p-2 text-muted hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close Viewer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ── Intercept Notification Toast when user tries Ctrl+S / Ctrl+P ── */}
          {downloadLockedNotice && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full border border-amber-500/40 bg-neutral-900/95 px-4 py-2 text-xs font-bold text-amber-400 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
              <Lock className="h-4 w-4 text-amber-400" />
              <span>Offline saving locked in preview mode. Click &ldquo;Unlock Offline PDF&rdquo; to download the master file.</span>
            </div>
          )}

          {/* ── Main Iframe Stage with Protection Overlay ── */}
          <div
            className={`relative flex-1 bg-neutral-900/95 overflow-hidden ${
              isCopyProtected ? "select-none" : ""
            }`}
            style={isCopyProtected ? { userSelect: "none", WebkitUserSelect: "none" } : {}}
          >
            {/* Subtle Diagonal Watermark Pattern */}
            {isCopyProtected && !isFree && price > 0 && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-[0.03] rotate-[-25deg]">
                <span className="text-4xl sm:text-6xl font-black uppercase tracking-[0.3em] text-foreground">
                  BADARSH LICENSED PREVIEW
                </span>
              </div>
            )}

            {/* Embedded Native PDF Viewer */}
            <object
              data={viewerSrc}
              type="application/pdf"
              className="h-full w-full"
            >
              <iframe
                src={viewerSrc}
                className="h-full w-full border-none"
                title={title}
              />
              <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-xs text-muted space-y-3">
                <BookOpen className="h-8 w-8 text-accent opacity-60" />
                <p className="max-w-md">
                  Preview loaded. If your browser does not render PDFs inline, click below to read:
                </p>
                <a
                  href={viewerSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-accent px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-accent-hover transition-colors"
                >
                  Open in Fullscreen PDF Reader ↗
                </a>
              </div>
            </object>
          </div>

          {/* ── Bottom Persistent Conversion & Security Banner ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-card-border px-4 py-2.5 sm:px-6 bg-card gap-2 text-xs select-none">
            <div className="flex items-center gap-2 text-muted text-[11px] truncate">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">
                {isFree
                  ? "100% Free Educational Resource &bull; Public Community Edition"
                  : "Previewing In-Browser Edition &bull; Offline Master PDF available upon purchase"}
              </span>
            </div>

            {!isFree && price > 0 && (
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-[11px] text-muted hidden md:inline">
                  Want to save to Kindle or iPad?
                </span>
                <button
                  onClick={handleDownloadClick}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1 text-[11px] font-semibold text-background hover:opacity-90 active:scale-95 transition-all shadow-xs"
                >
                  <Lock className="h-3 w-3" />
                  <span>Download Master File &bull; {formatPrice(price)}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Embedded 1-Click Checkout Modal for Direct PDF Purchase ── */}
      <CheckoutModal
        product={productData}
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}
