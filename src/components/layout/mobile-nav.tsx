"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X, MessageCircle, ChevronDown } from "lucide-react";
import Link from "next/link";
import { SHOP_MENU, SERVICES_MENU, siteConfig } from "@/lib/constants";
import { BrandLogo } from "./brand-logo";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "spring", duration: 0.38, bounce: 0.08 } },
  exit: { x: "100%", transition: { type: "spring", duration: 0.3, bounce: 0 } },
};

function MobileSection({
  title,
  items,
  onClose,
}: {
  title: string;
  items: readonly { label: string; href: string; desc: string; icon: string }[];
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border-b border-border/40 pb-3">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full cursor-pointer items-center justify-between px-1 py-2.5 text-xs font-bold uppercase tracking-widest text-muted"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            expanded ? "rotate-180" : ""
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-xl p-3 transition-all duration-150 hover:bg-muted/30 active:scale-[0.98]"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
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
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 300 }}
            dragElastic={0.08}
            onDragEnd={(_e, info) => {
              if (info.offset.x > 80 || info.velocity.x > 300) onClose();
            }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-background/95 border-l border-border/40 shadow-2xl backdrop-blur-2xl touch-pan-y"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
              <div onClick={onClose}>
                <BrandLogo variant="full" />
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer rounded-full p-2 transition-[transform,background-color] duration-150 hover:bg-muted/30 active:scale-90"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>
            </div>

            {/* Nav Content */}
            <nav className="flex-1 overflow-y-auto px-5 py-5 space-y-1">
              <MobileSection title="Shop" items={SHOP_MENU} onClose={onClose} />
              <MobileSection title="Services" items={SERVICES_MENU} onClose={onClose} />

              {/* Flat links */}
              <div className="pt-2 space-y-0.5">
                {[
                  { label: "Blog", href: "/blog" },
                  { label: "About", href: "/about" },
                  { label: "Contact", href: "/contact" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="block cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-150 hover:bg-muted/30 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Bottom */}
            <div className="border-t border-border/50 px-5 py-5">
              <Link
                href="/templates"
                onClick={onClose}
                className="mb-5 block cursor-pointer rounded-full bg-accent px-6 py-3 text-center font-semibold text-white shadow-xs transition-[transform,background-color] duration-150 hover:bg-accent-hover active:scale-[0.97]"
              >
                Shop All Products
              </Link>

              <div className="flex items-center justify-center gap-4">
                <a href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer" className="cursor-pointer rounded-full p-2 text-muted transition-colors hover:text-foreground" aria-label="Instagram">
                  <InstagramIcon className="h-5 w-5" />
                </a>
                <a href={siteConfig.links.youtube} target="_blank" rel="noopener noreferrer" className="cursor-pointer rounded-full p-2 text-muted transition-colors hover:text-foreground" aria-label="YouTube">
                  <YoutubeIcon className="h-5 w-5" />
                </a>
                <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer" className="cursor-pointer rounded-full p-2 text-muted transition-colors hover:text-foreground" aria-label="WhatsApp">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
