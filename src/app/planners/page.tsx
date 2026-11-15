"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/shared/section-header";
import { ProductGrid } from "@/components/products/product-grid";
import { products } from "@/content/products";

export default function PlannersPage() {
  const [search, setSearch] = useState("");
  const planners = useMemo(() => {
    return products.filter(
      (p) =>
        (p.category === "planners" || p.tags.includes("planner")) &&
        (p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      <SectionHeader
        badge="Productivity Tools"
        title="Digital Planners &amp; Content Calendars"
        subtitle="Organize your 30/60/90-day social media schedule, track customer leads, and plan your business launches with ease."
      />

      {/* Search Input */}
      <div className="mx-auto mt-4 mb-12 max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search planners, calendars, trackers..."
          className="w-full rounded-full border border-card-border bg-card px-5 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <ProductGrid
        products={planners}
        emptyMessage="No digital planners matching your search criteria."
      />
    </div>
  );
}
