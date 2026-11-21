"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  FolderLock,
  ChevronDown,
  Layers,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
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
        className="group inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/60 hover:bg-background px-3 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-md transition-all duration-150 hover:border-foreground/30 active:scale-95 cursor-pointer shadow-2xs"
        aria-label="Sign in to your account"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted/60 text-muted group-hover:bg-accent/15 group-hover:text-accent transition-colors">
          <User className="h-3 w-3" />
        </div>
        <span className="font-semibold text-[11px] sm:text-xs">Sign In</span>
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
        className="flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 hover:bg-background p-1 pr-2.5 text-xs font-semibold text-foreground backdrop-blur-md transition-all duration-150 hover:border-foreground/30 active:scale-95 cursor-pointer shadow-2xs"
        aria-expanded={menuOpen}
        aria-haspopup="true"
        aria-label="Open user account menu"
      >
        {/* Avatar Circle */}
        <div className="relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-accent text-white font-bold text-xs shadow-xs overflow-hidden">
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

        <span className="max-w-[75px] sm:max-w-[100px] truncate text-[11px] font-medium hidden xs:inline-block sm:inline-block text-foreground/90">
          {user.displayName?.split(" ")[0] || "Account"}
        </span>

        <ChevronDown
          className={`h-3 w-3 text-muted transition-transform duration-150 ${
            menuOpen ? "rotate-180 text-foreground" : ""
          }`}
        />
      </button>

      {/* Floating User Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-border/80 bg-card/95 p-2 shadow-2xl backdrop-blur-2xl z-50 overflow-hidden"
          >
            {/* User Profile Header */}
            <div className="p-3 border-b border-border/50 bg-muted/20 rounded-xl mb-1">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white font-bold text-sm overflow-hidden shadow-xs">
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
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-foreground truncate">
                      {user.displayName || "BADARSH Creator"}
                    </p>
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-bold text-emerald-500 shrink-0">
                      Verified
                    </span>
                  </div>
                  <p className="text-[10px] text-muted truncate mt-0.5">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Links */}
            <div className="py-1 space-y-0.5 text-left text-xs">
              <Link
                href="/bundles"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-2.5 py-2 text-foreground/90 hover:bg-muted/50 hover:text-foreground transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
                    <FolderLock className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-foreground">My Digital Library</p>
                    <p className="text-[10px] text-muted">Purchased downloads &amp; assets</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/templates"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-2.5 py-2 text-foreground/90 hover:bg-muted/50 hover:text-foreground transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                    <Layers className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-foreground">All Templates &amp; Guides</p>
                    <p className="text-[10px] text-muted">Explore 100+ creative assets</p>
                  </div>
                </div>
              </Link>

              <a
                href={getWhatsAppUrl("Hello BADARSH team, I need assistance with my creator account and downloads.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-2.5 py-2 text-foreground/90 hover:bg-muted/50 hover:text-foreground transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 transition-colors">
                    <MessageCircle className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-foreground">Priority WhatsApp Help</p>
                    <p className="text-[10px] text-muted">Direct Founder &amp; Support desk</p>
                  </div>
                </div>
                <ExternalLink className="h-3 w-3 text-muted/60 mr-1" />
              </a>
            </div>

            {/* Sign Out */}
            <div className="pt-1.5 mt-1 border-t border-border/50">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
