"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Film,
  Sparkles,
  Download,
  Search,
  Music2,
  CheckCircle2,
  Zap,
  Play,
} from "lucide-react";
import { VideoTemplateCard } from "@/components/video-templates/video-template-card";
import { products as fallbackProducts } from "@/content/products";
import type { Product } from "@/types";

const VIDEO_CATEGORIES = [
  { id: "all", label: "All Templates" },
  { id: "velocity", label: "Velocity & Beat Sync" },
  { id: "lyrics", label: "3D Lyrics & Motion" },
  { id: "shakes", label: "Shakes & Glitch FX" },
  { id: "cinematic", label: "Cinematic Slow-Mo" },
];

export default function VideoTemplatesPage() {
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetch("/api/products?category=video-templates")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch((err) => console.error("Error loading video templates:", err));
  }, []);

  // Built-in curated video templates if none in store yet
  const initialVideoTemplates: Product[] = [
    {
      id: "vt-001",
      slug: "velocity-beat-shake-vol-1",
      title: "Velocity Beat Shake & Flash Vol. 1",
      description: "Aggressive velocity speed-ramping with beat-synced motion blur and camera shakes.",
      longDescription: "Engineered for high-octane reels and TikTok edits.",
      price: 0,
      currency: "INR",
      category: "video-templates",
      tags: ["velocity", "beat-sync", "capcut", "alight-motion", "reels"],
      images: ["https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80"],
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
      capcutUrl: "https://www.capcut.com/template-detail/720000000001",
      alightMotionXmlUrl: "https://raw.githubusercontent.com/budostylz/ENTREPRENEURSHIP/master/Accounting.pdf",
      bpm: 135,
      requiredClipsCount: 14,
      features: ["Auto-beat sync", "Velocity curve pre-tuned", "Alight XML included"],
      rating: 4.9,
      reviewCount: 230,
      downloads: 4200,
      isFeatured: true,
      isNew: true,
      isBestseller: true,
      format: "CapCut & XML Template",
      createdAt: "2026-01-01",
    },
    {
      id: "vt-002",
      slug: "kinetic-3d-typography-lyrics",
      title: "Kinetic 3D Typography & Floating Lyrics",
      description: "Smooth 3D camera push-in with glowing typography animations and sound design.",
      longDescription: "Perfect for music artists, podcast quotes, and aesthetic reels.",
      price: 199,
      originalPrice: 499,
      currency: "INR",
      category: "video-templates",
      tags: ["lyrics", "typography", "capcut", "alight-motion"],
      images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80"],
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      capcutUrl: "https://www.capcut.com/template-detail/720000000002",
      alightMotionXmlUrl: "https://raw.githubusercontent.com/budostylz/ENTREPRENEURSHIP/master/Accounting.pdf",
      bpm: 120,
      requiredClipsCount: 8,
      features: ["Customizable font", "Glow intensity slider", "Smooth 60fps keyframes"],
      rating: 4.8,
      reviewCount: 94,
      downloads: 1850,
      isFeatured: true,
      isNew: false,
      isBestseller: false,
      format: "CapCut & XML Template",
      createdAt: "2026-01-05",
    },
    {
      id: "vt-003",
      slug: "glitch-rgb-split-transition-pack",
      title: "Glitch RGB Split & Distortion Shake",
      description: "Cyberpunk RGB channel splitting with audio swooshes and camera whip pans.",
      longDescription: "High-retention video transition pack for YouTube gaming and hype videos.",
      price: 0,
      currency: "INR",
      category: "video-templates",
      tags: ["shakes", "glitch", "capcut", "alight-motion"],
      images: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80"],
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      capcutUrl: "https://www.capcut.com/template-detail/720000000003",
      alightMotionXmlUrl: "https://raw.githubusercontent.com/budostylz/ENTREPRENEURSHIP/master/Accounting.pdf",
      bpm: 140,
      requiredClipsCount: 16,
      features: ["RGB Chromatic aberration", "Glitch sound pack included", "100% free"],
      rating: 5.0,
      reviewCount: 310,
      downloads: 5800,
      isFeatured: true,
      isNew: true,
      isBestseller: true,
      format: "CapCut & XML Template",
      createdAt: "2026-01-10",
    },
    {
      id: "vt-004",
      slug: "cinematic-slow-mo-luxury-reels",
      title: "Cinematic Slow-Mo Luxury & Travel Reel",
      description: "Warm golden hour pacing with optical flow slow-motion and cinematic film borders.",
      longDescription: "Crafted for luxury lifestyle, automotive, and wedding videographers.",
      price: 299,
      originalPrice: 699,
      currency: "INR",
      category: "video-templates",
      tags: ["cinematic", "slow-mo", "capcut", "alight-motion"],
      images: ["https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80"],
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      capcutUrl: "https://www.capcut.com/template-detail/720000000004",
      alightMotionXmlUrl: "https://raw.githubusercontent.com/budostylz/ENTREPRENEURSHIP/master/Accounting.pdf",
      bpm: 110,
      requiredClipsCount: 10,
      features: ["Optical flow 60fps", "Kodak film border overlay", "LUT included"],
      rating: 4.9,
      reviewCount: 142,
      downloads: 2400,
      isFeatured: true,
      isNew: false,
      isBestseller: true,
      format: "CapCut & XML Template",
      createdAt: "2026-01-15",
    },
  ];

  const templates = useMemo(() => {
    const adminTemplates = productList.filter(
      (p) =>
        p.category === "video-templates" ||
        (p as any).productType === "video-template" ||
        (p as any).productType === "video"
    );
    const combined = [...adminTemplates];
    initialVideoTemplates.forEach((p) => {
      if (!combined.some((c) => c.id === p.id)) {
        combined.push(p);
      }
    });

    return combined.filter((p) => {
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      let matchesCat = true;
      if (selectedCategory !== "all") {
        matchesCat = Boolean(
          p.tags?.some((t) => t.toLowerCase().includes(selectedCategory)) ||
          p.title.toLowerCase().includes(selectedCategory)
        );
      }

      return matchesSearch && matchesCat;
    });
  }, [productList, search, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
          <Film className="h-3.5 w-3.5" />
          Short-Form Video Architecture
        </span>
        <h1 className="mt-4 apple-display text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl md:text-6xl">
          Beat-Synced <span className="text-indigo-600 dark:text-indigo-400">Video Templates</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
          Pre-timed velocity edits, lyrical typography animations, and beat shakes. Directly open in CapCut or download the raw XML project file for Alight Motion.
        </p>

        {/* Feature Highlights */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 shadow-xs">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>1-Click &ldquo;Use in CapCut&rdquo; Deep-Links</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 shadow-xs">
            <Download className="h-3.5 w-3.5 text-indigo-500" />
            <span>Alight Motion XML Project Downloads</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 shadow-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Auto-Beat Synced to Trending Sounds</span>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="mt-14 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {VIDEO_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates (velocity, lyrics)..."
            className="w-full rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-10 pr-4 py-2 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Video Templates 9:16 Vertical Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <VideoTemplateCard key={template.id} product={template} />
        ))}
      </div>
    </div>
  );
}
