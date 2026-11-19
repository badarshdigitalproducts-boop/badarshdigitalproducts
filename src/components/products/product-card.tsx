"use client";

import type { Product } from "@/types/product";
import { PolymorphicProductCard } from "./polymorphic-card";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  return <PolymorphicProductCard product={product} priority={priority} />;
}
