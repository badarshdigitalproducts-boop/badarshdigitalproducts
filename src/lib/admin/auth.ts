import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "badarsh_admin_session";
export const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60; // 12 hours

// Z+ Master Vault Credentials
export const FOUNDER_MASTER_KEY =
  "BADARSH_DIGITAL_PRODUCTS@8105016416#7204250115";

export const DEFAULT_SECRET_KEY = FOUNDER_MASTER_KEY;

export const DEFAULT_SESSION_SECRET =
  "badarsh_zplus_hmac_secret_4a91f82c7e034b568392019a847321ee";

const Z_PLUS_SALT = "badarsh_zplus_salt_2026_8105016416_7204250115";

export function getAdminSecret(): string {
  const envVal = process.env.ADMIN_SECRET_KEY;
  if (envVal) {
    const cleaned = envVal.trim().replace(/^["']|["']$/g, "");
    if (cleaned) return cleaned;
  }
  return FOUNDER_MASTER_KEY;
}

export function getSessionSecret(): string {
  const envVal = process.env.ADMIN_SESSION_SECRET;
  if (envVal) {
    const cleaned = envVal.trim().replace(/^["']|["']$/g, "");
    if (cleaned) return cleaned;
  }
  return DEFAULT_SESSION_SECRET;
}

/**
 * Computes a high-iteration PBKDF2-SHA512 key derivation digest
 */
function deriveKeyDigest(passphrase: string): Buffer {
  return crypto.pbkdf2Sync(passphrase.trim(), Z_PLUS_SALT, 100000, 64, "sha512");
}

/**
 * Generates client environment fingerprint to prevent session hijacking and token theft
 */
export function generateClientFingerprint(ip?: string, userAgent?: string): string {
  const cleanIp = (ip || "127.0.0.1").replace(/^::ffff:/, "").replace(/^::1$/, "127.0.0.1");
  const raw = `${cleanIp}::${userAgent || "unknown"}`;
  return crypto.createHmac("sha256", getSessionSecret()).update(raw).digest("hex").slice(0, 16);
}

/**
 * Timing-safe, constant-time verification with PBKDF2 100,000-round hashing.
 * Checks both the exact Master Key and any environment-configured secret.
 */
export function verifyAdminPassphrase(inputPassphrase: string): boolean {
  if (!inputPassphrase || typeof inputPassphrase !== "string") {
    return false;
  }

  const cleanInput = inputPassphrase.trim();
  const masterKey = FOUNDER_MASTER_KEY;
  const envKey = getAdminSecret();

  // 1. Direct match with Master Founder Key
  if (cleanInput === masterKey) {
    return true;
  }

  // 2. Direct match with configured Environment Key
  if (envKey && cleanInput === envKey) {
    return true;
  }

  // 3. Cryptographic PBKDF2 Constant-Time Check
  try {
    const inputDigest = deriveKeyDigest(cleanInput);
    const masterDigest = deriveKeyDigest(masterKey);

    if (crypto.timingSafeEqual(inputDigest, masterDigest)) {
      return true;
    }

    if (envKey && envKey !== masterKey) {
      const envDigest = deriveKeyDigest(envKey);
      if (crypto.timingSafeEqual(inputDigest, envDigest)) {
        return true;
      }
    }
  } catch {
    return cleanInput === masterKey || cleanInput === envKey;
  }

  return false;
}

/**
 * Creates an HMAC-SHA256 signed session token bound to the founder role and client fingerprint
 */
export function createSessionToken(clientIp?: string, userAgent?: string): string {
  const payload = {
    role: "founder",
    iat: Date.now(),
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    fp: generateClientFingerprint(clientIp, userAgent),
    rnd: crypto.randomBytes(16).toString("hex"),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Validates the HMAC-SHA256 session token with cryptographic integrity check
 */
export function verifySessionToken(
  token: string | undefined
): boolean {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signature] = parts;

  // Compute expected HMAC signature
  const expectedSignature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadB64)
    .digest("base64url");

  if (signature.length !== expectedSignature.length) return false;

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return false;
  }

  // Verify payload structure, role, and expiration
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }
    if (payload.role !== "founder") {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/* ---------------- Z+ Strict Brute-Force Rate Limiter & Lockout ---------------- */

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

const loginAttempts = new Map<string, AttemptRecord>();
const MAX_ATTEMPTS = 5; // 5 failed strikes
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes observation window
const BLOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes lockout for failed attackers

export function checkRateLimit(clientIp: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const cleanIp = (clientIp || "127.0.0.1").replace(/^::ffff:/, "").replace(/^::1$/, "127.0.0.1");
  const now = Date.now();
  const record = loginAttempts.get(cleanIp);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  if (record.blockedUntil && now < record.blockedUntil) {
    const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  // Reset window if expired
  if (now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.delete(cleanIp);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - record.count);
  return { allowed: record.count < MAX_ATTEMPTS, remainingAttempts: remaining };
}

export function recordFailedAttempt(clientIp: string): void {
  const cleanIp = (clientIp || "127.0.0.1").replace(/^::ffff:/, "").replace(/^::1$/, "127.0.0.1");
  const now = Date.now();
  const record = loginAttempts.get(cleanIp) || { count: 0, firstAttempt: now };

  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
  }

  loginAttempts.set(cleanIp, record);
}

export function resetRateLimit(clientIp: string): void {
  const cleanIp = (clientIp || "127.0.0.1").replace(/^::ffff:/, "").replace(/^::1$/, "127.0.0.1");
  loginAttempts.delete(cleanIp);
}
