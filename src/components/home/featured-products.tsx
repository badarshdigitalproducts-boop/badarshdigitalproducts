"use client";

import { useState, useEffect } from "react";
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

  // Prioritize original studio flagship products (Bundles, Presets, SFX, Config Tools, Planners, Reels)
  const priorityIds = ["prod-019", "prod-016", "prod-021", "prod-014", "prod-018", "prod-001"];
  const featured = [
    ...productList.filter((p) => priorityIds.includes(p.id)),
    ...productList.filter((p) => p.isFeatured && !priorityIds.includes(p.id)),
  ].slice(0, 6);

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Featured Releases"
          title="Essential Creative Assets"
          subtitle="Our most trusted video packs, sound design libraries, color grades, and creator tools. Built for editors, designers, and creators."
        />

        {/* Apple Horizontal Inertial Snap Carousel on Mobile / Clean Grid on Desktop */}
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none px-4 -mx-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:px-0 md:mx-0">
          {featured.map((product) => (
            <div key={product.id} className="w-[86vw] shrink-0 snap-center sm:w-[360px] md:w-auto">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-[#86868B] mt-2 md:hidden">
          Swipe sideways to explore assets &rarr;
        </p>
      </div>
    </section>
  );
}
