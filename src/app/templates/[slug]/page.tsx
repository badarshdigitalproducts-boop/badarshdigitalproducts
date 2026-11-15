import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Star,
  Download,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Share2,
  Layers,
  Clock,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import { products } from "@/content/products";
import { formatPrice } from "@/lib/utils";
import { constructMetadata } from "@/lib/metadata";
import { BuyButton } from "@/components/products/buy-button";
import { ProductCard } from "@/components/products/product-card";

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

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-16">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/templates" className="hover:text-foreground">
          Templates
        </Link>
        <span>/</span>
        <span className="truncate text-foreground font-medium">
          {product.title}
        </span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Col: Visual Preview Display */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-3xl border border-card-border bg-gradient-to-br from-accent/10 via-purple-900/10 to-card p-8 md:p-12 shadow-sm">
            {/* Visual device canvas */}
            <div className="relative flex aspect-[16/10] w-full flex-col items-center justify-center rounded-2xl border border-white/20 bg-background/80 p-8 text-center shadow-2xl backdrop-blur-xl">
              <span className="rounded-full bg-accent/15 px-4 py-1 text-xs font-bold text-accent">
                {product.format}
              </span>
              <h2 className="mt-4 font-heading text-2xl font-extrabold text-foreground md:text-3xl">
                {product.title}
              </h2>
              <p className="mt-3 max-w-md text-xs leading-relaxed text-muted">
                {product.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {product.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-card-border bg-card px-2.5 py-1 text-[11px] font-semibold text-muted"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {product.isBestseller && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" /> Bestseller
                </span>
              )}
              {discountPercent > 0 && (
                <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  Save {discountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Key Product Guarantees */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-card-border bg-card p-4 text-center">
              <FileCheck className="mx-auto h-5 w-5 text-accent" />
              <p className="mt-2 text-xs font-bold text-foreground">Canva Ready</p>
              <p className="text-[11px] text-muted">Free &amp; Pro</p>
            </div>
            <div className="rounded-2xl border border-card-border bg-card p-4 text-center">
              <Download className="mx-auto h-5 w-5 text-emerald-500" />
              <p className="mt-2 text-xs font-bold text-foreground">Instant Access</p>
              <p className="text-[11px] text-muted">Zero delay</p>
            </div>
            <div className="rounded-2xl border border-card-border bg-card p-4 text-center">
              <ShieldCheck className="mx-auto h-5 w-5 text-amber-500" />
              <p className="mt-2 text-xs font-bold text-foreground">Commercial</p>
              <p className="text-[11px] text-muted">Use for clients</p>
            </div>
            <div className="rounded-2xl border border-card-border bg-card p-4 text-center">
              <Clock className="mx-auto h-5 w-5 text-indigo-500" />
              <p className="mt-2 text-xs font-bold text-foreground">Lifetime</p>
              <p className="text-[11px] text-muted">Free updates</p>
            </div>
          </div>
        </div>

        {/* Right Col: Details, Price & Buy Actions */}
        <div className="flex flex-col justify-between lg:col-span-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                {product.category.replace("-", " ")}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-foreground">{product.rating}</span>
                <span>({product.reviewCount} customer reviews)</span>
              </div>
            </div>

            <h1 className="mt-4 font-heading text-3xl font-extrabold text-foreground sm:text-4xl">
              {product.title}
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              {product.description}
            </p>

            {/* Pricing Box */}
            <div className="mt-6 rounded-2xl border border-card-border bg-card/60 p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-3xl font-extrabold text-foreground">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-muted line-through">
                    {formatPrice(product.originalPrice, product.currency)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                    {discountPercent}% OFF Special Deal
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted">
                One-time payment &bull; No monthly subscription &bull; Taxes included
              </p>
            </div>

            {/* Checklist of what's inside */}
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                What You Get:
              </h3>
              <ul className="mt-3 space-y-2.5">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-foreground/90">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 border-t border-card-border/60 pt-6">
            <BuyButton
              price={product.price}
              currency={product.currency}
              productTitle={product.title}
              gumroadUrl={product.gumroadUrl}
            />
          </div>
        </div>
      </div>

      {/* Tabs / Deep-dive content */}
      <div className="mt-16 rounded-3xl border border-card-border bg-card p-8 md:p-12">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Detailed Overview
        </h2>
        <div className="mt-4 text-sm leading-relaxed text-muted space-y-4">
          <p>{product.longDescription}</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 border-t border-card-border/60 pt-8">
          <div>
            <h4 className="font-heading text-sm font-bold text-foreground">
              1. Drag &amp; Drop Customization
            </h4>
            <p className="mt-1 text-xs text-muted">
              Designed specifically for Canva Free. Change colors, fonts, and photos with zero design experience required.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold text-foreground">
              2. Commercial License
            </h4>
            <p className="mt-1 text-xs text-muted">
              Use these templates for your own personal brand, e-commerce shop, or client projects with complete commercial rights.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold text-foreground">
              3. Lifetime Updates
            </h4>
            <p className="mt-1 text-xs text-muted">
              Whenever we add new slide variations or trending hooks to this pack, you receive updated Canva links at no extra charge.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-20 border-t border-card-border/60 pt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Similar Products You Might Like
            </h2>
            <p className="text-xs text-muted">
              Hand-picked complementary assets for your digital toolkit.
            </p>
          </div>
          <Link
            href="/templates"
            className="text-xs font-bold text-accent hover:text-accent-hover"
          >
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fallbackRelated.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
