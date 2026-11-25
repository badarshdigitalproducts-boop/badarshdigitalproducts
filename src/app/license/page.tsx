import { constructMetadata } from "@/lib/metadata";
import { SectionHeader } from "@/components/shared/section-header";
import { Check, X } from "lucide-react";
import { SUPPORT_EMAIL } from "@/lib/constants";

export const metadata = constructMetadata({
  title: "Commercial License Agreement",
  description:
    "Review BADARSH Standard Commercial License terms covering client project rights, commercial campaign usage, and template redistribution limits.",
  canonical: "/license",
});

export default function LicensePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      <SectionHeader
        badge="Licensing Terms"
        title="Commercial License Agreement"
        subtitle="Every BADARSH digital template includes our Standard Commercial License. Here is exactly what you can and cannot do."
      />

      <div className="mt-12 space-y-10">
        {/* Quick Comparison Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Permitted Uses */}
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 md:p-8">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Check className="h-5 w-5" />
              <h3 className="font-heading text-lg font-bold">What You CAN Do</h3>
            </div>
            <ul className="mt-6 space-y-3.5 text-xs leading-relaxed text-foreground/90">
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Client Work:</strong> Customize templates and deliver finished designs (PNG, JPG, PDF, MP4) to your paying clients.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Personal &amp; Commercial Social Media:</strong> Publish unlimited posts, stories, reels, and carousels on your business accounts.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Paid Advertising:</strong> Use the layouts for Meta ads, Google Display ads, and sponsored partner campaigns.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Physical Collateral:</strong> Print business cards, stationery, menus, and flyers for your local establishment.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Unlimited Views &amp; Impressions:</strong> No audience caps or additional royalty fees required.
                </span>
              </li>
            </ul>
          </div>

          {/* Prohibited Uses */}
          <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-6 md:p-8">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <X className="h-5 w-5" />
              <h3 className="font-heading text-lg font-bold">What You CANNOT Do</h3>
            </div>
            <ul className="mt-6 space-y-3.5 text-xs leading-relaxed text-foreground/90">
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  <strong>No Reselling:</strong> You cannot resell, redistribute, sub-license, or share the raw editable project files or master links.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  <strong>No Template Repackaging:</strong> You cannot make minor changes and sell the designs as your own digital templates on Etsy, Gumroad, or your website.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  <strong>No Free Distribution:</strong> You cannot upload the editable files to public Google Drive folders, Telegram groups, or torrent sites.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  <strong>No Trademarking Layouts:</strong> You cannot trademark or register copyright over the underlying template grid systems.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed Agreement */}
        <div className="rounded-3xl border border-card-border bg-card p-8 md:p-12 shadow-sm space-y-8 text-sm leading-relaxed text-muted">
          <div>
            <h3 className="font-heading text-xl font-bold text-foreground">
              Zero Subscription Lock-in &amp; Proprietary In-House Designs
            </h3>
            <p className="mt-2 text-xs leading-relaxed">
              All BADARSH templates are handcrafted in-house using open-standard typography, accessible vector elements, and universal web layouts. You will never encounter hidden paywalls or unexpected export fees. You have full creative freedom to edit, export, and publish without paid software subscriptions.
            </p>
          </div>

          <div className="border-t border-card-border/60 pt-6">
            <h3 className="font-heading text-xl font-bold text-foreground">
              Frequently Asked Licensing Questions
            </h3>
            <div className="mt-4 space-y-4 text-xs">
              <div>
                <strong className="text-foreground block">
                  Q: I am a freelance social media manager. Can I use these templates for multiple paying clients?
                </strong>
                <p className="mt-1 text-muted">
                  Yes! You can use one purchase to design and export finished graphics for multiple clients. 
                  However, you must deliver the finished exports (PNG/JPG/PDF/MP4). If your client wants the master 
                  editable template file for themselves, they should purchase their own license.
                </p>
              </div>

              <div>
                <strong className="text-foreground block">
                  Q: Can I use the Pitch Deck template for an investor round?
                </strong>
                <p className="mt-1 text-muted">
                  Yes, absolutely. You can present, pitch, share PDFs with venture funds, and use the slides 
                  in any fundraising or sales capacity with zero restrictions.
                </p>
              </div>

              <div>
                <strong className="text-foreground block">
                  Q: Do I need to credit BADARSH when publishing designs?
                </strong>
                <p className="mt-1 text-muted">
                  No attribution is required. You can publish freely under your own business identity.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-card-border/60 pt-6 text-xs">
            <p>
              Have specific enterprise or agency licensing questions? Contact our team directly at{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent underline font-semibold">
                {SUPPORT_EMAIL}
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
