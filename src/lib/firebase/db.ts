import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { getFirestoreDb } from "./config";
import { getAdminFirestore, isFirebaseAdminConfigured } from "./admin";
import type {
  AdminProduct,
  AdminService,
  AdminBlogPost,
  OrderRecord,
  AdminCoupon,
  LeadInquiry,
  Subscriber,
  SystemSettings,
  AuditLog,
  AdminDatabase,
  UserAccount,
} from "@/lib/admin/types";

export const COLLECTIONS = {
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

function cleanForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  if (!obj || typeof obj !== "object") return obj;
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
        cleaned[key] = cleanForFirestore(value);
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
}

async function getAllDocs<T>(collectionName: string): Promise<T[]> {
  try {
    const adminDb = getAdminFirestore();
    if (adminDb) {
      const snapshot = await withTimeout(adminDb.collection(collectionName).get(), 4000, null);
      if (!snapshot) return [];
      const items: T[] = [];
      snapshot.forEach((d) => items.push(d.data() as T));
      return items;
    }

    const db = getFirestoreDb();
    const snapshot = await withTimeout(getDocs(collection(db, collectionName)), 3500, null);
    if (!snapshot) return [];
    const items: T[] = [];
    snapshot.forEach((d) => items.push(d.data() as T));
    return items;
  } catch (err) {
    console.warn(`Firestore read warning (${collectionName}):`, (err as Error)?.message);
    return [];
  }
}

async function upsertDoc(collectionName: string, docId: string, data: Record<string, any>): Promise<void> {
  try {
    const cleaned = cleanForFirestore(data);
    const adminDb = getAdminFirestore();
    if (adminDb) {
      await withTimeout(
        adminDb.collection(collectionName).doc(docId).set(cleaned, { merge: true }),
        4000,
        undefined
      );
      return;
    }

    const db = getFirestoreDb();
    await withTimeout(setDoc(doc(db, collectionName, docId), cleaned, { merge: true }), 4000, undefined);
  } catch (err) {
    console.warn(`Firestore write warning (${collectionName}/${docId}):`, (err as Error)?.message);
  }
}

async function removeDoc(collectionName: string, docId: string): Promise<void> {
  try {
    const adminDb = getAdminFirestore();
    if (adminDb) {
      await withTimeout(adminDb.collection(collectionName).doc(docId).delete(), 4000, undefined);
      return;
    }

    const db = getFirestoreDb();
    await withTimeout(deleteDoc(doc(db, collectionName, docId)), 4000, undefined);
  } catch (err) {
    console.warn(`Firestore delete warning (${collectionName}/${docId}):`, (err as Error)?.message);
  }
}

