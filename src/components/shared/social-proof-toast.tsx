"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioPlayer } from "@/context/audio-player-context";

interface SocialActivity {
  name: string;
  city: string;
  item: string;
  time: string;
  type: "purchase" | "download" | "booking";
}

const activities: SocialActivity[] = [
  {
    name: "Priya S.",
    city: "Mumbai",
    item: "Instagram Reels Template Pack",
    time: "3 mins ago",
    type: "purchase",
  },
  {
    name: "Arjun M.",
    city: "Bengaluru",
    item: "LinkedIn Carousel Templates",
    time: "7 mins ago",
    type: "purchase",
  },
  {
    name: "Sneha R.",
    city: "Hyderabad",
    item: "10 Free Viral Templates",
    time: "2 mins ago",
    type: "download",
  },
  {
    name: "Rohit A.",
    city: "Delhi NCR",
    item: "Website Building Consultation",
    time: "14 mins ago",
    type: "booking",
  },
  {
    name: "Vikram K.",
    city: "Pune",
    item: "Ultimate Pitch Deck Template",
    time: "9 mins ago",
    type: "purchase",
  },
];

export function SocialProofToast() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { currentTrack } = useAudioPlayer();

  useEffect(() => {
    if (dismissed) return;

    // Show first toast after 4s
    const firstTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    // Loop through notifications
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % activities.length);
        setVisible(true);
      }, 800);
    }, 12000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [dismissed]);

  if (dismissed) return null;

  const current = activities[index];

  return (
    <div
      className={cn(
        "fixed left-6 z-40 max-w-sm pointer-events-none sm:max-w-md transition-all duration-300",
        currentTrack ? "bottom-24" : "bottom-6"
      )}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.38, bounce: 0.15 }}
            drag="x"
            dragConstraints={{ left: -100, right: 100 }}
            dragElastic={0.2}
            onDragEnd={(_e, info) => {
              if (Math.abs(info.offset.x) > 60 || Math.abs(info.velocity.x) > 200) {
                setDismissed(true);
              }
            }}
            className="pointer-events-auto flex items-center gap-3.5 rounded-2xl border border-card-border/80 bg-card/95 p-3.5 pr-4 shadow-xl backdrop-blur-2xl cursor-grab active:cursor-grabbing touch-pan-y"
          >
            {/* Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <Sparkles className="h-5 w-5" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-xs font-semibold text-foreground truncate">
                <span className="font-bold text-accent">{current.name}</span> from {current.city}
              </p>
              <p className="text-[11px] text-muted truncate">
                {current.type === "purchase" ? "Purchased" : current.type === "download" ? "Downloaded" : "Booked"}:{" "}
                <span className="font-medium text-foreground">{current.item}</span>
              </p>
              <span className="text-[10px] text-muted/70">{current.time}</span>
            </div>

            {/* Close */}
            <button
              onClick={() => setDismissed(true)}
              className="cursor-pointer text-muted hover:text-foreground active:scale-90 transition-transform p-1"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

