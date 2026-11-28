import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "badarsh_admin_session";
export const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60; // 12 hours

// Ephemeral dev-only secret fallback (never deterministic or usable in production)
const DEV_EPHEMERAL_SESSION_SECRET =
  process.env.NODE_ENV !== "production" ? crypto.randomBytes(32).toString("hex") : "";

function getSessionSalt(): string {
  return `${getSessionSecret()}:badarsh_admin_kdf_v2`;
}

export function getAdminSecret(): string {
  const envVal = process.env.ADMIN_SECRET_KEY;
  if (envVal) {
    const cleaned = envVal.trim().replace(/^["']|["']$/g, "");
    if (cleaned) return cleaned;
  }
  return "";
}

export function getSessionSecret(): string {
  const envVal = process.env.ADMIN_SESSION_SECRET;
  if (envVal) {
    const cleaned = envVal.trim().replace(/^["']|["']$/g, "");
    if (cleaned) return cleaned;
  }
  return DEV_EPHEMERAL_SESSION_SECRET;
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(getAdminSecret() && getSessionSecret());
}

/**
 * Computes a high-iteration PBKDF2-SHA512 key derivation digest.
 */
function deriveKeyDigest(passphrase: string, salt: string): Buffer {
  return crypto.pbkdf2Sync(passphrase.trim(), salt, 100000, 64, "sha512");
}

/**
 * Generates a User-Agent fingerprint to bind admin session tokens cleanly behind CDNs.
 */
export function generateClientFingerprint(ip?: string, userAgent?: string): string {
  const sessionSecret = getSessionSecret();
  if (!sessionSecret) return "";
  const cleanUa = (userAgent || "unknown").slice(0, 200);
  const raw = `ua::${cleanUa}`;
  return crypto.createHmac("sha256", sessionSecret).update(raw).digest("hex").slice(0, 16);
}

/**
 * Timing-safe, constant-time passphrase verification strictly against ADMIN_SECRET_KEY.
 * Fails closed when ADMIN_SECRET_KEY is not configured.
 */
export function verifyAdminPassphrase(inputPassphrase: string): boolean {
  if (!inputPassphrase || typeof inputPassphrase !== "string") {
    return false;
  }

  const envKey = getAdminSecret();
  if (!envKey || !getSessionSecret()) {
    return false;
  }

  const cleanInput = inputPassphrase.trim();
  const salt = getSessionSalt();

  try {
    const inputDigest = deriveKeyDigest(cleanInput, salt);
    const envDigest = deriveKeyDigest(envKey, salt);
    return crypto.timingSafeEqual(inputDigest, envDigest);
  } catch {
    return false;
  }
}

/**
 * Creates an HMAC-SHA256 signed session token bound to the founder role and User-Agent.
 */
export function createSessionToken(clientIp?: string, userAgent?: string): string {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }

  const payload = {
    role: "founder",
    iat: Date.now(),
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    fp: generateClientFingerprint(clientIp, userAgent),
    rnd: crypto.randomBytes(16).toString("hex"),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Validates the HMAC-SHA256 session token with cryptographic integrity check.
 * Fails closed if ADMIN_SESSION_SECRET is missing.
 */
export function verifySessionToken(
  token: string | undefined,
  userAgent?: string
): boolean {
  if (!token || typeof token !== "string") return false;
  const secret = getSessionSecret();
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signature] = parts;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");

  if (signature.length !== expectedSignature.length) return false;

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }
    if (payload.role !== "founder") {
      return false;
    }
    if (userAgent && payload.fp) {
      const expectedFp = generateClientFingerprint(undefined, userAgent);
      if (expectedFp && payload.fp !== expectedFp) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

/* ---------------- Persistent Rate Limiting Store ---------------- */

interface AttemptRecord {
  count: number;
  lockedUntil: number | null;
  lastAttempt: number;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30-minute IP lockdown matching Z+ security policy

const attemptStore = new Map<string, AttemptRecord>();

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const record = attemptStore.get(ip);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  if (record.lockedUntil) {
    if (now < record.lockedUntil) {
      return {
        allowed: false,
        remainingAttempts: 0,
        retryAfterSeconds: Math.ceil((record.lockedUntil - now) / 1000),
      };
    }
    attemptStore.delete(ip);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  if (now - record.lastAttempt > 60 * 60 * 1000) {
    attemptStore.delete(ip);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  return {
    allowed: true,
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - record.count),
  };
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = attemptStore.get(ip) || {
    count: 0,
    lockedUntil: null,
    lastAttempt: now,
  };

  record.count += 1;
  record.lastAttempt = now;

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
  }

  attemptStore.set(ip, record);
}

export function resetRateLimit(ip: string): void {
  attemptStore.delete(ip);
}
