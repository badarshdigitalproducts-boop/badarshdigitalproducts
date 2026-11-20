"use client";

import { motion } from "framer-motion";
import { Search, DownloadCloud, Sparkles, ArrowRight, Layers, Zap } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";

const steps = [
  {
    step: "01",
    title: "Select Asset or Service",
    description:
      "Explore verified mobile creator apps, master SFX packs, Lightroom presets, digital planners, or done-for-you production services.",
    icon: Search,
  },
  {
    step: "02",
    title: "Instant Cloud Delivery",
    description:
      "Receive direct app downloads, 1-click Adobe Lightroom presets, Google Drive master asset folders, and immediate client onboarding.",
    icon: Zap,
  },
  {
    step: "03",
    title: "Create & Convert",
    description:
      "Drop uncompressed audio SFX into your editing timeline, apply cinematic presets in 1 tap, or launch your custom high-conversion website.",
    icon: Sparkles,
  },
];

export function HowItWorks() {
  return (
    <section className="overflow-hidden border-t border-card-border/60 bg-card/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Seamless Flow"
          title="How BADARSH Operates"
          subtitle="From high-speed asset access to full-scale digital agency execution. Here is how creators and brands scale with us."
        />

        <div className="relative mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative flex flex-col rounded-2xl border border-card-border bg-card p-8 shadow-xs transition-all duration-300 hover:border-foreground/20 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-card-border text-foreground">
                    <Icon className="h-6 w-6 text-accent" />
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
                    <ArrowRight className="h-5 w-5 text-muted/30" />
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
