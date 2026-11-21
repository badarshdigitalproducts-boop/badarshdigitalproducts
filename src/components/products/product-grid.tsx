"use client";

import { motion, type Variants } from "framer-motion";
import { PackageOpen } from "lucide-react";
import type { Product } from "@/types/product";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25 },
  },
};

export function ProductGrid({
  products,
  emptyMessage = "No digital templates found matching your criteria.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-foreground/40">
          <PackageOpen className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          No Templates Found
        </h3>
        <p className="mt-1 max-w-sm text-xs text-foreground/50">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={products.map((p) => p.id).join("-").slice(0, 40)}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
