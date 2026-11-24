"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  Play,
  Pause,
  Download,
  Bookmark,
  Check,
  Search,
  Volume2,
} from "lucide-react";
import { WaveformDisplay } from "./waveform-display";
import { useAudioPlayer } from "@/context/audio-player-context";
import { useCurrency } from "@/context/currency-context";
import { triggerDirectDownload } from "@/lib/download";
import { CheckoutModal } from "@/components/products/checkout-modal";
import type { Product } from "@/types/product";

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
      0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02,
      0.05, 0.15, 0.35, 0.65, 0.80, 0.75, 0.45, 0.20, 0.08, 0.03, 0.02,
      0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02,
      0.05, 0.20, 0.50, 0.85, 0.90, 0.70, 0.35, 0.12, 0.05, 0.02,
      0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02,
      0.08, 0.25, 0.65, 0.95, 0.98, 0.88, 0.60, 0.30, 0.12, 0.05, 0.02,
      0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02,
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
      0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02,
      0.03, 0.06, 0.12, 0.22, 0.38, 0.58, 0.75, 0.88, 0.94, 0.96,
      0.92, 0.88, 0.94, 0.85, 0.90, 0.82, 0.75, 0.78, 0.70,
      0.60, 0.48, 0.35, 0.22, 0.12, 0.05, 0.02,
      0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02,
      0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02,
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
      0.12, 0.55, 0.92, 0.95, 0.65, 0.25, 0.02,
      0.02, 0.02,
      0.15, 0.60, 0.88, 0.70, 0.30, 0.02,
      0.02, 0.02,
      0.12, 0.45, 0.80, 0.40, 0.10, 0.02,
      0.02, 0.02,
      0.18, 0.65, 0.85, 0.45, 0.12, 0.02,
      0.02, 0.02,
      0.22, 0.75, 0.98, 0.90, 0.55, 0.20, 0.02,
      0.02, 0.02,
      0.25, 0.85, 0.98, 0.95, 0.80, 0.50, 0.20, 0.05, 0.02,
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
      0.02, 0.02, 0.02,
      0.08, 0.45, 0.88, 0.60, 0.20, 0.02,
      0.02, 0.02, 0.02, 0.02,
      0.10, 0.55, 0.92, 0.65, 0.22, 0.02,
      0.02, 0.02, 0.02, 0.02,
      0.08, 0.42, 0.85, 0.50, 0.18, 0.02,
      0.02, 0.02, 0.02, 0.02,
      0.12, 0.65, 0.98, 0.75, 0.30, 0.08, 0.02,
      0.02, 0.02, 0.02, 0.02,
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
      0.02, 0.02, 0.02, 0.05, 0.12, 0.75, 0.02, 0.15, 0.92, 0.02, 0.08, 0.55, 0.02,
      0.20, 0.88, 0.02, 0.10, 0.65, 0.02, 0.30, 0.95, 0.02, 0.15, 0.70, 0.02,
      0.25, 0.85, 0.02, 0.10, 0.60, 0.02, 0.40, 0.90, 0.02, 0.18, 0.75, 0.02,
      0.22, 0.82, 0.02, 0.12, 0.68, 0.02, 0.35, 0.88, 0.02, 0.15, 0.65, 0.02,
      0.20, 0.80, 0.02, 0.10, 0.50, 0.02, 0.02, 0.02,
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
      0.15, 0.60, 0.95, 0.98, 0.80, 0.45, 0.20, 0.08, 0.02, 0.02,
      0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02,
      0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02,
      0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02,
      0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02,
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
      0.02, 0.05, 0.15, 0.25, 0.42, 0.68, 0.92, 0.98, 0.75, 0.35,
      0.12, 0.06, 0.02, 0.10, 0.22, 0.55, 0.88, 0.95, 0.65, 0.20,
      0.06, 0.02, 0.08, 0.20, 0.50, 0.82, 0.96, 0.70, 0.28, 0.02,
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
      0.08, 0.72, 0.18, 0.02, 0.12, 0.85, 0.22, 0.06, 0.15, 0.68,
      0.20, 0.02, 0.10, 0.92, 0.25, 0.08, 0.18, 0.78, 0.20, 0.02,
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
      0.20, 0.25, 0.30, 0.28, 0.35, 0.32, 0.40, 0.55, 0.75, 0.88,
      0.95, 0.82, 0.65, 0.45, 0.38, 0.32, 0.30, 0.34, 0.38, 0.42,
      0.40, 0.35, 0.32, 0.30, 0.28, 0.26, 0.24, 0.22, 0.20, 0.02,
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
      0.15, 0.22, 0.38, 0.58, 0.78, 0.92, 0.85, 0.65, 0.45, 0.30,
      0.20, 0.35, 0.65, 0.88, 0.95, 0.75, 0.42, 0.25, 0.40, 0.70,
      0.90, 0.98, 0.82, 0.55, 0.30, 0.15, 0.08, 0.02, 0.02, 0.02,
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
      0.12, 0.18, 0.25, 0.32, 0.42, 0.50, 0.55, 0.52, 0.48, 0.45,
      0.42, 0.38, 0.35, 0.32, 0.28, 0.22, 0.85, 0.45, 0.18, 0.10,
      0.08, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02,
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
      0.18, 0.28, 0.45, 0.65, 0.82, 0.92, 0.95, 0.90, 0.85, 0.80,
      0.75, 0.72, 0.78, 0.85, 0.88, 0.82, 0.75, 0.68, 0.62, 0.55,
      0.48, 0.42, 0.35, 0.28, 0.22, 0.18, 0.14, 0.10, 0.08, 0.02,
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
      0.20, 0.15, 0.12, 0.08, 0.06, 0.02, 0.02, 0.02, 0.02, 0.02,
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
      0.12, 0.88, 0.95, 0.55, 0.22, 0.08, 0.02,
      0.10, 0.82, 0.92, 0.50, 0.18, 0.02,
      0.15, 0.90, 0.98, 0.58, 0.20, 0.06,
      0.12, 0.85, 0.89, 0.48, 0.15, 0.02,
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
      0.15, 0.45, 0.80, 0.35, 0.65, 0.95, 0.40, 0.70, 0.90, 0.55,
      0.30, 0.75, 0.85, 0.45, 0.80, 0.98, 0.50, 0.65, 0.90, 0.60,
      0.35, 0.80, 0.92, 0.40, 0.75, 0.88, 0.45, 0.60, 0.85, 0.02,
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
      0.10, 0.30, 0.60, 0.85, 0.95, 0.70, 0.40, 0.20, 0.50, 0.80,
      0.98, 0.75, 0.35, 0.60, 0.88, 0.92, 0.65, 0.30, 0.55, 0.85,
      0.95, 0.80, 0.45, 0.25, 0.60, 0.90, 0.98, 0.70, 0.35, 0.02,
    ],
  },
];

