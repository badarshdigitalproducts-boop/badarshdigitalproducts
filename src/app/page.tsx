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
  title: "BADARSH — Independent Creative Studio & Digital Toolkit",
  description:
    "Handcrafted video editing vaults, Lightroom presets, sound design collections, and bespoke creative services. Instant downloads, lifetime commercial licenses.",
  canonical: "/",
  keywords: [
    "video editing assets India",
    "lightroom presets download",
    "sound effects WAV",
    "video editing services Bengaluru",
    "creative studio services",
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
