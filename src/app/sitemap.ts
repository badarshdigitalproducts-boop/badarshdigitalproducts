import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/metadata";
import { products as staticProducts } from "@/content/products";
import { blogPosts } from "@/content/blog";
import adminStoreData from "@/data/admin-store.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const now = new Date();

  // Core canonical indexable public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/templates`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/ebooks`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/planners`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/bundles`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/sound-effects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/editing-bundles`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/editing-apps`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/photo-presets`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/video-templates`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/services/video-editing`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/services/photo-editing`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/services/event-photography`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/services/pre-wedding-cinematic`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/services/social-media-management`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/services/website-design`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/services/app-development`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/services/brand-identity`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/license`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/refund-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Read admin store products safely to index custom products
  let allProducts = [...staticProducts];
  try {
    const data = adminStoreData as any;
    if (data?.products && Array.isArray(data.products)) {
      const seenSlugs = new Set(allProducts.map((p) => p.slug));
      for (const p of data.products) {
        if (p.slug && !seenSlugs.has(p.slug)) {
          allProducts.push(p);
          seenSlugs.add(p.slug);
        }
      }
    }
  } catch {
    // Non-blocking fallback
  }

  // Dynamic canonical product & ebook routes
  const productRoutes: MetadataRoute.Sitemap = allProducts.map((product) => ({
    url:
      product.category === "ebooks"
        ? `${baseUrl}/ebooks/${product.slug}`
        : `${baseUrl}/templates/${product.slug}`,
    lastModified: product.createdAt ? new Date(product.createdAt) : now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Dynamic canonical blog routes
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
