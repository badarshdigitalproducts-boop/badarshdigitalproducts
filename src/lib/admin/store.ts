import fs from "fs/promises";
import path from "path";
import { products as initialStaticProducts } from "@/content/products";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import type {
  AdminDatabase,
  AdminProduct,
  LeadInquiry,
  Subscriber,
  OrderRecord,
  SystemSettings,
  AuditLog,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const STORE_PATH = path.join(DATA_DIR, "admin-store.json");

// In-memory cache for ultra-fast response & edge fallback
let cachedDb: AdminDatabase | null = null;

function getDefaultSettings(): SystemSettings {
  return {
    siteName: "BADARSH Creative Studio",
    announcementBar: {
      enabled: true,
      badge: "LIMITED LAUNCH OFFER",
      text: "Get 50% off all Canva Templates with code",
      linkText: "CLAIM DISCOUNT",
      linkUrl: "/templates",
    },
    currencyRateUsdToInr: 86.5,
    whatsappNumber: WHATSAPP_NUMBER || "919876543210",
    supportEmail: "support@badarsh.com",
    maintenanceMode: false,
    lastBackupAt: new Date().toISOString(),
  };
}

function getSeedDatabase(): AdminDatabase {
  const seededProducts: AdminProduct[] = initialStaticProducts.map((p) => ({
    ...p,
    canvaUrl: p.gumroadUrl || `https://www.canva.com/design/templates/${p.slug}`,
    downloadUrl: `/downloads/${p.slug}.zip`,
    status: "published",
    updatedAt: new Date().toISOString(),
  }));

  const sampleLeads: LeadInquiry[] = [
    {
      id: "lead-001",
      name: "Aarav Sharma",
      email: "aarav.sharma@growthagency.in",
      phone: "+91 98234 56789",
      interest: "Video Editing",
      message:
        "Looking for a monthly retainer for 20 Instagram Reels and YouTube Shorts. Need cinematic grading and fast turnaround.",
      budget: "₹25,000 / month",
      status: "new",
      notes: "Founder of a D2C fitness brand. High-priority lead.",
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
    {
      id: "lead-002",
      name: "Priya Sundaram",
      email: "priya@sundaramdesign.com",
      phone: "+91 98450 12345",
      interest: "Website Building",
      message:
        "We need a modern, high-speed Next.js portfolio website for our interior architecture studio.",
      budget: "₹60,000 one-time",
      status: "contacted",
      notes: "Sent preliminary portfolio deck on WhatsApp. Scheduled discovery call for Thursday.",
      createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    },
    {
      id: "lead-003",
      name: "Vikram Malhotra",
      email: "vikram@malhotracapital.co",
      phone: "+91 99887 76655",
      interest: "Social Media Management",
      message:
        "Seeking complete organic management for LinkedIn and Instagram. We want thought-leadership carousels and founder branding.",
      budget: "₹45,000 / month",
      status: "proposal",
      notes: "Proposal draft #2 sent. Awaiting board approval.",
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    },
  ];

  const sampleSubscribers: Subscriber[] = [
    {
      id: "sub-001",
      email: "rohit.verma@gmail.com",
      source: "Homepage Hero Lead Magnet",
      status: "active",
      createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    },
    {
      id: "sub-002",
      email: "kavita.deshmukh@yahoo.in",
      source: "Footer Newsletter",
      status: "active",
      createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    },
    {
      id: "sub-003",
      email: "neha.patel@startupcollective.io",
      source: "Free Canva Templates Popup",
      status: "active",
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    },
  ];

  const sampleOrders: OrderRecord[] = [
    {
      id: "ORD-94812",
      customerName: "Aakash Mehta",
      customerEmail: "aakash@mehtaconsulting.com",
      customerPhone: "+91 98111 22233",
      items: [
        {
          id: "prod-002",
          title: "LinkedIn Carousel Templates",
          price: 399,
          quantity: 1,
        },
      ],
      totalAmount: 399,
      currency: "INR",
      paymentMethod: "UPI",
      paymentStatus: "completed",
      licenseKey: "BDRSH-LNKD-8821-X9",
      canvaAccessDelivered: true,
      createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    },
    {
      id: "ORD-94813",
      customerName: "Sneha Nair",
      customerEmail: "sneha.creatives@gmail.com",
      items: [
        {
          id: "prod-001",
          title: "Instagram Reels Template Pack",
          price: 299,
          quantity: 1,
        },
        {
          id: "prod-003",
          title: "Ultimate Brand Identity Kit",
          price: 499,
          quantity: 1,
        },
      ],
      totalAmount: 798,
      currency: "INR",
      paymentMethod: "Razorpay",
      paymentStatus: "completed",
      licenseKey: "BDRSH-BNDL-4412-M2",
      canvaAccessDelivered: true,
      createdAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    },
  ];

  const sampleLogs: AuditLog[] = [
    {
      id: "log-001",
      action: "SYSTEM_INITIALIZED",
      details: "BADARSH Admin Operating System initialized with 30 seeded templates.",
      timestamp: new Date().toISOString(),
    },
  ];

  return {
    products: seededProducts,
    leads: sampleLeads,
    subscribers: sampleSubscribers,
    orders: sampleOrders,
    settings: getDefaultSettings(),
    auditLogs: sampleLogs,
  };
}

export async function getDatabase(): Promise<AdminDatabase> {
  if (cachedDb) return cachedDb;

  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    cachedDb = JSON.parse(raw);
    return cachedDb!;
  } catch {
    // Initialize file if not found
    const seed = getSeedDatabase();
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(STORE_PATH, JSON.stringify(seed, null, 2), "utf8");
    } catch {
      // In serverless read-only environments fallback gracefully to memory
    }
    cachedDb = seed;
    return cachedDb;
  }
}

