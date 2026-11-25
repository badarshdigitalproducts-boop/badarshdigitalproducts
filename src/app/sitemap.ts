import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { products as staticProducts } from "@/content/products";
import { blogPosts as staticBlogPosts } from "@/content/blog";
import { getDatabase } from "@/lib/admin/store";

export const revalidate = 300;

const BLOCKED_SLUGS = new Set([
  "capcut-pro-unlocked-editor",
  "the-psychology-of-money",
]);

function safeDate(value?: string): Date {
  if (value) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date("2026-11-22T00:00:00.000Z");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const catalogDate = new Date("2026-11-25T00:00:00.000Z");

  // Core canonical indexable public routes (excludes redirects, login, cart, checkout, account, unsubscribe)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: catalogDate, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/templates`, lastModified: catalogDate, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/ebooks`, lastModified: catalogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/planners`, lastModified: catalogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/bundles`, lastModified: catalogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/sound-effects`, lastModified: catalogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/editing-apps`, lastModified: catalogDate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/photo-presets`, lastModified: catalogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/video-templates`, lastModified: catalogDate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/services`, lastModified: catalogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/services/video-editing`, lastModified: catalogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/services/website-building`, lastModified: catalogDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/services/social-media-management`, lastModified: catalogDate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/services/photo-editing`, lastModified: catalogDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/services/event-photography`, lastModified: catalogDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/services/pre-wedding-cinematic`, lastModified: catalogDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/services/app-development`, lastModified: catalogDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/services/brand-identity`, lastModified: catalogDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: catalogDate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/about`, lastModified: catalogDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/license`, lastModified: catalogDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/refund-policy`, lastModified: catalogDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: catalogDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/cookie-policy`, lastModified: catalogDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: catalogDate, changeFrequency: "monthly", priority: 0.5 },
  ];

  let allProducts: any[] = [...staticProducts];
  let allPosts: any[] = [...staticBlogPosts];
  let deletedSet = new Set<string>(["prod-017", "prod-020"]);

  try {
    const db = await getDatabase();
    deletedSet = new Set<string>([...(db.deletedProductIds || []), "prod-017", "prod-020"]);

    if (Array.isArray(db.products) && db.products.length > 0) {
      const prodMap = new Map<string, any>();
      staticProducts.forEach((p) => {
        if (!deletedSet.has(p.id) && !BLOCKED_SLUGS.has(p.slug)) {
          prodMap.set(p.slug, p);
        }
      });
      db.products.forEach((p) => {
        if (p.slug && !deletedSet.has(p.id) && !BLOCKED_SLUGS.has(p.slug) && p.status !== "draft") {
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
    .filter(
      (product) =>
        Boolean(product.slug) &&
        !deletedSet.has(product.id) &&
        !BLOCKED_SLUGS.has(product.slug)
    )
    .map((product) => ({
      url:
        product.category === "ebooks"
          ? `${baseUrl}/ebooks/${product.slug}`
          : `${baseUrl}/templates/${product.slug}`,
      lastModified: safeDate(product.updatedAt || product.createdAt),
      changeFrequency: "weekly",
      priority: 0.85,
    }));

  // Dynamic canonical blog routes
  const blogRoutes: MetadataRoute.Sitemap = allPosts
    .filter((post) => Boolean(post.slug))
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: safeDate(post.updatedAt || post.date),
      changeFrequency: "monthly",
      priority: 0.75,
    }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
