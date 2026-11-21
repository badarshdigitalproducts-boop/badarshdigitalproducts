"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronDown,
  User,
  LogOut,
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
  MessageSquare,
  FolderLock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/constants";
import { BrandLogo } from "./brand-logo";
import { cn, getWhatsAppUrl } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", duration: 0.38, bounce: 0.05 },
  },
  exit: {
    x: "100%",
    transition: { type: "spring", duration: 0.28, bounce: 0 },
  },
};

const SHOP_ITEMS = [
  {
    label: "Mega Bundles",
    desc: "Curated 2026 digital vaults (up to 80% off)",
    href: "/bundles",
    icon: Sparkles,
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    label: "Creator Apps",
    desc: "Verified video editing software & workflow tools",
    href: "/editing-apps",
    icon: Smartphone,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    label: "Sound FX & BG Music",
    desc: "Master audio tracks & 4K motion overlays",
    href: "/editing-bundles",
    icon: Music,
    color: "text-purple-400 bg-purple-500/10",
  },
  {
    label: "Lightroom Presets",
    desc: "1-click mobile & desktop photo presets",
    href: "/photo-presets",
    icon: Camera,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    label: "Design Templates",
    desc: "Social media, Notion & Canva template packs",
    href: "/templates",
    icon: Layout,
    color: "text-cyan-500 bg-cyan-500/10",
  },
  {
    label: "Founder E-Books",
    desc: "Growth blueprints & marketing playbooks",
    href: "/ebooks",
    icon: BookOpen,
    color: "text-rose-500 bg-rose-500/10",
  },
  {
    label: "Digital Planners",
    desc: "Productivity, gym, diet & finance PDF systems",
    href: "/planners",
    icon: Calendar,
    color: "text-amber-500 bg-amber-500/10",
  },
];

