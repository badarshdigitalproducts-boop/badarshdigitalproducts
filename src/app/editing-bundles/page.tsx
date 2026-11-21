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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-16">
      {/* Hero Header */}
      <div className="max-w-3xl mb-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1 text-xs font-semibold text-foreground shadow-2xs">
          <Music className="h-3.5 w-3.5 text-accent" />
          BADARSH Audio Vault
        </span>
        <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Sound Effects &amp; Background Music
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted">
          Uncompressed 24-bit 48kHz WAV audio engineered for high-retention video creators. Designed for viral Instagram Reels, YouTube documentaries, and commercial edits. Audition live waveforms and drag directly onto your timeline.
        </p>

        {/* Feature Highlights */}
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1 text-xs font-medium text-foreground shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Master 24-Bit / 48kHz WAV</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1 text-xs font-medium text-foreground shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>100% Royalty-Free Commercial License</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1 text-xs font-medium text-foreground shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>CapCut &bull; Premiere &bull; DaVinci Ready</span>
          </div>
        </div>
      </div>

      {/* Audio Waveform SFX Catalog with Filters */}
      <div className="mb-20">
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
