import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ServicesPreview } from "@/components/home/services-preview";
import { Testimonials } from "@/components/home/testimonials";
import { FaqSection } from "@/components/home/faq-section";
import { BlogPreview } from "@/components/home/blog-preview";

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
