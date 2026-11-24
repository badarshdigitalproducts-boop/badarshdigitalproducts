"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  RotateCcw,
  Copy,
  ExternalLink,
  MessageCircle,
  Key,
  IndianRupee,
  Trash2,
  Edit2,
  X,
  Save,
  Package,
  Sparkles,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import type { OrderRecord, OrderItem, AdminProduct } from "@/lib/admin/types";
import { safeParseJson } from "@/lib/utils";

const DEFAULT_ORDER: Partial<OrderRecord> = {
  customerName: "",
  customerEmail: "",
  customerPhone: "+91 ",
  totalAmount: 299,
  currency: "INR",
  paymentMethod: "UPI",
  paymentStatus: "completed",
  licenseKey: "",
  canvaAccessDelivered: true,
  deliveryNotes: "Direct instant delivery",
  items: [
    {
      id: "prod-1",
      title: "Instagram Reels Template Pack",
      price: 299,
      quantity: 1,
      productType: "canva-template",
    },
  ],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Partial<OrderRecord>>(DEFAULT_ORDER);
  const [itemTitle, setItemTitle] = useState("");
  const [itemPrice, setItemPrice] = useState("299");
  const [itemDeliveryUrl, setItemDeliveryUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  useEffect(() => {
    fetchOrders();
    fetchCatalogProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (res.status === 401) {
        window.location.replace("/admin/login");
        return;
      }
      const data = await safeParseJson<{ orders?: OrderRecord[] }>(res, {});
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch {
      showFeedback("error", "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalogProducts = async () => {
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      const data = await safeParseJson<{ products?: AdminProduct[] }>(res, {});
      if (data.products) {
        setCatalogProducts(data.products);
      }
    } catch {
      // Non-blocking
    }
  };

  const handleProductSelect = (productId: string) => {
    const prod = catalogProducts.find((p) => p.id === productId);
    if (!prod) return;
    setItemTitle(prod.title);
    setItemPrice(String(prod.price));
    const delivery =
      prod.googleDriveUrl ||
      prod.downloadUrl ||
      prod.templateUrl ||
      prod.canvaUrl ||
      prod.appDownloadUrl ||
      prod.presetLinkUrl ||
      "";
    setItemDeliveryUrl(delivery);
    setEditingOrder((prev) => ({
      ...prev,
      totalAmount: prod.price,
      deliveryNotes: delivery ? `Digital Delivery Link: ${delivery}` : prev.deliveryNotes,
    }));
  };

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const generateLicenseKey = () => {
    const p1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const p2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BDRSH-${p1}-${p2}`;
  };

  const openCreateModal = () => {
    setEditingOrder({
      ...DEFAULT_ORDER,
      licenseKey: generateLicenseKey(),
      items: [
        {
          id: `item-${Date.now()}`,
          title: "Social Media Growth Kit",
          price: 299,
          quantity: 1,
          productType: "canva-template",
        },
      ],
    });
    setItemTitle("Social Media Growth Kit");
    setItemPrice("299");
    setItemDeliveryUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (order: OrderRecord) => {
    setEditingOrder({ ...order });
    if (order.items && order.items[0]) {
      setItemTitle(order.items[0].title);
      setItemPrice(String(order.items[0].price));
      setItemDeliveryUrl(order.items[0].downloadUrl || "");
    } else {
      setItemDeliveryUrl("");
    }
    setIsModalOpen(true);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder.customerName || !editingOrder.totalAmount) {
      showFeedback("error", "Customer name and total amount are required");
      return;
    }

    try {
      setSaving(true);
      const parsedItems: OrderItem[] = [
        {
          id: editingOrder.items?.[0]?.id || `item-${Date.now()}`,
          title: itemTitle || "BADARSH Digital Product",
          price: Number(itemPrice) || editingOrder.totalAmount || 299,
          quantity: 1,
          productType: editingOrder.items?.[0]?.productType || "digital-product",
          downloadUrl: itemDeliveryUrl || undefined,
        },
      ];

      const payload = {
        ...editingOrder,
        items: parsedItems,
        deliveryNotes: itemDeliveryUrl || editingOrder.deliveryNotes,
        licenseKey: editingOrder.licenseKey || generateLicenseKey(),
      };

      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        showFeedback("success", `Order ${data.order.id} saved successfully`);
        setIsModalOpen(false);
        fetchOrders();
      } else {
        showFeedback("error", data.error || "Failed to save order");
      }
    } catch {
      showFeedback("error", "Network error saving order");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete order ${id}?`)) return;

    try {
      const res = await fetch(`/api/admin/orders?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showFeedback("success", `Order ${id} deleted successfully`);
        setOrders((prev) => prev.filter((o) => o.id !== id));
      } else {
        showFeedback("error", "Failed to delete order");
      }
    } catch {
      showFeedback("error", "Network error while deleting");
    }
  };

  const buildWhatsAppDeliveryLink = (order: OrderRecord) => {
    const rawPhone = order.customerPhone || "";
    const cleanPhone = rawPhone.replace(/\D/g, "");
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const itemNames = order.items.map((i) => i.title).join(", ") || "Digital Assets";
    const downloadLinks = order.items
      .map((i) => i.downloadUrl)
      .filter(Boolean) as string[];

    let deliverySection = "";
    if (downloadLinks.length > 0) {
      deliverySection = `\n\n📥 Instant Asset Access / Google Drive:\n${downloadLinks.join("\n")}`;
    } else if (order.deliveryNotes && order.deliveryNotes.includes("http")) {
      deliverySection = `\n\n📥 Instant Asset Access / Google Drive:\n${order.deliveryNotes}`;
    }

    const msg = `Hi ${order.customerName}! 🚀 Thank you for purchasing from BADARSH.\n\n📦 Order: ${order.id}\n📁 Products: ${itemNames}\n🔑 Your Official Digital License: ${order.licenseKey}${deliverySection}\n\nNeed any help? Our founder & support team is right here on WhatsApp!`;

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      (order.customerPhone && order.customerPhone.includes(search)) ||
      order.licenseKey.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.paymentStatus === statusFilter;
    const matchesMethod = methodFilter === "all" || order.paymentMethod === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalGrossRevenue = orders
    .filter((o) => o.paymentStatus === "completed")
    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const completedOrdersCount = orders.filter((o) => o.paymentStatus === "completed").length;
  const pendingOrdersCount = orders.filter((o) => o.paymentStatus === "pending").length;
  const averageOrderValue =
    completedOrdersCount > 0 ? Math.round(totalGrossRevenue / completedOrdersCount) : 0;

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
              Orders & Digital Deliveries
            </h1>
            <span className="rounded-full bg-[#FF5A36]/15 px-2.5 py-0.5 text-xs font-bold text-[#FF5A36]">
              {orders.length} Total
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Fulfill digital products, generate verified license keys, and dispatch 1-click WhatsApp deliveries.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-[#FF5A36] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#FF5A36]/20 transition-all hover:bg-[#ff461e] active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Log Manual Order</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Gross Revenue</span>
            <IndianRupee className="h-4 w-4 text-[#FF5A36]" />
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-white">
            ₹{totalGrossRevenue.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">From completed checkouts</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Completed Orders</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-emerald-400">
            {completedOrdersCount}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">Fulfilled & delivered</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Pending Follow-up</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-amber-400">
            {pendingOrdersCount}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">Awaiting confirmation</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Average Order Value</span>
            <Sparkles className="h-4 w-4 text-blue-400" />
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-white">₹{averageOrderValue}</p>
          <p className="mt-1 text-[11px] text-zinc-500">Blended cart size</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, phone, email, or license key..."
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
            <option value="all">All Payment Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs font-medium text-zinc-300 focus:border-[#FF5A36] focus:outline-none"
          >
            <option value="all">All Payment Gateways</option>
            <option value="UPI">UPI Direct</option>
            <option value="Razorpay">Razorpay</option>
            <option value="Stripe">Stripe</option>
            <option value="Manual Bank Transfer">Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-950/30">
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FF5A36] border-t-transparent" />
            <span>Loading orders...</span>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 py-16 text-center">
          <ShoppingCart className="h-10 w-10 text-zinc-600" />
          <h3 className="mt-3 font-heading text-sm font-bold text-white">No orders found</h3>
          <p className="mt-1 text-xs text-zinc-500">
            {search || statusFilter !== "all" || methodFilter !== "all"
              ? "Try adjusting your search criteria"
              : "No customer orders have been logged yet"}
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 flex items-center gap-1.5 rounded-xl bg-[#FF5A36] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#ff461e]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Log First Order</span>
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/60 shadow-xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order ID</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Items</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Gateway</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">License Key</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredOrders.map((order) => {
                  const isCompleted = order.paymentStatus === "completed";
                  const isPending = order.paymentStatus === "pending";
                  const waLink = buildWhatsAppDeliveryLink(order);

                  return (
                    <tr key={order.id} className="transition-colors hover:bg-zinc-900/40">
                      {/* Order ID */}
                      <td className="whitespace-nowrap px-4 py-3.5 font-mono font-bold text-white">
                        {order.id}
                        <p className="text-[10px] font-sans font-normal text-zinc-500">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </td>

                      {/* Customer Info */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-white">{order.customerName}</div>
                        <div className="text-[11px] text-zinc-400">{order.customerEmail}</div>
                        {order.customerPhone && (
                          <div className="text-[11px] text-zinc-500">{order.customerPhone}</div>
                        )}
                      </td>

                      {/* Purchased Items */}
                      <td className="px-4 py-3.5">
                        <div className="max-w-xs space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 truncate">
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF5A36]" />
                              <span className="truncate text-zinc-200">{item.title}</span>
                              <span className="text-[10px] text-zinc-500">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="whitespace-nowrap px-4 py-3.5 font-heading text-sm font-bold text-white">
                        ₹{order.totalAmount}
                      </td>

                      {/* Gateway */}
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <span className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                          {order.paymentMethod}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isCompleted
                              ? "bg-emerald-500/10 text-emerald-400"
                              : isPending
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isCompleted
                                ? "bg-emerald-400"
                                : isPending
                                ? "bg-amber-400"
                                : "bg-red-400"
                            }`}
                          />
                          {order.paymentStatus.toUpperCase()}
                        </span>
                      </td>

                      {/* License Key */}
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] text-zinc-400">
                            {order.licenseKey}
                          </span>
                          <button
                            onClick={() => handleCopyKey(order.licenseKey)}
                            title="Copy License Key"
                            className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        {copiedKey === order.licenseKey && (
                          <span className="text-[10px] text-emerald-400">Copied!</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1-Click WhatsApp Delivery Button */}
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Send instant WhatsApp delivery message"
                            className="flex items-center gap-1 rounded-lg bg-emerald-950/60 border border-emerald-800/80 px-2 py-1 text-[11px] font-bold text-emerald-300 transition-all hover:bg-emerald-900/80 active:scale-95"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          <button
                            onClick={() => openEditModal(order)}
                            title="Edit Order"
                            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(order.id)}
                            title="Delete Order"
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
          <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5A36]/15 text-[#FF5A36]">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-white">
                    {editingOrder.id ? `Edit Order ${editingOrder.id}` : "Log Customer Order"}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Record digital sales and dispatch digital delivery links
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
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Customer Full Name <span className="text-[#FF5A36]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={editingOrder.customerName || ""}
                  onChange={(e) =>
                    setEditingOrder((prev) => ({ ...prev, customerName: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Customer Email</label>
                  <input
                    type="email"
                    placeholder="customer@domain.com"
                    value={editingOrder.customerEmail || ""}
                    onChange={(e) =>
                      setEditingOrder((prev) => ({ ...prev, customerEmail: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={editingOrder.customerPhone || ""}
                    onChange={(e) =>
                      setEditingOrder((prev) => ({ ...prev, customerPhone: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick Catalog Auto-Fill */}
              {catalogProducts.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Quick Auto-Fill from Catalog (Optional)
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleProductSelect(e.target.value);
                    }}
                    defaultValue=""
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-300 focus:border-[#FF5A36] focus:outline-none"
                  >
                    <option value="">-- Choose a catalog product to auto-fill details &amp; Drive link --</option>
                    {catalogProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Product Item Purchased */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Product / Item Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Viral Video SFX & Motion Overlay Bundle"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              {/* Digital Delivery Link */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Digital Delivery Link (Google Drive / Direct Download URL)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/... or https://..."
                  value={itemDeliveryUrl}
                  onChange={(e) => setItemDeliveryUrl(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none font-mono"
                />
                <p className="mt-1 text-[10px] text-zinc-500">
                  Automatically attached to customer WhatsApp delivery message.
                </p>
              </div>

              {/* Total Amount & Gateway */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Total Amount (₹ INR) <span className="text-[#FF5A36]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={editingOrder.totalAmount || 299}
                    onChange={(e) =>
                      setEditingOrder((prev) => ({
                        ...prev,
                        totalAmount: Number(e.target.value) || 0,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Payment Gateway
                  </label>
                  <select
                    value={editingOrder.paymentMethod || "UPI"}
                    onChange={(e) =>
                      setEditingOrder((prev) => ({
                        ...prev,
                        paymentMethod: e.target.value as any,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  >
                    <option value="UPI">UPI Direct (GPay, PhonePe, Paytm)</option>
                    <option value="Razorpay">Razorpay Gateway</option>
                    <option value="Stripe">Stripe International</option>
                    <option value="Manual Bank Transfer">Manual NEFT / IMPS</option>
                  </select>
                </div>
              </div>

              {/* Status & License Key */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Payment Status</label>
                  <select
                    value={editingOrder.paymentStatus || "completed"}
                    onChange={(e) =>
                      setEditingOrder((prev) => ({
                        ...prev,
                        paymentStatus: e.target.value as any,
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  >
                    <option value="completed">Completed / Paid</option>
                    <option value="pending">Pending Payment</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    License Key
                  </label>
                  <div className="mt-1.5 flex gap-1.5">
                    <input
                      type="text"
                      value={editingOrder.licenseKey || ""}
                      onChange={(e) =>
                        setEditingOrder((prev) => ({ ...prev, licenseKey: e.target.value }))
                      }
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditingOrder((prev) => ({
                          ...prev,
                          licenseKey: generateLicenseKey(),
                        }))
                      }
                      className="rounded-xl border border-zinc-800 bg-zinc-900 px-2.5 text-xs text-zinc-400 hover:text-white"
                      title="Generate New Key"
                    >
                      New
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Fulfillment Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Delivered template access link and license key via email"
                  value={editingOrder.deliveryNotes || ""}
                  onChange={(e) =>
                    setEditingOrder((prev) => ({ ...prev, deliveryNotes: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                />
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
                      <span>Save Order</span>
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
