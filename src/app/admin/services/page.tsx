"use client";

import { useEffect, useState } from "react";
import {
  Layers,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Clock,
  IndianRupee,
  Sparkles,
  Video,
  Globe,
  Smartphone,
  Camera,
  Megaphone,
  X,
  Save,
  Check,
  ChevronDown,
  ChevronUp,
  Play,
  Image as ImageIcon,
  Sliders,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import type {
  AdminService,
  AdminServicePackage,
  PortfolioBeforeAfterItem,
  PortfolioWebsiteItem,
  PortfolioLogoItem,
} from "@/lib/admin/types";
import { getWhatsAppUrl } from "@/lib/utils";
import { BeforeAfterSlider } from "@/components/shared/before-after-slider";
import { FileUploader } from "@/components/admin/file-uploader";

const ICON_OPTIONS = [
  { value: "Video", label: "Video Production" },
  { value: "Globe", label: "Web Development" },
  { value: "Smartphone", label: "Mobile App" },
  { value: "Camera", label: "Photo Retouching" },
  { value: "Megaphone", label: "Social Media" },
  { value: "Sparkles", label: "Branding & Identity" },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingService, setEditingService] = useState<Partial<AdminService> | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "packages" | "portfolio">("general");
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  // Temporary inputs for portfolio items
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  // Before/After temp input
  const [baBefore, setBaBefore] = useState("");
  const [baAfter, setBaAfter] = useState("");
  const [baTitle, setBaTitle] = useState("");

  // Live website temp input
  const [webName, setWebName] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [webImage, setWebImage] = useState("");
  const [webTags, setWebTags] = useState("");

  // Logo temp input
  const [logoName, setLogoName] = useState("");
  const [logoDark, setLogoDark] = useState("");
  const [logoLight, setLogoLight] = useState("");
  const [logoCategory, setLogoCategory] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      setServices(data.services || []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService),
      });

      if (res.ok) {
        await fetchServices();
        setEditingService(null);
      }
    } catch (err) {
      console.error("Failed to save service:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agency service?")) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete service:", err);
    }
  };

  const handleToggleStatus = async (service: AdminService) => {
    const updatedStatus = service.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...service, status: updatedStatus }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, status: updatedStatus } : s))
        );
      }
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  const addFeature = () => {
    if (!newFeature.trim() || !editingService) return;
    const existing = editingService.features || [];
    setEditingService({
      ...editingService,
      features: [...existing, newFeature.trim()],
    });
    setNewFeature("");
  };

  const removeFeature = (idx: number) => {
    if (!editingService) return;
    const existing = editingService.features || [];
    setEditingService({
      ...editingService,
      features: existing.filter((_, i) => i !== idx),
    });
  };

  const updatePackage = (idx: number, updates: Partial<AdminServicePackage>) => {
    if (!editingService?.packages) return;
    const pkgs = [...editingService.packages];
    pkgs[idx] = { ...pkgs[idx], ...updates };
    setEditingService({ ...editingService, packages: pkgs });
  };

  const addPackageFeature = (pkgIdx: number, featureText: string) => {
    if (!featureText.trim() || !editingService?.packages) return;
    const pkgs = [...editingService.packages];
    pkgs[pkgIdx].features = [...(pkgs[pkgIdx].features || []), featureText.trim()];
    setEditingService({ ...editingService, packages: pkgs });
  };

  const removePackageFeature = (pkgIdx: number, fIdx: number) => {
    if (!editingService?.packages) return;
    const pkgs = [...editingService.packages];
    pkgs[pkgIdx].features = (pkgs[pkgIdx].features || []).filter((_, i) => i !== fIdx);
    setEditingService({ ...editingService, packages: pkgs });
  };

  const filteredServices = services.filter((s) => {
    return (
      search === "" ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#FF5A36]" />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Creative Agency Services Studio
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage Video Editing (₹250/₹400/₹799), Photo Retouching (₹150/₹350/₹799), Logo Design (₹500/₹1199/₹1999), Web Design &amp; App Development.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingService({
              title: "",
              description: "",
              longDescription: "",
              category: "Agency Creative",
              turnaround: "48-72 Hours",
              status: "active",
              icon: "Video",
              features: [
                "Dedicated Lead Creative",
                "High-Converting Pacing & Retention",
                "Full Commercial Rights",
                "48-Hour Standard Delivery",
              ],
              packages: [
                {
                  name: "Basic",
                  price: 250,
                  currency: "INR",
                  period: "video",
                  description: "Essential polish for short-form content",
                  features: ["1080p Full HD", "Subtitles & Captions", "Sound Balancing", "1 Free Revision"],
                  isPopular: false,
                },
                {
                  name: "Viral Retention",
                  price: 400,
                  currency: "INR",
                  period: "video",
                  description: "High-engagement edits engineered for maximum watch-time",
                  features: ["Motion Graphics & Overlays", "B-Roll & Sound Effects", "Dynamic Hooks", "2 Revisions"],
                  isPopular: true,
                },
                {
                  name: "Cinematic Master",
                  price: 799,
                  currency: "INR",
                  period: "video",
                  description: "Mind-blowing cinematic production with color grading & bespoke SFX",
                  features: ["4K Cinema Grade Output", "Custom Sound Design", "Thumbnail Strategy", "Unlimited Revisions"],
                  isPopular: false,
                },
              ],
              portfolioVideos: [],
              portfolioImages: [],
            });
            setActiveTab("general");
          }}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A36] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-950/40">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#FF5A36] border-t-transparent" />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-12 text-center">
            <Layers className="mx-auto h-8 w-8 text-zinc-600" />
            <h3 className="mt-2 text-sm font-semibold text-zinc-400">No Services Found</h3>
            <p className="mt-1 text-xs text-zinc-600">Create your first creative service package above.</p>
          </div>
        ) : (
          filteredServices.map((service, index) => {
            const isExpanded = expandedServiceId === service.id;
            return (
              <div
                key={service.id}
                className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md transition-all hover:border-zinc-700"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-[#FF5A36]">
                      {service.icon === "Video" && <Video className="h-5 w-5" />}
                      {service.icon === "Camera" && <Camera className="h-5 w-5" />}
                      {service.icon === "Globe" && <Globe className="h-5 w-5" />}
                      {service.icon === "Smartphone" && <Smartphone className="h-5 w-5" />}
                      {service.icon === "Sparkles" && <Sparkles className="h-5 w-5" />}
                      {(!service.icon || service.icon === "Megaphone") && <Layers className="h-5 w-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-sm font-bold text-white">
                          {service.title}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            service.status === "active"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-zinc-800 text-zinc-500"
                          }`}
                        >
                          {service.status}
                        </span>
                        <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] text-zinc-400">
                          #{index + 1}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-400 line-clamp-1">
                        {service.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.turnaround || "48-72h"}
                        </span>
                        <span>•</span>
                        <span>{service.packages?.length || 0} Pricing Packages</span>
                        <span>•</span>
                        <span>
                          From ₹
                          {service.packages && service.packages.length > 0
                            ? Math.min(...service.packages.map((p) => p.price))
                            : 0}
                        </span>
                        {service.portfolioVideos && service.portfolioVideos.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-[#FF5A36]">{service.portfolioVideos.length} Videos</span>
                          </>
                        )}
                        {service.portfolioImages && service.portfolioImages.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400">{service.portfolioImages.length} Portfolio Assets</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => setExpandedServiceId(isExpanded ? null : service.id)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                    >
                      <span>{isExpanded ? "Hide Packages" : "View Packages"}</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>

                    <a
                      href={getWhatsAppUrl(`Hi! I'm inquiring about ${service.title} from BADARSH Studio.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      title="Test WhatsApp Inquiry Link"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>

                    <button
                      onClick={() => handleToggleStatus(service)}
                      className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:text-white transition-colors"
                      title={service.status === "active" ? "Deactivate Service" : "Activate Service"}
                    >
                      {service.status === "active" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-zinc-500" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setEditingService(service);
                        setActiveTab("general");
                      }}
                      className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:text-white transition-colors"
                      title="Edit Service, Packages & Portfolio"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Packages Drawer */}
                {isExpanded && service.packages && (
                  <div className="border-t border-zinc-800/80 bg-zinc-900/30 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
                      Tiered Service Packages:
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {service.packages.map((pkg, pIdx) => (
                        <div
                          key={pIdx}
                          className={`rounded-xl border p-4 ${
                            pkg.isPopular
                              ? "border-[#FF5A36]/40 bg-[#FF5A36]/5"
                              : "border-zinc-800 bg-zinc-950/60"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-heading text-xs font-bold text-white">
                              {pkg.name}
                            </span>
                            {pkg.isPopular && (
                              <span className="rounded-full bg-[#FF5A36]/15 px-2 py-0.5 text-[9px] font-bold text-[#FF5A36] uppercase">
                                Popular
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-baseline gap-1">
                            <span className="font-heading text-xl font-extrabold text-white">
                              ₹{pkg.price.toLocaleString("en-IN")}
                            </span>
                            {pkg.period && (
                              <span className="text-[10px] text-zinc-500">/{pkg.period}</span>
                            )}
                          </div>
                          <p className="mt-1 text-[11px] text-zinc-400 line-clamp-2">
                            {pkg.description}
                          </p>
                          <ul className="mt-3 space-y-1 text-[10px] text-zinc-400 border-t border-zinc-800/60 pt-2">
                            {pkg.features?.slice(0, 5).map((f, fIdx) => (
                              <li key={fIdx} className="flex items-center gap-1.5">
                                <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Service Editor Modal with Tabs (General, Packages, Portfolio) */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            {/* Modal Header & Navigation Tabs */}
            <div className="border-b border-zinc-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-lg font-bold text-white">
                    {editingService.id ? `Edit: ${editingService.title}` : "Create Agency Service"}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Configure service pitch, live tier pricing (₹ INR), deliverables, and trust-building portfolio showcases.
                  </p>
                </div>
                <button
                  onClick={() => setEditingService(null)}
                  className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-900 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="mt-4 flex gap-2 border-t border-zinc-800/80 pt-3">
                {[
                  { id: "general", label: "1. Service Details", icon: Layers },
                  { id: "packages", label: `2. Pricing Packages (${editingService.packages?.length || 0})`, icon: IndianRupee },
                  { id: "portfolio", label: "3. Portfolio Showcase", icon: Sparkles },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#FF5A36] text-white shadow-xs"
                          : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSaveService}>
              {/* TAB 1: General Details */}
              {activeTab === "general" && (
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300">
                      Service Title <span className="text-[#FF5A36]">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingService.title || ""}
                      onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                      required
                      placeholder="e.g. YouTube & Reel Video Editing"
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300">
                        Category Tag
                      </label>
                      <input
                        type="text"
                        value={editingService.category || "Agency Creative"}
                        onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300">
                        Standard Turnaround
                      </label>
                      <input
                        type="text"
                        value={editingService.turnaround || "48-72 Hours"}
                        onChange={(e) => setEditingService({ ...editingService, turnaround: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300">
                        Visual Icon
                      </label>
                      <select
                        value={editingService.icon || "Video"}
                        onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <FileUploader
                    label="Service Cover Photo / Hero Visual"
                    value={editingService.image || ""}
                    onChange={(url) => setEditingService({ ...editingService, image: url })}
                    accept="image/*"
                    fileType="image"
                    hint="Upload cover photo for this service directly from device, or paste image URL"
                  />

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300">
                      Short Pitch Description
                    </label>
                    <textarea
                      rows={2}
                      value={editingService.description || ""}
                      onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                      placeholder="High-retention video editing designed for YouTube creators and brands..."
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300">
                      Comprehensive Long Pitch (Methodology, Stack &amp; Standards)
                    </label>
                    <textarea
                      rows={3}
                      value={editingService.longDescription || ""}
                      onChange={(e) => setEditingService({ ...editingService, longDescription: e.target.value })}
                      placeholder="Detailed explanation of our editing workflow, color grading, pacing, and 100% guarantee..."
                      className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                    />
                  </div>

                  {/* Core Features / Guarantees List */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Deliverables &amp; Guarantees ({editingService.features?.length || 0})
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addFeature();
                          }
                        }}
                        placeholder="e.g. 48-Hour Rush Delivery Available"
                        className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="cursor-pointer rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white"
                      >
                        + Add
                      </button>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {editingService.features?.map((f, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-300"
                        >
                          <span>{f}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(i)}
                            className="cursor-pointer text-zinc-500 hover:text-red-400"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Pricing Packages */}
              {activeTab === "packages" && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#FF5A36]">
                        Tiered Packages &amp; Pricing (INR)
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Configure exact pricing, deliverables, and features for each client tier.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const pkgs = [...(editingService.packages || [])];
                        pkgs.push({
                          name: `Package ${pkgs.length + 1}`,
                          price: 499,
                          currency: "INR",
                          period: "project",
                          description: "Custom tailored creative service package",
                          features: ["Full Commercial License", "Fast Delivery", "2 Free Revisions"],
                          isPopular: false,
                        });
                        setEditingService({ ...editingService, packages: pkgs });
                      }}
                      className="cursor-pointer inline-flex items-center gap-1 rounded-xl bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Package Tier</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(editingService.packages || []).map((pkg, pIdx) => (
                      <div
                        key={pIdx}
                        className={`rounded-xl border p-4 transition-all ${
                          pkg.isPopular
                            ? "border-[#FF5A36]/50 bg-[#FF5A36]/5"
                            : "border-zinc-800 bg-zinc-900/40"
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-bold text-zinc-300">
                              Tier {pIdx + 1}
                            </span>
                            <span className="font-heading text-sm font-bold text-white">
                              {pkg.name || "Untitled Package"}
                            </span>
                            {pkg.isPopular && (
                              <span className="rounded-full bg-[#FF5A36]/20 px-2 py-0.5 text-[9px] font-bold uppercase text-[#FF5A36]">
                                Popular Choice
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={pkg.isPopular || false}
                                onChange={(e) => updatePackage(pIdx, { isPopular: e.target.checked })}
                                className="rounded border-zinc-700 text-[#FF5A36] focus:ring-[#FF5A36]"
                              />
                              <span>Mark as Popular</span>
                            </label>

                            <button
                              type="button"
                              onClick={() => {
                                const pkgs = (editingService.packages || []).filter((_, i) => i !== pIdx);
                                setEditingService({ ...editingService, packages: pkgs });
                              }}
                              className="cursor-pointer rounded-lg p-1 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                              title="Delete this package"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-zinc-300">
                              Package Name
                            </label>
                            <input
                              type="text"
                              value={pkg.name || ""}
                              onChange={(e) => updatePackage(pIdx, { name: e.target.value })}
                              placeholder="e.g. Basic Reel, Viral Retention, Cinematic Master"
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
                                value={pkg.price ?? 250}
                                onChange={(e) => updatePackage(pIdx, { price: Number(e.target.value) })}
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pr-3 pl-8 py-1.5 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-zinc-300">
                              Billing Unit / Period
                            </label>
                            <input
                              type="text"
                              value={pkg.period || "video"}
                              onChange={(e) => updatePackage(pIdx, { period: e.target.value })}
                              placeholder="e.g. video, photo, project"
                              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="block text-[11px] font-semibold text-zinc-300">
                            Package Summary
                          </label>
                          <input
                            type="text"
                            value={pkg.description || ""}
                            onChange={(e) => updatePackage(pIdx, { description: e.target.value })}
                            placeholder="Briefly describe what this tier covers..."
                            className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                          />
                        </div>

                        {/* Package Features list */}
                        <div className="mt-3">
                          <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                            Included Features ({pkg.features?.length || 0})
                          </label>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {(pkg.features || []).map((feat, fIdx) => (
                              <span
                                key={fIdx}
                                className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300"
                              >
                                <span>{feat}</span>
                                <button
                                  type="button"
                                  onClick={() => removePackageFeature(pIdx, fIdx)}
                                  className="cursor-pointer text-zinc-500 hover:text-red-400"
                                >
                                  ✕
                                </button>
                              </span>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              id={`new-feat-${pIdx}`}
                              placeholder="Type a feature and click '+ Add'"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const input = e.currentTarget;
                                  if (input.value.trim()) {
                                    addPackageFeature(pIdx, input.value);
                                    input.value = "";
                                  }
                                }
                              }}
                              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById(`new-feat-${pIdx}`) as HTMLInputElement;
                                if (input && input.value.trim()) {
                                  addPackageFeature(pIdx, input.value);
                                  input.value = "";
                                }
                              }}
                              className="cursor-pointer rounded-xl bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-200 hover:text-white"
                            >
                              + Add Feature
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Portfolio Showcase */}
              {activeTab === "portfolio" && (
                <div className="p-6 space-y-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#FF5A36]">
                      Public Portfolio &amp; Trust Showcase
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Directly upload sample MP4 videos, before/after photos, project mockups, or logo marks shown on live service pages.
                    </p>
                  </div>

                  {/* Section A: Video URLs / MP4 Uploads (for Video Editing) */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Video className="h-4 w-4 text-[#FF5A36]" />
                      <span>Portfolio Videos (Direct MP4 Upload or YouTube Link)</span>
                    </div>

                    <FileUploader
                      label="Upload Sample Reel / Portfolio Video"
                      value={newVideoUrl}
                      onChange={(url) => setNewVideoUrl(url)}
                      accept="video/mp4,video/*"
                      fileType="video"
                      hint="Upload MP4 video directly from device or switch to paste YouTube link"
                    />

                    {newVideoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          if (newVideoUrl.trim()) {
                            const vids = [...(editingService.portfolioVideos || [])];
                            vids.push(newVideoUrl.trim());
                            setEditingService({ ...editingService, portfolioVideos: vids });
                            setNewVideoUrl("");
                          }
                        }}
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-[#FF5A36] px-4 py-2 text-xs font-semibold text-white hover:bg-[#ff4620]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Video to Showcase</span>
                      </button>
                    )}

                    {/* Videos list */}
                    {(editingService.portfolioVideos || []).length > 0 && (
                      <div className="space-y-2 mt-2">
                        {(editingService.portfolioVideos || []).map((vid, vIdx) => (
                          <div
                            key={vIdx}
                            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-300"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Play className="h-3.5 w-3.5 text-[#FF5A36] shrink-0" />
                              <span className="truncate font-mono text-[11px]">{vid}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const vids = (editingService.portfolioVideos || []).filter((_, i) => i !== vIdx);
                                setEditingService({ ...editingService, portfolioVideos: vids });
                              }}
                              className="cursor-pointer text-zinc-500 hover:text-red-400 p-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section B: Portfolio Images */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <ImageIcon className="h-4 w-4 text-emerald-400" />
                      <span>Portfolio Images &amp; Project Screenshots</span>
                    </div>

                    <FileUploader
                      label="Upload Portfolio Photo / Visual"
                      value={newImageUrl}
                      onChange={(url) => setNewImageUrl(url)}
                      accept="image/*"
                      fileType="image"
                      hint="Upload photo from device or switch to paste image URL"
                    />

                    {newImageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          if (newImageUrl.trim()) {
                            const imgs = [...(editingService.portfolioImages || [])];
                            imgs.push(newImageUrl.trim());
                            setEditingService({ ...editingService, portfolioImages: imgs });
                            setNewImageUrl("");
                          }
                        }}
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Photo to Showcase</span>
                      </button>
                    )}

                    {/* Images gallery list */}
                    {(editingService.portfolioImages || []).length > 0 && (
                      <div className="flex flex-wrap gap-2.5 mt-2">
                        {(editingService.portfolioImages || []).map((img, iIdx) => (
                          <div
                            key={iIdx}
                            className="group relative h-16 w-24 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                          >
                            <img src={img} alt={`Asset ${iIdx}`} className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const imgs = (editingService.portfolioImages || []).filter((_, i) => i !== iIdx);
                                setEditingService({ ...editingService, portfolioImages: imgs });
                              }}
                              className="cursor-pointer absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section C: Before / After Retouching Showcase */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Camera className="h-4 w-4 text-blue-400" />
                      <span>Before &amp; After Photo Retouching Pairs</span>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        value={baTitle}
                        onChange={(e) => setBaTitle(e.target.value)}
                        placeholder="Comparison title, e.g. Skin Retouching & Color Grading"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FileUploader
                          label="RAW / Unedited Photo (Before)"
                          value={baBefore}
                          onChange={(url) => setBaBefore(url)}
                          accept="image/*"
                          fileType="image"
                          hint="Upload before image from device"
                        />
                        <FileUploader
                          label="Retouched Photo (After)"
                          value={baAfter}
                          onChange={(url) => setBaAfter(url)}
                          accept="image/*"
                          fileType="image"
                          hint="Upload after image from device"
                        />
                      </div>

                      {baBefore && baAfter && (
                        <div className="rounded-xl border border-zinc-800 bg-black/60 p-3 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                            Interactive Slider Test:
                          </span>
                          <div className="h-48 w-full max-w-sm mx-auto">
                            <BeforeAfterSlider
                              beforeImage={baBefore}
                              afterImage={baAfter}
                              beforeLabel="Before"
                              afterLabel="After"
                            />
                          </div>
                        </div>
                      )}

                      {baBefore && baAfter && (
                        <button
                          type="button"
                          onClick={() => {
                            const current = [...(editingService.portfolioBeforeAfter || [])];
                            current.push({
                              id: `ba-${Date.now()}`,
                              title: baTitle.trim() || "Photo Retouching",
                              before: baBefore,
                              after: baAfter,
                              beforeImage: baBefore,
                              afterImage: baAfter,
                              beforeLabel: "Before",
                              afterLabel: "After",
                            });
                            setEditingService({ ...editingService, portfolioBeforeAfter: current });
                            setBaBefore("");
                            setBaAfter("");
                            setBaTitle("");
                          }}
                          className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Before/After Showcase Pair</span>
                        </button>
                      )}

                      {/* Before/After list */}
                      {(editingService.portfolioBeforeAfter || []).length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                          {(editingService.portfolioBeforeAfter || []).map((ba, baIdx) => (
                            <div key={ba.id || baIdx} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-white">{ba.title}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = (editingService.portfolioBeforeAfter || []).filter((_, i) => i !== baIdx);
                                    setEditingService({ ...editingService, portfolioBeforeAfter: next });
                                  }}
                                  className="text-zinc-500 hover:text-red-400 p-1"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <div className="h-32 w-full overflow-hidden rounded-lg">
                                <BeforeAfterSlider
                                  beforeImage={ba.beforeImage || ba.before || ""}
                                  afterImage={ba.afterImage || ba.after || ""}
                                  beforeLabel={ba.beforeLabel || "Before"}
                                  afterLabel={ba.afterLabel || "After"}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section D: Website & App Showcase */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Globe className="h-4 w-4 text-purple-400" />
                      <span>Live Website &amp; App Mockup Showcase</span>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={webName}
                          onChange={(e) => setWebName(e.target.value)}
                          placeholder="Project title, e.g. Lumina SaaS Platform"
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                        />
                        <input
                          type="url"
                          value={webUrl}
                          onChange={(e) => setWebUrl(e.target.value)}
                          placeholder="Live URL, e.g. https://lumina.io"
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                        />
                      </div>

                      <FileUploader
                        label="Project Screenshot / Mockup"
                        value={webImage}
                        onChange={(url) => setWebImage(url)}
                        accept="image/*"
                        fileType="image"
                        hint="Upload screenshot or mockup photo from device"
                      />

                      <input
                        type="text"
                        value={webTags}
                        onChange={(e) => setWebTags(e.target.value)}
                        placeholder="Tags separated by comma, e.g. Next.js, Stripe, Tailwind"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                      />

                      {webName && webImage && (
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...(editingService.portfolioWebsites || [])];
                            next.push({
                              id: `web-${Date.now()}`,
                              name: webName.trim(),
                              title: webName.trim(),
                              url: webUrl.trim(),
                              image: webImage,
                              tags: webTags.split(",").map((t) => t.trim()).filter(Boolean),
                            });
                            setEditingService({ ...editingService, portfolioWebsites: next });
                            setWebName("");
                            setWebUrl("");
                            setWebImage("");
                            setWebTags("");
                          }}
                          className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Project to Showcase</span>
                        </button>
                      )}

                      {/* Website/App list */}
                      {(editingService.portfolioWebsites || []).length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                          {(editingService.portfolioWebsites || []).map((w, wIdx) => (
                            <div key={w.id || wIdx} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-white">{w.title}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = (editingService.portfolioWebsites || []).filter((_, i) => i !== wIdx);
                                    setEditingService({ ...editingService, portfolioWebsites: next });
                                  }}
                                  className="text-zinc-500 hover:text-red-400 p-1"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <div className="h-28 w-full overflow-hidden rounded-lg bg-zinc-900">
                                <img src={w.image} alt={w.title} className="h-full w-full object-cover" />
                              </div>
                              {w.url && (
                                <a href={w.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-purple-400 hover:underline flex items-center gap-1">
                                  <span>{w.url}</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section E: Logo & Brand Design Showcase */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                      <span>Logo &amp; Brand Marks Showcase</span>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={logoName}
                          onChange={(e) => setLogoName(e.target.value)}
                          placeholder="Brand name, e.g. Nova Studios"
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                        />
                        <input
                          type="text"
                          value={logoCategory}
                          onChange={(e) => setLogoCategory(e.target.value)}
                          placeholder="Category, e.g. Tech / Fashion / Media"
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FileUploader
                          label="Logo on Dark Background (Vector/PNG)"
                          value={logoDark}
                          onChange={(url) => setLogoDark(url)}
                          accept="image/*"
                          fileType="image"
                          hint="Upload dark background logo version"
                        />
                        <FileUploader
                          label="Logo on Light Background (Vector/PNG)"
                          value={logoLight}
                          onChange={(url) => setLogoLight(url)}
                          accept="image/*"
                          fileType="image"
                          hint="Upload light background logo version"
                        />
                      </div>

                      {logoName && (logoDark || logoLight) && (
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...(editingService.portfolioLogos || [])];
                            next.push({
                              id: `logo-${Date.now()}`,
                              name: logoName.trim(),
                              darkImage: logoDark || logoLight,
                              lightImage: logoLight || logoDark,
                              category: logoCategory.trim() || "Brand Identity",
                            });
                            setEditingService({ ...editingService, portfolioLogos: next });
                            setLogoName("");
                            setLogoDark("");
                            setLogoLight("");
                            setLogoCategory("");
                          }}
                          className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-500"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Brand Mark to Showcase</span>
                        </button>
                      )}

                      {/* Logos list */}
                      {(editingService.portfolioLogos || []).length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                          {(editingService.portfolioLogos || []).map((l, lIdx) => (
                            <div key={l.id || lIdx} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-white">{l.name}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = (editingService.portfolioLogos || []).filter((_, i) => i !== lIdx);
                                    setEditingService({ ...editingService, portfolioLogos: next });
                                  }}
                                  className="text-zinc-500 hover:text-red-400 p-1"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                <div className="h-16 rounded bg-black flex items-center justify-center p-2 border border-zinc-800">
                                  <img src={l.darkImage} alt={l.name} className="max-h-full max-w-full object-contain" />
                                </div>
                                <div className="h-16 rounded bg-white flex items-center justify-center p-2 border border-zinc-200">
                                  <img src={l.lightImage} alt={l.name} className="max-h-full max-w-full object-contain" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-4">
                <span className="text-[11px] text-zinc-500">
                  {editingService.id ? "Updates reflect instantly on live website." : "New service will be saved to store."}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="cursor-pointer rounded-xl border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#FF5A36] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] active:scale-[0.98] disabled:opacity-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{saving ? "Saving Changes..." : "Save Agency Service"}</span>
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
