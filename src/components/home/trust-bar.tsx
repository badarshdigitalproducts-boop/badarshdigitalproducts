"use client";

import { motion } from "framer-motion";
import { Building2, Store, Briefcase, Sparkles, Coffee, Dumbbell, Stethoscope, Utensils } from "lucide-react";

const clientNiches = [
  { name: "Retail & Boutiques", icon: Store },
  { name: "Cafes & Restaurants", icon: Coffee },
  { name: "Fitness & Wellness", icon: Dumbbell },
  { name: "Clinics & Doctors", icon: Stethoscope },
  { name: "Real Estate Agencies", icon: Building2 },
  { name: "Consultants & Coaches", icon: Briefcase },
  { name: "Salons & Spas", icon: Sparkles },
  { name: "Food & Bakeries", icon: Utensils },
];

export function TrustBar() {
  return (
    <section className="overflow-hidden w-full max-w-full border-y border-card-border/60 bg-card/30 py-8 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted">
          Empowering 100+ Businesses, Brands &amp; Creators Across India
        </p>

        {/* Scrolling ticker */}
        <div className="relative mt-6 overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <div className="flex w-max animate-[marquee_25s_linear_infinite] gap-12 py-2">
            {[...clientNiches, ...clientNiches].map((niche, idx) => {
              const Icon = niche.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 text-muted transition-colors duration-200 hover:text-foreground"
                >
                  <Icon className="h-5 w-5 text-accent/80" />
                  <span className="font-heading text-sm font-semibold tracking-tight">
                    {niche.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

