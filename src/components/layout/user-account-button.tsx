"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/auth-context";

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

  /* Signed out — simple text link */
  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-[13px] text-foreground/60 transition-colors hover:text-foreground"
        aria-label="Sign in"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    );
  }

  const initial = (user.displayName || user.email || "U").charAt(0).toUpperCase();

  const handleSignOut = async () => {
    setOpen(false);
    await logout();
    router.push("/");
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center gap-1.5 text-foreground/70 transition-colors hover:text-foreground"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Account menu"
      >
        {/* Avatar */}
        <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-foreground/10 text-xs font-medium text-foreground">
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
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-background shadow-md"
          >
            {/* User info */}
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-medium text-foreground truncate">
                {user.displayName || "Account"}
              </p>
              <p className="text-xs text-foreground/50 truncate">{user.email}</p>
            </div>

            {/* Links */}
            <div className="py-1">
              <Link
                href="/bundles"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-[13px] text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                My Library
              </Link>
              <Link
                href="/templates"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-[13px] text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                Templates
              </Link>
            </div>

            {/* Sign out */}
            <div className="border-t border-border py-1">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-[13px] text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
