"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Star,
  Eye,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  Share2,
  ChevronRight,
  Tablet,
  Check,
  Clock,
  FileText,
} from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { ChapterReaderModal } from "@/components/books/chapter-reader-modal";
import { CheckoutModal } from "@/components/products/checkout-modal";
import { PdfViewerModal } from "@/components/pdf/pdf-viewer-modal";
import { triggerDirectDownload } from "@/lib/download";
import { useProductAccess } from "@/hooks/use-product-access";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SmartImage } from "@/components/shared/smart-image";

interface BookDetailViewProps {
  product: Product;
}

export function BookDetailView({ product }: BookDetailViewProps) {
  const { formatPrice: formatCurr } = useCurrency();
  const { isUnlocked, handleDownload } = useProductAccess(product);
  const [chapterReaderOpen, setChapterReaderOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const isFree = product.price === 0;
  const pageCount = product.pageCount ? `${product.pageCount} Pages` : product.specs?.count || "240+ Pages";
  const coverImg = product.images[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    setRotateX(-(mouseY / (rect.height / 2)) * 12);
    setRotateY((mouseX / (rect.width / 2)) * 14);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const takeaways = [
    "Core operating principles applied by top founders and high-output creators.",
    "Eliminates decision fatigue with step-by-step systems and actionable checklists.",
    "Formulated to yield compound results within 30 to 90 days of execution.",
    "Includes worksheets, templates, and frameworks ready for immediate implementation.",
  ];

  const toc = [
    { title: "Chapter 1: The Core Mental Model & Foundations", pages: "1–18", free: true },
    { title: "Chapter 2: The Compounding Feedback Loop", pages: "19–42", free: true },
    { title: "Chapter 3: Systems Architecture & Execution Playbook", pages: "43–88", free: false },
    { title: "Chapter 4: Advanced Case Studies & Scaling Strategies", pages: "89–160", free: false },
    { title: "Chapter 5: Full Worksheets, Cheat Sheets & Checklists", pages: "161–240", free: false },
  ];

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-14">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: "E-Books", href: "/ebooks" },
            { label: product.title, href: `/ebooks/${product.slug}` },
          ]}
        />

        {/* Hero Product Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: 3D Book Presentation */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              style={{ perspective: 1000 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[320px] py-4"
            >
              <motion.div
                animate={{ rotateX, rotateY }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative aspect-[3/4.2] w-full rounded-r-2xl rounded-l-xs overflow-hidden shadow-2xl shadow-black/50 bg-neutral-950 cursor-pointer"
                onClick={() => setChapterReaderOpen(true)}
              >
                {/* Book Spine Crease & Shading */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-6 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
                <div className="pointer-events-none absolute left-5 top-0 bottom-0 z-20 w-[1px] bg-white/30" />
                <div className="pointer-events-none absolute left-6 top-0 bottom-0 z-20 w-[1px] bg-black/50" />

                {/* Right Edge Paper Stack */}
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-2 bg-gradient-to-l from-amber-100/40 to-transparent" />

                <SmartImage
                  src={coverImg}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 80vw, 320px"
                  className="object-cover"
                />

                {/* Look Inside Badge */}
                <div className="absolute top-4 right-4 z-20 rounded-full bg-black/85 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white border border-white/20">
                  FREE CHAPTER 1 &amp; 2 PREVIEW
                </div>

                {/* Bottom Trigger */}
                <div className="absolute inset-x-4 bottom-4 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setChapterReaderOpen(true);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md py-2.5 text-xs font-bold text-neutral-900 dark:text-white shadow-xl hover:scale-102 transition-transform border border-black/10"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Open Interactive In-Browser Reader</span>
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Device Compatibility Row */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Tablet className="h-3.5 w-3.5 text-indigo-500" />
                iPad &amp; Apple Books
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                Kindle EPUB
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-indigo-500" />
                Printable PDF
              </span>
            </div>
          </div>

          {/* Right Column: Pricing, Value Stack, Conversion CTAs */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                OFFICIAL DIGITAL MASTER EDITION
              </span>
              <span className="text-xs text-neutral-500">Instant Digital Delivery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              {product.title}
            </h1>

            <p className="mt-3 text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {product.longDescription || product.description}
            </p>

            {/* Pricing Box */}
            <div className="mt-6 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                  {isFree ? "Free Download" : formatCurr(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-neutral-400 line-through">
                    {formatCurr(product.originalPrice)}
                  </span>
                )}
                {!isFree && (
                  <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-xs font-bold">
                    Lifetime Personal &amp; Commercial License
                  </span>
                )}
              </div>

              {/* CTAs */}
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setChapterReaderOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 py-3.5 text-xs font-bold text-neutral-900 dark:text-white shadow-xs hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>Read Free Chapters 1 &amp; 2</span>
                </button>
                <button
                  onClick={() => {
                    if (isUnlocked) {
                      handleDownload();
                    } else if (isFree) {
                      triggerDirectDownload(
                        `/api/download?productId=${encodeURIComponent(product.id)}`,
                        `${product.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-master.pdf`
                      );
                    } else {
                      setCheckoutOpen(true);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-neutral-900 dark:bg-white py-3.5 text-xs font-bold text-white dark:text-neutral-900 shadow-xl hover:scale-102 active:scale-98 transition-transform cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>{isUnlocked ? "Download PDF (Purchased)" : isFree ? "Download Master PDF" : "Unlock Full Book Now"}</span>
                </button>
              </div>

              {/* Guarantee */}
              <div className="mt-4 flex items-center justify-between text-[11px] text-neutral-500 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" /> Instant Delivery
                </span>
                <span>Highlightable Text</span>
                <span>DRM-Free / Print Friendly</span>
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-3">
                What You Will Learn &amp; Master
              </h3>
              <div className="space-y-2.5">
                {takeaways.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Table of Contents Accordion */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Table of Contents ({pageCount})
                </h3>
                <button
                  onClick={() => setChapterReaderOpen(true)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Read Free Sample →
                </button>
              </div>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
                {toc.map((ch, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (ch.free) setChapterReaderOpen(true);
                      else setCheckoutOpen(true);
                    }}
                    className="flex items-center justify-between p-3.5 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-850 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {ch.free ? (
                        <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                          FREE
                        </span>
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-amber-500" />
                      )}
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        {ch.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400">{ch.pages}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Reader Modal */}
      <ChapterReaderModal
        isOpen={chapterReaderOpen}
        onClose={() => setChapterReaderOpen(false)}
        product={product}
        onUnlock={(prod) => {
          setChapterReaderOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {/* Full PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        title={product.title}
        pdfUrl={product.pdfUrl || product.downloadUrl || ""}
        price={product.price}
        isFree={isFree}
        product={product}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        product={product}
      />
    </>
  );
}
