"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, Download, Eye, Sparkles, ArrowRight } from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";
import { TemplatePreviewModal } from "../template-preview-modal";
import { TemplateEditorModal } from "@/components/templates/template-editor-modal";
import { CheckoutModal } from "../checkout-modal";
import { useProductAccess } from "@/hooks/use-product-access";
import { triggerDirectDownload } from "@/lib/download";

interface StandardTemplateCardProps {
  product: Product;
  priority?: boolean;
}

export function StandardTemplateCard({ product }: StandardTemplateCardProps) {
  const router = useRouter();
  const { formatPrice: formatCurr } = useCurrency();
  const { isUnlocked, handleDownload } = useProductAccess(product);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isFree = product.price === 0;

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnlocked) {
      handleDownload(e);
      return;
    }
    if (isFree) {
      if (product.canvaUrl && product.canvaUrl.includes("canva.com")) {
        window.open(product.canvaUrl, "_blank", "noopener,noreferrer");
      } else if (
        product.downloadUrl ||
        product.googleDriveUrl ||
        product.pdfUrl ||
        product.appDownloadUrl
      ) {
        triggerDirectDownload(
          `/api/download?productId=${encodeURIComponent(product.id)}`,
          `${product.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-template`
        );
      } else if (product.canvaUrl) {
        window.open(product.canvaUrl, "_blank", "noopener,noreferrer");
      } else {
        setEditorOpen(true);
      }
    } else {
      setCheckoutOpen(true);
    }
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    router.push(`/templates/${product.slug}`);
  };

  const coverImg = product.images?.[0];
  const isCanva =
    product.deliveryType === "canva-link" ||
    product.canvaUrl ||
    product.format?.toLowerCase().includes("canva") ||
    product.format === "Design Template";

  return (
    <>
      <motion.div
        onClick={handleCardClick}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", duration: 0.3, bounce: 0.05 }}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-200 hover:shadow-lg cursor-pointer"
      >
        {/* Visual Template Frame (Canva Style) */}
        <div className="relative aspect-[16/11] w-full overflow-hidden bg-muted/40">
          {coverImg && !imageError ? (
            <img
              src={coverImg}
              alt={product.title}
              onError={() => setImageError(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <div className="rounded-xl border border-border bg-background p-4 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/70">
                  {product.format}
                </span>
                <p className="mt-1 line-clamp-1 text-sm font-semibold text-foreground">
                  {product.title}
                </p>
                <span className="mt-1 block text-[10px] text-foreground/50">
                  {product.specs?.dimensions || "1080 × 1920 px (HD)"}
                </span>
              </div>
            </div>
          )}

          {/* Canva Compatibility Pill */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
            {isCanva && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-background/95 px-2.5 py-0.5 text-[10px] font-semibold text-foreground shadow-xs">
                <Sparkles className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                <span>Canva Template</span>
              </span>
            )}
            {product.isBestseller && (
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                Bestseller
              </span>
            )}
          </div>

          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs pointer-events-none">
              Save {discountPercent}%
            </div>
          )}

          {/* Canva-style Hover Quick Actions */}
          <div className="absolute bottom-3 right-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-10 flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditorOpen(true);
              }}
              className="flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              title="Customize headline, colors & brand in browser"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Customize</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreviewOpen(true);
              }}
              className="flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              title="Preview template slides"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-xs text-foreground/50">
            <span className="font-medium text-[11px] uppercase tracking-wider text-foreground/70">
              {product.specs?.dimensions || product.category.replace("-", " ")}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{product.rating}</span>
              <span>({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="mt-2 line-clamp-1 text-sm sm:text-base font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
            {product.title}
          </h3>

          {/* Description */}
          <p className="mt-1 line-clamp-2 text-xs text-foreground/60 leading-relaxed">
            {product.description}
          </p>

          {/* Footer: Price & CTA */}
          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              {isUnlocked ? (
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                  Purchased
                </span>
              ) : (
                <>
                  <span className="text-base sm:text-lg font-bold text-foreground">
                    {formatCurr(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-foreground/40 line-through">
                      {formatCurr(product.originalPrice)}
                    </span>
                  )}
                </>
              )}
            </div>

            <button
              onClick={handleActionClick}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-opacity hover:opacity-85 active:scale-95 cursor-pointer ${
                isUnlocked
                  ? "bg-emerald-600 text-white"
                  : "bg-foreground text-background"
              }`}
            >
              <Download className="h-3 w-3" />
              <span>{isUnlocked ? "Download Files" : isFree ? "Get Free Template" : "Get Template"}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Preview Modal */}
      <TemplatePreviewModal
        product={product}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onBuyClick={() => {
          setPreviewOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {/* In-Browser Template Customizer Studio */}
      <TemplateEditorModal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        templateTitle={product.title}
        defaultHeadline={product.editableTemplateData?.headline || product.title}
        defaultSubheadline={product.editableTemplateData?.subheadline || product.description}
        defaultBrandName={product.editableTemplateData?.brandText || "BADARSH STUDIO"}
        backgroundImage={coverImg}
      />

      {/* Instant Checkout Modal */}
      <CheckoutModal
        product={product}
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}
