"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  IndianRupee,
  Link as LinkIcon,
  FileText,
  Save,
  X,
  Eye,
} from "lucide-react";
import type { AdminProduct } from "@/lib/admin/types";
import { FileUploader } from "@/components/admin/file-uploader";

export default function PlannersAdminPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingPlanner, setEditingPlanner] = useState<Partial<AdminProduct> | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPlanners();
  }, []);

  const fetchPlanners = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      const all: AdminProduct[] = data.products || [];
      setProducts(all.filter((p) => p.category === "planners" || p.productType === "planner"));
    } catch (err) {
      console.error("Failed to load planners:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlanner?.title) return;

    setSaving(true);
    try {
      const payload: Partial<AdminProduct> = {
        ...editingPlanner,
        category: "planners",
        productType: "planner",
        googleDriveUrl:
          editingPlanner.googleDriveUrl ||
          (editingPlanner.pdfUrl?.includes("drive.google.com")
            ? editingPlanner.pdfUrl
            : editingPlanner.downloadUrl?.includes("drive.google.com")
            ? editingPlanner.downloadUrl
            : undefined),
        deliveryType:
          editingPlanner.googleDriveUrl ||
          editingPlanner.pdfUrl?.includes("drive.google.com") ||
          editingPlanner.downloadUrl?.includes("drive.google.com")
            ? "google-drive"
            : "download-url",
        status: editingPlanner.status || "published",
        price: Number(editingPlanner.price) || 0,
        originalPrice: editingPlanner.originalPrice ? Number(editingPlanner.originalPrice) : undefined,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchPlanners();
        setEditingPlanner(null);
      }
    } catch (err) {
      console.error("Error saving planner:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this productivity planner?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting planner:", err);
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
      (p.plannerCategory || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-400" />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Productivity Planners Manager
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Publish daily routine, habit tracking, gym &amp; financial planning systems with in-browser protected PDF readers.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingPlanner({
              title: "",
              description: "",
              price: 199,
              originalPrice: 499,
              category: "planners",
              productType: "planner",
              plannerCategory: "Daily Productivity",
              pageCount: 65,
              status: "published",
              images: ["https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=1200&q=80"],
            })
          }
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A36] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Planner</span>
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
            placeholder="Search planners by title or subcategory..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pr-4 pl-9 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
          />
        </div>
        <span className="text-xs text-zinc-500">
          Total Planners: <strong className="text-zinc-200">{filtered.length}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 backdrop-blur-md">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Planner System</th>
              <th className="px-4 py-3 font-medium">Sub-Category</th>
              <th className="px-4 py-3 font-medium">Pages</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">PDF Reader Preview</th>
              <th className="px-4 py-3 font-medium">Delivery Download</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                  Loading planners...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                  No planners found. Click "Add New Planner" to create your first planning template.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-9 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-sm">
                        <img
                          src={p.images?.[0] || p.coverImageUrl || "/images/products/planner-1.png"}
                          alt={p.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="max-w-xs truncate">
                        <span className="font-heading font-semibold text-white truncate block">
                          {p.title}
                        </span>
                        <span className="text-[11px] text-zinc-500">{p.description || "Printable PDF System"}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="rounded-full bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                      {p.plannerCategory || "Productivity"}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-zinc-400 font-mono text-[11px]">
                    {p.pageCount ? `${p.pageCount} Pages` : "PDF File"}
                  </td>

                  <td className="px-4 py-3.5 font-heading font-bold text-white">
                    {p.price === 0 ? (
                      <span className="text-emerald-400">FREE</span>
                    ) : (
                      `₹${p.price.toLocaleString("en-IN")}`
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    {p.previewPdfUrl ? (
                      <a
                        href={p.previewPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-0.5 text-[11px] text-blue-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View Reader</span>
                      </a>
                    ) : (
                      <span className="text-zinc-500">Not set</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    {p.pdfUrl || p.downloadUrl || p.googleDriveUrl ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyLink(
                            p.pdfUrl || p.downloadUrl || p.googleDriveUrl!,
                            p.id
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1 text-[11px] text-emerald-400 hover:bg-zinc-800 transition-colors"
                      >
                        <LinkIcon className="h-3 w-3" />
                        <span>{copiedId === p.id ? "Copied!" : "PDF Link"}</span>
                      </button>
                    ) : (
                      <span className="text-zinc-500">Direct Delivery</span>
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
                        onClick={() => setEditingPlanner(p)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Edit planner"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                        title="Delete planner"
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
      {editingPlanner && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <h2 className="font-heading text-lg font-bold text-white">
                {editingPlanner.id ? `Edit: ${editingPlanner.title}` : "Upload Productivity Planner"}
              </h2>
              <button
                onClick={() => setEditingPlanner(null)}
                className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Planner Title <span className="text-[#FF5A36]">*</span>
                </label>
                <input
                  type="text"
                  value={editingPlanner.title || ""}
                  onChange={(e) => setEditingPlanner({ ...editingPlanner, title: e.target.value })}
                  required
                  placeholder="e.g. 90-Day Discipline & Habit Tracker 2026"
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Category (Sub-Category)
                  </label>
                  <input
                    type="text"
                    value={editingPlanner.plannerCategory || ""}
                    onChange={(e) => setEditingPlanner({ ...editingPlanner, plannerCategory: e.target.value })}
                    placeholder="e.g. Daily Habits, Fitness, Finance, Career"
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Total Pages
                  </label>
                  <input
                    type="number"
                    value={editingPlanner.pageCount || ""}
                    onChange={(e) => setEditingPlanner({ ...editingPlanner, pageCount: parseInt(e.target.value) || 0 })}
                    placeholder="e.g. 65"
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingPlanner.description || ""}
                  onChange={(e) => setEditingPlanner({ ...editingPlanner, description: e.target.value })}
                  placeholder="Daily routine schedules, goal mapping, habit checkboxes and weekly reviews..."
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              {/* In-Browser PDF Reader Preview Link */}
              <FileUploader
                label="In-Browser PDF Reader File or Preview URL"
                value={editingPlanner.previewPdfUrl || ""}
                onChange={(url) => setEditingPlanner({ ...editingPlanner, previewPdfUrl: url })}
                accept=".pdf,application/pdf"
                fileType="pdf"
                hint="Upload PDF from device or paste Google Drive preview link (e.g. https://drive.google.com/file/d/.../preview)"
              />

              {/* Full PDF Download URL for Customers */}
              <FileUploader
                label="Full PDF Download File or Cloud Link"
                value={editingPlanner.pdfUrl || editingPlanner.downloadUrl || ""}
                onChange={(url) => setEditingPlanner({ ...editingPlanner, pdfUrl: url, downloadUrl: url })}
                accept=".pdf,application/pdf"
                fileType="pdf"
                hint="Upload complete planner PDF or paste Google Drive direct download link"
              />

              {/* Planner Cover */}
              <FileUploader
                label="Planner Cover Artwork"
                value={editingPlanner.images?.[0] || editingPlanner.coverImageUrl || ""}
                onChange={(url) => {
                  const imgs = [...(editingPlanner.images || [])];
                  imgs[0] = url;
                  setEditingPlanner({ ...editingPlanner, images: imgs, coverImageUrl: url });
                }}
                accept="image/*"
                fileType="image"
                hint="Cover visual shown on product cards"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Price (₹ INR — 0 for FREE)
                  </label>
                  <div className="relative mt-1">
                    <IndianRupee className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="number"
                      value={editingPlanner.price ?? 199}
                      onChange={(e) => setEditingPlanner({ ...editingPlanner, price: Number(e.target.value) })}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pr-3 pl-8 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                      min={0}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Publish Status
                  </label>
                  <select
                    value={editingPlanner.status || "published"}
                    onChange={(e) => setEditingPlanner({ ...editingPlanner, status: e.target.value as any })}
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
                  onClick={() => setEditingPlanner(null)}
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
                  <span>{saving ? "Saving..." : "Save Planner"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
