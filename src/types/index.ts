export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  features: string[];
  packages: ServicePackage[];
  process: ProcessStep[];
  faq: FAQ[];
}

export interface ServicePackage {
  name: string;
  price: number;
  currency: string;
  period?: string;
  description: string;
  features: string[];
  isPopular: boolean;
  ctaText: string;
  whatsappMessage: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    instagram: string;
    youtube: string;
    whatsapp: string;
    email: string;
    pinterest: string;
  };
}

