"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Download,
  CheckCircle2,
  Sparkles,
  Layers,
  Clock,
  ShieldCheck,
  FileCheck,
  Eye,
  ChevronDown,
  ShoppingBag,
  MessageCircle,
  HelpCircle,
  Award,
} from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { BuyButton } from "./buy-button";
import { ProductCard } from "./product-card";
import { TemplatePreviewModal } from "./template-preview-modal";
import { CheckoutModal } from "./checkout-modal";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps) {
  const { formatPrice: formatCurr } = useCurrency();
  const [activeTab, setActiveTab] = useState<"overview" | "included" | "instructions" | "faq" | "reviews">("overview");
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const faqs = [
    {
      q: "Do I need Canva Pro to use this template?",
      a: "No! All our templates are engineered using 100% free elements and fonts available in Canva Free. You never have to pay for a Canva subscription to download or customize your designs.",
    },
    {
      q: "How will I receive the files after purchase?",
      a: "Immediately after checkout, you'll receive instant access links that open directly in your Canva account. We also provide a PDF guide with direct links and instructions sent to your email or WhatsApp.",
    },
    {
      q: "Can I use these templates for client projects?",
      a: "Yes! Every BADARSH template comes with a full Commercial License. You are free to edit and deliver finished designs to paying clients or use them across unlimited business accounts.",
    },
    {
      q: "What if I get stuck while customizing?",
      a: "We offer dedicated WhatsApp support for all template buyers. Simply message our creative team, and we'll help you format, align, or customize your assets.",
    },
  ];

  const sampleReviews = [
    {
      author: "Pooja V.",
      role: "E-Commerce Founder",
      date: "2 days ago",
      rating: 5,
      content:
        "These templates completely elevated our social media aesthetics. Our reel view counts doubled in the first week. Drag and drop in Canva makes it so easy!",
    },
    {
      author: "Kunal M.",
      role: "Digital Consultant",
      date: "1 week ago",
      rating: 5,
      content:
        "Best investment for my personal brand. Super clean typography, premium layouts, and saved me days of design work. 10/10 recommended.",
    },
    {
      author: "Deepika R.",
      role: "Boutique Owner",
      date: "2 weeks ago",
      rating: 5,
      content:
        "Got the link on WhatsApp in 30 seconds after payment. Everything was editable in Canva Free without any issues. Amazing quality!",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-16">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/templates" className="hover:text-foreground">
          Templates
        </Link>
        <span>/</span>
        <span className="truncate text-foreground font-medium">
          {product.title}
        </span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Col: Visual Preview Display */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-3xl border border-card-border bg-gradient-to-br from-accent/15 via-purple-900/10 to-card p-8 md:p-12 shadow-sm">
            {/* Visual device canvas */}
            <div className="relative flex aspect-[16/10] w-full flex-col items-center justify-center rounded-2xl border border-white/20 bg-background/80 p-8 text-center shadow-2xl backdrop-blur-xl">
              <span className="rounded-full bg-accent/15 px-4 py-1 text-xs font-bold text-accent">
                {product.format} &bull; Canva Free &amp; Pro
              </span>
              <h2 className="mt-4 font-heading text-2xl font-extrabold text-foreground md:text-3xl">
                {product.title}
              </h2>
              <p className="mt-3 max-w-md text-xs leading-relaxed text-muted">
                {product.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {product.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-card-border bg-card px-2.5 py-1 text-[11px] font-semibold text-muted"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Interactive Preview Trigger */}
              <button
                onClick={() => setPreviewModalOpen(true)}
                className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-heading text-xs font-bold text-white shadow-md transition hover:bg-accent-hover hover:scale-105"
              >
                <Eye className="h-4 w-4" />
                <span>Preview Template Slides Inside</span>
              </button>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {product.isBestseller && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" /> Bestseller
                </span>
              )}
              {discountPercent > 0 && (
                <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  Save {discountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Key Product Guarantees */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-card-border bg-card p-4 text-center">
              <FileCheck className="mx-auto h-5 w-5 text-accent" />
              <p className="mt-2 text-xs font-bold text-foreground">Canva Free Ready</p>
              <p className="text-[11px] text-muted">No subscription needed</p>
            </div>
            <div className="rounded-2xl border border-card-border bg-card p-4 text-center">
              <Download className="mx-auto h-5 w-5 text-emerald-500" />
              <p className="mt-2 text-xs font-bold text-foreground">Instant Delivery</p>
              <p className="text-[11px] text-muted">Direct Canva links</p>
            </div>
            <div className="rounded-2xl border border-card-border bg-card p-4 text-center">
              <ShieldCheck className="mx-auto h-5 w-5 text-amber-500" />
              <p className="mt-2 text-xs font-bold text-foreground">Commercial Rights</p>
              <p className="text-[11px] text-muted">Use for clients</p>
            </div>
            <div className="rounded-2xl border border-card-border bg-card p-4 text-center">
              <Clock className="mx-auto h-5 w-5 text-indigo-500" />
              <p className="mt-2 text-xs font-bold text-foreground">Lifetime Updates</p>
              <p className="text-[11px] text-muted">Free updated links</p>
            </div>
          </div>
        </div>

        {/* Right Col: Details, Price & Buy Actions */}
        <div className="flex flex-col justify-between lg:col-span-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                {product.category.replace("-", " ")}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-foreground">{product.rating}</span>
                <span>({product.reviewCount} verified reviews)</span>
              </div>
            </div>

            <h1 className="mt-4 font-heading text-3xl font-extrabold text-foreground sm:text-4xl">
              {product.title}
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              {product.description}
            </p>

            {/* Pricing Box */}
            <div className="mt-6 rounded-2xl border border-card-border bg-card/60 p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-3xl font-extrabold text-foreground">
                  {formatCurr(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-muted line-through">
                    {formatCurr(product.originalPrice)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                    {discountPercent}% OFF Flash Deal
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted">
                One-time payment &bull; No recurring fee &bull; Instant WhatsApp/Email access
              </p>
            </div>

            {/* Checklist of what's inside */}
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                What's Included In This Suite:
              </h3>
              <ul className="mt-3 space-y-2.5">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-foreground/90">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 border-t border-card-border/60 pt-6">
            <BuyButton
              price={product.price}
              productTitle={product.title}
              gumroadUrl={product.gumroadUrl}
              product={product}
            />
          </div>
        </div>
      </div>

      {/* Interactive Tabs Section */}
      <div className="mt-16 rounded-3xl border border-card-border/80 bg-card p-6 md:p-10 shadow-sm backdrop-blur-xl">
        {/* Tab Headers with Apple-grade Spring Pill */}
        <div className="no-scrollbar relative flex items-center gap-2 overflow-x-auto border-b border-card-border/60 pb-4">
          {[
            { id: "overview", label: "Overview" },
            { id: "included", label: "What's Included" },
            { id: "instructions", label: "How to Use" },
            { id: "faq", label: "FAQs" },
            { id: "reviews", label: `Reviews (${product.reviewCount})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative z-10 cursor-pointer whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold transition-colors duration-150 active:scale-95 ${
                  isActive
                    ? "text-white"
                    : "text-muted hover:bg-muted/20 hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="productDetailActiveTab"
                    className="absolute inset-0 -z-10 rounded-full bg-accent shadow-xs"
                    transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                  />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            >
              {activeTab === "overview" && (
            <div className="space-y-4 text-sm leading-relaxed text-muted">
              <p>{product.longDescription}</p>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3 border-t border-card-border/60 pt-6">
                <div>
                  <h4 className="font-heading text-sm font-bold text-foreground">
                    1. Zero Design Skills Required
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    Engineered for founders and busy shop owners. Simply double click on text and swap images.
                  </p>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-foreground">
                    2. Commercial License
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    Use for your own business, client work, e-commerce stores, and ad creatives freely.
                  </p>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-foreground">
                    3. Free Lifetime Updates
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    Receive new layouts and algorithm-optimized slide updates whenever this pack is expanded.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "included" && (
            <div className="space-y-4">
              <h3 className="font-heading text-base font-bold text-foreground">
                Detailed Inventory of Assets
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {product.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-xl border border-card-border bg-background p-3.5 text-xs text-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted">
                Format: <strong>{product.format}</strong> &bull; Size: <strong>{product.fileSize || "Instant Canva Cloud"}</strong> &bull; Delivery: <strong>Instant Web &amp; WhatsApp</strong>
              </p>
            </div>
          )}

          {activeTab === "instructions" && (
            <div className="space-y-6">
              <h3 className="font-heading text-base font-bold text-foreground">
                3 Simple Steps to Launch Your Content
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-card-border bg-background p-6">
                  <span className="font-heading text-2xl font-black text-accent">01</span>
                  <h4 className="mt-2 font-heading text-sm font-bold text-foreground">
                    Click Your Access Link
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    After checkout, click the link to automatically open and copy the templates into your Canva account.
                  </p>
                </div>
                <div className="rounded-2xl border border-card-border bg-background p-6">
                  <span className="font-heading text-2xl font-black text-accent">02</span>
                  <h4 className="mt-2 font-heading text-sm font-bold text-foreground">
                    Customize Colors &amp; Text
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    Replace placeholders with your brand photos, font choices, and message in 5 minutes.
                  </p>
                </div>
                <div className="rounded-2xl border border-card-border bg-background p-6">
                  <span className="font-heading text-2xl font-black text-accent">03</span>
                  <h4 className="mt-2 font-heading text-sm font-bold text-foreground">
                    Export &amp; Publish
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    Download in high-res PNG, JPG, or MP4 and share across Instagram, LinkedIn, or print.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-card-border bg-background p-4"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="flex w-full cursor-pointer items-center justify-between text-left font-heading text-sm font-bold text-foreground"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-muted transition-transform duration-200 ${
                        openFaqIndex === idx ? "rotate-180 text-accent" : ""
                      }`}
                    />
                  </button>
                  {openFaqIndex === idx && (
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 rounded-2xl border border-card-border bg-background p-5">
                <div className="text-center">
                  <span className="font-heading text-4xl font-extrabold text-foreground">
                    {product.rating}
                  </span>
                  <div className="mt-1 flex justify-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="mt-1 block text-[10px] text-muted">
                    Based on {product.reviewCount} customer reviews
                  </span>
                </div>
                <div className="h-12 w-px bg-card-border/60" />
                <div className="flex-1 text-xs text-muted">
                  <p className="font-semibold text-foreground">
                    100% Verified Purchases
                  </p>
                  <p className="mt-0.5">
                    All reviews come from verified buyers across India &amp; international creators.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {sampleReviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-card-border bg-background p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted">{rev.date}</span>
                    </div>
                    <p className="mt-3 text-xs italic text-foreground/90">
                      "{rev.content}"
                    </p>
                    <p className="mt-4 text-[11px] font-bold text-foreground">
                      {rev.author} &bull; <span className="text-accent">{rev.role}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-20 border-t border-card-border/60 pt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Similar Digital Products You Might Like
            </h2>
            <p className="text-xs text-muted">
              Hand-picked complementary assets for your brand toolkit.
            </p>
          </div>
          <Link
            href="/templates"
            className="text-xs font-bold text-accent hover:text-accent-hover"
          >
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Sticky Mobile Purchase Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-card-border bg-card/95 p-3.5 backdrop-blur-xl sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-muted block truncate max-w-[150px]">
              {product.title}
            </span>
            <span className="font-heading text-base font-black text-foreground">
              {formatCurr(product.price)}
            </span>
          </div>

          <button
            onClick={() => setCheckoutModalOpen(true)}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 font-heading text-xs font-bold text-white shadow-md hover:bg-accent-hover"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Instant Download</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <TemplatePreviewModal
        product={product}
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        onBuyClick={() => setCheckoutModalOpen(true)}
      />

      <CheckoutModal
        product={product}
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
      />
    </div>
  );
}

