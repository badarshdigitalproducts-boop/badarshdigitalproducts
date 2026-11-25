"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, LogOut, FolderLock, Sparkles, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { SHOP_MENU, SERVICES_MENU, siteConfig } from "@/lib/constants";
import { BrandLogo } from "./brand-logo";
import { CurrencyToggle } from "./currency-toggle";
import { useAuth } from "@/context/auth-context";
import { getWhatsAppUrl } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user, logout } = useAuth();
  const [shopOpen, setShopOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Creator";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.02 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border bg-background"
          >
            {/* Header */}
            <div className="flex h-12 items-center justify-between border-b border-border px-5">
              <div onClick={onClose} className="cursor-pointer">
                <BrandLogo />
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer rounded-md p-2 text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <nav className="flex-1 overflow-y-auto">
              {/* Account section */}
              <div className="border-b border-border p-4">
                {user ? (
                  /* Signed-In User Card */
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground text-sm font-semibold text-background">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>{initial}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {displayName}
                          </p>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" title="Active" />
                        </div>
                        <p className="truncate text-xs text-foreground/50">{user.email}</p>
                        <p className="truncate font-mono text-[10px] text-foreground/45 mt-0.5">
                          ID: {user.uid}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                      <Link
                        href="/account"
                        onClick={onClose}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-foreground py-2.5 text-xs font-medium text-background transition-opacity hover:opacity-85"
                      >
                        <FolderLock className="h-3.5 w-3.5" />
                        <span>Account &amp; Library</span>
                      </Link>
                      <button
                        onClick={async () => {
                          await logout();
                          onClose();
                        }}
                        className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-background py-2 text-xs font-medium text-rose-500 transition-colors hover:bg-rose-500/10"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Signed-Out Prompt */
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-foreground/60" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                        Creator Account
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/login"
                        onClick={onClose}
                        className="flex items-center justify-center rounded-lg bg-foreground py-2 text-xs font-medium text-background transition-opacity hover:opacity-85 text-center"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        onClick={onClose}
                        className="flex items-center justify-center rounded-lg border border-border bg-background py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted text-center"
                      >
                        Create Account
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation list */}
              <div className="px-5 py-2">
                {/* Shop accordion */}
                <button
                  onClick={() => setShopOpen((p) => !p)}
                  className="flex w-full cursor-pointer items-center justify-between py-3 text-sm font-medium text-foreground"
                >
                  <span>Shop</span>
                  <ChevronDown
                    className={`h-4 w-4 text-foreground/40 transition-transform duration-150 ${shopOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {shopOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-2 pl-3 space-y-1">
                        {SHOP_MENU.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className="block py-1.5 text-[13px] text-foreground/60 transition-colors hover:text-foreground"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="border-t border-border" />

                {/* Services accordion */}
                <button
                  onClick={() => setServicesOpen((p) => !p)}
                  className="flex w-full cursor-pointer items-center justify-between py-3 text-sm font-medium text-foreground"
                >
                  <span>Services</span>
                  <ChevronDown
                    className={`h-4 w-4 text-foreground/40 transition-transform duration-150 ${servicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {servicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-2 pl-3 space-y-1">
                        {SERVICES_MENU.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className="block py-1.5 text-[13px] text-foreground/60 transition-colors hover:text-foreground"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="border-t border-border" />

                {/* Direct links */}
                <Link
                  href="/templates"
                  onClick={onClose}
                  className="block py-3 text-sm font-medium text-foreground transition-colors hover:text-foreground/70"
                >
                  Templates
                </Link>
                <div className="border-t border-border" />
                <Link
                  href="/about"
                  onClick={onClose}
                  className="block py-3 text-sm font-medium text-foreground transition-colors hover:text-foreground/70"
                >
                  About
                </Link>
                <div className="border-t border-border" />
                <Link
                  href="/blog"
                  onClick={onClose}
                  className="block py-3 text-sm font-medium text-foreground transition-colors hover:text-foreground/70"
                >
                  Blog
                </Link>
                <div className="border-t border-border" />

                {/* WhatsApp Support Row */}
                <a
                  href={getWhatsAppUrl("Hi BADARSH! I'm reaching out from the mobile site.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="flex items-center gap-2 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp Founder Desk</span>
                </a>
              </div>
            </nav>

            {/* Footer */}
            <div className="border-t border-border p-4 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs text-foreground/60 font-medium">Currency</span>
                <CurrencyToggle />
              </div>
              <Link
                href="/bundles"
                onClick={onClose}
                className="block w-full rounded-lg bg-foreground py-2.5 text-center text-xs font-semibold text-background transition-opacity hover:opacity-85"
              >
                Shop All Digital Assets
              </Link>
              <div className="flex items-center justify-center gap-5 text-xs text-foreground/40">
                <a href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">Instagram</a>
                <a href={siteConfig.links.youtube} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">YouTube</a>
                <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">WhatsApp</a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
