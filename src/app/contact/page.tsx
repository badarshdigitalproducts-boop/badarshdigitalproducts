"use client";

import { useState } from "react";
import {
  Mail,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { siteConfig, WHATSAPP_NUMBER } from "@/lib/constants";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("templates");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, interest, message }),
      });
    } catch {
      // fallback
    }

    setLoading(false);
    setSubmitted(true);
  };

  const directWhatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi BADARSH! My name is ${name || "a business founder"}. I'm interested in ${interest}. ${message ? `Message: ${message}` : ""}`
  )}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      <SectionHeader
        badge="Get In Touch"
        title="Let's Build Something Great Together"
        subtitle="Have questions about our Canva templates, custom video editing retainers, or website projects? Send us a message or chat directly on WhatsApp."
      />

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left col: Contact info */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-card-border bg-card p-8 shadow-sm space-y-8">
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground">
                Direct Channels
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Our founders and senior creatives respond promptly within 2-4 hours during business days.
              </p>
            </div>

            <div className="space-y-6">
              {/* WhatsApp direct */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "Hi BADARSH! I'd like to get in touch regarding your products and services."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 transition hover:border-emerald-500/40 hover:bg-emerald-500/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-foreground group-hover:text-emerald-600 transition">
                    WhatsApp Priority Support
                  </h4>
                  <p className="text-xs text-muted">Instant chat &bull; Mon - Sat, 9 AM - 8 PM IST</p>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${siteConfig.links.email}`}
                className="group flex items-center gap-4 rounded-2xl border border-card-border bg-card/60 p-4 transition hover:border-accent hover:bg-accent/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white shadow-sm">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-foreground group-hover:text-accent transition">
                    Email Inquiries
                  </h4>
                  <p className="text-xs text-muted">{siteConfig.links.email}</p>
                </div>
              </a>

              {/* Hours */}
              <div className="flex items-center gap-4 rounded-2xl border border-card-border bg-card/60 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/20 text-muted">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-foreground">
                    Operating Hours
                  </h4>
                  <p className="text-xs text-muted">
                    Monday - Saturday: 9:00 AM – 8:00 PM IST
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-card-border/60 pt-6">
              <span className="text-xs font-semibold text-muted">Location</span>
              <p className="mt-1 font-heading text-sm font-bold text-foreground">
                Bengaluru &bull; Mumbai &bull; Serving Nationwide Across India
              </p>
            </div>
          </div>
        </div>

        {/* Right col: Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-card-border bg-card p-8 md:p-12 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="mt-4 font-heading text-2xl font-bold text-foreground">
                  Message Sent Successfully!
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                  Thank you, {name}! We have received your inquiry. A BADARSH team member will get back to you shortly.
                </p>

                <div className="mt-8 flex justify-center">
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-heading text-xs font-bold text-white shadow-md hover:bg-emerald-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Speed up: Chat now on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    Send Us a Message
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    Fill out the form below and we'll reply with tailored recommendations.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="mt-2 w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="mt-2 w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground">
                      WhatsApp / Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="mt-2 w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground">
                      I am interested in *
                    </label>
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="mt-2 w-full cursor-pointer rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="Canva Templates">Canva Templates &amp; Assets</option>
                      <option value="Video Editing Service">Video Editing Service (Reels/Shorts)</option>
                      <option value="Website Building">Website Building (Next.js/Landing Page)</option>
                      <option value="Social Media Retainer">Full Social Media Management</option>
                      <option value="Custom Project">Custom Enterprise Project</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Project Details / Questions *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your brand, requirements, or what templates you're looking for..."
                    className="mt-2 w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 font-heading text-sm font-bold text-white shadow-md hover:bg-accent-hover active:scale-[0.98]"
                  >
                    <Send className="h-4 w-4" />
                    <span>{loading ? "Sending..." : "Submit Inquiry"}</span>
                  </button>

                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    <span>Or chat instantly on WhatsApp</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
