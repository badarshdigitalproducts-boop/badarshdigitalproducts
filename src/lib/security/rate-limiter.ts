import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory sliding rate limiting store
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

export function getClientIp(request: Request | NextRequest): string {
  const headers = request.headers;
  // Prefer platform-set edge IP headers that cannot be trivially spoofed by clients
  const vercelIp = headers.get("x-vercel-forwarded-for");
  if (vercelIp) return vercelIp.split(",")[0].trim();

  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const xRealIp = headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const parts = xForwardedFor.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0) return parts[0];
  }

  return "127.0.0.1";
}

export interface RateLimitOptions {
  maxRequests: number;
  windowSeconds: number;
  prefix?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Enforces sliding window rate limit per client IP + route prefix.
 */
export function checkRateLimit(
  request: Request | NextRequest,
  options: RateLimitOptions
): RateLimitResult {
  const ip = getClientIp(request);
  const prefix = options.prefix || "global";
  const key = `${prefix}:${ip}`;
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;

  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      success: true,
      limit: options.maxRequests,
      remaining: options.maxRequests - 1,
      resetInSeconds: options.windowSeconds,
    };
  }

  if (existing.count >= options.maxRequests) {
    const resetInSeconds = Math.ceil((existing.resetAt - now) / 1000);
    return {
      success: false,
      limit: options.maxRequests,
      remaining: 0,
      resetInSeconds: Math.max(1, resetInSeconds),
    };
  }

  existing.count += 1;
  const resetInSeconds = Math.ceil((existing.resetAt - now) / 1000);

  return {
    success: true,
    limit: options.maxRequests,
    remaining: options.maxRequests - existing.count,
    resetInSeconds: Math.max(1, resetInSeconds),
  };
}

/**
 * Returns standardized HTTP 429 Too Many Requests response with retry headers.
 */
export function createRateLimitResponse(resetInSeconds: number): NextResponse {
  return NextResponse.json(
    {
      error: "Too many requests. Please slow down and try again.",
      retryAfter: resetInSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": resetInSeconds.toString(),
        "X-RateLimit-Reset": resetInSeconds.toString(),
      },
    }
  );
}
