import { constructMetadata } from "@/lib/metadata";
import { SectionHeader } from "@/components/shared/section-header";
import {
  BUSINESS_LEGAL_NAME,
  BUSINESS_LOCATION,
  SUPPORT_EMAIL,
  WHATSAPP_NUMBER,
} from "@/lib/constants";
import Link from "next/link";
import { ShieldCheck, Scale, Ban, CheckCircle2, UserCheck, AlertCircle } from "lucide-react";

export const metadata = constructMetadata({
  title: "Terms of Service",
  description:
    "Review the terms and conditions governing the purchase of digital products, commercial licensing, and engagement of creative services from BADARSH.",
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      <SectionHeader
        badge="Legal Terms"
        title="Terms of Service &amp; Commercial Agreement"
        subtitle="Please review these terms carefully before purchasing digital templates or engaging our creative agency services."
      />

      <div className="mt-12 rounded-3xl border border-card-border bg-card p-8 md:p-12 shadow-sm space-y-10 text-sm leading-relaxed text-foreground/90">
        {/* Section 1 */}
        <div>
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-accent/10 p-2 text-accent">
              <Scale className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              1. Agreement to Terms &amp; Entity Identity
            </h2>
          </div>
          <p className="mt-3 text-muted">
            These Terms of Service constitute a legally binding agreement between you (whether personally or on behalf of an entity) and{" "}
            <strong>{BUSINESS_LEGAL_NAME}</strong> ("BADARSH", "we", "us", "our"), governing your access to and use of badarsh.com, 
            our digital templates, e-books, planners, software licenses, and bespoke agency services.
          </p>
          <p className="mt-2 text-muted">
            By purchasing any product, creating an account, or interacting with our services, you confirm that you have read, understood, 
            and agree to be bound by these Terms, along with our{" "}
            <Link href="/privacy-policy" className="text-accent underline hover:text-accent-hover">
              Privacy Policy
            </Link>
            ,{" "}
            <Link href="/refund-policy" className="text-accent underline hover:text-accent-hover">
              Refund &amp; Delivery Policy
            </Link>
            , and{" "}
            <Link href="/cookie-policy" className="text-accent underline hover:text-accent-hover">
              Cookie Policy
            </Link>
            .
          </p>
        </div>

        {/* Section 2: Age Consent (DPDP Act Sec 9) */}
        <div className="border-t border-card-border/60 pt-8">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
              <UserCheck className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              2. Age Eligibility &amp; Protection of Children&apos;s Data
            </h2>
          </div>
          <p className="mt-3 text-muted">
            In compliance with <strong>Section 9 of India&apos;s Digital Personal Data Protection (DPDP) Act, 2023</strong>:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-xs text-muted">
            <li>
              You must be at least <strong>18 years of age</strong> (the age of majority under Indian law) to create an account, purchase digital assets, or enter into commercial transactions on BADARSH.
            </li>
            <li>
              If you are under 18 years old, you may only use this website under the direct supervision of a parent or legal guardian who agrees to be bound by these Terms.
            </li>
            <li>
              BADARSH does not knowingly collect, profile, target, or process personal data of children. If we discover that personal data of a minor was collected without verifiable parental consent, we will purge the record immediately under our statutory erasure protocols.
            </li>
          </ul>
        </div>

        {/* Section 3: Digital Licensing */}
        <div className="border-t border-card-border/60 pt-8">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              3. Digital Products &amp; Commercial Licensing Rights
            </h2>
          </div>
          <p className="mt-3 text-muted">
            All digital products (including design templates, planners, e-books, sound effects, Lightroom presets, and video assets) are granted under a non-exclusive, worldwide Commercial License:
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="h-4 w-4" /> What You ARE Permitted to Do
              </span>
              <ul className="text-xs text-muted space-y-1 list-disc pl-4">
                <li>Use templates to create unlimited marketing and social media graphics for your own brand or client projects.</li>
                <li>Monetize finished end products (e.g. exported PNGs, edited MP4 videos, printed banners).</li>
                <li>Customize colors, typography, logos, layouts, and copy freely.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-2">
              <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 text-xs">
                <Ban className="h-4 w-4" /> Strictly Prohibited Actions
              </span>
              <ul className="text-xs text-muted space-y-1 list-disc pl-4">
                <li>Reselling, sublicensing, or redistributing the raw editable template project links or source files.</li>
                <li>Sharing download links, ZIP archives, or license keys publicly or on file-sharing hubs.</li>
                <li>Claiming original authorship of raw template kits or software source code.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4: Transparent Pricing & No Hidden Fees */}
        <div className="border-t border-card-border/60 pt-8">
          <h2 className="font-heading text-xl font-bold text-foreground mb-3">
            4. 100% Transparent Pricing &amp; Zero Hidden Fees
          </h2>
          <p className="text-muted">
            We adhere to strict anti-deceptive pricing principles:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-xs text-muted">
            <li>
              <strong>All-Inclusive Listed Prices</strong>: The price you see displayed on product pages is the final price. We charge <strong>₹0 surprise platform fees</strong>, ₹0 handling charges, and ₹0 forced recurring continuity fees.
            </li>
            <li>
              <strong>One-Time Purchases</strong>: Digital product purchases are one-time payments that grant lifetime access and unlimited updates. We do not automatically enroll customers in recurring subscriptions without explicit, separate consent.
            </li>
            <li>
              <strong>Tax Compliance</strong>: Invoices comply with Indian Central Goods and Services Tax (CGST/SGST/IGST Act, 2017) regulations.
            </li>
          </ul>
        </div>

        {/* Section 5: Font & Image Intellectual Property */}
        <div className="border-t border-card-border/60 pt-8">
          <h2 className="font-heading text-xl font-bold text-foreground mb-3">
            5. Intellectual Property, Fonts &amp; Asset Licensing
          </h2>
          <p className="text-muted">
            BADARSH respects the intellectual property rights of creators and open-source contributors:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-xs text-muted">
            <li>
              <strong>Typography</strong>: Fonts used across our web application and design templates (including <em>Plus Jakarta Sans</em>, <em>Inter</em>, and <em>Geist</em>) are licensed under the SIL Open Font License (OFL) or Apache 2.0 open-source standards.
            </li>
            <li>
              <strong>Stock Imagery &amp; Media</strong>: Curated showcase photography is sourced under valid commercial licenses (including the Unsplash Commercial License) and original studio production footage.
            </li>
            <li>
              <strong>Original Designs</strong>: All template frameworks, layout architectures, software presets, and digital planners are original intellectual creations owned by {BUSINESS_LEGAL_NAME}.
            </li>
          </ul>
        </div>

        {/* Section 6: No Dark Patterns & Fair Consumer Practices */}
        <div className="border-t border-card-border/60 pt-8">
          <h2 className="font-heading text-xl font-bold text-foreground mb-3">
            6. Ethical Consumer Guarantee &amp; No Dark Patterns
          </h2>
          <p className="text-muted">
            BADARSH is engineered in compliance with consumer protection guidelines against misleading advertisements and dark patterns (issued by the Central Consumer Protection Authority - CCPA, India):
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-xs text-muted">
            <li>No false countdown urgency timers or fabricated stock scarcity warnings.</li>
            <li>No disguised advertisements or pre-ticked optional consent checkmarks.</li>
            <li>No fabricated user reviews or non-existent celebrity endorsements.</li>
            <li>Clear, 1-click account deletion and email unsubscribes.</li>
          </ul>
        </div>

        {/* Section 7: Limitation of Liability */}
        <div className="border-t border-card-border/60 pt-8">
          <h2 className="font-heading text-xl font-bold text-foreground mb-3">
            7. Limitation of Liability &amp; Governing Law
          </h2>
          <p className="text-muted text-xs">
            To the maximum extent permitted by applicable law, {BUSINESS_LEGAL_NAME} shall not be liable for indirect, incidental, or consequential damages resulting from the use or inability to use our digital assets. 
            These terms are governed by the laws of the Republic of India. Any legal dispute shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.
          </p>
        </div>

        {/* Section 8: Inquiries & Entity Details */}
        <div className="border-t border-card-border/60 pt-8">
          <h2 className="font-heading text-xl font-bold text-foreground mb-3">
            8. Legal Notices &amp; Grievance Redressal
          </h2>
          <div className="rounded-2xl border border-card-border bg-secondary/20 p-5 text-xs space-y-1.5 text-muted">
            <p><strong>Legal Entity:</strong> {BUSINESS_LEGAL_NAME}</p>
            <p><strong>Registered Address:</strong> {BUSINESS_LOCATION}</p>
            <p><strong>Official Support Desk:</strong> <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent hover:underline">{SUPPORT_EMAIL}</a></p>
            <p><strong>Founder Direct WhatsApp:</strong> +{WHATSAPP_NUMBER}</p>
            <p><strong>Grievance Officer:</strong> Data Protection &amp; Compliance Desk (<a href="mailto:grievance@badarsh.com" className="text-accent hover:underline">grievance@badarsh.com</a>)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