export async function saveDatabase(db: AdminDatabase): Promise<void> {
  cachedDb = db;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch (error) {
    console.warn("Failed to persist database to filesystem (serverless environment fallback):", error);
  }
}

/* ---------------- Products ---------------- */

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const db = await getDatabase();
  return db.products;
}

export async function saveAdminProduct(productData: Partial<AdminProduct> & { title: string }): Promise<AdminProduct> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  let product: AdminProduct;

  if (productData.id) {
    const idx = db.products.findIndex((p) => p.id === productData.id);
    if (idx >= 0) {
      product = {
        ...db.products[idx],
        ...productData,
        updatedAt: now,
      };
      db.products[idx] = product;
    } else {
      product = {
        ...productData,
        id: productData.id,
        slug: productData.slug || productData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: productData.description || "",
        longDescription: productData.longDescription || "",
        price: productData.price || 299,
        originalPrice: productData.originalPrice || 599,
        currency: productData.currency || "INR",
        category: productData.category || "social-media",
        tags: productData.tags || [],
        images: productData.images || ["/images/products/product-1.png"],
        features: productData.features || ["Fully editable in Canva Free"],
        rating: productData.rating || 5.0,
        reviewCount: productData.reviewCount || 1,
        downloads: productData.downloads || 0,
        isFeatured: Boolean(productData.isFeatured),
        isNew: true,
        isBestseller: Boolean(productData.isBestseller),
        format: productData.format || "Canva Template",
        status: productData.status || "published",
        createdAt: now,
        updatedAt: now,
      } as AdminProduct;
      db.products.unshift(product);
    }
  } else {
    const newId = `prod-${Date.now().toString(36)}`;
    product = {
      id: newId,
      slug: productData.slug || productData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: productData.title,
      description: productData.description || "",
      longDescription: productData.longDescription || "",
      price: productData.price || 299,
      originalPrice: productData.originalPrice || 599,
      currency: productData.currency || "INR",
      category: productData.category || "social-media",
      tags: productData.tags || [],
      images: productData.images || ["/images/products/product-1.png"],
      features: productData.features || ["Fully editable in Canva Free"],
      rating: 5.0,
      reviewCount: 1,
      downloads: 0,
      isFeatured: Boolean(productData.isFeatured),
      isNew: true,
      isBestseller: Boolean(productData.isBestseller),
      format: productData.format || "Canva Template",
      canvaUrl: productData.canvaUrl || "",
      downloadUrl: productData.downloadUrl || "",
      status: productData.status || "published",
      createdAt: now,
      updatedAt: now,
    };
    db.products.unshift(product);
  }

  await saveDatabase(db);
  return product;
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  const db = await getDatabase();
  const initialLength = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length !== initialLength) {
    await saveDatabase(db);
    return true;
  }
  return false;
}

