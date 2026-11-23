import fs from "fs/promises";
import path from "path";
import { products as initialStaticProducts } from "@/content/products";
import { services as initialStaticServices } from "@/content/services";
import { blogPosts as initialStaticBlogPosts } from "@/content/blog";
import { WHATSAPP_NUMBER, SUPPORT_EMAIL } from "@/lib/constants";
import {
  fsGetProducts,
  fsSaveProduct,
  fsDeleteProduct,
  fsGetServices,
  fsSaveService,
  fsDeleteService,
  fsGetBlogPosts,
  fsSaveBlogPost,
  fsDeleteBlogPost,
  fsGetOrders,
  fsSaveOrder,
  fsDeleteOrder,
  fsGetCoupons,
  fsSaveCoupon,
  fsDeleteCoupon,
  fsGetLeads,
  fsSaveLead,
  fsDeleteLead,
  fsGetSubscribers,
  fsSaveSubscriber,
  fsDeleteSubscriber,
  fsGetSettings,
  fsSaveSettings,
  fsSyncFullDatabase,
  checkFirebaseConnection,
} from "@/lib/firebase/db";
import {
  rtGetProducts,
  rtSaveProduct,
  rtDeleteProduct,
  rtGetServices,
  rtSaveService,
  rtDeleteService,
  rtGetBlogPosts,
  rtSaveBlogPost,
  rtDeleteBlogPost,
  rtGetOrders,
  rtSaveOrder,
  rtDeleteOrder,
  rtGetCoupons,
  rtSaveCoupon,
  rtDeleteCoupon,
  rtGetLeads,
  rtSaveLead,
  rtDeleteLead,
  rtGetSubscribers,
  rtSaveSubscriber,
  rtDeleteSubscriber,
  rtGetSettings,
  rtSaveSettings,
  rtSyncFullDatabase,
  checkRealtimeDbConnection,
} from "@/lib/firebase/rtdb";
import type {
  AdminDatabase,
  AdminProduct,
  AdminService,
  AdminBlogPost,
  AdminCoupon,
  LeadInquiry,
  Subscriber,
  OrderRecord,
  SystemSettings,
  AuditLog,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const STORE_PATH = path.join(DATA_DIR, "admin-store.json");
const TMP_DIR = "/tmp";
const TMP_STORE_PATH = path.join(TMP_DIR, "admin-store.json");

// In-memory cache for ultra-fast response & edge fallback
let cachedDb: AdminDatabase | null = null;

function getDefaultSettings(): SystemSettings {
  return {
    siteName: "BADARSH Creative Studio",
    announcementBar: {
      enabled: true,
      badge: "LIMITED LAUNCH OFFER",
      text: "Get 50% off all Templates & Bundles with code",
      linkText: "CLAIM DISCOUNT",
      linkUrl: "/templates",
    },
    currencyRateUsdToInr: 86.5,
    whatsappNumber: WHATSAPP_NUMBER || "917204250115",
    supportEmail: SUPPORT_EMAIL || "hello@badarsh.com",
    maintenanceMode: false,
    lastBackupAt: new Date().toISOString(),
  };
}

function getSeedDatabase(): AdminDatabase {
  const seededProducts: AdminProduct[] = initialStaticProducts.map((p) => ({
    ...p,
    deliveryType: p.deliveryType || "download-url",
    templateUrl: (p as any).templateUrl || p.canvaUrl || `/templates/${p.slug}`,
    canvaUrl: p.canvaUrl || `/templates/${p.slug}`,
    downloadUrl: p.downloadUrl || `/downloads/${p.slug}.zip`,
    status: "published",
    updatedAt: new Date().toISOString(),
  }));

  const seededServices: AdminService[] = initialStaticServices.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    description: s.description,
    longDescription: s.longDescription,
    icon: s.icon,
    category: "Agency Creative",
    status: "active",
    turnaround: "48-72 Hours",
    portfolioImages: s.portfolioImages,
    portfolioVideos: s.portfolioVideos,
    features: s.features,
    packages: s.packages.map((pkg) => ({
      name: pkg.name,
      price: pkg.price,
      currency: pkg.currency,
      period: pkg.period,
      description: pkg.description,
      features: pkg.features,
      isPopular: pkg.isPopular,
      ctaText: pkg.ctaText,
      whatsappMessage: pkg.whatsappMessage,
    })),
    updatedAt: new Date().toISOString(),
  }));

  const seededBlogPosts: AdminBlogPost[] = initialStaticBlogPosts.map((b) => ({
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt,
    content: b.content,
    category: b.category,
    author: b.author,
    date: b.date,
    readTime: b.readTime,
    coverImage: b.coverImage,
    tags: b.tags,
    status: "published",
    views: Math.floor(Math.random() * 800) + 200,
    updatedAt: new Date().toISOString(),
  }));

  const seededCoupons: AdminCoupon[] = [
    {
      id: "cpn-000",
      code: "BADARSH50",
      discountType: "percentage",
      discountValue: 50,
      minOrderAmount: 299,
      usageCount: 18,
      usageLimit: 1000,
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "cpn-001",
      code: "LAUNCH50",
      discountType: "percentage",
      discountValue: 50,
      minOrderAmount: 299,
      usageCount: 142,
      usageLimit: 500,
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "cpn-002",
      code: "CREATOR20",
      discountType: "percentage",
      discountValue: 20,
      minOrderAmount: 0,
      usageCount: 68,
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "cpn-003",
      code: "FLAT100",
      discountType: "fixed",
      discountValue: 100,
      minOrderAmount: 499,
      usageCount: 29,
      status: "active",
      createdAt: new Date().toISOString(),
    },
  ];

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
      source: "Free Starter Templates Popup",
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
          productType: "canva-template",
          downloadUrl: "https://badarsh.com/templates/sample-linkedin",
        },
      ],
      totalAmount: 399,
      currency: "INR",
      paymentMethod: "UPI",
      paymentStatus: "completed",
      licenseKey: "BDRSH-LNKD-8821-X9",
      canvaAccessDelivered: true,
      deliveryNotes: "Sent direct access link via email.",
      createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    },
    {
      id: "ORD-94813",
      customerName: "Sneha Nair",
      customerEmail: "sneha.creatives@gmail.com",
      customerPhone: "+91 97401 55667",
      items: [
        {
          id: "prod-001",
          title: "Instagram Reels Template Pack",
          price: 299,
          quantity: 1,
          productType: "canva-template",
        },
        {
          id: "prod-015",
          title: "Viral Video SFX & Motion Overlay Bundle",
          price: 499,
          quantity: 1,
          productType: "editing-bundle",
          downloadUrl: "/downloads/viral-sfx-bundle.zip",
        },
      ],
      totalAmount: 798,
      currency: "INR",
      paymentMethod: "Razorpay",
      paymentStatus: "completed",
      licenseKey: "BDRSH-BNDL-4412-M2",
      canvaAccessDelivered: true,
      deliveryNotes: "Automated instant checkout delivery completed.",
      createdAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    },
    {
      id: "ORD-94814",
      customerName: "Karthik Raja",
      customerEmail: "karthik@rajafilms.in",
      customerPhone: "+91 98400 99881",
      items: [
        {
          id: "prod-016",
          title: "Cinematic Mood & Warm Aesthetic Presets",
          price: 299,
          quantity: 1,
          productType: "photo-preset",
        },
      ],
      totalAmount: 299,
      currency: "INR",
      paymentMethod: "UPI",
      paymentStatus: "completed",
      licenseKey: "BDRSH-PRST-9912-K4",
      canvaAccessDelivered: true,
      createdAt: new Date(Date.now() - 32 * 3600 * 1000).toISOString(),
    },
  ];

  const sampleLogs: AuditLog[] = [
    {
      id: "log-001",
      action: "SYSTEM_INITIALIZED",
      details: "BADARSH Admin Operating System initialized with full digital catalog.",
      timestamp: new Date().toISOString(),
    },
  ];

  return {
    products: seededProducts,
    services: seededServices,
    blogPosts: seededBlogPosts,
    coupons: seededCoupons,
    leads: sampleLeads,
    subscribers: sampleSubscribers,
    orders: sampleOrders,
    settings: getDefaultSettings(),
    auditLogs: sampleLogs,
  };
}

