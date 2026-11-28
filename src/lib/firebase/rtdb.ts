/**
 * Firebase Realtime Database Integration for BADARSH
 * Uses firebase-admin SDK server-side when configured, falling back to client SDK only in unconfigured dev.
 */

import { ref, set, get, remove } from "firebase/database";
import { getRealtimeDb } from "./config";
import { getAdminRtdb, isFirebaseAdminConfigured } from "./admin";
import type {
  AdminProduct,
  AdminService,
  AdminBlogPost,
  OrderRecord,
  AdminCoupon,
  LeadInquiry,
  Subscriber,
  SystemSettings,
  AdminDatabase,
  UserAccount,
} from "@/lib/admin/types";

export const RT_PATHS = {
  PRODUCTS: "products",
  SERVICES: "services",
  BLOG: "blog_posts",
  ORDERS: "orders",
  COUPONS: "coupons",
  LEADS: "leads",
  SUBSCRIBERS: "subscribers",
  SETTINGS: "settings",
  AUDIT_LOGS: "audit_logs",
  USERS: "users",
} as const;

function withTimeout<T>(promise: Promise<T>, ms = 4000, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

function cleanForRtdb<T>(value: T): T {
  if (value === null || value === undefined || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    return value.filter((v) => v !== undefined).map((v) => cleanForRtdb(v)) as unknown as T;
  }
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(value as Record<string, any>)) {
    if (v !== undefined) {
      out[k] = cleanForRtdb(v);
    }
  }
  return out as T;
}

async function rtList<T>(nodePath: string): Promise<T[]> {
  try {
    const adminRtdb = getAdminRtdb();
    if (adminRtdb) {
      const snap = await withTimeout(adminRtdb.ref(nodePath).get(), 4000, null);
      if (!snap || !snap.exists()) return [];
      const val = snap.val();
      if (!val || typeof val !== "object") return [];
      return Array.isArray(val) ? val.filter(Boolean) : (Object.values(val) as T[]);
    }

    const db = getRealtimeDb();
    const snap = await withTimeout(get(ref(db, nodePath)), 3500, null);
    if (!snap || !snap.exists()) return [];
    const val = snap.val();
    if (!val || typeof val !== "object") return [];
    return Array.isArray(val) ? val.filter(Boolean) : (Object.values(val) as T[]);
  } catch (err) {
    console.warn(`RTDB read warning (${nodePath}):`, (err as Error)?.message);
    return [];
  }
}

async function rtPut<T>(nodePath: string, data: T): Promise<void> {
  try {
    const cleaned = cleanForRtdb(data);
    const adminRtdb = getAdminRtdb();
    if (adminRtdb) {
      await withTimeout(adminRtdb.ref(nodePath).set(cleaned), 4000, undefined);
      return;
    }

    const db = getRealtimeDb();
    await withTimeout(set(ref(db, nodePath), cleaned), 4000, undefined);
  } catch (err) {
    console.warn(`RTDB write warning (${nodePath}):`, (err as Error)?.message);
  }
}

async function rtDel(nodePath: string): Promise<void> {
  try {
    const adminRtdb = getAdminRtdb();
    if (adminRtdb) {
      await withTimeout(adminRtdb.ref(nodePath).remove(), 4000, undefined);
      return;
    }

    const db = getRealtimeDb();
    await withTimeout(remove(ref(db, nodePath)), 4000, undefined);
  } catch (err) {
    console.warn(`RTDB delete warning (${nodePath}):`, (err as Error)?.message);
  }
}

