"use client";

import { useEffect, useState, useRef } from "react";
import {
  Music,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  IndianRupee,
  Link as LinkIcon,
  Play,
  Pause,
  Save,
  X,
  Volume2,
} from "lucide-react";
import type { AdminProduct } from "@/lib/admin/types";
import { FileUploader } from "@/components/admin/file-uploader";

export default function SoundEffectsAdminPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingTrack, setEditingTrack] = useState<Partial<AdminProduct> | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Audio preview playback
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      const all: AdminProduct[] = data.products || [];
      setProducts(
        all.filter(
          (p) =>
            p.category === "editing-bundles" ||
            p.productType === "audio" ||
            p.productType === "editing-bundle"
        )
      );
    } catch (err) {
      console.error("Failed to load audio tracks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAudioToggle = (url: string) => {
    if (playingUrl === url) {
      audioRef.current?.pause();
      setPlayingUrl(null);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
      } else {
        audioRef.current.src = url;
      }
      audioRef.current.play().catch(() => {});
      audioRef.current.onended = () => setPlayingUrl(null);
      setPlayingUrl(url);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack?.title) return;

    setSaving(true);
    try {
      const payload: Partial<AdminProduct> = {
        ...editingTrack,
        category: "editing-bundles",
        productType: "audio",
        deliveryType: editingTrack.googleDriveUrl ? "google-drive" : "download-url",
        status: editingTrack.status || "published",
        price: Number(editingTrack.price) || 0,
        originalPrice: editingTrack.originalPrice ? Number(editingTrack.originalPrice) : undefined,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchTracks();
        setEditingTrack(null);
      }
    } catch (err) {
      console.error("Error saving audio track:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this sound effect / music track?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting track:", err);
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
      (p.audioCategory || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-[#FF5A36]" />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Sound Effects &amp; BG Music Manager
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Publish royalty-free Reels background music, cinematic SFX &amp; motion audio. Stream previews in real-time.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingTrack({
              title: "",
              description: "",
              price: 149,
              originalPrice: 399,
              category: "editing-bundles",
              productType: "audio",
              audioCategory: "Reels BGM",
              audioDuration: "1:30",
              status: "published",
              images: ["https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80"],
            })
          }
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A36] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Upload New Track</span>
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
            placeholder="Search audio tracks by title or category..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pr-4 pl-9 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
          />
        </div>
        <span className="text-xs text-zinc-500">
          Total Tracks: <strong className="text-zinc-200">{filtered.length}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 backdrop-blur-md">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Sound Track</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Master Download Link</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-500">
                  Loading audio library...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-500">
                  No audio tracks found. Click "Upload New Track" to add a sound effect or music pack.
                </td>
              </tr>
            ) : (
              filtered.map((t) => {
                const isPlaying = playingUrl === t.audioPreviewUrl;
                return (
                  <tr key={t.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => t.audioPreviewUrl && handleAudioToggle(t.audioPreviewUrl)}
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                            isPlaying
                              ? "bg-[#FF5A36] text-white shadow-md animate-pulse"
                              : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-[#FF5A36] hover:text-[#FF5A36]"
                          }`}
                          title={isPlaying ? "Pause track" : "Play stream preview"}
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                        </button>

                        <div className="max-w-xs truncate">
                          <span className="font-heading font-semibold text-white truncate block">
                            {t.title}
                          </span>
                          <span className="text-[11px] text-zinc-500">{t.description || "Royalty-free audio track"}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="rounded-full bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 text-[11px] font-medium text-[#FF5A36]">
                        {t.audioCategory || "SFX & Music"}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-zinc-400 font-mono text-[11px]">
                      {t.audioDuration || "0:45"}
                    </td>

                    <td className="px-4 py-3.5 font-heading font-bold text-white">
                      {t.price === 0 ? (
                        <span className="text-emerald-400">FREE</span>
                      ) : (
                        `₹${t.price.toLocaleString("en-IN")}`
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      {t.googleDriveUrl || t.downloadUrl ? (
                        <button
                          type="button"
                          onClick={() => handleCopyLink(t.googleDriveUrl || t.downloadUrl!, t.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1 text-[11px] text-emerald-400 hover:bg-zinc-800 transition-colors"
                        >
                          <LinkIcon className="h-3 w-3" />
                          <span>{copiedId === t.id ? "Copied!" : "Master Link"}</span>
                        </button>
                      ) : (
                        <span className="text-zinc-500">Direct Download</span>
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
                          onClick={() => setEditingTrack(t)}
                          className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800"
                          title="Edit track"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="rounded-lg p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                          title="Delete track"
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

      {/* Upload / Edit Modal */}
      {editingTrack && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <h2 className="font-heading text-lg font-bold text-white">
                {editingTrack.id ? `Edit: ${editingTrack.title}` : "Upload Sound Effect / Music"}
              </h2>
              <button
                onClick={() => setEditingTrack(null)}
                className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Track / SFX Title <span className="text-[#FF5A36]">*</span>
                </label>
                <input
                  type="text"
                  value={editingTrack.title || ""}
                  onChange={(e) => setEditingTrack({ ...editingTrack, title: e.target.value })}
                  required
                  placeholder="e.g. Cinematic Tension Riser & Whoosh Drop"
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Audio Category
                  </label>
                  <input
                    type="text"
                    value={editingTrack.audioCategory || ""}
                    onChange={(e) => setEditingTrack({ ...editingTrack, audioCategory: e.target.value })}
                    placeholder="e.g. Reels BGM, Cinematic, Ambient, Whoosh"
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Audio Duration
                  </label>
                  <input
                    type="text"
                    value={editingTrack.audioDuration || ""}
                    onChange={(e) => setEditingTrack({ ...editingTrack, audioDuration: e.target.value })}
                    placeholder="e.g. 1:45"
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>
              </div>

              {/* Audio Stream Preview Uploader */}
              <FileUploader
                label="Audio Stream Preview (MP3 / WAV / OGG)"
                value={editingTrack.audioPreviewUrl || ""}
                onChange={(url) => setEditingTrack({ ...editingTrack, audioPreviewUrl: url })}
                accept="audio/*"
                fileType="audio"
                hint="Upload MP3/WAV from your device or paste audio stream URL"
              />

              {/* Master WAV / Full Download File */}
              <FileUploader
                label="Master Audio File or ZIP Archive (Delivered to Buyers)"
                value={editingTrack.googleDriveUrl || editingTrack.downloadUrl || ""}
                onChange={(url) =>
                  setEditingTrack({
                    ...editingTrack,
                    googleDriveUrl: url,
                    downloadUrl: url,
                  })
                }
                fileType="any"
                hint="Directly upload master lossless WAV/MP3 file or ZIP from device, or paste Drive link"
              />

              {/* Cover Artwork */}
              <FileUploader
                label="Track Artwork / Thumbnail"
                value={editingTrack.images?.[0] || editingTrack.coverImageUrl || ""}
                onChange={(url) => {
                  const imgs = [...(editingTrack.images || [])];
                  imgs[0] = url;
                  setEditingTrack({ ...editingTrack, images: imgs, coverImageUrl: url });
                }}
                accept="image/*"
                fileType="image"
                hint="Cover visual for the Spotify-style player"
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
                      value={editingTrack.price ?? 149}
                      onChange={(e) => setEditingTrack({ ...editingTrack, price: Number(e.target.value) })}
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
                    value={editingTrack.status || "published"}
                    onChange={(e) => setEditingTrack({ ...editingTrack, status: e.target.value as any })}
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
                  onClick={() => setEditingTrack(null)}
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
                  <span>{saving ? "Saving..." : "Save Track"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
