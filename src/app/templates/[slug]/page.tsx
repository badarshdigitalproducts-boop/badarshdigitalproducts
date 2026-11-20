import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { products as staticProducts } from "@/content/products";
import { getAdminProducts } from "@/lib/admin/store";
import { constructMetadata } from "@/lib/metadata";
import { siteConfig, BUSINESS_LEGAL_NAME } from "@/lib/constants";
import { ProductDetailView } from "@/components/products/product-detail-view";
import type { Product } from "@/types";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const adminProducts = await getAdminProducts();
    if (adminProducts && adminProducts.length > 0) {
      return adminProducts.map((product) => ({
        slug: product.slug,
      }));
    }
  } catch {
    // fallback to static
  }

  return staticProducts.map((product) => ({
    slug: product.slug,
  }));
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  const decodedSlug = decodeURIComponent(slug).toLowerCase();

  try {
    const adminProducts = await getAdminProducts();
    const foundAdmin = adminProducts.find(
      (p) =>
        p.slug?.toLowerCase() === decodedSlug ||
        p.id === slug ||
        p.slug?.toLowerCase() === slug.toLowerCase()
    );
    if (foundAdmin) {
      return foundAdmin as unknown as Product;
    }
  } catch (err) {
    console.warn("Failed to query dynamic admin products:", err);
  }

  const foundStatic = staticProducts.find(
    (p) =>
      p.slug?.toLowerCase() === decodedSlug ||
      p.id === slug ||
      p.slug?.toLowerCase() === slug.toLowerCase()
  );

  return foundStatic || null;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return constructMetadata({
      title: "Product Not Found",
      description: "The requested digital product could not be found.",
    });
  }

  return constructMetadata({
    title: product.title,
    description: product.description,
    image: product.images?.[0] || "/images/og/og-default.png",
  });
}

async function ProductDetailContent({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  let allProducts: Product[] = staticProducts;
  try {
    const adminList = await getAdminProducts();
    if (adminList && adminList.length > 0) {
      allProducts = adminList as unknown as Product[];
    }
  } catch {
    // Keep static fallback
  }

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const fallbackRelated =
    relatedProducts.length > 0
      ? relatedProducts
      : allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: (product.images || []).map((img) =>
      img.startsWith("http") ? img : `${siteConfig.url}${img}`
    ),
    brand: {
      "@type": "Brand",
      name: "BADARSH",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency || "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/templates/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: BUSINESS_LEGAL_NAME,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 5,
      reviewCount: product.reviewCount || 1,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailView
        product={product}
        relatedProducts={fallbackRelated}
      />
    </>
  );
}

export default function ProductDetailPage(props: ProductPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      }
    >
      <ProductDetailContent params={props.params} />
    </Suspense>
  );
}