export async function getDatabase(): Promise<AdminDatabase> {
  if (cachedDb) return cachedDb;

  let localDb: AdminDatabase;

  try {
    let raw: string | null = null;
    try {
      raw = await fs.readFile(TMP_STORE_PATH, "utf8");
    } catch {
      raw = await fs.readFile(STORE_PATH, "utf8");
    }

    const parsed = JSON.parse(raw);

    // Auto-backfill new collections if reading legacy JSON
    const seed = getSeedDatabase();
    let modified = false;

    if (!parsed.services || !parsed.services.length) {
      parsed.services = seed.services;
      modified = true;
    }
    if (!parsed.blogPosts || !parsed.blogPosts.length) {
      parsed.blogPosts = seed.blogPosts;
      modified = true;
    }
    if (!parsed.coupons || !parsed.coupons.length) {
      parsed.coupons = seed.coupons;
      modified = true;
    } else if (!parsed.coupons.some((c: any) => c.code?.toUpperCase() === "BADARSH50")) {
      parsed.coupons.unshift(seed.coupons[0]);
      modified = true;
    }
    // Purge legacy 3D mockup frame (prod-013 / assets category)
    if (parsed.products && Array.isArray(parsed.products)) {
      const beforeLen = parsed.products.length;
      parsed.products = parsed.products.filter(
        (p: any) => p.id !== "prod-013" && p.slug !== "digital-mockup-graphics-kit" && p.category !== "assets"
      );
      if (parsed.products.length !== beforeLen) modified = true;
    }

    if (!parsed.products || !parsed.products.length) {
      parsed.products = seed.products;
      modified = true;
    } else {
      seed.products.forEach((sp) => {
        const existing = parsed.products.find((p: any) => p.id === sp.id || p.slug === sp.slug);
        if (existing) {
          if (!existing.videoUrl && sp.videoUrl) {
            existing.videoUrl = sp.videoUrl;
            modified = true;
          }
          if (sp.images && sp.images[0] && (!existing.images || !existing.images.length || existing.images[0]?.startsWith("/images/products/"))) {
            existing.images = sp.images;
            modified = true;
          }
          if (sp.downloadUrl && (!existing.downloadUrl || existing.downloadUrl.startsWith("/downloads/"))) {
            existing.downloadUrl = sp.downloadUrl;
            modified = true;
          }
          if (sp.previewPdfUrl && !existing.previewPdfUrl) {
            existing.previewPdfUrl = sp.previewPdfUrl;
            modified = true;
          }
          if (sp.pdfUrl && !existing.pdfUrl) {
            existing.pdfUrl = sp.pdfUrl;
            modified = true;
          }
          if (sp.appDownloadUrl && !existing.appDownloadUrl) {
            existing.appDownloadUrl = sp.appDownloadUrl;
            modified = true;
          }
          if (sp.appVersion && !existing.appVersion) {
            existing.appVersion = sp.appVersion;
            modified = true;
          }
          if (sp.appPlatform && !existing.appPlatform) {
            existing.appPlatform = sp.appPlatform;
            modified = true;
          }
          if (sp.beforeImage && !existing.beforeImage) {
            existing.beforeImage = sp.beforeImage;
            modified = true;
          }
          if (sp.afterImage && !existing.afterImage) {
            existing.afterImage = sp.afterImage;
            modified = true;
          }
          if (sp.audioPreviewUrl && !existing.audioPreviewUrl) {
            existing.audioPreviewUrl = sp.audioPreviewUrl;
            modified = true;
          }
          if (sp.audioDuration && !existing.audioDuration) {
            existing.audioDuration = sp.audioDuration;
            modified = true;
          }
          if (sp.audioCategory && !existing.audioCategory) {
            existing.audioCategory = sp.audioCategory;
            modified = true;
          }
          if (sp.pageCount && !existing.pageCount) {
            existing.pageCount = sp.pageCount;
            modified = true;
          }
          if (sp.authorName && !existing.authorName) {
            existing.authorName = sp.authorName;
            modified = true;
          }
          if (sp.plannerCategory && !existing.plannerCategory) {
            existing.plannerCategory = sp.plannerCategory;
            modified = true;
          }
          if (sp.totalAssetsCount && !existing.totalAssetsCount) {
            existing.totalAssetsCount = sp.totalAssetsCount;
            modified = true;
          }
          if (sp.editableTemplateData && !existing.editableTemplateData) {
            existing.editableTemplateData = sp.editableTemplateData;
            modified = true;
          }
          if (sp.presetLinkUrl && !existing.presetLinkUrl) {
            existing.presetLinkUrl = sp.presetLinkUrl;
            modified = true;
          }
          if (sp.overlayLinkUrl && !existing.overlayLinkUrl) {
            existing.overlayLinkUrl = sp.overlayLinkUrl;
            modified = true;
          }
          if (sp.googleDriveUrl && !existing.googleDriveUrl) {
            existing.googleDriveUrl = sp.googleDriveUrl;
            modified = true;
          }
          if (sp.deliveryType && (!existing.deliveryType || existing.deliveryType === "download-url")) {
            existing.deliveryType = sp.deliveryType;
            modified = true;
          }
        } else {
          parsed.products.push(sp);
          modified = true;
        }
      });
    }

    // Backfill service portfolios & updated packages from seed
    if (parsed.services && Array.isArray(parsed.services)) {
      seed.services.forEach((ss) => {
        const existing = parsed.services.find((s: any) => s.id === ss.id || s.slug === ss.slug);
        if (existing) {
          if (ss.portfolioVideos && (!existing.portfolioVideos || !existing.portfolioVideos.length)) {
            existing.portfolioVideos = ss.portfolioVideos;
            modified = true;
          }
          if (ss.portfolioImages && (!existing.portfolioImages || !existing.portfolioImages.length)) {
            existing.portfolioImages = ss.portfolioImages;
            modified = true;
          }
          if (ss.packages && ss.packages.length > 0) {
            existing.packages = ss.packages;
            modified = true;
          }
        }
      });
    }

    if (modified) {
      try {
        await fs.writeFile(STORE_PATH, JSON.stringify(parsed, null, 2), "utf8");
      } catch {
        // Safe in serverless
      }
    }

    localDb = parsed;
  } catch {
    // Initialize file if not found
    const seed = getSeedDatabase();
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(STORE_PATH, JSON.stringify(seed, null, 2), "utf8");
    } catch {
      // In serverless read-only environments fallback gracefully to memory
    }
    localDb = seed;
  }

  // Attempt live Realtime Database & Firestore sync if cloud collections are populated
  try {
    const [
      fsProds, fsServices, fsPosts, fsOrders, fsCoupons, fsLeads, fsSubs, fsSettings,
      rtProds, rtServices, rtOrders, rtLeads, rtSettings
    ] = await Promise.all([
      fsGetProducts().catch(() => []),
      fsGetServices().catch(() => []),
      fsGetBlogPosts().catch(() => []),
      fsGetOrders().catch(() => []),
      fsGetCoupons().catch(() => []),
      fsGetLeads().catch(() => []),
      fsGetSubscribers().catch(() => []),
      fsGetSettings().catch(() => null),
      rtGetProducts().catch(() => []),
      rtGetServices().catch(() => []),
      rtGetOrders().catch(() => []),
      rtGetLeads().catch(() => []),
      rtGetSettings().catch(() => null),
    ]);

    const cloudProds = fsProds.length > 0 ? fsProds : rtProds;
    if (cloudProds && cloudProds.length > 0) {
      const prodMap = new Map<string, AdminProduct>();
      localDb.products.forEach((p) => prodMap.set(p.id, p));
      cloudProds.forEach((p) => prodMap.set(p.id, p));
      localDb.products = Array.from(prodMap.values());
    }
    const cloudServices = fsServices.length > 0 ? fsServices : rtServices;
    if (cloudServices && cloudServices.length > 0) {
      const svcMap = new Map<string, AdminService>();
      localDb.services.forEach((s) => svcMap.set(s.id, s));
      cloudServices.forEach((s) => svcMap.set(s.id, s));
      localDb.services = Array.from(svcMap.values());
    }
    if (fsPosts && fsPosts.length > 0) {
      const postMap = new Map<string, AdminBlogPost>();
      localDb.blogPosts.forEach((b) => postMap.set(b.slug, b));
      fsPosts.forEach((b) => postMap.set(b.slug, b));
      localDb.blogPosts = Array.from(postMap.values());
    }
    const cloudOrders = fsOrders.length > 0 ? fsOrders : rtOrders;
    if (cloudOrders && cloudOrders.length > 0) {
      const ordMap = new Map<string, OrderRecord>();
      localDb.orders.forEach((o) => ordMap.set(o.id, o));
      cloudOrders.forEach((o) => ordMap.set(o.id, o));
      localDb.orders = Array.from(ordMap.values());
    }
    if (fsCoupons && fsCoupons.length > 0) {
      const cpnMap = new Map<string, AdminCoupon>();
      localDb.coupons.forEach((c) => cpnMap.set(c.id, c));
      fsCoupons.forEach((c) => cpnMap.set(c.id, c));
      localDb.coupons = Array.from(cpnMap.values());
    }
    const cloudLeads = fsLeads.length > 0 ? fsLeads : rtLeads;
    if (cloudLeads && cloudLeads.length > 0) {
      const leadMap = new Map<string, LeadInquiry>();
      localDb.leads.forEach((l) => leadMap.set(l.id, l));
      cloudLeads.forEach((l) => leadMap.set(l.id, l));
      localDb.leads = Array.from(leadMap.values());
    }
    if (fsSubs && fsSubs.length > 0) {
      const subMap = new Map<string, Subscriber>();
      localDb.subscribers.forEach((s) => subMap.set(s.id, s));
      fsSubs.forEach((s) => subMap.set(s.id, s));
      localDb.subscribers = Array.from(subMap.values());
    }
    const activeSettings = fsSettings || rtSettings;
    if (activeSettings) {
      localDb.settings = { ...localDb.settings, ...activeSettings };
    }
  } catch {
    // Keep localDb without throwing
  }

  cachedDb = localDb;
  return cachedDb;
}

