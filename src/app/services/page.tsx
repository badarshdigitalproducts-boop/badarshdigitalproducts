"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Globe,
  Megaphone,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { PricingTable } from "@/components/services/pricing-table";
import { services } from "@/content/services";
import { getWhatsAppUrl } from "@/lib/utils";

export default function ServicesPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (key: string) => {
    setOpenFaq(openFaq === key ? null : key);
  };

  const getIcon = (title: string) => {
    if (title.toLowerCase().includes("video")) return Video;
    if (title.toLowerCase().includes("website")) return Globe;
    return Megaphone;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Top Hero */}
      <SectionHeader
        badge="Done-For-You Agency"
        title="Creative Services for Growing Brands"
        subtitle="Skip the guesswork and hire our elite team. We produce high-converting short-form videos, build ultra-fast Next.js websites, and grow your digital audience."
      />

      {/* Services List */}
      <div className="mt-16 space-y-24 md:space-y-36">
        {services.map((service, idx) => {
          const Icon = getIcon(service.title);

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

                <a
                  href={getWhatsAppUrl(
                    `Hi BADARSH! I'm interested in hiring your team for ${service.title}. Let's chat!`,
                    service.title
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 font-heading text-xs font-bold text-white shadow-md hover:bg-accent-hover"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Discuss Your Project</span>
                </a>
              </div>

              <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted">
                {service.longDescription}
              </p>

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
                  Transparent Packages &amp; Pricing
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
                    Our 4-Step Delivery Process
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
          Have a Unique Brand or Custom Requirement?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Whether you need a full enterprise website redesign, monthly video retainer for 60+ Reels, or custom employee presentation decks, we're ready to partner with you.
        </p>

        <a
          href={getWhatsAppUrl(
            "Hi BADARSH founders! I have a custom agency requirement and would like to schedule a discovery call.",
            "Custom Agency Discovery"
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-heading text-sm font-bold text-white shadow-lg shadow-accent/25 hover:bg-accent-hover"
        >
          <span>Schedule A Custom Discovery Call</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

