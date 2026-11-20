"use client";

import { useEffect, useState, useRef } from "react";
import {
  Package,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Link as LinkIcon,
  Download,
  Filter,
  Eye,
  Copy,
  Star,
  Zap,
  Globe,
  Smartphone,
  Camera,
  Video,
  BookOpen,
  Calendar,
  Layers,
  Music,
  Type,
  Archive,
  Tag,
  IndianRupee,
  X,
  Save,
  Play,
  Pause,
  Image as ImageIcon,
  Film,
  UploadCloud,
  Check,
  Volume2,
  SlidersHorizontal,
} from "lucide-react";
import type { AdminProduct, ProductType, DeliveryType } from "@/lib/admin/types";
import { CATEGORIES, PRODUCT_TYPES, DELIVERY_TYPES } from "@/lib/constants";
import { BeforeAfterSlider } from "@/components/shared/before-after-slider";

// The 7 official shop categories for BADARSH
const SHOP_CATEGORY_TABS = [
  { id: "all", label: "All Products", icon: Package },
  { id: "bundles", label: "Bundles", icon: Archive, match: (p: AdminProduct) => p.category === "bundles" || p.productType === "bundle" },
  { id: "editing-apps", label: "Apps", icon: Smartphone, match: (p: AdminProduct) => p.category === "editing-apps" || p.productType === "app-license" },
  { id: "photo-presets", label: "Lightroom Presets", icon: Camera, match: (p: AdminProduct) => p.category === "photo-presets" || p.productType === "photo-preset" },
  { id: "editing-bundles", label: "Sound Effects & BGM", icon: Music, match: (p: AdminProduct) => p.category === "editing-bundles" || p.productType === "audio" || p.productType === "editing-bundle" },
  { id: "ebooks", label: "E-Books", icon: BookOpen, match: (p: AdminProduct) => p.category === "ebooks" || p.productType === "ebook" },
  { id: "planners", label: "Planners", icon: Calendar, match: (p: AdminProduct) => p.category === "planners" || p.productType === "planner" },
  { id: "templates", label: "Templates", icon: Layers, match: (p: AdminProduct) => ["social-media", "presentations", "branding", "business-cards"].includes(p.category) || p.productType === "canva-template" || (p.productType as any) === "template" },
];

const DEFAULT_PRODUCT: Partial<AdminProduct> = {
  title: "",
  description: "",
  price: 299,
  originalPrice: 599,
  category: "social-media",
  productType: "canva-template",
  deliveryType: "download-url",
  status: "published",
  images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80"],
  coverImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
  videoUrl: "",
  previewPdfUrl: "",
  pdfUrl: "",
  appDownloadUrl: "",
  appVersion: "",
  appPlatform: "",
  presetLinkUrl: "",
  beforeImage: "",
  afterImage: "",
  audioPreviewUrl: "",
  audioDuration: "",
  audioCategory: "",
  pageCount: 0,
  authorName: "",
  plannerCategory: "",
  overlayLinkUrl: "",
  canvaUrl: "",
  templateUrl: "",
  downloadUrl: "",
  externalUrl: "",
  googleDriveUrl: "",
  fileSize: "48 MB",
  softwareRequired: "Universal Web / Mobile App",
  isFeatured: false,
  isBestseller: false,
  isNew: true,
  tags: [],
  seoTitle: "",
  seoDescription: "",
};