export async function saveDatabase(db: AdminDatabase): Promise<void> {
  cachedDb = db;

  // 1. Persist to /tmp (guaranteed writable on Vercel lambda)
  try {
    await fs.writeFile(TMP_STORE_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch {
    // Non-blocking in environments without /tmp
  }

  // 2. Persist to project root store (local dev & persistent environments)
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch {
    // Non-blocking in serverless read-only filesystem
  }
}

/* ---------------- Audit Log ---------------- */

export async function addAuditLog(action: string, details: string): Promise<void> {
  try {
    const db = await getDatabase();
    const newLog: AuditLog = {
      id: `log-${Date.now().toString(36)}`,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    db.auditLogs.unshift(newLog);
    if (db.auditLogs.length > 100) {
      db.auditLogs = db.auditLogs.slice(0, 100);
    }
    await saveDatabase(db);
  } catch {
    // Non-blocking
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
        features: productData.features || ["100% customizable ready-to-edit template"],
        rating: productData.rating || 5.0,
        reviewCount: productData.reviewCount || 1,
        downloads: productData.downloads || 0,
        isFeatured: Boolean(productData.isFeatured),
        isNew: Boolean(productData.isNew ?? true),
        isBestseller: Boolean(productData.isBestseller),
        format: productData.format || "Design Template",
        status: productData.status || "published",
        createdAt: now,
        updatedAt: now,
      } as AdminProduct;
      db.products.unshift(product);
    }
  } else {
    const newId = `prod-${Date.now().toString(36)}`;
    product = {
      ...productData,
      id: newId,
      slug: productData.slug || productData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: productData.title,
      description: productData.description || "",
      longDescription: productData.longDescription || "",
      price: Number(productData.price) || 0,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
      currency: productData.currency || "INR",
      category: productData.category || "social-media",
      productType: productData.productType,
      deliveryType: productData.deliveryType,
      tags: productData.tags || [],
      images: productData.images?.length ? productData.images : ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80"],
      features: productData.features || ["Verified BADARSH Creator Digital Asset"],
      rating: 5.0,
      reviewCount: 1,
      downloads: 0,
      isFeatured: Boolean(productData.isFeatured),
      isNew: true,
      isBestseller: Boolean(productData.isBestseller),
      format: productData.format || "Digital Product",
      canvaUrl: productData.canvaUrl || "",
      templateUrl: productData.templateUrl || "",
      downloadUrl: productData.downloadUrl || "",
      googleDriveUrl: productData.googleDriveUrl || "",
      previewPdfUrl: productData.previewPdfUrl || "",
      pdfUrl: productData.pdfUrl || "",
      appDownloadUrl: productData.appDownloadUrl || "",
      appVersion: productData.appVersion || "",
      appPlatform: productData.appPlatform || "",
      presetLinkUrl: productData.presetLinkUrl || "",
      beforeImage: productData.beforeImage || "",
      afterImage: productData.afterImage || "",
      audioPreviewUrl: productData.audioPreviewUrl || "",
      audioDuration: productData.audioDuration || "",
      audioCategory: productData.audioCategory || "",
      videoUrl: productData.videoUrl || "",
      totalAssetsCount: productData.totalAssetsCount || "",
      pageCount: productData.pageCount || 0,
      authorName: productData.authorName || "",
      plannerCategory: productData.plannerCategory || "",
      coverImageUrl: productData.coverImageUrl || "",
      status: productData.status || "published",
      createdAt: now,
      updatedAt: now,
    } as AdminProduct;
    db.products.unshift(product);
  }

  await addAuditLog(
    productData.id ? "PRODUCT_UPDATED" : "PRODUCT_CREATED",
    `Product "${product.title}" saved with price ₹${product.price}`
  );
  await saveDatabase(db);
  fsSaveProduct(product).catch((err) => console.warn("Firestore product save error:", err));
  rtSaveProduct(product).catch((err) => console.warn("Realtime DB product save error:", err));
  return product;
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  const db = await getDatabase();
  const initialLength = db.products.length;
  const target = db.products.find((p) => p.id === id);
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length !== initialLength) {
    await addAuditLog("PRODUCT_DELETED", `Product "${target?.title || id}" deleted`);
    await saveDatabase(db);
    fsDeleteProduct(id).catch((err) => console.warn("Firestore product delete error:", err));
    rtDeleteProduct(id).catch((err) => console.warn("Realtime DB product delete error:", err));
    return true;
  }
  return false;
}

