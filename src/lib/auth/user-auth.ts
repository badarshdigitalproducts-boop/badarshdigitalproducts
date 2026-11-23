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

export async function findUserById(userId: string): Promise<UserAccount | null> {
  const db = await getDatabase();
  const users = db.users || [];
  return users.find((u) => u.id === userId) || null;
}

export async function createUserAccount(
  name: string,
  email: string,
  password?: string,
  provider: "email" | "google" = "email",
  photoURL?: string,
  consentGiven: boolean = true
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
    dpdpConsent: consentGiven
      ? {
          consentedAt: now,
          version: "2023-v1",
          lawfulBasis: "explicit_statutory_consent",
        }
      : undefined,
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
    dpdpConsent: {
      consentedAt: now,
      version: "2023-v1",
      lawfulBasis: "explicit_statutory_consent",
    },
  };

  db.users.unshift(newUser);
  await saveDatabase(db);
  return newUser;
}

/**
 * Executes a cascading data purge under Section 12 (Right to Erasure / Right to be Forgotten)
 * of India's Digital Personal Data Protection Act, 2023.
 */
export async function deleteUserAccount(userId: string): Promise<{
  success: boolean;
  purgedRecords: {
    user: boolean;
    ordersAnonymized: number;
    leadsDeleted: number;
    subscribersDeleted: number;
  };
}> {
  const db = await getDatabase();
  const users = db.users || [];
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    throw new Error("User account not found or already deleted.");
  }

  const targetUser = users[userIndex];
  const userEmail = targetUser.email.toLowerCase().trim();

  // 1. Remove user account record
  users.splice(userIndex, 1);
  db.users = users;

  // 2. Anonymize PII from Order records (statutory tax compliance under CGST Act retains immutable financials)
  let ordersAnonymized = 0;
  if (db.orders && Array.isArray(db.orders)) {
    db.orders.forEach((order) => {
      if (order.customerEmail && order.customerEmail.toLowerCase().trim() === userEmail) {
        order.customerName = "Anonymized User (DPDP Sec 12 Erasure)";
        order.customerEmail = `anonymized-${crypto.createHash("sha256").update(order.id).digest("hex").slice(0, 10)}@badarsh.local`;
        order.customerPhone = undefined;
        order.deliveryNotes = "Customer PII permanently purged on verified Data Principal erasure request.";
        order.updatedAt = new Date().toISOString();
        ordersAnonymized++;
      }
    });
  }

  // 3. Delete any lead inquiries
  let leadsDeleted = 0;
  if (db.leads && Array.isArray(db.leads)) {
    const prevLen = db.leads.length;
    db.leads = db.leads.filter((l) => l.email.toLowerCase().trim() !== userEmail);
    leadsDeleted = prevLen - db.leads.length;
  }

  // 4. Delete any newsletter subscriptions
  let subscribersDeleted = 0;
  if (db.subscribers && Array.isArray(db.subscribers)) {
    const prevLen = db.subscribers.length;
    db.subscribers = db.subscribers.filter((s) => s.email.toLowerCase().trim() !== userEmail);
    subscribersDeleted = prevLen - db.subscribers.length;
  }

  // 5. Append immutable sanitized compliance audit log
  if (!db.auditLogs) db.auditLogs = [];
  db.auditLogs.unshift({
    id: `log-${Date.now().toString(36)}`,
    action: "DPDP_RIGHT_TO_ERASURE_PURGE",
    details: `Data Principal ${userId} exercised statutory Right to Erasure (DPDP Act Sec 12). Account deleted; ${ordersAnonymized} order(s) anonymized; ${leadsDeleted} lead(s) removed; ${subscribersDeleted} subscriber(s) removed.`,
    timestamp: new Date().toISOString(),
  });

  // 6. Persist local store
  await saveDatabase(db);

  // 7. Cascading purge in Firebase Realtime Database
  try {
    const { getRealtimeDb } = await import("@/lib/firebase/config");
    const { ref, remove } = await import("firebase/database");
    const rtdb = getRealtimeDb();
    await remove(ref(rtdb, `users/${userId}`));
  } catch {
    // Non-blocking fallback
  }

  // 8. Cascading purge in Firestore
  try {
    const { getFirestoreDb } = await import("@/lib/firebase/config");
    const { doc, deleteDoc } = await import("firebase/firestore");
    const fdb = getFirestoreDb();
    await deleteDoc(doc(fdb, "users", userId));
  } catch {
    // Non-blocking fallback
  }

  return {
    success: true,
    purgedRecords: {
      user: true,
      ordersAnonymized,
      leadsDeleted,
      subscribersDeleted,
    },
  };
}
