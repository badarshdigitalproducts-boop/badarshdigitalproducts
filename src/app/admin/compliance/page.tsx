"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Send,
  FileCode,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Lock,
  UserX,
  Database,
  ExternalLink,
  History,
} from "lucide-react";
import type { BreachIncident, DPBIReportPayload, BreachDispatchResult } from "@/lib/compliance/breach-notifier";
import { safeParseJson } from "@/lib/utils";

export default function AdminCompliancePage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [incident, setIncident] = useState<BreachIncident | null>(null);
  const [recentAuditLogs, setRecentAuditLogs] = useState<any[]>([]);

  // Action states
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [dispatchResult, setDispatchResult] = useState<BreachDispatchResult | null>(null);
  const [dpbiPayload, setDpbiPayload] = useState<DPBIReportPayload | null>(null);
  const [sampleEmail, setSampleEmail] = useState<{ subject: string; html: string; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"result" | "dpbi" | "email">("result");

  // Dispatch modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/compliance/breach", { cache: "no-store" });
      if (res.status === 401) {
        window.location.replace("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to load DPDP compliance data");
      const data = await safeParseJson<any>(res, {});
      setMetrics(data.metrics);
      setIncident(data.templateIncident);
      setRecentAuditLogs(data.recentAuditLogs || []);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSimulateDryRun = async () => {
    if (!incident) return;
    setRunningAction("preview");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/compliance/breach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "preview",
          incident,
          dryRun: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Simulation failed");
      setDispatchResult(data.result);
      setDpbiPayload(data.result.dpbiReportPayload);
      setActiveTab("result");
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setRunningAction(null);
    }
  };

  const handleGenerateDPBIReport = async () => {
    if (!incident) return;
    setRunningAction("dpbi");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/compliance/breach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "dpbi_report",
          incident,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "DPBI generation failed");
      setDpbiPayload(data.dpbiReportPayload);
      setActiveTab("dpbi");
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setRunningAction(null);
    }
  };

  const handlePreviewSampleEmail = async () => {
    if (!incident) return;
    setRunningAction("email");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/compliance/breach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sample_email",
          incident,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Email preview failed");
      setSampleEmail(data.email);
      setActiveTab("email");
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setRunningAction(null);
    }
  };

  const handleDispatchLive = async () => {
    if (!incident || confirmInput !== "CONFIRM DISPATCH") return;
    setRunningAction("dispatch");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/compliance/breach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "dispatch",
          incident,
          dryRun: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Live dispatch failed");
      setDispatchResult(data.result);
      setDpbiPayload(data.result.dpbiReportPayload);
      setConfirmModalOpen(false);
      setConfirmInput("");
      setActiveTab("result");
      fetchStatus();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setRunningAction(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm font-medium text-slate-400">Loading DPDP compliance telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-3.5 w-3.5" /> DPDP Act 2023 Technical Compliance
              </span>
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400 border border-blue-500/20">
                Section 8(6) Breach Readiness
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Data Protection & Statutory Breach Notifier Desk
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Centralized incident response console for statutory Data Protection Board of India (DPBI) intimations, CERT-In compliance, and automated Data Principal security advisories.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchStatus}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh Telemetry
            </button>
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition"
            >
              Live Policy <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 4 Pillars Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pillar 1: Lawful Consent</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white">100% Active</div>
          <p className="mt-1 text-xs text-slate-400">
            Unchecked affirmative checkbox enforced at <span className="text-blue-400">/signup</span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pillar 2: IDOR Protection</span>
            <Lock className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white">Enforced</div>
          <p className="mt-1 text-xs text-slate-400">
            Cryptographic HMAC session ownership verification on orders & user data
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pillar 3: Erasure Purge</span>
            <UserX className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white">
            {metrics?.anonymizedUsersCount || 0} Purged
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Sec 12 cascading account purge & order PII anonymization active
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pillar 4: Active Principals</span>
            <Database className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white">
            {metrics?.totalRegisteredUsers || 0} Users
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Targetable Data Principals with audited consent records
          </p>
        </div>
      </div>

      {/* Main Breach Notification Workstation */}
      {incident && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Incident Form & Configuration */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-rose-400" /> Incident Configuration & Scope
                  </h2>
                  <p className="text-xs text-slate-400">
                    Draft statutory parameters before simulation or official board reporting.
                  </p>
                </div>
                <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                  {incident.incidentId}
                </span>
              </div>

              {/* Form Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Severity Level
                  </label>
                  <select
                    value={incident.severity}
                    onChange={(e) =>
                      setIncident({ ...incident, severity: e.target.value as any })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">Low (Localized, Minimal Risk)</option>
                    <option value="medium">Medium (Potential Metadata Access)</option>
                    <option value="high">High (Identity Data Exposed)</option>
                    <option value="critical">Critical (Credentials / Mass Impact)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Breach Category
                  </label>
                  <select
                    value={incident.category}
                    onChange={(e) =>
                      setIncident({ ...incident, category: e.target.value as any })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="unauthorized_access">Unauthorized Access</option>
                    <option value="credential_stuffing">Credential Stuffing</option>
                    <option value="data_leak">Data Leakage</option>
                    <option value="configuration_exposure">Configuration Exposure</option>
                    <option value="third_party_vendor">Third-Party Vendor</option>
                    <option value="ransomware">Ransomware</option>
                    <option value="other">Other Incident</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Incident Summary (Plain-language for Data Principals)
                </label>
                <textarea
                  rows={3}
                  value={incident.summary}
                  onChange={(e) => setIncident({ ...incident, summary: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Root Cause Analysis (Technical details for DPBI)
                </label>
                <textarea
                  rows={2}
                  value={incident.rootCause}
                  onChange={(e) => setIncident({ ...incident, rootCause: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Data categories */}
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-semibold text-rose-400 block mb-1.5">
                    Impacted Personal Data Categories
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {incident.affectedDataCategories.map((item, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-xs text-rose-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-emerald-400 block mb-1.5">
                    Strictly Protected & Unaffected Data
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {incident.unaffectedDataCategories.map((item, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-800 pt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSimulateDryRun}
                  disabled={runningAction !== null}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-white transition disabled:opacity-50"
                >
                  <Eye className="h-4 w-4 text-blue-400" />
                  {runningAction === "preview" ? "Simulating..." : "Simulate Dry Run (Audit)"}
                </button>

                <button
                  type="button"
                  onClick={handleGenerateDPBIReport}
                  disabled={runningAction !== null}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-white transition disabled:opacity-50"
                >
                  <FileCode className="h-4 w-4 text-emerald-400" />
                  {runningAction === "dpbi" ? "Compiling..." : "Generate DPBI Payload"}
                </button>

                <button
                  type="button"
                  onClick={handlePreviewSampleEmail}
                  disabled={runningAction !== null}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-white transition disabled:opacity-50"
                >
                  <Eye className="h-4 w-4 text-purple-400" />
                  {runningAction === "email" ? "Generating..." : "Preview Email Advisory"}
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmModalOpen(true)}
                  disabled={runningAction !== null}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-xs font-semibold text-white transition disabled:opacity-50 ml-auto"
                >
                  <Send className="h-4 w-4" />
                  Dispatch Statutory Notices
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Results & Previews Panel */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col h-full">
              {/* Tab navigation */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("result")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeTab === "result"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Simulation & Dispatch Results
                  </button>
                  <button
                    onClick={() => setActiveTab("dpbi")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeTab === "dpbi"
                        ? "bg-emerald-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    DPBI Regulatory Payload
                  </button>
                  <button
                    onClick={() => setActiveTab("email")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeTab === "email"
                        ? "bg-purple-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    User Advisory Preview
                  </button>
                </div>

                {dpbiPayload && activeTab === "dpbi" && (
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(dpbiPayload, null, 2))}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 transition"
                  >
                    {copiedPayload ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy JSON
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Tab 1: Dispatch Results */}
              {activeTab === "result" && (
                <div className="space-y-4">
                  {dispatchResult ? (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">Execution Mode:</span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              dispatchResult.dryRun
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            {dispatchResult.dryRun ? "Dry Run Simulation" : "Statutory Live Dispatch"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
                          <div>
                            <span className="text-slate-400">Total Principals Queried:</span>
                            <div className="text-base font-bold text-white">
                              {dispatchResult.totalQueried}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-400">Notices Compiled:</span>
                            <div className="text-base font-bold text-emerald-400">
                              {dispatchResult.totalDispatched}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-slate-300 mb-2">
                          Recipient Queue Sample (First 10)
                        </h4>
                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 max-h-48 overflow-y-auto space-y-1 font-mono text-xs text-slate-300">
                          {dispatchResult.recipientsPreview.length > 0 ? (
                            dispatchResult.recipientsPreview.slice(0, 10).map((r, i) => (
                              <div key={i} className="flex items-center justify-between py-1 border-b border-slate-900 last:border-0">
                                <span>{r.name}</span>
                                <span className="text-blue-400">{r.email}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-500">No matching user records queried.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 space-y-2">
                      <ShieldAlert className="h-10 w-10 text-slate-600" />
                      <p className="text-sm font-medium">No Simulation Run Yet</p>
                      <p className="text-xs max-w-sm">
                        Click &ldquo;Simulate Dry Run (Audit)&rdquo; on the left to verify targeted recipient counts and compile compliant advisories safely.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: DPBI Regulatory Payload */}
              {activeTab === "dpbi" && (
                <div className="h-full">
                  {dpbiPayload ? (
                    <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[460px] overflow-y-auto">
                      {JSON.stringify(dpbiPayload, null, 2)}
                    </pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 space-y-2">
                      <FileCode className="h-10 w-10 text-slate-600" />
                      <p className="text-sm font-medium">No DPBI Payload Generated</p>
                      <p className="text-xs max-w-sm">
                        Click &ldquo;Generate DPBI Payload&rdquo; to build the statutory intimation schema under DPDP Act Section 8(6).
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: User Advisory Preview */}
              {activeTab === "email" && (
                <div className="h-full space-y-3">
                  {sampleEmail ? (
                    <div className="space-y-3">
                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs">
                        <span className="font-semibold text-slate-400">Subject: </span>
                        <span className="text-white font-medium">{sampleEmail.subject}</span>
                      </div>
                      <div className="rounded-xl border border-slate-700 bg-white p-4 max-h-[400px] overflow-y-auto">
                        <div
                          className="prose prose-sm max-w-none text-slate-900"
                          dangerouslySetInnerHTML={{ __html: sampleEmail.html }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 space-y-2">
                      <Eye className="h-10 w-10 text-slate-600" />
                      <p className="text-sm font-medium">No Email Preview</p>
                      <p className="text-xs max-w-sm">
                        Click &ldquo;Preview Email Advisory&rdquo; to review the customer-facing security alert before transmission.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Compliance Audit Trail */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <History className="h-4 w-4 text-blue-400" /> Immutable DPDP Statutory Audit Trail
          </h2>
          <span className="text-xs text-slate-400">
            Recorded permanently in administrative database
          </span>
        </div>

        {recentAuditLogs.length > 0 ? (
          <div className="space-y-2">
            {recentAuditLogs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold ${
                      log.action.includes("DISPATCH")
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : log.action.includes("PURGE")
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}
                  >
                    {log.action}
                  </span>
                  <span className="text-slate-300 font-mono">{log.id}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <span className="max-w-md truncate text-slate-400">{log.details}</span>
                  <span className="text-slate-500 shrink-0">
                    {new Date(log.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">
            No compliance breach simulations or erasure actions recorded yet.
          </p>
        )}
      </div>

      {/* Confirmation Modal for Live Dispatch */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/40 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-rose-500/10 p-2 border border-rose-500/20">
                <ShieldAlert className="h-6 w-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Confirm Statutory Breach Dispatch
                </h3>
                <p className="text-xs text-rose-400 font-semibold">
                  Section 8(6) Legal Notification Procedure
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This action triggers official breach notification advisories to all registered Data Principals in your database and files an immutable compliance audit record.
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1 text-xs">
              <div className="text-slate-400">
                Incident ID: <span className="font-mono text-white">{incident?.incidentId}</span>
              </div>
              <div className="text-slate-400">
                Target Recipients:{" "}
                <span className="font-bold text-rose-400">
                  {metrics?.totalRegisteredUsers || 0} active users
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Type <span className="font-mono text-rose-400">CONFIRM DISPATCH</span> to execute:
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="CONFIRM DISPATCH"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmModalOpen(false);
                  setConfirmInput("");
                }}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDispatchLive}
                disabled={confirmInput !== "CONFIRM DISPATCH" || runningAction !== null}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition disabled:opacity-40"
              >
                {runningAction === "dispatch" ? "Dispatching..." : "Execute Dispatch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
