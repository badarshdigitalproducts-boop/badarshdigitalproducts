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

// Mega-nav structure for the public header
export const NAV_LINKS = [
  { label: "Templates", href: "/templates" },
  { label: "E-Books", href: "/ebooks" },
  { label: "Planners", href: "/planners" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
] as const;

export const SHOP_MENU = [
  {
    label: "Canva Templates",
    href: "/templates",
    desc: "Canva & design templates for every platform",
    icon: "",
  },
  {
    label: "Business E-Books",
    href: "/ebooks",
    desc: "Business guides, marketing playbooks & more",
    icon: "",
  },
  {
    label: "Productivity Planners",
    href: "/planners",
    desc: "Life, gym, diet & career planning PDF systems",
    icon: "",
  },
  {
    label: "All-in-One Bundles",
    href: "/bundles",
    desc: "Save big with curated 2026 mega bundles",
    icon: "",
  },
  {
    label: "Editing Apps",
    href: "/editing-apps",
    desc: "Verified video editing APKs & software tools",
    icon: "",
  },
  {
    label: "Video SFX & Overlays",
    href: "/editing-bundles",
    desc: "1-click CapCut/Premiere templates & 350+ SFX",
    icon: "",
  },
  {
    label: "Photo Presets",
    href: "/photo-presets",
    desc: "1-click Lightroom mobile & desktop presets",
    icon: "",
  },
] as const;

export const SERVICES_MENU = [
  {
    label: "Video Editing",
    href: "/services/video-editing",
    desc: "Reels, YouTube & short-form video pacing",
    icon: "",
  },
  {
    label: "Photo Editing",
    href: "/services/photo-editing",
    desc: "High-end retouching & product photography edits",
    icon: "",
  },
  {
    label: "Social Media",
    href: "/services/social-media-management",
    desc: "End-to-end content production & visual systems",
    icon: "",
  },
  {
    label: "Website Design",
    href: "/services/website-design",
    desc: "Custom Next.js websites: ₹3k-6k / ₹9k-11k / ₹15k+",
    icon: "",
  },
  {
    label: "App Development",
    href: "/services/app-development",
    desc: "Mobile & web applications for modern brands",
    icon: "",
  },
  {
    label: "Brand Identity (Logos)",
    href: "/services/brand-identity",
    desc: "Logos, brand guidelines & design tokens",
    icon: "",
  },
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
  { value: "editing-apps", label: "Editing Apps" },
  { value: "editing-bundles", label: "Editing Bundles" },
  { value: "photo-presets", label: "Photo Presets" },
] as const;

// All product delivery types supported by BADARSH admin
export const PRODUCT_TYPES = [
  { value: "canva-template", label: "Canva Template" },
  { value: "ebook", label: "E-Book (PDF)" },
  { value: "planner", label: "Planner / Tracker" },
  { value: "app-license", label: "App / Software License" },
  { value: "video-preset", label: "Video Preset / LUT" },
  { value: "photo-preset", label: "Photo Preset / Lightroom" },
  { value: "bundle", label: "Bundle Pack" },
  { value: "editing-bundle", label: "Editing Bundle" },
  { value: "website-template", label: "Website Template" },
  { value: "audio", label: "Audio / Music Pack" },
  { value: "font-pack", label: "Font Pack" },
  { value: "other", label: "Other Digital Product" },
] as const;

export const DELIVERY_TYPES = [
  { value: "canva-link", label: "Canva Template Link" },
  { value: "download-url", label: "Direct Download URL" },
  { value: "google-drive", label: "Google Drive Link" },
  { value: "external-url", label: "External Link (App / Preset / Template)" },
  { value: "whatsapp-delivery", label: "Manual WhatsApp Delivery" },
] as const;

export const STATS = [
  { value: 500, label: "Designer Templates", suffix: "+" },
  { value: 1200, label: "Digital Downloads", suffix: "+" },
  { value: 98, label: "Satisfaction Rate", suffix: "%" },
  { value: 24, label: "Support on WhatsApp", suffix: "h" },
] as const;


