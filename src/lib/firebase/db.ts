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
} as const;

/**
 * Helper to ensure Firestore calls never hang serverless lambdas or throw unhandled exceptions
 */
function withTimeout<T>(promise: Promise<T>, ms = 3500, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

/**
 * Recursively cleans undefined properties from objects so Firestore never rejects the write
 */
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

/**
 * Health check & latency test for Firebase Firestore
 */
export async function checkFirebaseConnection(): Promise<{
  connected: boolean;
  latencyMs: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    const db = getFirestoreDb();
    const settingsDoc = doc(db, COLLECTIONS.SETTINGS, "system");
    await withTimeout(getDoc(settingsDoc), 4000, null);
    return {
      connected: true,
      latencyMs: Date.now() - start,
    };
  } catch (err: any) {
    let errorMsg = err?.message || "Failed to reach Firebase Firestore";
    if (errorMsg.includes("suspended") || errorMsg.includes("CONSUMER_SUSPENDED")) {
      errorMsg = "Firebase project is suspended in Google Cloud. Resume it at https://console.firebase.google.com/project/badarshdigiitalproducts";
    } else if (errorMsg.includes("permission-denied") || errorMsg.includes("PERMISSION_DENIED")) {
      errorMsg = "Firestore Rules locked. Enable Read/Write in Firebase Console -> Firestore Database -> Rules.";
    }
    return {
      connected: false,
      latencyMs: Date.now() - start,
      error: errorMsg,
    };
  }
}

/* ---------------- Products ---------------- */

export async function fsGetProducts(): Promise<AdminProduct[]> {
  try {
    const db = getFirestoreDb();
    const colRef = collection(db, COLLECTIONS.PRODUCTS);
    const fetchAction = async () => {
      const snapshot = await getDocs(colRef);
      const products: AdminProduct[] = [];
      snapshot.forEach((d) => {
        products.push(d.data() as AdminProduct);
      });
      return products;
    };
    return await withTimeout(fetchAction(), 3500, []);
  } catch (err) {
    console.warn("fsGetProducts warning:", err);
    return [];
  }
}

export async function fsSaveProduct(product: AdminProduct): Promise<void> {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.PRODUCTS, product.id);
    const cleaned = cleanForFirestore(product as any);
    await withTimeout(setDoc(docRef, cleaned, { merge: true }), 4000, undefined);
  } catch (err) {
    console.warn("fsSaveProduct warning:", err);
  }
}

export async function fsDeleteProduct(id: string): Promise<void> {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
    await withTimeout(deleteDoc(docRef), 4000, undefined);
  } catch (err) {
    console.warn("fsDeleteProduct warning:", err);
  }
}

/* ---------------- Services ---------------- */

export async function fsGetServices(): Promise<AdminService[]> {
  try {
    const db = getFirestoreDb();
    const colRef = collection(db, COLLECTIONS.SERVICES);
    const fetchAction = async () => {
      const snapshot = await getDocs(colRef);
      const services: AdminService[] = [];
      snapshot.forEach((d) => {
        services.push(d.data() as AdminService);
      });
      return services;
    };
    return await withTimeout(fetchAction(), 3500, []);
  } catch (err) {
    console.warn("fsGetServices warning:", err);
    return [];
  }
}

export async function fsSaveService(service: AdminService): Promise<void> {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.SERVICES, service.id);
    const cleaned = cleanForFirestore(service as any);
    await withTimeout(setDoc(docRef, cleaned, { merge: true }), 4000, undefined);
  } catch (err) {
    console.warn("fsSaveService warning:", err);
  }
}

export async function fsDeleteService(id: string): Promise<void> {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.SERVICES, id);
    await withTimeout(deleteDoc(docRef), 4000, undefined);
  } catch (err) {
    console.warn("fsDeleteService warning:", err);
  }
}

/* ---------------- Blog Posts ---------------- */

export async function fsGetBlogPosts(): Promise<AdminBlogPost[]> {
  try {
    const db = getFirestoreDb();
    const colRef = collection(db, COLLECTIONS.BLOG);
    const fetchAction = async () => {
      const snapshot = await getDocs(colRef);
      const posts: AdminBlogPost[] = [];
      snapshot.forEach((d) => {
        posts.push(d.data() as AdminBlogPost);
      });
      return posts;
    };
    return await withTimeout(fetchAction(), 3500, []);
  } catch (err) {
    console.warn("fsGetBlogPosts warning:", err);
    return [];
  }
}

