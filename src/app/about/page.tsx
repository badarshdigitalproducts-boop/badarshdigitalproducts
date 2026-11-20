"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Video,
  Smartphone,
  Sliders,
  Code2,
  Layers,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Send,
  Check,
  Building2,
  ExternalLink,
} from "lucide-react";
import { STATS, WHATSAPP_NUMBER, WHATSAPP_DISPLAY, SUPPORT_EMAIL, BUSINESS_LOCATION } from "@/lib/constants";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { getWhatsAppUrl } from "@/lib/utils";

const ecosystemPillars = [
  {
    title: "Production Master Vaults",
    desc: "Uncompressed 24-bit 48kHz WAV audio sound effects, 4K ProRes transparent alpha overlays, and color LUTs engineered for high-retention video creators.",
    icon: Video,
    tag: "4K Master Assets",
    link: "/editing-bundles",
  },
  {
    title: "Verified Creator Software",
    desc: "Direct, high-speed mobile apps (CapCut Pro, mobile creator tools) with VIP transitions and 4K 60fps export unlocked. 100% virus-scanned.",
    icon: Smartphone,
    tag: "Verified Apps",
    link: "/editing-apps",
  },
  {
    title: "1-Click Color Science",
    desc: "Studio-grade Adobe Lightroom Mobile (.DNG) and Desktop (.XMP) presets that preserve natural skin tones while introducing luxury editorial mood in 1 tap.",
    icon: Sliders,
    tag: "1-Click DNG",
    link: "/photo-presets",
  },
  {
    title: "Full-Stack Agency Engineering",
    desc: "Custom Next.js web applications, cross-platform mobile apps, and cinematic video editing retainers delivered with transparent tier rates.",
    icon: Code2,
    tag: "Done-For-You",
    link: "/services",
  },
];

const operatingPrinciples = [
  {
    title: "Craftsmanship Over Shortcuts",
    desc: "We refuse generic AI vibe-code fluff. Every sound effect is uncompressed, every website is engineered on Next.js for sub-second speeds, and every preset is color-calibrated on professional monitors.",
    icon: ShieldCheck,
  },
  {
    title: "Zero-Friction Instant Access",
    desc: "No subscription traps, no 10-step redirect chains, and no broken third-party links. Assets are hosted on high-speed cloud drives with instant lifetime access upon purchase.",
    icon: Zap,
  },
  {
    title: "Direct Founder Accountability",
    desc: "You never talk to outsourced bot mazes. Whether ordering an asset pack or commissioning a custom web platform, you have direct WhatsApp access to BADARSH studio founders.",
    icon: Target,
  },
];

