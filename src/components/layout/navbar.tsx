"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { SHOP_MENU, SERVICES_MENU } from "@/lib/constants";
import { ThemeToggle } from "./theme-toggle";
import { CurrencyToggle } from "./currency-toggle";
import { UserAccountButton } from "./user-account-button";
import { MobileNav } from "./mobile-nav";
import { BrandLogo } from "./brand-logo";

type DropdownKey = "shop" | "services" | null;

/* ── Minimal text-only dropdown (apple.com style) ─────────────────────────── */
function DropdownPanel({
  items,
  onClose,
}: {
  items: ReadonlyArray<{ label: string; href: string; desc: string }>;
  onClose: () => void;
}) {
  return (
    <div className="w-56 py-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClose}
          className="block px-4 py-2 text-[13px] text-foreground/80 transition-colors duration-100 hover:bg-muted hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

/* ── Main Navbar ──────────────────────────────────────────────────────────── */
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const { isScrolled } = useScroll();
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleEnter = (key: "shop" | "services") => {
    clearTimer();
    setOpenDropdown(key);
  };

  const handleLeave = () => {
    timerRef.current = setTimeout(() => setOpenDropdown(null), 160);
  };

  const handleDropdownEnter = () => clearTimer();
  const handleDropdownLeave = () => handleLeave();

  const close = useCallback(() => {
    clearTimer();
    setOpenDropdown(null);
  }, []);

  /* Close on route change */
  useEffect(() => { close(); }, [pathname, close]);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  /* Close on click outside */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [close]);

  const isShopActive = ["/bundles", "/editing-apps", "/photo-presets", "/editing-bundles", "/ebooks", "/planners", "/templates"].some((p) => pathname.startsWith(p));
  const isServicesActive = pathname.startsWith("/services");

  /* Shared link style */
  const linkCls = (active: boolean) =>
    cn(
      "text-[13px] font-normal transition-colors duration-150",
      active ? "text-foreground" : "text-foreground/60 hover:text-foreground"
    );

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          "sticky top-0 z-50 w-full bg-background transition-shadow duration-200",
          isScrolled ? "shadow-[0_1px_0_0_var(--border)]" : "shadow-[0_1px_0_0_var(--border)]"
        )}
      >
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <BrandLogo />

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-7 md:flex">
            {/* Shop dropdown trigger */}
            <div
              className="relative"
              onMouseEnter={() => handleEnter("shop")}
              onMouseLeave={handleLeave}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown((p) => (p === "shop" ? null : "shop"))}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1 select-none",
                  linkCls(isShopActive || openDropdown === "shop")
                )}
                aria-expanded={openDropdown === "shop"}
                aria-haspopup="true"
              >
                Shop
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-150",
                    openDropdown === "shop" && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {openDropdown === "shop" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.12 }}
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                    className="absolute left-0 top-full z-50 pt-2"
                  >
                    <div className="rounded-lg border border-border bg-background shadow-md">
                      <DropdownPanel items={SHOP_MENU} onClose={close} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Services dropdown trigger */}
            <div
              className="relative"
              onMouseEnter={() => handleEnter("services")}
              onMouseLeave={handleLeave}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown((p) => (p === "services" ? null : "services"))}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1 select-none",
                  linkCls(isServicesActive || openDropdown === "services")
                )}
                aria-expanded={openDropdown === "services"}
                aria-haspopup="true"
              >
                Services
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-150",
                    openDropdown === "services" && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {openDropdown === "services" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.12 }}
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                    className="absolute left-0 top-full z-50 pt-2"
                  >
                    <div className="rounded-lg border border-border bg-background shadow-md">
                      <DropdownPanel items={SERVICES_MENU} onClose={close} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Direct links */}
            <Link href="/templates" className={linkCls(pathname === "/templates")}>
              Templates
            </Link>
            <Link href="/about" className={linkCls(pathname === "/about")}>
              About
            </Link>
            <Link href="/blog" className={linkCls(pathname === "/blog")}>
              Blog
            </Link>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <CurrencyToggle />
            <ThemeToggle />
            <UserAccountButton />

            <Link
              href="/bundles"
              className="hidden md:inline-flex items-center rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-opacity duration-150 hover:opacity-80"
            >
              Shop Now
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="cursor-pointer rounded-md p-2 text-foreground transition-colors hover:bg-muted md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
