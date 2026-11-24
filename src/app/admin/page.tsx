"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { safeParseJson } from "@/lib/utils";
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
  Archive,
  Smartphone,
  Camera,
  Music,
  BookOpen,
  Calendar,
  Video,
  Globe,
  UploadCloud,
  Check,
  Copy,
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
import { FileUploader } from "@/components/admin/file-uploader";

// 7 Dedicated Shop Categories
const SHOP_CATEGORIES = [
  {
    id: "bundles",
    title: "Bundles",
    subtitle: "Editing packs, 4K clips, LUTs & motion",
    href: "/admin/shop/bundles",
    icon: Archive,
    accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    match: (p: AdminProduct) => p.category === "bundles" || p.productType === "bundle",
  },
  {
    id: "apps",
    title: "Apps",
    subtitle: "Creator tools & mobile applications (zero APK wording)",
    href: "/admin/shop/apps",
    icon: Smartphone,
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    match: (p: AdminProduct) => p.category === "editing-apps" || p.productType === "app-license",
  },
  {
    id: "presets",
    title: "Lightroom Presets",
    subtitle: "Before/After RAW comparison & DNG presets",
    href: "/admin/shop/presets",
    icon: Camera,
    accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    match: (p: AdminProduct) => p.category === "photo-presets" || p.productType === "photo-preset",
  },
  {
    id: "sound-effects",
    title: "Sound Effects & BGM",
    subtitle: "Streaming audio player & master downloads",
    href: "/admin/shop/sound-effects",
    icon: Music,
    accent: "text-[#FF5A36] bg-[#FF5A36]/10 border-[#FF5A36]/20",
    match: (p: AdminProduct) => p.category === "editing-bundles" || p.productType === "audio" || p.productType === "editing-bundle",
  },
  {
    id: "ebooks",
    title: "E-Books",
    subtitle: "In-browser PDF reader & protected download",
    href: "/admin/shop/ebooks",
    icon: BookOpen,
    accent: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    match: (p: AdminProduct) => p.category === "ebooks" || p.productType === "ebook",
  },
  {
    id: "planners",
    title: "Planners",
    subtitle: "Copy-protected life & productivity PDF planners",
    href: "/admin/shop/planners",
    icon: Calendar,
    accent: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    match: (p: AdminProduct) => p.category === "planners" || p.productType === "planner",
  },
  {
    id: "video-templates",
    title: "Video Templates",
    subtitle: "Beat-sync CapCut & Alight Motion XML short-form video edits",
    href: "/admin/shop/video-templates",
    icon: Video,
    accent: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    match: (p: AdminProduct) =>
      p.category === "video-templates" ||
      (p.productType as string) === "video-template" ||
      (p.productType as any) === "video",
  },
  {
    id: "templates",
    title: "Templates",
    subtitle: "Graphic design templates (100% proprietary)",
    href: "/admin/shop/templates",
    icon: Layers,
    accent: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    match: (p: AdminProduct) => ["social-media", "presentations", "branding", "business-cards"].includes(p.category) || p.productType === "canva-template" || (p.productType as any) === "template",
  },
];

