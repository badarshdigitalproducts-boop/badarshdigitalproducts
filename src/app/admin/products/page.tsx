"use client";

import { useEffect, useState } from "react";
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
  Image as ImageIcon,
  Film,
  UploadCloud,
} from "lucide-react";
import type { AdminProduct, ProductType, DeliveryType } from "@/lib/admin/types";
import { CATEGORIES, PRODUCT_TYPES, DELIVERY_TYPES } from "@/lib/constants";

const PRODUCT_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "canva-template": Layers,
  "ebook": BookOpen,
  "planner": Calendar,
  "app-license": Smartphone,
  "video-preset": Video,
  "photo-preset": Camera,
  "bundle": Package,
  "editing-bundle": Archive,
  "website-template": Globe,
  "audio": Music,
  "font-pack": Type,
  "other": Tag,
};

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
  canvaUrl: "",
  downloadUrl: "",
  externalUrl: "",
  googleDriveUrl: "",
  fileSize: "48 MB",
  softwareRequired: "Canva Free / CapCut / Premiere Pro",
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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [editingProduct, setEditingProduct] = useState<Partial<AdminProduct> | null>(null);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

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
    if (!confirm("Permanently delete this product? This cannot be undone.")) return;
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

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchesType = selectedType === "all" || p.productType === selectedType;
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesType && matchesSearch;
  });

  const stats = {
    total: products.length,
    published: products.filter((p) => p.status === "published").length,
    draft: products.filter((p) => p.status === "draft").length,
    featured: products.filter((p) => p.isFeatured).length,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-[#FF5A36]" />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Product Catalog Manager
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Manage all digital products — Canva templates, e-books, apps, presets, bundles & more. Everything published here is live on the store.
          </p>
        </div>
        <button
          onClick={() => setEditingProduct({ ...DEFAULT_PRODUCT })}
          className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A36] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Products", value: stats.total, color: "text-white" },
          { label: "Published Live", value: stats.published, color: "text-emerald-400" },
          { label: "In Draft", value: stats.draft, color: "text-amber-400" },
          { label: "Featured", value: stats.featured, color: "text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5 backdrop-blur-md">
            <p className="text-[11px] text-zinc-500">{s.label}</p>
            <p className={`mt-1 font-heading text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 border-b border-zinc-800/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category filter */}
          <div className="flex items-center gap-1 text-[11px] text-zinc-500">
            <Filter className="h-3 w-3" />
            <span>Category:</span>
          </div>
          {[{ value: "all", label: "All" }, ...CATEGORIES.filter((c) => c.value !== "all")].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                selectedCategory === cat.value
                  ? "bg-[#FF5A36] text-white"
                  : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
            >
              {cat.label}
              {cat.value !== "all" && (
                <span className="ml-1 text-[10px] opacity-60">
                  ({products.filter((p) => p.category === cat.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pr-4 pl-9 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Delivery</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-zinc-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FF5A36] border-t-transparent" />
                      Loading products...
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-zinc-500">
                    No products found. Add your first product above.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const TypeIcon = PRODUCT_TYPE_ICONS[p.productType || "other"] || Tag;
                  const deliveryUrl = p.canvaUrl || p.downloadUrl || p.externalUrl || p.googleDriveUrl || "";
                  return (
                    <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                            <img
                              src={p.images?.[0] || "/images/products/product-1.png"}
                              alt={p.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-semibold text-white">
                              {p.title}
                              {p.isFeatured && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                              {p.isNew && <Zap className="h-3 w-3 text-blue-400" />}
                              {p.videoUrl && (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-red-500/20 border border-red-500/40 px-1.5 py-0.2 text-[9px] font-bold text-red-400">
                                  <Play className="h-2 w-2 fill-red-400" /> Video Demo
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-zinc-500">
                              {(p.downloads || 0).toLocaleString()} downloads
                              {p.tags?.length ? ` • ${p.tags.slice(0, 2).join(", ")}` : ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          <TypeIcon className="h-3.5 w-3.5 text-zinc-500" />
                          <span className="capitalize">
                            {(p.productType || "template").replace(/-/g, " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 capitalize text-zinc-300">
                        {(p.category || "").replace(/-/g, " ")}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-white">
                        ₹{p.price}
                        {p.originalPrice && (
                          <span className="ml-1.5 text-[11px] font-normal text-zinc-500 line-through">
                            ₹{p.originalPrice}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {deliveryUrl ? (
                          <div className="flex items-center gap-1.5">
                            <a
                              href={deliveryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 hover:underline"
                            >
                              <LinkIcon className="h-3 w-3" />
                              {p.deliveryType === "canva-link" ? "Canva" :
                               p.deliveryType === "google-drive" ? "Drive" :
                               p.deliveryType === "download-url" ? "Download" : "Link"}
                            </a>
                            <button
                              onClick={() => handleCopyUrl(deliveryUrl, p.id)}
                              className="text-zinc-600 hover:text-zinc-300 transition-colors"
                              title="Copy URL"
                            >
                              {copySuccess === p.id ? (
                                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-zinc-600">Not set</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
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
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`/templates/${p.slug || p.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                            title="Preview on Store"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </a>
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
                  {editingProduct.id ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  All fields marked <span className="text-[#FF5A36]">*</span> are required.
                </p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="rounded-full p-2 text-zinc-500 hover:bg-zinc-900 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="divide-y divide-zinc-800/60">
              {/* Section: Basic Info */}
              <div className="p-6 space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  Basic Information
                </p>

                <FormField label="Product Title" required>
                  <input
                    type="text"
                    value={editingProduct.title || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    required
                    placeholder="e.g. Instagram Reels Canva Template Pack 2026"
                    className={inputCls}
                  />
                </FormField>

                <FormField label="Short Description" hint="Max 160 characters. Used on product cards and SEO.">
                  <textarea
                    rows={2}
                    value={editingProduct.description || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className={inputCls}
                    placeholder="High-converting Instagram Reel templates designed for Indian creators..."
                  />
                </FormField>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

                  <FormField label="Category" required>
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

                {/* Tags */}
                <FormField label="Tags" hint="Press Enter or comma to add a tag">
                  <div className="flex flex-wrap gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 p-2 focus-within:border-[#FF5A36] transition-colors">
                    {(editingProduct.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-0.5 text-[11px] font-medium text-zinc-300"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-zinc-500 hover:text-red-400"
                        >
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
                      placeholder="Add a tag..."
                      className="flex-1 min-w-[80px] bg-transparent text-xs text-white outline-none placeholder:text-zinc-600"
                    />
                  </div>
                </FormField>
              </div>

              {/* Section: Media & Visual Assets (Photos, Gallery & Video Preview) */}
              <div className="p-6 space-y-5 bg-zinc-950/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#FF5A36]">
                      Media &amp; Visual Showcase
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Upload and link custom preview images, product photo galleries, and video editing demos.
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-[11px] text-zinc-300">
                    <Film className="h-3 w-3 text-[#FF5A36]" />
                    <span>In-House Studio Assets</span>
                  </span>
                </div>

                {/* Cover Image */}
                <FormField
                  label="Primary Cover Image URL"
                  required
                  hint="Paste image link from CDN, Imgur, Firebase, Unsplash, or local /images/..."
                >
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <ImageIcon className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="url"
                          value={editingProduct.images?.[0] || editingProduct.coverImageUrl || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            const currentImgs = [...(editingProduct.images || [])];
                            currentImgs[0] = val;
                            setEditingProduct({
                              ...editingProduct,
                              images: currentImgs,
                              coverImageUrl: val,
                            });
                          }}
                          placeholder="https://images.unsplash.com/... or /images/products/product-1.png"
                          className={`${inputCls} pl-8`}
                        />
                      </div>
                    </div>

                    {/* Quick Preset Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="text-zinc-500 font-medium">Quick Presets:</span>
                      {[
                        { label: "Canva Studio Pack", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80" },
                        { label: "Video Motion SFX", url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80" },
                        { label: "Creator Apps & Code", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80" },
                        { label: "Cinematic Lightroom", url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80" },
                        { label: "E-Book Masterclass", url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=80" },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            const currentImgs = [...(editingProduct.images || [])];
                            currentImgs[0] = preset.url;
                            setEditingProduct({
                              ...editingProduct,
                              images: currentImgs,
                              coverImageUrl: preset.url,
                            });
                          }}
                          className="cursor-pointer rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-300 hover:border-[#FF5A36]/40 hover:text-white transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Live Preview Thumbnail Box */}
                    {(editingProduct.images?.[0] || editingProduct.coverImageUrl) && (
                      <div className="relative aspect-[16/9] max-w-sm overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                        <img
                          src={editingProduct.images?.[0] || editingProduct.coverImageUrl}
                          alt="Cover Preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <div className="absolute top-2 left-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                          Live Cover Preview
                        </div>
                      </div>
                    )}
                  </div>
                </FormField>

                {/* Additional Gallery Images */}
                <FormField
                  label="Product Image Gallery (Additional Screenshots & Slides)"
                  hint="Add slides, before/after comparisons, and interior preview angles"
                >
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Paste image URL and click '+ Add'"
                        className={inputCls}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newImageUrl.trim()) {
                              const imgs = [...(editingProduct.images || [])];
                              imgs.push(newImageUrl.trim());
                              setEditingProduct({ ...editingProduct, images: imgs });
                              setNewImageUrl("");
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newImageUrl.trim()) {
                            const imgs = [...(editingProduct.images || [])];
                            imgs.push(newImageUrl.trim());
                            setEditingProduct({ ...editingProduct, images: imgs });
                            setNewImageUrl("");
                          }
                        }}
                        className="cursor-pointer rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors shrink-0"
                      >
                        + Add Image
                      </button>
                    </div>

                    {/* Gallery Thumbnails List */}
                    <div className="flex flex-wrap gap-2.5">
                      {(editingProduct.images || []).map((img, i) => (
                        <div
                          key={`${img}-${i}`}
                          className="group relative h-16 w-24 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                        >
                          <img
                            src={img}
                            alt={`Gallery ${i}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const imgs = (editingProduct.images || []).filter((_, idx) => idx !== i);
                              setEditingProduct({ ...editingProduct, images: imgs });
                            }}
                            className="cursor-pointer absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            title="Remove image"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[9px] text-zinc-300">
                            #{i + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FormField>

                {/* Video Preview / Reel Demo */}
                <FormField
                  label="Demo / Preview Video URL (Reel, MP4, or YouTube Embed)"
                  hint="Show real video editing pacing, motion overlays, or app walkthroughs to boost conversions"
                >
                  <div className="space-y-3">
                    <div className="relative">
                      <Video className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        value={editingProduct.videoUrl || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, videoUrl: e.target.value })}
                        placeholder="e.g. https://www.youtube.com/watch?v=... or https://cdn.../preview.mp4"
                        className={`${inputCls} pl-8`}
                      />
                    </div>

                    {/* Quick Demo Video Presets for BADARSH Studio */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="text-zinc-500 font-medium">Sample Reels / Demos:</span>
                      {[
                        { label: "Viral SFX & Pacing Demo", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
                        { label: "Motion Graphics Reel", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
                        { label: "Shorts Video Editing", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
                      ].map((demo) => (
                        <button
                          key={demo.label}
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, videoUrl: demo.url })}
                          className="cursor-pointer rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-300 hover:border-[#FF5A36]/40 hover:text-white transition-colors"
                        >
                          {demo.label}
                        </button>
                      ))}
                    </div>

                    {/* Video Player Live Preview */}
                    {editingProduct.videoUrl && (
                      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-black p-2">
                        <div className="flex items-center justify-between pb-2 px-1 text-[11px] text-zinc-400">
                          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                            <Play className="h-3 w-3" /> Live Video Preview Player
                          </span>
                          <span>Will render on storefront product card &amp; details</span>
                        </div>
                        {editingProduct.videoUrl.includes("youtube.com") || editingProduct.videoUrl.includes("youtu.be") ? (
                          <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden">
                            <iframe
                              src={`https://www.youtube-nocookie.com/embed/${
                                editingProduct.videoUrl.includes("v=")
                                  ? editingProduct.videoUrl.split("v=")[1]?.split("&")[0]
                                  : editingProduct.videoUrl.split("/").pop()
                              }`}
                              title="Product Demo Video"
                              className="h-full w-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <video
                            controls
                            src={editingProduct.videoUrl}
                            className="aspect-[16/9] w-full rounded-lg bg-black object-contain"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </FormField>
              </div>

              {/* Section: Pricing */}
              <div className="p-6 space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  Pricing
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Selling Price (₹ INR)" required>
                    <div className="relative">
                      <IndianRupee className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="number"
                        value={editingProduct.price || 299}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className={`${inputCls} pl-8`}
                        min={0}
                      />
                    </div>
                  </FormField>
                  <FormField label="Original Strike Price (₹ INR)" hint="Leave blank or same as selling price to hide discount">
                    <div className="relative">
                      <IndianRupee className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="number"
                        value={editingProduct.originalPrice || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                        className={`${inputCls} pl-8`}
                        min={0}
                        placeholder="0"
                      />
                    </div>
                  </FormField>
                </div>
              </div>

              {/* Section: Delivery */}
              <div className="p-6 space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  Delivery Method
                </p>
                <FormField label="Delivery Type" required hint="Choose how the customer receives this product after purchase">
                  <select
                    value={editingProduct.deliveryType || "canva-link"}
                    onChange={(e) => setEditingProduct({ ...editingProduct, deliveryType: e.target.value as DeliveryType })}
                    className={inputCls}
                  >
                    {DELIVERY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </FormField>

                {(editingProduct.deliveryType === "canva-link" || !editingProduct.deliveryType) && (
                  <FormField label="Canva Template Share Link" hint="The direct 'Use Template' link from Canva">
                    <input
                      type="url"
                      value={editingProduct.canvaUrl || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, canvaUrl: e.target.value })}
                      placeholder="https://www.canva.com/design/..."
                      className={inputCls}
                    />
                  </FormField>
                )}

                {editingProduct.deliveryType === "download-url" && (
                  <FormField label="Direct Download URL" hint="ZIP file, PDF, or hosted file URL">
                    <input
                      type="url"
                      value={editingProduct.downloadUrl || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, downloadUrl: e.target.value })}
                      placeholder="https://cdn.yourdomain.com/files/product.zip"
                      className={inputCls}
                    />
                  </FormField>
                )}

                {editingProduct.deliveryType === "google-drive" && (
                  <FormField label="Google Drive Share Link" hint="Must be set to 'Anyone with link can view/download'">
                    <input
                      type="url"
                      value={editingProduct.googleDriveUrl || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, googleDriveUrl: e.target.value })}
                      placeholder="https://drive.google.com/file/d/..."
                      className={inputCls}
                    />
                  </FormField>
                )}

                {editingProduct.deliveryType === "external-url" && (
                  <FormField label="External URL" hint="Gumroad, LemonSqueezy, Payhip, or any other external store">
                    <input
                      type="url"
                      value={editingProduct.externalUrl || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, externalUrl: e.target.value })}
                      placeholder="https://gumroad.com/l/..."
                      className={inputCls}
                    />
                  </FormField>
                )}

                {editingProduct.deliveryType === "whatsapp-delivery" && (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-300">
                    ⚠️ WhatsApp delivery is manual. After a customer pays, you must send the file on WhatsApp manually. Use this only for custom/service-based products.
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="File Size" hint="e.g. 25 MB, 2.4 GB">
                    <input
                      type="text"
                      value={editingProduct.fileSize || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, fileSize: e.target.value })}
                      placeholder="e.g. 48 MB"
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Software Required" hint="e.g. Canva Free, Lightroom, Premiere Pro">
                    <input
                      type="text"
                      value={editingProduct.softwareRequired || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, softwareRequired: e.target.value })}
                      placeholder="e.g. Canva Free, Adobe Lightroom"
                      className={inputCls}
                    />
                  </FormField>
                </div>
              </div>

              {/* Section: Badges & Visibility */}
              <div className="p-6 space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  Badges &amp; Visibility
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { key: "isFeatured", icon: Star, label: "Featured Product", desc: "Show in homepage featured section" },
                    { key: "isBestseller", icon: Zap, label: "Bestseller Badge", desc: "Show orange bestseller ribbon" },
                    { key: "isNew", icon: CheckCircle2, label: "New Badge", desc: "Show blue NEW badge" },
                  ].map(({ key, icon: Icon, label, desc }) => (
                    <label
                      key={key}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                        editingProduct[key as keyof typeof editingProduct]
                          ? "border-[#FF5A36]/40 bg-[#FF5A36]/10"
                          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!editingProduct[key as keyof typeof editingProduct]}
                        onChange={(e) => setEditingProduct({ ...editingProduct, [key]: e.target.checked })}
                        className="sr-only"
                      />
                      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${editingProduct[key as keyof typeof editingProduct] ? "text-[#FF5A36]" : "text-zinc-500"}`} />
                      <div>
                        <p className="text-xs font-semibold text-white">{label}</p>
                        <p className="text-[11px] text-zinc-500">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section: SEO */}
              <div className="p-6 space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  SEO (optional)
                </p>
                <FormField label="SEO Title" hint="If blank, product title is used. Keep under 60 chars.">
                  <input
                    type="text"
                    value={editingProduct.seoTitle || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, seoTitle: e.target.value })}
                    maxLength={60}
                    placeholder="Custom browser tab title for this product"
                    className={inputCls}
                  />
                </FormField>
                <FormField label="SEO Meta Description" hint="Max 155 characters for Google snippets.">
                  <textarea
                    rows={2}
                    value={editingProduct.seoDescription || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, seoDescription: e.target.value })}
                    maxLength={155}
                    placeholder="Describe this product for search engines..."
                    className={inputCls}
                  />
                </FormField>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between gap-3 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="rounded-xl border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProduct({ ...editingProduct, status: "draft" })}
                    className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#FF5A36] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] disabled:opacity-50 transition-all active:scale-[0.98]"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {saving ? "Saving..." : editingProduct.id ? "Update Product" : "Publish Product"}
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