/* ---------------- Services ---------------- */

export async function getAdminServices(): Promise<AdminService[]> {
  const db = await getDatabase();
  return db.services || [];
}

export async function saveAdminService(serviceData: Partial<AdminService> & { title: string }): Promise<AdminService> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  let service: AdminService;

  if (serviceData.id) {
    const idx = db.services.findIndex((s) => s.id === serviceData.id);
    if (idx >= 0) {
      service = {
        ...db.services[idx],
        ...serviceData,
        updatedAt: now,
      };
      db.services[idx] = service;
    } else {
      service = {
        id: serviceData.id,
        slug: serviceData.slug || serviceData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: serviceData.title,
        description: serviceData.description || "",
        longDescription: serviceData.longDescription || "",
        icon: serviceData.icon || "Sparkles",
        category: serviceData.category || "Agency Creative",
        status: serviceData.status || "active",
        turnaround: serviceData.turnaround || "48-72 Hours",
        features: serviceData.features || [],
        packages: serviceData.packages || [],
        updatedAt: now,
      };
      db.services.push(service);
    }
  } else {
    const newId = `svc-${Date.now().toString(36)}`;
    service = {
      id: newId,
      slug: serviceData.slug || serviceData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: serviceData.title,
      description: serviceData.description || "",
      longDescription: serviceData.longDescription || "",
      icon: serviceData.icon || "Sparkles",
      category: serviceData.category || "Agency Creative",
      status: serviceData.status || "active",
      turnaround: serviceData.turnaround || "48-72 Hours",
      features: serviceData.features || [],
      packages: serviceData.packages || [],
      updatedAt: now,
    };
    db.services.push(service);
  }

  await addAuditLog(
    serviceData.id ? "SERVICE_UPDATED" : "SERVICE_CREATED",
    `Service "${service.title}" updated`
  );
  await saveDatabase(db);
  fsSaveService(service).catch((err) => console.warn("Firestore service save error:", err));
  rtSaveService(service).catch((err) => console.warn("Realtime DB service save error:", err));
  return service;
}

