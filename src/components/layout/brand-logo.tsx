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
        <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-tr from-accent/20 to-amber-500/20 p-1 border border-card-border/60 shadow-sm backdrop-blur-md">
          <Image
            src="/logo-icon.png"
            alt="BADARSH Emblem"
            width={72}
            height={72}
            className="h-full w-full object-contain"
            priority
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
      {/* Light Mode Logo (Dark Text + Gold Arrow) */}
      <div className="relative h-8 w-auto min-w-[140px] max-w-[200px] sm:h-9 sm:max-w-[220px] dark:hidden">
        <Image
          src="/logo-dark.png"
          alt="BADARSH — Digital Marketing"
          width={828}
          height={180}
          className="h-full w-auto object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
          priority
        />
      </div>

      {/* Dark Mode Logo (White Text + Gold Arrow) */}
      <div className="relative hidden h-8 w-auto min-w-[140px] max-w-[200px] sm:h-9 sm:max-w-[220px] dark:block">
        <Image
          src="/logo-white.png"
          alt="BADARSH — Digital Marketing"
          width={828}
          height={180}
          className="h-full w-auto object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
          priority
        />
      </div>
    </Link>
  );
}