export async function checkFirebaseConnection(): Promise<{
  connected: boolean;
  latencyMs: number;
  adminSdkActive?: boolean;
  error?: string;
}> {
  const start = Date.now();
  const adminSdkActive = isFirebaseAdminConfigured();
  try {
    const adminDb = getAdminFirestore();
    if (adminDb) {
      await withTimeout(adminDb.collection(COLLECTIONS.SETTINGS).doc("system").get(), 4000, null);
      return {
        connected: true,
        latencyMs: Date.now() - start,
        adminSdkActive: true,
      };
    }

    const db = getFirestoreDb();
    const settingsDoc = doc(db, COLLECTIONS.SETTINGS, "system");
    await withTimeout(getDoc(settingsDoc), 4000, null);
    return {
      connected: true,
      latencyMs: Date.now() - start,
      adminSdkActive: false,
    };
  } catch (err: any) {
    let errorMsg = err?.message || "Failed to reach Firebase Firestore";
    if (errorMsg.includes("suspended") || errorMsg.includes("CONSUMER_SUSPENDED")) {
      errorMsg = "Firebase project is suspended in Google Cloud.";
    } else if (errorMsg.includes("permission-denied") || errorMsg.includes("PERMISSION_DENIED")) {
      errorMsg = adminSdkActive
        ? "Firestore Admin SDK check failed."
        : "Firestore client rules blocked server access. Add FIREBASE_SERVICE_ACCOUNT_KEY to Vercel.";
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
export const fsGetProducts = () => getAllDocs<AdminProduct>(COLLECTIONS.PRODUCTS);
export const fsSaveProduct = (product: AdminProduct) => upsertDoc(COLLECTIONS.PRODUCTS, product.id, product);
export const fsDeleteProduct = (id: string) => removeDoc(COLLECTIONS.PRODUCTS, id);

/* ---------------- Services ---------------- */
export const fsGetServices = () => getAllDocs<AdminService>(COLLECTIONS.SERVICES);
export const fsSaveService = (service: AdminService) => upsertDoc(COLLECTIONS.SERVICES, service.id, service);
export const fsDeleteService = (id: string) => removeDoc(COLLECTIONS.SERVICES, id);

/* ---------------- Blog Posts ---------------- */
export const fsGetBlogPosts = () => getAllDocs<AdminBlogPost>(COLLECTIONS.BLOG);
export const fsSaveBlogPost = (post: AdminBlogPost) => upsertDoc(COLLECTIONS.BLOG, post.slug, post);
export const fsDeleteBlogPost = (slug: string) => removeDoc(COLLECTIONS.BLOG, slug);

/* ---------------- Orders ---------------- */
export const fsGetOrders = () => getAllDocs<OrderRecord>(COLLECTIONS.ORDERS);
export const fsSaveOrder = (order: OrderRecord) => upsertDoc(COLLECTIONS.ORDERS, order.id, order);
export const fsDeleteOrder = (id: string) => removeDoc(COLLECTIONS.ORDERS, id);

/* ---------------- Coupons ---------------- */
export const fsGetCoupons = () => getAllDocs<AdminCoupon>(COLLECTIONS.COUPONS);
export const fsSaveCoupon = (coupon: AdminCoupon) => upsertDoc(COLLECTIONS.COUPONS, coupon.id, coupon);
export const fsDeleteCoupon = (id: string) => removeDoc(COLLECTIONS.COUPONS, id);

/* ---------------- Leads ---------------- */
export const fsGetLeads = () => getAllDocs<LeadInquiry>(COLLECTIONS.LEADS);
export const fsSaveLead = (lead: LeadInquiry) => upsertDoc(COLLECTIONS.LEADS, lead.id, lead);
export const fsDeleteLead = (id: string) => removeDoc(COLLECTIONS.LEADS, id);

/* ---------------- Subscribers ---------------- */
export const fsGetSubscribers = () => getAllDocs<Subscriber>(COLLECTIONS.SUBSCRIBERS);
export const fsSaveSubscriber = (sub: Subscriber) => upsertDoc(COLLECTIONS.SUBSCRIBERS, sub.id, sub);
export const fsDeleteSubscriber = (id: string) => removeDoc(COLLECTIONS.SUBSCRIBERS, id);

/* ---------------- Settings ---------------- */
export async function fsGetSettings(): Promise<SystemSettings | null> {
  try {
    const adminDb = getAdminFirestore();
    if (adminDb) {
      const snap = await withTimeout(
        adminDb.collection(COLLECTIONS.SETTINGS).doc("system").get(),
        3500,
        null
      );
      return snap && snap.exists ? (snap.data() as SystemSettings) : null;
    }

    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.SETTINGS, "system");
    const snapshot = await withTimeout(getDoc(docRef), 3500, null);
    if (snapshot && snapshot.exists()) {
      return snapshot.data() as SystemSettings;
    }
    return null;
  } catch (err) {
    console.warn("fsGetSettings warning:", err);
    return null;
  }
}

export const fsSaveSettings = (settings: SystemSettings) =>
  upsertDoc(COLLECTIONS.SETTINGS, "system", settings as Record<string, any>);

/* ---------------- Audit Logs ---------------- */
export const fsAddAuditLog = (log: AuditLog) => upsertDoc(COLLECTIONS.AUDIT_LOGS, log.id, log);

export async function fsGetAuditLogs(max = 50): Promise<AuditLog[]> {
  try {
    const adminDb = getAdminFirestore();
    if (adminDb) {
      const snap = await withTimeout(
        adminDb.collection(COLLECTIONS.AUDIT_LOGS).orderBy("timestamp", "desc").limit(max).get(),
        3500,
        null
      );
      if (!snap) return [];
      const logs: AuditLog[] = [];
      snap.forEach((d) => logs.push(d.data() as AuditLog));
      return logs;
    }

    const db = getFirestoreDb();
    const colRef = collection(db, COLLECTIONS.AUDIT_LOGS);
    const q = query(colRef, orderBy("timestamp", "desc"), limit(max));
    const snapshot = await withTimeout(getDocs(q), 3500, null);
    if (!snapshot) return [];
    const logs: AuditLog[] = [];
    snapshot.forEach((d) => logs.push(d.data() as AuditLog));
    return logs;
  } catch (err) {
    console.warn("fsGetAuditLogs warning:", err);
    return [];
  }
}

/* ---------------- Users ---------------- */
export const fsGetUsers = () => getAllDocs<UserAccount>(COLLECTIONS.USERS);

export async function fsGetUserById(id: string): Promise<UserAccount | null> {
  try {
    const adminDb = getAdminFirestore();
    if (adminDb) {
      const snap = await withTimeout(adminDb.collection(COLLECTIONS.USERS).doc(id).get(), 3500, null);
      return snap && snap.exists ? (snap.data() as UserAccount) : null;
    }

    const db = getFirestoreDb();
    const snap = await withTimeout(getDoc(doc(db, COLLECTIONS.USERS, id)), 3500, null);
    if (!snap || !snap.exists()) return null;
    return snap.data() as UserAccount;
  } catch (err) {
    console.warn("fsGetUserById warning:", err);
    return null;
  }
}

export const fsSaveUser = (user: UserAccount) => upsertDoc(COLLECTIONS.USERS, user.id, user);
export const fsDeleteUser = (id: string) => removeDoc(COLLECTIONS.USERS, id);

export async function fsSyncFullDatabase(database: AdminDatabase): Promise<{
  products: number;
  services: number;
  blogPosts: number;
  orders: number;
  coupons: number;
  leads: number;
  subscribers: number;
}> {
  for (const prod of database.products) {
    await fsSaveProduct(prod);
  }
  for (const svc of database.services) {
    await fsSaveService(svc);
  }
  for (const post of database.blogPosts) {
    await fsSaveBlogPost(post);
  }
  for (const order of database.orders) {
    await fsSaveOrder(order);
  }
  for (const coupon of database.coupons) {
    await fsSaveCoupon(coupon);
  }
  for (const lead of database.leads) {
    await fsSaveLead(lead);
  }
  for (const sub of database.subscribers) {
    await fsSaveSubscriber(sub);
  }
  for (const user of database.users || []) {
    await fsSaveUser(user);
  }
  if (database.settings) {
    await fsSaveSettings(database.settings);
  }

  return {
    products: database.products.length,
    services: database.services.length,
    blogPosts: database.blogPosts.length,
    orders: database.orders.length,
    coupons: database.coupons.length,
    leads: database.leads.length,
    subscribers: database.subscribers.length,
  };
}
