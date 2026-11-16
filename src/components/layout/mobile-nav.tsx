"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import Link from "next/link";
import { NAV_LINKS, siteConfig } from "@/lib/constants";
import { BrandLogo } from "./brand-logo";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
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
  visible: {
    x: 0,
    transition: { type: "spring", duration: 0.38, bounce: 0.08 },
  },
  exit: {
    x: "100%",
    transition: { type: "spring", duration: 0.3, bounce: 0 },
  },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.08 + i * 0.04, duration: 0.25, ease: [0.23, 1, 0.32, 1] },
  }),
};

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

          {/* Panel with Apple-grade swipe-to-dismiss drag */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 300 }}
            dragElastic={0.08}
            onDragEnd={(_e, info) => {
              if (info.offset.x > 80 || info.velocity.x > 300) {
                onClose();
              }
            }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-background/95 border-l border-border/40 shadow-2xl backdrop-blur-2xl touch-pan-y"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
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

            {/* Links */}
            <nav className="flex-1 overflow-y-auto px-6 py-8">
              <ul className="space-y-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    custom={i}
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block cursor-pointer rounded-lg px-4 py-3 text-2xl font-medium text-foreground transition-all duration-150 hover:bg-muted/30 hover:text-accent active:scale-[0.98]"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Bottom section */}
            <div className="border-t border-border/50 px-6 py-6">
              {/* CTA */}
              <Link
                href="/templates"
                onClick={onClose}
                className="mb-6 block cursor-pointer rounded-full bg-accent px-6 py-3 text-center font-semibold text-white shadow-xs transition-[transform,background-color] duration-150 hover:bg-accent-hover active:scale-[0.97]"
              >
                Get Started
              </Link>

              {/* Social links */}
              <div className="flex items-center justify-center gap-4">
                <a
                  href={siteConfig.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer rounded-full p-2 text-muted transition-colors duration-200 hover:text-foreground"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
                <a
                  href={siteConfig.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer rounded-full p-2 text-muted transition-colors duration-200 hover:text-foreground"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="h-5 w-5" />
                </a>
                <a
                  href={siteConfig.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer rounded-full p-2 text-muted transition-colors duration-200 hover:text-foreground"
                  aria-label="WhatsApp"
                >
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