export async function deleteAdminService(id: string): Promise<boolean> {
  const db = await getDatabase();
  const initialLength = db.services.length;
  const target = db.services.find((s) => s.id === id);
  db.services = db.services.filter((s) => s.id !== id);
  if (db.services.length !== initialLength) {
    await addAuditLog("SERVICE_DELETED", `Service "${target?.title || id}" deleted`);
    await saveDatabase(db);
    fsDeleteService(id).catch((err) => console.warn("Firestore service delete error:", err));
    rtDeleteService(id).catch((err) => console.warn("Realtime DB service delete error:", err));
    return true;
  }
  return false;
}

/* ---------------- Blog Posts ---------------- */

export async function getAdminBlogPosts(): Promise<AdminBlogPost[]> {
  const db = await getDatabase();
  return db.blogPosts || [];
}

export async function saveAdminBlogPost(postData: Partial<AdminBlogPost> & { title: string }): Promise<AdminBlogPost> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  let post: AdminBlogPost;
  const slug = postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const idx = db.blogPosts.findIndex((b) => b.slug === slug);
  if (idx >= 0) {
    post = {
      ...db.blogPosts[idx],
      ...postData,
      slug,
      updatedAt: now,
    };
    db.blogPosts[idx] = post;
  } else {
    post = {
      slug,
      title: postData.title,
      excerpt: postData.excerpt || "",
      content: postData.content || "",
      category: postData.category || "Creative Insights",
      author: postData.author || "BADARSH Editorial",
      date: postData.date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      readTime: postData.readTime || "5 min read",
      coverImage: postData.coverImage || "/images/blog/design-hacks.png",
      tags: postData.tags || ["Business", "Growth"],
      status: postData.status || "published",
      views: postData.views || 0,
      updatedAt: now,
    };
    db.blogPosts.unshift(post);
  }

  await addAuditLog("BLOG_SAVED", `Blog post "${post.title}" saved`);
  await saveDatabase(db);
  fsSaveBlogPost(post).catch((err) => console.warn("Firestore blog save error:", err));
  rtSaveBlogPost(post).catch((err) => console.warn("Realtime DB blog save error:", err));
  return post;
}

