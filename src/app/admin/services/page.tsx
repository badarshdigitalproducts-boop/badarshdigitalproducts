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
} from "lucide-react";
import type { AdminService, AdminServicePackage } from "@/lib/admin/types";
import { getWhatsAppUrl } from "@/lib/utils";

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
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

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
            Manage your service offerings, tier packages, turnarounds, pricing & WhatsApp inquiry flows.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingService({
              title: "",
              slug: "",
              description: "",
              longDescription: "",
              icon: "Video",
              category: "Agency Creative",
              status: "active",
              turnaround: "48-72 Hours",
              features: [
                "Dedicated Senior Creator",
                "Unlimited Revision Rounds",
                "WhatsApp Direct Collaboration",
              ],
              packages: [
                {
                  name: "Starter",
                  price: 4999,
                  currency: "INR",
                  period: "one-time",
                  description: "Essential package for creators & emerging businesses.",
                  features: ["Core deliverables included", "Delivery in 3 business days"],
                  ctaText: "Get Started",
                },
                {
                  name: "Growth Retainer",
                  price: 14999,
                  currency: "INR",
                  period: "per month",
                  description: "Full production engine for scaling businesses.",
                  features: ["Priority turnarounds", "Dedicated account manager", "Weekly strategy sync"],
                  isPopular: true,
                  ctaText: "Most Popular",
                },
              ],
            })
          }
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF5A36] px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>New Service Offering</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-md">
          <p className="text-xs text-zinc-500">Total Services</p>
          <p className="mt-1 font-heading text-2xl font-bold text-white">{services.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-md">
          <p className="text-xs text-zinc-500">Active Offerings</p>
          <p className="mt-1 font-heading text-2xl font-bold text-emerald-400">
            {services.filter((s) => s.status === "active").length}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-md">
          <p className="text-xs text-zinc-500">Total Packages</p>
          <p className="mt-1 font-heading text-2xl font-bold text-amber-400">
            {services.reduce((acc, s) => acc + (s.packages?.length || 0), 0)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-md">
          <p className="text-xs text-zinc-500">Standard Turnaround</p>
          <p className="mt-1 font-heading text-xl font-bold text-blue-400">48-72h</p>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-4">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agency services..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pr-4 pl-9 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
          />
        </div>

        <a
          href="/services"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <span>Preview Public Services Page</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Services List Table / Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-12 text-center text-zinc-500">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#FF5A36] border-t-transparent" />
            <p className="mt-2 text-xs">Loading agency services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-12 text-center text-zinc-500 text-xs">
            No services found. Add your first service above.
          </div>
        ) : (
          filteredServices.map((service, index) => {
            const isExpanded = expandedServiceId === service.id;
            return (
              <div
                key={service.id}
                className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md transition-all"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-[#FF5A36]">
                      <Sparkles className="h-5 w-5" />
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
                        <span>{service.features?.length || 0} Core Features</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => setExpandedServiceId(isExpanded ? null : service.id)}
                      className="inline-flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                    >
                      <span>{isExpanded ? "Hide Packages" : "View Packages"}</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>

                    <a
                      href={getWhatsAppUrl(`Hi! I'm inquiring about ${service.title} from your agency.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      title="Test WhatsApp Inquiry Link"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>

                    <button
                      onClick={() => handleToggleStatus(service)}
                      className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:text-white transition-colors"
                      title={service.status === "active" ? "Deactivate Service" : "Activate Service"}
                    >
                      {service.status === "active" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-zinc-500" />
                      )}
                    </button>

                    <button
                      onClick={() => setEditingService(service)}
                      className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:text-white transition-colors"
                      title="Edit Service"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
                            {pkg.features?.slice(0, 4).map((f, fIdx) => (
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

      {/* Service Editor Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <h2 className="font-heading text-lg font-bold text-white">
                {editingService.id ? "Edit Agency Service" : "Create New Agency Service"}
              </h2>
              <button
                onClick={() => setEditingService(null)}
                className="text-xs text-zinc-500 hover:text-white"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSaveService} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Service Title
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
                    Turnaround Time
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
                    Status
                  </label>
                  <select
                    value={editingService.status || "active"}
                    onChange={(e) => setEditingService({ ...editingService, status: e.target.value as any })}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  >
                    <option value="active">Active (Live in Menu & Services Page)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingService.description || ""}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  placeholder="Summary of what your team delivers..."
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Detailed Pitch / Long Description
                </label>
                <textarea
                  rows={3}
                  value={editingService.longDescription || ""}
                  onChange={(e) => setEditingService({ ...editingService, longDescription: e.target.value })}
                  placeholder="Comprehensive explanation of the methodology, quality standards, and guarantee..."
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              {/* Core Features List */}
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
                    placeholder="e.g. 48-hour rush delivery available"
                    className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white"
                  >
                    Add
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
                        className="text-zinc-500 hover:text-red-400"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Save Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="rounded-xl border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF5A36] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{saving ? "Saving..." : "Save Agency Service"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
