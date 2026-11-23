"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
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

export default function EbooksAdminPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingBook, setEditingBook] = useState<Partial<AdminProduct> | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      const all: AdminProduct[] = data.products || [];
      setProducts(all.filter((p) => p.category === "ebooks" || p.productType === "ebook"));
    } catch (err) {
      console.error("Failed to load ebooks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook?.title) return;

    setSaving(true);
    try {
      const payload: Partial<AdminProduct> = {
        ...editingBook,
        category: "ebooks",
        productType: "ebook",
        googleDriveUrl:
          editingBook.googleDriveUrl ||
          (editingBook.pdfUrl?.includes("drive.google.com")
            ? editingBook.pdfUrl
            : editingBook.downloadUrl?.includes("drive.google.com")
            ? editingBook.downloadUrl
            : undefined),
        deliveryType:
          editingBook.googleDriveUrl ||
          editingBook.pdfUrl?.includes("drive.google.com") ||
          editingBook.downloadUrl?.includes("drive.google.com")
            ? "google-drive"
            : "download-url",
        status: editingBook.status || "published",
        price: Number(editingBook.price) || 0,
        originalPrice: editingBook.originalPrice ? Number(editingBook.originalPrice) : undefined,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchBooks();
        setEditingBook(null);
      }
    } catch (err) {
      console.error("Error saving ebook:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this e-book?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting ebook:", err);
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
      (p.authorName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-400" />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              E-Books Publishing Manager
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Publish founder guides, growth blueprints &amp; digital books. Includes in-browser protected PDF readers &amp; full customer downloads.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingBook({
              title: "",
              description: "",
              price: 299,
              originalPrice: 699,
              category: "ebooks",
              productType: "ebook",
              authorName: "BADARSH Studio",
              pageCount: 120,
              status: "published",
              images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=80"],
            })
          }
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A36] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Publish New E-Book</span>
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
            placeholder="Search e-books by title or author..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pr-4 pl-9 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
          />
        </div>
        <span className="text-xs text-zinc-500">
          Total E-Books: <strong className="text-zinc-200">{filtered.length}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 backdrop-blur-md">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Book Publication</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Pages</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">PDF Reader Preview</th>
              <th className="px-4 py-3 font-medium">Download Delivery</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                  Loading books...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                  No e-books published yet. Click "Publish New E-Book" to add your first title.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-9 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-sm">
                        <img
                          src={b.images?.[0] || b.coverImageUrl || "/images/products/ebook-1.png"}
                          alt={b.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="max-w-xs truncate">
                        <span className="font-heading font-semibold text-white truncate block">
                          {b.title}
                        </span>
                        <span className="text-[11px] text-zinc-500">{b.description || "Digital Book (PDF)"}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-zinc-300">
                    {b.authorName || "BADARSH Studio"}
                  </td>

                  <td className="px-4 py-3.5 text-amber-400 font-mono text-[11px]">
                    {b.pageCount ? `${b.pageCount} Pages` : "PDF Edition"}
                  </td>

                  <td className="px-4 py-3.5 font-heading font-bold text-white">
                    {b.price === 0 ? (
                      <span className="text-emerald-400">FREE</span>
                    ) : (
                      `₹${b.price.toLocaleString("en-IN")}`
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    {b.previewPdfUrl ? (
                      <a
                        href={b.previewPdfUrl}
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
                    {b.pdfUrl || b.downloadUrl || b.googleDriveUrl ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyLink(
                            b.pdfUrl || b.downloadUrl || b.googleDriveUrl!,
                            b.id
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1 text-[11px] text-emerald-400 hover:bg-zinc-800 transition-colors"
                      >
                        <LinkIcon className="h-3 w-3" />
                        <span>{copiedId === b.id ? "Copied!" : "PDF Link"}</span>
                      </button>
                    ) : (
                      <span className="text-zinc-500">Direct Download</span>
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
                        onClick={() => setEditingBook(b)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Edit book"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                        title="Delete book"
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
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <h2 className="font-heading text-lg font-bold text-white">
                {editingBook.id ? `Edit: ${editingBook.title}` : "Publish New E-Book"}
              </h2>
              <button
                onClick={() => setEditingBook(null)}
                className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Book Title <span className="text-[#FF5A36]">*</span>
                </label>
                <input
                  type="text"
                  value={editingBook.title || ""}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  required
                  placeholder="e.g. 100M Founder Blueprint: Digital Product Masterclass"
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Author / Publisher
                  </label>
                  <input
                    type="text"
                    value={editingBook.authorName || ""}
                    onChange={(e) => setEditingBook({ ...editingBook, authorName: e.target.value })}
                    placeholder="e.g. BADARSH Research"
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Page Count
                  </label>
                  <input
                    type="number"
                    value={editingBook.pageCount || ""}
                    onChange={(e) => setEditingBook({ ...editingBook, pageCount: parseInt(e.target.value) || 0 })}
                    placeholder="e.g. 142"
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Book Description / Synopsis
                </label>
                <textarea
                  rows={2}
                  value={editingBook.description || ""}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  placeholder="Complete step-by-step tactical playbook for scaling digital products in India..."
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              {/* In-Browser PDF Reader Preview Link */}
              <FileUploader
                label="In-Browser PDF Reader File or Preview URL"
                value={editingBook.previewPdfUrl || ""}
                onChange={(url) => setEditingBook({ ...editingBook, previewPdfUrl: url })}
                accept=".pdf,application/pdf"
                fileType="pdf"
                hint="Upload PDF from device or paste Google Drive preview link (e.g. https://drive.google.com/file/d/.../preview)"
              />

              {/* Live In-Browser Reader verification */}
              {editingBook.previewPdfUrl && (
                <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5">
                  <div className="flex items-center gap-2 text-xs text-zinc-300 truncate">
                    <Eye className="h-4 w-4 text-blue-400 shrink-0" />
                    <span className="truncate">In-Browser Reader Ready</span>
                  </div>
                  <a
                    href={
                      editingBook.previewPdfUrl.includes("drive.google.com")
                        ? editingBook.previewPdfUrl.replace(/\/view(\?.*)?$/, "/preview")
                        : `https://docs.google.com/viewer?url=${encodeURIComponent(editingBook.previewPdfUrl)}&embedded=true`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1 text-xs font-semibold text-white transition-colors"
                  >
                    <span>Test In-Browser Reader</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {/* Full PDF Download URL for Customers */}
              <FileUploader
                label="Full PDF Download File or Cloud Link"
                value={editingBook.pdfUrl || editingBook.downloadUrl || ""}
                onChange={(url) => setEditingBook({ ...editingBook, pdfUrl: url, downloadUrl: url })}
                accept=".pdf,application/pdf"
                fileType="pdf"
                hint="Upload complete book PDF or paste Google Drive direct download link"
              />

              {/* Book Cover */}
              <FileUploader
                label="Book Cover Artwork"
                value={editingBook.images?.[0] || editingBook.coverImageUrl || ""}
                onChange={(url) => {
                  const imgs = [...(editingBook.images || [])];
                  imgs[0] = url;
                  setEditingBook({ ...editingBook, images: imgs, coverImageUrl: url });
                }}
                accept="image/*"
                fileType="image"
                hint="Upload high-res 3D/2D cover image from device or paste image URL"
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
                      value={editingBook.price ?? 299}
                      onChange={(e) => setEditingBook({ ...editingBook, price: Number(e.target.value) })}
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
                    value={editingBook.status || "published"}
                    onChange={(e) => setEditingBook({ ...editingBook, status: e.target.value as any })}
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
                  onClick={() => setEditingBook(null)}
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
                  <span>{saving ? "Saving..." : "Save E-Book"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
