"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ChevronDown, ArrowRight, MessageSquare, Zap } from "lucide-react";
import { cn, getWhatsAppUrl } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { ThemeToggle } from "./theme-toggle";
import { CurrencyToggle } from "./currency-toggle";
import { MobileNav } from "./mobile-nav";
import { BrandLogo } from "./brand-logo";

type DropdownKey = "shop" | "services" | null;

// ─── Apple Compact Floating Shop Dropdown ────────────────────────────────────
function ShopDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-[360px] p-2 text-left sm:w-[380px]">
      <div className="grid grid-cols-2 gap-2 p-2">
        {/* Column 1: Assets */}
        <div>
          <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
            Creative Assets
          </p>
          <ul className="space-y-0.5">
            {[
              { label: "All-in-One Bundles", href: "/bundles" },
              { label: "Editing Apps (APKs)", href: "/editing-apps" },
              { label: "Lightroom Presets", href: "/photo-presets" },
              { label: "SFX & Overlays", href: "/editing-bundles" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground/90 transition-colors hover:bg-muted/40 hover:text-foreground active:scale-[0.98]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Library */}
        <div>
          <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
            Digital Guides
          </p>
          <ul className="space-y-0.5">
            {[
              { label: "Business E-Books", href: "/ebooks" },
              { label: "Productivity Planners", href: "/planners" },
              { label: "Canva Templates", href: "/templates" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground/90 transition-colors hover:bg-muted/40 hover:text-foreground active:scale-[0.98]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-border/40 px-3 pt-2 pb-1 text-[11px]">
        <Link
          href="/bundles"
          onClick={onClose}
          className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
        >
          <span>All Digital Products</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
        <span className="text-[10px] text-muted">Instant Cloud Access</span>
      </div>
    </div>
  );
}

// ─── Apple Compact Floating Services Dropdown ────────────────────────────────
function ServicesDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-[380px] p-2 text-left sm:w-[400px]">
      <div className="grid grid-cols-2 gap-2 p-2">
        {/* Column 1: Production */}
        <div>
          <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
            Production
          </p>
          <ul className="space-y-0.5">
            {[
              { label: "Video Editing", href: "/services/video-editing" },
              { label: "Photo Retouching", href: "/services/photo-editing" },
              { label: "Social Media Mgt", href: "/services/social-media-management" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground/90 transition-colors hover:bg-muted/40 hover:text-foreground active:scale-[0.98]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Engineering */}
        <div>
          <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
            Engineering & Brand
          </p>
          <ul className="space-y-0.5">
            {[
              { label: "Website Dev (₹3k–₹15k)", href: "/services/website-design" },
              { label: "App Development", href: "/services/app-development" },
              { label: "Brand & Logo Design", href: "/services/brand-identity" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-foreground/90 transition-colors hover:bg-muted/40 hover:text-foreground active:scale-[0.98]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-border/40 px-3 pt-2 pb-1 text-[11px]">
        <Link
          href="/services"
          onClick={onClose}
          className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
        >
          <span>All Studio Services</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
        <a
          href={getWhatsAppUrl("Hi BADARSH! I'd like to discuss a custom project.")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-muted hover:text-foreground transition-colors"
        >
          <MessageSquare className="h-3 w-3 text-emerald-400" />
          <span>WhatsApp Desk</span>
        </a>
      </div>
    </div>
  );
}

// ─── Main Simple Apple-grade Navbar ──────────────────────────────────────────
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const { isScrolled } = useScroll();
  const pathname = usePathname();
  const navContainerRef = useRef<HTMLElement>(null);

  const toggleDropdown = useCallback((key: "shop" | "services") => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  }, []);

  const closeDropdown = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  // Close on route change
  useEffect(() => {
    closeDropdown();
  }, [pathname, closeDropdown]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDropdown();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeDropdown]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  const isShopActive = [
    "/bundles",
    "/editing-apps",
    "/photo-presets",
    "/editing-bundles",
    "/ebooks",
    "/planners",
    "/templates",
  ].some((p) => pathname.startsWith(p));

  const isServicesActive = pathname.startsWith("/services");

  return (
    <>
      <header
        ref={navContainerRef}
        className={cn(
          "sticky top-0 z-50 w-full transition-[background-color,border-color,box-shadow] duration-200 ease-out",
          isScrolled
            ? "border-b border-border/40 bg-background/85 shadow-xs"
            : "border-b border-transparent bg-background/60",
          "backdrop-blur-2xl"
        )}
        style={{ WebkitBackdropFilter: "blur(24px) saturate(180%)" }}
      >
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <BrandLogo />
          </div>

          {/* Simple, Crisp Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {/* 1. Shop Flyout */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("shop")}
                className={cn(
                  "group inline-flex items-center gap-1 cursor-pointer select-none rounded-full px-3 py-1.5 text-[12px] font-normal tracking-[-0.01em] transition-all duration-150 active:scale-[0.97]",
                  openDropdown === "shop"
                    ? "bg-muted/70 text-foreground font-semibold"
                    : isShopActive
                    ? "text-foreground font-semibold"
                    : "text-foreground/75 hover:text-foreground hover:bg-muted/30"
                )}
                aria-expanded={openDropdown === "shop"}
                aria-haspopup="true"
              >
                <span>Shop</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 text-muted transition-transform duration-200",
                    openDropdown === "shop"
                      ? "rotate-180 text-foreground"
                      : "group-hover:text-foreground"
                  )}
                />
              </button>

              <AnimatePresence>
                {openDropdown === "shop" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 mt-1.5 z-50 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
                  >
                    <ShopDropdown onClose={closeDropdown} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Direct Link: Editing Apps (APKs) */}
            <Link
              href="/editing-apps"
              onClick={closeDropdown}
              className={cn(
                "cursor-pointer select-none rounded-full px-3 py-1.5 text-[12px] font-normal tracking-[-0.01em] transition-all duration-150 hover:bg-muted/30 active:scale-[0.97]",
                pathname === "/editing-apps"
                  ? "text-foreground font-semibold"
                  : "text-foreground/75 hover:text-foreground"
              )}
            >
              Editing Apps
            </Link>

            {/* 3. Direct Link: Lightroom Presets */}
            <Link
              href="/photo-presets"
              onClick={closeDropdown}
              className={cn(
                "cursor-pointer select-none rounded-full px-3 py-1.5 text-[12px] font-normal tracking-[-0.01em] transition-all duration-150 hover:bg-muted/30 active:scale-[0.97]",
                pathname === "/photo-presets"
                  ? "text-foreground font-semibold"
                  : "text-foreground/75 hover:text-foreground"
              )}
            >
              Presets
            </Link>

            {/* 4. Services Flyout */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("services")}
                className={cn(
                  "group inline-flex items-center gap-1 cursor-pointer select-none rounded-full px-3 py-1.5 text-[12px] font-normal tracking-[-0.01em] transition-all duration-150 active:scale-[0.97]",
                  openDropdown === "services"
                    ? "bg-muted/70 text-foreground font-semibold"
                    : isServicesActive
                    ? "text-foreground font-semibold"
                    : "text-foreground/75 hover:text-foreground hover:bg-muted/30"
                )}
                aria-expanded={openDropdown === "services"}
                aria-haspopup="true"
              >
                <span>Services</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 text-muted transition-transform duration-200",
                    openDropdown === "services"
                      ? "rotate-180 text-foreground"
                      : "group-hover:text-foreground"
                  )}
                />
              </button>

              <AnimatePresence>
                {openDropdown === "services" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 mt-1.5 z-50 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
                  >
                    <ServicesDropdown onClose={closeDropdown} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 5. Direct Link: About */}
            <Link
              href="/about"
              onClick={closeDropdown}
              className={cn(
                "cursor-pointer select-none rounded-full px-3 py-1.5 text-[12px] font-normal tracking-[-0.01em] transition-all duration-150 hover:bg-muted/30 active:scale-[0.97]",
                pathname === "/about"
                  ? "text-foreground font-semibold"
                  : "text-foreground/75 hover:text-foreground"
              )}
            >
              About
            </Link>

            {/* 6. Direct Link: Blog */}
            <Link
              href="/blog"
              onClick={closeDropdown}
              className={cn(
                "cursor-pointer select-none rounded-full px-3 py-1.5 text-[12px] font-normal tracking-[-0.01em] transition-all duration-150 hover:bg-muted/30 active:scale-[0.97]",
                pathname === "/blog"
                  ? "text-foreground font-semibold"
                  : "text-foreground/75 hover:text-foreground"
              )}
            >
              Blog
            </Link>
          </nav>

          {/* Right Utility Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CurrencyToggle />
            <ThemeToggle />

            {/* Apple Solid CTA Pill */}
            <Link
              href="/bundles"
              onClick={closeDropdown}
              className="hidden md:inline-flex cursor-pointer items-center rounded-full bg-accent px-4 py-1.5 text-[12px] font-semibold text-white shadow-xs transition-[transform,background-color] duration-150 hover:bg-accent-hover active:scale-[0.96] ml-1"
            >
              Shop Now
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="cursor-pointer rounded-full p-2 text-foreground transition-colors duration-150 hover:bg-muted/30 active:scale-90 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
