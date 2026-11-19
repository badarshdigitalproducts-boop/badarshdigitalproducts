"use client";

import type { Product } from "@/types/product";
import { BookCard } from "./archetypes/book-card";
import { AppCard } from "./archetypes/app-card";
import { PresetCard } from "./archetypes/preset-card";
import { SfxCard } from "./archetypes/sfx-card";
import { BundleCard } from "./archetypes/bundle-card";
import { StandardTemplateCard } from "./archetypes/standard-template-card";

interface PolymorphicCardProps {
  product: Product;
  priority?: boolean;
}

export function PolymorphicProductCard({ product, priority = false }: PolymorphicCardProps) {
  // Dispatch to the exact Apple/Microsoft archetype based on category & format
  switch (product.category) {
    case "ebooks":
    case "planners":
      return <BookCard product={product} priority={priority} />;

    case "editing-apps":
      return <AppCard product={product} priority={priority} />;

    case "photo-presets":
      return <PresetCard product={product} priority={priority} />;

    case "editing-bundles":
      return <SfxCard product={product} priority={priority} />;

    case "bundles":
      return <BundleCard product={product} priority={priority} />;

    default:
      // Canva Templates, presentations, social media, branding
      return <StandardTemplateCard product={product} priority={priority} />;
  }
}