type SortOption = "relevant" | "popular" | "newest" | "duration" | "name";

// Envato / Freesound style "Find Similar / Variations" icon matching the reference screenshot
function VariationsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.25" />
      <path d="M19.5 7a9 9 0 0 0-7.5-4.5" strokeLinecap="round" />
      <path d="M4.5 17a9 9 0 0 0 7.5 4.5" strokeLinecap="round" />
      <circle cx="19.5" cy="7" r="1.5" fill="currentColor" />
      <circle cx="4.5" cy="17" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function SoundEffectsCatalog() {
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("relevant");
  const [savedTrackIds, setSavedTrackIds] = useState<Set<string>>(new Set());
  const [copiedTrackId, setCopiedTrackId] = useState<string | null>(null);
  const [adminTracks, setAdminTracks] = useState<SfxTrack[]>([]);
  const [checkoutTrack, setCheckoutTrack] = useState<Product | null>(null);

  const { currentTrack, isPlaying, currentTime, duration, playTrack, togglePlay, seek } =
    useAudioPlayer();
  const { formatPrice } = useCurrency();

  // Load live tracks from Admin/Firestore
  useEffect(() => {
    fetch("/api/products?category=sound-effects")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          const mapped: SfxTrack[] = data.products
            .filter((p: any) =>
              p.audioPreviewUrl ||
              p.downloadUrl ||
              p.googleDriveUrl ||
              p.category === "sound-effects" ||
              p.category === "editing-bundles" ||
              p.productType === "audio"
            )
            .map((p: any) => {
              const durSec =
                typeof p.duration === "number"
                  ? p.duration
                  : typeof p.audioDuration === "number"
                  ? p.audioDuration
                  : 12;
              const durLabel =
                typeof p.audioDuration === "string"
                  ? p.audioDuration
                  : typeof p.duration === "string"
                  ? p.duration
                  : "0:12";
              return {
                id: p.id,
                title: p.title,
                creator: p.authorName || "BADARSH Studio",
                category: p.audioCategory || (p.tags && p.tags[0]) || "Transitions & Movement",
                clipsCount: p.clipsCount || 1,
                durationSeconds: durSec,
                durationLabel: durLabel,
                audioUrl:
                  p.audioPreviewUrl ||
                  p.downloadUrl ||
                  p.googleDriveUrl ||
                  "https://actions.google.com/sounds/v1/science_fiction/whoosh_cinematic.ogg",
                waveformPoints: [
                  0.1, 0.25, 0.6, 0.85, 0.95, 0.75, 0.5, 0.3, 0.65, 0.9, 0.7, 0.4, 0.2, 0.1, 0.05,
                ],
                price: typeof p.price === "number" ? p.price : 0,
                slug: p.slug,
              };
            });
          setAdminTracks(mapped);
        }
      })
      .catch((err) => console.error("Error loading live sound effects:", err));
  }, []);

  // Merge admin-added tracks at the front ahead of static defaults
  const allTracks = useMemo(() => {
    const combined = [...adminTracks];
    SOUND_TRACKS.forEach((track) => {
      if (!combined.some((t) => t.id === track.id)) {
        combined.push(track);
      }
    });
    return combined;
  }, [adminTracks]);

  // Dynamic categories including any custom categories created by admin
  const categoriesList = useMemo(() => {
    const cats = new Set<string>(SFX_CATEGORIES);
    adminTracks.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return Array.from(cats);
  }, [adminTracks]);

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

  // Find similar sounds (filters by track category) or copies share link
  const handleFindSimilar = (track: SfxTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedCategories.includes(track.category)) {
      setSelectedCategories([track.category]);
    }
    setCopiedTrackId(track.id);
    setTimeout(() => setCopiedTrackId(null), 1500);
  };

  // Direct download handler
  const handleDownloadTrack = (track: SfxTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    if (track.price === 0) {
      triggerDirectDownload(
        `/api/download?productId=${encodeURIComponent(track.id)}`,
        `${track.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-master.ogg`
      );
      return;
    }
    if (track.slug) {
      window.location.href = `/templates/${track.slug}`;
      return;
    }
    setCheckoutTrack({
      id: track.id,
      slug: track.slug || track.id,
      title: track.title,
      description: `${track.category} audio effect by ${track.creator} (${track.clipsCount} clips, ${track.durationLabel}).`,
      longDescription: "",
      price: track.price,
      currency: "INR",
      category: "sound-effects",
      tags: ["sfx", track.category],
      images: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80"],
      features: ["24-Bit Master Audio", "Royalty-Free Commercial License", "Instant Direct Download"],
      rating: 5,
      reviewCount: 12,
      downloads: 120,
      isFeatured: false,
      isNew: false,
      isBestseller: false,
      format: "WAV / OGG Audio Master",
      downloadUrl: track.audioUrl,
      audioPreviewUrl: track.audioUrl,
      createdAt: "2026-01-01",
    });
  };

  // Filter & Sort tracks
  const filteredTracks = useMemo(() => {
    let result = allTracks.filter((track) => {
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
  }, [allTracks, search, selectedCategories, sortBy]);

  return (
    <div className="w-full">
      {/* ─── Top Control Bar matching reference screenshot exactly ─── */}
      <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800 pb-3 mb-6 gap-4">
        {/* Left: Hide / Show Filters Toggle Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="inline-flex cursor-pointer items-center gap-2 text-[14px] font-medium text-neutral-900 dark:text-neutral-100 hover:text-black dark:hover:text-white transition-colors select-none"
            aria-label={showFilters ? "Hide Filters" : "Show Filters"}
          >
            <SlidersHorizontal className="h-4 w-4 stroke-[1.8] text-neutral-900 dark:text-neutral-100" />
            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
          </button>

          {/* Active Filters Clear link if selected */}
          {selectedCategories.length > 0 && (
            <button
              onClick={() => setSelectedCategories([])}
              className="text-[12px] text-neutral-500 hover:text-black dark:hover:text-white underline transition-colors cursor-pointer"
            >
              Clear ({selectedCategories.length})
            </button>
          )}
        </div>

        {/* Right: Sort by Relevant Dropdown */}
        <div className="flex items-center gap-3">
          {/* Quick inline search for convenience */}
          <div className="relative hidden sm:block w-48 lg:w-56">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sounds..."
              className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent pl-8 pr-2.5 py-1 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[14px] text-neutral-700 dark:text-neutral-300 select-none">
            <span className="text-neutral-500 dark:text-neutral-400 font-normal">Sort by</span>
            <div className="relative inline-flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none cursor-pointer bg-transparent pr-5 text-[14px] font-semibold text-neutral-900 dark:text-white focus:outline-none"
              >
                <option value="relevant" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                  Relevant
                </option>
                <option value="popular" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                  Most Popular
                </option>
                <option value="newest" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                  Newest
                </option>
                <option value="duration" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                  Duration
                </option>
                <option value="name" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                  Name (A-Z)
                </option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-700 dark:text-neutral-300 stroke-[2]" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Two-Column Layout ─── */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        {/* Left Sidebar: Categories Checkboxes */}
        {showFilters && (
          <aside className="w-full md:w-52 shrink-0 transition-all duration-200">
            <h3 className="text-[15px] font-bold text-neutral-900 dark:text-white tracking-tight">
              Categories
            </h3>

            <div className="mt-4 space-y-3">
              {categoriesList.map((cat) => {
                const isChecked = selectedCategories.includes(cat);
                return (
                  <label
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="flex cursor-pointer items-center gap-2.5 select-none text-[14px] text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors group"
                  >
                    {/* Sleek rounded square checkbox */}
                    <div
                      className={`flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
                        isChecked
                          ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                          : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 group-hover:border-neutral-500"
                      }`}
                    >
                      {isChecked && <Check className="h-3 w-3 stroke-[2.8]" />}
                    </div>
                    <span className={`leading-snug ${isChecked ? "font-semibold text-black dark:text-white" : ""}`}>
                      {cat}
                    </span>
                  </label>
                );
              })}
            </div>
          </aside>
        )}

        {/* Right Main List: Audio Waveform Tracks */}
        <div className="flex-1 w-full min-w-0">
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
            {filteredTracks.map((track) => {
              const isThisTrack = currentTrack?.id === track.id;
              const isThisPlaying = isThisTrack && isPlaying;
              const isSaved = savedTrackIds.has(track.id);

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
                  className="group flex flex-col md:flex-row md:items-center justify-between py-4 sm:py-5 hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40 rounded-lg transition-colors cursor-pointer gap-3 md:gap-6 px-1 sm:px-2"
                >
                  {/* Left Column: Circular Play Button + Title / Byline */}
                  <div className="flex items-center gap-3.5 min-w-[210px] lg:min-w-[240px] shrink-0">
                    {/* Big Circular Play Button matching screenshot */}
                    <button
                      onClick={handlePlayToggle}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white transition-all duration-150 group-hover:border-neutral-400 dark:group-hover:border-neutral-600 active:scale-95"
                      aria-label={isThisPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                    >
                      {isThisPlaying ? (
                        <Pause className="h-4 w-4 fill-black text-black dark:fill-white dark:text-white" />
                      ) : (
                        <Play className="h-4 w-4 fill-black text-black dark:fill-white dark:text-white ml-0.5" />
                      )}
                    </button>

                    {/* Title & Author */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[14px] sm:text-[15px] font-bold text-neutral-900 dark:text-white truncate">
                        {track.title}
                      </h4>
                      <p className="text-[12px] sm:text-[13px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                        By {track.creator}
                      </p>
                    </div>
                  </div>

                  {/* Middle Column: Realistic Waveform Display */}
                  <div className="flex-1 min-w-0 max-w-2xl px-1">
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

                  {/* Right Column: Clip Count & 3 Action Icons */}
                  <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-2 md:pt-0">
                    {/* Clip Count */}
                    <span className="text-[13px] font-normal text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                      {track.clipsCount} {track.clipsCount === 1 ? "Clip" : "Clips"}
                    </span>

                    {/* Action Icon Group */}
                    <div className="flex items-center gap-3">
                      {/* Variations / Similar Sounds Icon */}
                      <button
                        onClick={(e) => handleFindSimilar(track, e)}
                        title="Find similar sounds in category"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors active:scale-95"
                        aria-label="Find similar sounds"
                      >
                        <VariationsIcon className="h-4 w-4" />
                      </button>

                      {/* Bookmark Icon */}
                      <button
                        onClick={(e) => toggleSaveTrack(track.id, e)}
                        title={isSaved ? "Saved" : "Save sound"}
                        className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm transition-colors active:scale-95 ${
                          isSaved
                            ? "text-black dark:text-white"
                            : "text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white"
                        }`}
                        aria-label={isSaved ? "Remove from bookmarks" : "Save sound"}
                      >
                        <Bookmark
                          className={`h-4 w-4 stroke-[1.8] ${isSaved ? "fill-black text-black dark:fill-white dark:text-white" : ""}`}
                        />
                      </button>

                      {/* Download Icon */}
                      <button
                        onClick={(e) => handleDownloadTrack(track, e)}
                        title={track.price === 0 ? "Download Master WAV" : `Get (${formatPrice(track.price)})`}
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors active:scale-95"
                        aria-label="Download audio file"
                      >
                        <Download className="h-4 w-4 stroke-[1.8]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty Search Result State */}
          {filteredTracks.length === 0 && (
            <div className="py-16 text-center border-t border-neutral-200 dark:border-neutral-800">
              <Volume2 className="mx-auto h-9 w-9 text-neutral-400" />
              <h4 className="mt-3 text-[15px] font-bold text-neutral-900 dark:text-white">
                No sound effects found
              </h4>
              <p className="mt-1 text-xs text-neutral-500">
                Try searching for &ldquo;whoosh&rdquo;, &ldquo;explosion&rdquo;, or resetting your filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategories([]);
                }}
                className="mt-4 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-1 text-xs font-semibold text-neutral-900 dark:text-white hover:bg-neutral-50"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      {checkoutTrack && (
        <CheckoutModal
          product={checkoutTrack}
          isOpen={true}
          onClose={() => setCheckoutTrack(null)}
        />
      )}
    </div>
  );
}
