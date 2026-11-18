import type { Product, ProductCategory, ProductSpecs } from "@/types/product";
import type { Service, ServicePackage } from "@/types";

export type ProductType =
  | "canva-template"
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
  | "canva-link"
  | "download-url"
  | "google-drive"
  | "external-url"
  | "whatsapp-delivery";

export interface AdminProduct extends Omit<Product, "tags" | "isFeatured" | "isNew" | "isBestseller"> {
  productType?: ProductType;
  deliveryType?: DeliveryType;
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

export interface AdminService {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  category?: string;
  status: "active" | "inactive";
  turnaround?: string;
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
}

export interface OrderRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  paymentMethod: "UPI" | "Razorpay" | "Stripe" | "Manual Bank Transfer";
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

export interface SystemSettings {
  siteName: string;
  announcementBar: AnnouncementBarConfig;
  currencyRateUsdToInr: number;
  whatsappNumber: string;
  supportEmail: string;
  maintenanceMode: boolean;
  lastBackupAt?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
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
}

