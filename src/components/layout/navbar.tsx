"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Layers,
  Smartphone,
  Music,
  Camera,
  Layout,
  BookOpen,
  Calendar,
  Film,
  Image as ImageIcon,
  Share2,
  Globe,
  Code2,
  Palette,
  ExternalLink,
} from "lucide-react";
import { cn, getWhatsAppUrl } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { ThemeToggle } from "./theme-toggle";
import { CurrencyToggle } from "./currency-toggle";
import { UserAccountButton } from "./user-account-button";
import { MobileNav } from "./mobile-nav";
import { BrandLogo } from "./brand-logo";

type DropdownKey = "shop" | "services" | null;

// ─── Apple / Microsoft Level Shop Dropdown ────────────────────────────────────
function ShopDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-[460px] p-2.5 text-left sm:w-[480px]">
      <div className="grid grid-cols-2 gap-2 p-1.5">
        {/* Column 1: Assets */}
        <div>
          <div className="flex items-center gap-1.5 px-2.5 pb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              Creative Assets
            </p>
          </div>
          <ul className="space-y-1">
            {[
              {
                label: "Mega Bundles",
                desc: "Save up to 80% on 2026 vaults",
                href: "/bundles",
                icon: Sparkles,
                color: "text-amber-500 bg-amber-500/10",
              },
              {
                label: "Creator Apps",
                desc: "Verified video editing software",
                href: "/editing-apps",
                icon: Smartphone,
                color: "text-blue-500 bg-blue-500/10",
              },
              {
                label: "Sound FX & Music",
                desc: "Master audio & 4K overlays",
                href: "/editing-bundles",
                icon: Music,
                color: "text-purple-400 bg-purple-500/10",
              },
              {
                label: "Photo Presets",
                desc: "1-click Lightroom photo looks",
                href: "/photo-presets",
                icon: Camera,
                color: "text-emerald-500 bg-emerald-500/10",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-start gap-2.5 rounded-xl p-2 transition-all duration-150 hover:bg-muted/50 active:scale-[0.98]"
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-150 group-hover:scale-105",
                        item.color
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-muted line-clamp-1">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Column 2: Digital Guides & Systems */}
        <div>
          <div className="flex items-center gap-1.5 px-2.5 pb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              Guides & Systems
            </p>
          </div>
          <ul className="space-y-1">
            {[
              {
                label: "Design Templates",
                desc: "Canva, Notion & social media packs",
                href: "/templates",
                icon: Layout,
                color: "text-cyan-500 bg-cyan-500/10",
              },
              {
                label: "Founder E-Books",
                desc: "Growth playbooks & marketing guides",
                href: "/ebooks",
                icon: BookOpen,
                color: "text-rose-500 bg-rose-500/10",
              },
              {
                label: "Digital Planners",
                desc: "Productivity, gym & diet systems",
                href: "/planners",
                icon: Calendar,
                color: "text-amber-500 bg-amber-500/10",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-start gap-2.5 rounded-xl p-2 transition-all duration-150 hover:bg-muted/50 active:scale-[0.98]"
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-150 group-hover:scale-105",
                        item.color
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-muted line-clamp-1">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Dropdown Curated Footer */}
      <div className="mt-2 flex items-center justify-between border-t border-border/50 bg-muted/20 px-3.5 py-2.5 text-[11px] rounded-xl">
        <Link
          href="/bundles"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline group"
        >
          <span>Explore All 100+ Digital Assets</span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <span className="text-[10px] text-muted font-medium">
          Instant Cloud Download &bull; Lifetime Access
        </span>
      </div>
    </div>
  );
}

// ─── Apple / Microsoft Level Services Dropdown ────────────────────────────────
function ServicesDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-[470px] p-2.5 text-left sm:w-[490px]">
      <div className="grid grid-cols-2 gap-2 p-1.5">
        {/* Column 1: Production */}
        <div>
          <div className="flex items-center gap-1.5 px-2.5 pb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              Media Production
            </p>
          </div>
          <ul className="space-y-1">
            {[
              {
                label: "Video Editing",
                desc: "Reels, Shorts, YouTube & ads pacing",
                href: "/services/video-editing",
                icon: Film,
                color: "text-purple-400 bg-purple-500/10",
              },
              {
                label: "Photo Retouching",
                desc: "High-end portrait & product finishing",
                href: "/services/photo-editing",
                icon: ImageIcon,
                color: "text-pink-400 bg-pink-500/10",
              },
              {
                label: "Social Media Mgt",
                desc: "Full monthly content & visual systems",
                href: "/services/social-media-management",
                icon: Share2,
                color: "text-blue-500 bg-blue-500/10",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-start gap-2.5 rounded-xl p-2 transition-all duration-150 hover:bg-muted/50 active:scale-[0.98]"
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-150 group-hover:scale-105",
                        item.color
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-muted line-clamp-1">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Column 2: Engineering & Brand */}
        <div>
          <div className="flex items-center gap-1.5 px-2.5 pb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              Engineering &amp; Brand
            </p>
          </div>
          <ul className="space-y-1">
            {[
              {
                label: "Website Design & Dev",
                desc: "Custom Next.js websites (from ₹3,000)",
                href: "/services/website-design",
                icon: Globe,
                color: "text-emerald-500 bg-emerald-500/10",
              },
              {
                label: "App Development",
                desc: "Native & web apps for modern brands",
                href: "/services/app-development",
                icon: Code2,
                color: "text-cyan-500 bg-cyan-500/10",
              },
              {
                label: "Brand & Logo Design",
                desc: "Distinctive brand identities & assets",
                href: "/services/brand-identity",
                icon: Palette,
                color: "text-amber-500 bg-amber-500/10",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-start gap-2.5 rounded-xl p-2 transition-all duration-150 hover:bg-muted/50 active:scale-[0.98]"
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-150 group-hover:scale-105",
                        item.color
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-muted line-clamp-1">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Services Curated Footer */}
      <div className="mt-2 flex items-center justify-between border-t border-border/50 bg-muted/20 px-3.5 py-2.5 text-[11px] rounded-xl">
        <Link
          href="/services"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline group"
        >
          <span>All Studio Services</span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <a
          href={getWhatsAppUrl("Hi BADARSH! I'd like to discuss a custom creative project.")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 font-medium text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <MessageSquare className="h-3 w-3" />
          <span>WhatsApp Founder Desk</span>
        </a>
      </div>
    </div>
  );
}

// ─── Main Simple Apple / Microsoft Grade Navbar ─────────────────────────────
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const { isScrolled } = useScroll();
  const pathname = usePathname();
  const navContainerRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Safe hover intent timer to prevent accidental closures when moving cursor
  const handleMouseEnter = (key: "shop" | "services") => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  };

  const toggleDropdown = useCallback((key: "shop" | "services") => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  }, []);

  const closeDropdown = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
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
            ? "border-b border-border/60 bg-background/85 shadow-sm"
            : "border-b border-border/30 bg-background/70",
          "backdrop-blur-2xl"
        )}
        style={{ WebkitBackdropFilter: "blur(24px) saturate(180%)" }}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <BrandLogo />
          </div>

          {/* Simple, Crisp Desktop Navigation with Cursor Hover */}
          <nav className="hidden items-center gap-1 md:flex">
            {/* 1. Shop Flyout with Hover & Click */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("shop")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => toggleDropdown("shop")}
                className={cn(
                  "group inline-flex items-center gap-1 cursor-pointer select-none rounded-full px-3.5 py-1.5 text-xs font-medium tracking-[-0.01em] transition-all duration-150 active:scale-[0.97]",
                  openDropdown === "shop"
                    ? "bg-muted/70 text-foreground font-semibold"
                    : isShopActive
                    ? "text-foreground font-semibold bg-muted/30"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted/30"
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
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                    className="absolute top-full left-0 pt-2 z-50"
                  >
                    <div className="rounded-2xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
                      <ShopDropdown onClose={closeDropdown} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Services Flyout with Hover & Click */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("services")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => toggleDropdown("services")}
                className={cn(
                  "group inline-flex items-center gap-1 cursor-pointer select-none rounded-full px-3.5 py-1.5 text-xs font-medium tracking-[-0.01em] transition-all duration-150 active:scale-[0.97]",
                  openDropdown === "services"
                    ? "bg-muted/70 text-foreground font-semibold"
                    : isServicesActive
                    ? "text-foreground font-semibold bg-muted/30"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted/30"
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
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                    className="absolute top-full left-0 pt-2 z-50"
                  >
                    <div className="rounded-2xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
                      <ServicesDropdown onClose={closeDropdown} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Direct Link: Templates */}
            <Link
              href="/templates"
              onClick={closeDropdown}
              className={cn(
                "cursor-pointer select-none rounded-full px-3.5 py-1.5 text-xs font-medium tracking-[-0.01em] transition-all duration-150 hover:bg-muted/30 active:scale-[0.97]",
                pathname === "/templates"
                  ? "text-foreground font-semibold bg-muted/30"
                  : "text-foreground/80 hover:text-foreground"
              )}
            >
              Templates
            </Link>

            {/* 4. Direct Link: About */}
            <Link
              href="/about"
              onClick={closeDropdown}
              className={cn(
                "cursor-pointer select-none rounded-full px-3.5 py-1.5 text-xs font-medium tracking-[-0.01em] transition-all duration-150 hover:bg-muted/30 active:scale-[0.97]",
                pathname === "/about"
                  ? "text-foreground font-semibold bg-muted/30"
                  : "text-foreground/80 hover:text-foreground"
              )}
            >
              About
            </Link>

            {/* 5. Direct Link: Blog */}
            <Link
              href="/blog"
              onClick={closeDropdown}
              className={cn(
                "cursor-pointer select-none rounded-full px-3.5 py-1.5 text-xs font-medium tracking-[-0.01em] transition-all duration-150 hover:bg-muted/30 active:scale-[0.97]",
                pathname === "/blog"
                  ? "text-foreground font-semibold bg-muted/30"
                  : "text-foreground/80 hover:text-foreground"
              )}
            >
              Blog
            </Link>
          </nav>

          {/* Right Utility Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CurrencyToggle />
            <ThemeToggle />
            <UserAccountButton />

            {/* Apple Solid CTA Pill */}
            <Link
              href="/bundles"
              onClick={closeDropdown}
              className="hidden md:inline-flex cursor-pointer items-center rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:bg-accent-hover active:scale-[0.96] ml-1"
            >
              Shop Now
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="cursor-pointer rounded-full p-2 text-foreground transition-colors duration-150 hover:bg-muted/40 active:scale-90 md:hidden"
              aria-label="Open mobile navigation menu"
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
