"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IndianRupee,
  DollarSign,
  Package,
  Layers,
  FileText,
  ShoppingCart,
  Tag,
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
  Zap,
} from "lucide-react";
import type {
  LeadInquiry,
  OrderRecord,
  SystemSettings,
  AdminProduct,
  AdminService,
  AdminBlogPost,
  AdminCoupon,
} from "@/lib/admin/types";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [metrics, setMetrics] = useState({
    totalRevenueINR: 0,
    totalDownloads: 0,
    publishedProducts: 0,
    totalProducts: 0,
    activeServicesCount: 0,
    totalServicesCount: 0,
    publishedPostsCount: 0,
    completedOrdersCount: 0,
    activeCouponsCount: 0,
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
      setLoading(true);
      const [
        leadsRes,
        prodsRes,
        servicesRes,
        blogRes,
        ordersRes,
        couponsRes,
        subsRes,
        settingsRes,
      ] = await Promise.all([
        fetch("/api/admin/leads"),
        fetch("/api/admin/products"),
        fetch("/api/admin/services"),
        fetch("/api/admin/blog"),
        fetch("/api/admin/orders"),
        fetch("/api/admin/coupons"),
        fetch("/api/admin/subscribers"),
        fetch("/api/admin/settings"),
      ]);

      const leadsData = await leadsRes.json();
      const prodsData = await prodsRes.json();
      const servicesData = await servicesRes.json();
      const blogData = await blogRes.json();
      const ordersData = await ordersRes.json();
      const couponsData = await couponsRes.json();
      const subsData = await subsRes.json();
      const settingsData = await settingsRes.json();

      const leads: LeadInquiry[] = leadsData.leads || [];
      const products: AdminProduct[] = prodsData.products || [];
      const services: AdminService[] = servicesData.services || [];
      const blogPosts: AdminBlogPost[] = blogData.posts || [];
      const orders: OrderRecord[] = ordersData.orders || [];
      const coupons: AdminCoupon[] = couponsData.coupons || [];
      const subscribers = subsData.subscribers || [];

      const totalRev = orders
        .filter((o) => o.paymentStatus === "completed")
        .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

      const totalDownloads = products.reduce((acc, p) => acc + (p.downloads || 0), 0);

      setMetrics({
        totalRevenueINR: totalRev,
        totalDownloads,
        publishedProducts: products.filter((p) => p.status === "published").length,
        totalProducts: products.length,
        activeServicesCount: services.filter((s) => s.status === "active").length,
        totalServicesCount: services.length,
        publishedPostsCount: blogPosts.filter((b) => b.status === "published").length,
        completedOrdersCount: orders.filter((o) => o.paymentStatus === "completed").length,
        activeCouponsCount: coupons.filter((c) => c.status === "active").length,
        newLeadsCount: leads.filter((l) => l.status === "new").length,
        totalLeadsCount: leads.length,
        totalSubscribersCount: subscribers.filter((s: any) => s.status === "active").length,
      });

      setRecentLeads(leads.slice(0, 5));
      setRecentOrders(orders.slice(0, 5));
      setSettings(settingsData.settings || null);
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
      {/* Top Header & Quick Action Launcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-medium tracking-wider text-emerald-400 uppercase">
              Operational • 100% Secured
            </span>
          </div>
          <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-white md:text-3xl">
            Founder Operating Console
          </h1>
          <p className="text-xs text-zinc-400">
            Full control of digital assets, creative services, editorial content, and orders.
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

      {/* Quick Launchpad Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Link
          href="/admin/products"
          className="flex items-center gap-2.5 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-3 text-xs font-medium text-zinc-300 transition-all hover:border-[#FF5A36]/50 hover:bg-zinc-900 hover:text-white"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FF5A36]/15 text-[#FF5A36]">
            <Package className="h-4 w-4" />
          </div>
          <div className="truncate">
            <div className="font-semibold text-white">Add Product</div>
            <div className="text-[10px] text-zinc-500">Templates / Apps</div>
          </div>
        </Link>

        <Link
          href="/admin/services"
          className="flex items-center gap-2.5 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-3 text-xs font-medium text-zinc-300 transition-all hover:border-[#FF5A36]/50 hover:bg-zinc-900 hover:text-white"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
            <Layers className="h-4 w-4" />
          </div>
          <div className="truncate">
            <div className="font-semibold text-white">Add Service</div>
            <div className="text-[10px] text-zinc-500">Web / App / Video</div>
          </div>
        </Link>

        <Link
          href="/admin/blog"
          className="flex items-center gap-2.5 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-3 text-xs font-medium text-zinc-300 transition-all hover:border-[#FF5A36]/50 hover:bg-zinc-900 hover:text-white"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400">
            <FileText className="h-4 w-4" />
          </div>
          <div className="truncate">
            <div className="font-semibold text-white">Write Article</div>
            <div className="text-[10px] text-zinc-500">Blog & Editorial</div>
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="flex items-center gap-2.5 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-3 text-xs font-medium text-zinc-300 transition-all hover:border-[#FF5A36]/50 hover:bg-zinc-900 hover:text-white"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
            <ShoppingCart className="h-4 w-4" />
          </div>
          <div className="truncate">
            <div className="font-semibold text-white">Log Order</div>
            <div className="text-[10px] text-zinc-500">WhatsApp Delivery</div>
          </div>
        </Link>

        <Link
          href="/admin/coupons"
          className="flex items-center gap-2.5 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-3 text-xs font-medium text-zinc-300 transition-all hover:border-[#FF5A36]/50 hover:bg-zinc-900 hover:text-white"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
            <Tag className="h-4 w-4" />
          </div>
          <div className="truncate">
            <div className="font-semibold text-white">Create Coupon</div>
            <div className="text-[10px] text-zinc-500">Promo Engine</div>
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="flex items-center gap-2.5 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-3 text-xs font-medium text-zinc-300 transition-all hover:border-[#FF5A36]/50 hover:bg-zinc-900 hover:text-white"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="truncate">
            <div className="font-semibold text-white">System Config</div>
            <div className="text-[10px] text-zinc-500">WhatsApp & Rates</div>
          </div>
        </Link>
      </div>

      {/* 6 Top KPI Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        {/* Metric 1: Revenue */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Gross Sales</span>
            {currency === "INR" ? (
              <IndianRupee className="h-4 w-4 text-[#FF5A36]" />
            ) : (
              <DollarSign className="h-4 w-4 text-[#FF5A36]" />
            )}
          </div>
          <div className="mt-2 font-heading text-xl font-bold tracking-tight text-white">
            {displayRevenue}
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            {metrics.completedOrdersCount} orders paid
          </p>
        </div>

        {/* Metric 2: Digital Products */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Digital Assets</span>
            <Package className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-heading text-xl font-bold tracking-tight text-white">
            {metrics.publishedProducts}
            <span className="text-xs font-normal text-zinc-500 ml-1">
              / {metrics.totalProducts}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">Kits, bundles & apps</p>
        </div>

        {/* Metric 3: Agency Services */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Creative Services</span>
            <Layers className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 font-heading text-xl font-bold tracking-tight text-white">
            {metrics.activeServicesCount}
            <span className="text-xs font-normal text-zinc-500 ml-1">Active</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">Web, App & Video</p>
        </div>

        {/* Metric 4: Editorial Articles */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Articles Live</span>
            <FileText className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 font-heading text-xl font-bold tracking-tight text-white">
            {metrics.publishedPostsCount}
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">SEO Playbooks</p>
        </div>

        {/* Metric 5: Agency Leads */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Inbound Inquiries</span>
            <Users2 className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 font-heading text-xl font-bold tracking-tight text-white">
            {metrics.totalLeadsCount}
            {metrics.newLeadsCount > 0 && (
              <span className="ml-1 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                +{metrics.newLeadsCount} new
              </span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">High-intent client leads</p>
        </div>

        {/* Metric 6: Audience */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Audience</span>
            <Mail className="h-4 w-4 text-pink-400" />
          </div>
          <div className="mt-2 font-heading text-xl font-bold tracking-tight text-white">
            {metrics.totalSubscribersCount}
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">Subscribers enrolled</p>
        </div>
      </div>

      {/* Two Columns: Recent Leads & Recent Orders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Recent Leads (7 cols) */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-md lg:col-span-7">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="font-heading text-sm font-bold text-white">
                Recent Inbound Leads CRM
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
            {recentLeads.length === 0 ? (
              <p className="py-6 text-center text-xs text-zinc-500">No leads recorded yet.</p>
            ) : (
              recentLeads.map((lead) => (
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
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recent Sales Orders (5 cols) */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-md lg:col-span-5">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="font-heading text-sm font-bold text-white">
                Orders & Deliveries
              </h2>
              <p className="text-[11px] text-zinc-400">
                Direct transactions & verified license keys
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs font-semibold text-[#FF5A36] hover:underline"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-zinc-800/60">
            {recentOrders.length === 0 ? (
              <p className="py-6 text-center text-xs text-zinc-500">No orders logged yet.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">{order.id}</span>
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