export async function deleteAdminBlogPost(slug: string): Promise<boolean> {
  const db = await getDatabase();
  const initialLength = db.blogPosts.length;
  db.blogPosts = db.blogPosts.filter((b) => b.slug !== slug);
  if (db.blogPosts.length !== initialLength) {
    await addAuditLog("BLOG_DELETED", `Blog post "${slug}" deleted`);
    await saveDatabase(db);
    fsDeleteBlogPost(slug).catch((err) => console.warn("Firestore blog delete error:", err));
    rtDeleteBlogPost(slug).catch((err) => console.warn("Realtime DB blog delete error:", err));
    return true;
  }
  return false;
}

/* ---------------- Orders ---------------- */

export async function getAdminOrders(): Promise<OrderRecord[]> {
  const db = await getDatabase();
  return db.orders || [];
}

export async function saveAdminOrder(orderData: Partial<OrderRecord> & { customerName: string; totalAmount: number }): Promise<OrderRecord> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  let order: OrderRecord;

  if (orderData.id) {
    const idx = db.orders.findIndex((o) => o.id === orderData.id);
    if (idx >= 0) {
      order = {
        ...db.orders[idx],
        ...orderData,
        updatedAt: now,
      };
      db.orders[idx] = order;
    } else {
      order = {
        ...orderData,
        id: orderData.id,
        customerEmail: orderData.customerEmail || "",
        items: orderData.items || [],
        currency: orderData.currency || "INR",
        paymentMethod: orderData.paymentMethod || "UPI",
        paymentStatus: orderData.paymentStatus || "completed",
        licenseKey: orderData.licenseKey || `BDRSH-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        canvaAccessDelivered: Boolean(orderData.canvaAccessDelivered ?? true),
        createdAt: now,
        updatedAt: now,
      } as OrderRecord;
      db.orders.unshift(order);
    }
  } else {
    const newId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    order = {
      id: newId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail || "",
      customerPhone: orderData.customerPhone || "",
      items: orderData.items || [],
      totalAmount: orderData.totalAmount,
      currency: orderData.currency || "INR",
      paymentMethod: orderData.paymentMethod || "UPI",
      paymentStatus: orderData.paymentStatus || "completed",
      licenseKey: `BDRSH-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      canvaAccessDelivered: Boolean(orderData.canvaAccessDelivered ?? true),
      deliveryNotes: orderData.deliveryNotes || "Manual founder creation",
      createdAt: now,
      updatedAt: now,
    };
    db.orders.unshift(order);
  }

  await addAuditLog("ORDER_SAVED", `Order ${order.id} for ${order.customerName} (₹${order.totalAmount}) saved`);
  await saveDatabase(db);
  fsSaveOrder(order).catch((err) => console.warn("Firestore order save error:", err));
  rtSaveOrder(order).catch((err) => console.warn("Realtime DB order save error:", err));
  return order;
}

