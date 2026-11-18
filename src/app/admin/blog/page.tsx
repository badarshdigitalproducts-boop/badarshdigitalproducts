"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  Tag,
  Folder,
  Calendar,
  User,
  Sparkles,
  X,
  Save,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import type { AdminBlogPost } from "@/lib/admin/types";

const CATEGORIES = [
  "Creative Insights",
  "Design Systems",
  "Video Editing & SFX",
  "Social Growth",
  "Brand Identity",
  "Entrepreneurship",
];

const DEFAULT_POST: Partial<AdminBlogPost> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Creative Insights",
  author: "BADARSH Editorial",
  date: new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
  readTime: "5 min read",
  coverImage: "/images/blog/canva-hacks.png",
  tags: ["Design", "Growth"],
  status: "published",
  views: 0,
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<AdminBlogPost>>(DEFAULT_POST);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch {
      showFeedback("error", "Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const openCreateModal = () => {
    setEditingPost({
      ...DEFAULT_POST,
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    });
    setTagsInput("Design, Growth");
    setIsModalOpen(true);
  };

  const openEditModal = (post: AdminBlogPost) => {
    setEditingPost({ ...post });
    setTagsInput(post.tags.join(", "));
    setIsModalOpen(true);
  };

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setEditingPost((prev) => ({
      ...prev,
      title,
      slug: prev?.slug ? prev.slug : slug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost.title) {
      showFeedback("error", "Article title is required");
      return;
    }

    try {
      setSaving(true);
      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...editingPost,
        tags: parsedTags,
        slug:
          editingPost.slug ||
          editingPost.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, ""),
      };

      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.post) {
        showFeedback("success", `Article "${data.post.title}" saved successfully`);
        setIsModalOpen(false);
        fetchPosts();
      } else {
        showFeedback("error", data.error || "Failed to save article");
      }
    } catch {
      showFeedback("error", "Network error saving article");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (post: AdminBlogPost) => {
    const nextStatus = post.status === "published" ? "draft" : "published";
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, status: nextStatus }),
      });
      if (res.ok) {
        showFeedback(
          "success",
          `Article status changed to ${nextStatus === "published" ? "Published" : "Draft"}`
        );
        fetchPosts();
      }
    } catch {
      showFeedback("error", "Failed to update article status");
    }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete article "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/blog?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showFeedback("success", "Article deleted successfully");
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
      } else {
        showFeedback("error", "Failed to delete article");
      }
    } catch {
      showFeedback("error", "Network error while deleting");
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-2xl backdrop-blur-xl transition-all ${
            feedback.type === "success"
              ? "border-emerald-500/30 bg-emerald-950/90 text-emerald-200"
              : "border-red-500/30 bg-red-950/90 text-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <X className="h-4 w-4 shrink-0 text-red-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Top Banner / KPIs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
              Blog & Editorial CMS
            </h1>
            <span className="rounded-full bg-[#FF5A36]/15 px-2.5 py-0.5 text-xs font-bold text-[#FF5A36]">
              {posts.length} Articles
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Publish thought leadership, design tutorials, and creative playbooks to rank #1 on Google.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            target="_blank"
            className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <span>Live Blog</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-[#FF5A36] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#FF5A36]/20 transition-all hover:bg-[#ff461e] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Write Article</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Total Articles</span>
            <FileText className="h-4 w-4 text-[#FF5A36]" />
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-white">{posts.length}</p>
          <p className="mt-1 text-[11px] text-zinc-500">Across all categories</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Published</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-emerald-400">
            {publishedCount}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">Public & indexed</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Drafts</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-amber-400">{draftCount}</p>
          <p className="mt-1 text-[11px] text-zinc-500">In-progress content</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Total Readership</span>
            <Eye className="h-4 w-4 text-blue-400" />
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-white">
            {totalViews.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">Organic article views</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search articles by title, keywords or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 py-2 pl-9 pr-4 text-xs text-white placeholder:text-zinc-500 focus:border-[#FF5A36] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs font-medium text-zinc-300 focus:border-[#FF5A36] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs font-medium text-zinc-300 focus:border-[#FF5A36] focus:outline-none"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Grid / List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-950/30">
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FF5A36] border-t-transparent" />
            <span>Loading articles...</span>
          </div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 py-16 text-center">
          <BookOpen className="h-10 w-10 text-zinc-600" />
          <h3 className="mt-3 font-heading text-sm font-bold text-white">No articles found</h3>
          <p className="mt-1 text-xs text-zinc-500">
            {search || statusFilter !== "all" || categoryFilter !== "all"
              ? "Try adjusting your search filters"
              : "Get started by publishing your first article"}
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 flex items-center gap-1.5 rounded-xl bg-[#FF5A36] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#ff461e]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Write New Article</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredPosts.map((post) => {
            const isPub = post.status === "published";
            return (
              <div
                key={post.slug}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 backdrop-blur-xl transition-all hover:border-zinc-700"
              >
                <div>
                  {/* Header badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[11px] font-semibold text-zinc-300">
                        {post.category}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isPub
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isPub ? "bg-emerald-400" : "bg-amber-400"
                          }`}
                        />
                        {isPub ? "Published" : "Draft"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                      <Eye className="h-3 w-3" />
                      <span>{post.views || 0}</span>
                    </div>
                  </div>

                  {/* Title & Excerpt */}
                  <h3 className="mt-3 font-heading text-base font-bold text-white group-hover:text-[#FF5A36] transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                    {post.excerpt || "No excerpt provided."}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-zinc-900 border border-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Meta & Actions */}
                <div className="mt-5 flex items-center justify-between border-t border-zinc-900 pt-3.5">
                  <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isPub && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        title="View Live Article"
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    )}
                    <button
                      onClick={() => handleToggleStatus(post)}
                      title={`Toggle to ${isPub ? "Draft" : "Publish"}`}
                      className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                    >
                      <Clock className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(post)}
                      title="Edit Article"
                      className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.slug, post.title)}
                      title="Delete Article"
                      className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-red-950/40 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5A36]/15 text-[#FF5A36]">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-white">
                    {editingPost.slug && posts.some((p) => p.slug === editingPost.slug)
                      ? "Edit Article"
                      : "Write New Article"}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Publish updates, tutorials, or guides for BADARSH creators
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Article Title <span className="text-[#FF5A36]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10 Canva Hacks Every Modern Creator Must Know in 2026"
                  value={editingPost.title || ""}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300">URL Slug</label>
                <div className="mt-1.5 flex items-center rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-500">
                  <span>badarsh.com/blog/</span>
                  <input
                    type="text"
                    value={editingPost.slug || ""}
                    onChange={(e) =>
                      setEditingPost((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className="flex-1 bg-transparent pl-1 font-mono text-zinc-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Excerpt / Meta Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Concise 1-2 sentence hook for SEO and blog card previews..."
                  value={editingPost.excerpt || ""}
                  onChange={(e) =>
                    setEditingPost((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              {/* Category, Read Time & Author */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Category</label>
                  <select
                    value={editingPost.category || "Creative Insights"}
                    onChange={(e) =>
                      setEditingPost((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Read Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 4 min read"
                    value={editingPost.readTime || "5 min read"}
                    onChange={(e) =>
                      setEditingPost((prev) => ({ ...prev, readTime: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Author</label>
                  <input
                    type="text"
                    placeholder="BADARSH Editorial"
                    value={editingPost.author || "BADARSH Editorial"}
                    onChange={(e) =>
                      setEditingPost((prev) => ({ ...prev, author: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image & Tags */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="/images/blog/canva-hacks.png"
                    value={editingPost.coverImage || ""}
                    onChange={(e) =>
                      setEditingPost((prev) => ({ ...prev, coverImage: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Canva, Design, Social Growth"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#FF5A36] focus:outline-none"
                  />
                </div>
              </div>

              {/* Article Content */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Full Article Body (Markdown supported)
                </label>
                <textarea
                  rows={8}
                  placeholder="Write your article here in markdown or plain text..."
                  value={editingPost.content || ""}
                  onChange={(e) =>
                    setEditingPost((prev) => ({ ...prev, content: e.target.value }))
                  }
                  className="mt-1.5 w-full font-mono rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-4">
                <label className="text-xs font-semibold text-zinc-300">Publication Status:</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={editingPost.status === "published"}
                      onChange={() =>
                        setEditingPost((prev) => ({ ...prev, status: "published" }))
                      }
                      className="accent-[#FF5A36]"
                    />
                    <span>Published</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={editingPost.status === "draft"}
                      onChange={() =>
                        setEditingPost((prev) => ({ ...prev, status: "draft" }))
                      }
                      className="accent-[#FF5A36]"
                    />
                    <span>Draft</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-zinc-800/80 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-900 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#FF5A36] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-[#FF5A36]/20 transition-all hover:bg-[#ff461e] active:scale-95 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Article</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
