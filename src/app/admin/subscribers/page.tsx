"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Download,
  Search,
  Trash2,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";
import type { Subscriber } from "@/lib/admin/types";
import { safeParseJson } from "@/lib/utils";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch("/api/admin/subscribers", { cache: "no-store" });
      if (res.status === 401) {
        window.location.replace("/admin/login");
        return;
      }
      const data = await safeParseJson<{ subscribers?: Subscriber[] }>(res, {});
      setSubscribers(data.subscribers || []);
    } catch (err) {
      console.error("Failed to fetch subscribers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    try {
      const res = await fetch(`/api/admin/subscribers?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete subscriber:", err);
    }
  };

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-[#FF5A36]" />
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Newsletter &amp; Audience Engine
            </h1>
          </div>
          <p className="text-xs text-zinc-400">
            View organic subscribers, track acquisition sources, and export CSV for Mailchimp or Resend.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/subscribers?format=csv"
            download
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:border-zinc-700 hover:bg-zinc-850 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Subscribers CSV</span>
          </a>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <span className="text-xs text-zinc-400 font-medium">
          Total Audience:{" "}
          <strong className="text-white">{subscribers.length}</strong> Subscribers
        </span>

        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emails..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pr-4 pl-9 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Subscriber Email</th>
                <th className="px-4 py-3 font-medium">Acquisition Source</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date Subscribed</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-white">
                    {sub.email}
                  </td>
                  <td className="px-4 py-3.5 text-zinc-400">
                    <span className="rounded-md bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-300">
                      {sub.source}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-400">
                    {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleDeleteSubscriber(sub.id)}
                      className="rounded-lg p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                      title="Remove Subscriber"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