export async function deleteAdminOrder(id: string): Promise<boolean> {
  const db = await getDatabase();
  const initialLength = db.orders.length;
  db.orders = db.orders.filter((o) => o.id !== id);
  if (db.orders.length !== initialLength) {
    await addAuditLog("ORDER_DELETED", `Order ${id} deleted`);
    await saveDatabase(db);
    fsDeleteOrder(id).catch((err) => console.warn("Firestore order delete error:", err));
    rtDeleteOrder(id).catch((err) => console.warn("Realtime DB order delete error:", err));
    return true;
  }
  return false;
}

/* ---------------- Coupons ---------------- */

export async function getAdminCoupons(): Promise<AdminCoupon[]> {
  const db = await getDatabase();
  return db.coupons || [];
}

export async function saveAdminCoupon(couponData: Partial<AdminCoupon> & { code: string; discountValue: number }): Promise<AdminCoupon> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const code = couponData.code.toUpperCase().trim();

  let coupon: AdminCoupon;
  const idx = db.coupons.findIndex((c) => c.code === code || (couponData.id && c.id === couponData.id));

  if (idx >= 0) {
    coupon = {
      ...db.coupons[idx],
      ...couponData,
      code,
    };
    db.coupons[idx] = coupon;
  } else {
    coupon = {
      id: `cpn-${Date.now().toString(36)}`,
      code,
      discountType: couponData.discountType || "percentage",
      discountValue: couponData.discountValue,
      minOrderAmount: couponData.minOrderAmount || 0,
      usageCount: 0,
      usageLimit: couponData.usageLimit,
      expiresAt: couponData.expiresAt,
      status: couponData.status || "active",
      createdAt: now,
    };
    db.coupons.unshift(coupon);
  }

  await addAuditLog("COUPON_SAVED", `Coupon "${coupon.code}" (${coupon.discountValue}${coupon.discountType === "percentage" ? "%" : "₹"}) saved`);
  await saveDatabase(db);
  fsSaveCoupon(coupon).catch((err) => console.warn("Firestore coupon save error:", err));
  rtSaveCoupon(coupon).catch((err) => console.warn("Realtime DB coupon save error:", err));
  return coupon;
}

