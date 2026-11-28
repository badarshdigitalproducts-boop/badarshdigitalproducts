import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import bundledStoreData from "@/data/admin-store.json";
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
  fsGetUsers,
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
  rtGetUsers,
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
  UserAccount,
} from "./types";

const cwd = typeof process !== "undefined" && typeof process.cwd === "function" ? process.cwd() : "";
const DATA_DIR = cwd ? path.join(cwd, "src", "data") : "";
const STORE_PATH = DATA_DIR ? path.join(DATA_DIR, "admin-store.json") : "";
const TMP_DIR = "/tmp";
const TMP_STORE_PATH = path.join(TMP_DIR, "admin-store.json");

// Short-TTL in-memory cache so serverless lambdas stay fresh across webhooks & admin mutations
let cachedDb: AdminDatabase | null = null;
let cachedDbAt = 0;
const DB_CACHE_TTL_MS = 10_000;

const BLOCKED_PRODUCT_IDS = new Set([
  "prod-013",
  "prod-017",
  "prod-020",
  "prod-mx0g77qg",
  "prod-mwusptt8",
]);

const PIRATED_CONTENT_RE =
  /(rich[- ]dad|atomic[- ]habits|cashflow[- ]quadrant|hooked[- ]how[- ]to|psychology[- ]of[- ]money|intelligent[- ]investor|capcut[- ]pro[- ]unlocked|kolegite\.com|epdf\.pub|oceanofpdf)/i;

const BROKEN_ASSET_URL_RE =
  /(Accounting\.pdf|ForBigger|actions\.google\.com|lightroom\.adobe\.com|capcut\.com\/template-detail\/7200000|1536240478700|1507842229451|1518173946687|covers\.openlibrary\.org|thumb\.wikimedia\.org|^\/uploads\/)/i;

function isBlockedProduct(p: any): boolean {
  if (!p) return true;
  if (BLOCKED_PRODUCT_IDS.has(p.id)) return true;
  const hay = `${p.slug || ""} ${p.title || ""} ${p.downloadUrl || ""} ${p.previewPdfUrl || ""} ${p.pdfUrl || ""}`;
  return PIRATED_CONTENT_RE.test(hay);
}

function healProductFromSeed(existing: any, sp: any): boolean {
  let changed = false;
  if (
    ["prod-009", "prod-010", "prod-022", "prod-023", "prod-014"].includes(sp.id) &&
    PIRATED_CONTENT_RE.test(`${existing.title || ""} ${existing.slug || ""} ${existing.downloadUrl || ""}`)
  ) {
    Object.assign(existing, sp);
    return true;
  }

  const assetFields = [
    "downloadUrl",
    "freeDownloadUrl",
    "previewPdfUrl",
    "pdfUrl",
    "videoUrl",
    "audioPreviewUrl",
    "overlayLinkUrl",
    "googleDriveUrl",
    "presetLinkUrl",
    "appDownloadUrl",
    "alightMotionXmlUrl",
    "capcutUrl",
  ] as const;

  for (const field of assetFields) {
    const val = existing[field];
    if ((!val && sp[field]) || (typeof val === "string" && BROKEN_ASSET_URL_RE.test(val) && sp[field])) {
      existing[field] = sp[field];
      changed = true;
    }
  }

  if (
    Array.isArray(sp.images) &&
    sp.images[0] &&
    (!Array.isArray(existing.images) ||
      !existing.images.length ||
      existing.images.some((img: string) => BROKEN_ASSET_URL_RE.test(img || "") || img.startsWith("/images/products/")))
  ) {
    existing.images = sp.images;
    changed = true;
  }

  if (sp.fileSize && (!existing.fileSize || existing.format?.includes("APK"))) {
    existing.fileSize = sp.fileSize;
    if (sp.format) existing.format = sp.format;
    changed = true;
  }

  if (sp.deliveryType && (!existing.deliveryType || existing.deliveryType === "external-url" || existing.deliveryType === "google-drive")) {
    if (existing.deliveryType !== sp.deliveryType) {
      existing.deliveryType = sp.deliveryType;
      changed = true;
    }
  }

  return changed;
}

