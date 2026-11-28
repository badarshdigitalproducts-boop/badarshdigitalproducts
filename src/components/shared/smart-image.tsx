"use client";

import Image, { type ImageProps } from "next/image";

const OPTIMIZABLE_HOSTS = [
  "images.unsplash.com",
  "lh3.googleusercontent.com",
];

function shouldBypassOptimizer(src: ImageProps["src"]): boolean {
  if (typeof src !== "string") return false;
  if (src.startsWith("/")) return false;
  if (src.startsWith("data:") || src.startsWith("blob:")) return true;
  try {
    const parsed = new URL(src);
    if (OPTIMIZABLE_HOSTS.includes(parsed.hostname)) return false;
    if (
      parsed.hostname.endsWith(".r2.cloudflarestorage.com") ||
      parsed.hostname.endsWith(".firebasestorage.app")
    ) {
      return false;
    }
    return true;
  } catch {
    return true;
  }
}

export function SmartImage({ src, alt, unoptimized, ...rest }: ImageProps) {
  const safeBypass = unoptimized ?? shouldBypassOptimizer(src);
  return <Image src={src} alt={alt} unoptimized={safeBypass} {...rest} />;
}
