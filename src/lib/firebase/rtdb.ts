/**
 * Firebase Realtime Database Integration for BADARSH
 * Real-time synchronization for products, orders, leads, coupons, settings, and subscribers.
 */

import {
  ref,
  set,
  get,
  remove,
  child,
  query,
  limitToLast,
  orderByChild,
} from "firebase/database";
import { getRealtimeDb } from "./config";
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

function withTimeout<T>(promise: Promise<T>, ms = 3500, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

/**
 * Health check & latency test for Firebase Realtime Database
 */
export async function checkRealtimeDbConnection(): Promise<{
  connected: boolean;
  latencyMs: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    const db = getRealtimeDb();
    const pingRef = ref(db, ".info/connected");
    const snapshot = await withTimeout(get(pingRef), 4000, null);
    const isConnected = snapshot?.val() !== false;
    return {
      connected: isConnected,
      latencyMs: Date.now() - start,
    };
  } catch (err: any) {
    let errorMsg = err?.message || "Failed to reach Firebase Realtime Database";
    if (errorMsg.includes("permission_denied") || errorMsg.includes("PERMISSION_DENIED")) {
      errorMsg =
        "Realtime Database Rules locked. In Firebase Console -> Realtime Database -> Rules, set: { \".read\": true, \".write\": true } and click Publish.";
    }
    return {
      connected: false,
      latencyMs: Date.now() - start,
      error: errorMsg,
    };
  }
}

/* ---------------- Products ---------------- */

export async function rtGetProducts(): Promise<AdminProduct[]> {
  try {
    const db = getRealtimeDb();
    const productsRef = ref(db, RT_PATHS.PRODUCTS);
    const snap = await withTimeout(get(productsRef), 3500, null);
    if (!snap || !snap.exists()) return [];
    const val = snap.val();
    return Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
  } catch (err) {
    console.warn("rtGetProducts warning:", err);
    return [];
  }
}

export async function rtSaveProduct(product: AdminProduct): Promise<void> {
  try {
    const db = getRealtimeDb();
    const productRef = ref(db, `${RT_PATHS.PRODUCTS}/${product.id}`);
    await withTimeout(set(productRef, product), 4000, undefined);
  } catch (err) {
    console.warn("rtSaveProduct warning:", err);
  }
}

export async function rtDeleteProduct(id: string): Promise<void> {
  try {
    const db = getRealtimeDb();
    const productRef = ref(db, `${RT_PATHS.PRODUCTS}/${id}`);
    await withTimeout(remove(productRef), 4000, undefined);
  } catch (err) {
    console.warn("rtDeleteProduct warning:", err);
  }
}

/* ---------------- Services ---------------- */

export async function rtGetServices(): Promise<AdminService[]> {
  try {
    const db = getRealtimeDb();
    const servicesRef = ref(db, RT_PATHS.SERVICES);
    const snap = await withTimeout(get(servicesRef), 3500, null);
    if (!snap || !snap.exists()) return [];
    const val = snap.val();
    return Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
  } catch (err) {
    console.warn("rtGetServices warning:", err);
    return [];
  }
}

export async function rtSaveService(service: AdminService): Promise<void> {
  try {
    const db = getRealtimeDb();
    const serviceRef = ref(db, `${RT_PATHS.SERVICES}/${service.id}`);
    await withTimeout(set(serviceRef, service), 4000, undefined);
  } catch (err) {
    console.warn("rtSaveService warning:", err);
  }
}

export async function rtDeleteService(id: string): Promise<void> {
  try {
    const db = getRealtimeDb();
    const serviceRef = ref(db, `${RT_PATHS.SERVICES}/${id}`);
    await withTimeout(remove(serviceRef), 4000, undefined);
  } catch (err) {
    console.warn("rtDeleteService warning:", err);
  }
}

/* ---------------- Blog Posts ---------------- */

export async function rtGetBlogPosts(): Promise<AdminBlogPost[]> {
  try {
    const db = getRealtimeDb();
    const blogRef = ref(db, RT_PATHS.BLOG);
    const snap = await withTimeout(get(blogRef), 3500, null);
    if (!snap || !snap.exists()) return [];
    const val = snap.val();
    return Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
  } catch (err) {
    console.warn("rtGetBlogPosts warning:", err);
    return [];
  }
}

export async function rtSaveBlogPost(post: AdminBlogPost): Promise<void> {
  try {
    const db = getRealtimeDb();
    const postRef = ref(db, `${RT_PATHS.BLOG}/${post.slug}`);
    await withTimeout(set(postRef, post), 4000, undefined);
  } catch (err) {
    console.warn("rtSaveBlogPost warning:", err);
  }
}

