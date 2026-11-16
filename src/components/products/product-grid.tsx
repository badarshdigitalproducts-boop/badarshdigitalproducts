"use client";

import { motion } from "framer-motion";
import { PackageOpen } from "lucide-react";
import type { Product } from "@/types/product";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  emptyMessage = "No digital products found matching your criteria.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-card-border p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/20 text-muted">
          <PackageOpen className="h-8 w-8" />
        </div>
        <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
          No Products Found
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  );
}

