"use client";

import { useEffect, useState } from "react";
import {
  Camera,
  Save,
  Plus,
  Trash2,
  Check,
  IndianRupee,
  CheckCircle2,
  UploadCloud,
} from "lucide-react";
import type { AdminService, AdminServicePackage } from "@/lib/admin/types";
import { FileUploader } from "@/components/admin/file-uploader";

export default function EventPhotographyAdminPage() {
  const [service, setService] = useState<AdminService | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      const all: AdminService[] = data.services || [];
      const matched = all.find((s) => s.slug === "event-photography" || s.id === "svc-007");
      if (matched) {
        setService(matched);
      } else {
        // Fallback default
        setService({
          id: "svc-007",
          slug: "event-photography",
          title: "Event Photography & Cinematography",
          description: "Luxury multi-cam photography for weddings, birthdays and corporate summits.",
          longDescription: "Capturing timeless elegance, authentic raw emotions, and grand celebrations with Sony FX3 & G-Master lenses.",
          icon: "Camera",
          status: "active",
          turnaround: "24-48 Hours Sneak Peek / 7 Days Full",
          features: [
            "Sony FX3 & A7 IV dual camera setup",
            "Prime 35mm, 50mm, 85mm f/1.4 lenses",
            "Godox AD600 Pro high-speed lighting",
            "Skin-tone perfecting RAW color grading",
          ],
          packages: [
            {
              name: "Silver Essential Coverage",
              price: 14999,
              currency: "INR",
              description: "Intimate birthdays, baby showers, engagements up to 4 hours.",
              features: [
                "1 Senior Candid Photographer",
                "Up to 4 hours continuous coverage",
                "150+ high-res color-graded RAW photos",
                "Private cloud gallery with instant download",
              ],
              isPopular: false,
            },
            {
              name: "Gold Wedding & Grand Gala",
              price: 34999,
              currency: "INR",
              description: "Full-day comprehensive dual-crew coverage with 4K highlight film.",
              features: [
                "2 Senior Photographers (Candid + Traditional)",
                "1 Cinematographer for 4K highlight film",
                "Up to 8 hours comprehensive coverage",
                "400+ master retouched photos + 3-minute teaser",
              ],
              isPopular: true,
            },
            {
              name: "Royal Platinum Grand Celebration",
              price: 74999,
              currency: "INR",
              description: "Ultimate luxury 3-day multi-ceremony production with licensed drone.",
              features: [
                "Full 4-person senior crew (2 Photos + 2 Cinema)",
                "DJI Mavic 3 Cine 4K aerial drone coverage",
                "1,000+ master edited images + 10-minute feature film",
                "Handcrafted 40-page Italian leather flush-mount album",
              ],
              isPopular: false,
            },
          ],
          portfolioImages: [
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
            "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80",
            "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
          ],
        });
      }
    } catch (err) {
      console.error("Failed to fetch photography service:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save photography service:", err);
    } finally {
      setSaving(false);
    }
  };

  const updatePackage = (idx: number, updates: Partial<AdminServicePackage>) => {
    if (!service?.packages) return;
    const pkgs = [...service.packages];
    pkgs[idx] = { ...pkgs[idx], ...updates };
    setService({ ...service, packages: pkgs });
  };

  const addPackageFeature = (pkgIdx: number, featureText: string) => {
    if (!featureText.trim() || !service?.packages) return;
    const pkgs = [...service.packages];
    pkgs[pkgIdx].features = [...(pkgs[pkgIdx].features || []), featureText.trim()];
    setService({ ...service, packages: pkgs });
  };

  const removePackageFeature = (pkgIdx: number, fIdx: number) => {
    if (!service?.packages) return;
    const pkgs = [...service.packages];
    pkgs[pkgIdx].features = (pkgs[pkgIdx].features || []).filter((_, i) => i !== fIdx);
    setService({ ...service, packages: pkgs });
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#FF5A36] border-t-transparent" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="p-8 text-center text-zinc-400">
        Event photography service not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-[#FF5A36]" />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Event Photography Service Manager
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Configure Silver (₹14,999), Gold (₹34,999), and Royal Platinum (₹74,999) wedding &amp; event coverage packages.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Changes saved live to website!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: 3-Tier Pricing Packages */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur-md space-y-5">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="font-heading text-sm font-bold text-white flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-[#FF5A36]" />
              <span>3-Tier Event Photography Packages</span>
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Customize tier names, prices, descriptions, and deliverables.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {(service.packages || []).map((pkg, idx) => (
              <div
                key={idx}
                className={`rounded-xl border p-4 transition-all ${
                  pkg.isPopular
                    ? "border-[#FF5A36]/50 bg-[#FF5A36]/5"
                    : "border-zinc-800 bg-zinc-900/40"
                }`}
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="font-heading text-xs font-bold text-white uppercase">
                    Tier {idx + 1}: {idx === 0 ? "Silver" : idx === 1 ? "Gold" : "Platinum"}
                  </span>
                  <label className="flex items-center gap-1.5 text-[11px] text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pkg.isPopular || false}
                      onChange={(e) => updatePackage(idx, { isPopular: e.target.checked })}
                      className="rounded border-zinc-700 text-[#FF5A36] focus:ring-[#FF5A36]"
                    />
                    <span>Popular</span>
                  </label>
                </div>

                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300">
                      Tier Name
                    </label>
                    <input
                      type="text"
                      value={pkg.name || ""}
                      onChange={(e) => updatePackage(idx, { name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300">
                      Price (₹ INR)
                    </label>
                    <div className="relative mt-1">
                      <IndianRupee className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="number"
                        value={pkg.price ?? 14999}
                        onChange={(e) => updatePackage(idx, { price: Number(e.target.value) })}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pr-3 pl-8 py-1.5 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={pkg.description || ""}
                      onChange={(e) => updatePackage(idx, { description: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                      Included Features ({pkg.features?.length || 0})
                    </label>
                    <div className="space-y-1">
                      {(pkg.features || []).map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center justify-between rounded-lg bg-zinc-950 px-2 py-1 text-[11px] text-zinc-300 border border-zinc-850"
                        >
                          <span className="truncate">{feat}</span>
                          <button
                            type="button"
                            onClick={() => removePackageFeature(idx, fIdx)}
                            className="text-zinc-500 hover:text-red-400 p-0.5"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 flex gap-1.5">
                      <input
                        type="text"
                        id={`photo-pkg-feat-${idx}`}
                        placeholder="Add feature..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const input = e.currentTarget;
                            if (input.value.trim()) {
                              addPackageFeature(idx, input.value);
                              input.value = "";
                            }
                          }
                        }}
                        className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById(`photo-pkg-feat-${idx}`) as HTMLInputElement;
                          if (input && input.value.trim()) {
                            addPackageFeature(idx, input.value);
                            input.value = "";
                          }
                        }}
                        className="rounded-xl bg-zinc-800 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-700"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Portfolio Gallery Uploads */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur-md space-y-4">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="font-heading text-sm font-bold text-white flex items-center gap-2">
              <Camera className="h-4 w-4 text-[#FF5A36]" />
              <span>Event Photography Portfolio Gallery</span>
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              High-resolution photo highlights displayed in the masonry gallery on the public page.
            </p>
          </div>

          <FileUploader
            label="Upload Portfolio Photo"
            value={newImageUrl}
            onChange={(url) => {
              if (url.trim()) {
                const imgs = [...(service.portfolioImages || [])];
                imgs.push(url.trim());
                setService({ ...service, portfolioImages: imgs });
                setNewImageUrl("");
              }
            }}
            accept="image/*"
            fileType="image"
            hint="Upload JPG/PNG photo from your device"
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2">
            {(service.portfolioImages || []).map((img, iIdx) => (
              <div
                key={iIdx}
                className="relative group aspect-[4/3] rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden"
              >
                <img src={img} alt="Portfolio sample" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    const imgs = (service.portfolioImages || []).filter((_, i) => i !== iIdx);
                    setService({ ...service, portfolioImages: imgs });
                  }}
                  className="absolute top-2 right-2 rounded-lg bg-black/70 p-1.5 text-zinc-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Guarantees */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur-md space-y-4">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="font-heading text-sm font-bold text-white">
              Studio Methodology &amp; Details
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300">
              Turnaround Time
            </label>
            <input
              type="text"
              value={service.turnaround || "24-48 Hours Sneak Peek / 7 Days Full"}
              onChange={(e) => setService({ ...service, turnaround: e.target.value })}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300">
              Overview Description
            </label>
            <textarea
              rows={3}
              value={service.longDescription || ""}
              onChange={(e) => setService({ ...service, longDescription: e.target.value })}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A36] px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] disabled:opacity-50 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving Changes..." : "Save Event Photography Service"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
