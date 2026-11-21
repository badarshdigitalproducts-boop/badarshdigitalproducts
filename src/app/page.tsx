import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ServicesPreview } from "@/components/home/services-preview";
import { Testimonials } from "@/components/home/testimonials";
import { FaqSection } from "@/components/home/faq-section";
import { BlogPreview } from "@/components/home/blog-preview";

export const metadata: Metadata = constructMetadata({
  title: "BADARSH — Premium Digital Templates & Creative Services",
  description:
    "High-impact Canva & Figma design templates, creator software tools, video vaults & done-for-you creative services. Built for ambitious founders and creators to scale their brand online.",
  canonical: "/",
  keywords: [
    "digital templates India",
    "canva templates download",
    "video editing services Bengaluru",
    "creator software tools",
    "creative agency services",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <ServicesPreview />
      <Testimonials />
      <FaqSection />
      <BlogPreview />
    </>
  );
}
