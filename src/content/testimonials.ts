import type { Testimonial } from "@/types";

export interface VerifiedTestimonial extends Testimonial {
  verifiedPurchase?: boolean;
  platformBadge?: string;
  niche?: string;
}

export const testimonials: VerifiedTestimonial[] = [
  {
    id: "test-001",
    name: "Priya Sharma",
    role: "Boutique Owner & Creator",
    company: "Studio Vastra, Jaipur",
    niche: "Fashion & Retail",
    verifiedPurchase: true,
    platformBadge: "Studio Template Pack",
    content:
      "As a solo boutique owner, I don't have hours to learn complex tools. BADARSH's Instagram Reels and Carousel templates are clean, elegant, and took me less than 10 minutes to customize with my brand colors in my browser. Zero watermarks, zero fuss.",
    rating: 5,
    avatar: "/images/testimonials/avatar-1.png",
  },
  {
    id: "test-002",
    name: "Arjun Mehta",
    role: "Founder & Consultant",
    company: "Mehta Advisory Group, Mumbai",
    niche: "B2B Consulting",
    verifiedPurchase: true,
    platformBadge: "Modern Pitch Deck",
    content:
      "The Modern Pitch Deck template has genuine architectural restraint — no tacky clutter, just crisp typography and structured slide layouts. Our prospective clients complimented how sharp our proposal deck looked. Exceptional value for money.",
    rating: 5,
    avatar: "/images/testimonials/avatar-2.png",
  },
  {
    id: "test-003",
    name: "Kavitha Nair",
    role: "Content Creator",
    company: "Mindful Living India, Kochi",
    niche: "Wellness & Lifestyle",
    verifiedPurchase: true,
    platformBadge: "Instagram Growth Suite",
    content:
      "What I appreciate most is that every single font and graphic works out of the box without needing any paid subscriptions. The carousel layouts have saved me 4-5 hours every weekend. My Instagram feed finally looks consistent and intentional.",
    rating: 5,
    avatar: "/images/testimonials/avatar-3.png",
  },
  {
    id: "test-004",
    name: "Rohit Agarwal",
    role: "Commercial Photographer",
    company: "Agarwal Visuals, Delhi",
    niche: "Creative Services",
    verifiedPurchase: true,
    platformBadge: "Website Building Service",
    content:
      "Hired BADARSH for their Next.js website building service. They delivered a blazing fast, mobile-responsive portfolio in under two weeks. The WhatsApp communication was clear and professional from day one.",
    rating: 5,
    avatar: "/images/testimonials/avatar-4.png",
  },
  {
    id: "test-005",
    name: "Dr. Sneha Reddy",
    role: "Dermatologist & Clinic Founder",
    company: "DermaCare Aesthetics, Hyderabad",
    niche: "Healthcare & Clinic",
    verifiedPurchase: true,
    platformBadge: "Social Starter Kit",
    content:
      "Our clinic staff uses the Social Starter Kit for patient education posts. The typography is legible and modern, and the templates maintain visual polish across all our announcements. Highly recommended for small businesses.",
    rating: 5,
    avatar: "/images/testimonials/avatar-5.png",
  },
  {
    id: "test-006",
    name: "Vikram Desai",
    role: "Managing Director",
    company: "Desai Logistics, Pune",
    niche: "Logistics & Supply Chain",
    verifiedPurchase: true,
    platformBadge: "Brand Identity Kit",
    content:
      "We purchased the Complete Brand Identity Kit to standardize our internal decks and business cards. Clean grid systems, clear export instructions, and instant digital delivery right after payment.",
    rating: 4,
    avatar: "/images/testimonials/avatar-6.png",
  },
];
