"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { ProductCard } from "@/components/products/product-card";
import { products as initialProducts } from "@/content/products";
import type { Product } from "@/types";

export function FeaturedProducts() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch((err) => console.error("Error loading live products:", err));
  }, []);

  // Prioritize polymorphic flagship products (App, Preset, Bundle, SFX, Ebook, Planner)
  const priorityIds = ["prod-019", "prod-016", "prod-020", "prod-021", "prod-017", "prod-018"];
  const featured = [
    ...productList.filter((p) => priorityIds.includes(p.id)),
    ...productList.filter((p) => p.isFeatured && !priorityIds.includes(p.id)),
  ].slice(0, 6);

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Production Ready"
          title="Flagship Studio Assets"
          subtitle="Directly from the BADARSH master vault: uncompressed SFX, 4K motion overlays, verified creator APKs, and 1-click Lightroom color grades."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/bundles"
            className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card px-8 py-3.5 font-heading text-sm font-bold text-foreground shadow-xs transition-all duration-200 hover:border-foreground/20 hover:shadow-md active:scale-95"
          >
            <span>Explore All Master Bundles</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
