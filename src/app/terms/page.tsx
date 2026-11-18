import { constructMetadata } from "@/lib/metadata";
import { SectionHeader } from "@/components/shared/section-header";
import {
  BUSINESS_LEGAL_NAME,
  BUSINESS_LOCATION,
  SUPPORT_EMAIL,
  WHATSAPP_DISPLAY,
} from "@/lib/constants";

export const metadata = constructMetadata({
  title: "Terms of Service",
  description:
    "Review the terms and conditions governing the purchase of digital products and engagement of creative services from BADARSH.",
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      <SectionHeader
        badge="Legal Terms"
        title="Terms of Service"
        subtitle="Please review these terms carefully before purchasing digital templates or engaging our creative services."
      />

      <div className="mt-12 rounded-3xl border border-card-border bg-card p-8 md:p-12 shadow-sm space-y-8 text-sm leading-relaxed text-muted">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            1. Agreement to Terms
          </h2>
          <p className="mt-3">
            By accessing badarsh.com, purchasing digital templates, or hiring creative services from{" "}
            <strong>{BUSINESS_LEGAL_NAME}</strong> ("BADARSH", "we", "us"), you agree to be bound by these 
            Terms of Service and all incorporated policies (including our Commercial License, Privacy Policy, 
            and Refund Policy).
          </p>
        </div>

        <div className="border-t border-card-border/60 pt-6">
          <h2 className="font-heading text-xl font-bold text-foreground">
            2. Digital Template Purchases &amp; Licenses
          </h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-xs">
            <li>Upon successful checkout, you are granted a non-exclusive, non-transferable Commercial License subject to the terms set forth in our License Agreement.</li>
            <li>Templates are provided via direct Canva template links and downloadable digital files. You are responsible for maintaining a Canva account (Free or Pro) to access and edit the designs.</li>
            <li>Reselling, sublicensing, or redistributing the raw editable template links is strictly prohibited and constitutes copyright infringement.</li>
          </ul>
        </div>

        <div className="border-t border-card-border/60 pt-6">
          <h2 className="font-heading text-xl font-bold text-foreground">
            3. Creative Services &amp; Retainers
          </h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-xs">
            <li>For bespoke services (such as Video Editing, Next.js Website Building, or Social Media Management), project scope, deliverables, and timelines are agreed upon prior to project kickoff.</li>
            <li>Each service package includes 2 complimentary revision cycles. Additional revisions beyond the agreed scope are billed at our standard hourly rates.</li>
            <li>Client must provide necessary assets (logos, raw footage, brand guidelines) in a timely manner. Delays in asset submission may extend project delivery timelines.</li>
          </ul>
        </div>

        <div className="border-t border-card-border/60 pt-6">
          <h2 className="font-heading text-xl font-bold text-foreground">
            4. Pricing &amp; Payments
          </h2>
          <p className="mt-2 text-xs">
            All prices are listed in Indian Rupees (₹ INR) and US Dollars ($ USD) where selected. Prices are subject to change without prior notice, but price changes will not affect orders already completed. Payments are processed securely via third-party payment gateways.
          </p>
        </div>

        <div className="border-t border-card-border/60 pt-6">
          <h2 className="font-heading text-xl font-bold text-foreground">
            5. Limitation of Liability &amp; Governing Law
          </h2>
          <p className="mt-2 text-xs">
            In no event shall {BUSINESS_LEGAL_NAME} be liable for indirect, incidental, or consequential damages resulting from the use or inability to use our digital templates or website services. These terms shall be governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.
          </p>
        </div>

        <div className="border-t border-card-border/60 pt-6">
          <h2 className="font-heading text-xl font-bold text-foreground">
            6. Inquiries &amp; Legal Notices
          </h2>
          <div className="mt-3 rounded-2xl border border-card-border bg-secondary/20 p-4 text-xs space-y-1">
            <p><strong>Entity:</strong> {BUSINESS_LEGAL_NAME}</p>
            <p><strong>Address:</strong> {BUSINESS_LOCATION}</p>
            <p><strong>Email:</strong> {SUPPORT_EMAIL}</p>
            <p><strong>WhatsApp:</strong> {WHATSAPP_DISPLAY}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
