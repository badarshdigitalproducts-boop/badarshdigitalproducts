"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center",
        className
      )}
    >
      {badge && (
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            {badge}
          </span>
        </div>
      )}
      <h2
        className={cn(
          "apple-title text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl",
          badge && "mt-1"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "apple-subhead mt-4 text-base md:text-lg text-muted",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
