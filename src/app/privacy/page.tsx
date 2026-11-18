import { constructMetadata } from "@/lib/metadata";
import { SectionHeader } from "@/components/shared/section-header";
import {
  BUSINESS_LEGAL_NAME,
  BUSINESS_LOCATION,
  SUPPORT_EMAIL,
  WHATSAPP_DISPLAY,
} from "@/lib/constants";

export const metadata = constructMetadata({
  title: "Privacy Policy",
  description:
    "Review BADARSH's commitment to data privacy, customer consent, and compliance with the Digital Personal Data Protection Act, 2023.",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      <SectionHeader
        badge="Data Protection"
        title="Privacy Policy"
        subtitle="How we collect, protect, and respect your personal information in compliance with Indian data protection laws."
      />

      <div className="mt-12 rounded-3xl border border-card-border bg-card p-8 md:p-12 shadow-sm space-y-8 text-sm leading-relaxed text-muted">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            1. Overview &amp; Data Fiduciary
          </h2>
          <p className="mt-3">
            <strong>{BUSINESS_LEGAL_NAME}</strong> ("BADARSH", "we", "us", or "our"), headquartered in {BUSINESS_LOCATION}, operates 
            as the Data Fiduciary under the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and the 
            Information Technology Act, 2000. We value your trust and are committed to safeguarding your personal information.
          </p>
        </div>

        <div className="border-t border-card-border/60 pt-6">
          <h2 className="font-heading text-xl font-bold text-foreground">
            2. Information We Collect
          </h2>
          <p className="mt-2 text-xs">
            We only collect personal information that you voluntarily provide to us:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-xs">
            <li>
              <strong>Order &amp; Fulfillment Information:</strong> Name, email address, and transaction details required to deliver your Canva template links and generate digital invoices.
            </li>
            <li>
              <strong>Agency Inquiry Details:</strong> Name, business email, WhatsApp number, project budget, and requirements submitted through our contact and service request forms.
            </li>
            <li>
              <strong>Newsletter Subscription:</strong> Email address provided for receiving weekly free Canva drops and marketing tactics.
            </li>
          </ul>
          <p className="mt-3 text-xs">
            <strong>Payment Data:</strong> We do not store credit card numbers, CVVs, or UPI PINs on our servers. All transactions are securely processed by RBI-licensed payment aggregators (e.g., Razorpay, Stripe, UPI).
          </p>
        </div>

        <div className="border-t border-card-border/60 pt-6">
          <h2 className="font-heading text-xl font-bold text-foreground">
            3. How We Use Your Data
          </h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-xs">
            <li>To dispatch direct Canva access links and product download files.</li>
            <li>To respond to service inquiries and provide customer support via WhatsApp or email.</li>
            <li>To send opt-in newsletters (you may unsubscribe at any time with a single click).</li>
            <li>To maintain system security, detect fraud, and comply with statutory legal requirements.</li>
          </ul>
          <p className="mt-3 text-xs font-semibold text-foreground">
            We will never sell, rent, or trade your personal information to third-party data brokers or advertisers.
          </p>
        </div>

        <div className="border-t border-card-border/60 pt-6">
          <h2 className="font-heading text-xl font-bold text-foreground">
            4. Your Rights Under the DPDP Act 2023
          </h2>
          <p className="mt-2 text-xs">
            As a Data Principal, you have statutory rights:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-xs">
            <li><strong>Right to Access:</strong> You may request a summary of the personal data we hold about you.</li>
            <li><strong>Right to Correction &amp; Erasure:</strong> You can request us to update or completely erase your personal data from our systems.</li>
            <li><strong>Right to Withdraw Consent:</strong> You can opt out of promotional emails anytime using the "Unsubscribe" link or emailing us directly.</li>
            <li><strong>Right to Grievance Redressal:</strong> You can contact our Grievance Officer regarding any data concerns.</li>
          </ul>
        </div>

        <div className="border-t border-card-border/60 pt-6">
          <h2 className="font-heading text-xl font-bold text-foreground">
            5. Cookies &amp; Tracking
          </h2>
          <p className="mt-2 text-xs">
            We use strictly necessary functional cookies (such as remembering your currency selection between INR and USD, and securing admin authentication). We do not deploy invasive third-party cross-site trackers.
          </p>
        </div>

        <div className="border-t border-card-border/60 pt-6">
          <h2 className="font-heading text-xl font-bold text-foreground">
            6. Grievance Officer Contact
          </h2>
          <div className="mt-3 rounded-2xl border border-card-border bg-secondary/20 p-4 text-xs space-y-1">
            <p><strong>Nodal Grievance Officer:</strong> {BUSINESS_LEGAL_NAME}</p>
            <p><strong>Address:</strong> {BUSINESS_LOCATION}</p>
            <p><strong>Email:</strong> {SUPPORT_EMAIL}</p>
            <p><strong>WhatsApp Support:</strong> {WHATSAPP_DISPLAY}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
