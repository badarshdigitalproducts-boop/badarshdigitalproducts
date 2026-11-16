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
          {/* Light Mode Icon (Dark Obsidian Wings + Radiant Gold Arrow) */}
          <Image
            src="/logo-icon-dark-v2.png"
            alt="BADARSH Emblem"
            width={128}
            height={128}
            className="h-full w-full object-contain dark:hidden"
            priority
            unoptimized
          />
          {/* Dark Mode Icon (Platinum White Wings + Radiant Gold Arrow) */}
          <Image
            src="/logo-icon-light-v2.png"
            alt="BADARSH Emblem"
            width={128}
            height={128}
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
      {/* Light Mode Logo (Solid Obsidian Text + 3D Obsidian 'B' + Vibrant Royal Gold Arrow + Slate Subtitle) */}
      <div className="relative h-8 w-auto min-w-[140px] max-w-[210px] sm:h-9 sm:max-w-[230px] md:h-10 md:max-w-[245px] dark:hidden">
        <Image
          src="/logo-dark-v2.png"
          alt="BADARSH — Digital Marketing"
          width={1658}
          height={360}
          className="h-full w-auto object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
          priority
          unoptimized
        />
      </div>

      {/* Dark Mode Logo (Diamond White Text + Platinum 3D 'B' + Molten Gold Arrow + Silver Subtitle) */}
      <div className="relative hidden h-8 w-auto min-w-[140px] max-w-[210px] sm:h-9 sm:max-w-[220px] md:h-10 md:max-w-[245px] dark:block">
        <Image
          src="/logo-white-v2.png"
          alt="BADARSH — Digital Marketing"
          width={1658}
          height={360}
          className="h-full w-auto object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
          priority
          unoptimized
        />
      </div>
    </Link>
  );
}

