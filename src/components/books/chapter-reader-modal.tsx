"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BookOpen,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";

interface ChapterReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onUnlock: (product: Product) => void;
}

export function ChapterReaderModal({
  isOpen,
  onClose,
  product,
  onUnlock,
}: ChapterReaderModalProps) {
  const { formatPrice: formatCurr } = useCurrency();

  if (!isOpen || !product) return null;

  const rawPdfUrl =
    product.previewPdfUrl ||
    product.pdfUrl ||
    product.downloadUrl ||
    (product as any).googleDriveUrl;

  let formattedPdfUrl = rawPdfUrl || "";
  if (formattedPdfUrl) {
    if (formattedPdfUrl.includes("drive.google.com")) {
      formattedPdfUrl = formattedPdfUrl
        .replace(/\/view(\?.*)?$/, "/preview")
        .replace(/\/edit(\?.*)?$/, "/preview");
      if (!formattedPdfUrl.includes("/preview")) {
        formattedPdfUrl = formattedPdfUrl.endsWith("/")
          ? `${formattedPdfUrl}preview`
          : `${formattedPdfUrl}/preview`;
      }
    } else if (
      !formattedPdfUrl.includes("blob:") &&
      !formattedPdfUrl.startsWith("data:") &&
      (formattedPdfUrl.startsWith("http://") || formattedPdfUrl.startsWith("https://"))
    ) {
      formattedPdfUrl = `/api/pdf-proxy?url=${encodeURIComponent(formattedPdfUrl)}`;
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          className="relative flex h-[96vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-800 bg-neutral-950 text-white shadow-2xl"
        >
          {/* Top Reading Navigation Bar */}
          <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3 sm:px-6 sm:py-3.5 bg-neutral-900">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 font-bold">
                <BookOpen className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    Live Sample
                  </span>
                  <span className="text-[11px] text-neutral-400 hidden sm:inline">
                    &bull; Mobile-Optimized Reader
                  </span>
                </div>
                <h2 className="font-heading text-xs sm:text-sm font-bold truncate">
                  {product.title}
                </h2>
              </div>
            </div>

            {/* Reading Action Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Unlock / Buy Button */}
              {product.price > 0 ? (
                <button
                  onClick={() => onUnlock(product)}
                  className="flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-md transition-transform hover:scale-102 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Unlock ({formatCurr(product.price)})</span>
                </button>
              ) : (
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                  Free
                </span>
              )}

              {/* Open in New Window */}
              {formattedPdfUrl && (
                <a
                  href={formattedPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
                  title="Open PDF in new window"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              {/* Close */}
              <button
                onClick={onClose}
                className="rounded-full p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-opacity cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Reader Body: Direct Streaming PDF Viewer */}
          <div className="relative flex-1 bg-neutral-950 overflow-hidden select-none">
            {formattedPdfUrl ? (
              <object
                data={formattedPdfUrl}
                type="application/pdf"
                className="w-full h-full"
              >
                <iframe
                  src={formattedPdfUrl}
                  title={`PDF Preview of ${product.title}`}
                  className="w-full h-full border-0"
                />
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-xs text-neutral-400 space-y-3">
                  <BookOpen className="h-8 w-8 text-indigo-400 opacity-60" />
                  <p>Preview ready. Tap below to open reader:</p>
                  <a
                    href={formattedPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors"
                  >
                    Open PDF Reader ↗
                  </a>
                </div>
              </object>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-xs text-neutral-400 space-y-2">
                <BookOpen className="h-8 w-8 text-neutral-600" />
                <p>No preview document attached yet for this title.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
