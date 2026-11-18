"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Clock, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { blogPosts as initialBlogPosts } from "@/content/blog";
import type { BlogPost } from "@/types";

export default function BlogListingPage() {
  const [postsList, setPostsList] = useState<BlogPost[]>(initialBlogPosts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        if (data.posts && data.posts.length > 0) {
          setPostsList(data.posts);
        }
      })
      .catch((err) => console.error("Error loading live blog posts:", err));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    postsList.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["all", ...Array.from(set)];
  }, [postsList]);

  const filteredPosts = useMemo(() => {
    return postsList.filter((post) => {
      const matchesCat = category === "all" || post.category === category;
      const matchesSearch =
        search === "" ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [postsList, search, category]);

  const featured = postsList[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      <SectionHeader
        badge="BADARSH Knowledge Base"
        title="Marketing, Design &amp; Founder Guides"
        subtitle="Real-world case studies, design tutorials, and organic growth tactics to help you win online."
      />

      {/* Featured hero post */}
      {featured && (
        <div className="relative mt-10 overflow-hidden rounded-3xl border border-card-border bg-card shadow-md transition-all hover:border-accent/40 hover:shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-accent/20 via-purple-900/30 to-card p-8 lg:col-span-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-background/80 border border-white/20 text-accent shadow-xl backdrop-blur-md">
                <Sparkles className="h-10 w-10" />
              </div>
            </div>

            <div className="flex flex-col justify-between p-8 md:p-12 lg:col-span-6">
              <div>
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                  Featured Article &bull; {featured.category}
                </span>

                <h2 className="mt-4 font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
                  {featured.title}
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {featured.excerpt}
                </p>

                <div className="mt-6 flex items-center gap-3 text-xs text-muted">
                  <span>{featured.author}</span>
                  <span>&bull;</span>
                  <span>{featured.date}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {featured.readTime}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-heading text-xs font-bold text-white shadow-md hover:bg-accent-hover"
                >
                  <span>Read Featured Article</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and search bar */}
      <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles, topics, tools..."
            className="w-full rounded-full border border-card-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all ${
                category === cat
                  ? "bg-accent text-white"
                  : "border border-card-border bg-card text-muted hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {cat === "all" ? "All Posts" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <article
            key={post.slug}
            className="group flex flex-col overflow-hidden rounded-3xl border border-card-border bg-card shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5"
          >
            <Link
              href={`/blog/${post.slug}`}
              className="relative block aspect-[16/9] w-full overflow-hidden bg-gradient-to-tr from-accent/20 via-purple-900/30 to-card"
            >
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background/80 border border-white/20 text-accent shadow-md backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>
              <div className="absolute top-3 left-3 rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                {post.category}
              </div>
            </Link>

            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-3 text-xs text-muted">
                <span>{post.date}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </span>
              </div>

              <Link href={`/blog/${post.slug}`} className="mt-3 block">
                <h3 className="line-clamp-2 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
              </Link>

              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                {post.excerpt}
              </p>

              <div className="mt-auto pt-5">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent transition-colors group-hover:text-accent-hover"
                >
                  <span>Read Article</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

