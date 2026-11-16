import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products } from "@/content/products";
import { constructMetadata } from "@/lib/metadata";
import { ProductDetailView } from "@/components/products/product-detail-view";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return constructMetadata({
      title: "Product Not Found",
      description: "The requested digital product could not be found.",
    });
  }

  return constructMetadata({
    title: product.title,
    description: product.description,
    image: product.images[0] || "/images/og/og-default.png",
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const fallbackRelated =
    relatedProducts.length > 0
      ? relatedProducts
      : products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <ProductDetailView
      product={product}
      relatedProducts={fallbackRelated}
    />
  );
}
