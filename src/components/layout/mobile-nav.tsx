"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X, ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { SHOP_MENU, SERVICES_MENU, siteConfig } from "@/lib/constants";
import { BrandLogo } from "./brand-logo";
import { cn } from "@/lib/utils";

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
    transition: { type: "spring", duration: 0.4, bounce: 0.05 },
  },
  exit: {
    x: "100%",
    transition: { type: "spring", duration: 0.3, bounce: 0 },
  },
};

function MobileGroup({
  title,
  items,
  onClose,
}: {
  title: string;
  items: readonly { label: string; href: string; desc: string }[];
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-border/40">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full cursor-pointer items-center justify-between px-6 py-3.5 text-left"
      >
        <span className="text-[15px] font-semibold text-foreground">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted transition-transform duration-200",
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
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-3">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-6 py-2.5 transition-colors duration-100 hover:bg-muted/30 active:bg-muted/50"
                >
                  <div>
                    <p className="text-[14px] font-medium text-foreground">{item.label}</p>
                    <p className="text-[12px] text-muted leading-tight">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted/50 shrink-0" />
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
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel — Apple uses a full-height right-to-left slide */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 400 }}
            dragElastic={0.06}
            onDragEnd={(_e, info) => {
              if (info.offset.x > 60 || info.velocity.x > 250) onClose();
            }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-background/97 shadow-2xl touch-pan-y"
            style={{ WebkitBackdropFilter: "blur(32px)" }}
          >
            {/* Header */}
            <div className="flex h-12 items-center justify-between border-b border-border/40 px-5">
              <div onClick={onClose} className="cursor-pointer">
                <BrandLogo />
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer rounded-full p-2 text-foreground/60 transition-colors duration-150 hover:text-foreground active:scale-90"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto">
              {/* Mega groups */}
              <MobileGroup title="Shop" items={SHOP_MENU} onClose={onClose} />
              <MobileGroup title="Services" items={SERVICES_MENU} onClose={onClose} />

              {/* Flat links */}
              <div className="border-b border-border/40">
                {[
                  { label: "Blog", href: "/blog" },
                  { label: "About", href: "/about" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center justify-between px-6 py-3.5 transition-colors duration-100 hover:bg-muted/30"
                  >
                    <span className="text-[15px] font-medium text-foreground">{link.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted/50" />
                  </Link>
                ))}
              </div>
            </nav>

            {/* Footer — CTA + social */}
            <div className="border-t border-border/40 px-5 py-5 space-y-3">
              <Link
                href="/bundles"
                onClick={onClose}
                className="block cursor-pointer rounded-full bg-accent py-3 text-center text-[15px] font-semibold text-white shadow-sm transition-[transform,background-color] duration-150 hover:opacity-90 active:scale-[0.97]"
              >
                Explore Creator Store
              </Link>
              <div className="flex items-center justify-center gap-6 pt-1">
                <a
                  href={siteConfig.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-[13px] text-muted transition-colors hover:text-foreground"
                >
                  Instagram
                </a>
                <a
                  href={siteConfig.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="text-[13px] text-muted transition-colors hover:text-foreground"
                >
                  YouTube
                </a>
                <a
                  href={siteConfig.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="text-[13px] text-muted transition-colors hover:text-foreground"
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