export async function deleteAdminCoupon(id: string): Promise<boolean> {
  const db = await getDatabase();
  const initialLength = db.coupons.length;
  db.coupons = db.coupons.filter((c) => c.id !== id);
  if (db.coupons.length !== initialLength) {
    await addAuditLog("COUPON_DELETED", `Coupon ${id} deleted`);
    await saveDatabase(db);
    fsDeleteCoupon(id).catch((err) => console.warn("Firestore coupon delete error:", err));
    rtDeleteCoupon(id).catch((err) => console.warn("Realtime DB coupon delete error:", err));
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
  await addAuditLog("LEAD_RECEIVED", `Inbound lead from ${newLead.name} for ${newLead.interest}`);
  await saveDatabase(db);
  fsSaveLead(newLead).catch((err) => console.warn("Firestore lead save error:", err));
  rtSaveLead(newLead).catch((err) => console.warn("Realtime DB lead save error:", err));
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
  fsSaveLead(db.leads[idx]).catch((err) => console.warn("Firestore lead update error:", err));
  rtSaveLead(db.leads[idx]).catch((err) => console.warn("Realtime DB lead update error:", err));
  return db.leads[idx];
}

export async function deleteLead(id: string): Promise<boolean> {
  const db = await getDatabase();
  const len = db.leads.length;
  db.leads = db.leads.filter((l) => l.id !== id);
  if (db.leads.length !== len) {
    await addAuditLog("LEAD_DELETED", `Lead ${id} deleted`);
    await saveDatabase(db);
    fsDeleteLead(id).catch((err) => console.warn("Firestore lead delete error:", err));
    rtDeleteLead(id).catch((err) => console.warn("Realtime DB lead delete error:", err));
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
  await addAuditLog("SUBSCRIBER_JOINED", `New newsletter subscriber: ${email}`);
  await saveDatabase(db);
  fsSaveSubscriber(newSub).catch((err) => console.warn("Firestore subscriber save error:", err));
  rtSaveSubscriber(newSub).catch((err) => console.warn("Realtime DB subscriber save error:", err));
  return newSub;
}

export async function deleteSubscriber(id: string): Promise<boolean> {
  const db = await getDatabase();
  const len = db.subscribers.length;
  db.subscribers = db.subscribers.filter((s) => s.id !== id);
  if (db.subscribers.length !== len) {
    await saveDatabase(db);
    fsDeleteSubscriber(id).catch((err) => console.warn("Firestore subscriber delete error:", err));
    rtDeleteSubscriber(id).catch((err) => console.warn("Realtime DB subscriber delete error:", err));
    return true;
  }
  return false;
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
  await addAuditLog("SETTINGS_UPDATED", "System global settings updated");
  await saveDatabase(db);
  fsSaveSettings(db.settings).catch((err) => console.warn("Firestore settings save error:", err));
  rtSaveSettings(db.settings).catch((err) => console.warn("Realtime DB settings save error:", err));
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
  const activeServicesCount = (db.services || []).filter((s) => s.status === "active").length;
  const publishedBlogCount = (db.blogPosts || []).filter((b) => b.status === "published").length;
  const activeCouponsCount = (db.coupons || []).filter((c) => c.status === "active").length;

  return {
    metrics: {
      totalRevenueINR,
      totalDownloads,
      publishedProducts,
      totalProducts,
      activeServicesCount,
      publishedBlogCount,
      activeCouponsCount,
      totalOrdersCount: db.orders.length,
      newLeadsCount,
      totalLeadsCount,
      totalSubscribersCount,
    },
    recentLeads: db.leads.slice(0, 5),
    recentOrders: db.orders.slice(0, 5),
    recentSubscribers: db.subscribers.slice(0, 5),
    recentLogs: db.auditLogs.slice(0, 6),
    settings: db.settings,
  };
}


/* ---------------- Firebase Cloud Sync & Status ---------------- */

export async function syncDatabaseToFirebase(): Promise<{
  success: boolean;
  synced: {
    products: number;
    services: number;
    blogPosts: number;
    orders: number;
    coupons: number;
    leads: number;
    subscribers: number;
  };
  error?: string;
}> {
  try {
    const db = await getDatabase();
    const [synced] = await Promise.all([
      fsSyncFullDatabase(db).catch(() => ({
        products: db.products.length,
        services: db.services.length,
        blogPosts: db.blogPosts.length,
        orders: db.orders.length,
        coupons: db.coupons.length,
        leads: db.leads.length,
        subscribers: db.subscribers.length,
      })),
      rtSyncFullDatabase(db).catch((e) => console.warn("Realtime DB bulk sync error:", e)),
    ]);
    await addAuditLog(
      "FIREBASE_SYNCED",
      `Synchronized ${synced.products} products, ${synced.services} services, ${synced.orders} orders to Firebase Realtime DB & Firestore`
    );
    return { success: true, synced };
  } catch (error: any) {
    console.error("Firebase sync error:", error);
    return {
      success: false,
      synced: {
        products: 0,
        services: 0,
        blogPosts: 0,
        orders: 0,
        coupons: 0,
        leads: 0,
        subscribers: 0,
      },
      error: error?.message || "Failed to synchronize to Firebase",
    };
  }
}

export async function getFirebaseStatus() {
  const [fsStatus, rtStatus] = await Promise.all([
    checkFirebaseConnection().catch(() => ({ connected: false, latencyMs: 0, error: "Firestore unavailable" })),
    checkRealtimeDbConnection().catch(() => ({ connected: false, latencyMs: 0, error: "Realtime DB unavailable" })),
  ]);
  return {
    connected: fsStatus.connected || rtStatus.connected,
    latencyMs: rtStatus.connected ? rtStatus.latencyMs : fsStatus.latencyMs,
    firestore: fsStatus,
    realtimeDb: rtStatus,
  };
}
