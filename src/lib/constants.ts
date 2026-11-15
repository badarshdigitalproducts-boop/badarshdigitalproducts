import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "BADARSH",
  description:
    "Premium digital templates, e-books & creative services to make your brand stand out online. Canva templates, digital planners, video editing & website building for businesses.",
  url: "https://badarsh.com",
  ogImage: "/images/og/og-default.png",
  links: {
    instagram: "https://instagram.com/badarsh",
    youtube: "https://youtube.com/@badarsh",
    whatsapp: "https://wa.me/919999999999",
    email: "hello@badarsh.com",
    pinterest: "https://pinterest.com/badarsh",
  },
};

export const WHATSAPP_NUMBER = "919999999999";

export const NAV_LINKS = [
  { label: "Templates", href: "/templates" },
  { label: "E-Books", href: "/ebooks" },
  { label: "Planners", href: "/planners" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
] as const;

export const CATEGORIES = [
  { value: "all", label: "All Products" },
  { value: "social-media", label: "Social Media" },
  { value: "presentations", label: "Presentations" },
  { value: "branding", label: "Branding Kits" },
  { value: "business-cards", label: "Business Cards" },
  { value: "ebooks", label: "E-Books" },
  { value: "planners", label: "Planners" },
  { value: "bundles", label: "Bundles" },
  { value: "assets", label: "Digital Assets" },
] as const;

export const STATS = [
  { value: 500, label: "Templates", suffix: "+" },
  { value: 100, label: "Happy Clients", suffix: "+" },
  { value: 50, label: "E-Books", suffix: "+" },
  { value: 24, label: "Hour Support", suffix: "/7" },
] as const;
