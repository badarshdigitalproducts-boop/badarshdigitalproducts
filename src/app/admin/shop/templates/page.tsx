"use client";

import { useEffect, useState } from "react";
import {
  Layers,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  IndianRupee,
  Link as LinkIcon,
  Palette,
  Save,
  X,
  Eye,
} from "lucide-react";
import type { AdminProduct } from "@/lib/admin/types";
import { FileUploader } from "@/components/admin/file-uploader";

export default function TemplatesAdminPage() {
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
        all.filter((p) =>
          ["social-media", "presentations", "branding", "business-cards"].includes(p.category) ||
          p.productType === "canva-template" ||
          (p.productType as any) === "template"
        )
      );
    } catch (err) {
      console.error("Failed to load templates:", err);
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
        category: editingTemplate.category || "social-media",
        productType: "canva-template",
        deliveryType: "canva-link",
        status: editingTemplate.status || "published",
        price: Number(editingTemplate.price) || 299,
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
      console.error("Error saving template:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this design template?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting template:", err);
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
            <Layers className="h-5 w-5 text-[#FF5A36]" />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Studio Design Templates Manager
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Publish social media carousels, reels, pitch decks &amp; branding kits. Built with in-browser customizer &amp; direct project delivery.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingTemplate({
              title: "",
              description: "",
              price: 299,
              originalPrice: 599,
              category: "social-media",
              productType: "canva-template",
              deliveryType: "canva-link",
              canvaUrl: "",
              templateUrl: "",
              status: "published",
              images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80"],
            })
          }
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A36] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Template</span>
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
            placeholder="Search design templates..."
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
              <th className="px-4 py-3 font-medium">Design Template</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Project Share Link</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">
                  Loading templates...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">
                  No templates found. Click "Add New Template" to upload your first graphic design pack.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                        <img
                          src={t.images?.[0] || t.coverImageUrl || "/images/products/product-1.png"}
                          alt={t.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="max-w-xs truncate">
                        <span className="font-heading font-semibold text-white truncate block">
                          {t.title}
                        </span>
                        <span className="text-[11px] text-zinc-500">{t.description || "Editable Graphic Pack"}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="rounded-full bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 text-[11px] font-medium text-zinc-300 capitalize">
                      {t.category.replace("-", " ")}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-heading font-bold text-white">
                    ₹{t.price.toLocaleString("en-IN")}
                  </td>

                  <td className="px-4 py-3.5">
                    {t.canvaUrl || t.templateUrl || t.downloadUrl ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyLink(
                            t.canvaUrl || t.templateUrl || t.downloadUrl!,
                            t.id
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1 text-[11px] text-blue-400 hover:bg-zinc-800 transition-colors"
                      >
                        <LinkIcon className="h-3 w-3" />
                        <span>{copiedId === t.id ? "Copied!" : "Project Link"}</span>
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
                {editingTemplate.id ? `Edit: ${editingTemplate.title}` : "Upload Design Template"}
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
                  placeholder="e.g. 50+ Viral Instagram Carousel Templates 2026"
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Template Sub-Category
                  </label>
                  <select
                    value={editingTemplate.category || "social-media"}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  >
                    <option value="social-media">Social Media (Carousels &amp; Reels)</option>
                    <option value="presentations">Pitch Decks &amp; Presentations</option>
                    <option value="branding">Branding Kits &amp; Guidelines</option>
                    <option value="business-cards">Business Stationery &amp; Cards</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Selling Price (₹ INR) <span className="text-[#FF5A36]">*</span>
                  </label>
                  <div className="relative mt-1">
                    <IndianRupee className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="number"
                      value={editingTemplate.price ?? 299}
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
                  placeholder="Engineered for maximum engagement, high CTR and clean aesthetic brand authority..."
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              {/* Template Graphic / Project File Uploader */}
              <FileUploader
                label="Template Asset File / Archive or Project Share Link"
                value={editingTemplate.templateUrl || editingTemplate.canvaUrl || ""}
                onChange={(url) =>
                  setEditingTemplate({
                    ...editingTemplate,
                    templateUrl: url,
                    canvaUrl: url,
                  })
                }
                fileType="any"
                hint="Upload template asset ZIP directly from device or switch to paste project link"
              />

              {/* Cover Artwork */}
              <FileUploader
                label="Cover Image Preview"
                value={editingTemplate.images?.[0] || editingTemplate.coverImageUrl || ""}
                onChange={(url) => {
                  const imgs = [...(editingTemplate.images || [])];
                  imgs[0] = url;
                  setEditingTemplate({ ...editingTemplate, images: imgs, coverImageUrl: url });
                }}
                accept="image/*"
                fileType="image"
                hint="Upload preview slide or mockup from device"
              />

              {/* Status */}
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
              <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-4">
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
                  <span>{saving ? "Saving..." : "Save Template"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
