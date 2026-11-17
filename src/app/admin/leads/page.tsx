"use client";

import { useEffect, useState } from "react";
import {
  Users2,
  Search,
  MessageCircle,
  Mail,
  Phone,
  Trash2,
  Calendar,
  DollarSign,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import type { LeadInquiry, LeadStatus } from "@/lib/admin/types";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<LeadInquiry | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: LeadStatus) => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, updates: { status } }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
        );
        if (selectedLead?.id === id) {
          setSelectedLead((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead?.id === id) setSelectedLead(null);
      }
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchesStatus =
      selectedStatus === "all" || l.status === selectedStatus;
    const matchesSearch =
      search === "" ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.interest.toLowerCase().includes(search.toLowerCase()) ||
      l.message.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case "new":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "contacted":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      case "proposal":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30";
      case "won":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users2 className="h-4 w-4 text-[#FF5A36]" />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Client Leads CRM
            </h1>
          </div>
          <p className="text-xs text-zinc-400">
            Track inquiries, update pipeline status, and launch 1-click WhatsApp replies.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pr-4 pl-9 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800/80 pb-4">
        {["all", "new", "contacted", "proposal", "won", "archived"].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              selectedStatus === st
                ? "bg-[#FF5A36] text-white"
                : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            {st}{" "}
            {st === "all"
              ? `(${leads.length})`
              : `(${leads.filter((l) => l.status === st).length})`}
          </button>
        ))}
      </div>

      {/* Main Grid: Table & Inspector Drawer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Table Column */}
        <div
          className={`rounded-2xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md overflow-hidden ${
            selectedLead ? "lg:col-span-7" : "lg:col-span-12"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Budget</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`cursor-pointer transition-colors hover:bg-zinc-900/50 ${
                      selectedLead?.id === lead.id ? "bg-zinc-900/80" : ""
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">{lead.name}</div>
                      <div className="text-[11px] text-zinc-500">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-300 font-medium">
                      {lead.interest}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400">
                      {lead.budget || "Not set"}
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        value={lead.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          updateStatus(lead.id, e.target.value as LeadStatus)
                        }
                        className={`cursor-pointer rounded-md border px-2 py-1 text-[11px] font-semibold uppercase focus:outline-none ${getStatusColor(
                          lead.status
                        )}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="proposal">Proposal</option>
                        <option value="won">Won</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div
                        className="flex items-center justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {lead.phone && (
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              `Hi ${lead.name}! I received your inquiry for ${lead.interest} on BADARSH. When would be a good time to connect?`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-emerald-400 hover:bg-emerald-500/10"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="rounded-lg p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-zinc-500"
                    >
                      No leads found matching your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Inspector Detail Drawer (5 cols) */}
        {selectedLead && (
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-6 backdrop-blur-md lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  {selectedLead.name}
                </h3>
                <p className="text-xs text-zinc-400">{selectedLead.email}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-xs text-zinc-500 hover:text-white"
              >
                Close ✕
              </button>
            </div>

            {/* Quick Contact Actions */}
            <div className="flex flex-wrap gap-2">
              {selectedLead.phone && (
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hi ${selectedLead.name}! I saw your inquiry for ${selectedLead.interest} on BADARSH.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Launch WhatsApp</span>
                </a>
              )}
              <a
                href={`mailto:${selectedLead.email}?subject=Regarding your inquiry for ${selectedLead.interest} on BADARSH`}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800"
              >
                <Mail className="h-4 w-4" />
                <span>Send Email</span>
              </a>
            </div>

            {/* Inbound Message */}
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                Client Inquiry Message
              </span>
              <div className="mt-2 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 text-xs leading-relaxed text-zinc-200">
                {selectedLead.message}
              </div>
            </div>

            {/* Lead Meta */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3">
                <span className="text-[10px] text-zinc-500 uppercase">Service</span>
                <p className="mt-0.5 font-semibold text-white">{selectedLead.interest}</p>
              </div>
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3">
                <span className="text-[10px] text-zinc-500 uppercase">Budget</span>
                <p className="mt-0.5 font-semibold text-white">
                  {selectedLead.budget || "Flexible"}
                </p>
              </div>
            </div>

            {/* Private Founder Notes */}
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                Private Founder Notes
              </span>
              <p className="mt-1 text-xs text-zinc-400">
                {selectedLead.notes || "No notes logged yet."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
