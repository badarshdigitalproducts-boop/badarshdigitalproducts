"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { useScroll } from "@/hooks/use-scroll";
import { ThemeToggle } from "./theme-toggle";
import { CurrencyToggle } from "./currency-toggle";
import { MobileNav } from "./mobile-nav";
import { BrandLogo } from "./brand-logo";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isScrolled } = useScroll();
  const pathname = usePathname();

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
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <BrandLogo />

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative cursor-pointer px-3.5 py-2 text-sm font-medium transition-colors duration-150 active:scale-[0.97]",
                    isActive
                      ? "text-accent"
                      : "text-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                  {/* Apple-grade spring layout underline */}
                  {isActive && (
                    <motion.div
                      layoutId="navActiveIndicator"
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent shadow-xs"
                      transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <CurrencyToggle />
            <ThemeToggle />

            {/* CTA — desktop only with tactile press feedback */}
            <Link
              href="/templates"
              className="hidden cursor-pointer items-center rounded-full bg-accent px-6 py-2 text-sm font-semibold text-white shadow-xs transition-[transform,background-color] duration-150 hover:bg-accent-hover active:scale-[0.96] md:inline-flex"
            >
              Get Started
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
