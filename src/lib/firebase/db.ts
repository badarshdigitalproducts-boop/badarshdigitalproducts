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
    await getDoc(settingsDoc);
    return {
      connected: true,
      latencyMs: Date.now() - start,
    };
  } catch (err: any) {
    return {
      connected: false,
      latencyMs: Date.now() - start,
      error: err?.message || "Failed to reach Firebase Firestore",
    };
  }
}

/* ---------------- Products ---------------- */

export async function fsGetProducts(): Promise<AdminProduct[]> {
  const db = getFirestoreDb();
  const colRef = collection(db, COLLECTIONS.PRODUCTS);
  const snapshot = await getDocs(colRef);
  const products: AdminProduct[] = [];
  snapshot.forEach((doc) => {
    products.push(doc.data() as AdminProduct);
  });
  return products;
}

export async function fsSaveProduct(product: AdminProduct): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTIONS.PRODUCTS, product.id);
  await setDoc(docRef, product, { merge: true });
}

export async function fsDeleteProduct(id: string): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
  await deleteDoc(docRef);
}

/* ---------------- Services ---------------- */

export async function fsGetServices(): Promise<AdminService[]> {
  const db = getFirestoreDb();
  const colRef = collection(db, COLLECTIONS.SERVICES);
  const snapshot = await getDocs(colRef);
  const services: AdminService[] = [];
  snapshot.forEach((doc) => {
    services.push(doc.data() as AdminService);
  });
  return services;
}

export async function fsSaveService(service: AdminService): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTIONS.SERVICES, service.id);
  await setDoc(docRef, service, { merge: true });
}

export async function fsDeleteService(id: string): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTIONS.SERVICES, id);
  await deleteDoc(docRef);
}

/* ---------------- Blog Posts ---------------- */

export async function fsGetBlogPosts(): Promise<AdminBlogPost[]> {
  const db = getFirestoreDb();
  const colRef = collection(db, COLLECTIONS.BLOG);
  const snapshot = await getDocs(colRef);
  const posts: AdminBlogPost[] = [];
  snapshot.forEach((doc) => {
    posts.push(doc.data() as AdminBlogPost);
  });
  return posts;
}

export async function fsSaveBlogPost(post: AdminBlogPost): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTIONS.BLOG, post.slug);
  await setDoc(docRef, post, { merge: true });
}

export async function fsDeleteBlogPost(slug: string): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTIONS.BLOG, slug);
  await deleteDoc(docRef);
}

/* ---------------- Orders ---------------- */

export async function fsGetOrders(): Promise<OrderRecord[]> {
  const db = getFirestoreDb();
  const colRef = collection(db, COLLECTIONS.ORDERS);
  const snapshot = await getDocs(colRef);
  const orders: OrderRecord[] = [];
  snapshot.forEach((doc) => {
    orders.push(doc.data() as OrderRecord);
  });
  return orders;
}

export async function fsSaveOrder(order: OrderRecord): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTIONS.ORDERS, order.id);
  await setDoc(docRef, order, { merge: true });
}

export async function fsDeleteOrder(id: string): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTIONS.ORDERS, id);
  await deleteDoc(docRef);
}

/* ---------------- Coupons ---------------- */

export async function fsGetCoupons(): Promise<AdminCoupon[]> {
  const db = getFirestoreDb();
  const colRef = collection(db, COLLECTIONS.COUPONS);
  const snapshot = await getDocs(colRef);
  const coupons: AdminCoupon[] = [];
  snapshot.forEach((doc) => {
    coupons.push(doc.data() as AdminCoupon);
  });
  return coupons;
}

export async function fsSaveCoupon(coupon: AdminCoupon): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTIONS.COUPONS, coupon.id);
  await setDoc(docRef, coupon, { merge: true });
}

export async function fsDeleteCoupon(id: string): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTIONS.COUPONS, id);
  await deleteDoc(docRef);
}

/* ---------------- Leads ---------------- */

export async function fsGetLeads(): Promise<LeadInquiry[]> {
  const db = getFirestoreDb();
  const colRef = collection(db, COLLECTIONS.LEADS);
  const snapshot = await getDocs(colRef);
  const leads: LeadInquiry[] = [];
  snapshot.forEach((doc) => {
    leads.push(doc.data() as LeadInquiry);
  });
  return leads;
}

export async function fsSaveLead(lead: LeadInquiry): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTIONS.LEADS, lead.id);
  await setDoc(docRef, lead, { merge: true });
}

export async function fsDeleteLead(id: string): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTIONS.LEADS, id);
  await deleteDoc(docRef);
}

/* ---------------- Subscribers ---------------- */

export async function fsGetSubscribers(): Promise<Subscriber[]> {
  const db = getFirestoreDb();
  const colRef = collection(db, COLLECTIONS.SUBSCRIBERS);
  const snapshot = await getDocs(colRef);
  const subscribers: Subscriber[] = [];
  snapshot.forEach((doc) => {
    subscribers.push(doc.data() as Subscriber);
  });
  return subscribers;
}

export async function fsSaveSubscriber(sub: Subscriber): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTIONS.SUBSCRIBERS, sub.id);
  await setDoc(docRef, sub, { merge: true });
}

export async function fsDeleteSubscriber(id: string): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTIONS.SUBSCRIBERS, id);
  await deleteDoc(docRef);
}

/* ---------------- Settings ---------------- */

export async function fsGetSettings(): Promise<SystemSettings | null> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTIONS.SETTINGS, "system");
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshot.data() as SystemSettings;
  }
  return null;
}

export async function fsSaveSettings(settings: SystemSettings): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTIONS.SETTINGS, "system");
  await setDoc(docRef, settings, { merge: true });
}

/* ---------------- Audit Logs ---------------- */

export async function fsAddAuditLog(log: AuditLog): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COLLECTIONS.AUDIT_LOGS, log.id);
  await setDoc(docRef, log);
}

export async function fsGetAuditLogs(max = 50): Promise<AuditLog[]> {
  const db = getFirestoreDb();
  const colRef = collection(db, COLLECTIONS.AUDIT_LOGS);
  const q = query(colRef, orderBy("timestamp", "desc"), limit(max));
  const snapshot = await getDocs(q);
  const logs: AuditLog[] = [];
  snapshot.forEach((doc) => {
    logs.push(doc.data() as AuditLog);
  });
  return logs;
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