export async function fsSaveBlogPost(post: AdminBlogPost): Promise<void> {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.BLOG, post.slug);
    const cleaned = cleanForFirestore(post as any);
    await withTimeout(setDoc(docRef, cleaned, { merge: true }), 4000, undefined);
  } catch (err) {
    console.warn("fsSaveBlogPost warning:", err);
  }
}

export async function fsDeleteBlogPost(slug: string): Promise<void> {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.BLOG, slug);
    await withTimeout(deleteDoc(docRef), 4000, undefined);
  } catch (err) {
    console.warn("fsDeleteBlogPost warning:", err);
  }
}

/* ---------------- Orders ---------------- */

export async function fsGetOrders(): Promise<OrderRecord[]> {
  try {
    const db = getFirestoreDb();
    const colRef = collection(db, COLLECTIONS.ORDERS);
    const fetchAction = async () => {
      const snapshot = await getDocs(colRef);
      const orders: OrderRecord[] = [];
      snapshot.forEach((d) => {
        orders.push(d.data() as OrderRecord);
      });
      return orders;
    };
    return await withTimeout(fetchAction(), 3500, []);
  } catch (err) {
    console.warn("fsGetOrders warning:", err);
    return [];
  }
}

export async function fsSaveOrder(order: OrderRecord): Promise<void> {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.ORDERS, order.id);
    const cleaned = cleanForFirestore(order as any);
    await withTimeout(setDoc(docRef, cleaned, { merge: true }), 4000, undefined);
  } catch (err) {
    console.warn("fsSaveOrder warning:", err);
  }
}

export async function fsDeleteOrder(id: string): Promise<void> {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.ORDERS, id);
    await withTimeout(deleteDoc(docRef), 4000, undefined);
  } catch (err) {
    console.warn("fsDeleteOrder warning:", err);
  }
}

/* ---------------- Coupons ---------------- */

export async function fsGetCoupons(): Promise<AdminCoupon[]> {
  try {
    const db = getFirestoreDb();
    const colRef = collection(db, COLLECTIONS.COUPONS);
    const fetchAction = async () => {
      const snapshot = await getDocs(colRef);
      const coupons: AdminCoupon[] = [];
      snapshot.forEach((d) => {
        coupons.push(d.data() as AdminCoupon);
      });
      return coupons;
    };
    return await withTimeout(fetchAction(), 3500, []);
  } catch (err) {
    console.warn("fsGetCoupons warning:", err);
    return [];
  }
}

export async function fsSaveCoupon(coupon: AdminCoupon): Promise<void> {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.COUPONS, coupon.id);
    const cleaned = cleanForFirestore(coupon as any);
    await withTimeout(setDoc(docRef, cleaned, { merge: true }), 4000, undefined);
  } catch (err) {
    console.warn("fsSaveCoupon warning:", err);
  }
}

export async function fsDeleteCoupon(id: string): Promise<void> {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.COUPONS, id);
    await withTimeout(deleteDoc(docRef), 4000, undefined);
  } catch (err) {
    console.warn("fsDeleteCoupon warning:", err);
  }
}

/* ---------------- Leads ---------------- */

export async function fsGetLeads(): Promise<LeadInquiry[]> {
  try {
    const db = getFirestoreDb();
    const colRef = collection(db, COLLECTIONS.LEADS);
    const fetchAction = async () => {
      const snapshot = await getDocs(colRef);
      const leads: LeadInquiry[] = [];
      snapshot.forEach((d) => {
        leads.push(d.data() as LeadInquiry);
      });
      return leads;
    };
    return await withTimeout(fetchAction(), 3500, []);
  } catch (err) {
    console.warn("fsGetLeads warning:", err);
    return [];
  }
}

export async function fsSaveLead(lead: LeadInquiry): Promise<void> {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.LEADS, lead.id);
    await withTimeout(setDoc(docRef, lead, { merge: true }), 4000, undefined);
  } catch (err) {
    console.warn("fsSaveLead warning:", err);
  }
}

export async function fsDeleteLead(id: string): Promise<void> {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.LEADS, id);
    await withTimeout(deleteDoc(docRef), 4000, undefined);
  } catch (err) {
    console.warn("fsDeleteLead warning:", err);
  }
}