function FormField({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-300">
        {label}
        {required && <span className="ml-1 text-[#FF5A36]">*</span>}
      </label>
      {hint && <p className="mb-1 text-[11px] text-zinc-500">{hint}</p>}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none transition-colors";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [editingProduct, setEditingProduct] = useState<Partial<AdminProduct> | null>(null);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Audio preview playback state in admin
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAudioToggle = (url: string) => {
    if (playingAudioUrl === url) {
      audioRef.current?.pause();
      setPlayingAudioUrl(null);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
      } else {
        audioRef.current.src = url;
      }
      audioRef.current.play().catch(() => {});
      audioRef.current.onended = () => setPlayingAudioUrl(null);
      setPlayingAudioUrl(url);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      if (res.ok) {
        await fetchProducts();
        setEditingProduct(null);
      }
    } catch (err) {
      console.error("Failed to save product:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Permanently delete this product from store? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleDuplicate = (p: AdminProduct) => {
    setEditingProduct({
      ...p,
      id: undefined,
      title: `${p.title} (Copy)`,
      status: "draft",
    });
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(id);
      setTimeout(() => setCopySuccess(null), 1500);
    });
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || !editingProduct) return;
    const existing = editingProduct.tags || [];
    if (!existing.includes(tag)) {
      setEditingProduct({ ...editingProduct, tags: [...existing, tag] });
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, tags: (editingProduct.tags || []).filter((t) => t !== tag) });
  };

  const createNewForTab = (tabId: string) => {
    const base = { ...DEFAULT_PRODUCT };
    if (tabId === "bundles") {
      base.category = "bundles";
      base.productType = "bundle";
      base.title = "New Editing Bundle";
      base.totalAssetsCount = "500+ Assets";
      base.deliveryType = "google-drive";
    } else if (tabId === "editing-apps") {
      base.category = "editing-apps";
      base.productType = "app-license";
      base.title = "New Creator App";
      base.appVersion = "v12.0 Pro";
      base.appPlatform = "Android 9+ / Mobile";
      base.deliveryType = "download-url";
    } else if (tabId === "photo-presets") {
      base.category = "photo-presets";
      base.productType = "photo-preset";
      base.title = "New Lightroom Preset";
      base.deliveryType = "external-url";
    } else if (tabId === "editing-bundles") {
      base.category = "editing-bundles";
      base.productType = "audio";
      base.title = "New Sound Effect & BGM";
      base.audioCategory = "Reels BGM";
      base.deliveryType = "google-drive";
    } else if (tabId === "ebooks") {
      base.category = "ebooks";
      base.productType = "ebook";
      base.title = "New Growth E-Book";
      base.authorName = "BADARSH Studio";
      base.deliveryType = "download-url";
    } else if (tabId === "planners") {
      base.category = "planners";
      base.productType = "planner";
      base.title = "New Productivity Planner";
      base.plannerCategory = "Daily Routine";
      base.deliveryType = "download-url";
    } else if (tabId === "templates") {
      base.category = "social-media";
      base.productType = "canva-template";
      base.title = "New Studio Template";
      base.deliveryType = "canva-link";
    }
    setEditingProduct(base);
  };

  // Filter products by selected tab and search
  const filteredProducts = products.filter((p) => {
    const tabDef = SHOP_CATEGORY_TABS.find((t) => t.id === activeTab);
    const matchesTab = !tabDef || tabDef.id === "all" || (tabDef.match ? tabDef.match(p) : p.category === activeTab);
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: products.length,
    published: products.filter((p) => p.status === "published").length,
    draft: products.filter((p) => p.status === "draft").length,
    featured: products.filter((p) => p.isFeatured).length,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-[#FF5A36]" />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Digital Shop Catalog Manager
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Control all 7 shop categories: Bundles, Apps, Lightroom Presets, Sound Effects &amp; BG Music, E-Books, Planners, and Templates.
          </p>
        </div>

        <button
          onClick={() => createNewForTab(activeTab)}
          className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A36] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Shop Items", value: stats.total, color: "text-white" },
          { label: "Published Live", value: stats.published, color: "text-emerald-400" },
          { label: "Drafted / Staged", value: stats.draft, color: "text-amber-400" },
          { label: "Featured Badged", value: stats.featured, color: "text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5 backdrop-blur-md">
            <p className="text-[11px] text-zinc-500">{s.label}</p>
            <p className={`mt-1 font-heading text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* 7 Shop Category Tabs Navigation */}
      <div className="flex flex-col gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {SHOP_CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const count =
              tab.id === "all"
                ? products.length
                : products.filter((p) => (tab.match ? tab.match(p) : p.category === tab.id)).length;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#FF5A36] text-white shadow-xs"
                    : "border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-zinc-800 text-zinc-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search row */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by title, tags or description..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pr-4 pl-9 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
            />
          </div>

          <span className="text-xs text-zinc-500">
            Showing <strong className="text-zinc-300">{filteredProducts.length}</strong> items in this category
          </span>
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Product Item</th>
                <th className="px-4 py-3 font-medium">Category Archetype</th>
                <th className="px-4 py-3 font-medium">Special Attributes</th>
                <th className="px-4 py-3 font-medium">Pricing</th>
                <th className="px-4 py-3 font-medium">Delivery</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-zinc-500">
                    No products found in this category. Click "Add New Product" to stage an asset.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const cover = p.images?.[0] || p.coverImageUrl;
                  const isAudio = Boolean(p.audioPreviewUrl);
                  const isPlaying = playingAudioUrl === p.audioPreviewUrl;

                  return (
                    <tr key={p.id} className="group hover:bg-zinc-900/30 transition-colors">
                      {/* Product Name & Thumbnail */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                            {cover ? (
                              <img src={cover} alt={p.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-zinc-600">
                                <Package className="h-5 w-5" />
                              </div>
                            )}

                            {/* Audio test play overlay */}
                            {isAudio && (
                              <button
                                type="button"
                                onClick={() => p.audioPreviewUrl && handleAudioToggle(p.audioPreviewUrl)}
                                className={`absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity ${
                                  isPlaying ? "opacity-100 bg-[#FF5A36]/80 text-white" : "opacity-0 group-hover:opacity-100 text-white"
                                }`}
                                title={isPlaying ? "Pause track" : "Play preview"}
                              >
                                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                              </button>
                            )}
                          </div>

                          <div className="min-w-0 max-w-xs">
                            <span className="font-heading font-semibold text-white truncate block">
                              {p.title}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-zinc-500">
                              <span>{p.fileSize || "Cloud Link"}</span>
                              {p.isFeatured && (
                                <span className="rounded bg-blue-500/15 px-1 py-0.2 text-[9px] font-bold text-blue-400">
                                  FEATURED
                                </span>
                              )}
                              {p.isBestseller && (
                                <span className="rounded bg-[#FF5A36]/15 px-1 py-0.2 text-[9px] font-bold text-[#FF5A36]">
                                  BESTSELLER
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="px-4 py-3.5">
                        <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-[11px] font-medium text-zinc-300 border border-zinc-800 capitalize">
                          {p.category.replace("-", " ")}
                        </span>
                      </td>

                      {/* Archetype Attributes */}
                      <td className="px-4 py-3.5 text-zinc-400">
                        {p.category === "bundles" && (
                          <span className="text-[11px] font-medium text-amber-400">
                            {p.totalAssetsCount || "Curated Pack"}
                          </span>
                        )}
                        {p.category === "editing-apps" && (
                          <div className="text-[11px]">
                            <span className="text-emerald-400 font-semibold">{p.appVersion || "Verified"}</span>
                            <span className="text-zinc-500 block">{p.appPlatform || "Mobile"}</span>
                          </div>
                        )}
                        {p.category === "photo-presets" && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-blue-400">
                            <Camera className="h-3 w-3" />
                            <span>Before/After Preset</span>
                          </span>
                        )}
                        {p.category === "editing-bundles" && (
                          <div className="flex items-center gap-1 text-[11px] text-[#FF5A36]">
                            <Music className="h-3 w-3" />
                            <span>{p.audioDuration || "0:45"} &bull; {p.audioCategory || "Audio Track"}</span>
                          </div>
                        )}
                        {(p.category === "ebooks" || p.category === "planners") && (
                          <span className="text-[11px] text-zinc-300">
                            {p.pageCount ? `${p.pageCount} Pages` : "PDF Edition"}
                          </span>
                        )}
                        {!["bundles", "editing-apps", "photo-presets", "editing-bundles", "ebooks", "planners"].includes(p.category) && (
                          <span className="text-[11px] text-zinc-500">Design Template</span>
                        )}
                      </td>

                      {/* Pricing */}
                      <td className="px-4 py-3.5">
                        <div className="font-heading font-bold text-white">
                          ₹{p.price.toLocaleString("en-IN")}
                        </div>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-[10px] text-zinc-500 line-through">
                            ₹{p.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </td>

                      {/* Delivery Link / Type */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 text-zinc-400">
                          {p.googleDriveUrl ? (
                            <button
                              type="button"
                              onClick={() => handleCopyUrl(p.googleDriveUrl!, p.id)}
                              className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-0.5 text-[11px] text-emerald-400 hover:bg-zinc-800 transition-colors"
                              title="Copy Google Drive link"
                            >
                              <LinkIcon className="h-3 w-3" />
                              <span>{copySuccess === p.id ? "Copied!" : "Drive Link"}</span>
                            </button>
                          ) : p.downloadUrl ? (
                            <span className="text-[11px] text-zinc-400">Direct Download</span>
                          ) : p.canvaUrl || p.templateUrl ? (
                            <span className="text-[11px] text-blue-400">Project Share</span>
                          ) : (
                            <span className="text-[11px] text-zinc-500">External</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            p.status === "published"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : p.status === "archived"
                              ? "bg-zinc-700/50 text-zinc-500"
                              : "bg-amber-500/15 text-amber-400"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleDuplicate(p)}
                            className="rounded-lg p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                            title="Duplicate Product"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="rounded-lg p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Edit / Create Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-white">
                  {editingProduct.id ? `Edit: ${editingProduct.title}` : "Create New Store Product"}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Category: <span className="text-[#FF5A36] font-semibold capitalize">{editingProduct.category}</span> &bull; All fields are synchronized live.
                </p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="rounded-full p-2 text-zinc-500 hover:bg-zinc-900 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="divide-y divide-zinc-800/60">
              {/* Section 1: Basic Info */}
              <div className="p-6 space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  Product Core Details
                </p>

                <FormField label="Product Title" required>
                  <input
                    type="text"
                    value={editingProduct.title || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    required
                    placeholder="e.g. Cinematic Video Editing Bundle 2026"
                    className={inputCls}
                  />
                </FormField>

                <FormField label="Short Description" hint="Max 160 characters. Appears on product cards and search results.">
                  <textarea
                    rows={2}
                    value={editingProduct.description || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className={inputCls}
                    placeholder="Curated production assets designed for Indian creators and agencies..."
                  />
                </FormField>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField label="Shop Category" required>
                    <select
                      value={editingProduct.category || "social-media"}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                      className={inputCls}
                    >
                      {CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Product Type" required>
                    <select
                      value={editingProduct.productType || "canva-template"}
                      onChange={(e) => setEditingProduct({ ...editingProduct, productType: e.target.value as ProductType })}
                      className={inputCls}
                    >
                      {PRODUCT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Publish Status" required>
                    <select
                      value={editingProduct.status || "published"}
                      onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as any })}
                      className={inputCls}
                    >
                      <option value="published">Published (Live)</option>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </FormField>
                </div>
              </div>

              {/* Section 2: ARCHETYPE SPECIFIC FIELDS (Bundles, Apps, Presets, SFX, Books, Planners) */}
              <div className="p-6 space-y-4 bg-zinc-950/40 border-l-2 border-[#FF5A36]">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#FF5A36]">
                  Category Archetype Configuration ({editingProduct.category})
                </p>

                {/* BUNDLES */}
                {(editingProduct.category === "bundles" || editingProduct.productType === "bundle") && (
                  <div className="space-y-4">
                    <FormField
                      label="Total Assets Count in Bundle"
                      hint="e.g. 700+ Production Assets, 120 LUTs, 4K Motion Overlays"
                    >
                      <input
                        type="text"
                        value={editingProduct.totalAssetsCount || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, totalAssetsCount: e.target.value })}
                        placeholder="700+ Assets, 4K Footage & Sound FX"
                        className={inputCls}
                      />
                    </FormField>

                    <FormField
                      label="Google Drive Master Asset Folder / ZIP Link"
                      hint="Upload your bundle to Google Drive & paste share link here"
                    >
                      <input
                        type="url"
                        value={editingProduct.googleDriveUrl || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, googleDriveUrl: e.target.value })}
                        placeholder="https://drive.google.com/drive/folders/..."
                        className={inputCls}
                      />
                    </FormField>
                  </div>
                )}

                {/* APPS (ZERO APK MENTIONS) */}
                {(editingProduct.category === "editing-apps" || editingProduct.productType === "app-license") && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="App Version" hint="e.g. v12.4 Pro Unlocked">
                        <input
                          type="text"
                          value={editingProduct.appVersion || ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, appVersion: e.target.value })}
                          placeholder="v12.4 Pro Unlocked"
                          className={inputCls}
                        />
                      </FormField>

                      <FormField label="Platform Compatibility" hint="e.g. Android 9+ / Mobile / iOS">
                        <input
                          type="text"
                          value={editingProduct.appPlatform || ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, appPlatform: e.target.value })}
                          placeholder="Android 9.0+ / Mobile"
                          className={inputCls}
                        />
                      </FormField>
                    </div>

                    <FormField
                      label="Cloud Download URL (Direct Google Drive or Hosted Link)"
                      hint="Direct download link provided to customers after download click"
                    >
                      <input
                        type="url"
                        value={editingProduct.appDownloadUrl || editingProduct.downloadUrl || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            appDownloadUrl: e.target.value,
                            downloadUrl: e.target.value,
                          })
                        }
                        placeholder="https://drive.google.com/file/d/.../view"
                        className={inputCls}
                      />
                    </FormField>
                  </div>
                )}

                {/* LIGHTROOM PRESETS */}
                {(editingProduct.category === "photo-presets" || editingProduct.productType === "photo-preset") && (
                  <div className="space-y-4">
                    <FormField
                      label="Lightroom Share Link or DNG Download URL"
                      hint="Direct Adobe Lightroom share link or DNG preset link"
                    >
                      <input
                        type="url"
                        value={editingProduct.presetLinkUrl || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, presetLinkUrl: e.target.value })}
                        placeholder="https://lightroom.adobe.com/shares/..."
                        className={inputCls}
                      />
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Before Image URL (RAW Photo)" hint="Used for Before/After comparison slider">
                        <input
                          type="url"
                          value={editingProduct.beforeImage || ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, beforeImage: e.target.value })}
                          placeholder="https://images.unsplash.com/... (Raw unedited)"
                          className={inputCls}
                        />
                      </FormField>

                      <FormField label="After Image URL (Color Graded)" hint="Used for Before/After comparison slider">
                        <input
                          type="url"
                          value={editingProduct.afterImage || ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, afterImage: e.target.value })}
                          placeholder="https://images.unsplash.com/... (Color graded)"
                          className={inputCls}
                        />
                      </FormField>
                    </div>

                    {/* Live Before/After Slider Test right in modal */}
                    {editingProduct.beforeImage && editingProduct.afterImage && (
                      <div className="rounded-xl border border-zinc-800 bg-black/60 p-3 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                          Live In-Modal Before/After Slider Test:
                        </span>
                        <div className="h-56 w-full max-w-md mx-auto">
                          <BeforeAfterSlider
                            beforeImage={editingProduct.beforeImage}
                            afterImage={editingProduct.afterImage}
                            beforeLabel="RAW Before"
                            afterLabel="Graded After"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SOUND EFFECTS & BG MUSIC */}
                {(editingProduct.category === "editing-bundles" || editingProduct.productType === "audio" || editingProduct.productType === "editing-bundle") && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Audio Preview Stream URL" hint="Direct MP3/WAV/OGG stream link for web player">
                        <input
                          type="url"
                          value={editingProduct.audioPreviewUrl || ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, audioPreviewUrl: e.target.value })}
                          placeholder="https://actions.google.com/sounds/v1/...ogg or MP3"
                          className={inputCls}
                        />
                      </FormField>

                      <FormField label="Audio Duration" hint="e.g. 1:45, 2:30">
                        <input
                          type="text"
                          value={editingProduct.audioDuration || ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, audioDuration: e.target.value })}
                          placeholder="1:30"
                          className={inputCls}
                        />
                      </FormField>
                    </div>

                    <FormField label="Sound Effect / Music Category" hint="e.g. Reels BGM, Cinematic, Ambient, Transitions, Horror, Lo-Fi">
                      <input
                        type="text"
                        value={editingProduct.audioCategory || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, audioCategory: e.target.value })}
                        placeholder="Reels BGM"
                        className={inputCls}
                      />
                    </FormField>

                    {/* Live in-modal audio preview */}
                    {editingProduct.audioPreviewUrl && (
                      <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4 text-[#FF5A36]" />
                          <span className="text-xs text-white font-medium">Test Audio Stream Player</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAudioToggle(editingProduct.audioPreviewUrl!)}
                          className="flex items-center gap-1.5 rounded-lg bg-[#FF5A36] px-3 py-1 text-xs font-semibold text-white"
                        >
                          {playingAudioUrl === editingProduct.audioPreviewUrl ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                          <span>{playingAudioUrl === editingProduct.audioPreviewUrl ? "Pause" : "Play"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* E-BOOKS & PLANNERS */}
                {(editingProduct.category === "ebooks" || editingProduct.category === "planners" || editingProduct.productType === "ebook" || editingProduct.productType === "planner") && (
                  <div className="space-y-4">
                    <FormField
                      label="In-Browser PDF Reader Preview URL"
                      hint="Google Drive preview link or direct PDF URL for on-site reader"
                    >
                      <input
                        type="url"
                        value={editingProduct.previewPdfUrl || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, previewPdfUrl: e.target.value })}
                        placeholder="https://drive.google.com/file/d/FILE_ID/preview or https://...pdf"
                        className={inputCls}
                      />
                    </FormField>

                    <FormField
                      label="Full High-Quality PDF Download Link (For Buyers)"
                      hint="Protected link delivered to verified buyers"
                    >
                      <input
                        type="url"
                        value={editingProduct.pdfUrl || editingProduct.downloadUrl || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            pdfUrl: e.target.value,
                            downloadUrl: e.target.value,
                          })
                        }
                        placeholder="https://drive.google.com/uc?export=download&id=FILE_ID"
                        className={inputCls}
                      />
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Total Page Count" hint="e.g. 142">
                        <input
                          type="number"
                          value={editingProduct.pageCount || ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, pageCount: parseInt(e.target.value) || 0 })}
                          placeholder="120"
                          className={inputCls}
                        />
                      </FormField>

                      <FormField
                        label={editingProduct.category === "ebooks" ? "Author / Studio Name" : "Planner Sub-Category"}
                        hint={editingProduct.category === "ebooks" ? "e.g. BADARSH Research" : "e.g. Fitness, Finance, Habit Tracker"}
                      >
                        <input
                          type="text"
                          value={editingProduct.authorName || editingProduct.plannerCategory || ""}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              authorName: e.target.value,
                              plannerCategory: e.target.value,
                            })
                          }
                          placeholder="BADARSH Studio"
                          className={inputCls}
                        />
                      </FormField>
                    </div>
                  </div>
                )}

                {/* TEMPLATES */}
                {["social-media", "presentations", "branding", "business-cards"].includes(editingProduct.category || "") && (
                  <FormField
                    label="Template Project Share Link"
                    hint="Direct link for customer to open, duplicate, or customize the template"
                  >
                    <input
                      type="url"
                      value={editingProduct.canvaUrl || editingProduct.templateUrl || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          canvaUrl: e.target.value,
                          templateUrl: e.target.value,
                        })
                      }
                      placeholder="https://..."
                      className={inputCls}
                    />
                  </FormField>
                )}
              </div>

              {/* Section 3: Media & Video Showcase */}
              <div className="p-6 space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  Media &amp; Visual Showcase
                </p>

                <FormField label="Primary Cover Image URL" required hint="CDN link, Unsplash, or local /images/...">
                  <input
                    type="url"
                    value={editingProduct.images?.[0] || editingProduct.coverImageUrl || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const imgs = [...(editingProduct.images || [])];
                      imgs[0] = val;
                      setEditingProduct({
                        ...editingProduct,
                        images: imgs,
                        coverImageUrl: val,
                      });
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className={inputCls}
                  />
                </FormField>

                <FormField label="Demo Video URL (YouTube or MP4)" hint="Optional trailer or motion demo shown on product page">
                  <input
                    type="text"
                    value={editingProduct.videoUrl || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... or https://...preview.mp4"
                    className={inputCls}
                  />
                </FormField>
              </div>

              {/* Section 4: Pricing & Delivery */}
              <div className="p-6 space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  Pricing &amp; Delivery Method
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Selling Price (₹ INR)" required>
                    <div className="relative">
                      <IndianRupee className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="number"
                        value={editingProduct.price ?? 299}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className={`${inputCls} pl-8`}
                        min={0}
                      />
                    </div>
                  </FormField>

                  <FormField label="Original Strike Price (₹ INR)" hint="Optional, shows strike-through discount">
                    <div className="relative">
                      <IndianRupee className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="number"
                        value={editingProduct.originalPrice || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                        className={`${inputCls} pl-8`}
                        min={0}
                        placeholder="599"
                      />
                    </div>
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Delivery Method" required>
                    <select
                      value={editingProduct.deliveryType || "download-url"}
                      onChange={(e) => setEditingProduct({ ...editingProduct, deliveryType: e.target.value as DeliveryType })}
                      className={inputCls}
                    >
                      {DELIVERY_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="File Size" hint="e.g. 84 MB, 1.2 GB">
                    <input
                      type="text"
                      value={editingProduct.fileSize || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, fileSize: e.target.value })}
                      placeholder="48 MB"
                      className={inputCls}
                    />
                  </FormField>
                </div>
              </div>

              {/* Section 5: Badges & Tags */}
              <div className="p-6 space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  Badges &amp; Tags
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { label: "Featured Asset", key: "isFeatured" },
                    { label: "Bestseller Badge", key: "isBestseller" },
                    { label: "New Release", key: "isNew" },
                  ].map((b) => (
                    <label
                      key={b.key}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 hover:bg-zinc-900"
                    >
                      <span className="text-xs font-medium text-zinc-300">{b.label}</span>
                      <input
                        type="checkbox"
                        checked={(editingProduct as any)[b.key] || false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, [b.key]: e.target.checked })}
                        className="rounded border-zinc-700 text-[#FF5A36] focus:ring-[#FF5A36]"
                      />
                    </label>
                  ))}
                </div>

                <FormField label="Search Tags" hint="Press Enter or comma to add tag">
                  <div className="flex flex-wrap gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 p-2">
                    {(editingProduct.tags || []).map((tag) => (
                      <span key={tag} className="flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-0.5 text-[11px] text-zinc-300">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-zinc-500 hover:text-red-400">
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Add tag..."
                      className="flex-1 min-w-[80px] bg-transparent text-xs text-white outline-none placeholder:text-zinc-600"
                    />
                  </div>
                </FormField>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-4">
                <span className="text-[11px] text-zinc-500">
                  {editingProduct.id ? "Live product will be updated immediately." : "Product will appear live on store once saved."}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="cursor-pointer rounded-xl border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#FF5A36] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] active:scale-[0.98] disabled:opacity-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{saving ? "Saving Changes..." : "Save Product"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
