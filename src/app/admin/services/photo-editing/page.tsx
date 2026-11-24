"use client";

import { useEffect, useState } from "react";
import {
  Camera,
  Save,
  Plus,
  Trash2,
  Check,
  IndianRupee,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import type { AdminService, AdminServicePackage } from "@/lib/admin/types";
import { FileUploader } from "@/components/admin/file-uploader";
import { BeforeAfterSlider } from "@/components/shared/before-after-slider";
import { safeParseJson } from "@/lib/utils";

export default function PhotoEditingAdminPage() {
  const [service, setService] = useState<AdminService | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Before/after new item temp inputs
  const [baBefore, setBaBefore] = useState("");
  const [baAfter, setBaAfter] = useState("");
  const [baTitle, setBaTitle] = useState("");

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const res = await fetch("/api/admin/services", { cache: "no-store" });
      if (res.status === 401) {
        window.location.replace("/admin/login");
        return;
      }
      const data = await safeParseJson<{ services?: AdminService[] }>(res, {});
      const all: AdminService[] = data.services || [];
      const matched = all.find((s) => s.slug === "photo-editing" || s.id === "svc-002");
      if (matched) setService(matched);
    } catch (err) {
      console.error("Failed to fetch photo editing service:", err);
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
      console.error("Failed to save photo service:", err);
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
    return <div className="p-8 text-center text-zinc-400">Photo editing service not found.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-400" />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Photo Editing Service Manager
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Manage high-end photo retouching packages (₹150 Basic / ₹350 Editorial / ₹799 Commercial) &amp; interactive Before/After client showcase sliders.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4" />
            <span>Changes saved live to website!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tier Pricing Packages */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur-md space-y-5">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="font-heading text-sm font-bold text-white flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-[#FF5A36]" />
              <span>3-Tier Photo Retouching Packages</span>
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Basic Retouch starts at ₹150, Editorial Color Grade at ₹350, and Commercial Composite at ₹799.
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
                    Tier {idx + 1}: {idx === 0 ? "Basic Retouch" : idx === 1 ? "Editorial Grade" : "Commercial Composite"}
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
                        value={pkg.price ?? 150}
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

        {/* Before/After Image Showcase */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur-md space-y-4">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="font-heading text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-blue-400" />
              <span>Before &amp; After Photo Showcase Pairs</span>
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Add Before &amp; After photo pairs to showcase on the live Photo Editing service page with interactive comparison sliders.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FileUploader
              label="Before Photo (RAW Unedited)"
              value={baBefore}
              onChange={(url) => setBaBefore(url)}
              accept="image/*"
              fileType="image"
              hint="Upload raw photo from device or paste link"
            />

            <FileUploader
              label="After Photo (High-End Retouched)"
              value={baAfter}
              onChange={(url) => setBaAfter(url)}
              accept="image/*"
              fileType="image"
              hint="Upload graded photo from device or paste link"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <input
              type="text"
              value={baTitle}
              onChange={(e) => setBaTitle(e.target.value)}
              placeholder="Case title (e.g. Skin Retouching & Color Grading)"
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (baBefore && baAfter) {
                  const items = [...(service.portfolioBeforeAfter || [])];
                  items.push({ before: baBefore, after: baAfter, title: baTitle || "Studio Retouching" });
                  setService({ ...service, portfolioBeforeAfter: items });
                  setBaBefore("");
                  setBaAfter("");
                  setBaTitle("");
                }
              }}
              className="rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 shrink-0"
            >
              + Add Showcase Pair
            </button>
          </div>

          {/* List of Before/After pairs */}
          <div className="space-y-4 pt-3">
            {(service.portfolioBeforeAfter || []).map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xs font-bold text-white">
                    {item.title || `Showcase #${idx + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const items = (service.portfolioBeforeAfter || []).filter((_, i) => i !== idx);
                      setService({ ...service, portfolioBeforeAfter: items });
                    }}
                    className="text-zinc-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="h-56 w-full max-w-md mx-auto">
                  <BeforeAfterSlider
                    beforeImage={item.before}
                    afterImage={item.after}
                    beforeLabel="RAW Before"
                    afterLabel="Retouched After"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A36] px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] disabled:opacity-50 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving Changes..." : "Save Photo Editing Service"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
