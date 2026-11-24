"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/types/product";
import { triggerDirectDownload } from "@/lib/download";

export interface UnlockedProductRecord {
  orderId: string;
  licenseKey: string;
  timestamp?: number;
}

const STORAGE_KEY = "badarsh_unlocked_products";
const EVENT_NAME = "badarsh_unlocked_update";

/**
 * Persistently marks a product as purchased in browser localStorage
 * and dispatches a window event so all cards and buttons update immediately.
 */
export function markProductAsUnlocked(
  productId: string,
  slug?: string,
  orderId?: string,
  licenseKey?: string
) {
  if (typeof window === "undefined") return;

  try {
    const unlocked: Record<string, UnlockedProductRecord> = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "{}"
    );

    const record: UnlockedProductRecord = {
      orderId: orderId || `ord_${Date.now()}`,
      licenseKey: licenseKey || `BDRSH-PRO-${Date.now().toString(36).toUpperCase()}`,
      timestamp: Date.now(),
    };

    if (productId) unlocked[productId.toLowerCase().trim()] = record;
    if (slug) unlocked[slug.toLowerCase().trim()] = record;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (err) {
    console.warn("Error marking product as unlocked:", err);
  }
}

/**
 * React hook to check if the current visitor has already purchased a given product.
 * Returns reactive `isUnlocked`, `accessData`, and `handleDownload`.
 */
export function useProductAccess(product?: Product | null) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessData, setAccessData] = useState<UnlockedProductRecord | null>(null);

  const checkAccess = useCallback(() => {
    if (!product || typeof window === "undefined") {
      setIsUnlocked(false);
      setAccessData(null);
      return;
    }

    try {
      const unlocked: Record<string, UnlockedProductRecord> = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "{}"
      );

      const candidateKeys = [
        product.id,
        product.slug,
        (product as any)._id,
      ]
        .filter(Boolean)
        .map((k) => String(k).toLowerCase().trim());

      for (const key of candidateKeys) {
        if (unlocked[key]) {
          setIsUnlocked(true);
          setAccessData(unlocked[key]);
          return;
        }
      }

      setIsUnlocked(false);
      setAccessData(null);
    } catch {
      setIsUnlocked(false);
      setAccessData(null);
    }
  }, [product?.id, product?.slug]);

  useEffect(() => {
    checkAccess();

    const onUpdate = () => checkAccess();
    window.addEventListener("storage", onUpdate);
    window.addEventListener(EVENT_NAME, onUpdate);

    return () => {
      window.removeEventListener("storage", onUpdate);
      window.removeEventListener(EVENT_NAME, onUpdate);
    };
  }, [checkAccess]);

  const handleDownload = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!product) return;

      // For free products or verified orders, route through /api/download
      // so the server streams with Content-Disposition: attachment directly into the downloads tray!
      const directTarget =
        accessData?.orderId
          ? `/api/download?orderId=${encodeURIComponent(accessData.orderId)}&productId=${encodeURIComponent(product.id)}${
              accessData.licenseKey ? `&key=${encodeURIComponent(accessData.licenseKey)}` : ""
            }`
          : product.price === 0
          ? `/api/download?productId=${encodeURIComponent(product.id)}`
          : product.downloadUrl ||
            product.googleDriveUrl ||
            product.pdfUrl ||
            product.appDownloadUrl ||
            product.presetLinkUrl ||
            product.freeDownloadUrl ||
            `/api/download?productId=${encodeURIComponent(product.id)}`;

      const filename = `${product.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-master`;
      triggerDirectDownload(directTarget, filename);
    },
    [product, accessData]
  );

  return {
    isUnlocked,
    accessData,
    handleDownload,
  };
}
