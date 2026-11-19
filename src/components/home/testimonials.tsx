"use client";

import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { testimonials, type VerifiedTestimonial } from "@/content/testimonials";

export function Testimonials() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Verified Reviews"
          title="Loved by Founders &amp; Creators"
          subtitle="Genuine feedback from business owners, consultants, and independent creators who build their digital presence with BADARSH."
        />

        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none px-4 -mx-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:px-0 md:mx-0">
          {testimonials.map((item: VerifiedTestimonial, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="flex w-[85vw] shrink-0 snap-center sm:w-[340px] md:w-auto flex-col justify-between rounded-3xl border border-card-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-foreground/20 hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {item.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-500">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>

                {item.platformBadge && (
                  <div className="mt-3">
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-accent">
                      {item.platformBadge}
                    </span>
                  </div>
                )}

                <p className="mt-4 text-sm leading-relaxed text-foreground/90 italic">
                  "{item.content}"
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-card-border/60 pt-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-accent to-purple-400 font-heading text-sm font-bold text-white shadow-sm">
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
                    <span className="text-foreground/80">{item.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legal & Trust Note */}
        <p className="mt-10 text-center text-xs text-muted">
          * Reviews collected directly from verified purchasers and agency clients. Individual business results vary based on content strategy and execution.
        </p>
      </div>
    </section>
  );
}
