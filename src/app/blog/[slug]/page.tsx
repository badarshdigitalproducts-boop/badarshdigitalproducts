import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowLeft, Clock, Calendar, User, Share2, Sparkles, BookOpen } from "lucide-react";
import { blogPosts } from "@/content/blog";
import { constructMetadata, getBaseUrl } from "@/lib/metadata";
import { BlogViewTracker } from "@/components/blog/blog-view-tracker";
import { getAdminBlogPosts } from "@/lib/admin/store";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPostBySlug(slug: string) {
  try {
    const adminPosts = await getAdminBlogPosts();
    if (adminPosts && adminPosts.length > 0) {
      const found = adminPosts.find((p) => p.slug === slug);
      if (found) return found;
    }
  } catch {
    // fallback
  }
  return blogPosts.find((p) => p.slug === slug);
}

async function getAllPosts() {
  try {
    const adminPosts = await getAdminBlogPosts();
    if (adminPosts && adminPosts.length > 0) {
      return adminPosts;
    }
  } catch {
    // fallback
  }
  return blogPosts;
}

function parseInlineMarkdown(text: string): ReactNode {
  // Split by bold (**...**) and inline code (`...`)
  const parts: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-bold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className="rounded-md border border-card-border bg-card px-1.5 py-0.5 font-mono text-xs font-semibold text-accent"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return constructMetadata({
      title: "Article Not Found",
      description: "The requested blog article could not be found.",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: post.title,
    description: post.excerpt,
    image: post.coverImage || "/images/og/og-default.png",
    canonical: `/blog/${post.slug}`,
    keywords: post.tags || [],
  });
}

async function BlogPostContent({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const baseUrl = getBaseUrl();
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage?.startsWith("http")
      ? post.coverImage
      : `${baseUrl}${post.coverImage || "/images/og/og-default.png"}`,
    author: {
      "@type": "Organization",
      name: post.author || "BADARSH Editorial",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "BADARSH Digital Products",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo-icon.png`,
      },
    },
    mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
    keywords: (post.tags || []).join(", "),
  };

  const all = await getAllPosts();
  const related = all.filter((p) => p.slug !== post.slug).slice(0, 2);

  // Render markdown-like paragraphs and headings
  const renderContent = (content: string) => {
    const lines = content.trim().split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-4" />;
      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={idx}
            className="mt-8 mb-3 font-heading text-xl font-bold text-foreground"
          >
            {parseInlineMarkdown(trimmed.replace("### ", ""))}
          </h3>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={idx}
            className="mt-10 mb-4 font-heading text-2xl font-bold text-foreground border-b border-card-border/60 pb-2"
          >
            {parseInlineMarkdown(trimmed.replace("## ", ""))}
          </h2>
        );
      }
      if (trimmed.startsWith("- ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-muted leading-relaxed text-sm">
            {parseInlineMarkdown(trimmed.replace("- ", ""))}
          </li>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-muted leading-relaxed text-sm">
            {parseInlineMarkdown(trimmed.replace(/^\d+\.\s/, ""))}
          </li>
        );
      }
      return (
        <p key={idx} className="text-base leading-relaxed text-muted mb-3">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    });
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogViewTracker slug={post.slug} />
      {/* Back to Blog */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted transition hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to All Articles</span>
      </Link>

      {/* Header */}
      <div>
        <span className="rounded-full bg-accent/15 px-3.5 py-1 text-xs font-bold text-accent">
          {post.category}
        </span>

        <h1 className="mt-4 font-heading text-3xl font-extrabold text-foreground sm:text-5xl leading-tight">
          {post.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted border-y border-card-border/60 py-4">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-accent" />
            <span className="font-semibold text-foreground">{post.author}</span>
          </div>
          <span>&bull;</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{post.date}</span>
          </div>
          <span>&bull;</span>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="my-10 flex aspect-[21/9] w-full items-center justify-center rounded-3xl bg-gradient-to-br from-accent/20 via-purple-900/30 to-card border border-card-border shadow-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background/80 border border-white/20 text-accent shadow-xl backdrop-blur-md">
          <BookOpen className="h-8 w-8" />
        </div>
      </div>

      {/* Body Content */}
      <div className="prose prose-invert max-w-none">
        {renderContent(post.content)}
      </div>

      {/* Tags */}
      <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-card-border/60 pt-6">
        <span className="text-xs font-semibold text-muted mr-2">Tags:</span>
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-lg border border-card-border bg-card px-3 py-1 text-xs font-medium text-muted"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Author Bio Box */}
      <div className="mt-12 rounded-3xl border border-card-border bg-card/60 p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-accent to-purple-400 font-heading text-xl font-bold text-white shadow-md">
          B
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            Written by BADARSH Editorial
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            The BADARSH creative team produces actionable playbooks and design frameworks used by over 5,000+ founders, freelancers, and businesses across India.
          </p>
        </div>
      </div>

      {/* Related Posts */}
      {related.length > 0 && (
        <div className="mt-20 border-t border-card-border/60 pt-12">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
            Recommended Reading
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="group rounded-2xl border border-card-border bg-card p-6 shadow-sm transition hover:border-accent/40 hover:shadow-md"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                  {r.category}
                </span>
                <h4 className="mt-2 font-heading text-base font-bold text-foreground group-hover:text-accent transition">
                  {r.title}
                </h4>
                <p className="mt-1 line-clamp-2 text-xs text-muted">
                  {r.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

export default function BlogPostPage(props: BlogPostPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      }
    >
      <BlogPostContent params={props.params} />
    </Suspense>
  );
}