/* ---------------- Leads CRM ---------------- */

export async function getLeads(): Promise<LeadInquiry[]> {
  const db = await getDatabase();
  return db.leads;
}

export async function addLead(data: {
  name: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
  budget?: string;
}): Promise<LeadInquiry> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const newLead: LeadInquiry = {
    id: `lead-${Date.now().toString(36)}`,
    ...data,
    status: "new",
    createdAt: now,
    updatedAt: now,
  };
  db.leads.unshift(newLead);
  await saveDatabase(db);
  return newLead;
}

export async function updateLead(id: string, updates: Partial<LeadInquiry>): Promise<LeadInquiry | undefined> {
  const db = await getDatabase();
  const idx = db.leads.findIndex((l) => l.id === id);
  if (idx < 0) return undefined;

  db.leads[idx] = {
    ...db.leads[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await saveDatabase(db);
  return db.leads[idx];
}

export async function deleteLead(id: string): Promise<boolean> {
  const db = await getDatabase();
  const len = db.leads.length;
  db.leads = db.leads.filter((l) => l.id !== id);
  if (db.leads.length !== len) {
    await saveDatabase(db);
    return true;
  }
  return false;
}

/* ---------------- Subscribers ---------------- */

export async function getSubscribers(): Promise<Subscriber[]> {
  const db = await getDatabase();
  return db.subscribers;
}

export async function addSubscriber(email: string, source = "Website"): Promise<Subscriber> {
  const db = await getDatabase();
  const existing = db.subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;

  const newSub: Subscriber = {
    id: `sub-${Date.now().toString(36)}`,
    email,
    source,
    status: "active",
    createdAt: new Date().toISOString(),
  };
  db.subscribers.unshift(newSub);
  await saveDatabase(db);
  return newSub;
}

export async function deleteSubscriber(id: string): Promise<boolean> {
  const db = await getDatabase();
  const len = db.subscribers.length;
  db.subscribers = db.subscribers.filter((s) => s.id !== id);
  if (db.subscribers.length !== len) {
    await saveDatabase(db);
    return true;
  }
  return false;
}

/* ---------------- Orders ---------------- */

export async function getOrders(): Promise<OrderRecord[]> {
  const db = await getDatabase();
  return db.orders;
}

/* ---------------- Settings ---------------- */

export async function getSystemSettings(): Promise<SystemSettings> {
  const db = await getDatabase();
  return db.settings;
}

export async function updateSystemSettings(updates: Partial<SystemSettings>): Promise<SystemSettings> {
  const db = await getDatabase();
  db.settings = {
    ...db.settings,
    ...updates,
  };
  await saveDatabase(db);
  return db.settings;
}

/* ---------------- Executive HUD Metrics ---------------- */

export async function getExecutiveHUD() {
  const db = await getDatabase();

  const totalProducts = db.products.length;
  const publishedProducts = db.products.filter((p) => p.status === "published").length;
  const totalDownloads = db.products.reduce((acc, p) => acc + (p.downloads || 0), 0);

  const totalRevenueINR = db.orders
    .filter((o) => o.paymentStatus === "completed")
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const newLeadsCount = db.leads.filter((l) => l.status === "new").length;
  const totalLeadsCount = db.leads.length;

  const totalSubscribersCount = db.subscribers.filter((s) => s.status === "active").length;

  return {
    metrics: {
      totalRevenueINR,
      totalDownloads,
      publishedProducts,
      totalProducts,
      newLeadsCount,
      totalLeadsCount,
      totalSubscribersCount,
    },
    recentLeads: db.leads.slice(0, 5),
    recentOrders: db.orders.slice(0, 5),
    recentSubscribers: db.subscribers.slice(0, 5),
    settings: db.settings,
  };
}

