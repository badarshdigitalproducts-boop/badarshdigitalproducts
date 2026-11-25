"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Award,
  Layers,
  Star,
  X,
  ExternalLink,
} from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";
import { WHATSAPP_DISPLAY, BUSINESS_LOCATION } from "@/lib/constants";
import { PricingTable } from "@/components/services/pricing-table";
import { ServiceCheckoutModal } from "@/components/services/service-checkout-modal";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

const GALLERY_CATEGORIES = [
  { id: "all", label: "All Works" },
  { id: "wedding", label: "Weddings & Reception" },
  { id: "birthday", label: "Birthdays & Celebrations" },
  { id: "corporate", label: "Corporate Galas & Summits" },
  { id: "fashion", label: "Fashion & Model Portfolios" },
];

export default function EventPhotographyPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);

  const galleryItems = [
    {
      title: "Traditional Heritage Wedding",
      cat: "wedding",
      img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
      location: "Bengaluru Palace",
    },
    {
      title: "Luxury 1st Birthday Celebration",
      cat: "birthday",
      img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1200&q=80",
      location: "The Leela Palace",
    },
    {
      title: "Tech Founders Annual Summit",
      cat: "corporate",
      img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80",
      location: "JW Marriott Bengaluru",
    },
    {
      title: "Editorial Fashion Lookbook",
      cat: "fashion",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80",
      location: "BADARSH Studio",
    },
    {
      title: "Evening Sangeet & Dance Floor",
      cat: "wedding",
      img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
      location: "Taj West End",
    },
    {
      title: "Golden Hour Couple Portrait",
      cat: "wedding",
      img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80",
      location: "Nandi Hills",
    },
  ];

  const packages = [
    {
      id: "photo-silver",
      name: "Silver Coverage (Half-Day)",
      price: 18000,
      description: "Ideal for birthday parties, corporate keynotes, or private family gatherings up to 4 hours.",
      features: [
        "1 Senior Lead Photographer (Sony FX3 / A7IV)",
        "Up to 4 hours continuous coverage",
        "20 teaser photos delivered on WhatsApp within 24 hours",
        "150+ color-graded high-res photos via cloud gallery",
        "Full commercial & personal usage rights",
      ],
      turnaround: "3 to 4 business days",
      badge: "Intimate Events",
    },
    {
      id: "photo-gold",
      name: "Gold Coverage (Full-Day VIP)",
      price: 35000,
      description: "Our signature wedding, large corporate gala, or multi-venue celebration coverage.",
      features: [
        "2 Senior Photographers (Candid + Traditional)",
        "Up to 8 hours full-day coverage",
        "50 teaser photos delivered on WhatsApp within 24 hours",
        "350+ master color-graded high-res photos",
        "Online private client proofing gallery (1-year storage)",
        "Custom USB gift box with high-res archival prints",
      ],
      turnaround: "5 to 7 business days",
      badge: "Most Popular",
      isPopular: true,
    },
    {
      id: "photo-platinum",
      name: "Platinum Suite (Multi-Day Luxury)",
      price: 65000,
      description: "Comprehensive multi-day wedding celebration or 2-day corporate conference.",
      features: [
        "Full 3-person camera & lighting crew",
        "Up to 2 full days of coverage (Sangeet + Wedding + Reception)",
        "Same-night instant teaser highlight reel",
        "700+ master retouched photos in 4K resolution",
        "Luxury leather-bound hardcover coffee table album (40 pages)",
        "Drone aerial crowd photography included",
      ],
      turnaround: "7 business days",
      badge: "Grand Weddings",
    },
  ];

  const filteredGallery = galleryItems.filter((item) =>
    selectedCategory === "all" ? true : item.cat === selectedCategory
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
      <Breadcrumbs
        items={[
          { label: "Services", href: "/services" },
          { label: "Event Photography", href: "/services/event-photography" },
        ]}
      />
      {/* Compact Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
          Event &amp; Portrait Photography
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          24-hour WhatsApp teaser delivery, Sony G-Master prime optics, and destination coverage across India.
        </p>
      </div>

      {/* Luxury Photo Gallery with Category Switcher */}
      <div>
        <div className="flex items-center justify-start gap-2 overflow-x-auto pb-4 scrollbar-none">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry Gallery Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, idx) => (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => setLightboxImg(item.img)}
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-900 shadow-md cursor-pointer border border-neutral-200 dark:border-neutral-800"
            >
              <img
                src={item.img}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                  {item.location}
                </span>
                <h3 className="font-heading text-lg font-bold">{item.title}</h3>
                <span className="mt-2 text-xs text-white/70">Click to view full resolution →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Production Gear & Rig Specs Dock */}
      <div className="mt-20 rounded-3xl bg-neutral-50 dark:bg-neutral-950 p-8 border border-neutral-200 dark:border-neutral-800">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Professional Equipment Guarantee
          </span>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            Cinema-Grade Camera Rig &amp; Studio Lighting
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            We don&apos;t shoot with entry-level consumer bodies. Every BADARSH assignment is operated with dual-card redundant Sony Full-Frame cameras, Carl Zeiss / G-Master f/1.4 primes, and wireless Godox off-camera flash units.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
            <span className="font-bold text-neutral-900 dark:text-white block">Sony FX3 &amp; A7IV</span>
            <span className="text-[11px] text-neutral-400">33MP Full-Frame &amp; 4K 120p video</span>
          </div>
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
            <span className="font-bold text-neutral-900 dark:text-white block">G-Master f/1.4 Primes</span>
            <span className="text-[11px] text-neutral-400">24mm, 50mm, 85mm portrait lenses</span>
          </div>
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
            <span className="font-bold text-neutral-900 dark:text-white block">Godox AD400 Pro</span>
            <span className="text-[11px] text-neutral-400">High-speed wireless softbox strobes</span>
          </div>
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
            <span className="font-bold text-neutral-900 dark:text-white block">Dual-Card Backup</span>
            <span className="text-[11px] text-neutral-400">Zero data-loss redundancy on shoot</span>
          </div>
        </div>
      </div>

      {/* Package Pricing Tiers */}
      <div className="mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Transparent Investment
          </span>
          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
            Photography Packages &amp; Pricing
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-500">
            No hidden overtime penalties. Book directly online or chat on WhatsApp to customize hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-3xl p-8 flex flex-col justify-between border ${
                pkg.isPopular
                  ? "border-neutral-900 dark:border-white shadow-2xl bg-white dark:bg-neutral-900 ring-2 ring-neutral-900 dark:ring-white"
                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Most Requested Choice
                </div>
              )}

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {pkg.badge}
                </span>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
                  {pkg.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                    ₹{pkg.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-neutral-400">all inclusive</span>
                </div>
                <p className="mt-3 text-xs text-neutral-500 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="mt-6 space-y-2.5 border-t border-neutral-100 dark:border-neutral-800 pt-6">
                  {pkg.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                <div className="text-[11px] text-neutral-400 mb-3 text-center">
                  Turnaround: <span className="font-bold text-neutral-800 dark:text-neutral-200">{pkg.turnaround}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedPackage(pkg)}
                    className="w-full rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-3 text-xs font-bold shadow-md hover:scale-102 transition-transform"
                  >
                    Book Online Now
                  </button>
                  <a
                    href={getWhatsAppUrl(`Hi BADARSH! I'm interested in booking the ${pkg.name} for an upcoming photoshoot. Can you check date availability?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 py-2.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Check Date on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImg && (
          <div
            onClick={() => setLightboxImg(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-zoom-out"
          >
            <div className="relative max-w-5xl max-h-[90vh]">
              <img
                src={lightboxImg}
                alt="Full resolution preview"
                className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-2xl"
              />
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute top-4 right-4 rounded-full bg-black/70 p-2 text-white hover:bg-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Service Checkout Modal */}
      {selectedPackage && (
        <ServiceCheckoutModal
          isOpen={Boolean(selectedPackage)}
          onClose={() => setSelectedPackage(null)}
          plan={{
            id: selectedPackage.id,
            name: selectedPackage.name,
            price: selectedPackage.price,
            period: "one-time",
            description: selectedPackage.description,
            features: selectedPackage.features,
            turnaround: selectedPackage.turnaround,
          }}
          serviceTitle="Event & Portrait Photography"
        />
      )}
    </div>
  );
}
