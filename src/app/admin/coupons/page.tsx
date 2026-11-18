"use client";

import { useEffect, useState } from "react";
import {
  Tag,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Copy,
  Percent,
  IndianRupee,
  Trash2,
  Edit2,
  X,
  Save,
  Sparkles,
  Calendar,
  AlertCircle,
} from "lucide-react";
import type { AdminCoupon } from "@/lib/admin/types";

const DEFAULT_COUPON: Partial<AdminCoupon> = {
  code: "",
  discountType: "percentage",
  discountValue: 20,
  minOrderAmount: 299,
  usageCount: 0,
  usageLimit: 100,
  expiresAt: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().split("T")[0],
  status: "active",
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<AdminCoupon>>(DEFAULT_COUPON);
  const [saving, setSaving] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.coupons) {
        setCoupons(data.coupons);
      }
    } catch {
      showFeedback("error", "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const openCreateModal = () => {
    setEditingCoupon({
      ...DEFAULT_COUPON,
      code: `PROMO${Math.floor(10 + Math.random() * 90)}`,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: AdminCoupon) => {
    setEditingCoupon({
      ...coupon,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "",
    });
    setIsModalOpen(true);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon.code || !editingCoupon.discountValue) {
      showFeedback("error", "Coupon code and discount value are required");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...editingCoupon,
        code: editingCoupon.code.toUpperCase().trim(),
        discountValue: Number(editingCoupon.discountValue) || 0,
        minOrderAmount: Number(editingCoupon.minOrderAmount) || 0,
        usageLimit: editingCoupon.usageLimit ? Number(editingCoupon.usageLimit) : undefined,
      };

      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.coupon) {
        showFeedback("success", `Coupon "${data.coupon.code}" saved successfully`);
        setIsModalOpen(false);
        fetchCoupons();
      } else {
        showFeedback("error", data.error || "Failed to save coupon");
      }
    } catch {
      showFeedback("error", "Network error saving coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (coupon: AdminCoupon) => {
    const nextStatus = coupon.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...coupon, status: nextStatus }),
      });
      if (res.ok) {
        showFeedback(
          "success",
          `Coupon "${coupon.code}" is now ${nextStatus === "active" ? "Active" : "Inactive"}`
        );
        fetchCoupons();
      }
    } catch {
      showFeedback("error", "Failed to update coupon status");
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${code}"?`)) return;

    try {
      const res = await fetch(`/api/admin/coupons?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showFeedback("success", `Coupon "${code}" deleted`);
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      } else {
        showFeedback("error", "Failed to delete coupon");
      }
    } catch {
      showFeedback("error", "Network error while deleting");
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || coupon.status === statusFilter;
    const matchesType = typeFilter === "all" || coupon.discountType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const activeCount = coupons.filter((c) => c.status === "active").length;
  const totalRedemptions = coupons.reduce((acc, c) => acc + (c.usageCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-2xl backdrop-blur-xl transition-all ${
            feedback.type === "success"
              ? "border-emerald-500/30 bg-emerald-950/90 text-emerald-200"
              : "border-red-500/30 bg-red-950/90 text-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <X className="h-4 w-4 shrink-0 text-red-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Discount Coupons Engine
            </h1>
            <span className="rounded-full bg-[#FF5A36]/15 px-2.5 py-0.5 text-xs font-bold text-[#FF5A36]">
              {coupons.length} Coupons
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Create high-converting promo codes, flash discounts, and creator affiliate incentives.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-[#FF5A36] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#FF5A36]/20 transition-all hover:bg-[#ff461e] active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Total Promo Codes</span>
            <Tag className="h-4 w-4 text-[#FF5A36]" />
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-white">{coupons.length}</p>
          <p className="mt-1 text-[11px] text-zinc-500">Configured in store</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Active Coupons</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-emerald-400">{activeCount}</p>
          <p className="mt-1 text-[11px] text-zinc-500">Live for checkout</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Total Uses</span>
            <Sparkles className="h-4 w-4 text-blue-400" />
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-white">{totalRedemptions}</p>
          <p className="mt-1 text-[11px] text-zinc-500">Customer redemptions</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Max Discount</span>
            <Percent className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-amber-400">
            {Math.max(
              ...coupons
                .filter((c) => c.discountType === "percentage")
                .map((c) => c.discountValue),
              0
            )}
            %
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">Highest active savings</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search coupon code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 py-2 pl-9 pr-4 text-xs text-white placeholder:text-zinc-500 focus:border-[#FF5A36] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs font-medium text-zinc-300 focus:border-[#FF5A36] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs font-medium text-zinc-300 focus:border-[#FF5A36] focus:outline-none"
          >
            <option value="all">All Discount Types</option>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Flat (₹)</option>
          </select>
        </div>
      </div>

      {/* Coupons Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-950/30">
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FF5A36] border-t-transparent" />
            <span>Loading coupons...</span>
          </div>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 py-16 text-center">
          <Tag className="h-10 w-10 text-zinc-600" />
          <h3 className="mt-3 font-heading text-sm font-bold text-white">No coupons found</h3>
          <p className="mt-1 text-xs text-zinc-500">
            {search || statusFilter !== "all" || typeFilter !== "all"
              ? "Try adjusting your filters"
              : "Launch your first promotional discount coupon"}
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 flex items-center gap-1.5 rounded-xl bg-[#FF5A36] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#ff461e]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Promo Code</span>
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/60 shadow-xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Coupon Code</th>
                  <th className="px-4 py-3 font-semibold">Discount</th>
                  <th className="px-4 py-3 font-semibold">Min Spend</th>
                  <th className="px-4 py-3 font-semibold">Redemptions</th>
                  <th className="px-4 py-3 font-semibold">Expires</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredCoupons.map((coupon) => {
                  const isActive = coupon.status === "active";
                  const isPercent = coupon.discountType === "percentage";

                  return (
                    <tr key={coupon.id} className="transition-colors hover:bg-zinc-900/40">
                      {/* Code */}
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold tracking-wider text-white">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            title="Copy Promo Code"
                            className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          {copiedCode === coupon.code && (
                            <span className="text-[10px] text-emerald-400">Copied!</span>
                          )}
                        </div>
                      </td>

                      {/* Discount */}
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-0.5 font-bold text-white border border-zinc-800">
                          {isPercent ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                        </span>
                      </td>

                      {/* Min Spend */}
                      <td className="whitespace-nowrap px-4 py-3.5 text-zinc-400">
                        {coupon.minOrderAmount ? `₹${coupon.minOrderAmount}` : "No min"}
                      </td>

                      {/* Redemptions */}
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white">{coupon.usageCount}</span>
                          <span className="text-zinc-500">
                            / {coupon.usageLimit ? coupon.usageLimit : "∞"}
                          </span>
                        </div>
                      </td>

                      {/* Expires */}
                      <td className="whitespace-nowrap px-4 py-3.5 text-zinc-400">
                        {coupon.expiresAt
                          ? new Date(coupon.expiresAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Never"}
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <button
                          onClick={() => handleToggleStatus(coupon)}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition-all ${
                            isActive
                              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? "bg-emerald-400" : "bg-zinc-500"
                            }`}
                          />
                          {isActive ? "ACTIVE" : "INACTIVE"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(coupon)}
                            title="Edit Coupon"
                            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id, coupon.code)}
                            title="Delete Coupon"
                            className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-950/40 hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5A36]/15 text-[#FF5A36]">
                  <Tag className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-white">
                    {editingCoupon.id ? `Edit ${editingCoupon.code}` : "Create Promo Code"}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Define discount percentage or fixed deductions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              {/* Code */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Coupon Code <span className="text-[#FF5A36]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BADARSH50"
                  value={editingCoupon.code || ""}
                  onChange={(e) =>
                    setEditingCoupon((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Type</label>
                  <select
                    value={editingCoupon.discountType || "percentage"}
                    onChange={(e) =>
                      setEditingCoupon((prev) => ({
                        ...prev,
                        discountType: e.target.value as any,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="fixed">Flat Amount (₹ OFF)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Discount Value <span className="text-[#FF5A36]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={editingCoupon.discountValue ?? 20}
                    onChange={(e) =>
                      setEditingCoupon((prev) => ({
                        ...prev,
                        discountValue: Number(e.target.value) || 0,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>
              </div>

              {/* Min Spend & Usage Limit */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 299"
                    value={editingCoupon.minOrderAmount ?? 299}
                    onChange={(e) =>
                      setEditingCoupon((prev) => ({
                        ...prev,
                        minOrderAmount: Number(e.target.value) || 0,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Usage Limit</label>
                  <input
                    type="number"
                    placeholder="Leave blank for infinite"
                    value={editingCoupon.usageLimit ?? 100}
                    onChange={(e) =>
                      setEditingCoupon((prev) => ({
                        ...prev,
                        usageLimit: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300">Expiry Date</label>
                <input
                  type="date"
                  value={editingCoupon.expiresAt || ""}
                  onChange={(e) =>
                    setEditingCoupon((prev) => ({ ...prev, expiresAt: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-4">
                <label className="text-xs font-semibold text-zinc-300">Status:</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={editingCoupon.status === "active"}
                      onChange={() =>
                        setEditingCoupon((prev) => ({ ...prev, status: "active" }))
                      }
                      className="accent-[#FF5A36]"
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={editingCoupon.status === "inactive"}
                      onChange={() =>
                        setEditingCoupon((prev) => ({ ...prev, status: "inactive" }))
                      }
                      className="accent-[#FF5A36]"
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-zinc-800/80 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-900 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#FF5A36] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-[#FF5A36]/20 transition-all hover:bg-[#ff461e] active:scale-95 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Coupon</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
