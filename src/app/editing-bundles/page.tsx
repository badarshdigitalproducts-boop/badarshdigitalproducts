"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Music,
  Play,
  Pause,
  Download,
  Search,
  CheckCircle2,
  ExternalLink,
  Disc3,
  Sparkles,
  Sliders,
  Volume2,
} from "lucide-react";
import { products as fallbackProducts } from "@/content/products";
import { useCurrency } from "@/context/currency-context";
import { useAudioPlayer } from "@/context/audio-player-context";
import { SfxCard } from "@/components/products/archetypes/sfx-card";
import type { Product } from "@/types";

const SFX_CATEGORIES = [
  { id: "all", label: "All Sounds & Music" },
  { id: "reels", label: "Reels & Shorts BGM" },
  { id: "cinematic", label: "Cinematic & Impacts" },
  { id: "transitions", label: "Transitions & Whooshes" },
  { id: "ambient", label: "Ambient & Lo-Fi" },
];

export default function EditingBundlesPage() {
  const { formatPrice: formatCurr } = useCurrency();
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const { currentTrack, isPlaying, playTrack } = useAudioPlayer();

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
      const isSound =
        p.category === "editing-bundles" ||
        p.tags?.includes("sfx") ||
        p.tags?.includes("sound") ||
        p.tags?.includes("bg music") ||
        p.tags?.includes("music") ||
        p.tags?.includes("overlays");

      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      let matchesCat = true;
      if (selectedCategory !== "all") {
        matchesCat = Boolean(
          p.tags?.some((t) => t.toLowerCase().includes(selectedCategory)) ||
          p.title.toLowerCase().includes(selectedCategory) ||
          p.description.toLowerCase().includes(selectedCategory) ||
          (p.audioCategory && p.audioCategory.toLowerCase().includes(selectedCategory))
        );
      }

      return isSound && matchesSearch && matchesCat;
    });
  }, [productList, search, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent">
          <Music className="h-3.5 w-3.5 text-accent" />
          BADARSH Audio Vault
        </span>
        <h1 className="mt-4 apple-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Sound Effects &amp; <span className="text-accent">Background Music</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          Uncompressed 24-bit 48kHz WAV audio engineered for high-retention video creators. Designed for viral Instagram Reels, YouTube documentaries, and commercial edits. Listen to full previews and drag directly onto your timeline.
        </p>

        {/* Feature Highlights */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Master 24-Bit / 48kHz WAV</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>100% Royalty-Free Commercial License</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-card-border bg-card/60 px-4 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>CapCut &bull; Premiere &bull; DaVinci Ready</span>
          </div>
        </div>
      </div>

      {/* Spotify-Style Track Bar / Controls */}
      <div className="mt-14 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Genre / Mood Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {SFX_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-secondary/70 text-muted hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audio, whooshes, lo-fi..."
            className="w-full rounded-full border border-card-border bg-card pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Spotify Table List Layout (Fast Browse) */}
      <div className="mb-10 rounded-2xl border border-card-border bg-card/60 backdrop-blur-sm overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-card-border text-[11px] font-semibold text-muted uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Track Title &amp; Mood</div>
          <div className="col-span-2">Format</div>
          <div className="col-span-2">Duration</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y divide-card-border/60">
          {bundles.map((bundle, index) => {
            const isThisPlaying = currentTrack?.id === bundle.id && isPlaying;
            const audioSrc =
              bundle.audioPreviewUrl ||
              "https://actions.google.com/sounds/v1/science_fiction/whoosh_cinematic.ogg";

            const handlePlay = (e: React.MouseEvent) => {
              e.stopPropagation();
              playTrack({
                id: bundle.id,
                title: bundle.title,
                category: bundle.audioCategory || "Sound Effect",
                audioUrl: audioSrc,
                duration: bundle.audioDuration || "0:45",
                price: bundle.price,
                isFree: bundle.price === 0,
                slug: bundle.slug,
              });
            };

            return (
              <div
                key={bundle.id}
                onClick={handlePlay}
                className="group flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-4 sm:px-6 py-3.5 items-start md:items-center hover:bg-secondary/40 transition-colors cursor-pointer"
              >
                {/* Index / Play Button */}
                <div className="hidden md:flex col-span-1 items-center">
                  <button
                    onClick={handlePlay}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary group-hover:bg-accent group-hover:text-white transition-all text-muted"
                  >
                    {isThisPlaying ? (
                      <Pause className="h-3.5 w-3.5 fill-current text-accent group-hover:text-white" />
                    ) : (
                      <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Title & Category */}
                <div className="col-span-5 flex items-center gap-3 min-w-0 w-full md:w-auto">
                  <button
                    onClick={handlePlay}
                    className="md:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-sm"
                  >
                    {isThisPlaying ? (
                      <Pause className="h-4 w-4 fill-white" />
                    ) : (
                      <Play className="h-4 w-4 fill-white ml-0.5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-accent transition-colors">
                      {bundle.title}
                    </h4>
                    <p className="text-[11px] text-muted truncate">
                      {bundle.audioCategory || "Master Audio"} &bull; BADARSH Sound Design
                    </p>
                  </div>
                </div>

                {/* Format Specs */}
                <div className="hidden md:flex col-span-2 items-center text-xs text-muted">
                  <span className="rounded bg-secondary/80 px-2 py-0.5 text-[10px] font-mono text-foreground">
                    24-Bit WAV
                  </span>
                </div>

                {/* Duration */}
                <div className="hidden md:flex col-span-2 items-center text-xs font-mono text-muted">
                  {bundle.audioDuration || "0:45"}
                </div>

                {/* Action CTA */}
                <div className="col-span-2 flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-card-border/40">
                  <span className="font-heading text-xs font-bold text-foreground">
                    {bundle.price === 0 ? "Free" : formatCurr(bundle.price)}
                  </span>
                  <a
                    href={`/templates/${bundle.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-[11px] font-semibold text-background hover:opacity-90 transition-opacity"
                  >
                    <span>{bundle.price === 0 ? "Download" : "Get"}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid of Sound Effects & Motion Overlays */}
      <h3 className="font-heading text-lg font-bold text-foreground mb-6">
        Featured Audio &amp; Motion Packs
      </h3>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {bundles.map((bundle) => (
          <SfxCard key={bundle.id} product={bundle} priority />
        ))}
      </div>

      {/* Empty State */}
      {bundles.length === 0 && (
        <div className="mt-12 rounded-3xl border border-card-border bg-card p-12 text-center">
          <Music className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
            No sound effects found matching &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-2 text-xs text-muted">
            Try adjusting your search terms or filter.
          </p>
        </div>
      )}
    </div>
  );
}