export async function checkRealtimeDbConnection(): Promise<{
  connected: boolean;
  latencyMs: number;
  adminSdkActive?: boolean;
  error?: string;
}> {
  const start = Date.now();
  const adminSdkActive = isFirebaseAdminConfigured();
  try {
    const adminRtdb = getAdminRtdb();
    if (adminRtdb) {
      await withTimeout(adminRtdb.ref(RT_PATHS.SETTINGS).get(), 4000, null);
      return {
        connected: true,
        latencyMs: Date.now() - start,
        adminSdkActive: true,
      };
    }

    const db = getRealtimeDb();
    const pingRef = ref(db, ".info/connected");
    const snapshot = await withTimeout(get(pingRef), 4000, null);
    const isConnected = snapshot?.val() !== false;
    return {
      connected: isConnected,
      latencyMs: Date.now() - start,
      adminSdkActive: false,
    };
  } catch (err: any) {
    let errorMsg = err?.message || "Failed to reach Firebase Realtime Database";
    if (errorMsg.includes("permission_denied") || errorMsg.includes("PERMISSION_DENIED")) {
      errorMsg = adminSdkActive
        ? "Realtime Database Admin SDK error."
        : "Realtime Database locked to authenticated/admin reads. Set FIREBASE_SERVICE_ACCOUNT_KEY in Vercel.";
    }
    return {
      connected: false,
      latencyMs: Date.now() - start,
      adminSdkActive,
      error: errorMsg,
    };
  }
}

/* ---------------- Products ---------------- */
export const rtGetProducts = () => rtList<AdminProduct>(RT_PATHS.PRODUCTS);
export const rtSaveProduct = (product: AdminProduct) => rtPut(`${RT_PATHS.PRODUCTS}/${product.id}`, product);
export const rtDeleteProduct = (id: string) => rtDel(`${RT_PATHS.PRODUCTS}/${id}`);

/* ---------------- Services ---------------- */
export const rtGetServices = () => rtList<AdminService>(RT_PATHS.SERVICES);
export const rtSaveService = (service: AdminService) => rtPut(`${RT_PATHS.SERVICES}/${service.id}`, service);
export const rtDeleteService = (id: string) => rtDel(`${RT_PATHS.SERVICES}/${id}`);

/* ---------------- Blog Posts ---------------- */
export const rtGetBlogPosts = () => rtList<AdminBlogPost>(RT_PATHS.BLOG);
export const rtSaveBlogPost = (post: AdminBlogPost) => rtPut(`${RT_PATHS.BLOG}/${post.slug}`, post);
export const rtDeleteBlogPost = (slug: string) => rtDel(`${RT_PATHS.BLOG}/${slug}`);

/* ---------------- Orders ---------------- */
export const rtGetOrders = () => rtList<OrderRecord>(RT_PATHS.ORDERS);
export const rtSaveOrder = (order: OrderRecord) => rtPut(`${RT_PATHS.ORDERS}/${order.id}`, order);
export const rtDeleteOrder = (id: string) => rtDel(`${RT_PATHS.ORDERS}/${id}`);

/* ---------------- Coupons ---------------- */
export const rtGetCoupons = () => rtList<AdminCoupon>(RT_PATHS.COUPONS);
export const rtSaveCoupon = (coupon: AdminCoupon) => rtPut(`${RT_PATHS.COUPONS}/${coupon.id}`, coupon);
export const rtDeleteCoupon = (id: string) => rtDel(`${RT_PATHS.COUPONS}/${id}`);

/* ---------------- Leads ---------------- */
export const rtGetLeads = () => rtList<LeadInquiry>(RT_PATHS.LEADS);
export const rtSaveLead = (lead: LeadInquiry) => rtPut(`${RT_PATHS.LEADS}/${lead.id}`, lead);
export const rtDeleteLead = (id: string) => rtDel(`${RT_PATHS.LEADS}/${id}`);

/* ---------------- Subscribers ---------------- */
export const rtGetSubscribers = () => rtList<Subscriber>(RT_PATHS.SUBSCRIBERS);
export const rtSaveSubscriber = (subscriber: Subscriber) =>
  rtPut(`${RT_PATHS.SUBSCRIBERS}/${subscriber.id}`, subscriber);
