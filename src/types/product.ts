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
  pdfUrl?: string;               // full PDF download URL
  portfolioImages?: string[];    // service portfolio showcase
  portfolioVideos?: string[];    // service video portfolio
  appDownloadUrl?: string;       // direct app installer / file download link
  presetLinkUrl?: string;        // Lightroom preset link / DNG download
  overlayLinkUrl?: string;       // SFX/overlay template link
  beforeImage?: string;          // RAW unedited photo for preset comparison
  afterImage?: string;           // Graded / edited photo for preset comparison
  appVersion?: string;           // e.g. "v12.2 Pro Unlocked"
  appPlatform?: string;          // e.g. "Android & iOS" or "Mobile App"
  audioPreviewUrl?: string;      // Audio stream / preview for SFX & BG music
  audioDuration?: string;        // e.g. "0:45", "2:14"
  audioCategory?: string;        // e.g. "Cinematic", "Reels BGM", "Transitions", "Lo-Fi"
  samplePages?: string[];        // Preview page images for ebooks/planners
  pageCount?: number;            // Total page count for ebooks/planners
  authorName?: string;           // Author name for ebooks
  plannerCategory?: string;      // Category for planners (Habit, Finance, Fitness, etc.)
  totalAssetsCount?: string;     // e.g. "700+ Assets"
  editableTemplateData?: {       // In-browser customizable template config
    headline: string;
    subheadline: string;
    brandText: string;
    accentColor: string;
    backgroundColor: string;
    templateType: string;
  };
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
