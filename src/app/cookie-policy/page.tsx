import { constructMetadata } from "@/lib/metadata";
import { SectionHeader } from "@/components/shared/section-header";
import {
  BUSINESS_LEGAL_NAME,
  BUSINESS_LOCATION,
  SUPPORT_EMAIL,
  WHATSAPP_NUMBER,
} from "@/lib/constants";
import Link from "next/link";
import { Cookie, ShieldCheck, CheckCircle2, Lock, Sliders, ExternalLink } from "lucide-react";

export const metadata = constructMetadata({
  title: "Cookie Policy",
  description:
    "Learn about how BADARSH uses essential, functional, and performance cookies to provide secure browsing and seamless digital product delivery.",
  canonical: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      <SectionHeader
        badge="Transparency & Privacy"
        title="Cookie & Tracking Policy"
        subtitle="Clear, honest details on how cookies are used to keep your session secure and remember your preferences."
      />

      <div className="mt-12 rounded-3xl border border-card-border bg-card p-8 md:p-12 shadow-sm space-y-10 text-sm leading-relaxed text-foreground/90">
        {/* Section 1 */}
        <div>
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-accent/10 p-2 text-accent">
              <Cookie className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              1. What Are Cookies?
            </h2>
          </div>
          <p className="mt-3 text-muted">
            Cookies are small cryptographic text files placed on your computer or mobile device when you visit a website. 
            At <strong>{BUSINESS_LEGAL_NAME}</strong> ("BADARSH", "we", "us"), we use cookies to authenticate your account sessions, 
            remember your dark/light theme choices, maintain your shopping cart, and ensure secure digital asset downloads.
          </p>
          <p className="mt-2 text-muted">
            We adhere strictly to the principle of <strong>data minimization</strong> as mandated by India&apos;s Digital Personal Data Protection (DPDP) Act, 2023. 
            We do not use invasive third-party ad-tracking cookies or sell your browsing history to third-party data brokers.
          </p>
        </div>

        {/* Section 2 */}
        <div className="border-t border-card-border/60 pt-8">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              2. Categories of Cookies We Use
            </h2>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-card-border bg-secondary/30 p-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-emerald-500" /> Strictly Necessary Cookies (Essential)
                </span>
                <span className="text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full">
                  Always Active
                </span>
              </div>
              <p className="text-xs text-muted mt-2">
                Essential for core website security, authentication, and digital downloads. Without these cookies, services like customer login, order fulfillment, and CSRF protection cannot operate.
              </p>
            </div>

            <div className="rounded-2xl border border-card-border bg-secondary/30 p-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-blue-500" /> Functional &amp; Preference Cookies
                </span>
                <span className="text-[11px] font-mono font-semibold bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full">
                  User Configurable
                </span>
              </div>
              <p className="text-xs text-muted mt-2">
                Allows the website to remember choices you make, such as your preferred currency display (₹ INR vs. $ USD) and your dark/light interface theme.
              </p>
            </div>

            <div className="rounded-2xl border border-card-border bg-secondary/30 p-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" /> Analytics &amp; Performance Telemetry
                </span>
                <span className="text-[11px] font-mono font-semibold bg-purple-500/15 text-purple-600 dark:text-purple-400 px-2.5 py-0.5 rounded-full">
                  Consent Required
                </span>
              </div>
              <p className="text-xs text-muted mt-2">
                Collects aggregated, anonymized telemetry regarding page load speeds, popular template categories, and navigation patterns to help us optimize the platform experience.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Exact Cookies Table */}
        <div className="border-t border-card-border/60 pt-8">
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">
            3. Inventory of Cookies Deployed on BADARSH
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-card-border bg-secondary/20">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-card-border bg-secondary/40 text-foreground font-semibold">
                <tr>
                  <th className="p-3.5">Cookie Identifier</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Purpose</th>
                  <th className="p-3.5">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/50 text-muted">
                <tr>
                  <td className="p-3.5 font-mono text-foreground font-medium">badarsh_creator_session</td>
                  <td className="p-3.5 text-emerald-500 font-medium">Strictly Necessary</td>
                  <td className="p-3.5">Cryptographically signed HMAC customer session token for purchases &amp; library.</td>
                  <td className="p-3.5">7 Days</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono text-foreground font-medium">badarsh_admin_session</td>
                  <td className="p-3.5 text-emerald-500 font-medium">Strictly Necessary</td>
                  <td className="p-3.5">Z+ Military perimeter encrypted founder authentication token.</td>
                  <td className="p-3.5">12 Hours</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono text-foreground font-medium">badarsh_cookie_consent</td>
                  <td className="p-3.5 text-blue-500 font-medium">Preferences</td>
                  <td className="p-3.5">Stores your cookie consent selection (accepted / rejected non-essential).</td>
                  <td className="p-3.5">1 Year</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono text-foreground font-medium">theme</td>
                  <td className="p-3.5 text-blue-500 font-medium">Preferences</td>
                  <td className="p-3.5">Remembers your dark or light visual interface choice.</td>
                  <td className="p-3.5">Persistent</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono text-foreground font-medium">badarsh_currency</td>
                  <td className="p-3.5 text-blue-500 font-medium">Preferences</td>
                  <td className="p-3.5">Remembers your INR vs. USD currency switcher setting.</td>
                  <td className="p-3.5">30 Days</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono text-foreground font-medium">_ga, _ga_*</td>
                  <td className="p-3.5 text-purple-500 font-medium">Analytics</td>
                  <td className="p-3.5">Google Analytics anonymized aggregated visitor telemetry.</td>
                  <td className="p-3.5">Up to 2 Years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Third Parties */}
        <div className="border-t border-card-border/60 pt-8">
          <h2 className="font-heading text-xl font-bold text-foreground mb-3">
            4. Third-Party Service Providers
          </h2>
          <p className="text-muted">
            We partner with trusted, industry-leading infrastructure providers who may set technical cookies to securely fulfill services:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-xs text-muted">
            <li>
              <strong>Cashfree Payments India Pvt. Ltd.</strong>: RBI-regulated payment gateway facilitating secure UPI, card, and net-banking transactions. Complies with PCI-DSS Level 1 security standards.
            </li>
            <li>
              <strong>Google Firebase &amp; Cloud Platform</strong>: Cloud database storage and infrastructure hosting.
            </li>
            <li>
              <strong>Cloudflare, Inc.</strong>: Edge reverse-proxy, DDoS mitigation, and SSL/TLS encryption.
            </li>
          </ul>
        </div>

        {/* Section 5: Managing Cookies */}
        <div className="border-t border-card-border/60 pt-8">
          <h2 className="font-heading text-xl font-bold text-foreground mb-3">
            5. How to Control or Delete Cookies
          </h2>
          <p className="text-muted">
            You can modify your cookie settings at any time using our Cookie Consent Banner or directly through your web browser settings. Most browsers allow you to block all cookies, accept only first-party cookies, or delete stored cookies.
          </p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl border border-card-border bg-secondary/30 p-3 text-center">
              <span className="font-bold text-foreground block">Google Chrome</span>
              <span className="text-[11px] text-muted">Settings &gt; Privacy &amp; Security</span>
            </div>
            <div className="rounded-xl border border-card-border bg-secondary/30 p-3 text-center">
              <span className="font-bold text-foreground block">Apple Safari</span>
              <span className="text-[11px] text-muted">Preferences &gt; Privacy</span>
            </div>
            <div className="rounded-xl border border-card-border bg-secondary/30 p-3 text-center">
              <span className="font-bold text-foreground block">Mozilla Firefox</span>
              <span className="text-[11px] text-muted">Options &gt; Privacy &amp; Security</span>
            </div>
            <div className="rounded-xl border border-card-border bg-secondary/30 p-3 text-center">
              <span className="font-bold text-foreground block">Microsoft Edge</span>
              <span className="text-[11px] text-muted">Settings &gt; Site Permissions</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">
            <em>Note: Disabling strictly necessary cookies will prevent you from logging in, checking out, or downloading licensed digital files.</em>
          </p>
        </div>

        {/* Section 6: Inquiries & DPO */}
        <div className="border-t border-card-border/60 pt-8">
          <h2 className="font-heading text-xl font-bold text-foreground mb-3">
            6. Contact Our Grievance &amp; Data Protection Officer
          </h2>
          <p className="text-muted text-xs">
            For questions regarding our use of cookies or to exercise your statutory rights under the DPDP Act, 2023:
          </p>
          <div className="mt-4 rounded-2xl border border-card-border bg-secondary/20 p-5 text-xs space-y-1.5 text-muted">
            <p><strong>Entity:</strong> {BUSINESS_LEGAL_NAME}</p>
            <p><strong>Location:</strong> {BUSINESS_LOCATION}</p>
            <p><strong>Grievance Officer:</strong> Data Protection Officer, BADARSH</p>
            <p><strong>Email:</strong> <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent hover:underline">{SUPPORT_EMAIL}</a> / <a href="mailto:dpo@badarsh.com" className="text-accent hover:underline">dpo@badarsh.com</a></p>
            <p><strong>Direct Desk WhatsApp:</strong> +{WHATSAPP_NUMBER}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
