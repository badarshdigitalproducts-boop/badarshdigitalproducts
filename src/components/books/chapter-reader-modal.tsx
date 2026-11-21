"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BookOpen,
  Lock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
  Coffee,
  Type,
  ShieldCheck,
  Download,
  Share2,
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
  const [activeChapter, setActiveChapter] = useState(1);
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [theme, setTheme] = useState<"paper" | "sepia" | "night">("paper");

  if (!isOpen || !product) return null;

  const chapters = [
    {
      id: 1,
      title: "Chapter 1: The Core Mental Model",
      pages: "Pages 1–12",
      unlocked: true,
      excerpt: `Most people believe that building wealth or achieving mastery requires extreme luck or an extraordinary IQ. In reality, the difference between those who compound results and those who remain stuck is their foundational system of thinking.\n\nWhen you examine the habits of top performers—whether in business, product design, or finance—you realize they do not rely on intermittent motivation. Motivation is fleeting; systems are permanent.\n\n"You do not rise to the level of your goals. You fall to the level of your systems."\n\nTake financial literacy as a primary example. An asset puts money into your pocket without requiring your active physical presence. A liability takes money out of your pocket. The middle class acquires liabilities that they mistakenly believe are assets. The rich focus entirely on acquiring income-producing assets.\n\nEvery decision you make with your daily focus either compounds your leverage or increases your operational drag. Once you grasp this simple distinction, your entire worldview shifts from passive consumption to deliberate creation.`,
    },
    {
      id: 2,
      title: "Chapter 2: The Compounding Engine",
      pages: "Pages 13–24",
      unlocked: true,
      excerpt: `Changes that seem small and unimportant at first will compound into remarkable results if you are willing to stick with them for years. We all deal with setbacks, but in the long run, the quality of our lives often depends on the quality of our systems.\n\nWith the same habits, you will end up with the same results. But with better habits, anything is possible. When tiny 1% daily improvements compound across 365 days, you end up 37 times better by year's end.\n\nConsider the power of feedback loops. In software development and digital products, rapid iteration separates category leaders from forgotten experiments. The feedback loop must be tight:\n1. Make the cue obvious.\n2. Make the craving attractive.\n3. Make the response easy.\n4. Make the reward satisfying.\n\nWhen these four laws work in harmony, momentum becomes self-sustaining. You stop fighting friction and start surfing compounding momentum.`,
    },
    {
      id: 3,
      title: "Chapter 3: Advanced Operating Systems & Execution",
      pages: "Pages 25–68",
      unlocked: false,
      excerpt: "",
    },
    {
      id: 4,
      title: "Chapter 4: The Strategic Blueprint & Action Checklist",
      pages: "Pages 69–120",
      unlocked: false,
      excerpt: "",
    },
    {
      id: 5,
      title: "Chapter 5: Case Studies, Templates & Worksheets",
      pages: "Pages 121–240",
      unlocked: false,
      excerpt: "",
    },
  ];

  const currentChapter = chapters.find((c) => c.id === activeChapter) || chapters[0];

  const themeClasses = {
    paper: "bg-[#FAFAF9] text-[#1C1917] border-neutral-200",
    sepia: "bg-[#FBF0D9] text-[#433422] border-[#E8D9B8]",
    night: "bg-[#0A0A0A] text-[#E5E5E5] border-neutral-800",
  };

  const fontSizes = {
    sm: "text-sm leading-relaxed",
    md: "text-base leading-loose",
    lg: "text-lg leading-loose",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={`relative flex h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border shadow-2xl ${themeClasses[theme]}`}
      >
        {/* Top Reading Navigation Bar */}
        <div className="flex items-center justify-between border-b px-6 py-4 border-inherit">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 font-bold">
              <BookOpen className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                  Interactive In-Browser Reader
                </span>
                <span className="text-xs opacity-50">• Free Preview Mode</span>
              </div>
              <h2 className="font-heading text-sm sm:text-base font-bold line-clamp-1">
                {product.title}
              </h2>
            </div>
          </div>

          {/* Reading Controls (Theme, Font Size, Close) */}
          <div className="flex items-center gap-3">
            {/* Theme Switcher */}
            <div className="hidden sm:flex items-center gap-1 rounded-full p-1 bg-black/5 dark:bg-white/5 border border-inherit">
              <button
                onClick={() => setTheme("paper")}
                title="White Paper Mode"
                className={`rounded-full p-1.5 transition-all ${
                  theme === "paper" ? "bg-white text-black shadow-xs" : "opacity-50 hover:opacity-100"
                }`}
              >
                <Sun className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTheme("sepia")}
                title="Sepia Warm Mode"
                className={`rounded-full p-1.5 transition-all ${
                  theme === "sepia" ? "bg-[#F3E5C8] text-[#433422] shadow-xs" : "opacity-50 hover:opacity-100"
                }`}
              >
                <Coffee className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTheme("night")}
                title="Night Dark Mode"
                className={`rounded-full p-1.5 transition-all ${
                  theme === "night" ? "bg-neutral-800 text-white shadow-xs" : "opacity-50 hover:opacity-100"
                }`}
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Font Size */}
            <div className="hidden sm:flex items-center gap-1 rounded-full p-1 bg-black/5 dark:bg-white/5 border border-inherit text-xs font-bold">
              <button
                onClick={() => setFontSize("sm")}
                className={`px-2 py-0.5 rounded-full ${fontSize === "sm" ? "bg-black/10 dark:bg-white/10" : "opacity-50"}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize("md")}
                className={`px-2 py-0.5 rounded-full ${fontSize === "md" ? "bg-black/10 dark:bg-white/10" : "opacity-50"}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize("lg")}
                className={`px-2 py-0.5 rounded-full ${fontSize === "lg" ? "bg-black/10 dark:bg-white/10" : "opacity-50"}`}
              >
                A+
              </button>
            </div>

            {/* Unlock Button */}
            <button
              onClick={() => onUnlock(product)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold shadow-md transition-transform hover:scale-102"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Unlock ({formatCurr(product.price)})</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="rounded-full p-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Reader Body: Sidebar TOC + Main Reading Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Table of Contents Sidebar */}
          <div className="hidden md:flex w-72 flex-col border-r border-inherit p-4 overflow-y-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-50 mb-3">
              Table of Contents
            </span>
            <div className="space-y-1.5">
              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    if (ch.unlocked) {
                      setActiveChapter(ch.id);
                    } else {
                      onUnlock(product);
                    }
                  }}
                  className={`w-full text-left rounded-xl p-3 transition-all flex items-center justify-between text-xs font-medium ${
                    activeChapter === ch.id
                      ? "bg-indigo-500/10 text-indigo-500 font-bold"
                      : "opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {ch.unlocked ? (
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    ) : (
                      <Lock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    )}
                    <span className="truncate">{ch.title}</span>
                  </div>
                  <span className="text-[10px] opacity-40 shrink-0">{ch.pages}</span>
                </button>
              ))}
            </div>

            {/* Trust Callout */}
            <div className="mt-auto pt-4 border-t border-inherit">
              <div className="rounded-xl bg-black/5 dark:bg-white/5 p-3 text-[11px] leading-relaxed">
                <span className="font-bold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> 100% Genuine Digital Edition
                </span>
                <p className="mt-1 opacity-70">
                  Includes full highlightable PDF + Kindle/Apple Books EPUB + printable summary.
                </p>
              </div>
            </div>
          </div>

          {/* Main Reading Canvas */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-12">
            <div className="mx-auto max-w-2xl">
              {currentChapter.unlocked ? (
                <>
                  <div className="mb-8 border-b border-inherit pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                      {currentChapter.pages} • Un-gated Sample
                    </span>
                    <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                      {currentChapter.title}
                    </h1>
                  </div>

                  {/* Chapter Prose */}
                  <div className={`font-serif space-y-6 ${fontSizes[fontSize]}`}>
                    {currentChapter.excerpt.split("\n\n").map((para, idx) => (
                      <p key={idx} className="first-letter:text-3xl first-letter:font-bold first-letter:mr-1">
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* End of Chapter Banner */}
                  <div className="mt-12 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 text-center">
                    <Sparkles className="mx-auto h-6 w-6 text-indigo-500 mb-2" />
                    <h4 className="font-bold text-sm sm:text-base">
                      You&apos;ve completed the free preview of {product.title}!
                    </h4>
                    <p className="mt-1 text-xs opacity-70 max-w-md mx-auto">
                      Ready to dive deeper? Unlock the complete {product.specs?.count || "240+ pages"} master edition, actionable worksheets, and lifetime updates.
                    </p>
                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                      {activeChapter < 2 && (
                        <button
                          onClick={() => setActiveChapter(2)}
                          className="rounded-xl border border-inherit px-4 py-2 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          Read Chapter 2 Free →
                        </button>
                      )}
                      <button
                        onClick={() => onUnlock(product)}
                        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 text-xs font-bold shadow-lg hover:scale-102 transition-transform"
                      >
                        Unlock Master Edition for {formatCurr(product.price)}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Locked Chapter View */
                <div className="py-20 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
                    <Lock className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold font-serif">{currentChapter.title}</h3>
                  <p className="mt-2 text-xs opacity-60 max-w-sm mx-auto leading-relaxed">
                    This chapter and the remaining 200+ pages are part of the Complete Master Edition.
                  </p>
                  <button
                    onClick={() => onUnlock(product)}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-xs font-bold shadow-xl hover:scale-102 transition-transform"
                  >
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>Unlock Full Book for {formatCurr(product.price)}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
