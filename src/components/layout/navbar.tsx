"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SHOP_MENU, SERVICES_MENU } from "@/lib/constants";
import { useScroll } from "@/hooks/use-scroll";
import { ThemeToggle } from "./theme-toggle";
import { CurrencyToggle } from "./currency-toggle";
import { MobileNav } from "./mobile-nav";
import { BrandLogo } from "./brand-logo";

type DropdownKey = "shop" | "services" | null;

function MegaDropdown({
  items,
  isOpen,
}: {
  items: readonly { label: string; href: string; desc: string; icon: string }[];
  isOpen: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ type: "spring", duration: 0.25, bounce: 0.1 }}
          className="absolute top-full left-1/2 z-50 mt-2 w-[480px] -translate-x-1/2 overflow-hidden rounded-2xl border border-border/60 bg-background/95 shadow-2xl backdrop-blur-2xl"
        >
          <div className="grid grid-cols-2 gap-px p-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-3 rounded-xl p-3 transition-all duration-150 hover:bg-muted/50 active:scale-[0.98]"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-base transition-transform duration-150 group-hover:scale-110">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                    {item.label}
                    <ArrowRight className="h-3 w-3 translate-x-0 opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const { isScrolled } = useScroll();
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = (key: DropdownKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(key);
  };
  const startClose = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  // Close on route change
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  const isShopActive = ["/templates", "/ebooks", "/planners"].some((p) =>
    pathname.startsWith(p)
  );
  const isServicesActive = pathname.startsWith("/services");

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-200 ease-out",
          isScrolled
            ? "border-border/50 bg-background/80 shadow-xs"
            : "border-transparent bg-background/60"
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <BrandLogo />

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {/* SHOP Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openMenu("shop")}
              onMouseLeave={startClose}
            >
              <button
                onFocus={() => openMenu("shop")}
                onBlur={startClose}
                className={cn(
                  "flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                  isShopActive || openDropdown === "shop"
                    ? "text-accent"
                    : "text-muted hover:text-foreground"
                )}
                aria-expanded={openDropdown === "shop"}
                aria-haspopup="true"
              >
                Shop
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    openDropdown === "shop" ? "rotate-180" : ""
                  )}
                />
              </button>
              <div
                onMouseEnter={cancelClose}
                onMouseLeave={startClose}
                className="absolute left-1/2 top-full -translate-x-1/2"
              >
                <MegaDropdown items={SHOP_MENU} isOpen={openDropdown === "shop"} />
              </div>
            </div>

            {/* SERVICES Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openMenu("services")}
              onMouseLeave={startClose}
            >
              <button
                onFocus={() => openMenu("services")}
                onBlur={startClose}
                className={cn(
                  "flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                  isServicesActive || openDropdown === "services"
                    ? "text-accent"
                    : "text-muted hover:text-foreground"
                )}
                aria-expanded={openDropdown === "services"}
                aria-haspopup="true"
              >
                Services
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    openDropdown === "services" ? "rotate-180" : ""
                  )}
                />
              </button>
              <div
                onMouseEnter={cancelClose}
                onMouseLeave={startClose}
                className="absolute left-1/2 top-full -translate-x-1/2"
              >
                <MegaDropdown items={SERVICES_MENU} isOpen={openDropdown === "services"} />
              </div>
            </div>

            {/* Flat links */}
            {[
              { label: "Blog", href: "/blog" },
              { label: "About", href: "/about" },
            ].map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                    isActive ? "text-accent" : "text-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navActiveIndicator"
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent"
                      transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <CurrencyToggle />
            <ThemeToggle />

            {/* CTA */}
            <Link
              href="/templates"
              className="hidden cursor-pointer items-center rounded-full bg-accent px-5 py-1.5 text-sm font-semibold text-white shadow-xs transition-[transform,background-color] duration-150 hover:bg-accent-hover active:scale-[0.96] md:inline-flex"
            >
              Shop Now
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="cursor-pointer rounded-full p-2 transition-[transform,background-color] duration-150 hover:bg-muted/30 active:scale-90 active:bg-muted/50 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile navigation overlay */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