export async function rtDeleteBlogPost(slug: string): Promise<void> {
  try {
    const db = getRealtimeDb();
    const postRef = ref(db, `${RT_PATHS.BLOG}/${slug}`);
    await withTimeout(remove(postRef), 4000, undefined);
  } catch (err) {
    console.warn("rtDeleteBlogPost warning:", err);
  }
}

/* ---------------- Orders ---------------- */

export async function rtGetOrders(): Promise<OrderRecord[]> {
  try {
    const db = getRealtimeDb();
    const ordersRef = ref(db, RT_PATHS.ORDERS);
    const snap = await withTimeout(get(ordersRef), 3500, null);
    if (!snap || !snap.exists()) return [];
    const val = snap.val();
    return Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
  } catch (err) {
    console.warn("rtGetOrders warning:", err);
    return [];
  }
}

export async function rtSaveOrder(order: OrderRecord): Promise<void> {
  try {
    const db = getRealtimeDb();
    const orderRef = ref(db, `${RT_PATHS.ORDERS}/${order.id}`);
    await withTimeout(set(orderRef, order), 4000, undefined);
  } catch (err) {
    console.warn("rtSaveOrder warning:", err);
  }
}

export async function rtDeleteOrder(id: string): Promise<void> {
  try {
    const db = getRealtimeDb();
    const orderRef = ref(db, `${RT_PATHS.ORDERS}/${id}`);
    await withTimeout(remove(orderRef), 4000, undefined);
  } catch (err) {
    console.warn("rtDeleteOrder warning:", err);
  }
}

/* ---------------- Coupons ---------------- */

export async function rtGetCoupons(): Promise<AdminCoupon[]> {
  try {
    const db = getRealtimeDb();
    const couponsRef = ref(db, RT_PATHS.COUPONS);
    const snap = await withTimeout(get(couponsRef), 3500, null);
    if (!snap || !snap.exists()) return [];
    const val = snap.val();
    return Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
  } catch (err) {
    console.warn("rtGetCoupons warning:", err);
    return [];
  }
}

export async function rtSaveCoupon(coupon: AdminCoupon): Promise<void> {
  try {
    const db = getRealtimeDb();
    const couponRef = ref(db, `${RT_PATHS.COUPONS}/${coupon.id}`);
    await withTimeout(set(couponRef, coupon), 4000, undefined);
  } catch (err) {
    console.warn("rtSaveCoupon warning:", err);
  }
}

export async function rtDeleteCoupon(id: string): Promise<void> {
  try {
    const db = getRealtimeDb();
    const couponRef = ref(db, `${RT_PATHS.COUPONS}/${id}`);
    await withTimeout(remove(couponRef), 4000, undefined);
  } catch (err) {
    console.warn("rtDeleteCoupon warning:", err);
  }
}

/* ---------------- Leads ---------------- */

export async function rtGetLeads(): Promise<LeadInquiry[]> {
  try {
    const db = getRealtimeDb();
    const leadsRef = ref(db, RT_PATHS.LEADS);
    const snap = await withTimeout(get(leadsRef), 3500, null);
    if (!snap || !snap.exists()) return [];
    const val = snap.val();
    return Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
  } catch (err) {
    console.warn("rtGetLeads warning:", err);
    return [];
  }
}

export async function rtSaveLead(lead: LeadInquiry): Promise<void> {
  try {
    const db = getRealtimeDb();
    const leadRef = ref(db, `${RT_PATHS.LEADS}/${lead.id}`);
    await withTimeout(set(leadRef, lead), 4000, undefined);
  } catch (err) {
    console.warn("rtSaveLead warning:", err);
  }
}

export async function rtDeleteLead(id: string): Promise<void> {
  try {
    const db = getRealtimeDb();
    const leadRef = ref(db, `${RT_PATHS.LEADS}/${id}`);
    await withTimeout(remove(leadRef), 4000, undefined);
  } catch (err) {
    console.warn("rtDeleteLead warning:", err);
  }
}

/* ---------------- Subscribers ---------------- */

export async function rtGetSubscribers(): Promise<Subscriber[]> {
  try {
    const db = getRealtimeDb();
    const subsRef = ref(db, RT_PATHS.SUBSCRIBERS);
    const snap = await withTimeout(get(subsRef), 3500, null);
    if (!snap || !snap.exists()) return [];
    const val = snap.val();
    return Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
  } catch (err) {
    console.warn("rtGetSubscribers warning:", err);
    return [];
  }
}

