"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { ProductCard } from "@/components/products/product-card";
import { products } from "@/content/products";

export function FeaturedProducts() {
  const featured = products.filter((p) => p.isFeatured).slice(0, 3);

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Ready To Use"
          title="Bestselling Digital Assets"
          subtitle="Plug-and-play Canva templates, planners, and bundles designed to attract high-paying clients and grow your brand effortlessly."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card px-8 py-3.5 font-heading text-sm font-bold text-foreground shadow-sm transition-all duration-200 hover:border-accent hover:text-accent hover:shadow-md"
          >
            <span>View All {products.length} Products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
