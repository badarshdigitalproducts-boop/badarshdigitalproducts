"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { testimonials } from "@/content/testimonials";

export function Testimonials() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Real Results"
          title="Loved by Founders &amp; Creators"
          subtitle="Discover how entrepreneurs across India use BADARSH to build authority, save lakhs on agency retainers, and close clients."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="flex flex-col justify-between rounded-3xl border border-card-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-muted/20" />
                </div>

                <p className="mt-5 text-sm leading-relaxed text-foreground/90 italic">
                  "{item.content}"
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-card-border/60 pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-accent to-purple-400 font-heading text-sm font-bold text-white shadow-sm">
                  {item.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-foreground">
                    {item.name}
                  </h4>
                  <p className="text-xs text-muted">
                    {item.role} &bull;{" "}
                    <span className="text-accent">{item.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

