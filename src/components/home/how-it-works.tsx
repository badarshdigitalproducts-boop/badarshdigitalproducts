"use client";

import { motion } from "framer-motion";
import { Search, DownloadCloud, Sparkles, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";

const steps = [
  {
    step: "01",
    title: "Browse & Select",
    description:
      "Explore industry-tested template packs, pitch decks, planners, or growth playbooks crafted for maximum engagement.",
    icon: Search,
  },
  {
    step: "02",
    title: "Instant Access",
    description:
      "Receive official Canva template access links and direct digital asset downloads right away. No waiting, no friction.",
    icon: DownloadCloud,
  },
  {
    step: "03",
    title: "Customize & Launch",
    description:
      "Edit text, images, and brand colors in Canva Free with drag-and-drop simplicity. Publish and start winning customers.",
    icon: Sparkles,
  },
];

export function HowItWorks() {
  return (
    <section className="overflow-hidden border-t border-card-border/60 bg-card/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Simple & Seamless"
          title="How BADARSH Works"
          subtitle="From zero to professional branding in under 10 minutes. Here's how thousands of creators and owners do it."
        />

        <div className="relative mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative flex flex-col rounded-3xl border border-card-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="font-heading text-3xl font-extrabold text-muted/30">
                    {item.step}
                  </span>
                </div>

                <h3 className="mt-6 font-heading text-xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>

                {index < steps.length - 1 && (
                  <div className="hidden md:absolute -right-4 top-1/2 -translate-y-1/2 z-10 lg:block">
                    <ArrowRight className="h-6 w-6 text-muted/30" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

