"use client";

import { useMemo, useState, useEffect } from "react";
import { Music, CheckCircle2 } from "lucide-react";
import { products as fallbackProducts } from "@/content/products";
import { SfxCard } from "@/components/products/archetypes/sfx-card";
import { SoundEffectsCatalog } from "@/components/audio/sound-effects-catalog";
import type { Product } from "@/types";

export default function EditingBundlesPage() {
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    fetch("/api/products?category=editing-bundles")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch((err) => console.error("Error loading live sound effects:", err));
  }, []);

  const bundles = useMemo(() => {
    return productList.filter((p) => {
      return (
        p.category === "editing-bundles" ||
        p.tags?.includes("sfx") ||
        p.tags?.includes("sound") ||
        p.tags?.includes("bg music") ||
        p.tags?.includes("music") ||
        p.tags?.includes("overlays")
      );
    });
  }, [productList]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
      {/* Compact Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Sound Effects &amp; Motion Audio Packs
        </h1>
        <p className="mt-1 text-sm text-muted">
          Audition 24-bit 48kHz WAV waveforms live and download complete drag-and-drop audio &amp; overlay kits.
        </p>
      </div>

      {/* Audio Waveform SFX Catalog with Filters */}
      <div className="mb-16">
        <SoundEffectsCatalog />
      </div>

      {/* Featured Production Mega Packs & Video Overlays */}
      <div className="border-t border-border pt-14">
        <div className="mb-8">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Featured Audio &amp; Motion Packs
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            Complete drag-and-drop production kits with 4K alpha overlays, LUTs, and master WAV collections.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => (
            <SfxCard key={bundle.id} product={bundle} priority />
          ))}
        </div>
      </div>
    </div>
  );
}
