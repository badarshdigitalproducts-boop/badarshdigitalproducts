"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ArrowRight, ShieldCheck, Zap, Clock, MessageSquare, ChevronDown } from "lucide-react";
import { cn, getWhatsAppUrl } from "@/lib/utils";
import { WHATSAPP_DISPLAY } from "@/lib/constants";
import { useScroll } from "@/hooks/use-scroll";
import { ThemeToggle } from "./theme-toggle";
import { CurrencyToggle } from "./currency-toggle";
import { MobileNav } from "./mobile-nav";
import { BrandLogo } from "./brand-logo";

type DropdownKey = "shop" | "services" | null;

// ─── Apple-grade Shop Mega Menu ──────────────────────────────────────────────
function ShopMegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Column 1: Core Digital Suites (4 cols) */}
        <div className="space-y-4 md:col-span-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Explore Digital Store
          </p>
          <ul className="space-y-2.5">
            {[
              {
                title: "Canva Templates",
                desc: "Social media reels, carousels & pitch decks",
                href: "/templates",
              },
              {
                title: "Business E-Books",
                desc: "Actionable growth playbooks & marketing blueprints",
                href: "/ebooks",
              },
              {
                title: "Productivity Planners",
                desc: "Content calendars & client management trackers",
                href: "/planners",
              },
              {
                title: "All-in-One Bundles",
                desc: "Curated collections with up to 60% savings",
                href: "/templates?category=bundles",
              },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="group flex flex-col rounded-lg p-2 transition-colors duration-150 hover:bg-muted/30 active:scale-[0.98]"
                >
                  <span className="text-[13px] font-semibold text-foreground group-hover:text-accent transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-muted leading-relaxed">
                    {item.desc}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Creator Tools & Presets (4 cols) */}
        <div className="space-y-4 md:col-span-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Creative Assets &amp; Presets
          </p>
          <ul className="space-y-2.5">
            {[
              {
                title: "Editing Apps & Vault",
                desc: "Export recipes, shortcuts & mobile workflows",
                href: "/templates?category=editing-apps",
              },
              {
                title: "Video SFX & Motion Overlays",
                desc: "350+ creator sounds, 4K film grains & leaks",
                href: "/templates?category=editing-bundles",
              },
              {
                title: "Lightroom Presets",
                desc: "25 cinematic desktop & mobile DNG presets",
                href: "/templates?category=photo-presets",
              },
              {
                title: "3D Device Mockup Frames",
                desc: "MacBook, iPhone & studio scene holders",
                href: "/templates?category=assets",
              },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="group flex flex-col rounded-lg p-2 transition-colors duration-150 hover:bg-muted/30 active:scale-[0.98]"
                >
                  <span className="text-[13px] font-semibold text-foreground group-hover:text-accent transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-muted leading-relaxed">
                    {item.desc}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Trust & Licensing (4 cols) */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/40 bg-card/40 p-5 md:col-span-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-accent">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Store Guarantees
              </span>
            </div>
            <p className="font-heading text-sm font-bold text-foreground">
              Built for Commercial Confidence
            </p>
            <p className="text-xs leading-relaxed text-muted">
              Every digital asset includes full commercial client rights, Canva Free compatibility, and automated instant delivery right after checkout.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-border/40 space-y-2">
            <Link
              href="/license"
              onClick={onClose}
              className="flex items-center justify-between text-xs text-foreground/80 hover:text-accent transition-colors"
            >
              <span>Commercial License Terms</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href="/refund-policy"
              onClick={onClose}
              className="flex items-center justify-between text-xs text-foreground/80 hover:text-accent transition-colors"
            >
              <span>100% Replacement Guarantee</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Apple-grade Services Mega Menu ──────────────────────────────────────────
function ServicesMegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Column 1: Production & Creative (4 cols) */}
        <div className="space-y-4 md:col-span-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Video &amp; Content Production
          </p>
          <ul className="space-y-2.5">
            {[
              {
                title: "Video Editing",
                desc: "High-retention Reels, YouTube edits & motion graphics",
                href: "/services#video-editing",
              },
              {
                title: "Photo Retouching",
                desc: "Commercial catalog, frequency separation & color grading",
                href: "/services#photo-editing",
              },
              {
                title: "Social Media Management",
                desc: "End-to-end strategy, content calendar & community growth",
                href: "/services#social-media-management",
              },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="group flex flex-col rounded-lg p-2 transition-colors duration-150 hover:bg-muted/30 active:scale-[0.98]"
                >
                  <span className="text-[13px] font-semibold text-foreground group-hover:text-accent transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-muted leading-relaxed">
                    {item.desc}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Engineering & Branding (4 cols) */}
        <div className="space-y-4 md:col-span-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Engineering &amp; Brand Systems
          </p>
          <ul className="space-y-2.5">
            {[
              {
                title: "Website Design & Development",
                desc: "High-performance Next.js sites built for maximum conversion",
                href: "/services#website-building",
              },
              {
                title: "Mobile App Development",
                desc: "iOS & Android native cross-platform apps with cloud backends",
                href: "/services#app-development",
              },
              {
                title: "Brand Identity Design",
                desc: "Logos, comprehensive style guides & design tokens",
                href: "/services#brand-identity",
              },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="group flex flex-col rounded-lg p-2 transition-colors duration-150 hover:bg-muted/30 active:scale-[0.98]"
                >
                  <span className="text-[13px] font-semibold text-foreground group-hover:text-accent transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-muted leading-relaxed">
                    {item.desc}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Direct Project Discussion (4 cols) */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/40 bg-card/40 p-5 md:col-span-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-500">
              <Zap className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Direct Agency Access
              </span>
            </div>
            <p className="font-heading text-sm font-bold text-foreground">
              Work Directly with Senior Builders
            </p>
            <p className="text-xs leading-relaxed text-muted">
              No junior account managers. You collaborate directly with experienced designers and developers on WhatsApp.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-muted pt-1">
              <Clock className="h-3.5 w-3.5 text-accent" />
              <span>Average response time: &lt; 15 minutes</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border/40">
            <a
              href={getWhatsAppUrl("Hi BADARSH! I'd like to discuss a custom creative project.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-xs font-semibold text-white shadow-xs transition-[transform,background-color] duration-150 hover:bg-accent-hover active:scale-[0.97]"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Chat on WhatsApp ({WHATSAPP_DISPLAY})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Apple-style Navbar ──────────────────────────────────────────────────
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const { isScrolled } = useScroll();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  const toggleMenu = useCallback((key: "shop" | "services") => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  }, []);

  const closeImmediately = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  // Close on route change
  useEffect(() => {
    closeImmediately();
  }, [pathname, closeImmediately]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeImmediately();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeImmediately]);

  // Close on outside click
  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        closeImmediately();
      }
    };
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [closeImmediately]);

  const isShopActive = ["/templates", "/ebooks", "/planners"].some((p) =>
    pathname.startsWith(p)
  );
  const isServicesActive = pathname.startsWith("/services");

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 w-full transition-[background-color,border-color,box-shadow] duration-200 ease-out",
          // Apple translucent header bar
          isScrolled || openDropdown
            ? "border-b border-border/40 bg-background/85 shadow-xs"
            : "border-b border-transparent bg-background/60",
          "backdrop-blur-2xl"
        )}
        style={{ WebkitBackdropFilter: "blur(24px) saturate(180%)" }}
      >
        {/* Apple 44px compact bar */}
        <div className="mx-auto flex h-[44px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <BrandLogo />
          </div>

          {/* Nav Links — Centered like Apple with explicit click trigger */}
          <nav className="hidden items-center gap-1 md:flex">
            {/* Shop Item — Click to Show */}
            <button
              type="button"
              onClick={() => toggleMenu("shop")}
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
                  openDropdown === "shop" ? "rotate-180 text-foreground" : "group-hover:text-foreground"
                )}
              />
            </button>

            {/* Services Item — Click to Show */}
            <button
              type="button"
              onClick={() => toggleMenu("services")}
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
                  openDropdown === "services" ? "rotate-180 text-foreground" : "group-hover:text-foreground"
                )}
              />
            </button>

            {/* Direct Links */}
            {[
              { label: "Blog", href: "/blog" },
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeImmediately}
                  className={cn(
                    "cursor-pointer select-none rounded-full px-3 py-1.5 text-[12px] font-normal tracking-[-0.01em] transition-all duration-150 hover:bg-muted/30 active:scale-[0.97]",
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-foreground/75 hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right utility controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CurrencyToggle />
            <ThemeToggle />

            {/* Apple-style clean CTA pill */}
            <Link
              href="/templates"
              onClick={closeImmediately}
              className="hidden md:inline-flex cursor-pointer items-center rounded-full bg-accent px-4 py-1.5 text-[12px] font-semibold text-white shadow-xs transition-[transform,background-color] duration-150 hover:bg-accent-hover active:scale-[0.96] ml-1"
            >
              Shop Now
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="cursor-pointer rounded-full p-2 text-foreground transition-colors duration-150 hover:bg-muted/30 active:scale-90 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── Full-Width Mega Menu Dropdown Panel (Shown On Click) ── */}
        <AnimatePresence>
          {openDropdown && (
            <motion.div
              key="mega-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: 0.22,
                ease: [0.23, 1, 0.32, 1], // Emil's custom ease-out curve
              }}
              className="overflow-hidden border-t border-border/30 bg-background/95 backdrop-blur-3xl shadow-xl"
              style={{ WebkitBackdropFilter: "blur(28px) saturate(180%)" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={openDropdown}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  {openDropdown === "shop" && <ShopMegaMenu onClose={closeImmediately} />}
                  {openDropdown === "services" && <ServicesMegaMenu onClose={closeImmediately} />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Dimmed backdrop scrim when mega menu is open (Apple style) */}
      <AnimatePresence>
        {openDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeImmediately}
            className="fixed inset-0 top-[44px] z-40 bg-black/25 backdrop-blur-[2px]"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile navigation drawer */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
