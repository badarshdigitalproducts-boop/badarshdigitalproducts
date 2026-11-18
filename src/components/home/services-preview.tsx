"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Video, Globe, Megaphone, Check, ArrowRight, MessageSquare } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { services as initialServices } from "@/content/services";
import { useCurrency } from "@/context/currency-context";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import type { Service } from "@/types";

export function ServicesPreview() {
  const [serviceList, setServiceList] = useState<Service[]>(initialServices);
  const { formatPrice: formatCurr } = useCurrency();

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

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("video")) return Video;
    if (t.includes("website")) return Globe;
    return Megaphone;
  };

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Done-For-You Studio"
          title="Need Us To Build It For You?"
          subtitle="Don't have time to design? Our in-house team handles high-impact video editing, custom websites, and growth management."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {serviceList.slice(0, 3).map((service, index) => {
            const Icon = getIcon(service.title);
            const starterPlan = service.packages[0];

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-card-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5"
              >
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-6 font-heading text-2xl font-bold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {service.description}
                  </p>

                  <div className="mt-6 border-t border-card-border/60 pt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      What's Included:
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {service.features.slice(0, 4).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-foreground/90">
                          <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 border-t border-card-border/60 pt-6">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-muted">Starting at</span>
                      <p className="font-heading text-2xl font-extrabold text-foreground">
                        {formatCurr(starterPlan.price)}
                        <span className="text-xs font-normal text-muted">
                          {" "}/ {starterPlan.period || "project"}
                        </span>
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Hi BADARSH! I'm interested in your ${service.title} service. Can we discuss?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 transition-colors hover:bg-emerald-500 hover:text-white"
                      title="Inquire on WhatsApp"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </a>
                  </div>

                  <Link
                    href={`/services#${service.slug}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-card-border bg-background py-3 font-heading text-xs font-bold text-foreground transition-all duration-200 hover:border-accent hover:bg-accent hover:text-white"
                  >
                    <span>View Packages &amp; Portfolio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-14 rounded-3xl border border-accent/20 bg-gradient-to-r from-accent/5 via-purple-500/10 to-amber-500/5 p-8 text-center backdrop-blur-md">
          <h4 className="font-heading text-xl font-bold text-foreground md:text-2xl">
            Need a custom digital marketing package?
          </h4>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
            We build end-to-end setups combining custom branding, social reels, and high-converting landing pages tailored to your budget.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Hi BADARSH team! I want a custom end-to-end digital marketing and design package for my business."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 font-heading text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover"
          >
            <span>Book A Free Strategy Chat</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

