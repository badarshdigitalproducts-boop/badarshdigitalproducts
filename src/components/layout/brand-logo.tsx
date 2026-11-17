"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  variant?: "full" | "icon";
  className?: string;
  showSubtitle?: boolean;
}

export function BrandLogo({
  variant = "full",
  className,
  showSubtitle = true,
}: BrandLogoProps) {
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
          {/* Light Mode Icon (Obsidian Navy Emblem + Electric Coral Arrow) */}
          <Image
            src="/logo-icon-dark-v3.png"
            alt="BADARSH Emblem"
            width={512}
            height={512}
            className="h-full w-full object-contain dark:hidden"
            priority
            unoptimized
          />
          {/* Dark Mode Icon (Diamond White Emblem + Electric Coral Arrow) */}
          <Image
            src="/logo-icon-light-v3.png"
            alt="BADARSH Emblem"
            width={512}
            height={512}
            className="hidden h-full w-full object-contain dark:block"
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
      {/* Light Mode Logo (Midnight Navy Typography + Coral Arrow + Slate Tagline) */}
      <div className="relative h-8 w-auto min-w-[140px] max-w-[210px] sm:h-9 sm:max-w-[230px] md:h-10 md:max-w-[245px] dark:hidden">
        <Image
          src="/logo-dark-v3.png"
          alt="BADARSH — Digital Marketing"
          width={1432}
          height={319}
          className="h-full w-auto object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
          priority
          unoptimized
        />
      </div>

      {/* Dark Mode Logo (Diamond White Typography + Coral Arrow + Platinum Tagline) */}
      <div className="relative hidden h-8 w-auto min-w-[140px] max-w-[210px] sm:h-9 sm:max-w-[220px] md:h-10 md:max-w-[245px] dark:block">
        <Image
          src="/logo-white-v3.png"
          alt="BADARSH — Digital Marketing"
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

