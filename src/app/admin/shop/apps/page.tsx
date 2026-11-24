"use client";

import { useEffect, useState } from "react";
import {
  Smartphone,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  IndianRupee,
  Link as LinkIcon,
  Download,
  Save,
  X,
  ShieldCheck,
} from "lucide-react";
import type { AdminProduct } from "@/lib/admin/types";
import { FileUploader } from "@/components/admin/file-uploader";
import { safeParseJson } from "@/lib/utils";

export default function AppsAdminPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingApp, setEditingApp] = useState<Partial<AdminProduct> | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      if (res.status === 401) {
        window.location.replace("/admin/login");
        return;
      }
      const data = await safeParseJson<{ products?: AdminProduct[] }>(res, {});
      const all: AdminProduct[] = data.products || [];
      setProducts(all.filter((p) => p.category === "editing-apps" || p.productType === "app-license"));
    } catch (err) {
      console.error("Failed to load apps:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp?.title) return;

    setSaving(true);
    try {
      const payload: Partial<AdminProduct> = {
        ...editingApp,
        category: "editing-apps",
        productType: "app-license",
        deliveryType: editingApp.googleDriveUrl ? "google-drive" : "download-url",
        status: editingApp.status || "published",
        price: Number(editingApp.price) || 0,
        originalPrice: editingApp.originalPrice ? Number(editingApp.originalPrice) : undefined,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchApps();
        setEditingApp(null);
      }
    } catch (err) {
      console.error("Error saving app:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this app?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting app:", err);
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
            <Smartphone className="h-5 w-5 text-emerald-400" />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Verified Creator Apps Manager
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Publish verified mobile applications, unlocked editing suites &amp; developer tools. Direct cloud download links for customers.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingApp({
              title: "",
              description: "",
              price: 0,
              originalPrice: 499,
              category: "editing-apps",
              productType: "app-license",
              appVersion: "v12.4 Pro Unlocked",
              appPlatform: "Android 9.0+ / Mobile",
              fileSize: "84 MB",
              status: "published",
              images: ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80"],
            })
          }
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A36] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New App</span>
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
            placeholder="Search apps by title or platform..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pr-4 pl-9 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
          />
        </div>
        <span className="text-xs text-zinc-500">
          Total Apps: <strong className="text-zinc-200">{filtered.length}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 backdrop-blur-md">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Application</th>
              <th className="px-4 py-3 font-medium">Version</th>
              <th className="px-4 py-3 font-medium">Platform / OS</th>
              <th className="px-4 py-3 font-medium">File Size</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Cloud Download Link</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                  Loading apps...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                  No apps found. Click "Add New App" to list your first verified mobile suite.
                </td>
              </tr>
            ) : (
              filtered.map((app) => (
                <tr key={app.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                        <img
                          src={app.images?.[0] || app.coverImageUrl || "/images/og/og-default.png"}
                          alt={app.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="max-w-xs truncate">
                        <span className="font-heading font-semibold text-white truncate block">
                          {app.title}
                        </span>
                        <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          <span>Verified Safe</span>
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-zinc-300 font-mono text-[11px]">
                    {app.appVersion || "v1.0"}
                  </td>

                  <td className="px-4 py-3.5 text-zinc-400">
                    {app.appPlatform || "Mobile App"}
                  </td>

                  <td className="px-4 py-3.5 text-zinc-400">
                    {app.fileSize || "64 MB"}
                  </td>

                  <td className="px-4 py-3.5 font-heading font-bold text-white">
                    {app.price === 0 ? (
                      <span className="text-emerald-400">FREE</span>
                    ) : (
                      `₹${app.price.toLocaleString("en-IN")}`
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    {app.appDownloadUrl || app.downloadUrl || app.googleDriveUrl ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyLink(
                            app.appDownloadUrl || app.downloadUrl || app.googleDriveUrl!,
                            app.id
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1 text-[11px] text-blue-400 hover:bg-zinc-800 transition-colors"
                      >
                        <LinkIcon className="h-3 w-3" />
                        <span>{copiedId === app.id ? "Copied!" : "Download Link"}</span>
                      </button>
                    ) : (
                      <span className="text-zinc-500">No link set</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        app.status === "published"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingApp(app)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Edit app"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                        title="Delete app"
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
      {editingApp && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <h2 className="font-heading text-lg font-bold text-white">
                {editingApp.id ? `Edit: ${editingApp.title}` : "Upload Verified App"}
              </h2>
              <button
                onClick={() => setEditingApp(null)}
                className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  App Title <span className="text-[#FF5A36]">*</span>
                </label>
                <input
                  type="text"
                  value={editingApp.title || ""}
                  onChange={(e) => setEditingApp({ ...editingApp, title: e.target.value })}
                  required
                  placeholder="e.g. CapCut Pro 2026 Creative Suite"
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingApp.description || ""}
                  onChange={(e) => setEditingApp({ ...editingApp, description: e.target.value })}
                  placeholder="Unlocked creator app features, premium filters, 4K 60FPS exports..."
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    App Version
                  </label>
                  <input
                    type="text"
                    value={editingApp.appVersion || ""}
                    onChange={(e) => setEditingApp({ ...editingApp, appVersion: e.target.value })}
                    placeholder="e.g. v12.4 Pro Unlocked"
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Platform Compatibility
                  </label>
                  <input
                    type="text"
                    value={editingApp.appPlatform || ""}
                    onChange={(e) => setEditingApp({ ...editingApp, appPlatform: e.target.value })}
                    placeholder="e.g. Android 9.0+ / Mobile / iOS"
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>
              </div>

              {/* Direct File or Cloud Download Link */}
              <FileUploader
                label="App Installer File or Cloud Download Link"
                value={editingApp.appDownloadUrl || editingApp.downloadUrl || ""}
                onChange={(url) => setEditingApp({ ...editingApp, appDownloadUrl: url, downloadUrl: url })}
                hint="Upload installer file from device or paste Google Drive / cloud download link"
                placeholder="https://drive.google.com/file/d/... or /uploads/..."
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={editingApp.fileSize || ""}
                    onChange={(e) => setEditingApp({ ...editingApp, fileSize: e.target.value })}
                    placeholder="e.g. 84 MB"
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Selling Price (₹ INR — 0 for FREE)
                  </label>
                  <div className="relative mt-1">
                    <IndianRupee className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="number"
                      value={editingApp.price ?? 0}
                      onChange={(e) => setEditingApp({ ...editingApp, price: Number(e.target.value) })}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pr-3 pl-8 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                      min={0}
                    />
                  </div>
                </div>
              </div>

              {/* App Icon / Cover Image Uploader */}
              <FileUploader
                label="App Logo / Icon"
                value={editingApp.images?.[0] || editingApp.coverImageUrl || ""}
                onChange={(url) => {
                  const imgs = [...(editingApp.images || [])];
                  imgs[0] = url;
                  setEditingApp({ ...editingApp, images: imgs, coverImageUrl: url });
                }}
                accept="image/*"
                fileType="image"
                hint="Square app icon (512x512 recommended)"
              />

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Publish Status
                </label>
                <select
                  value={editingApp.status || "published"}
                  onChange={(e) => setEditingApp({ ...editingApp, status: e.target.value as any })}
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                >
                  <option value="published">Published (Live on App Store)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
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
                  <span>{saving ? "Saving..." : "Save App"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
