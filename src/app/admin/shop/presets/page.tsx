"use client";

import { useEffect, useState } from "react";
import {
  Camera,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  IndianRupee,
  Link as LinkIcon,
  Save,
  X,
  SlidersHorizontal,
} from "lucide-react";
import type { AdminProduct } from "@/lib/admin/types";
import { FileUploader } from "@/components/admin/file-uploader";
import { BeforeAfterSlider } from "@/components/shared/before-after-slider";
import { safeParseJson } from "@/lib/utils";

export default function PresetsAdminPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingPreset, setEditingPreset] = useState<Partial<AdminProduct> | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      if (res.status === 401) {
        window.location.replace("/admin/login");
        return;
      }
      const data = await safeParseJson<{ products?: AdminProduct[] }>(res, {});
      const all: AdminProduct[] = data.products || [];
      setProducts(all.filter((p) => p.category === "photo-presets" || p.productType === "photo-preset"));
    } catch (err) {
      console.error("Failed to load presets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPreset?.title) return;

    setSaving(true);
    try {
      const payload: Partial<AdminProduct> = {
        ...editingPreset,
        category: "photo-presets",
        productType: "photo-preset",
        googleDriveUrl:
          editingPreset.googleDriveUrl ||
          (editingPreset.presetLinkUrl?.includes("drive.google.com")
            ? editingPreset.presetLinkUrl
            : undefined),
        deliveryType: editingPreset.presetLinkUrl?.includes("drive.google.com")
          ? "google-drive"
          : "external-url",
        status: editingPreset.status || "published",
        price: Number(editingPreset.price) || 199,
        originalPrice: editingPreset.originalPrice ? Number(editingPreset.originalPrice) : undefined,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchPresets();
        setEditingPreset(null);
      }
    } catch (err) {
      console.error("Error saving preset:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this Lightroom preset?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting preset:", err);
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
            <Camera className="h-5 w-5 text-blue-400" />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Lightroom Presets Manager
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Publish 1-click Adobe Lightroom Mobile &amp; Desktop presets with interactive Before/After comparison sliders.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingPreset({
              title: "",
              description: "",
              price: 199,
              originalPrice: 499,
              category: "photo-presets",
              productType: "photo-preset",
              presetLinkUrl: "",
              beforeImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&q=80",
              afterImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&q=80",
              softwareRequired: "Adobe Lightroom Mobile / Desktop (Free & CC)",
              status: "published",
              images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80"],
            })
          }
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A36] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Preset</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col gap-3 border-b border-zinc-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Lightroom presets..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pr-4 pl-9 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
          />
        </div>
        <span className="text-xs text-zinc-500 shrink-0">
          Total Presets: <strong className="text-zinc-200">{filtered.length}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="min-w-[680px] w-full text-left text-xs">
          <thead className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Preset Item</th>
              <th className="px-4 py-3 font-medium">Before &amp; After Assets</th>
              <th className="px-4 py-3 font-medium">Software Compatibility</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Lightroom / DNG Link</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-500">
                  Loading presets...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-500">
                  No presets found. Click "Add New Preset" to stage your first Lightroom filter.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                        <img
                          src={p.images?.[0] || p.coverImageUrl || p.afterImage || "/images/og/og-default.png"}
                          alt={p.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="max-w-xs truncate">
                        <span className="font-heading font-semibold text-white truncate block">
                          {p.title}
                        </span>
                        <span className="text-[11px] text-zinc-500">{p.description || "1-Click DNG Preset"}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    {p.beforeImage && p.afterImage ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/15 px-2 py-0.5 text-[11px] font-semibold text-blue-400">
                        <SlidersHorizontal className="h-3 w-3" />
                        <span>Interactive Slider Ready</span>
                      </span>
                    ) : (
                      <span className="text-zinc-500">Single Image</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-zinc-400">
                    {p.softwareRequired || "Lightroom Mobile & Desktop"}
                  </td>

                  <td className="px-4 py-3.5 font-heading font-bold text-white">
                    ₹{p.price.toLocaleString("en-IN")}
                  </td>

                  <td className="px-4 py-3.5">
                    {p.presetLinkUrl || p.downloadUrl || p.googleDriveUrl ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyLink(
                            p.presetLinkUrl || p.downloadUrl || p.googleDriveUrl!,
                            p.id
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1 text-[11px] text-emerald-400 hover:bg-zinc-800 transition-colors"
                      >
                        <LinkIcon className="h-3 w-3" />
                        <span>{copiedId === p.id ? "Copied!" : "Preset Link"}</span>
                      </button>
                    ) : (
                      <span className="text-zinc-500">No link set</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        p.status === "published"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingPreset(p)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Edit preset"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                        title="Delete preset"
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
      </div>

      {/* Upload / Edit Modal */}
      {editingPreset && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <h2 className="font-heading text-lg font-bold text-white">
                {editingPreset.id ? `Edit: ${editingPreset.title}` : "Upload Lightroom Preset"}
              </h2>
              <button
                onClick={() => setEditingPreset(null)}
                className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Preset Title <span className="text-[#FF5A36]">*</span>
                </label>
                <input
                  type="text"
                  value={editingPreset.title || ""}
                  onChange={(e) => setEditingPreset({ ...editingPreset, title: e.target.value })}
                  required
                  placeholder="e.g. Moody Cinematic Film Tone Pack"
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingPreset.description || ""}
                  onChange={(e) => setEditingPreset({ ...editingPreset, description: e.target.value })}
                  placeholder="Warm skin tones, rich darks and moody greens for portraits and street photography..."
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              {/* Preset File (DNG) or Adobe Share Link */}
              <FileUploader
                label="Lightroom Preset File (DNG / ZIP) or Adobe Share Link"
                value={editingPreset.presetLinkUrl || ""}
                onChange={(url) => setEditingPreset({ ...editingPreset, presetLinkUrl: url })}
                fileType="any"
                hint="Directly upload DNG preset file from device or switch to paste Adobe share link"
              />

              {/* Before and After Image Uploaders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FileUploader
                  label="Before Image (RAW / Unedited)"
                  value={editingPreset.beforeImage || ""}
                  onChange={(url) => setEditingPreset({ ...editingPreset, beforeImage: url })}
                  accept="image/*"
                  fileType="image"
                  hint="Upload raw photo from device or paste link"
                />

                <FileUploader
                  label="After Image (Color Graded)"
                  value={editingPreset.afterImage || ""}
                  onChange={(url) => setEditingPreset({ ...editingPreset, afterImage: url })}
                  accept="image/*"
                  fileType="image"
                  hint="Upload edited photo from device or paste link"
                />
              </div>

              {/* Live Before/After Interactive Slider Test in Modal */}
              {editingPreset.beforeImage && editingPreset.afterImage && (
                <div className="rounded-xl border border-zinc-800 bg-black/80 p-3 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                    Interactive Before/After Preview Test:
                  </span>
                  <div className="h-56 w-full max-w-md mx-auto">
                    <BeforeAfterSlider
                      beforeImage={editingPreset.beforeImage}
                      afterImage={editingPreset.afterImage}
                      beforeLabel="RAW Before"
                      afterLabel="Graded After"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Selling Price (₹ INR) <span className="text-[#FF5A36]">*</span>
                  </label>
                  <div className="relative mt-1">
                    <IndianRupee className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="number"
                      value={editingPreset.price ?? 199}
                      onChange={(e) => setEditingPreset({ ...editingPreset, price: Number(e.target.value) })}
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
                      value={editingPreset.originalPrice || ""}
                      onChange={(e) =>
                        setEditingPreset({
                          ...editingPreset,
                          originalPrice: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      placeholder="499"
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
                    value={editingPreset.status || "published"}
                    onChange={(e) => setEditingPreset({ ...editingPreset, status: e.target.value as any })}
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
                  onClick={() => setEditingPreset(null)}
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
                  <span>{saving ? "Saving..." : "Save Preset"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
