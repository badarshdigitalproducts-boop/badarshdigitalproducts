import crypto from "crypto";
import { getDatabase, saveDatabase } from "@/lib/admin/store";
import type { UserAccount } from "@/lib/admin/types";

export const USER_COOKIE_NAME = "badarsh_creator_session";
export const USER_SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  "badarsh_secure_hmac_session_secret_994821a8b3c4";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, originalHash] = storedHash.split(":");
    if (!salt || !originalHash) return false;
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(originalHash, "hex")
    );
  } catch {
    return false;
  }
}

export function createUserSessionToken(user: {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
}): string {
  const payload = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL || null,
    iat: Date.now(),
    exp: Date.now() + USER_SESSION_MAX_AGE_SECONDS * 1000,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

export function verifyUserSessionToken(token: string | undefined): {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
} | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;

  const expectedSignature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadB64)
    .digest("base64url");

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) {
      return null;
    }
    return {
      uid: payload.uid,
      email: payload.email,
      displayName: payload.displayName,
      photoURL: payload.photoURL || null,
    };
  } catch {
    return null;
  }
}

/* ---------------- Database User Lookups ---------------- */

export async function findUserByEmail(email: string): Promise<UserAccount | null> {
  const db = await getDatabase();
  const normalized = email.toLowerCase().trim();
  const users = db.users || [];
  return users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export async function createUserAccount(
  name: string,
  email: string,
  password?: string,
  provider: "email" | "google" = "email",
  photoURL?: string
): Promise<UserAccount> {
  const db = await getDatabase();
  if (!db.users) db.users = [];

  const normalized = email.toLowerCase().trim();
  const existing = db.users.find((u) => u.email.toLowerCase() === normalized);
  if (existing) {
    throw new Error("An account with this email address already exists.");
  }

  const now = new Date().toISOString();
  const newUser: UserAccount = {
    id: `usr-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`,
    name: name.trim() || email.split("@")[0],
    email: normalized,
    passwordHash: password ? hashPassword(password) : undefined,
    photoURL,
    provider,
    createdAt: now,
    lastLoginAt: now,
  };

  db.users.unshift(newUser);
  await saveDatabase(db);
  return newUser;
}

export async function verifyUserCredentials(
  email: string,
  password: string
): Promise<UserAccount | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;

  // If user registered via password, verify hash
  if (user.passwordHash) {
    const valid = verifyPassword(password, user.passwordHash);
    if (!valid) return null;
  }

  // Update last login
  const db = await getDatabase();
  if (db.users) {
    const idx = db.users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      db.users[idx].lastLoginAt = new Date().toISOString();
      await saveDatabase(db);
    }
  }

  return user;
}

export async function upsertGoogleUser(
  email: string,
  name?: string,
  photoURL?: string
): Promise<UserAccount> {
  const db = await getDatabase();
  if (!db.users) db.users = [];

  const normalized = email.toLowerCase().trim();
  const existing = db.users.find((u) => u.email.toLowerCase() === normalized);
  const now = new Date().toISOString();

  if (existing) {
    existing.lastLoginAt = now;
    if (name && !existing.name) existing.name = name;
    if (photoURL && !existing.photoURL) existing.photoURL = photoURL;
    await saveDatabase(db);
    return existing;
  }

  const newUser: UserAccount = {
    id: `usr-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`,
    name: name?.trim() || email.split("@")[0],
    email: normalized,
    photoURL,
    provider: "google",
    createdAt: now,
    lastLoginAt: now,
  };

  db.users.unshift(newUser);
  await saveDatabase(db);
  return newUser;
}
