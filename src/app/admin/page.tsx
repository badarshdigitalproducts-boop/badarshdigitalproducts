"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IndianRupee,
  DollarSign,
  Package,
  Users2,
  Mail,
  ArrowUpRight,
  Plus,
  Download,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { LeadInquiry, OrderRecord, SystemSettings } from "@/lib/admin/types";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [metrics, setMetrics] = useState({
    totalRevenueINR: 0,
    totalDownloads: 0,
    publishedProducts: 0,
    totalProducts: 0,
    newLeadsCount: 0,
    totalLeadsCount: 0,
    totalSubscribersCount: 0,
  });
  const [recentLeads, setRecentLeads] = useState<LeadInquiry[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderRecord[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leadsRes, prodsRes, subsRes, settingsRes] = await Promise.all([
        fetch("/api/admin/leads"),
        fetch("/api/admin/products"),
        fetch("/api/admin/subscribers"),
        fetch("/api/admin/settings"),
      ]);

      const leadsData = await leadsRes.json();
      const prodsData = await prodsRes.json();
      const subsData = await subsRes.json();
      const settingsData = await settingsRes.json();

      const leads: LeadInquiry[] = leadsData.leads || [];
      const products = prodsData.products || [];
      const subscribers = subsData.subscribers || [];

      const totalDownloads = products.reduce((acc: number, p: any) => acc + (p.downloads || 0), 0);
      const totalRev = 1197; // Sample verified orders baseline

      setMetrics({
        totalRevenueINR: totalRev,
        totalDownloads,
        publishedProducts: products.filter((p: any) => p.status === "published").length,
        totalProducts: products.length,
        newLeadsCount: leads.filter((l) => l.status === "new").length,
        totalLeadsCount: leads.length,
        totalSubscribersCount: subscribers.filter((s: any) => s.status === "active").length,
      });

      setRecentLeads(leads.slice(0, 5));
      setSettings(settingsData.settings || null);

      // Seed orders
      setRecentOrders([
        {
          id: "ORD-94813",
          customerName: "Sneha Nair",
          customerEmail: "sneha.creatives@gmail.com",
          items: [{ id: "1", title: "Instagram Reels Template Pack", price: 299, quantity: 1 }],
          totalAmount: 299,
          currency: "INR",
          paymentMethod: "Razorpay",
          paymentStatus: "completed",
          licenseKey: "BDRSH-BNDL-4412-M2",
          canvaAccessDelivered: true,
          createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        },
        {
          id: "ORD-94812",
          customerName: "Aakash Mehta",
          customerEmail: "aakash@mehtaconsulting.com",
          items: [{ id: "2", title: "LinkedIn Carousel Templates", price: 399, quantity: 1 }],
          totalAmount: 399,
          currency: "INR",
          paymentMethod: "UPI",
          paymentStatus: "completed",
          licenseKey: "BDRSH-LNKD-8821-X9",
          canvaAccessDelivered: true,
          createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const exchangeRate = settings?.currencyRateUsdToInr || 86.5;
  const displayRevenue =
    currency === "INR"
      ? `₹${metrics.totalRevenueINR.toLocaleString("en-IN")}`
      : `$${(metrics.totalRevenueINR / exchangeRate).toFixed(2)}`;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Top Header & Quick Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-medium tracking-wider text-emerald-400 uppercase">
              System Active
            </span>
          </div>
          <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-white md:text-3xl">
            Executive Command Center
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time control room for Canva assets, agency leads, and audience growth.
          </p>
        </div>

        {/* Currency toggle and export buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950 p-1">
            <button
              onClick={() => setCurrency("INR")}
              className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                currency === "INR"
                  ? "bg-[#FF5A36] text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              INR (₹)
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                currency === "USD"
                  ? "bg-[#FF5A36] text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              USD ($)
            </button>
          </div>

          <a
            href="/api/admin/backup"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Full Backup</span>
          </a>

          <Link
            href="/admin/products"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#FF5A36] px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#ff4620] active:scale-[0.98] transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Gross Sales Volume</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-300">
              {currency === "INR" ? (
                <IndianRupee className="h-4 w-4" />
              ) : (
                <DollarSign className="h-4 w-4" />
              )}
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold tracking-tight text-white">
              {displayRevenue}
            </span>
            <span className="flex items-center text-[11px] font-semibold text-emerald-400">
              <TrendingUp className="mr-0.5 h-3 w-3" />
              +24%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            {metrics.totalDownloads.toLocaleString()} digital downloads delivered
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Digital Products</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-300">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold tracking-tight text-white">
              {metrics.publishedProducts}
            </span>
            <span className="text-[11px] font-medium text-zinc-500">
              / {metrics.totalProducts} Total
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">Canva kits, e-books &amp; planners</p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Agency Inquiries</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-300">
              <Users2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold tracking-tight text-white">
              {metrics.totalLeadsCount}
            </span>
            {metrics.newLeadsCount > 0 && (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                {metrics.newLeadsCount} New
              </span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">Video editing &amp; website leads</p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Newsletter Audience</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-300">
              <Mail className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold tracking-tight text-white">
              {metrics.totalSubscribersCount}
            </span>
            <span className="text-[11px] font-medium text-emerald-400">Active</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">Subscribers receiving Canva tips</p>
        </div>
      </div>

      {/* Two Columns: Recent Leads & Recent Orders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Recent Leads (7 cols) */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-md lg:col-span-7">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="font-heading text-sm font-bold text-white">
                Recent Inbound Leads
              </h2>
              <p className="text-[11px] text-zinc-400">
                High-intent inquiries submitted via website forms
              </p>
            </div>
            <Link
              href="/admin/leads"
              className="flex items-center gap-1 text-xs font-semibold text-[#FF5A36] hover:underline"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-zinc-800/60">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{lead.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        lead.status === "new"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : lead.status === "contacted"
                          ? "bg-blue-500/15 text-blue-400"
                          : lead.status === "proposal"
                          ? "bg-purple-500/15 text-purple-400"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    <span className="text-zinc-300 font-medium">{lead.interest}</span> •{" "}
                    {lead.budget || "Budget not specified"}
                  </p>
                  <p className="line-clamp-1 text-[11px] text-zinc-500">{lead.message}</p>
                </div>

                {lead.phone && (
                  <a
                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hi ${lead.name}! I received your inquiry for ${lead.interest} on BADARSH.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Sales Orders (5 cols) */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-md lg:col-span-5">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="font-heading text-sm font-bold text-white">
                Digital Sales Orders
              </h2>
              <p className="text-[11px] text-zinc-400">
                Direct transactions &amp; Canva link deliveries
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Auto-Fulfill
            </span>
          </div>

          <div className="mt-4 divide-y divide-zinc-800/60">
            {recentOrders.map((order) => (
              <div key={order.id} className="py-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white">
                    {order.id}
                  </span>
                  <span className="font-heading text-xs font-bold text-[#FF5A36]">
                    ₹{order.totalAmount}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-zinc-400">
                  <span>{order.customerName}</span>
                  <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] text-zinc-300 font-medium">
                    {order.paymentMethod}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-zinc-500 line-clamp-1">
                  {order.items.map((i) => i.title).join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
