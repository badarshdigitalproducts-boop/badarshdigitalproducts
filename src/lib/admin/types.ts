import type { Product, ProductCategory, ProductSpecs } from "@/types/product";
import type { Service, ServicePackage } from "@/types";

export type ProductType =
  | "template"
  | "canva-template"
  | "video-template"
  | "ebook"
  | "planner"
  | "app-license"
  | "video-preset"
  | "photo-preset"
  | "bundle"
  | "editing-bundle"
  | "website-template"
  | "audio"
  | "font-pack"
  | "other";

export type DeliveryType =
  | "template-link"
  | "canva-link"
  | "download-url"
  | "google-drive"
  | "external-url"
  | "whatsapp-delivery";

export interface AdminProduct extends Omit<Product, "tags" | "isFeatured" | "isNew" | "isBestseller" | "deliveryType"> {
  productType?: ProductType;
  deliveryType?: DeliveryType;
  templateUrl?: string;
  canvaUrl?: string;
  downloadUrl?: string;
  externalUrl?: string;
  googleDriveUrl?: string;
  fileSize?: string;
  fileFormats?: string[];
  softwareRequired?: string;
  compatibleWith?: string[];
  tags?: string[];
  status: "published" | "draft" | "archived";
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  updatedAt?: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  coverImageUrl?: string;
  previewPdfUrl?: string;
  pdfUrl?: string;
  appDownloadUrl?: string;
  appVersion?: string;
  appPlatform?: string;
  presetLinkUrl?: string;
  beforeImage?: string;
  afterImage?: string;
  audioPreviewUrl?: string;
  audioDuration?: string;
  audioCategory?: string;
  pageCount?: number;
  authorName?: string;
  plannerCategory?: string;
  totalAssetsCount?: string;
  overlayLinkUrl?: string;
  videoUrl?: string;
  portfolioImages?: string[];
  portfolioVideos?: string[];
  editableTemplateData?: {
    headline: string;
    subheadline: string;
    brandText: string;
    accentColor: string;
    backgroundColor: string;
    templateType: string;
  };
}

export interface AdminServicePackage {
  name: string;
  price: number;
  currency: string;
  period?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText?: string;
  whatsappMessage?: string;
}

export interface PortfolioBeforeAfterItem {
  id?: string;
  before: string;
  after: string;
  title?: string;
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export interface PortfolioWebsiteItem {
  id?: string;
  name: string;
  title?: string;
  url: string;
  image: string;
  tags: string[];
}

export interface PortfolioLogoItem {
  id?: string;
  name: string;
  darkImage: string;
  lightImage?: string;
  category?: string;
}

export interface AdminService {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  image?: string;
  category?: string;
  status: "active" | "inactive";
  turnaround?: string;
  portfolioImages?: string[];
  portfolioVideos?: string[];
  portfolioBeforeAfter?: PortfolioBeforeAfterItem[];
  portfolioWebsites?: PortfolioWebsiteItem[];
  portfolioLogos?: PortfolioLogoItem[];
  features: string[];
  packages: AdminServicePackage[];
  updatedAt?: string;
}

export interface AdminBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  coverImage?: string;
  tags: string[];
  status: "published" | "draft";
  views?: number;
  updatedAt?: string;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  usageCount: number;
  usageLimit?: number;
  expiresAt?: string;
  status: "active" | "inactive";
  createdAt: string;
}

export type LeadStatus = "new" | "contacted" | "proposal" | "won" | "archived";

export interface LeadInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
  budget?: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  source: string;
  status: "active" | "unsubscribed";
  createdAt: string;
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  productType?: string;
  downloadUrl?: string;
  templateUrl?: string;
  canvaUrl?: string;
}

export interface OrderRecord {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  paymentMethod: "UPI" | "Razorpay" | "Stripe" | "Manual Bank Transfer" | "Cashfree" | string;
  paymentStatus: "completed" | "pending" | "refunded";
  licenseKey: string;
  canvaAccessDelivered: boolean;
  deliveryNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AnnouncementBarConfig {
  enabled: boolean;
  text: string;
  badge: string;
  linkText: string;
  linkUrl: string;
}

export interface CashfreeConfig {
  enabled: boolean;
  env: "TEST" | "PROD";
  appId: string;
  secretKey: string;
}

export interface SystemSettings {
  siteName: string;
  announcementBar: AnnouncementBarConfig;
  currencyRateUsdToInr: number;
  whatsappNumber: string;
  supportEmail: string;
  maintenanceMode: boolean;
  lastBackupAt?: string;
  cashfree?: CashfreeConfig;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  photoURL?: string;
  provider: "email" | "google";
  createdAt: string;
  lastLoginAt: string;
  dpdpConsent?: {
    consentedAt: string;
    version: string;
    lawfulBasis: string;
  };
}

export interface AdminDatabase {
  products: AdminProduct[];
  services: AdminService[];
  blogPosts: AdminBlogPost[];
  coupons: AdminCoupon[];
  leads: LeadInquiry[];
  subscribers: Subscriber[];
  orders: OrderRecord[];
  settings: SystemSettings;
  auditLogs: AuditLog[];
  users?: UserAccount[];
}

