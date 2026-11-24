import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/metadata";
import { products as staticProducts } from "@/content/products";
import { blogPosts as staticBlogPosts } from "@/content/blog";
import { getDatabase } from "@/lib/admin/store";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    { url: `${baseUrl}/apps`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
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
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/cookie-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  let allProducts: any[] = [...staticProducts];
  let allPosts: any[] = [...staticBlogPosts];

  try {
    const db = await getDatabase();
    const deletedSet = new Set<string>(db.deletedProductIds || []);

    if (Array.isArray(db.products) && db.products.length > 0) {
      const prodMap = new Map<string, any>();
      staticProducts.forEach((p) => {
        if (!deletedSet.has(p.id)) prodMap.set(p.slug, p);
      });
      db.products.forEach((p) => {
        if (p.slug && !deletedSet.has(p.id) && p.status !== "draft") {
          prodMap.set(p.slug, p);
        }
      });
      allProducts = Array.from(prodMap.values());
    }

    if (Array.isArray(db.blogPosts) && db.blogPosts.length > 0) {
      const postMap = new Map<string, any>();
      staticBlogPosts.forEach((b) => postMap.set(b.slug, b));
      db.blogPosts.forEach((b) => {
        if (b.slug && b.status !== "draft") {
          postMap.set(b.slug, b);
        }
      });
      allPosts = Array.from(postMap.values());
    }
  } catch {
    // Non-blocking fallback
  }

  // Dynamic canonical product & ebook routes
  const productRoutes: MetadataRoute.Sitemap = allProducts
    .filter((product) => Boolean(product.slug))
    .map((product) => ({
      url:
        product.category === "ebooks"
          ? `${baseUrl}/ebooks/${product.slug}`
          : `${baseUrl}/templates/${product.slug}`,
      lastModified: product.updatedAt
        ? new Date(product.updatedAt)
        : product.createdAt
        ? new Date(product.createdAt)
        : now,
      changeFrequency: "weekly",
      priority: 0.85,
    }));

  // Dynamic canonical blog routes
  const blogRoutes: MetadataRoute.Sitemap = allPosts
    .filter((post) => Boolean(post.slug))
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
      changeFrequency: "monthly",
      priority: 0.75,
    }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
