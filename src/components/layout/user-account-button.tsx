"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown, FolderLock, Sparkles, MessageCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getWhatsAppUrl } from "@/lib/utils";

export function UserAccountButton() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Signed out state ── */
  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        aria-label="Sign in to your account"
      >
        <User className="h-3.5 w-3.5 text-foreground/70" />
        <span>Sign In</span>
      </Link>
    );
  }

  /* ── Signed in state ── */
  const displayName = user.displayName || user.email?.split("@")[0] || "Account";
  const firstName = displayName.split(" ")[0];
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    setOpen(false);
    await logout();
    router.push("/");
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Account menu"
      >
        {/* Avatar */}
        <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground text-[10px] font-semibold text-background">
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

        {/* Name */}
        <span className="max-w-[90px] truncate text-xs font-medium text-foreground">
          {firstName}
        </span>

        <ChevronDown
          className={`h-3 w-3 text-foreground/50 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-background p-1.5 shadow-lg"
          >
            {/* User profile header */}
            <div className="flex items-center gap-2.5 border-b border-border p-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground text-xs font-semibold text-background">
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
                  <p className="truncate text-xs font-semibold text-foreground">
                    {displayName}
                  </p>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" title="Active" />
                </div>
                <p className="truncate text-[11px] text-foreground/50">{user.email}</p>
                <p className="truncate font-mono text-[10px] text-foreground/45 mt-0.5">
                  ID: {user.uid}
                </p>
              </div>
            </div>

            {/* Menu links */}
            <div className="py-1">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground/80 transition-colors hover:bg-muted hover:text-foreground font-medium"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Account &amp; My Library</span>
              </Link>
              <Link
                href="/account#orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                <FolderLock className="h-3.5 w-3.5 text-foreground/60" />
                <span>Orders &amp; License Keys</span>
              </Link>
              <Link
                href="/templates"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                <Sparkles className="h-3.5 w-3.5 text-foreground/60" />
                <span>Templates & Assets</span>
              </Link>
              <a
                href={getWhatsAppUrl("Hi BADARSH! I have a question about my creator account.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>Founder Desk (WhatsApp)</span>
              </a>
            </div>

            {/* Sign out */}
            <div className="border-t border-border pt-1">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-500 transition-colors hover:bg-rose-500/10"
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
