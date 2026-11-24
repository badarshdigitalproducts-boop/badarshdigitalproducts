import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = "INR"): string {
  if (currency === "INR") {
    return `₹${price.toLocaleString("en-IN")}`;
  }
  return `$${price.toLocaleString("en-US")}`;
}

export function getWhatsAppUrl(
  message: string,
  serviceOrContext?: string,
  number: string = WHATSAPP_NUMBER
): string {
  const cleanNumber = number.replace(/[^0-9]/g, "");
  const contextNote = serviceOrContext ? ` [Service: ${serviceOrContext}]` : "";
  const trackedMessage = `${message}${contextNote}\n\n[Inquiry via badarsh.com]`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(trackedMessage)}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Safely parses JSON from a Fetch Response without throwing Unexpected end of JSON input
 * when the body is empty, truncated, or HTML during dev rebuilds / auth redirects.
 */
export async function safeParseJson<T = Record<string, any>>(
  res: Response,
  fallback: T = {} as T
): Promise<T> {
  try {
    const text = await res.text();
    if (!text || !text.trim()) return fallback;
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

