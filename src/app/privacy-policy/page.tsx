import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  UserCheck,
  FileText,
  Mail,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Trash2,
  UserX,
  Phone,
} from "lucide-react";
import { constructMetadata } from "@/lib/metadata";
import { SectionHeader } from "@/components/shared/section-header";
import {
  BUSINESS_LEGAL_NAME,
  BUSINESS_LOCATION,
  SUPPORT_EMAIL,
  WHATSAPP_DISPLAY,
} from "@/lib/constants";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy — DPDP Act (2023) Compliance",
  description:
    "Comprehensive, transparent Privacy Policy for BADARSH under India's Digital Personal Data Protection Act, 2023. Learn about data collection, processing purposes, user rights, and grievance redressal.",
  canonical: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  const lastUpdated = "November 23, 2026";
  const grievanceOfficerName = "Grievance Redressal & Data Protection Officer";
  const grievanceEmail = "grievance@badarsh.com";
  const dpoEmail = "dpo@badarsh.com";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      {/* Header */}
      <SectionHeader
        badge="Statutory Compliance"
        title="Privacy Policy & Data Protection"
        subtitle="Transparent disclosures under India's Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000."
      />

      {/* Notice Banner */}
      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-muted">
        <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            Digital Personal Data Protection Act, 2023 (DPDP) Certified Notice
          </p>
          <p>
            This policy constitutes a statutory notice under Section 5 of the DPDP Act. We only process personal data for specific, lawful purposes with your free, specific, informed, unconditional, and unambiguous consent.
          </p>
          <p className="text-[11px] text-muted">Last Updated &amp; Effective Date: {lastUpdated}</p>
        </div>
      </div>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted">
        {/* Section 1 */}
        <section className="rounded-3xl border border-card-border bg-card p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-heading text-lg font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent">
              1
            </span>
            <h2>Data Fiduciary Identification</h2>
          </div>
          <p>
            <strong>{BUSINESS_LEGAL_NAME}</strong> (&ldquo;BADARSH&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), registered and operating from {BUSINESS_LOCATION}, is the <strong>Data Fiduciary</strong> determining the purpose and means of processing personal data collected across the BADARSH platform (<code>badarsh.com</code>).
          </p>
          <p>
            You are recognized as the <strong>Data Principal</strong> under Indian law, entitled to all fundamental statutory rights regarding your personal information.
          </p>
        </section>

        {/* Section 2 */}
        <section className="rounded-3xl border border-card-border bg-card p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-heading text-lg font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent">
              2
            </span>
            <h2>Exact Personal Data Collected</h2>
          </div>
          <p>
            We adhere strictly to the principle of <strong>Data Minimization</strong> (DPDP Section 4). We never collect unnecessary biometric, genetic, religious, or sensitive personal data. The exact categories of data collected are:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="rounded-2xl border border-card-border/80 bg-background/50 p-4 space-y-2">
              <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-accent" />
                <span>Identity &amp; Account Data</span>
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Full Name</li>
                <li>Email Address</li>
                <li>Profile Picture (optional, via Google OAuth)</li>
                <li>Cryptographically salted password hash (never plain text)</li>
                <li>DPDP consent timestamp and record</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-card-border/80 bg-background/50 p-4 space-y-2">
              <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-blue-400" />
                <span>Commercial &amp; Transactional Data</span>
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Billing customer name and email</li>
                <li>Contact phone number (for digital delivery &amp; UPI receipt)</li>
                <li>Payment gateway transaction reference IDs (UPI / Card / NetBanking)</li>
                <li>Unique cryptographic license keys issued</li>
                <li>GST invoice state for tax compliance</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-card-border/80 bg-background/50 p-4 space-y-2">
              <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                <span>Technical &amp; Session Data</span>
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>IP address (anonymized for security logs)</li>
                <li>Browser user-agent &amp; operating system</li>
                <li>Strictly necessary HTTP session cookies (HMAC signed)</li>
                <li>Currency display preference (INR vs. USD)</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-card-border/80 bg-background/50 p-4 space-y-2">
              <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Data We Never Store</span>
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-xs text-foreground/80">
                <li>Credit/debit card numbers or CVVs (handled by RBI-licensed gateways)</li>
                <li>UPI PINs or net-banking passwords</li>
                <li>Government identity numbers (Aadhaar, PAN, Passport)</li>
                <li>Location tracking / precise GPS coordinates</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="rounded-3xl border border-card-border bg-card p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-heading text-lg font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent">
              3
            </span>
            <h2>Specific Purpose of Data Processing</h2>
          </div>
          <p>
            Under Section 4(1) of the DPDP Act, personal data is processed solely for lawful and transparent purposes:
          </p>
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3 rounded-xl border border-card-border/60 bg-background/40 p-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground text-xs block">Order Fulfillment &amp; Digital Access Dispatch</strong>
                <span className="text-xs">Generating single-use expiring Cloudflare R2 download links, delivering Canva template share URLs, and verifying software licenses.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-card-border/60 bg-background/40 p-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground text-xs block">Account Authentication &amp; Anti-Tamper Security</strong>
                <span className="text-xs">Verifying creator identities, managing secure sessions via signed HTTP cookies, and preventing account enumeration or brute-force attacks.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-card-border/60 bg-background/40 p-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground text-xs block">Statutory Invoicing &amp; Tax Compliance</strong>
                <span className="text-xs">Generating digital tax invoices complying with the Central Goods and Services Tax Act, 2017 (CGST) and Indian financial audits.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-card-border/60 bg-background/40 p-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground text-xs block">Customer Support &amp; Grievance Redressal</strong>
                <span className="text-xs">Responding to customer inquiries, refund requests, and troubleshooting digital asset access.</span>
              </div>
            </div>
          </div>
          <p className="text-xs font-semibold text-foreground pt-2">
            Data Prohibition Guarantee: BADARSH will NEVER sell, lease, rent, or trade your personal information to third-party data brokers, telemarketers, or unauthorized advertising networks.
          </p>
        </section>

        {/* Section 4 */}
        <section className="rounded-3xl border border-card-border bg-card p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-heading text-lg font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent">
              4
            </span>
            <h2>Statutory Rights of the Data Principal</h2>
          </div>
          <p>
            The DPDP Act, 2023 grants you enforceable statutory rights that you may exercise directly from your account or by contacting our Grievance Officer:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-2xl border border-card-border/80 bg-background/40 p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-foreground text-xs">
                <FileText className="h-3.5 w-3.5 text-accent" />
                <span>1. Right to Access (Section 11)</span>
              </div>
              <p className="text-xs">
                You have the right to obtain a readable summary of all personal data held by us, alongside the processing activities carried out.
              </p>
            </div>

            <div className="rounded-2xl border border-card-border/80 bg-background/40 p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-foreground text-xs">
                <RefreshCw className="h-3.5 w-3.5 text-blue-400" />
                <span>2. Right to Correction (Section 12)</span>
              </div>
              <p className="text-xs">
                You may request correction, completion, or updating of inaccurate, misleading, or outdated personal data.
              </p>
            </div>

            <div className="rounded-2xl border border-card-border/80 bg-background/40 p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-foreground text-xs">
                <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                <span>3. Right to Erasure / Right to be Forgotten (Section 12)</span>
              </div>
              <p className="text-xs">
                You have the right to request permanent deletion of your account and personal data. Logged-in users can execute an instant cascading purge via{" "}
                <Link href="/account" className="font-semibold text-accent underline hover:text-accent-hover">
                  Account &amp; DPDP Privacy Settings
                </Link>
                . Guest buyers may email{" "}
                <a href="mailto:dpo@badarsh.com?subject=Statutory%20DPDP%20Data%20Erasure%20Request" className="font-semibold text-rose-500 underline hover:text-rose-600">
                  dpo@badarsh.com
                </a>{" "}
                with a 7-day statutory fulfillment guarantee.
              </p>
            </div>

            <div className="rounded-2xl border border-card-border/80 bg-background/40 p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-foreground text-xs">
                <UserX className="h-3.5 w-3.5 text-amber-400" />
                <span>4. Right to Withdraw Consent (Section 6)</span>
              </div>
              <p className="text-xs">
                You may withdraw previously given consent at any time without penalty or fees, stopping all future non-statutory data processing.
              </p>
            </div>

            <div className="rounded-2xl border border-card-border/80 bg-background/40 p-4 space-y-1.5 sm:col-span-2">
              <div className="flex items-center gap-2 font-semibold text-foreground text-xs">
                <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>5. Right to Nominate (Section 14)</span>
              </div>
              <p className="text-xs">
                You have the statutory right to nominate any individual who, in the event of death or incapacity, shall exercise your rights as a Data Principal under the DPDP Act.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="rounded-3xl border border-card-border bg-card p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-heading text-lg font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent">
              5
            </span>
            <h2>Security Safeguards &amp; Data Breach Readiness</h2>
          </div>
          <p>
            In compliance with DPDP Section 8(5), we enforce bank-grade technical and organizational safeguards:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li><strong>TLS 1.3 End-to-End Encryption:</strong> All data transmitted between your device and BADARSH is encrypted using modern TLS cryptographic ciphers.</li>
            <li><strong>Cryptographic Password Hashing:</strong> Passwords are protected using PBKDF2 with SHA-512 and random 128-bit cryptographic salts.</li>
            <li><strong>IDOR Protection:</strong> Every database operation verifies that the authenticated user strictly owns the requested record before granting access.</li>
            <li><strong>Statutory Breach Notification:</strong> In the unlikely event of a security incident, our automated <code>breachNotifier</code> system dispatches immediate notifications to affected users and submits a comprehensive statutory report to the <strong>Data Protection Board of India (DPBI)</strong> in accordance with Section 8(6).</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="rounded-3xl border border-accent/30 bg-accent/5 p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-foreground font-heading text-lg font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white text-xs font-bold">
              6
            </span>
            <h2>Grievance Redressal &amp; Data Protection Officer Contact</h2>
          </div>
          <p className="text-xs">
            In compliance with Section 8(9) and Section 13 of the DPDP Act, 2023, BADARSH has designated an official Data Protection Officer and Grievance Redressal Officer:
          </p>

          <div className="rounded-2xl border border-card-border bg-card p-5 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-muted uppercase">Designation</span>
                <p className="font-bold text-foreground">{grievanceOfficerName}</p>
                <p className="text-muted">{BUSINESS_LEGAL_NAME}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-muted uppercase">Physical Registered Address</span>
                <p className="text-foreground">{BUSINESS_LOCATION}, India</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-muted uppercase">Official Grievance Email</span>
                <p>
                  <a href={`mailto:${grievanceEmail}`} className="font-semibold text-accent hover:underline">
                    {grievanceEmail}
                  </a>
                  <span className="text-muted block text-[11px]">Direct Escalation: {dpoEmail}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-muted uppercase">Statutory Redressal SLA</span>
                <p className="font-semibold text-emerald-400">Within 7 to 30 Business Days</p>
                <span className="text-[11px] text-muted block">Acknowledgment sent within 48 hours</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted">
            If a grievance is not resolved within the statutory period, Data Principals may escalate their concern directly to the <strong>Data Protection Board of India (DPBI)</strong> via the national statutory portal at <code>dpbi.gov.in</code>.
          </p>
        </section>

        {/* Action Link Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-card-border/60 pt-6 text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} {BUSINESS_LEGAL_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground underline underline-offset-2">
              Terms of Service
            </Link>
            <Link href="/signup" className="hover:text-foreground underline underline-offset-2">
              Register Account
            </Link>
            <Link href="/account" className="hover:text-foreground underline underline-offset-2">
              Account &amp; Privacy Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
