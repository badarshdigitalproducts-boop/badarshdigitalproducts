"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  variant?: "full" | "icon";
  className?: string;
  showSubtitle?: boolean;
}

export function BrandLogo({
  variant = "full",
  className,
}: BrandLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR or before mount, default to light theme (dark logo on white background)
  const isDark = mounted && resolvedTheme === "dark";

  if (variant === "icon") {
    return (
      <Link
        href="/"
        className={cn(
          "group relative inline-flex items-center gap-2 transition-transform duration-300 hover:scale-105",
          className
        )}
        aria-label="BADARSH Home"
      >
        <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-tr from-accent/15 via-amber-500/10 to-transparent p-1 border border-border/60 shadow-xs backdrop-blur-md">
          {/* Light Theme: Dark Emblem (/logo-icon-dark-v3.png) | Dark Theme: White Emblem (/logo-icon-light-v3.png) */}
          <Image
            src={isDark ? "/logo-icon-light-v3.png" : "/logo-icon-dark-v3.png"}
            alt="BADARSH Emblem"
            width={512}
            height={512}
            className="h-full w-full object-contain"
            priority
            unoptimized
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={cn(
        "group relative flex items-center transition-all duration-300 hover:opacity-90",
        className
      )}
      aria-label="BADARSH Home"
    >
      <div className="relative h-8 w-auto min-w-[140px] max-w-[210px] sm:h-9 sm:max-w-[230px] md:h-10 md:max-w-[245px]">
        {/* Light Theme: Dark Logo on White background | Dark Theme: White Logo on Black background */}
        <Image
          src={isDark ? "/logo-white-v3.png" : "/logo-dark-v3.png"}
          alt="BADARSH — Digital Products & Creative Studio"
          width={1432}
          height={319}
          className="h-full w-auto object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
          priority
          unoptimized
        />
      </div>
    </Link>
  );
}