export const rtDeleteSubscriber = (id: string) => rtDel(`${RT_PATHS.SUBSCRIBERS}/${id}`);

/* ---------------- Settings ---------------- */
export async function rtGetSettings(): Promise<SystemSettings | null> {
  try {
    const adminRtdb = getAdminRtdb();
    if (adminRtdb) {
      const snap = await withTimeout(adminRtdb.ref(RT_PATHS.SETTINGS).get(), 3500, null);
      return snap && snap.exists() ? (snap.val() as SystemSettings) : null;
    }

    const db = getRealtimeDb();
    const snap = await withTimeout(get(ref(db, RT_PATHS.SETTINGS)), 3500, null);
    if (!snap || !snap.exists()) return null;
    return snap.val() as SystemSettings;
  } catch (err) {
    console.warn("rtGetSettings warning:", err);
    return null;
  }
}

export const rtSaveSettings = (settings: SystemSettings) => rtPut(RT_PATHS.SETTINGS, settings);

/* ---------------- Users ---------------- */
export const rtGetUsers = () => rtList<UserAccount>(RT_PATHS.USERS);

export async function rtGetUserById(id: string): Promise<UserAccount | null> {
  try {
    const adminRtdb = getAdminRtdb();
    if (adminRtdb) {
      const snap = await withTimeout(adminRtdb.ref(`${RT_PATHS.USERS}/${id}`).get(), 3500, null);
      return snap && snap.exists() ? (snap.val() as UserAccount) : null;
    }

    const db = getRealtimeDb();
    const snap = await withTimeout(get(ref(db, `${RT_PATHS.USERS}/${id}`)), 3500, null);
    if (!snap || !snap.exists()) return null;
    return snap.val() as UserAccount;
  } catch (err) {
    console.warn("rtGetUserById warning:", err);
    return null;
  }
}

export const rtSaveUser = (user: UserAccount) => rtPut(`${RT_PATHS.USERS}/${user.id}`, user);
export const rtDeleteUser = (id: string) => rtDel(`${RT_PATHS.USERS}/${id}`);

/* ---------------- Bulk Sync ---------------- */
export async function rtSyncFullDatabase(database: AdminDatabase): Promise<void> {
  try {
    const updates: Record<string, any> = {};

    for (const p of database.products) {
      updates[`${RT_PATHS.PRODUCTS}/${p.id}`] = cleanForRtdb(p);
    }
    for (const s of database.services) {
      updates[`${RT_PATHS.SERVICES}/${s.id}`] = cleanForRtdb(s);
    }
    for (const b of database.blogPosts) {
      updates[`${RT_PATHS.BLOG}/${b.slug}`] = cleanForRtdb(b);
    }
    for (const o of database.orders) {
      updates[`${RT_PATHS.ORDERS}/${o.id}`] = cleanForRtdb(o);
    }
    for (const c of database.coupons) {
      updates[`${RT_PATHS.COUPONS}/${c.id}`] = cleanForRtdb(c);
    }
    for (const l of database.leads) {
      updates[`${RT_PATHS.LEADS}/${l.id}`] = cleanForRtdb(l);
    }
    for (const sub of database.subscribers) {
      updates[`${RT_PATHS.SUBSCRIBERS}/${sub.id}`] = cleanForRtdb(sub);
    }
    for (const user of database.users || []) {
      updates[`${RT_PATHS.USERS}/${user.id}`] = cleanForRtdb(user);
    }
    if (database.settings) {
      updates[RT_PATHS.SETTINGS] = cleanForRtdb(database.settings);
    }

    const adminRtdb = getAdminRtdb();
    if (adminRtdb) {
      await withTimeout(adminRtdb.ref().update(updates), 6000, undefined);
      return;
    }

    const db = getRealtimeDb();
    await withTimeout(set(ref(db), updates), 6000, undefined);
  } catch (err) {
    console.warn("rtSyncFullDatabase warning:", err);
  }
}