const SERVICES_ITEMS = [
  {
    label: "Video Editing",
    desc: "Reels, Shorts, YouTube & social ads pacing",
    href: "/services/video-editing",
    icon: Film,
    color: "text-purple-400 bg-purple-500/10",
  },
  {
    label: "Photo Retouching",
    desc: "High-end portrait & product photography edits",
    href: "/services/photo-editing",
    icon: ImageIcon,
    color: "text-pink-400 bg-pink-500/10",
  },
  {
    label: "Social Media Management",
    desc: "Full monthly content production & visual systems",
    href: "/services/social-media-management",
    icon: Share2,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    label: "Website Design & Dev",
    desc: "Modern Next.js websites (₹3,000 to ₹15,000+)",
    href: "/services/website-design",
    icon: Globe,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    label: "App Development",
    desc: "Native & mobile web apps for modern brands",
    href: "/services/app-development",
    icon: Code2,
    color: "text-cyan-500 bg-cyan-500/10",
  },
  {
    label: "Brand Identity & Logos",
    desc: "Distinctive logo design & brand style tokens",
    href: "/services/brand-identity",
    icon: Palette,
    color: "text-amber-500 bg-amber-500/10",
  },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user, logout } = useAuth();
  const [shopExpanded, setShopExpanded] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-over panel (Apple / Microsoft acrylic material) */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-background/95 border-l border-border/60 shadow-2xl backdrop-blur-2xl touch-pan-y"
            style={{ WebkitBackdropFilter: "blur(32px) saturate(180%)" }}
          >
            {/* Header */}
            <div className="flex h-14 items-center justify-between border-b border-border/50 px-5">
              <div onClick={onClose} className="cursor-pointer">
                <BrandLogo />
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer rounded-full p-2 text-foreground/70 transition-colors duration-150 hover:bg-muted/40 hover:text-foreground active:scale-90"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Nav Content */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {/* ─── Prominent Creator Account Section ─── */}
              {user ? (
                /* Logged In User Card */
                <div className="rounded-2xl border border-border/80 bg-muted/20 p-3.5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white font-bold text-sm shadow-xs overflow-hidden">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>
                          {(user.displayName || user.email || "C").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-foreground truncate">
                          {user.displayName || "Creator"}
                        </p>
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-bold text-emerald-500 shrink-0">
                          Verified
                        </span>
                      </div>
                      <p className="text-[11px] text-muted truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="mt-3.5 flex items-center gap-2 pt-3 border-t border-border/40">
                    <Link
                      href="/bundles"
                      onClick={onClose}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-accent-hover transition-colors"
                    >
                      <FolderLock className="h-3.5 w-3.5" />
                      <span>My Library</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className="flex items-center justify-center gap-1 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Logged Out: Apple-grade Account Vault Card */
                <div className="rounded-2xl border border-accent/25 bg-gradient-to-b from-accent/10 via-background to-muted/20 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-1">
                        <span>Creator Vault Account</span>
                        <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                      </h4>
                      <p className="text-[11px] text-muted leading-relaxed mt-0.5">
                        Sign in to access your digital downloads, bundles &amp; invoices.
                      </p>
                    </div>
                  </div>

                  <div className="mt-3.5 grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="flex items-center justify-center gap-1 rounded-xl bg-accent px-3 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-accent-hover transition-colors text-center"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <Link
                      href="/signup"
                      onClick={onClose}
                      className="flex items-center justify-center rounded-xl border border-border bg-background/80 hover:bg-background px-3 py-2.5 text-xs font-semibold text-foreground transition-colors text-center"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              )}

              {/* ─── Navigation Groups ─── */}
              <div className="space-y-1">
                {/* 1. Shop Accordion */}
                <div className="rounded-xl border border-border/50 overflow-hidden bg-card/40">
                  <button
                    onClick={() => setShopExpanded((e) => !e)}
                    className="flex w-full cursor-pointer items-center justify-between p-3.5 text-left transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-foreground">
                        Shop Digital Products
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted transition-transform duration-200",
                        shopExpanded ? "rotate-180" : ""
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {shopExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden border-t border-border/40"
                      >
                        <div className="p-2 space-y-1">
                          {SHOP_ITEMS.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/40"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div
                                    className={cn(
                                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                                      item.color
                                    )}
                                  >
                                    <Icon className="h-3.5 w-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-foreground">
                                      {item.label}
                                    </p>
                                    <p className="text-[10px] text-muted truncate">
                                      {item.desc}
                                    </p>
                                  </div>
                                </div>
                                <ChevronRight className="h-3.5 w-3.5 text-muted/60 shrink-0 ml-1" />
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. Services Accordion */}
                <div className="rounded-xl border border-border/50 overflow-hidden bg-card/40">
                  <button
                    onClick={() => setServicesExpanded((e) => !e)}
                    className="flex w-full cursor-pointer items-center justify-between p-3.5 text-left transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                        <Globe className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-foreground">
                        Creative Services
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted transition-transform duration-200",
                        servicesExpanded ? "rotate-180" : ""
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {servicesExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden border-t border-border/40"
                      >
                        <div className="p-2 space-y-1">
                          {SERVICES_ITEMS.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/40"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div
                                    className={cn(
                                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                                      item.color
                                    )}
                                  >
                                    <Icon className="h-3.5 w-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-foreground">
                                      {item.label}
                                    </p>
                                    <p className="text-[10px] text-muted truncate">
                                      {item.desc}
                                    </p>
                                  </div>
                                </div>
                                <ChevronRight className="h-3.5 w-3.5 text-muted/60 shrink-0 ml-1" />
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. Direct Links */}
                <div className="pt-2 space-y-1">
                  {[
                    { label: "Design Templates", href: "/templates", icon: Layout },
                    { label: "Studio Blog & Insights", href: "/blog", icon: BookOpen },
                    { label: "About BADARSH", href: "/about", icon: Sparkles },
                  ].map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className="flex items-center justify-between rounded-xl p-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4 text-muted" />
                          <span>{link.label}</span>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted/50" />
                      </Link>
                    );
                  })}

                  {/* WhatsApp Support Row */}
                  <a
                    href={getWhatsAppUrl("Hi BADARSH! I'm reaching out from the mobile site.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex items-center justify-between rounded-xl p-3 text-sm font-medium text-emerald-500 transition-colors hover:bg-emerald-500/10"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <MessageSquare className="h-4 w-4" />
                      <span>Founder WhatsApp Desk</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-emerald-500/60" />
                  </a>
                </div>
              </div>
            </nav>

            {/* Footer — CTA & Social */}
            <div className="border-t border-border/50 p-4 space-y-3 bg-muted/10">
              <Link
                href="/bundles"
                onClick={onClose}
                className="block w-full rounded-full bg-accent py-3 text-center text-sm font-bold text-white shadow-sm transition-all hover:bg-accent-hover active:scale-[0.98]"
              >
                Explore Creator Store
              </Link>
              <div className="flex items-center justify-center gap-6 pt-1 text-xs text-muted">
                <a
                  href={siteConfig.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Instagram
                </a>
                <span>&bull;</span>
                <a
                  href={siteConfig.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  YouTube
                </a>
                <span>&bull;</span>
                <a
                  href={siteConfig.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
