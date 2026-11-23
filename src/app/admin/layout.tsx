"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users2,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ShoppingCart,
  FileText,
  Tag,
  Package,
  Layers,
  Archive,
  Smartphone,
  Camera,
  Music,
  BookOpen,
  Calendar,
  Video,
  Globe,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, group: null as null | string },

  // DIGITAL SHOP (Separated individually + All Products Master)
  { label: "All Products Master", href: "/admin/products", icon: Package, group: "Digital Shop" },
  { label: "Bundles", href: "/admin/shop/bundles", icon: Archive, group: "Digital Shop" },
  { label: "Apps", href: "/admin/shop/apps", icon: Smartphone, group: "Digital Shop" },
  { label: "Lightroom Presets", href: "/admin/shop/presets", icon: Camera, group: "Digital Shop" },
  { label: "Sound Effects & BGM", href: "/admin/shop/sound-effects", icon: Music, group: "Digital Shop" },
  { label: "Video Templates", href: "/admin/shop/video-templates", icon: Video, group: "Digital Shop" },
  { label: "E-Books", href: "/admin/shop/ebooks", icon: BookOpen, group: "Digital Shop" },
  { label: "Planners", href: "/admin/shop/planners", icon: Calendar, group: "Digital Shop" },
  { label: "Templates", href: "/admin/shop/templates", icon: Layers, group: "Digital Shop" },

  // CREATIVE AGENCY SERVICES (Separated individually)
  { label: "Video Editing", href: "/admin/services/video-editing", icon: Video, group: "Creative Services" },
  { label: "Photo Editing", href: "/admin/services/photo-editing", icon: Camera, group: "Creative Services" },
  { label: "Event Photography", href: "/admin/services/event-photography", icon: Camera, group: "Creative Services" },
  { label: "Pre-Wedding Cinematic", href: "/admin/services/pre-wedding-cinematic", icon: Video, group: "Creative Services" },
  { label: "Website Design", href: "/admin/services/website-design", icon: Globe, group: "Creative Services" },
  { label: "App Development", href: "/admin/services/app-development", icon: Smartphone, group: "Creative Services" },
  { label: "Logo Design", href: "/admin/services/logo-design", icon: Sparkles, group: "Creative Services" },

  // COMMERCE
  { label: "Orders & Delivery", href: "/admin/orders", icon: ShoppingCart, group: "Commerce" },
  { label: "Discount Coupons", href: "/admin/coupons", icon: Tag, group: "Commerce" },

  // AUDIENCE & CONTENT
  { label: "Inbound Leads CRM", href: "/admin/leads", icon: Users2, group: "Audience" },
  { label: "Newsletter Audience", href: "/admin/subscribers", icon: Mail, group: "Audience" },
  { label: "Blog & Editorial", href: "/admin/blog", icon: FileText, group: "Audience" },

  // SYSTEM
  { label: "CashFree & Settings", href: "/admin/settings", icon: Settings, group: "System" },
  { label: "DPDP Compliance & Breach", href: "/admin/compliance", icon: ShieldCheck, group: "System" },
];

const NAV_GROUPS = [
  { title: null as null | string, items: NAV_ITEMS.filter((i) => i.group === null) },
  { title: "Digital Shop", items: NAV_ITEMS.filter((i) => i.group === "Digital Shop") },
  { title: "Creative Services", items: NAV_ITEMS.filter((i) => i.group === "Creative Services") },
  { title: "Commerce", items: NAV_ITEMS.filter((i) => i.group === "Commerce") },
  { title: "Audience", items: NAV_ITEMS.filter((i) => i.group === "Audience") },
  { title: "System", items: NAV_ITEMS.filter((i) => i.group === "System") },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(pathname !== "/admin/login");

  useEffect(() => {
    if (pathname === "/admin/login") return;

    fetch("/api/admin/auth")
      .then((res) => {
        if (!res.ok) {
          router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
      });
  }, [pathname, router]);

  // Skip layout styling on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#FF5A36] border-t-transparent" />
      </div>
    );
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#09090B] text-zinc-100 selection:bg-[#FF5A36] selection:text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-zinc-800 bg-zinc-950 p-5 md:flex overflow-y-auto max-h-screen sticky top-0">
        <div>
          {/* Logo & Founder Badge */}
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5A36] font-bold text-white shadow-md">
              B
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-sm font-bold tracking-tight text-white">
                  BADARSH
                </span>
                <span className="rounded-full bg-[#FF5A36]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#FF5A36]">
                  AOS
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Founder Command Center</p>
            </div>
          </div>

          {/* Navigation Links — Grouped */}
          <nav className="mt-6 space-y-4">
            {/* Overview */}
            {NAV_ITEMS.filter((i) => i.group === null).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === "/admin";
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-150 active:scale-[0.98]",
                    isActive ? "bg-[#FF5A36] text-white shadow-xs" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Grouped sections */}
            {["Digital Shop", "Creative Services", "Commerce", "Audience", "System"].map((group) => {
              const groupItems = NAV_ITEMS.filter((i) => i.group === group);
              if (!groupItems.length) return null;
              return (
                <div key={group}>
                  <p className="mb-1.5 px-3.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    {group}
                  </p>
                  <div className="space-y-0.5">
                    {groupItems.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        item.href === "/admin"
                          ? pathname === "/admin"
                          : pathname === item.href;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={cn(
                            "flex items-center justify-between rounded-xl px-3.5 py-2 text-xs font-medium transition-all duration-150 active:scale-[0.98]",
                            isActive
                              ? "bg-[#FF5A36] text-white font-semibold shadow-xs"
                              : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="h-4 w-4 shrink-0" />
                            <span>{item.label}</span>
                          </div>
                          {isActive && <ChevronRight className="h-3 w-3 text-white/70" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 border-t border-zinc-800/80 pt-4 mt-4">
          <div className="flex items-center justify-between rounded-lg bg-zinc-900/60 px-3 py-2 text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Production Live</span>
            </div>
            <span className="font-mono text-[10px] text-zinc-500">Zero-Trust</span>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <span>Visit Public Store</span>
              <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
            </Link>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              <span>{loggingOut ? "Locking..." : "Lock Console"}</span>
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden min-w-0">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-8 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-zinc-200">BADARSH Operating System</span>
            <span>&bull;</span>
            <span className="text-zinc-500">Autonomous Founder Console</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <span>Open Storefront</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 md:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5A36] text-xs font-bold text-white">
              B
            </div>
            <span className="font-heading text-sm font-bold text-white">
              BADARSH Admin
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-zinc-800 bg-zinc-950 p-4 md:hidden max-h-[80vh] overflow-y-auto">
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold",
                      isActive
                        ? "bg-[#FF5A36] text-white"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="pt-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Lock Console</span>
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
