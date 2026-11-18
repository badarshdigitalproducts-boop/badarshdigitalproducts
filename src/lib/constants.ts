import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "BADARSH",
  description:
    "High-impact Canva templates, marketing playbooks & done-for-you creative services. Built for ambitious founders and creators to scale their brand online.",
  url: "https://badarsh.com",
  ogImage: "/images/og/og-default.png",
  links: {
    instagram: "https://instagram.com/badarsh",
    youtube: "https://youtube.com/@badarsh",
    whatsapp: "https://wa.me/917204250115",
    email: "hello@badarsh.com",
    pinterest: "https://pinterest.com/badarsh",
  },
};

export const WHATSAPP_NUMBER = "917204250115";
export const WHATSAPP_DISPLAY = "+91 72042 50115";
export const SUPPORT_EMAIL = "hello@badarsh.com";
export const BUSINESS_LEGAL_NAME = "BADARSH Digital Products";
export const BUSINESS_LOCATION = "Bengaluru, Karnataka, India";

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
  { value: 500, label: "Designer Templates", suffix: "+" },
  { value: 1200, label: "Digital Downloads", suffix: "+" },
  { value: 98, label: "Satisfaction Rate", suffix: "%" },
  { value: 24, label: "Support on WhatsApp", suffix: "h" },
] as const;