function healServiceMedia(s: any, ss?: any): boolean {
  let changed = false;
  if (Array.isArray(s.portfolioVideos) && s.portfolioVideos.some((v: string) => BROKEN_ASSET_URL_RE.test(v || ""))) {
    s.portfolioVideos = ss?.portfolioVideos || ["/videos/badarsh-showreel.mp4"];
    changed = true;
  }
  if (Array.isArray(s.portfolioImages) && s.portfolioImages.some((img: string) => BROKEN_ASSET_URL_RE.test(img || ""))) {
    s.portfolioImages = ss?.portfolioImages || s.portfolioImages.map((img: string) =>
      BROKEN_ASSET_URL_RE.test(img || "") ? "/images/catalog/cinematic-reels-cover.png" : img
    );
    changed = true;
  }
  return changed;
}

export function invalidateDbCache(): void {
  cachedDb = null;
  cachedDbAt = 0;
}

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
    downloadUrl: p.downloadUrl || p.googleDriveUrl || p.pdfUrl || p.appDownloadUrl || "",
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

  const sampleLeads: LeadInquiry[] = [];
  const sampleSubscribers: Subscriber[] = [];
  const sampleOrders: OrderRecord[] = [];

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

export async function getDatabase(forceRefresh = false): Promise<AdminDatabase> {
  if (!forceRefresh && cachedDb && Date.now() - cachedDbAt < DB_CACHE_TTL_MS) {
    return cachedDb;
  }

  let localDb: AdminDatabase;

  try {
    let raw: string | null = null;
    if (STORE_PATH) {
      try {
        raw = await fs.readFile(TMP_STORE_PATH, "utf8");
      } catch {
        raw = await fs.readFile(STORE_PATH, "utf8");
      }
    }

    if (!raw) {
      // In serverless / edge runtime (e.g. Cloudflare Workers), use statically bundled store
      raw = JSON.stringify(bundledStoreData);
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
    // Purge retired/blocked/pirated entries
    if (parsed.products && Array.isArray(parsed.products)) {
      const beforeLen = parsed.products.length;
      parsed.products = parsed.products.filter(
        (p: any) => !isBlockedProduct(p) && p.slug !== "digital-mockup-graphics-kit" && p.category !== "assets"
      );
      if (parsed.products.length !== beforeLen) modified = true;
    }

    const coreIds = new Set(seed.products.map((sp) => sp.id));
    const rawDeleted = Array.isArray(parsed.deletedProductIds) ? parsed.deletedProductIds : [];
    const safeDeleted = rawDeleted.filter((id: string) => !coreIds.has(id) || BLOCKED_PRODUCT_IDS.has(id));
    if (safeDeleted.length !== rawDeleted.length) {
      parsed.deletedProductIds = safeDeleted;
      if (parsed.settings) parsed.settings.deletedProductIds = safeDeleted;
      modified = true;
    }

    if (!parsed.products || !parsed.products.length) {
      const deletedSet = new Set<string>(safeDeleted);
      parsed.products = seed.products.filter((sp) => !deletedSet.has(sp.id));
      modified = true;
    } else {
      const deletedSet = new Set<string>(safeDeleted);
      seed.products.forEach((sp) => {
        if (deletedSet.has(sp.id)) return;
        const existing = parsed.products.find((p: any) => p.id === sp.id || p.slug === sp.slug);
        if (existing) {
          if (healProductFromSeed(existing, sp)) modified = true;
          if (!existing.beforeImage && sp.beforeImage) { existing.beforeImage = sp.beforeImage; modified = true; }
          if (!existing.afterImage && sp.afterImage) { existing.afterImage = sp.afterImage; modified = true; }
          if (!existing.audioDuration && sp.audioDuration) { existing.audioDuration = sp.audioDuration; modified = true; }
          if (!existing.audioCategory && sp.audioCategory) { existing.audioCategory = sp.audioCategory; modified = true; }
          if (!existing.appVersion && sp.appVersion) { existing.appVersion = sp.appVersion; modified = true; }
          if (!existing.appPlatform && sp.appPlatform) { existing.appPlatform = sp.appPlatform; modified = true; }
          if (!existing.pageCount && sp.pageCount) { existing.pageCount = sp.pageCount; modified = true; }
          if (!existing.authorName && sp.authorName) { existing.authorName = sp.authorName; modified = true; }
          if (!existing.plannerCategory && sp.plannerCategory) { existing.plannerCategory = sp.plannerCategory; modified = true; }
          if (!existing.totalAssetsCount && sp.totalAssetsCount) { existing.totalAssetsCount = sp.totalAssetsCount; modified = true; }
          if (!existing.editableTemplateData && sp.editableTemplateData) { existing.editableTemplateData = sp.editableTemplateData; modified = true; }
        } else {
          parsed.products.push(sp);
          modified = true;
        }
      });

      // Fix custom persisted planners/ebooks that point to gitignored /uploads/ paths
      parsed.products.forEach((p: any) => {
        if (p.id === "prod-mwv1wcsu") {
          if (typeof p.downloadUrl === "string" && p.downloadUrl.startsWith("/uploads/")) {
            p.downloadUrl = "/downloads/pdfs/90-day-fitness-operating-system.pdf";
            modified = true;
          }
          if (typeof p.previewPdfUrl === "string" && p.previewPdfUrl.startsWith("/uploads/")) {
            p.previewPdfUrl = "/downloads/pdfs/90-day-fitness-operating-system.pdf";
            modified = true;
          }
          if (typeof p.pdfUrl === "string" && p.pdfUrl.startsWith("/uploads/")) {
            p.pdfUrl = "/downloads/pdfs/digital-marketing-plan.pdf";
            modified = true;
          }
          if (Array.isArray(p.images) && p.images[0]?.startsWith("/uploads/")) {
            p.images = ["/images/catalog/90-day-fitness.png"];
            p.coverImageUrl = "/images/catalog/90-day-fitness.png";
            modified = true;
          }
        }
      });
    }

    // Backfill service portfolios & updated packages from seed
    if (parsed.services && Array.isArray(parsed.services)) {
      seed.services.forEach((ss) => {
        const existing = parsed.services.find((s: any) => s.id === ss.id || s.slug === ss.slug);
        if (existing) {
          if (healServiceMedia(existing, ss)) modified = true;
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

    if (modified && STORE_PATH) {
      try {
        await fs.writeFile(STORE_PATH, JSON.stringify(parsed, null, 2), "utf8");
      } catch {
        // Safe in serverless
      }
    }

    localDb = parsed;
  } catch {
    // Fallback to bundled store or seed database
    try {
      localDb = JSON.parse(JSON.stringify(bundledStoreData)) as AdminDatabase;
    } catch {
      localDb = getSeedDatabase();
    }
    if (STORE_PATH && DATA_DIR) {
      try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(STORE_PATH, JSON.stringify(localDb, null, 2), "utf8");
      } catch {
        // In serverless / edge read-only environments fallback gracefully to memory
      }
    }
  }

  // Attempt live Realtime Database & Firestore sync if cloud collections are populated
  try {
    const [
      fsProds, fsServices, fsPosts, fsOrders, fsCoupons, fsLeads, fsSubs, fsSettings, fsUsers,
      rtProds, rtServices, rtOrders, rtLeads, rtSettings, rtUsers
    ] = await Promise.all([
      fsGetProducts().catch(() => []),
      fsGetServices().catch(() => []),
      fsGetBlogPosts().catch(() => []),
      fsGetOrders().catch(() => []),
      fsGetCoupons().catch(() => []),
      fsGetLeads().catch(() => []),
      fsGetSubscribers().catch(() => []),
      fsGetSettings().catch(() => null),
      fsGetUsers().catch(() => []),
      rtGetProducts().catch(() => []),
      rtGetServices().catch(() => []),
      rtGetOrders().catch(() => []),
      rtGetLeads().catch(() => []),
      rtGetSettings().catch(() => null),
      rtGetUsers().catch(() => []),
    ]);

    const seedForCloud = getSeedDatabase();
    const coreIds = new Set(seedForCloud.products.map((sp) => sp.id));
    const rawCloudDeleted = [
      ...(Array.isArray(localDb.deletedProductIds) ? localDb.deletedProductIds : []),
      ...(Array.isArray(fsSettings?.deletedProductIds) ? fsSettings.deletedProductIds : []),
      ...(Array.isArray(rtSettings?.deletedProductIds) ? rtSettings.deletedProductIds : []),
    ];
    const deletedSet = new Set<string>(
      rawCloudDeleted.filter((id) => !coreIds.has(id) || BLOCKED_PRODUCT_IDS.has(id))
    );
    localDb.deletedProductIds = Array.from(deletedSet);

    // Merge both RTDB and Firestore per document instead of dropping one entirely (fixes split-brain catalog)
    const mergedCloudProds = [...(rtProds || []), ...(fsProds || [])];
    if (mergedCloudProds.length > 0) {
      const prodMap = new Map<string, AdminProduct>();
      localDb.products.forEach((p) => {
        if (!deletedSet.has(p.id) && !isBlockedProduct(p)) prodMap.set(p.id, p);
      });
      mergedCloudProds.forEach((p) => {
        if (!p?.id || deletedSet.has(p.id) || isBlockedProduct(p)) return;
        const candidate = { ...p };
        const seedMatch = seedForCloud.products.find((sp) => sp.id === candidate.id || sp.slug === candidate.slug);
        if (seedMatch) healProductFromSeed(candidate, seedMatch);
        prodMap.set(candidate.id, candidate);
      });
      localDb.products = Array.from(prodMap.values());
    }
    const cloudServices = [...(rtServices || []), ...(fsServices || [])];
    if (cloudServices.length > 0) {
      const svcMap = new Map<string, AdminService>();
      localDb.services.forEach((s) => svcMap.set(s.id, s));
      cloudServices.forEach((s) => {
        if (!s?.id) return;
        const candidate = { ...s };
        const seedMatch = seedForCloud.services.find((ss) => ss.id === candidate.id || ss.slug === candidate.slug);
        healServiceMedia(candidate, seedMatch);
        svcMap.set(candidate.id, candidate);
      });
      localDb.services = Array.from(svcMap.values());
    }
    if (fsPosts && fsPosts.length > 0) {
      const postMap = new Map<string, AdminBlogPost>();
      localDb.blogPosts.forEach((b) => postMap.set(b.slug, b));
      fsPosts.forEach((b) => postMap.set(b.slug, b));
      localDb.blogPosts = Array.from(postMap.values());
    }
    const cloudOrders = [...(rtOrders || []), ...(fsOrders || [])];
    if (cloudOrders.length > 0) {
      const ordMap = new Map<string, OrderRecord>();
      localDb.orders.forEach((o) => ordMap.set(o.id, o));
      cloudOrders.forEach((o) => {
        if (o?.id) ordMap.set(o.id, o);
      });
      localDb.orders = Array.from(ordMap.values());
    }
    if (fsCoupons && fsCoupons.length > 0) {
      const cpnMap = new Map<string, AdminCoupon>();
      localDb.coupons.forEach((c) => cpnMap.set(c.id, c));
      fsCoupons.forEach((c) => cpnMap.set(c.id, c));
      localDb.coupons = Array.from(cpnMap.values());
    }
    const cloudLeads = [...(rtLeads || []), ...(fsLeads || [])];
    if (cloudLeads.length > 0) {
      const leadMap = new Map<string, LeadInquiry>();
      localDb.leads.forEach((l) => leadMap.set(l.id, l));
      cloudLeads.forEach((l) => {
        if (l?.id) leadMap.set(l.id, l);
      });
      localDb.leads = Array.from(leadMap.values());
    }
    if (fsSubs && fsSubs.length > 0) {
      const subMap = new Map<string, Subscriber>();
      localDb.subscribers.forEach((s) => subMap.set(s.id, s));
      fsSubs.forEach((s) => subMap.set(s.id, s));
      localDb.subscribers = Array.from(subMap.values());
    }
    const cloudUsers = [...(rtUsers || []), ...(fsUsers || [])];
    if (cloudUsers.length > 0) {
      const userMap = new Map<string, UserAccount>();
      (localDb.users || []).forEach((u) => userMap.set(u.id, u));
      cloudUsers.forEach((u) => {
        if (u?.id) userMap.set(u.id, u);
      });
      localDb.users = Array.from(userMap.values());
    }
    const activeSettings = fsSettings || rtSettings;
    if (activeSettings) {
      localDb.settings = { ...localDb.settings, ...activeSettings };
    }
    // Security Hardening: Ensure Cashfree secret key is NEVER stored or held in database state
    if (localDb.settings?.cashfree) {
      localDb.settings.cashfree.secretKey = "";
    }
  } catch {
    // Keep localDb without throwing
  }

  cachedDb = localDb;
  cachedDbAt = Date.now();
  return cachedDb;
}

export async function saveDatabase(db: AdminDatabase): Promise<void> {
  // Security Hardening: Ensure Cashfree secret key is NEVER written to JSON store
  if (db.settings?.cashfree) {
    db.settings.cashfree.secretKey = "";
  }
  cachedDb = db;
  cachedDbAt = Date.now();

  // 1. Persist to /tmp (guaranteed writable on Vercel lambda if available)
  try {
    await fs.writeFile(TMP_STORE_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch {
    // Non-blocking in environments without /tmp (e.g. Cloudflare Workers edge)
  }

  // 2. Persist to project root store (local dev & persistent environments)
  if (STORE_PATH && DATA_DIR) {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(STORE_PATH, JSON.stringify(db, null, 2), "utf8");
    } catch {
      // Non-blocking in serverless/edge read-only filesystem
    }
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
        images: productData.images || ["/images/og/og-default.png"],
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

  const deletedSet = new Set<string>([
    ...(Array.isArray(db.deletedProductIds) ? db.deletedProductIds : []),
    ...(Array.isArray(db.settings?.deletedProductIds) ? db.settings.deletedProductIds : []),
  ]);
  if (deletedSet.delete(product.id)) {
    db.deletedProductIds = Array.from(deletedSet);
    if (db.settings) {
      db.settings.deletedProductIds = db.deletedProductIds;
    }
  }
  await addAuditLog(
    productData.id ? "PRODUCT_UPDATED" : "PRODUCT_CREATED",
    `Product "${product.title}" saved with price ₹${product.price}`
  );
  await saveDatabase(db);
  await Promise.allSettled([
    fsSaveProduct(product).catch((err) => console.warn("Firestore product save error:", err)),
    rtSaveProduct(product).catch((err) => console.warn("Realtime DB product save error:", err)),
    db.settings ? fsSaveSettings(db.settings).catch(() => {}) : Promise.resolve(),
    db.settings ? rtSaveSettings(db.settings).catch(() => {}) : Promise.resolve(),
  ]);
  return product;
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  const db = await getDatabase(true);
  const initialLength = db.products.length;
  const target = db.products.find((p) => p.id === id);
  db.products = db.products.filter((p) => p.id !== id);
  const deletedSet = new Set<string>([
    ...(Array.isArray(db.deletedProductIds) ? db.deletedProductIds : []),
    ...(Array.isArray(db.settings?.deletedProductIds) ? db.settings.deletedProductIds : []),
  ]);
  deletedSet.add(id);
  db.deletedProductIds = Array.from(deletedSet);
  if (db.settings) {
    db.settings.deletedProductIds = db.deletedProductIds;
  }
  if (db.products.length !== initialLength) {
    await addAuditLog("PRODUCT_DELETED", `Product "${target?.title || id}" deleted`);
    await saveDatabase(db);
    await Promise.allSettled([
      fsDeleteProduct(id).catch((err) => console.warn("Firestore product delete error:", err)),
      rtDeleteProduct(id).catch((err) => console.warn("Realtime DB product delete error:", err)),
      db.settings ? fsSaveSettings(db.settings).catch(() => {}) : Promise.resolve(),
      db.settings ? rtSaveSettings(db.settings).catch(() => {}) : Promise.resolve(),
    ]);
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
      coverImage: postData.coverImage || "/images/og/og-default.png",
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
  const db = await getDatabase(true);
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
        accessToken: orderData.accessToken || crypto.randomBytes(24).toString("hex"),
        customerEmail: orderData.customerEmail || "",
        items: orderData.items || [],
        currency: orderData.currency || "INR",
        paymentMethod: orderData.paymentMethod || "UPI",
        paymentStatus: orderData.paymentStatus || "completed",
        licenseKey: orderData.licenseKey || `BDRSH-${crypto.randomBytes(2).toString("hex").toUpperCase()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`,
        canvaAccessDelivered: Boolean(orderData.canvaAccessDelivered ?? true),
        createdAt: now,
        updatedAt: now,
      } as OrderRecord;
      db.orders.unshift(order);
    }
  } else {
    const newId = `ORD-${crypto.randomInt(10000, 99999)}`;
    order = {
      id: newId,
      accessToken: orderData.accessToken || crypto.randomBytes(24).toString("hex"),
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail || "",
      customerPhone: orderData.customerPhone || "",
      items: orderData.items || [],
      totalAmount: orderData.totalAmount,
      currency: orderData.currency || "INR",
      paymentMethod: orderData.paymentMethod || "UPI",
      paymentStatus: orderData.paymentStatus || "completed",
      licenseKey: `BDRSH-${crypto.randomBytes(2).toString("hex").toUpperCase()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`,
      canvaAccessDelivered: Boolean(orderData.canvaAccessDelivered ?? true),
      deliveryNotes: orderData.deliveryNotes || "Manual founder creation",
      createdAt: now,
      updatedAt: now,
    };
    db.orders.unshift(order);
  }

  await addAuditLog("ORDER_SAVED", `Order ${order.id} for ${order.customerName} (₹${order.totalAmount}) saved`);
  await saveDatabase(db);
  await Promise.allSettled([
    fsSaveOrder(order).catch((err) => console.warn("Firestore order save error:", err)),
    rtSaveOrder(order).catch((err) => console.warn("Realtime DB order save error:", err)),
  ]);
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
    checkFirebaseConnection().catch(() => ({ connected: false, latencyMs: 0, adminSdkActive: false, error: "Firestore unavailable" })),
    checkRealtimeDbConnection().catch(() => ({ connected: false, latencyMs: 0, adminSdkActive: false, error: "Realtime DB unavailable" })),
  ]);
  return {
    connected: fsStatus.connected || rtStatus.connected,
    adminSdkActive: Boolean((fsStatus as any).adminSdkActive || (rtStatus as any).adminSdkActive),
    latencyMs: rtStatus.connected ? rtStatus.latencyMs : fsStatus.latencyMs,
    firestore: fsStatus,
    realtimeDb: rtStatus,
  };
}
