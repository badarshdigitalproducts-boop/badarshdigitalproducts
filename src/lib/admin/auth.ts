import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "badarsh_admin_session";
export const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60; // 12 hours

const DEFAULT_SECRET_KEY = "badarsh@founder2026";
const DEFAULT_SESSION_SECRET = "badarsh_secure_hmac_session_secret_994821a8b3c4";

function getAdminSecret(): string {
  return process.env.ADMIN_SECRET_KEY || DEFAULT_SECRET_KEY;
}

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || DEFAULT_SESSION_SECRET;
}

/**
 * Timing-safe passphrase verification to protect against side-channel timing attacks.
 */
export function verifyAdminPassphrase(inputPassphrase: string): boolean {
  if (!inputPassphrase || typeof inputPassphrase !== "string") {
    return false;
  }

  const expected = getAdminSecret();
  const inputHash = crypto.createHash("sha256").update(inputPassphrase).digest();
  const expectedHash = crypto.createHash("sha256").update(expected).digest();

  return crypto.timingSafeEqual(inputHash, expectedHash);
}

/**
 * Creates an HMAC-SHA256 signed session token
 */
export function createSessionToken(): string {
  const payload = {
    role: "founder",
    iat: Date.now(),
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    rnd: crypto.randomBytes(8).toString("hex"),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Validates the HMAC-SHA256 session token
 */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signature] = parts;

  // Verify HMAC signature using timing-safe comparison
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

  // Verify payload expiry
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

// In-memory brute force rate limiter (sliding window)
interface AttemptRecord {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

const loginAttempts = new Map<string, AttemptRecord>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

export function checkRateLimit(clientIp: string): { allowed: boolean; remainingAttempts: number; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(clientIp);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  if (record.blockedUntil && now < record.blockedUntil) {
    const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  // Reset window if expired
  if (now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.delete(clientIp);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - record.count);
  return { allowed: record.count < MAX_ATTEMPTS, remainingAttempts: remaining };
}

export function recordFailedAttempt(clientIp: string): void {
  const now = Date.now();
  const record = loginAttempts.get(clientIp) || { count: 0, firstAttempt: now };

  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
  }

  loginAttempts.set(clientIp, record);
}

export function resetRateLimit(clientIp: string): void {
  loginAttempts.delete(clientIp);
}

