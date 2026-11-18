"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users2,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  BarChart3,
  ShoppingCart,
  FileText,
  Tag,
  MessageSquare,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, group: null as null | string },
  { label: "Products & Assets", href: "/admin/products", icon: Package, group: "Catalog" },
  { label: "Categories & Tags", href: "/admin/products", icon: Tag, group: "Catalog" },
  { label: "Client Leads CRM", href: "/admin/leads", icon: Users2, group: "Sales" },
  { label: "Orders & Delivery", href: "/admin/leads", icon: ShoppingCart, group: "Sales" },
  { label: "Newsletter Audience", href: "/admin/subscribers", icon: Mail, group: "Audience" },
  { label: "Messages & Chats", href: "/admin/leads", icon: MessageSquare, group: "Audience" },
  { label: "Site Settings", href: "/admin/settings", icon: Settings, group: "Config" },
];

const NAV_GROUPS = [
  { title: null as null | string, items: NAV_ITEMS.filter((i) => i.group === null) },
  { title: "Catalog", items: NAV_ITEMS.filter((i) => i.group === "Catalog") },
  { title: "Sales", items: NAV_ITEMS.filter((i) => i.group === "Sales") },
  { title: "Audience", items: NAV_ITEMS.filter((i) => i.group === "Audience") },
  { title: "Config", items: NAV_ITEMS.filter((i) => i.group === "Config") },
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

  // Skip layout styling on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
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
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-zinc-800/80 bg-zinc-950/80 p-5 backdrop-blur-xl md:flex">
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
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 active:scale-[0.98]",
                    isActive ? "bg-[#FF5A36] text-white shadow-xs" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Grouped sections */}
            {["Catalog", "Sales", "Audience", "Config"].map((group) => {
              const groupItems = NAV_ITEMS.filter((i) => i.group === group);
              if (!groupItems.length) return null;
              return (
                <div key={group}>
                  <p className="mb-1.5 px-3.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    {group}
                  </p>
                  <div className="space-y-0.5">
                    {groupItems.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        item.href === "/admin"
                          ? pathname === "/admin"
                          : pathname.startsWith(item.href) && item.href !== "/admin";
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 active:scale-[0.98]",
                            isActive ? "bg-[#FF5A36] text-white shadow-xs" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{item.label}</span>
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
        <div className="space-y-3 border-t border-zinc-800/80 pt-4">
          {/* System status pill */}
          <div className="flex items-center justify-between rounded-lg bg-zinc-900/60 px-3 py-2 text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Production Live</span>
            </div>
            <span className="font-mono text-[10px] text-zinc-500">v2.4</span>
          </div>

          {/* Links */}
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
      <div className="flex flex-1 flex-col overflow-x-hidden">
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
          <div className="border-b border-zinc-800 bg-zinc-950 p-4 md:hidden">
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
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

