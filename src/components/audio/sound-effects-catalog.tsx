"use client";

import React, { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  Play,
  Pause,
  Download,
  Bookmark,
  Link2,
  Check,
  Search,
  Sparkles,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import { WaveformDisplay } from "./waveform-display";
import { useAudioPlayer } from "@/context/audio-player-context";
import { useCurrency } from "@/context/currency-context";

export interface SfxTrack {
  id: string;
  title: string;
  creator: string;
  category: string;
  clipsCount: number;
  durationSeconds: number;
  durationLabel: string;
  audioUrl: string;
  waveformPoints: number[];
  price: number;
  slug?: string;
}

export const SFX_CATEGORIES = [
  "Gaming",
  "Transitions & Movement",
  "Domestic",
  "Human",
  "Urban",
  "Nature",
  "Futuristic",
  "Interface",
  "Cartoon",
  "Industrial",
  "Sound Packs",
] as const;

export const SOUND_TRACKS: SfxTrack[] = [
  {
    id: "sfx-quattro-boom",
    title: "SFX",
    creator: "Quattro-boom",
    category: "Transitions & Movement",
    clipsCount: 3,
    durationSeconds: 8,
    durationLabel: "0:08",
    audioUrl: "https://actions.google.com/sounds/v1/science_fiction/whoosh_cinematic.ogg",
    price: 0,
    waveformPoints: [
      0.05, 0.12, 0.35, 0.75, 0.95, 0.65, 0.25, 0.08, 0.05, 0.05,
      0.06, 0.08, 0.15, 0.45, 0.85, 0.5, 0.18, 0.06, 0.05, 0.05,
      0.05, 0.06, 0.08, 0.22, 0.62, 0.98, 0.82, 0.4, 0.12, 0.05,
      0.05, 0.05, 0.06, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05,
    ],
  },
  {
    id: "sfx-welcome",
    title: "Welcome SFX",
    creator: "EdRecords",
    category: "Interface",
    clipsCount: 1,
    durationSeconds: 5,
    durationLabel: "0:05",
    audioUrl: "https://actions.google.com/sounds/v1/foley/beeps.ogg",
    price: 0,
    waveformPoints: [
      0.05, 0.05, 0.06, 0.08, 0.12, 0.22, 0.45, 0.72, 0.88, 0.92,
      0.85, 0.68, 0.52, 0.42, 0.35, 0.38, 0.45, 0.55, 0.4, 0.25,
      0.15, 0.1, 0.08, 0.06, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05,
    ],
  },
  {
    id: "sfx-explosion",
    title: "Explosion SFX",
    creator: "WistanSound",
    category: "Gaming",
    clipsCount: 6,
    durationSeconds: 14,
    durationLabel: "0:14",
    audioUrl: "https://actions.google.com/sounds/v1/impacts/crash.ogg",
    price: 0,
    waveformPoints: [
      0.1, 0.4, 0.85, 0.95, 0.7, 0.35, 0.1, 0.05,
      0.15, 0.55, 0.88, 0.65, 0.25, 0.08,
      0.12, 0.45, 0.78, 0.3, 0.08,
      0.18, 0.65, 0.82, 0.35, 0.1,
      0.22, 0.75, 0.98, 0.85, 0.4, 0.15,
      0.25, 0.8, 0.92, 0.88, 0.45, 0.12, 0.05,
    ],
  },
  {
    id: "sfx-item-collected",
    title: "Item Collected SFX",
    creator: "urbazon",
    category: "Gaming",
    clipsCount: 4,
    durationSeconds: 3,
    durationLabel: "0:03",
    audioUrl: "https://actions.google.com/sounds/v1/cartoon/pop.ogg",
    price: 0,
    waveformPoints: [
      0.08, 0.45, 0.82, 0.55, 0.18, 0.06, 0.05,
      0.1, 0.52, 0.89, 0.62, 0.2, 0.05,
      0.08, 0.4, 0.75, 0.45, 0.15, 0.05,
      0.12, 0.6, 0.95, 0.7, 0.25, 0.08, 0.05,
    ],
  },
  {
    id: "sfx-toon-drops",
    title: "Toon Drops Sfx",
    creator: "VadiSoundLibrary",
    category: "Cartoon",
    clipsCount: 1,
    durationSeconds: 6,
    durationLabel: "0:06",
    audioUrl: "https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg",
    price: 0,
    waveformPoints: [
      0.05, 0.1, 0.65, 0.12, 0.85, 0.15, 0.45, 0.1, 0.95, 0.2,
      0.75, 0.18, 0.55, 0.12, 0.88, 0.25, 0.6, 0.1, 0.9, 0.15,
      0.8, 0.12, 0.7, 0.15, 0.85, 0.2, 0.5, 0.1, 0.08, 0.05,
    ],
  },
  {
    id: "sfx-platform-hit",
    title: "SFX Platform Game Hit 1",
    creator: "sonic-boom",
    category: "Gaming",
    clipsCount: 1,
    durationSeconds: 4,
    durationLabel: "0:04",
    audioUrl: "https://actions.google.com/sounds/v1/foley/beeps.ogg",
    price: 0,
    waveformPoints: [
      0.1, 0.35, 0.85, 0.95, 0.72, 0.42, 0.22, 0.12, 0.08, 0.06,
      0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05,
      0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05,
    ],
  },
  {
    id: "sfx-cinematic-whoosh",
    title: "Cinematic High-Pass Whoosh",
    creator: "BADARSH Studio",
    category: "Transitions & Movement",
    clipsCount: 3,
    durationSeconds: 7,
    durationLabel: "0:07",
    audioUrl: "https://actions.google.com/sounds/v1/science_fiction/whoosh_cinematic.ogg",
    price: 0,
    waveformPoints: [
      0.05, 0.08, 0.15, 0.25, 0.42, 0.68, 0.92, 0.98, 0.75, 0.35,
      0.12, 0.06, 0.05, 0.1, 0.22, 0.55, 0.88, 0.95, 0.65, 0.2,
      0.06, 0.05, 0.08, 0.2, 0.5, 0.82, 0.96, 0.7, 0.28, 0.05,
    ],
  },
  {
    id: "sfx-mech-keyboard",
    title: "Mechanical Keyboard Click & Tap",
    creator: "KeyPro Audio",
    category: "Interface",
    clipsCount: 5,
    durationSeconds: 3,
    durationLabel: "0:03",
    audioUrl: "https://actions.google.com/sounds/v1/household/clock_tick.ogg",
    price: 0,
    waveformPoints: [
      0.08, 0.72, 0.18, 0.05, 0.12, 0.85, 0.22, 0.06, 0.15, 0.68,
      0.2, 0.05, 0.1, 0.92, 0.25, 0.08, 0.18, 0.78, 0.2, 0.05,
    ],
  },
  {
    id: "sfx-rain-thunder",
    title: "Rain On Window & Soft Thunder",
    creator: "EcoSound Labs",
    category: "Nature",
    clipsCount: 2,
    durationSeconds: 28,
    durationLabel: "0:28",
    audioUrl: "https://actions.google.com/sounds/v1/water/rain_heavy.ogg",
    price: 0,
    waveformPoints: [
      0.2, 0.25, 0.3, 0.28, 0.35, 0.32, 0.4, 0.55, 0.75, 0.88,
      0.95, 0.82, 0.65, 0.45, 0.38, 0.32, 0.3, 0.34, 0.38, 0.42,
      0.4, 0.35, 0.32, 0.3, 0.28, 0.26, 0.24, 0.22, 0.2, 0.18,
    ],
  },
  {
    id: "sfx-cyber-shield",
    title: "Sci-Fi Energy Shield Recharging",
    creator: "HyperDrive FX",
    category: "Futuristic",
    clipsCount: 3,
    durationSeconds: 9,
    durationLabel: "0:09",
    audioUrl: "https://actions.google.com/sounds/v1/science_fiction/whoosh_cinematic.ogg",
    price: 0,
    waveformPoints: [
      0.15, 0.22, 0.38, 0.58, 0.78, 0.92, 0.85, 0.65, 0.45, 0.3,
      0.2, 0.35, 0.65, 0.88, 0.95, 0.75, 0.42, 0.25, 0.4, 0.7,
      0.9, 0.98, 0.82, 0.55, 0.3, 0.15, 0.08, 0.05, 0.05, 0.05,
    ],
  },
  {
    id: "sfx-espresso-pour",
    title: "Domestic Coffee Pour & Ceramic Clink",
    creator: "AmbientCraft",
    category: "Domestic",
    clipsCount: 2,
    durationSeconds: 16,
    durationLabel: "0:16",
    audioUrl: "https://actions.google.com/sounds/v1/foley/beeps.ogg",
    price: 0,
    waveformPoints: [
      0.12, 0.18, 0.25, 0.32, 0.42, 0.5, 0.55, 0.52, 0.48, 0.45,
      0.42, 0.38, 0.35, 0.32, 0.28, 0.22, 0.85, 0.45, 0.18, 0.1,
      0.08, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05,
    ],
  },
  {
    id: "sfx-stadium-applause",
    title: "Arena Crowd Cheer & Thunderous Applause",
    creator: "ArenaRecordings",
    category: "Human",
    clipsCount: 3,
    durationSeconds: 22,
    durationLabel: "0:22",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg",
    price: 0,
    waveformPoints: [
      0.18, 0.28, 0.45, 0.65, 0.82, 0.92, 0.95, 0.9, 0.85, 0.8,
      0.75, 0.72, 0.78, 0.85, 0.88, 0.82, 0.75, 0.68, 0.62, 0.55,
      0.48, 0.42, 0.35, 0.28, 0.22, 0.18, 0.14, 0.1, 0.08, 0.05,
    ],
  },
  {
    id: "sfx-subway-departure",
    title: "Urban Metro Train Track Rumble",
    creator: "UrbanAcoustics",
    category: "Urban",
    clipsCount: 2,
    durationSeconds: 24,
    durationLabel: "0:24",
    audioUrl: "https://actions.google.com/sounds/v1/impacts/crash.ogg",
    price: 0,
    waveformPoints: [
      0.15, 0.22, 0.32, 0.45, 0.62, 0.78, 0.88, 0.92, 0.85, 0.78,
      0.72, 0.68, 0.65, 0.62, 0.58, 0.52, 0.45, 0.38, 0.32, 0.25,
      0.2, 0.15, 0.12, 0.08, 0.06, 0.05, 0.05, 0.05, 0.05, 0.05,
    ],
  },
  {
    id: "sfx-industrial-press",
    title: "Heavy Hydraulic Piston Impact",
    creator: "IronWorks Audio",
    category: "Industrial",
    clipsCount: 4,
    durationSeconds: 12,
    durationLabel: "0:12",
    audioUrl: "https://actions.google.com/sounds/v1/impacts/crash.ogg",
    price: 0,
    waveformPoints: [
      0.12, 0.88, 0.95, 0.55, 0.22, 0.08, 0.05,
      0.1, 0.82, 0.92, 0.5, 0.18, 0.05,
      0.15, 0.9, 0.98, 0.58, 0.2, 0.06,
      0.12, 0.85, 0.89, 0.48, 0.15, 0.05,
    ],
  },
  {
    id: "sfx-viral-reel-pack",
    title: "Viral Reel Sound Pack (50 Master SFX)",
    creator: "BADARSH Studio",
    category: "Sound Packs",
    clipsCount: 50,
    durationSeconds: 95,
    durationLabel: "1:35",
    audioUrl: "https://actions.google.com/sounds/v1/science_fiction/whoosh_cinematic.ogg",
    price: 499,
    slug: "viral-sfx-motion-overlay-bundle",
    waveformPoints: [
      0.15, 0.45, 0.8, 0.35, 0.65, 0.95, 0.4, 0.7, 0.9, 0.55,
      0.3, 0.75, 0.85, 0.45, 0.8, 0.98, 0.5, 0.65, 0.9, 0.6,
      0.35, 0.8, 0.92, 0.4, 0.75, 0.88, 0.45, 0.6, 0.85, 0.3,
    ],
  },
  {
    id: "sfx-cinematic-vault-pack",
    title: "Cinematic Overlays & Risers Pack (40 Clips)",
    creator: "BADARSH Studio",
    category: "Sound Packs",
    clipsCount: 40,
    durationSeconds: 130,
    durationLabel: "2:10",
    audioUrl: "https://actions.google.com/sounds/v1/science_fiction/whoosh_cinematic.ogg",
    price: 399,
    slug: "cinematic-sfx-motion-overlays-vault",
    waveformPoints: [
      0.1, 0.3, 0.6, 0.85, 0.95, 0.7, 0.4, 0.2, 0.5, 0.8,
      0.98, 0.75, 0.35, 0.6, 0.88, 0.92, 0.65, 0.3, 0.55, 0.85,
      0.95, 0.8, 0.45, 0.25, 0.6, 0.9, 0.98, 0.7, 0.35, 0.1,
    ],
  },
];

type SortOption = "relevant" | "popular" | "newest" | "duration" | "name";

export function SoundEffectsCatalog() {
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("relevant");
  const [savedTrackIds, setSavedTrackIds] = useState<Set<string>>(new Set());
  const [copiedTrackId, setCopiedTrackId] = useState<string | null>(null);

  const { currentTrack, isPlaying, currentTime, duration, playTrack, togglePlay, seek } =
    useAudioPlayer();
  const { formatPrice } = useCurrency();

  // Category toggle handler
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Bookmark toggle
  const toggleSaveTrack = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Copy share link
  const handleCopyTrackLink = (track: SfxTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/sound-effects?track=${track.id}`;
      navigator.clipboard.writeText(url).catch(() => {});
      setCopiedTrackId(track.id);
      setTimeout(() => setCopiedTrackId(null), 2000);
    }
  };

  // Direct download handler
  const handleDownloadTrack = (track: SfxTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    if (track.slug) {
      window.location.href = `/templates/${track.slug}`;
      return;
    }
    // Instant master WAV download trigger
    const link = document.createElement("a");
    link.href = track.audioUrl;
    link.download = `${track.title.toLowerCase().replace(/\s+/g, "-")}-master.ogg`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Sort tracks
  const filteredTracks = useMemo(() => {
    let result = SOUND_TRACKS.filter((track) => {
      const matchesSearch =
        search === "" ||
        track.title.toLowerCase().includes(search.toLowerCase()) ||
        track.creator.toLowerCase().includes(search.toLowerCase()) ||
        track.category.toLowerCase().includes(search.toLowerCase());

      const matchesCat =
        selectedCategories.length === 0 || selectedCategories.includes(track.category);

      return matchesSearch && matchesCat;
    });

    switch (sortBy) {
      case "popular":
        result = [...result].sort((a, b) => b.clipsCount - a.clipsCount);
        break;
      case "duration":
        result = [...result].sort((a, b) => a.durationSeconds - b.durationSeconds);
        break;
      case "name":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
        result = [...result].reverse();
        break;
      default:
        break;
    }

    return result;
  }, [search, selectedCategories, sortBy]);

  return (
    <div className="w-full">
      {/* ─── Top Control Bar ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-border pb-4 gap-4">
        {/* Left: Hide/Show Filters Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted active:scale-95 shadow-2xs"
            aria-label={showFilters ? "Hide Filters" : "Show Filters"}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-foreground" />
            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
          </button>

          {/* Active Filters Count Indicator */}
          {selectedCategories.length > 0 && (
            <button
              onClick={() => setSelectedCategories([])}
              className="text-[11px] text-muted hover:text-foreground underline transition-colors cursor-pointer"
            >
              Clear filters ({selectedCategories.length})
            </button>
          )}
        </div>

        {/* Center/Right: Quick Search and Sort Dropdown */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sounds, whooshes, UI..."
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted focus:border-foreground focus:outline-none transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none cursor-pointer rounded-lg border border-border bg-background pl-3 pr-8 py-1.5 text-xs font-medium text-foreground hover:bg-muted focus:border-foreground focus:outline-none transition-colors shadow-2xs"
            >
              <option value="relevant">Sort by Relevant</option>
              <option value="popular">Sort by Most Popular</option>
              <option value="newest">Sort by Newest</option>
              <option value="duration">Sort by Duration</option>
              <option value="name">Sort by Name (A-Z)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted" />
          </div>
        </div>
      </div>

      {/* ─── Main Two-Column Layout ─── */}
      <div className="mt-6 flex flex-col md:flex-row gap-8 items-start">
        {/* Left Sidebar: Categories with Checkboxes (Collapsible) */}
        {showFilters && (
          <aside className="w-full md:w-56 shrink-0 transition-all duration-200">
            <h3 className="font-heading text-sm font-bold text-foreground tracking-tight">
              Categories
            </h3>

            <div className="mt-4 space-y-2.5">
              {SFX_CATEGORIES.map((cat) => {
                const isChecked = selectedCategories.includes(cat);
                return (
                  <label
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="flex cursor-pointer items-center gap-3 select-none text-xs text-foreground/90 hover:text-foreground transition-colors group"
                  >
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                        isChecked
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background group-hover:border-foreground/50"
                      }`}
                    >
                      {isChecked && <Check className="h-3 w-3 stroke-[2.5]" />}
                    </div>
                    <span className={isChecked ? "font-semibold text-foreground" : ""}>
                      {cat}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Quality Seal */}
            <div className="mt-8 rounded-xl border border-border bg-secondary/50 p-3 text-[11px] text-muted space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>24-Bit / 48kHz Master</span>
              </div>
              <p className="leading-snug">
                100% Royalty-Free Commercial License for YouTube, Instagram Reels &amp; Commercials.
              </p>
            </div>
          </aside>
        )}

        {/* Right Main List: Audio Waveform Tracks */}
        <div className="flex-1 w-full min-w-0">
          <div className="divide-y divide-border/60 border-y border-border">
            {filteredTracks.map((track) => {
              const isThisTrack = currentTrack?.id === track.id;
              const isThisPlaying = isThisTrack && isPlaying;
              const isSaved = savedTrackIds.has(track.id);
              const isCopied = copiedTrackId === track.id;

              const handlePlayToggle = (e: React.MouseEvent) => {
                e.stopPropagation();
                if (isThisTrack) {
                  togglePlay();
                } else {
                  playTrack({
                    id: track.id,
                    title: track.title,
                    category: track.category,
                    audioUrl: track.audioUrl,
                    duration: track.durationLabel,
                    price: track.price,
                    isFree: track.price === 0,
                    slug: track.slug,
                  });
                }
              };

              return (
                <div
                  key={track.id}
                  onClick={handlePlayToggle}
                  className="group flex flex-col md:flex-row md:items-center justify-between py-4 sm:py-5 px-1 sm:px-3 hover:bg-secondary/35 rounded-xl transition-colors cursor-pointer gap-4 md:gap-6"
                >
                  {/* Left Column: Play Button + Title/Creator */}
                  <div className="flex items-center gap-3.5 min-w-[210px] shrink-0">
                    {/* Big Circular Play Button */}
                    <button
                      onClick={handlePlayToggle}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all duration-150 group-hover:border-foreground/40 group-hover:scale-105 active:scale-95 shadow-2xs"
                      aria-label={isThisPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                    >
                      {isThisPlaying ? (
                        <Pause className="h-4 w-4 fill-foreground text-foreground" />
                      ) : (
                        <Play className="h-4 w-4 fill-foreground text-foreground ml-0.5" />
                      )}
                    </button>

                    {/* Title & Author */}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-heading text-sm font-bold text-foreground truncate group-hover:text-accent transition-colors">
                        {track.title}
                      </h4>
                      <p className="text-xs text-muted truncate mt-0.5">
                        By {track.creator}
                      </p>
                    </div>
                  </div>

                  {/* Middle: Realistic Waveform Display */}
                  <div className="flex-1 min-w-0 max-w-xl px-1">
                    <WaveformDisplay
                      points={track.waveformPoints}
                      isCurrent={isThisTrack}
                      isPlaying={isThisPlaying}
                      currentTime={isThisTrack ? currentTime : 0}
                      duration={isThisTrack && duration > 0 ? duration : track.durationSeconds}
                      onSeek={(time) => {
                        if (!isThisTrack) {
                          playTrack({
                            id: track.id,
                            title: track.title,
                            category: track.category,
                            audioUrl: track.audioUrl,
                            duration: track.durationLabel,
                            price: track.price,
                            isFree: track.price === 0,
                            slug: track.slug,
                          });
                        }
                        seek(time);
                      }}
                    />
                  </div>

                  {/* Right Column: Clip Count & Action Icons */}
                  <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
                    {/* Clip Count */}
                    <span className="text-xs font-medium text-muted font-mono whitespace-nowrap">
                      {track.clipsCount} {track.clipsCount === 1 ? "Clip" : "Clips"}
                    </span>

                    {/* Action Icon Group */}
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      {/* Share Link Icon */}
                      <button
                        onClick={(e) => handleCopyTrackLink(track, e)}
                        title={isCopied ? "Copied!" : "Copy link"}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted hover:text-foreground hover:bg-muted transition-colors active:scale-95"
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Link2 className="h-4 w-4" />
                        )}
                      </button>

                      {/* Bookmark Icon */}
                      <button
                        onClick={(e) => toggleSaveTrack(track.id, e)}
                        title={isSaved ? "Saved" : "Save to favorites"}
                        className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors active:scale-95 ${
                          isSaved
                            ? "text-foreground"
                            : "text-muted hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <Bookmark
                          className={`h-4 w-4 ${isSaved ? "fill-foreground text-foreground" : ""}`}
                        />
                      </button>

                      {/* Download Icon */}
                      <button
                        onClick={(e) => handleDownloadTrack(track, e)}
                        title={track.price === 0 ? "Download Master WAV" : `Get (${formatPrice(track.price)})`}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground hover:bg-foreground hover:text-background transition-colors active:scale-95 border border-border"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty Search Result State */}
          {filteredTracks.length === 0 && (
            <div className="py-16 text-center border-b border-border">
              <Volume2 className="mx-auto h-10 w-10 text-muted" />
              <h4 className="mt-3 font-heading text-base font-bold text-foreground">
                No sound effects found
              </h4>
              <p className="mt-1 text-xs text-muted">
                Try searching for &ldquo;whoosh&rdquo;, &ldquo;explosion&rdquo;, or clearing active category filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategories([]);
                }}
                className="mt-4 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted shadow-2xs"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
