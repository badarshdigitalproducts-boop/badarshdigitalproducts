"use client";

import { useEffect, useState } from "react";
import {
  Archive,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Copy,
  IndianRupee,
  Link as LinkIcon,
  Video,
  Play,
  Save,
  X,
  Sparkles,
} from "lucide-react";
import type { AdminProduct } from "@/lib/admin/types";
import { FileUploader } from "@/components/admin/file-uploader";

export default function BundlesAdminPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingBundle, setEditingBundle] = useState<Partial<AdminProduct> | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      const all: AdminProduct[] = data.products || [];
      setProducts(all.filter((p) => p.category === "bundles" || p.productType === "bundle"));
    } catch (err) {
      console.error("Failed to load bundles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBundle?.title) return;

    setSaving(true);
    try {
      const payload: Partial<AdminProduct> = {
        ...editingBundle,
        category: "bundles",
        productType: "bundle",
        deliveryType: editingBundle.googleDriveUrl ? "google-drive" : "download-url",
        status: editingBundle.status || "published",
        price: Number(editingBundle.price) || 299,
        originalPrice: editingBundle.originalPrice ? Number(editingBundle.originalPrice) : undefined,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchBundles();
        setEditingBundle(null);
      }
    } catch (err) {
      console.error("Error saving bundle:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this bundle?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting bundle:", err);
    }
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const filtered = products.filter(
    (p) =>
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-[#FF5A36]" />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Editing Bundles Manager
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Manage creator editing bundles, 4K clips, transitions, and production assets. Hosted via Google Drive or direct cloud storage.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingBundle({
              title: "",
              description: "",
              price: 499,
              originalPrice: 999,
              category: "bundles",
              productType: "bundle",
              deliveryType: "google-drive",
              totalAssetsCount: "700+ Production Assets",
              fileSize: "2.4 GB",
              softwareRequired: "Premiere Pro, DaVinci Resolve, Final Cut",
              status: "published",
              images: ["https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80"],
            })
          }
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A36] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Upload New Bundle</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bundles by title or keywords..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pr-4 pl-9 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
          />
        </div>
        <span className="text-xs text-zinc-500">
          Total Bundles: <strong className="text-zinc-200">{filtered.length}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 backdrop-blur-md">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Bundle Asset</th>
              <th className="px-4 py-3 font-medium">Included Assets</th>
              <th className="px-4 py-3 font-medium">Software Compatibility</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Google Drive / Cloud Link</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-500">
                  Loading bundles...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-500">
                  No bundles found. Click "Upload New Bundle" to publish your first pack.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                        <img
                          src={b.images?.[0] || b.coverImageUrl || "/images/products/bundle-1.png"}
                          alt={b.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="max-w-xs truncate">
                        <span className="font-heading font-semibold text-white truncate block">
                          {b.title}
                        </span>
                        <span className="text-[11px] text-zinc-500">{b.fileSize || "Cloud Link"}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-amber-400 font-medium">
                    {b.totalAssetsCount || "Curated Pack"}
                  </td>

                  <td className="px-4 py-3.5 text-zinc-400">
                    {b.softwareRequired || "Universal"}
                  </td>

                  <td className="px-4 py-3.5 font-heading font-bold text-white">
                    ₹{b.price.toLocaleString("en-IN")}
                  </td>

                  <td className="px-4 py-3.5">
                    {b.googleDriveUrl ? (
                      <button
                        type="button"
                        onClick={() => handleCopyLink(b.googleDriveUrl!, b.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1 text-[11px] text-emerald-400 hover:bg-zinc-800 transition-colors"
                      >
                        <LinkIcon className="h-3 w-3" />
                        <span>{copiedId === b.id ? "Copied!" : "Drive Link"}</span>
                      </button>
                    ) : (
                      <span className="text-zinc-500">Direct Delivery</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        b.status === "published"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingBundle(b)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Edit bundle"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                        title="Delete bundle"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Upload / Edit Modal */}
      {editingBundle && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <h2 className="font-heading text-lg font-bold text-white">
                {editingBundle.id ? `Edit: ${editingBundle.title}` : "Upload Editing Bundle"}
              </h2>
              <button
                onClick={() => setEditingBundle(null)}
                className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Bundle Title <span className="text-[#FF5A36]">*</span>
                </label>
                <input
                  type="text"
                  value={editingBundle.title || ""}
                  onChange={(e) => setEditingBundle({ ...editingBundle, title: e.target.value })}
                  required
                  placeholder="e.g. Cinematic Video Editing Master Bundle 2026"
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingBundle.description || ""}
                  onChange={(e) => setEditingBundle({ ...editingBundle, description: e.target.value })}
                  placeholder="Essential video editing assets, overlays, LUTs and sound effects..."
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              {/* Bundle Master Archive or Google Drive Link */}
              <FileUploader
                label="Bundle Master Archive File (ZIP) or Cloud Link"
                value={editingBundle.googleDriveUrl || editingBundle.downloadUrl || ""}
                onChange={(url) => setEditingBundle({ ...editingBundle, googleDriveUrl: url, downloadUrl: url })}
                fileType="any"
                hint="Directly upload ZIP archive from device or switch to paste Google Drive link"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Total Assets Count
                  </label>
                  <input
                    type="text"
                    value={editingBundle.totalAssetsCount || ""}
                    onChange={(e) => setEditingBundle({ ...editingBundle, totalAssetsCount: e.target.value })}
                    placeholder="e.g. 700+ Assets, 120 LUTs, 4K Footage"
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={editingBundle.fileSize || ""}
                    onChange={(e) => setEditingBundle({ ...editingBundle, fileSize: e.target.value })}
                    placeholder="e.g. 2.4 GB"
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Software Required
                </label>
                <input
                  type="text"
                  value={editingBundle.softwareRequired || ""}
                  onChange={(e) => setEditingBundle({ ...editingBundle, softwareRequired: e.target.value })}
                  placeholder="e.g. Premiere Pro, DaVinci Resolve, Final Cut Pro, CapCut"
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              {/* Cover Image Uploader */}
              <FileUploader
                label="Cover Image"
                value={editingBundle.images?.[0] || editingBundle.coverImageUrl || ""}
                onChange={(url) => {
                  const imgs = [...(editingBundle.images || [])];
                  imgs[0] = url;
                  setEditingBundle({ ...editingBundle, images: imgs, coverImageUrl: url });
                }}
                accept="image/*"
                fileType="image"
                hint="Upload image from device or paste image URL"
              />

              {/* Demo Video (MP4 or YouTube) */}
              <FileUploader
                label="Demo Reel / Video Preview (MP4 or YouTube)"
                value={editingBundle.videoUrl || ""}
                onChange={(url) => setEditingBundle({ ...editingBundle, videoUrl: url })}
                accept="video/mp4,video/*"
                fileType="video"
                hint="Upload MP4 from your device or paste a YouTube / CDN video link"
              />

              {/* Pricing & Status */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Selling Price (₹ INR) <span className="text-[#FF5A36]">*</span>
                  </label>
                  <div className="relative mt-1">
                    <IndianRupee className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="number"
                      value={editingBundle.price ?? 499}
                      onChange={(e) => setEditingBundle({ ...editingBundle, price: Number(e.target.value) })}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pr-3 pl-8 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                      min={0}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Strike Price (₹ INR)
                  </label>
                  <div className="relative mt-1">
                    <IndianRupee className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="number"
                      value={editingBundle.originalPrice || ""}
                      onChange={(e) =>
                        setEditingBundle({
                          ...editingBundle,
                          originalPrice: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      placeholder="999"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pr-3 pl-8 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                      min={0}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Status
                  </label>
                  <select
                    value={editingBundle.status || "published"}
                    onChange={(e) => setEditingBundle({ ...editingBundle, status: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingBundle(null)}
                  className="rounded-xl border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#FF5A36] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{saving ? "Saving..." : "Save Bundle"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
