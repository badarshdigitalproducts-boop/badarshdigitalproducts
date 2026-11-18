export interface ProductSpecs {
  dimensions: string;
  count: string;
  aspectRatio?: string;
  compatibility?: string;
}

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
  | "assets";

export interface ProductFilter {
  category: ProductCategory | "all";
  sortBy: "popular" | "newest" | "price-low" | "price-high";
  search: string;
}