export default function AboutPage() {
  // Inquiry Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "Custom Website Development",
    budget: "₹9,000 – ₹11,000",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg("Please fill in your name, email, and project message.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to send message. Please reach out via WhatsApp.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred. Please connect directly via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Hero Eyebrow & Headline */}
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card/80 px-4 py-1.5 text-xs font-semibold text-muted shadow-xs backdrop-blur-md"
        >
          <span className="flex h-2 w-2 rounded-full bg-accent" />
          <span className="font-semibold text-foreground">BADARSH Studio Profile</span>
          <span className="text-muted/50">&bull;</span>
          <span>Craftsmanship &amp; Engineering</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 apple-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.06]"
        >
          Built On One Principle: <br className="hidden sm:inline" />
          <span className="text-accent">Craftsmanship</span> Over Shortcuts.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 apple-subhead text-lg sm:text-xl leading-relaxed text-muted max-w-2xl mx-auto font-normal"
        >
          We are a creator tools powerhouse and full-stack digital production agency. From uncompressed SFX vaults and verified mobile creator apps to bespoke Next.js web applications, BADARSH bridges the gap between raw ambition and world-class digital execution.
        </motion.p>
      </div>

      {/* Hero Manifesto Stage */}
      <div className="mt-14 overflow-hidden rounded-3xl border border-card-border bg-card p-8 md:p-14 shadow-sm relative">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-3xl">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            The BADARSH Manifesto
          </span>
          <h2 className="mt-4 apple-title text-2xl sm:text-4xl font-bold text-foreground leading-tight">
            "Your product might be brilliant. But if your visual presentation looks like generic AI vibe-code, customers will scroll right past you."
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
            <p>
              In today's hyper-competitive digital attention economy, credibility is decided in under two seconds. A blurry video reel, a generic canned template, or a sluggish website immediately destroys client trust.
            </p>
            <p>
              Traditional advertising agencies charge lakhs and take months to deliver generic PowerPoint decks. Meanwhile, cheap freelance gig platforms leave creators stranded with broken download links, watermarked templates, and zero support.
            </p>
            <p>
              <strong className="text-foreground font-semibold">BADARSH was founded to eliminate this broken cycle.</strong> We build production-ready digital assets, verified software tools, and high-conversion client systems designed to command authority and turn viewers into loyal buyers.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Dock */}
      <div className="mt-14 grid grid-cols-2 gap-4 rounded-2xl border border-card-border bg-card/60 p-6 backdrop-blur-xl shadow-xs sm:grid-cols-4 sm:p-8">
        {STATS.map((stat) => (
          <AnimatedCounter
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
          />
        ))}
      </div>

      {/* The 4 Core Ecosystem Pillars */}
      <div className="mt-24">
        <div className="text-center mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            Core Infrastructure
          </span>
          <h2 className="mt-2 apple-title text-3xl sm:text-4xl font-bold text-foreground">
            The 4 Pillars of BADARSH
          </h2>
          <p className="mt-3 text-sm text-muted max-w-xl mx-auto">
            Everything in our catalog and studio serves a dedicated purpose in the modern creator and business lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {ecosystemPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.title}
                href={pillar.link}
                className="group relative flex flex-col justify-between rounded-2xl border border-card-border bg-card p-8 shadow-xs transition-all duration-300 hover:border-foreground/20 hover:shadow-xl hover:shadow-black/5 active:scale-[0.985]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary border border-card-border text-foreground transition-transform duration-300 group-hover:scale-105 group-hover:text-accent">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold text-accent">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="mt-6 font-heading text-xl font-bold text-foreground transition-colors group-hover:text-accent">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted font-normal">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-card-border/60 pt-4 text-xs font-semibold text-foreground group-hover:text-accent transition-colors">
                  <span>Explore Collection</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Operating Principles */}
      <div className="mt-24">
        <div className="text-center mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            Quality Standard
          </span>
          <h2 className="mt-2 apple-title text-3xl sm:text-4xl font-bold text-foreground">
            How We Build &amp; Support
          </h2>
          <p className="mt-3 text-sm text-muted max-w-xl mx-auto">
            Our unbending commitment to detail, security, and founder-level support.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {operatingPrinciples.map((op) => {
            const Icon = op.icon;
            return (
              <div
                key={op.title}
                className="flex flex-col rounded-2xl border border-card-border bg-card p-8 shadow-xs"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary border border-card-border text-accent">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-6 font-heading text-lg font-bold text-foreground">
                  {op.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted">
                  {op.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* DIRECT STUDIO INQUIRIES & CONTACT SUITE (Integrated official contact desk) */}
      <div id="contact" className="mt-28 scroll-mt-20">
        <div className="overflow-hidden rounded-3xl border border-card-border bg-card shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Direct Official Channels */}
            <div className="bg-secondary/40 p-8 md:p-12 lg:col-span-5 border-b lg:border-b-0 lg:border-r border-card-border">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                Direct Communication Desk
              </span>
              <h2 className="mt-3 apple-title text-2xl sm:text-3xl font-bold text-foreground">
                Start A Conversation With Our Founders
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted">
                Have a question about an editing bundle, need a custom website quote (₹3k–₹15k), or want to discuss enterprise video editing? Connect directly with us.
              </p>

              {/* Direct Info List */}
              <div className="mt-8 space-y-5">
                <a
                  href={getWhatsAppUrl(
                    "Hi BADARSH! I'm reviewing your studio profile and want to discuss a project.",
                    "Studio Direct Inquiry"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 rounded-xl border border-card-border bg-card p-4 transition-all hover:border-emerald-500/40 hover:shadow-md group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      WhatsApp Priority Desk
                    </span>
                    <p className="font-heading text-sm font-bold text-foreground group-hover:text-accent transition-colors">
                      {WHATSAPP_DISPLAY}
                    </p>
                    <span className="text-[11px] text-muted">Instant response &bull; Direct founder chat</span>
                  </div>
                </a>

                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="flex items-start gap-3.5 rounded-xl border border-card-border bg-card p-4 transition-all hover:border-accent/40 hover:shadow-md group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                      Official Support Email
                    </span>
                    <p className="font-heading text-sm font-bold text-foreground group-hover:text-accent transition-colors">
                      {SUPPORT_EMAIL}
                    </p>
                    <span className="text-[11px] text-muted">Inquiries &bull; Licensing &bull; Invoices</span>
                  </div>
                </a>

                <div className="flex items-start gap-3.5 rounded-xl border border-card-border bg-card p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                      Studio Headquarters
                    </span>
                    <p className="font-heading text-sm font-bold text-foreground">
                      {BUSINESS_LOCATION}
                    </p>
                    <span className="text-[11px] text-muted">Operating Mon – Sat &bull; 9 AM – 8 PM IST</span>
                  </div>
                </div>
              </div>

              {/* Response Time Guarantee */}
              <div className="mt-8 flex items-center gap-2 rounded-xl bg-card border border-card-border px-4 py-3 text-xs text-muted">
                <Clock className="h-4 w-4 text-accent shrink-0" />
                <span>Average response time: <strong>Under 2 hours</strong> on WhatsApp.</span>
              </div>
            </div>

            {/* Right Column: Executive Inquiry Dispatch Form */}
            <div className="p-8 md:p-12 lg:col-span-7 bg-card">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                Project Inquiry
              </span>
              <h3 className="mt-2 font-heading text-xl sm:text-2xl font-bold text-foreground">
                Send Us Your Requirements
              </h3>
              <p className="mt-1 text-xs text-muted">
                Your message is sent directly to the founder's CRM. We review every brief personally.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                    <Check className="h-7 w-7" />
                  </div>
                  <h4 className="mt-4 font-heading text-xl font-bold text-foreground">
                    Message Received Successfully
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-muted max-w-md mx-auto">
                    Thank you! Our studio founder has received your inquiry and will respond within 2 hours.
                  </p>
                  <div className="mt-6">
                    <a
                      href={getWhatsAppUrl(
                        `Hi BADARSH! I just submitted an inquiry on your website for ${formData.interest}. Following up here!`,
                        "Followup on Submitted Inquiry"
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Speed Up via WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {errorMsg && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full rounded-xl border border-card-border bg-secondary/50 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rahul@example.com"
                        className="w-full rounded-xl border border-card-border bg-secondary/50 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-card-border bg-secondary/50 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        Service or Asset Interest
                      </label>
                      <select
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        className="w-full rounded-xl border border-card-border bg-secondary/50 px-3.5 py-2.5 text-xs text-foreground focus:border-accent focus:outline-none"
                      >
                        <option value="Website Development (₹3k–₹15k)">Website Development (₹3,000 – ₹15,000)</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="Video Editing Retainer">Video Editing Retainer</option>
                        <option value="Photo Retouching & Presets">Photo Retouching &amp; Presets</option>
                        <option value="Brand Identity & Logo Design">Brand Identity &amp; Logo Design</option>
                        <option value="Video SFX & Motion Overlays">Video SFX &amp; Motion Overlays</option>
                        <option value="Other Custom Inquiry">Other Custom Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Estimated Project Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full rounded-xl border border-card-border bg-secondary/50 px-3.5 py-2.5 text-xs text-foreground focus:border-accent focus:outline-none"
                    >
                      <option value="Under ₹3,000">Under ₹3,000 (Asset / Preset)</option>
                      <option value="₹3,000 – ₹6,000">₹3,000 – ₹6,000 (Starter Landing Page)</option>
                      <option value="₹9,000 – ₹11,000">₹9,000 – ₹11,000 (Business 5–8 Pages)</option>
                      <option value="₹15,000+">₹15,000+ (Enterprise 15–20 Pages / App)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Tell Us About Your Project *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Briefly describe what you want to build, existing links, or assets needed..."
                      className="w-full rounded-xl border border-card-border bg-secondary/50 p-3.5 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-8 py-3 text-xs font-semibold text-background shadow-xs transition-opacity hover:opacity-90 active:scale-95 disabled:opacity-50"
                    >
                      {submitting ? (
                        <span>Submitting Brief...</span>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>Dispatch Executive Brief</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
