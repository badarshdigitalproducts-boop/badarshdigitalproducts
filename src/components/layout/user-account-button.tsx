"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  FolderLock,
  Sparkles,
  ChevronDown,
  Layers,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getWhatsAppUrl } from "@/lib/utils";

export function UserAccountButton() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 rounded-full border border-card-border/80 bg-card/60 px-3.5 py-1.5 text-xs font-semibold text-foreground/90 backdrop-blur-sm transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent active:scale-95"
      >
        <User className="h-3.5 w-3.5 text-muted" />
        <span>Sign In</span>
      </Link>
    );
  }

  const initial = (user.displayName || user.email || "C").charAt(0).toUpperCase();

  const handleSignOut = async () => {
    setMenuOpen(false);
    await logout();
    router.push("/");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-1.5 rounded-full border border-card-border/80 bg-card/80 p-1 pr-2.5 text-xs font-semibold text-foreground backdrop-blur-sm transition-all hover:border-accent/40 active:scale-95 cursor-pointer"
        aria-expanded={menuOpen}
      >
        {/* Avatar Circle */}
        <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white font-bold text-xs shadow-xs overflow-hidden">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{initial}</span>
          )}
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-card" />
        </div>

        <span className="max-w-[85px] truncate text-[11px] font-medium hidden sm:inline-block">
          {user.displayName?.split(" ")[0] || "Creator"}
        </span>

        <ChevronDown className="h-3 w-3 text-muted" />
      </button>

      {/* Floating User Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-card-border/80 bg-card/95 p-2 shadow-2xl backdrop-blur-2xl z-50 overflow-hidden"
          >
            {/* User Profile Header */}
            <div className="p-2.5 border-b border-card-border/60">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white font-bold text-sm overflow-hidden">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-xs font-bold text-foreground truncate">
                    {user.displayName || "BADARSH Creator"}
                  </p>
                  <p className="text-[10px] text-muted truncate">{user.email}</p>
                </div>
              </div>

              {user.isDemo && (
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold text-amber-400">
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>DEMO CREATOR MODE</span>
                </div>
              )}
            </div>

            {/* Menu Links */}
            <div className="py-1 space-y-0.5 text-left text-xs">
              <Link
                href="/bundles"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-foreground/90 hover:bg-muted/40 hover:text-foreground transition-colors"
              >
                <FolderLock className="h-4 w-4 text-accent" />
                <span>My Library &amp; Bundles</span>
              </Link>

              <Link
                href="/templates"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-foreground/90 hover:bg-muted/40 hover:text-foreground transition-colors"
              >
                <Layers className="h-4 w-4 text-purple-400" />
                <span>All Templates &amp; Assets</span>
              </Link>

              <a
                href={getWhatsAppUrl("Hello BADARSH team, I need assistance with my creator account and downloads.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-foreground/90 hover:bg-muted/40 hover:text-foreground transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                <span>Priority WhatsApp Help</span>
              </a>
            </div>

            {/* Sign Out */}
            <div className="pt-1 mt-1 border-t border-card-border/60">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
