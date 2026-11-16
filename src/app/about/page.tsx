"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  Heart,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { STATS, WHATSAPP_NUMBER } from "@/lib/constants";
import { AnimatedCounter } from "@/components/shared/animated-counter";

const values = [
  {
    title: "Radical Affordability",
    description:
      "Elite branding shouldn't cost ₹50,000 to ₹2,00,000. We democratize studio-level Canva templates and high-impact services for every ambitious shop owner, creator, and founder.",
    icon: Target,
  },
  {
    title: "10-Minute Time to Value",
    description:
      "We build templates that are instantly editable in Canva Free. No complicated software, no steep learning curves. Download, customize, publish, and win.",
    icon: Zap,
  },
  {
    title: "Builder-First Reliability",
    description:
      "Whether you buy a ₹299 template or hire our video editing studio for ₹15,000/month, we deliver with obsession over typography, spacing, and conversion science.",
    icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      <SectionHeader
        badge="Our Story &amp; Vision"
        title="We Believe Design is the Ultimate Unfair Advantage"
        subtitle="BADARSH was founded with one mission: to make modern Indian businesses look world-class online without draining their budgets."
      />

      {/* Hero Story Banner */}
      <div className="mt-12 overflow-hidden rounded-3xl border border-card-border bg-gradient-to-br from-accent/10 via-purple-900/10 to-card p-8 md:p-16 shadow-sm">
        <div className="mx-auto max-w-3xl">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-accent">
            The BADARSH Manifesto
          </span>
          <h2 className="mt-3 font-heading text-2xl font-extrabold text-foreground sm:text-4xl leading-tight">
            "Your product might be great. But if your visual presentation looks like it was made in 2010, customers will scroll right past you."
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
            <p>
              In today's digital economy, first impressions happen in under 3 seconds on an Instagram Reel, a LinkedIn carousel, or a mobile landing page.
            </p>
            <p>
              Traditional creative agencies take 4 weeks and charge lakhs just to produce a basic brand kit. On the other hand, cheap freelancer marketplaces leave you with generic, broken layouts that hurt your credibility.
            </p>
            <p>
              <strong>BADARSH bridges that exact gap.</strong> We provide plug-and-play Canva templates, marketing playbooks, and video services created by senior designers who understand consumer psychology and high conversion.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="mt-16 grid grid-cols-2 gap-4 rounded-3xl border border-card-border/80 bg-card p-6 shadow-sm sm:grid-cols-4 sm:p-8">
        {STATS.map((stat) => (
          <AnimatedCounter
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
          />
        ))}
      </div>

      {/* Core Values */}
      <div className="mt-24">
        <SectionHeader
          badge="What Drives Us"
          title="Our Operating Principles"
          subtitle="How we design, code, and support our community of founders."
        />

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className="flex flex-col rounded-3xl border border-card-border bg-card p-8 shadow-sm transition hover:border-accent/40 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-heading text-xl font-bold text-foreground">
                  {val.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {val.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to action */}
      <div className="mt-28 rounded-3xl border border-card-border bg-card p-10 text-center shadow-lg md:p-16">
        <h2 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">
          Ready to Elevate Your Digital Brand?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Browse our ready-to-use Canva templates or connect with us to build a custom solution for your business.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/templates"
            className="flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 font-heading text-sm font-bold text-white shadow-md hover:bg-accent-hover"
          >
            <span>Explore Templates</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-full border border-card-border bg-background px-8 py-3.5 font-heading text-sm font-bold text-foreground hover:border-accent"
          >
            <span>Contact The Team</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

