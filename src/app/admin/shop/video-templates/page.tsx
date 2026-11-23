"use client";

import { useEffect, useState } from "react";
import {
  Video,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  IndianRupee,
  Link as LinkIcon,
  Play,
  Save,
  X,
  Sparkles,
} from "lucide-react";
import type { AdminProduct } from "@/lib/admin/types";
import { FileUploader } from "@/components/admin/file-uploader";

export default function VideoTemplatesAdminPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingTemplate, setEditingTemplate] = useState<Partial<AdminProduct> | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      const all: AdminProduct[] = data.products || [];
      setProducts(
        all.filter(
          (p) =>
            p.category === "video-templates" ||
            (p.productType as string) === "video-template" ||
            (p.productType as any) === "video"
        )
      );
    } catch (err) {
      console.error("Failed to load video templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate?.title) return;

    setSaving(true);
    try {
      const payload: Partial<AdminProduct> = {
        ...editingTemplate,
        category: "video-templates",
        productType: "video-template" as any,
        deliveryType: editingTemplate.capcutUrl ? "canva-link" : "download-url",
        status: editingTemplate.status || "published",
        price: Number(editingTemplate.price) || 0,
        originalPrice: editingTemplate.originalPrice ? Number(editingTemplate.originalPrice) : undefined,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchTemplates();
        setEditingTemplate(null);
      }
    } catch (err) {
      console.error("Error saving video template:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this video template?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting video template:", err);
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
            <Video className="h-5 w-5 text-[#FF5A36]" />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Video Templates Manager
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Publish viral 9:16 Instagram Reels &amp; CapCut beat-sync templates with direct project &amp; XML links.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingTemplate({
              title: "",
              description: "",
              price: 199,
              originalPrice: 499,
              category: "video-templates",
              productType: "video-template" as any,
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
              capcutUrl: "https://www.capcut.com/template-detail",
              alightMotionXmlUrl: "https://badarsh.vercel.app/downloads/alight-motion-preset.xml",
              bpm: 128,
              requiredClipsCount: 7,
              status: "published",
              images: ["https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80"],
            })
          }
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A36] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Upload New Template</span>
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
            placeholder="Search video templates by title or vibes..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pr-4 pl-9 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
          />
        </div>
        <span className="text-xs text-zinc-500">
          Total Templates: <strong className="text-zinc-200">{filtered.length}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 backdrop-blur-md">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Video Template</th>
              <th className="px-4 py-3 font-medium">Beats / Clips</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">CapCut / XML Link</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">
                  Loading video templates...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">
                  No video templates found. Click "Upload New Template" to add your first template.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                        <img
                          src={t.images?.[0] || t.coverImageUrl || "/images/products/product-1.png"}
                          alt={t.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="h-3 w-3 text-white fill-white" />
                        </div>
                      </div>
                      <div className="max-w-xs truncate">
                        <span className="font-heading font-semibold text-white truncate block">
                          {t.title}
                        </span>
                        <span className="text-[11px] text-zinc-500">{t.description || "Viral 9:16 Template"}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
                      <span>{t.bpm ? `${t.bpm} BPM` : "120 BPM"}</span>
                      <span>&bull;</span>
                      <span>{t.requiredClipsCount ? `${t.requiredClipsCount} Clips` : "5 Clips"}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-heading font-bold text-white">
                    {t.price === 0 ? (
                      <span className="text-emerald-400">FREE</span>
                    ) : (
                      `₹${t.price.toLocaleString("en-IN")}`
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    {t.capcutUrl || t.alightMotionXmlUrl || t.downloadUrl ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyLink(
                            t.capcutUrl || t.alightMotionXmlUrl || t.downloadUrl!,
                            t.id
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1 text-[11px] text-[#FF5A36] hover:bg-zinc-800 transition-colors"
                      >
                        <LinkIcon className="h-3 w-3" />
                        <span>{copiedId === t.id ? "Copied!" : "Template Link"}</span>
                      </button>
                    ) : (
                      <span className="text-zinc-500">Not set</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        t.status === "published"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingTemplate(t)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Edit template"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                        title="Delete template"
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
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <h2 className="font-heading text-lg font-bold text-white">
                {editingTemplate.id ? `Edit: ${editingTemplate.title}` : "Upload Video Editing Template"}
              </h2>
              <button
                onClick={() => setEditingTemplate(null)}
                className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Template Title <span className="text-[#FF5A36]">*</span>
                </label>
                <input
                  type="text"
                  value={editingTemplate.title || ""}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                  required
                  placeholder="e.g. Velocity Flash Beat Sync (9:16)"
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    BPM (Tempo)
                  </label>
                  <input
                    type="number"
                    value={editingTemplate.bpm || 128}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, bpm: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Required Clips
                  </label>
                  <input
                    type="number"
                    value={editingTemplate.requiredClipsCount || 7}
                    onChange={(e) =>
                      setEditingTemplate({ ...editingTemplate, requiredClipsCount: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Price (₹ INR — 0 for FREE)
                  </label>
                  <div className="relative mt-1">
                    <IndianRupee className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="number"
                      value={editingTemplate.price ?? 199}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, price: Number(e.target.value) })}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pr-3 pl-8 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                      min={0}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingTemplate.description || ""}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                  placeholder="Cinematic flash zoom transitions perfectly synced to heavy drop 808s..."
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              {/* Video Preview URL */}
              <FileUploader
                label="Preview Video (MP4 9:16 Vertical)"
                value={editingTemplate.videoUrl || ""}
                onChange={(url) => setEditingTemplate({ ...editingTemplate, videoUrl: url })}
                accept="video/mp4,video/*"
                fileType="video"
                hint="Upload 9:16 vertical MP4 video clip or paste MP4 URL for live hover playback"
              />

              {/* Cover Artwork */}
              <FileUploader
                label="Thumbnail Poster"
                value={editingTemplate.images?.[0] || editingTemplate.coverImageUrl || ""}
                onChange={(url) => {
                  const imgs = [...(editingTemplate.images || [])];
                  imgs[0] = url;
                  setEditingTemplate({ ...editingTemplate, images: imgs, coverImageUrl: url });
                }}
                accept="image/*"
                fileType="image"
                hint="Vertical poster image shown while video loads"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    CapCut Template Deep-Link URL
                  </label>
                  <input
                    type="url"
                    value={editingTemplate.capcutUrl || ""}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, capcutUrl: e.target.value })}
                    placeholder="https://www.capcut.com/template-detail/..."
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Alight Motion XML / Project URL
                  </label>
                  <input
                    type="url"
                    value={editingTemplate.alightMotionXmlUrl || ""}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, alightMotionXmlUrl: e.target.value })}
                    placeholder="https://drive.google.com/... or .xml link"
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>
              </div>

              {/* Publish Status */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Publish Status
                </label>
                <select
                  value={editingTemplate.status || "published"}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, status: e.target.value as any })}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                >
                  <option value="published">Published (Live)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                {editingTemplate.id ? (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm(`Are you sure you want to permanently delete "${editingTemplate.title}"?`)) return;
                      await handleDelete(editingTemplate.id!);
                      setEditingTemplate(null);
                    }}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Template</span>
                  </button>
                ) : (
                  <div />
                )}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingTemplate(null)}
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
                    <span>{saving ? "Saving..." : "Save Video Template"}</span>
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
