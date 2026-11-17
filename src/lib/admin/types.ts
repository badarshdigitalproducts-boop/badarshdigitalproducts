import type { Product, ProductCategory } from "@/types/product";

export interface AdminProduct extends Product {
  canvaUrl?: string;
  downloadUrl?: string;
  status: "published" | "draft";
  updatedAt?: string;
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
  createdAt: string;
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
  leads: LeadInquiry[];
  subscribers: Subscriber[];
  orders: OrderRecord[];
  settings: SystemSettings;
  auditLogs: AuditLog[];
}