/* ---------------- Subscribers ---------------- */

export async function fsGetSubscribers(): Promise<Subscriber[]> {
  try {
    const db = getFirestoreDb();
    const colRef = collection(db, COLLECTIONS.SUBSCRIBERS);
    const fetchAction = async () => {
      const snapshot = await getDocs(colRef);
      const subscribers: Subscriber[] = [];
      snapshot.forEach((d) => {
        subscribers.push(d.data() as Subscriber);
      });
      return subscribers;
    };
    return await withTimeout(fetchAction(), 3500, []);
  } catch (err) {
    console.warn("fsGetSubscribers warning:", err);
    return [];
  }
}

export async function fsSaveSubscriber(sub: Subscriber): Promise<void> {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.SUBSCRIBERS, sub.id);
    await withTimeout(setDoc(docRef, sub, { merge: true }), 4000, undefined);
  } catch (err) {
    console.warn("fsSaveSubscriber warning:", err);
  }
}

export async function fsDeleteSubscriber(id: string): Promise<void> {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.SUBSCRIBERS, id);
    await withTimeout(deleteDoc(docRef), 4000, undefined);
  } catch (err) {
    console.warn("fsDeleteSubscriber warning:", err);
  }
}

/* ---------------- Settings ---------------- */

export async function fsGetSettings(): Promise<SystemSettings | null> {
  try {
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

export async function fsSaveSettings(settings: SystemSettings): Promise<void> {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.SETTINGS, "system");
    await withTimeout(setDoc(docRef, settings, { merge: true }), 4000, undefined);
  } catch (err) {
    console.warn("fsSaveSettings warning:", err);
  }
}

/* ---------------- Audit Logs ---------------- */

export async function fsAddAuditLog(log: AuditLog): Promise<void> {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, COLLECTIONS.AUDIT_LOGS, log.id);
    await withTimeout(setDoc(docRef, log), 3000, undefined);
  } catch (err) {
    console.warn("fsAddAuditLog warning:", err);
  }
}

export async function fsGetAuditLogs(max = 50): Promise<AuditLog[]> {
  try {
    const db = getFirestoreDb();
    const colRef = collection(db, COLLECTIONS.AUDIT_LOGS);
    const q = query(colRef, orderBy("timestamp", "desc"), limit(max));
    const snapshot = await withTimeout(getDocs(q), 3500, null);
    if (!snapshot) return [];
    const logs: AuditLog[] = [];
    snapshot.forEach((d) => {
      logs.push(d.data() as AuditLog);
    });
    return logs;
  } catch (err) {
    console.warn("fsGetAuditLogs warning:", err);
    return [];
  }
}

/**
 * Sync entire local database to Firebase Firestore in bulk
 */
export async function fsSyncFullDatabase(database: AdminDatabase): Promise<{
  products: number;
  services: number;
  blogPosts: number;
  orders: number;
  coupons: number;
  leads: number;
  subscribers: number;
}> {
  const db = getFirestoreDb();

  // 1. Products
  for (const prod of database.products) {
    await setDoc(doc(db, COLLECTIONS.PRODUCTS, prod.id), prod, { merge: true });
  }

  // 2. Services
  for (const svc of database.services) {
    await setDoc(doc(db, COLLECTIONS.SERVICES, svc.id), svc, { merge: true });
  }

  // 3. Blog Posts
  for (const post of database.blogPosts) {
    await setDoc(doc(db, COLLECTIONS.BLOG, post.slug), post, { merge: true });
  }

  // 4. Orders
  for (const order of database.orders) {
    await setDoc(doc(db, COLLECTIONS.ORDERS, order.id), order, { merge: true });
  }

  // 5. Coupons
  for (const coupon of database.coupons) {
    await setDoc(doc(db, COLLECTIONS.COUPONS, coupon.id), coupon, { merge: true });
  }

  // 6. Leads
  for (const lead of database.leads) {
    await setDoc(doc(db, COLLECTIONS.LEADS, lead.id), lead, { merge: true });
  }

  // 7. Subscribers
  for (const sub of database.subscribers) {
    await setDoc(doc(db, COLLECTIONS.SUBSCRIBERS, sub.id), sub, { merge: true });
  }

  // 8. Settings
  if (database.settings) {
    await setDoc(doc(db, COLLECTIONS.SETTINGS, "system"), database.settings, { merge: true });
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
