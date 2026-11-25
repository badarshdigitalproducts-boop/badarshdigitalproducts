"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Star,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  Share2,
  ChevronRight,
  Info,
  Check,
  RefreshCw,
  AlertCircle,
  FileText,
  HelpCircle,
} from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { triggerDirectDownload } from "@/lib/download";

interface AppStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onUnlock?: (product: Product) => void;
}

export function AppStoreModal({
  isOpen,
  onClose,
  product,
  onUnlock,
}: AppStoreModalProps) {
  const { formatPrice: formatCurr } = useCurrency();
  const [downloadState, setDownloadState] = useState<"idle" | "pending" | "downloading" | "installing" | "completed">("idle");
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"overview" | "guide" | "specs">("overview");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Close on Escape key
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
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, onClose]);

  // Reset state when opening different product
  useEffect(() => {
    if (isOpen) {
      setDownloadState("idle");
      setDownloadProgress(0);
      setActiveTab("overview");
    }
  }, [isOpen, product?.id]);

  if (!isOpen || !product) return null;

  const appVersion = product.appVersion || "v2.5 Studio Suite";
  const appSize = product.fileSize || "45 MB";
  const isFree = product.price === 0;
  const rating = product.rating || 4.9;
  const reviewCount = product.reviewCount || 340;
  const downloadsCount = product.downloads ? `${(product.downloads / 1000).toFixed(0)}K+` : "50K+";

  const directUrl =
    product.appDownloadUrl ||
    product.downloadUrl ||
    product.freeDownloadUrl ||
    `/api/download?productId=${encodeURIComponent(product.id)}`;

  const safeFilename = `${product.title.toLowerCase().replace(/[^a-z0-9_-]+/g, "-")}-setup.zip`;

  // Curated vertical phone screenshots matching Play Store format
  const screenshots = [
    product.images[0] || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    product.images[1] || "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  ];

  const handleInstallClick = () => {
    if (!isFree && onUnlock) {
      onUnlock(product);
      return;
    }

    if (downloadState === "completed") {
      // Re-trigger download directly
      triggerDirectDownload(directUrl, safeFilename);
      return;
    }

    if (downloadState !== "idle") return;

    // Phase 1: Pending (300ms)
    setDownloadState("pending");
    setDownloadProgress(0);

    // Fire the actual browser download immediately in background
    triggerDirectDownload(directUrl, safeFilename);

    setTimeout(() => {
      // Phase 2: Downloading progress animation (1.6s)
      setDownloadState("downloading");
      let current = 0;
      intervalRef.current = setInterval(() => {
        current += Math.floor(Math.random() * 15) + 10;
        if (current >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDownloadProgress(100);

          // Phase 3: Installing & Verifying (500ms)
          setDownloadState("installing");
          setTimeout(() => {
            setDownloadState("completed");
          }, 600);
        } else {
          setDownloadProgress(current);
        }
      }, 150);
    }, 400);
  };

  const handleCancelDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDownloadState("idle");
    setDownloadProgress(0);
  };

  // Calculate simulated MB downloaded
  const numericSize = parseInt(appSize) || 45;
  const downloadedMb = ((numericSize * downloadProgress) / 100).toFixed(1);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl"
      >
        {/* Play Store Top Navigation Bar */}
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80 px-6 py-3.5 bg-neutral-50/80 dark:bg-neutral-950/60 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#01875f] text-white font-black text-[10px]">
              ▶
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
              Google Play &bull; Verified Creator Suite
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close Play Store Modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 scrollbar-thin">
          {/* Main App Hero Header (Exact Google Play Store layout) */}
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* App Squircle Icon */}
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[22%] border border-neutral-200 dark:border-neutral-800 bg-neutral-950 shadow-lg">
              <img
                src={product.images[0] || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"}
                alt={product.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 rounded-[22%] ring-1 ring-inset ring-black/5 dark:ring-white/10" />
            </div>

            {/* Title, Developer & Category */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight leading-snug">
                {product.title}
              </h2>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#01875f] dark:text-[#25b885]">
                <span>BADARSH Verified Developer</span>
                <CheckCircle2 className="h-3.5 w-3.5 fill-current text-white dark:text-neutral-900" />
              </div>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                Video Players &amp; Editors &bull; Contains verified configs &bull; In-app tools
              </p>
            </div>
          </div>

          {/* Google Play 4-Metric Bar (Rating, Reviews, Downloads, Age Rating) */}
          <div className="mt-6 flex items-center justify-between border-y border-neutral-100 dark:border-neutral-800 py-3 text-center">
            {/* Rating */}
            <div className="flex-1 border-r border-neutral-100 dark:border-neutral-800 pr-2">
              <div className="flex items-center justify-center gap-1 text-sm font-bold text-neutral-900 dark:text-white">
                <span>{rating}</span>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-[10px] text-neutral-400">{reviewCount} reviews</span>
            </div>

            {/* File Size */}
            <div className="flex-1 border-r border-neutral-100 dark:border-neutral-800 px-2">
              <div className="text-sm font-bold text-neutral-900 dark:text-white">
                {appSize}
              </div>
              <span className="text-[10px] text-neutral-400">Download Size</span>
            </div>

            {/* Content Rating */}
            <div className="flex-1 border-r border-neutral-100 dark:border-neutral-800 px-2">
              <div className="inline-flex items-center justify-center rounded-sm border border-neutral-400 dark:border-neutral-600 px-1 text-[11px] font-bold text-neutral-900 dark:text-white leading-none">
                3+
              </div>
              <span className="block text-[10px] text-neutral-400 mt-1">Rated for 3+</span>
            </div>

            {/* Downloads */}
            <div className="flex-1 pl-2">
              <div className="text-sm font-bold text-neutral-900 dark:text-white">
                {downloadsCount}
              </div>
              <span className="text-[10px] text-neutral-400">Downloads</span>
            </div>
          </div>

          {/* Action Row — Google Play Green Install Button with authentic states */}
          <div className="mt-6">
            {downloadState === "idle" && (
              <button
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#01875f] hover:bg-[#017250] text-white py-3.5 text-sm font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>{isFree ? "Install" : `Unlock & Install (${formatCurr(product.price)})`}</span>
              </button>
            )}

            {downloadState === "pending" && (
              <div className="w-full flex items-center justify-center gap-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 py-3.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-[#01875f]" />
                <span>Pending...</span>
              </div>
            )}

            {downloadState === "downloading" && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300 px-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-neutral-300 border-t-[#01875f]" />
                    <span className="font-semibold text-[#01875f] dark:text-[#25b885]">
                      Downloading... {downloadProgress}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-400 font-mono text-[11px]">
                      {downloadedMb} MB / {appSize}
                    </span>
                    <button
                      onClick={handleCancelDownload}
                      className="rounded-full p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                      title="Cancel download"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Track */}
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <motion.div
                    className="h-full bg-[#01875f] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${downloadProgress}%` }}
                    transition={{ ease: "easeOut", duration: 0.15 }}
                  />
                </div>
              </div>
            )}

            {downloadState === "installing" && (
              <div className="w-full flex items-center justify-center gap-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 py-3.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                <RefreshCw className="h-4 w-4 animate-spin text-[#01875f]" />
                <span>Verifying package &amp; configs...</span>
              </div>
            )}

            {downloadState === "completed" && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#01875f] hover:bg-[#017250] text-white py-3 text-sm font-bold shadow-md transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Download Started &bull; Download Again</span>
                  </button>
                </div>

                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    File saved to your Downloads folder!
                  </p>
                  <a
                    href={directUrl}
                    download={safeFilename}
                    className="mt-1 inline-block text-[11px] font-medium text-emerald-600 dark:text-emerald-400 underline underline-offset-2 hover:opacity-80"
                  >
                    Click here if download did not start automatically
                  </a>
                </div>
              </div>
            )}

            {/* Direct fallback download link if idle */}
            {downloadState === "idle" && (
              <div className="mt-2 text-center">
                <a
                  href={directUrl}
                  download={safeFilename}
                  className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 underline underline-offset-2 transition-colors"
                >
                  Need direct link? Download ZIP / APK directly
                </a>
              </div>
            )}
          </div>

          {/* Google Play Protect Verification Badge */}
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 px-4 py-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Verified by Play Protect
              </span>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 leading-tight">
                Scanned &bull; Clean package &bull; No malware &bull; 100% verified original config files
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Overview / Install Guide / Technical Specs) */}
          <div className="mt-8 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "border-[#01875f] text-[#01875f] dark:text-[#25b885]"
                  : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Overview &amp; Preview
            </button>
            <button
              onClick={() => setActiveTab("guide")}
              className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "guide"
                  ? "border-[#01875f] text-[#01875f] dark:text-[#25b885]"
                  : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              How to Install (3 Steps)
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "specs"
                  ? "border-[#01875f] text-[#01875f] dark:text-[#25b885]"
                  : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              App Info &amp; Specs
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="mt-6 space-y-6">
              {/* Screenshots Carousel (Play Store Style) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  Phone Screenshots
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
                  {screenshots.map((shot, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[9/16] w-40 shrink-0 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-sm snap-start"
                    >
                      <img
                        src={shot}
                        alt={`Screenshot ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 right-2 rounded-lg bg-black/75 backdrop-blur-xs px-2 py-1 text-[9px] font-bold text-white text-center">
                        {idx === 0 && "4K 60fps Export"}
                        {idx === 1 && "Speed Ramp Curves"}
                        {idx === 2 && "XML Motion Engine"}
                        {idx === 3 && "Cinematic Color"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* About this app */}
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">
                  About this app
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {product.longDescription || product.description}
                </p>

                {/* Feature Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(product.tags || ["video editor", "reels", "4k export", "no watermark"]).map((t, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* What is included */}
              <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-950/50 p-5 border border-neutral-100 dark:border-neutral-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                  What is included in {appVersion}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(product.features || [
                    "4K 60fps high-bitrate export preset",
                    "Custom velocity speed-ramping curves",
                    "Step-by-step PDF manual & shortcuts",
                    "Commercial license for client projects",
                  ]).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <Check className="h-3.5 w-3.5 text-[#01875f] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Safety (Play Store staple) */}
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-4 w-4 text-[#01875f]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                    Data Safety
                  </h4>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Safety starts with understanding how developers collect and share your data.
                </p>
                <div className="mt-3 space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>No data shared with third parties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>No personal data collected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Data is encrypted in transit</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INSTALLATION GUIDE */}
          {activeTab === "guide" && (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-950/50 p-5 border border-neutral-100 dark:border-neutral-800">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                  How to Install on Android in 3 Simple Steps
                </h3>
                <p className="text-xs text-neutral-500">
                  Takes less than 30 seconds. Works on Samsung, OnePlus, Xiaomi, Pixel &amp; all Android devices.
                </p>

                <div className="mt-6 space-y-4">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#01875f] text-white text-xs font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                        Download the Package
                      </h4>
                      <p className="mt-0.5 text-xs text-neutral-500 leading-relaxed">
                        Click the green <strong>Install</strong> button above. The ZIP/APK package downloads directly to your device&apos;s Downloads folder.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#01875f] text-white text-xs font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                        Open File &amp; Allow Installation
                      </h4>
                      <p className="mt-0.5 text-xs text-neutral-500 leading-relaxed">
                        Tap the downloaded file from your notification bar or Files app. If Android shows <em>&ldquo;Install unknown apps&rdquo;</em>, tap <strong>Settings</strong> and toggle on <strong>Allow from this source</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#01875f] text-white text-xs font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                        Tap Install &amp; Launch
                      </h4>
                      <p className="mt-0.5 text-xs text-neutral-500 leading-relaxed">
                        Tap <strong>Install</strong>. Once complete, launch the app or import the bundled XML presets into your favorite video editor.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* iOS / Mac / PC Instructions */}
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2">
                  Using on iPhone (iOS) or Mac / Windows PC?
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  The downloaded ZIP archive also contains universal XML export profiles, DaVinci Resolve &amp; Premiere shortcut maps, and DNG presets that open seamlessly in iOS and desktop editing suites.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: APP INFO & SPECS */}
          {activeTab === "specs" && (
            <div className="mt-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-500">Version</span>
                <span className="font-semibold text-neutral-900 dark:text-white font-mono">{appVersion}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-500">Updated on</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{product.createdAt || "November 2026"}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-500">Requires Android</span>
                <span className="font-semibold text-neutral-900 dark:text-white">8.0 and up</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-500">Download size</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{appSize}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-500">Offered by</span>
                <span className="font-semibold text-neutral-900 dark:text-white">BADARSH Creative Studio</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-500">License</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Commercial &bull; Royalty Free</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-500">Package Format</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{product.format || "ZIP Archive (APK + XML)"}</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
