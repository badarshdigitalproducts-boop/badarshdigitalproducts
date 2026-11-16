"use client";

import { useMemo, useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { ProductGrid } from "@/components/products/product-grid";
import { products } from "@/content/products";

export default function EbooksPage() {
  const [search, setSearch] = useState("");
  const ebooks = useMemo(() => {
    return products.filter(
      (p) =>
        p.category === "ebooks" &&
        (p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      <SectionHeader
        badge="Digital Library"
        title="Marketing E-Books &amp; Founder Playbooks"
        subtitle="Battle-tested step-by-step frameworks on organic Instagram growth, copywriting that sells, and building automated digital revenue."
      />

      {/* Search Input */}
      <div className="mx-auto mt-4 mb-12 max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search e-books, playbooks, guides..."
          className="w-full rounded-full border border-card-border bg-card px-5 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <ProductGrid
        products={ebooks}
        emptyMessage="No e-books currently matching your search. Check back soon for new playbook drops!"
      />
    </div>
  );
}