export async function rtSaveSubscriber(subscriber: Subscriber): Promise<void> {
  try {
    const db = getRealtimeDb();
    const subRef = ref(db, `${RT_PATHS.SUBSCRIBERS}/${subscriber.id}`);
    await withTimeout(set(subRef, subscriber), 4000, undefined);
  } catch (err) {
    console.warn("rtSaveSubscriber warning:", err);
  }
}

export async function rtDeleteSubscriber(id: string): Promise<void> {
  try {
    const db = getRealtimeDb();
    const subRef = ref(db, `${RT_PATHS.SUBSCRIBERS}/${id}`);
    await withTimeout(remove(subRef), 4000, undefined);
  } catch (err) {
    console.warn("rtDeleteSubscriber warning:", err);
  }
}

/* ---------------- Settings ---------------- */

export async function rtGetSettings(): Promise<SystemSettings | null> {
  try {
    const db = getRealtimeDb();
    const settingsRef = ref(db, RT_PATHS.SETTINGS);
    const snap = await withTimeout(get(settingsRef), 3500, null);
    if (!snap || !snap.exists()) return null;
    return snap.val() as SystemSettings;
  } catch (err) {
    console.warn("rtGetSettings warning:", err);
    return null;
  }
}

export async function rtSaveSettings(settings: SystemSettings): Promise<void> {
  try {
    const db = getRealtimeDb();
    const settingsRef = ref(db, RT_PATHS.SETTINGS);
    await withTimeout(set(settingsRef, settings), 4000, undefined);
  } catch (err) {
    console.warn("rtSaveSettings warning:", err);
  }
}

/* ---------------- Users ---------------- */

export async function rtGetUsers(): Promise<UserAccount[]> {
  try {
    const db = getRealtimeDb();
    const snap = await withTimeout(get(ref(db, RT_PATHS.USERS)), 3500, null);
    if (!snap || !snap.exists()) return [];
    const val = snap.val();
    if (!val || typeof val !== "object") return [];
    return Object.values(val) as UserAccount[];
  } catch (err) {
    console.warn("rtGetUsers warning:", err);
    return [];
  }
}

export async function rtGetUserById(id: string): Promise<UserAccount | null> {
  try {
    const db = getRealtimeDb();
    const snap = await withTimeout(get(ref(db, `${RT_PATHS.USERS}/${id}`)), 3500, null);
    if (!snap || !snap.exists()) return null;
    return snap.val() as UserAccount;
  } catch (err) {
    console.warn("rtGetUserById warning:", err);
    return null;
  }
}

export async function rtSaveUser(user: UserAccount): Promise<void> {
  try {
    const db = getRealtimeDb();
    await withTimeout(set(ref(db, `${RT_PATHS.USERS}/${user.id}`), user), 4000, undefined);
  } catch (err) {
    console.warn("rtSaveUser warning:", err);
  }
}

export async function rtDeleteUser(id: string): Promise<void> {
  try {
    const db = getRealtimeDb();
    await withTimeout(remove(ref(db, `${RT_PATHS.USERS}/${id}`)), 4000, undefined);
  } catch (err) {
    console.warn("rtDeleteUser warning:", err);
  }
}

/* ---------------- Bulk Sync ---------------- */

export async function rtSyncFullDatabase(database: AdminDatabase): Promise<void> {
  try {
    const db = getRealtimeDb();
    const updates: Record<string, any> = {};

    for (const p of database.products) {
      updates[`${RT_PATHS.PRODUCTS}/${p.id}`] = p;
    }
    for (const s of database.services) {
      updates[`${RT_PATHS.SERVICES}/${s.id}`] = s;
    }
    for (const b of database.blogPosts) {
      updates[`${RT_PATHS.BLOG}/${b.slug}`] = b;
    }
    for (const o of database.orders) {
      updates[`${RT_PATHS.ORDERS}/${o.id}`] = o;
    }
    for (const c of database.coupons) {
      updates[`${RT_PATHS.COUPONS}/${c.id}`] = c;
    }
    for (const l of database.leads) {
      updates[`${RT_PATHS.LEADS}/${l.id}`] = l;
    }
    for (const sub of database.subscribers) {
      updates[`${RT_PATHS.SUBSCRIBERS}/${sub.id}`] = sub;
    }
    for (const user of database.users || []) {
      updates[`${RT_PATHS.USERS}/${user.id}`] = user;
    }
    if (database.settings) {
      updates[RT_PATHS.SETTINGS] = database.settings;
    }

    const rootRef = ref(db);
    await withTimeout(set(rootRef, updates), 6000, undefined);
  } catch (err) {
    console.warn("rtSyncFullDatabase warning:", err);
  }
}
