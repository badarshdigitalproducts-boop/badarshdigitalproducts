"use client";

import { useEffect, useState } from "react";
import {
  Globe,
  Save,
  Plus,
  Trash2,
  Check,
  IndianRupee,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import type { AdminService, AdminServicePackage } from "@/lib/admin/types";
import { FileUploader } from "@/components/admin/file-uploader";

export default function WebsiteDesignAdminPage() {
  const [service, setService] = useState<AdminService | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Live website temp inputs
  const [webName, setWebName] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [webImage, setWebImage] = useState("");
  const [webTags, setWebTags] = useState("");

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      const all: AdminService[] = data.services || [];
      const matched = all.find(
        (s) => s.slug === "website-design" || s.slug === "website-building" || s.id === "svc-004"
      );
      if (matched) setService(matched);
    } catch (err) {
      console.error("Failed to fetch web design service:", err);
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
      console.error("Failed to save website service:", err);
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
    return <div className="p-8 text-center text-zinc-400">Website development service not found.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-400" />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Website Development Service Manager
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Manage high-conversion Next.js website design tiers (₹3k–₹6k / ₹9k–₹11k / ₹15k+) and live portfolio links.
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
              <span>3-Tier Website Development Packages</span>
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Starter Launch (₹3,000–₹6,000), Business Growth (₹9,000–₹11,000), and Custom Enterprise Platform (₹15,000+).
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
                    Tier {idx + 1}: {pkg.name || "Web Tier"}
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
                      Package Name
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
                      Starting Price (₹ INR)
                    </label>
                    <div className="relative mt-1">
                      <IndianRupee className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="number"
                        value={pkg.price ?? 3000}
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
                      Deliverables ({pkg.features?.length || 0})
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
                        id={`web-pkg-feat-${idx}`}
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
                          const input = document.getElementById(`web-pkg-feat-${idx}`) as HTMLInputElement;
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

        {/* Live Client Websites Showcase */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur-md space-y-4">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="font-heading text-sm font-bold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-400" />
              <span>Live Website Portfolio Showcase</span>
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Add links to real websites your studio has built so visitors can click to test the live websites directly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300">
                Website / Client Title
              </label>
              <input
                type="text"
                value={webName}
                onChange={(e) => setWebName(e.target.value)}
                placeholder="e.g. Aura Luxury Fashion Store"
                className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300">
                Live URL Link
              </label>
              <input
                type="url"
                value={webUrl}
                onChange={(e) => setWebUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
              />
            </div>
          </div>

          <FileUploader
            label="Website Screenshot Preview Image"
            value={webImage}
            onChange={(url) => setWebImage(url)}
            accept="image/*"
            fileType="image"
            hint="Upload screenshot from device or paste image URL"
          />

          <div>
            <label className="block text-xs font-semibold text-zinc-300">
              Tech Stack Tags (Comma separated)
            </label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={webTags}
                onChange={(e) => setWebTags(e.target.value)}
                placeholder="e.g. Next.js, Tailwind, CashFree, Supabase"
                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (webName && webUrl) {
                    const items = [...(service.portfolioWebsites || [])];
                    items.push({
                      name: webName,
                      url: webUrl,
                      image: webImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
                      tags: webTags.split(",").map((s) => s.trim()).filter(Boolean),
                    });
                    setService({ ...service, portfolioWebsites: items });
                    setWebName("");
                    setWebUrl("");
                    setWebImage("");
                    setWebTags("");
                  }
                }}
                className="rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 shrink-0"
              >
                + Add Live Website
              </button>
            </div>
          </div>

          {/* List of Websites */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            {(service.portfolioWebsites || []).map((site, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-3"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                    <img src={site.image} alt={site.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="truncate">
                    <span className="font-heading text-xs font-bold text-white truncate block">
                      {site.name}
                    </span>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span className="truncate">{site.url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const items = (service.portfolioWebsites || []).filter((_, i) => i !== idx);
                    setService({ ...service, portfolioWebsites: items });
                  }}
                  className="text-zinc-500 hover:text-red-400 p-1.5"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
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
            <span>{saving ? "Saving Changes..." : "Save Website Service"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
