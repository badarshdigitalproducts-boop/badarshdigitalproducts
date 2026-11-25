"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Globe,
  Share2,
  Smartphone,
  Camera,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  Play,
  Download,
  Eye,
  Check,
  Zap,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { PricingTable } from "@/components/services/pricing-table";
import { services as initialServices } from "@/content/services";
import { getWhatsAppUrl } from "@/lib/utils";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SmartImage } from "@/components/shared/smart-image";
import { buildServiceSchemas } from "@/lib/seo-schema";
import type { Service } from "@/types";

const { professionalServiceJsonLd, serviceJsonLd } = buildServiceSchemas({
  name: "BADARSH Creative Studio & Development Services",
  description:
    "High-retention video editing, Next.js website design and development, social media management, commercial photo retouching, and brand identity services in Bengaluru.",
  urlPath: "/services",
  serviceType: "Creative Studio & Web Development Agency",
  offers: [
    { name: "Short-Form Video Editing", price: 250, description: "Per vertical video edit" },
    { name: "Next.js Landing Page Website", price: 3999, description: "Custom fast website" },
    { name: "Social Media Monthly Management", price: 9999, description: "Monthly retainer" },
  ],
});

export default function ServicesPage() {
  const [serviceList, setServiceList] = useState<Service[]>(initialServices);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.services && data.services.length > 0) {
          setServiceList(data.services);
        }
      })
      .catch((err) => console.error("Error loading live services:", err));
  }, []);

  const toggleFaq = (key: string) => {
    setOpenFaq(openFaq === key ? null : key);
  };

  const getIcon = (slug: string) => {
    if (slug.includes("video")) return Video;
    if (slug.includes("website")) return Globe;
    if (slug.includes("app")) return Smartphone;
    if (slug.includes("photo")) return Camera;
    if (slug.includes("brand")) return Sparkles;
    return Share2;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Breadcrumbs items={[{ label: "Services", href: "/services" }]} />
      {/* Compact Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Studio Production &amp; Engineering Services
        </h1>
        <p className="mt-1 text-sm text-muted">
          In-house video editing, custom Next.js applications, photography, and growth retainers delivered with transparent packages.
        </p>
      </div>

      {/* Services List */}
      <div className="space-y-16 md:space-y-24">
        {serviceList.map((service, idx) => {
          const Icon = getIcon(service.slug);

          return (
            <section
              key={service.id}
              id={service.slug}
              className="scroll-mt-28 border-t border-card-border/60 pt-16 first:border-t-0 first:pt-0"
            >
              {/* Service Header */}
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-accent">
                      Service #0{idx + 1}
                    </span>
                    <h2 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">
                      {service.title}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-card px-5 py-3 font-heading text-xs font-bold text-foreground hover:border-accent hover:text-accent transition-all"
                  >
                    <span>View Dedicated Page</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <a
                    href={getWhatsAppUrl(
                      `Hi BADARSH! I'm interested in hiring your team for ${service.title}. Let's discuss my project!`,
                      service.title
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-heading text-xs font-bold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:scale-105"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Direct WhatsApp Desk</span>
                  </a>
                </div>
              </div>

              <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted">
                {service.longDescription}
              </p>

              {/* ---------------------------------------------------------------- */}
              {/* DYNAMIC PORTFOLIO SHOWCASE: VIDEO EDITING */}
              {/* ---------------------------------------------------------------- */}
              {service.slug === "video-editing" && service.portfolioVideos && service.portfolioVideos.length > 0 && (
                <div className="mt-10 rounded-3xl border border-card-border bg-card/60 p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
                    <div>
                      <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                        🎬 Real Edits Portfolio
                      </span>
                      <h3 className="mt-2 font-heading text-xl font-bold text-foreground">
                        Watch Our Edits — Inspect Quality Before Hiring
                      </h3>
                      <p className="text-xs text-muted">
                        Real cuts, color grading, sound design &amp; retention pacing crafted by BADARSH editors.
                      </p>
                    </div>
                    <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> 100% In-House Production
                    </span>
                  </div>

                  {/* Video Grid */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {service.portfolioVideos.map((videoSrc, vIdx) => (
                      <div
                        key={vIdx}
                        className="group relative overflow-hidden rounded-2xl border border-card-border bg-black shadow-md aspect-video"
                      >
                        <video
                          src={videoSrc}
                          controls
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-card-border/60 pt-4 text-xs text-muted">
                    <span>Liked what you saw? Send your raw footage via WhatsApp or Google Drive.</span>
                    <a
                      href={getWhatsAppUrl(
                        "Hi BADARSH! I watched your video editing portfolio and I want to send my raw footage for an edit.",
                        "Video Editing Portfolio"
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-accent hover:underline flex items-center gap-1"
                    >
                      <span>Send Raw Footage on WhatsApp</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------------- */}
              {/* DYNAMIC PORTFOLIO SHOWCASE: PHOTO EDITING */}
              {/* ---------------------------------------------------------------- */}
              {service.slug === "photo-editing" && service.portfolioImages && service.portfolioImages.length > 0 && (
                <div className="mt-10 rounded-3xl border border-card-border bg-card/60 p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
                    <div>
                      <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                        📸 Retouching &amp; Color Grading Gallery
                      </span>
                      <h3 className="mt-2 font-heading text-xl font-bold text-foreground">
                        Our Retouched Commercial Work
                      </h3>
                      <p className="text-xs text-muted">
                        High-end skin frequency separation, jewelry reflection cleaning, and e-commerce product alignment.
                      </p>
                    </div>
                    <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Studio-Grade Standard
                    </span>
                  </div>

                  {/* Photo Grid */}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {service.portfolioImages.map((imgSrc, pIdx) => (
                      <div
                        key={pIdx}
                        className="group relative aspect-square overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm"
                      >
                        <SmartImage
                          src={imgSrc}
                          alt={`Retouched Work ${pIdx + 1}`}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-[11px] font-bold text-white">
                            BADARSH High-End Edit
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-card-border/60 pt-4 text-xs text-muted">
                    <span>Have raw photos to retouch? We deliver samples within 24 hours.</span>
                    <a
                      href={getWhatsAppUrl(
                        "Hi BADARSH! I have photos that need retouching. Can I send 1-2 samples to test your quality?",
                        "Photo Editing Inquiry"
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-accent hover:underline flex items-center gap-1"
                    >
                      <span>Send Sample Photos on WhatsApp</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------------- */}
              {/* DYNAMIC PORTFOLIO SHOWCASE: BRAND IDENTITY (LOGOS) */}
              {/* ---------------------------------------------------------------- */}
              {service.slug === "brand-identity" && service.portfolioImages && service.portfolioImages.length > 0 && (
                <div className="mt-10 rounded-3xl border border-card-border bg-card/60 p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
                    <div>
                      <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                        ✨ Logo Designs &amp; Identity Systems
                      </span>
                      <h3 className="mt-2 font-heading text-xl font-bold text-foreground">
                        Our Designed Logos — Build Trust First
                      </h3>
                      <p className="text-xs text-muted">
                        Inspect our custom logo marks, typography combinations, and brand guideline sheets.
                      </p>
                    </div>
                    <a
                      href="https://drive.google.com/drive/folders/BADARSH_SAMPLE_LOGOS"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:border-accent hover:text-accent"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Sample Logos</span>
                    </a>
                  </div>

                  {/* Logo Gallery */}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {service.portfolioImages.map((logoImg, lIdx) => (
                      <div
                        key={lIdx}
                        className="group relative aspect-square overflow-hidden rounded-2xl border border-card-border bg-white p-4 shadow-sm flex items-center justify-center"
                      >
                        <SmartImage
                          src={logoImg}
                          alt={`Logo Design ${lIdx + 1}`}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl p-4"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 p-5 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
                    <div>
                      <h4 className="font-heading text-sm font-bold text-foreground">
                        Want a Custom Logo &amp; Brand System for Your Business?
                      </h4>
                      <p className="mt-0.5 text-xs text-muted">
                        We design original vector logos with full copyright ownership. Message us directly on WhatsApp.
                      </p>
                    </div>
                    <a
                      href={getWhatsAppUrl(
                        "Hi BADARSH! I want to order a custom logo design for my brand. Let's discuss!",
                        "Logo Design Custom Order"
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 sm:mt-0 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-accent-hover shrink-0"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Order Your Logo on WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------------- */}
              {/* DYNAMIC RATE CALLOUT: WEBSITE DESIGN & APP DEV */}
              {/* ---------------------------------------------------------------- */}
              {service.slug === "website-building" && (
                <div className="mt-10 rounded-3xl border border-accent/30 bg-gradient-to-r from-accent/15 via-purple-900/10 to-card p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
                        ⚡ Transparent Tiered Pricing
                      </span>
                      <h3 className="mt-2 font-heading text-2xl font-black text-foreground">
                        Website Development Rates
                      </h3>
                      <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
                        <div className="rounded-xl border border-card-border/60 bg-card/60 p-3">
                          <span className="font-bold text-accent">Normal / Landing Site</span>
                          <div className="font-heading text-lg font-black text-foreground mt-0.5">
                            ₹3,000 – ₹6,000
                          </div>
                          <p className="text-[11px] text-muted">1 to 3 sections, mobile optimized, WhatsApp button</p>
                        </div>
                        <div className="rounded-xl border border-card-border/60 bg-card/60 p-3">
                          <span className="font-bold text-emerald-500">5 to 8 Pages Business Site</span>
                          <div className="font-heading text-lg font-black text-foreground mt-0.5">
                            ₹9,000 – ₹11,000
                          </div>
                          <p className="text-[11px] text-muted">Complete SEO, blog, CMS dashboard, smooth animations</p>
                        </div>
                        <div className="rounded-xl border border-card-border/60 bg-card/60 p-3">
                          <span className="font-bold text-purple-400">15 to 20 Pages Enterprise</span>
                          <div className="font-heading text-lg font-black text-foreground mt-0.5">
                            ₹15,000+
                          </div>
                          <p className="text-[11px] text-muted">Full e-commerce / custom apps, payments, speed guarantee</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Deliverables Grid */}
              <div className="mt-8 rounded-2xl border border-card-border bg-card/40 p-6 md:p-8">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
                  Key Deliverables &amp; Guarantees:
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {service.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-foreground/90">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Packages */}
              <div className="mt-12">
                <h3 className="mb-6 font-heading text-xl font-bold text-foreground">
                  Packages &amp; Fixed Pricing ({service.title})
                </h3>
                <PricingTable
                  packages={service.packages}
                  serviceTitle={service.title}
                />
              </div>

              {/* Process Steps */}
              {service.process && service.process.length > 0 && (
                <div className="mt-16 rounded-3xl border border-card-border bg-card/60 p-8 md:p-12">
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    Our 4-Step Agency Process
                  </h3>
                  <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {service.process.map((step) => (
                      <div key={step.step} className="relative">
                        <span className="font-heading text-2xl font-black text-accent/40">
                          0{step.step}
                        </span>
                        <h4 className="mt-2 font-heading text-base font-bold text-foreground">
                          {step.title}
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-muted">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ Accordion */}
              {service.faq && service.faq.length > 0 && (
                <div className="mt-12">
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    Frequently Asked Questions ({service.title})
                  </h3>
                  <div className="mt-4 divide-y divide-card-border/60 rounded-2xl border border-card-border bg-card">
                    {service.faq.map((item, fIdx) => {
                      const faqKey = `${service.id}-${fIdx}`;
                      const isOpen = openFaq === faqKey;

                      return (
                        <div key={fIdx} className="p-5">
                          <button
                            onClick={() => toggleFaq(faqKey)}
                            className="flex w-full cursor-pointer items-center justify-between text-left"
                          >
                            <span className="font-heading text-sm font-bold text-foreground">
                              {item.question}
                            </span>
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
                                isOpen ? "rotate-180 text-accent" : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <p className="mt-3 text-xs leading-relaxed text-muted">
                                  {item.answer}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Custom Agency Inquiries Footer */}
      <div className="mt-28 rounded-3xl border border-accent/30 bg-gradient-to-r from-accent/10 via-purple-900/20 to-card p-10 text-center shadow-xl md:p-16">
        <Sparkles className="mx-auto h-10 w-10 text-accent" />
        <h2 className="mt-4 font-heading text-3xl font-extrabold text-foreground sm:text-4xl">
          Have a Custom Brand or Large Project?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Whether you need a full enterprise website redesign, a monthly video editing retainer, custom mobile apps, or corporate rebrands, we partner personally with you on WhatsApp.
        </p>

        <a
          href={getWhatsAppUrl(
            "Hi BADARSH founders! I have a custom agency requirement and would like to schedule a discovery chat.",
            "Custom Agency Discovery"
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-heading text-sm font-bold text-white shadow-lg shadow-accent/25 hover:bg-accent-hover hover:scale-105 transition-all"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Chat Directly With BADARSH Founders</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
