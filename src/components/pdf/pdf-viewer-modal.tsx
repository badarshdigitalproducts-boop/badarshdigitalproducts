"use client";

import React, { useState, useEffect } from "react";
import { X, Download, ShieldAlert, Maximize2, Minimize2, Lock, ArrowUpRight, BookOpen } from "lucide-react";
import { useCurrency } from "@/context/currency-context";
import Link from "next/link";

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
}: PdfViewerModalProps) {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const { formatPrice } = useCurrency();

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Decide source URL: use previewPdfUrl if available, else pdfUrl
  const rawUrl = previewPdfUrl || pdfUrl;
  let viewerSrc = rawUrl;

  // If it's a google drive link, format as preview
  if (rawUrl.includes("drive.google.com")) {
    viewerSrc = rawUrl.replace(/\/view(\?.*)?$/, "/preview").replace(/\/edit(\?.*)?$/, "/preview");
    if (!viewerSrc.includes("/preview")) {
      viewerSrc = viewerSrc.endsWith("/") ? `${viewerSrc}preview` : `${viewerSrc}/preview`;
    }
  } else if (!rawUrl.endsWith(".pdf") && !rawUrl.includes("blob:") && !rawUrl.includes("google")) {
    // Wrap through Google Docs Viewer for cross-origin PDF viewing
    viewerSrc = `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}&embedded=true`;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onContextMenu={isCopyProtected ? (e) => e.preventDefault() : undefined}
    >
      <div
        className={`relative flex flex-col rounded-2xl sm:rounded-3xl border border-card-border/80 bg-card shadow-2xl transition-all duration-300 overflow-hidden ${
          isFullscreen
            ? "h-full w-full rounded-none sm:rounded-none"
            : "h-[92vh] w-full max-w-5xl"
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-card-border px-4 py-3 sm:px-6 sm:py-4 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-heading text-sm sm:text-base font-bold text-foreground">
                {title}
              </h3>
              {authorOrCategory && (
                <p className="truncate text-[11px] text-muted">
                  {authorOrCategory} &bull; In-Browser Interactive Reader
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Security Pill */}
            {isCopyProtected && (
              <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2.5 py-1 text-[10px] font-semibold text-muted">
                <Lock className="h-3 w-3 text-emerald-500" />
                Protected Preview
              </span>
            )}

            {/* Free Download or Buy Action */}
            {isFree || price === 0 ? (
              <a
                href={pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all active:scale-95"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Free Download</span>
                <span className="sm:hidden">Download</span>
              </a>
            ) : (
              <Link
                href={slug ? `/templates/${slug}` : "/ebooks"}
                className="flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background hover:opacity-90 shadow-sm transition-all active:scale-95"
              >
                <span>Unlock Full PDF ({formatPrice(price)})</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden sm:flex rounded-full p-2 text-muted hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="rounded-full p-2 text-muted hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Close Viewer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Frame Area with Protected Watermark */}
        <div
          className={`relative flex-1 bg-neutral-900/95 overflow-hidden ${
            isCopyProtected ? "select-none" : ""
          }`}
          style={isCopyProtected ? { userSelect: "none", WebkitUserSelect: "none" } : {}}
        >
          {/* Protected Watermark (Subtle diagonal security overlay) */}
          {isCopyProtected && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-[0.035] rotate-[-25deg]">
              <span className="text-4xl sm:text-6xl font-black uppercase tracking-[0.3em] text-foreground">
                BADARSH LICENSED PREVIEW
              </span>
            </div>
          )}

          {/* Iframe Reader */}
          <iframe
            src={viewerSrc}
            className="h-full w-full border-none"
            title={title}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>

        {/* Footer Bar */}
        <div className="flex items-center justify-between border-t border-card-border px-4 py-2.5 sm:px-6 bg-card text-[11px] text-muted">
          <span className="truncate">
            BADARSH Publishing &bull; {isFree ? "Free Community Resource" : "Licensed Creator Asset"}
          </span>
          <div className="flex items-center gap-3">
            <span>Clean In-Browser PDF</span>
          </div>
        </div>
      </div>
    </div>
  );
}
