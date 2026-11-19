export interface ProductSpecs {
  dimensions: string;
  count: string;
  aspectRatio?: string;
  compatibility?: string;
}

export type DeliveryType =
  | "canva-link"
  | "download-url"
  | "google-drive"
  | "external-url"
  | "whatsapp-delivery";

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: ProductCategory;
  tags: string[];
  images: string[];
  videoUrl?: string;
  previewVideoUrl?: string;
  downloadUrl?: string;
  canvaUrl?: string;
  googleDriveUrl?: string;
  deliveryType?: DeliveryType;
  softwareRequired?: string;
  previewPdfUrl?: string;        // ebook/planner PDF preview URL
  portfolioImages?: string[];    // service portfolio showcase
  portfolioVideos?: string[];    // service video portfolio
  appApkUrl?: string;            // direct APK download
  presetLinkUrl?: string;        // Lightroom preset link
  overlayLinkUrl?: string;       // SFX/overlay template link
  beforeImage?: string;          // RAW unedited photo for preset comparison
  afterImage?: string;           // Graded / edited photo for preset comparison
  apkVersion?: string;           // e.g. "v11.4.0 Pro"
  apkArchitecture?: string;      // e.g. "Android 10+ / ARM64"
  audioPreviewUrl?: string;      // Audio preview for SFX
  samplePages?: string[];        // Preview page images for ebooks/planners
  totalAssetsCount?: string;     // e.g. "700+ Assets"
  features: string[];
  specs?: ProductSpecs;
  rating: number;
  reviewCount: number;
  downloads: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  format: string;
  fileSize?: string;
  gumroadUrl?: string;
  createdAt: string;
}

export type ProductCategory =
  | "social-media"
  | "presentations"
  | "branding"
  | "business-cards"
  | "ebooks"
  | "planners"
  | "bundles"
  | "editing-apps"
  | "editing-bundles"
  | "photo-presets";

export interface ProductFilter {
  category: ProductCategory | "all";
  sortBy: "popular" | "newest" | "price-low" | "price-high";
  search: string;
}
