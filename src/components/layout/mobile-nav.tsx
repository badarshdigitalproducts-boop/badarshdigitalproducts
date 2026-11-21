"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import { SHOP_MENU, SERVICES_MENU, siteConfig } from "@/lib/constants";
import { BrandLogo } from "./brand-logo";
import { useAuth } from "@/context/auth-context";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user, logout } = useAuth();
  const [shopOpen, setShopOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

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
              <div className="border-b border-border px-5 py-4">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground/10 text-sm font-medium text-foreground">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span>{(user.displayName || user.email || "U").charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.displayName || "Account"}
                        </p>
                        <p className="text-xs text-foreground/50 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); onClose(); }}
                      className="cursor-pointer text-xs text-foreground/50 transition-colors hover:text-foreground"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="flex-1 rounded-md bg-foreground py-2.5 text-center text-sm font-medium text-background transition-opacity hover:opacity-80"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={onClose}
                      className="flex-1 rounded-md border border-border py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="px-5 py-3">
                {/* Shop accordion */}
                <button
                  onClick={() => setShopOpen((p) => !p)}
                  className="flex w-full cursor-pointer items-center justify-between py-3 text-sm font-medium text-foreground"
                >
                  Shop
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
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-2 pl-3">
                        {SHOP_MENU.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className="block py-2 text-[13px] text-foreground/60 transition-colors hover:text-foreground"
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
                  Services
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
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-2 pl-3">
                        {SERVICES_MENU.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className="block py-2 text-[13px] text-foreground/60 transition-colors hover:text-foreground"
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
                <Link href="/templates" onClick={onClose} className="block py-3 text-sm font-medium text-foreground transition-colors hover:text-foreground/70">
                  Templates
                </Link>
                <div className="border-t border-border" />
                <Link href="/about" onClick={onClose} className="block py-3 text-sm font-medium text-foreground transition-colors hover:text-foreground/70">
                  About
                </Link>
                <div className="border-t border-border" />
                <Link href="/blog" onClick={onClose} className="block py-3 text-sm font-medium text-foreground transition-colors hover:text-foreground/70">
                  Blog
                </Link>
              </div>
            </nav>

            {/* Footer */}
            <div className="border-t border-border p-5 space-y-4">
              <Link
                href="/bundles"
                onClick={onClose}
                className="block w-full rounded-md bg-foreground py-3 text-center text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                Shop Now
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
