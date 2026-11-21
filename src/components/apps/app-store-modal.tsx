"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Smartphone,
  Download,
  Star,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  Share2,
  ChevronRight,
  Info,
} from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";

interface AppStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onUnlock: (product: Product) => void;
}

export function AppStoreModal({
  isOpen,
  onClose,
  product,
  onUnlock,
}: AppStoreModalProps) {
  const { formatPrice: formatCurr } = useCurrency();
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [downloadComplete, setDownloadComplete] = useState<boolean>(false);

  if (!isOpen || !product) return null;

  const appVersion = product.appVersion || "v12.4.0 Pro VIP Edition";
  const appSize = product.fileSize || "84.5 MB";
  const isFree = product.price === 0;

  // Curated vertical mobile screenshots
  const screenshots = [
    product.images[0] || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  ];

  const unlockedFeatures = [
    "4K 60fps High-Bitrate Export Unlocked (Zero Lag)",
    "All VIP Transitions, Auto-Captions & 3D Zooms Active",
    "No Watermark on Final Video Output",
    "Commercial License for Client Work & Sponsored Reels",
    "VirusTotal MD5 Verified: 0 / 72 Detections (100% Safe)",
  ];

  const handleInstallClick = () => {
    if (!isFree) {
      onUnlock(product);
      return;
    }

    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadComplete(true);
          // Trigger actual file download
          const directUrl = product.appDownloadUrl || product.downloadUrl || "https://www.capcut.com/";
          window.open(directUrl, "_blank");
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative flex h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl"
      >
        {/* App Store Top Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
              VERIFIED CREATOR BUILD
            </span>
            <span className="text-xs text-neutral-400">• Play Store Verified Safe</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* Main App Hero Header */}
          <div className="flex flex-col sm:flex-row items-start gap-6 pb-8 border-b border-neutral-200 dark:border-neutral-800">
            {/* App Squircle Icon */}
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[24%] border border-neutral-200 dark:border-neutral-800 bg-neutral-950 shadow-xl">
              <img
                src={product.images[0]}
                alt={product.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 rounded-[24%] ring-1 ring-inset ring-white/10" />
            </div>

            {/* Title, Developer & Rating Stats */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                {product.title}
              </h1>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                BADARSH Verified Developer Systems
              </p>

              {/* Play Store Rating & Stats Bar */}
              <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-neutral-900 dark:text-white text-sm">4.9</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px]">({product.reviewCount}k reviews)</span>
                </div>
                <div className="h-4 w-[1px] bg-neutral-200 dark:border-neutral-800" />
                <div className="flex items-center gap-1">
                  <Download className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="font-bold text-neutral-900 dark:text-white">50K+</span>
                  <span className="text-[10px]">Installs</span>
                </div>
                <div className="h-4 w-[1px] bg-neutral-200 dark:border-neutral-800" />
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    VirusTotal Clean
                  </span>
                </div>
                <div className="h-4 w-[1px] bg-neutral-200 dark:border-neutral-800" />
                <span className="text-[10px] font-mono text-neutral-400">{appSize}</span>
              </div>
            </div>

            {/* Install / Download CTA Button */}
            <div className="w-full sm:w-auto shrink-0">
              <button
                onClick={handleInstallClick}
                disabled={downloadProgress !== null && downloadProgress < 100}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-8 py-3.5 text-sm font-bold shadow-xl hover:scale-102 active:scale-98 transition-transform disabled:opacity-75"
              >
                {downloadProgress !== null && downloadProgress < 100 ? (
                  <>
                    <span className="animate-spin text-xs">⏳</span>
                    <span>Installing... {downloadProgress}%</span>
                  </>
                ) : downloadComplete ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Download Ready</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>{isFree ? "Install Direct APK" : `Unlock App (${formatCurr(product.price)})`}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Vertical Mobile Screenshots Slider (Play Store Style) */}
          <div className="mt-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
              Interface Screenshots (High-Retention Editing Flow)
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
              {screenshots.map((shot, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[9/16] w-48 shrink-0 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-md"
                >
                  <img
                    src={shot}
                    alt={`Screenshot ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 left-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[8px] font-bold text-white">
                    SCREEN #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unlocked Features & Changelog */}
          <div className="mt-8 rounded-2xl bg-neutral-50 dark:bg-neutral-950/50 p-6 border border-neutral-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">
              VIP Unlocked Capabilities in {appVersion}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {unlockedFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3-Step Guided Installation Walkthrough */}
          <div className="mt-8">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">
              How to Install &amp; Activate in 30 Seconds
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white text-[11px] font-bold mb-2">
                  1
                </span>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Download APK</h4>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Direct high-speed download hosted on our verified Google Cloud mirrors.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white text-[11px] font-bold mb-2">
                  2
                </span>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Allow Install</h4>
                <p className="mt-1 text-[11px] text-neutral-500">
                  On Android, tap &ldquo;Allow from this source&rdquo; when prompted by your browser.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white text-[11px] font-bold mb-2">
                  3
                </span>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Launch &amp; Create</h4>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Open the app, all VIP transitions and 4K 60fps export are pre-unlocked automatically!
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