// 7 Dedicated Creative Services
const CREATIVE_SERVICES = [
  {
    id: "video-editing",
    title: "Video Editing",
    subtitle: "Tiers ₹250 / ₹400 / ₹799–₹1,000 + MP4 & YouTube portfolio",
    href: "/admin/services/video-editing",
    icon: Video,
    accent: "text-[#FF5A36] bg-[#FF5A36]/10 border-[#FF5A36]/20",
    pricing: "From ₹250",
  },
  {
    id: "photo-editing",
    title: "Photo Editing",
    subtitle: "Tiers ₹150 / ₹350 / ₹799 + Before/After retouching sliders",
    href: "/admin/services/photo-editing",
    icon: Camera,
    accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    pricing: "From ₹150",
  },
  {
    id: "event-photography",
    title: "Event Photography",
    subtitle: "Weddings, birthdays, corporate summits & Sony FX3 dual-cam",
    href: "/admin/services/event-photography",
    icon: Camera,
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    pricing: "From ₹14,999",
  },
  {
    id: "pre-wedding-cinematic",
    title: "Pre-Wedding Cinematic",
    subtitle: "4K destination teaser film, love stories & DJI Mavic drone aerials",
    href: "/admin/services/pre-wedding-cinematic",
    icon: Video,
    accent: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    pricing: "From ₹24,999",
  },
  {
    id: "website-design",
    title: "Website Design",
    subtitle: "Custom SaaS & portfolio web builds + live site links",
    href: "/admin/services/website-design",
    icon: Globe,
    accent: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    pricing: "From ₹2,999",
  },
  {
    id: "app-development",
    title: "App Development",
    subtitle: "Cross-platform iOS & Android mobile apps + mockups",
    href: "/admin/services/app-development",
    icon: Smartphone,
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    pricing: "From ₹5,999",
  },
  {
    id: "logo-design",
    title: "Logo Design",
    subtitle: "Tiers ₹500 / ₹1,199 / ₹1,999 + Dark & Light vector marks",
    href: "/admin/services/logo-design",
    icon: Sparkles,
    accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    pricing: "From ₹500",
  },
];

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [services, setServices] = useState<AdminService[]>([]);
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

  // Quick Dropzone state
  const [vaultFileUrl, setVaultFileUrl] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const responses = await Promise.all([
        fetch("/api/admin/leads", { cache: "no-store" }),
        fetch("/api/admin/products", { cache: "no-store" }),
        fetch("/api/admin/services", { cache: "no-store" }),
        fetch("/api/admin/blog", { cache: "no-store" }),
        fetch("/api/admin/orders", { cache: "no-store" }),
        fetch("/api/admin/coupons", { cache: "no-store" }),
        fetch("/api/admin/subscribers", { cache: "no-store" }),
        fetch("/api/admin/settings", { cache: "no-store" }),
      ]);

      if (responses.some((r) => r.status === 401)) {
        window.location.replace("/admin/login");
        return;
      }

      const [
        leadsRes,
        prodsRes,
        servicesRes,
        blogRes,
        ordersRes,
        couponsRes,
        subsRes,
        settingsRes,
      ] = responses;

      const [
        leadsData,
        prodsData,
        servicesData,
        blogData,
        ordersData,
        couponsData,
        subsData,
        settingsData,
      ] = await Promise.all([
        safeParseJson<{ leads?: LeadInquiry[] }>(leadsRes, {}),
        safeParseJson<{ products?: AdminProduct[] }>(prodsRes, {}),
        safeParseJson<{ services?: AdminService[] }>(servicesRes, {}),
        safeParseJson<{ blogPosts?: AdminBlogPost[]; posts?: AdminBlogPost[] }>(blogRes, {}),
        safeParseJson<{ orders?: OrderRecord[] }>(ordersRes, {}),
        safeParseJson<{ coupons?: AdminCoupon[] }>(couponsRes, {}),
        safeParseJson<{ subscribers?: any[] }>(subsRes, {}),
        safeParseJson<{ settings?: SystemSettings | null }>(settingsRes, {}),
      ]);

      const leads: LeadInquiry[] = leadsData.leads || [];
      const prods: AdminProduct[] = prodsData.products || [];
      const servs: AdminService[] = servicesData.services || [];
      const blogPosts: AdminBlogPost[] = blogData.blogPosts || blogData.posts || [];
      const orders: OrderRecord[] = ordersData.orders || [];
      const coupons: AdminCoupon[] = couponsData.coupons || [];
      const subscribers = subsData.subscribers || [];

      setProducts(prods);
      setServices(servs);

      const totalRev = orders
        .filter((o) => o.paymentStatus === "completed")
        .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

      const totalDownloads = prods.reduce((acc, p) => acc + (p.downloads || 0), 0);

      setMetrics({
        totalRevenueINR: totalRev,
        totalDownloads,
        publishedProducts: prods.filter((p) => p.status === "published").length,
        totalProducts: prods.length,
        activeServicesCount: servs.filter((s) => s.status === "active").length,
        totalServicesCount: servs.length,
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
      {/* Top Header & Global Status */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-medium tracking-wider text-emerald-400 uppercase">
              Operational • Standalone Founder OS
            </span>
          </div>
          <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-white md:text-3xl">
            Founder Operating Console
          </h1>
          <p className="text-xs text-zinc-400">
            Dedicated managers for all 7 shop categories, 5 agency services, and universal device file uploads.
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
            <span>Master Catalog</span>
          </Link>
        </div>
      </div>

      {/* 6 Top KPI Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        {/* Metric 1: Revenue */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
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
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
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
          <p className="mt-1 text-[11px] text-zinc-500">7 categories active</p>
        </div>

        {/* Metric 3: Agency Services */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Creative Services</span>
            <Layers className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 font-heading text-xl font-bold tracking-tight text-white">
            {metrics.activeServicesCount}
            <span className="text-xs font-normal text-zinc-500 ml-1">Active</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">5 agency disciplines</p>
        </div>

        {/* Metric 4: Editorial Articles */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
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
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Inbound Leads</span>
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
          <p className="mt-1 text-[11px] text-zinc-500">High-intent inquiries</p>
        </div>

        {/* Metric 6: Audience */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
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

      {/* SECTION 1: UNIVERSAL ASSET VAULT / DIRECT FILE DROPZONE */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5A36]/15 text-[#FF5A36]">
              <UploadCloud className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-bold text-white">
                Universal Asset Dropzone &amp; File Vault
              </h2>
              <p className="text-[11px] text-zinc-400">
                Directly upload any Photo, PDF Document, MP4 Video, or Audio Track from your computer to the server.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            Storage: /public/uploads/ • Instant Server URL
          </span>
        </div>

        <FileUploader
          label="Drop any file to upload and generate an instant public URL"
          value={vaultFileUrl}
          onChange={(url) => setVaultFileUrl(url)}
          fileType="any"
          hint="Supports Photos (PNG/JPG/WebP), PDFs (Books/Planners), MP4 Videos (Reels/Trailers), Audio (MP3/WAV), and ZIP Archives"
        />
      </div>

      {/* SECTION 2: DIGITAL SHOP LAUNCHPAD (7 SEPARATE CATEGORIES) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-base font-bold text-white flex items-center gap-2">
              <Package className="h-4 w-4 text-[#FF5A36]" />
              <span>Digital Shop Managers</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Every shop product category is managed on its own dedicated page with custom file dropzones.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-semibold text-[#FF5A36] hover:underline flex items-center gap-1"
          >
            <span>View All Products</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SHOP_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = products.filter(cat.match).length;
            return (
              <div
                key={cat.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-4 transition-all hover:border-[#FF5A36]/50 hover:bg-zinc-900/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${cat.accent}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="rounded-full bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[10px] font-mono font-semibold text-zinc-300">
                      {count} items
                    </span>
                  </div>

                  <h3 className="mt-3 font-heading text-sm font-bold text-white group-hover:text-[#FF5A36] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-zinc-400 line-clamp-2">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                  <Link
                    href={cat.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-[#FF5A36] transition-colors"
                  >
                    <span>Manage Category</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>

                  <Link
                    href={cat.href}
                    className="rounded-lg bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-[#FF5A36] hover:text-white hover:border-[#FF5A36] transition-all"
                  >
                    + Upload
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: CREATIVE AGENCY SERVICES (5 SEPARATE MANAGERS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-400" />
              <span>Creative Agency Service Managers</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Manage client pricing tiers, deliverables, and trust showcase portfolios (MP4s, Before/After photos, Web links).
            </p>
          </div>
          <Link
            href="/admin/services"
            className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>All Services</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {CREATIVE_SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-4 transition-all hover:border-blue-500/50 hover:bg-zinc-900/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${srv.accent}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="rounded-full bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {srv.pricing}
                    </span>
                  </div>

                  <h3 className="mt-3 font-heading text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-zinc-400 line-clamp-2">
                    {srv.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                  <Link
                    href={srv.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-blue-400 transition-colors"
                  >
                    <span>Manage Tiers</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>

                  <Link
                    href={srv.href}
                    className="rounded-lg bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                  >
                    + Portfolio
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: RECENT LEADS & RECENT ORDERS CRM */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Recent Leads (7 cols) */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 lg:col-span-7">
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
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="font-heading text-sm font-bold text-white">
                Orders &amp; Deliveries
              </h2>
              <p className="text-[11px] text-zinc-400">
                Direct transactions &amp; verified license keys
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
