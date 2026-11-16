"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { blogPosts } from "@/content/blog";

export function BlogPreview() {
  const posts = blogPosts.slice(0, 3);

  return (
    <section className="border-t border-card-border/60 bg-card/20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <SectionHeader
            badge="Insights &amp; Guides"
            title="Latest from the BADARSH Blog"
            subtitle="Actionable tactics on Canva design, high-converting social media, and digital marketing."
            align="left"
            className="mb-0 md:mb-0"
          />

          <Link
            href="/blog"
            className="hidden items-center gap-2 rounded-full border border-card-border bg-card px-6 py-2.5 text-xs font-bold text-foreground transition-all hover:border-accent hover:text-accent md:inline-flex"
          >
            <span>View All Articles</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-card-border bg-card shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5"
            >
              {/* Thumbnail banner */}
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

              {/* Content */}
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
                    <span>Read Full Guide</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card px-8 py-3 text-xs font-bold text-foreground shadow-sm hover:border-accent hover:text-accent"
          >
            <span>View All Articles</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

