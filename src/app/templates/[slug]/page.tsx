import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products as staticProducts } from "@/content/products";
import { getAdminProducts } from "@/lib/admin/store";
import { constructMetadata, SITE_URL } from "@/lib/metadata";
import { BUSINESS_LEGAL_NAME } from "@/lib/constants";
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
      noIndex: true,
    });
  }

  return constructMetadata({
    title: product.title.length > 49 ? `${product.title.slice(0, 46).trimEnd()}...` : product.title,
    description:
      product.description.length >= 150
        ? product.description.slice(0, 160)
        : `${product.description} Instant digital download with commercial license from BADARSH.`.slice(0, 160),
    image: product.images?.[0] || "/images/og/og-default.png",
    canonical: `/templates/${product.slug}`,
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
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
      img.startsWith("http") ? img : `${SITE_URL}${img}`
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
      url: `${SITE_URL}/templates/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: BUSINESS_LEGAL_NAME,
      },
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who designs these digital products and assets?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every single digital product, video editing bundle, preset pack, playbook, and template is personally conceptualized, designed, and tested by the BADARSH in-house creative agency team.",
        },
      },
      {
        "@type": "Question",
        name: "How will I receive the files immediately after payment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Instant delivery! The moment your payment is verified, you are shown your direct download links (ZIP, PDF, presets) and direct template project links on screen, along with a verified commercial license key.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use these assets for client projects and commercial videos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Every BADARSH asset includes a Commercial License. You are free to produce client videos, commercial social media content, brand identity deliverables, and client campaigns with zero royalty fees.",
        },
      },
      {
        "@type": "Question",
        name: "What software do I need to use this product?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All templates and guides are tested with free apps (VN Editor, CapCut, Premiere, DaVinci, Lightroom Mobile) so you never need expensive subscriptions.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ProductDetailView
        product={product}
        relatedProducts={fallbackRelated}
      />
    </>
  );
}
