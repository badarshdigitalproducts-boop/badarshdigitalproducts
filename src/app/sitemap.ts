import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";
import { products as staticProducts } from "@/content/products";
import { blogPosts } from "@/content/blog";
import fs from "fs";
import path from "path";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://badarshdigitalproducts.vercel.app");

  const now = new Date();

  // Core static & category routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/templates`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/bundles`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/editing-apps`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/apps`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/editing-bundles`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/sound-effects`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/photo-presets`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/presets`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/ebooks`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/planners`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/services/video-editing`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/services/photo-editing`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/services/social-media-management`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/services/website-design`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/services/website-building`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/services/app-development`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/services/brand-identity`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/signup`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/refund-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/license`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Read admin store products safely to index custom products
  let allProducts = [...staticProducts];
  try {
    const adminPath = path.join(process.cwd(), "src/data/admin-store.json");
    if (fs.existsSync(adminPath)) {
      const data = JSON.parse(fs.readFileSync(adminPath, "utf8"));
      if (data.products && Array.isArray(data.products)) {
        const seenSlugs = new Set(allProducts.map((p) => p.slug));
        for (const p of data.products) {
          if (p.slug && !seenSlugs.has(p.slug)) {
            allProducts.push(p);
            seenSlugs.add(p.slug);
          }
        }
      }
    }
  } catch {
    // Non-blocking fallback
  }

  // Dynamic product routes
  const productRoutes: MetadataRoute.Sitemap = allProducts.map((product) => ({
    url: `${baseUrl}/templates/${product.slug}`,
    lastModified: product.createdAt ? new Date(product.createdAt) : now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Dynamic blog routes
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
