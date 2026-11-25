import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products as staticProducts } from "@/content/products";
import { getAdminProducts } from "@/lib/admin/store";
import { constructMetadata } from "@/lib/metadata";
import { BookDetailView } from "@/components/books/book-detail-view";
import type { Product } from "@/types";

interface EbookSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const ebooks = staticProducts.filter(
    (p) => p.category === "ebooks" || p.tags?.includes("ebook")
  );
  return ebooks.map((book) => ({
    slug: book.slug,
  }));
}

async function getEbookBySlug(slug: string): Promise<Product | null> {
  const decodedSlug = decodeURIComponent(slug).toLowerCase();

  try {
    const adminProducts = await getAdminProducts();
    const foundAdmin = adminProducts.find(
      (p) =>
        (p.slug?.toLowerCase() === decodedSlug || p.id === slug) &&
        (p.category === "ebooks" || p.tags?.includes("ebook"))
    );
    if (foundAdmin) return foundAdmin as unknown as Product;
  } catch {
    // Keep static fallback
  }

  const foundStatic = staticProducts.find(
    (p) =>
      (p.slug?.toLowerCase() === decodedSlug || p.id === slug) &&
      (p.category === "ebooks" || p.tags?.includes("ebook"))
  );

  return foundStatic || null;
}

export async function generateMetadata({
  params,
}: EbookSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getEbookBySlug(slug);

  if (!book) {
    return constructMetadata({
      title: "E-Book Not Found",
      description: "The requested digital book could not be found.",
      canonical: `/ebooks/${slug}`,
      noIndex: true,
    });
  }

  const seoTitle =
    book.title.length > 49 ? `${book.title.slice(0, 46).trimEnd()}...` : book.title;

  return constructMetadata({
    title: seoTitle,
    description:
      book.description.length >= 150
        ? book.description.slice(0, 160)
        : `${book.description} Read online and download instant PDF edition from BADARSH.`.slice(0, 160),
    image: book.images?.[0] || "/images/og/og-default.png",
    canonical: `/ebooks/${book.slug}`,
  });
}

export default async function EbookSlugPage({ params }: EbookSlugPageProps) {
  const { slug } = await params;
  const book = await getEbookBySlug(slug);

  if (!book) {
    notFound();
  }

  const bookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: {
      "@type": "Person",
      name: (book as any).authorName || "BADARSH Studio",
    },
    numberOfPages: book.pageCount || 240,
    bookFormat: "https://schema.org/EBook",
    inLanguage: "English",
    description: book.description,
    image: book.images?.[0] || "/images/og/og-default.png",
    offers: {
      "@type": "Offer",
      price: book.price,
      priceCurrency: book.currency || "INR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />
      <BookDetailView product={book} />
    </>
  );
}
