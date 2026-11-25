import { constructMetadata } from "@/lib/metadata";
import { SectionHeader } from "@/components/shared/section-header";
import {
  BUSINESS_LEGAL_NAME,
  BUSINESS_LOCATION,
  SUPPORT_EMAIL,
  WHATSAPP_DISPLAY,
} from "@/lib/constants";
import { ShieldCheck, RefreshCw, Clock, Mail, MessageCircle } from "lucide-react";

export const metadata = constructMetadata({
  title: "Refund & Delivery Policy",
  description:
    "Learn about instant digital delivery, refund eligibility, file replacement guarantees, and resolution support for digital products purchased from BADARSH.",
  canonical: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      <SectionHeader
        badge="Trust &amp; Transparency"
        title="Refund &amp; Digital Delivery Policy"
        subtitle="Clear, fair guidelines governing instant digital asset delivery, file replacements, and creative service agreements."
      />

      <div className="mt-12 rounded-3xl border border-card-border bg-card p-8 md:p-12 shadow-sm space-y-10 text-sm leading-relaxed text-foreground/90">
        {/* Intro */}
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            1. Nature of Our Digital Products
          </h2>
          <p className="mt-3 text-muted">
            All templates, design systems, digital planners, and marketing e-books offered by{" "}
            <strong>{BUSINESS_LEGAL_NAME}</strong> ("BADARSH") are non-tangible, digital goods. 
            Upon successful payment, access is granted immediately via an on-screen confirmation link 
            and an automated fulfillment email containing your direct template project URLs or downloadable PDF/ZIP assets.
          </p>
        </div>

        {/* Delivery Mechanism */}
        <div className="border-t border-card-border/60 pt-8">
          <h2 className="font-heading text-xl font-bold text-foreground">
            2. Instant Digital Delivery Guarantee
          </h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-card-border bg-secondary/30 p-4">
              <span className="font-bold text-foreground block">Zero Wait Time</span>
              <p className="text-xs text-muted mt-1">
                Your direct digital template links and download attachments appear on screen immediately upon transaction success.
              </p>
            </div>
            <div className="rounded-2xl border border-card-border bg-secondary/30 p-4">
              <span className="font-bold text-foreground block">Email Backup</span>
              <p className="text-xs text-muted mt-1">
                A permanent backup copy is automatically sent to the email provided at checkout for lifetime access.
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted">
            If you do not see the confirmation email within 5 minutes, please check your spam/promotions folder 
            or reach out to our support team at <strong>{SUPPORT_EMAIL}</strong> for immediate re-dispatch.
          </p>
        </div>

        {/* Refund Policy */}
        <div className="border-t border-card-border/60 pt-8">
          <h2 className="font-heading text-xl font-bold text-foreground">
            3. Refund Eligibility &amp; Replacement Guarantee
          </h2>
          <p className="mt-3 text-muted">
            Because digital files are irrevocable and cannot be returned once access has been delivered, 
            <strong> sales are generally final</strong>. However, we stand behind the quality of our design craft 100%:
          </p>
          <ul className="mt-4 space-y-3 pl-2">
            <li className="flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-1" />
              <span>
                <strong>Defective / Corrupted Links:</strong> If a template file or download link is broken, missing assets, or inaccessible, 
                and our support team is unable to provide a functional replacement within 24 hours, 
                you are entitled to a <strong>100% full refund</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-1" />
              <span>
                <strong>Accidental Duplicate Purchases:</strong> If you accidentally purchase the exact same template pack twice, 
                notify us within 48 hours and we will issue an immediate refund for the duplicate transaction.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-1" />
              <span>
                <strong>Zero Subscription Compatibility Guarantee:</strong> All BADARSH templates are built to work with standard, free tools. 
                If you encounter any template element that asks for third-party paid subscriptions to export, notify us and we will replace it immediately.
              </span>
            </li>
          </ul>
        </div>

        {/* Creative Services Cancellation */}
        <div className="border-t border-card-border/60 pt-8">
          <h2 className="font-heading text-xl font-bold text-foreground">
            4. Creative Services (Video Editing &amp; Website Building)
          </h2>
          <p className="mt-3 text-muted">
            For custom service retainers and website builds:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-muted text-xs">
            <li>
              <strong>Before Production Starts:</strong> If you cancel a service project before our creatives begin active scriptwriting, asset creation, or code development, a full refund less payment gateway processing charges (typically 2-3%) will be issued.
            </li>
            <li>
              <strong>During Active Production:</strong> Once production has commenced, refunds are calculated on a pro-rata basis based on deliverables completed to date.
            </li>
            <li>
              <strong>Revisions:</strong> Every creative package includes 2 complimentary revision rounds to ensure your vision is realized.
            </li>
          </ul>
        </div>

        {/* Dispute Resolution Desk */}
        <div className="border-t border-card-border/60 pt-8">
          <h2 className="font-heading text-xl font-bold text-foreground">
            5. Dispute Resolution &amp; Grievance Contact
          </h2>
          <p className="mt-3 text-muted">
            In compliance with the Consumer Protection (E-Commerce) Rules, 2020, we prioritize speedy resolution of all customer concerns:
          </p>
          <div className="mt-4 rounded-2xl border border-card-border bg-secondary/20 p-5 text-xs text-muted space-y-1.5">
            <p><strong>Entity Name:</strong> {BUSINESS_LEGAL_NAME}</p>
            <p><strong>Location:</strong> {BUSINESS_LOCATION}</p>
            <p><strong>Official Email:</strong> {SUPPORT_EMAIL}</p>
            <p><strong>Response SLA:</strong> Acknowledgment within 24 hours, resolution within 48 business hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
