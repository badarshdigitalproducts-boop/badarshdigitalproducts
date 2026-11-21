"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  FileText,
  Film,
  Music,
  Image as ImageIcon,
  Loader2,
  X,
  Eye,
  Copy,
  Check,
  Download,
  Info,
  ExternalLink,
  BookOpen,
  Sparkles,
  HardDrive,
} from "lucide-react";

export interface CuratedBook {
  id: string;
  name: string;
  author: string;
  category: string;
  url: string;
  cover: string;
  pages: number;
  size: string;
}

export const VERIFIED_EBOOKS: CuratedBook[] = [
  {
    id: "rich-dad-poor-dad",
    name: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    category: "Financial Freedom & Investing",
    url: "https://raw.githubusercontent.com/budostylz/ENTREPRENEURSHIP/master/Rich%20Dad%20Poor%20Dad.pdf",
    cover: "https://covers.openlibrary.org/b/id/8378772-L.jpg",
    pages: 336,
    size: "0.5 MB (Full Unabridged)",
  },
  {
    id: "atomic-habits",
    name: "Atomic Habits",
    author: "James Clear",
    category: "Productivity & Habit Mastery",
    url: "https://raw.githubusercontent.com/gocandra/BOOKS/master/Atomic%20Habits.pdf",
    cover: "https://covers.openlibrary.org/b/id/12886416-L.jpg",
    pages: 320,
    size: "5.7 MB (Complete Edition)",
  },
  {
    id: "the-psychology-of-money",
    name: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Wealth & Mindset",
    url: "https://raw.githubusercontent.com/ashishjain1547/public_financial_iq_books/master/5_The-Psychology-of-Money.pdf",
    cover: "https://covers.openlibrary.org/b/id/10543666-L.jpg",
    pages: 256,
    size: "2.8 MB (Master Edition)",
  },
  {
    id: "cashflow-quadrant",
    name: "CASHFLOW Quadrant",
    author: "Robert T. Kiyosaki",
    category: "Business & Financial OS",
    url: "https://raw.githubusercontent.com/budostylz/ENTREPRENEURSHIP/master/CASHFLOW-Quadrant-2015.pdf",
    cover: "https://covers.openlibrary.org/b/id/8231990-L.jpg",
    pages: 376,
    size: "6.6 MB (Original Edition)",
  },
  {
    id: "hooked-habit-forming",
    name: "Hooked: How to Build Habit-Forming Products",
    author: "Nir Eyal",
    category: "Product Design & Psychology",
    url: "https://raw.githubusercontent.com/budostylz/ENTREPRENEURSHIP/master/OceanofPDF.com_Hooked_How_to_Build_Habit.pdf",
    cover: "https://covers.openlibrary.org/b/id/8235114-L.jpg",
    pages: 256,
    size: "2.2 MB (Illustrated)",
  },
  {
    id: "the-business-21st-century",
    name: "The Business of the 21st Century",
    author: "Robert T. Kiyosaki",
    category: "Entrepreneurship",
    url: "https://raw.githubusercontent.com/budostylz/ENTREPRENEURSHIP/master/TheBusinessofthe21stCenturyBook%5B1933%5D.pdf",
    cover: "https://covers.openlibrary.org/b/id/8231990-L.jpg",
    pages: 134,
    size: "8.9 MB",
  },
];

interface FileUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onSelectCuratedBook?: (book: CuratedBook) => void;
  accept?: string;
  hint?: string;
  placeholder?: string;
  fileType?: "image" | "pdf" | "video" | "audio" | "any";
  required?: boolean;
}

export function FileUploader({
  label,
  value,
  onChange,
  onSelectCuratedBook,
  accept,
  hint,
  placeholder,
  fileType = "any",
  required = false,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<"gdrive" | "upload" | "link" | "library">(
    fileType === "image" ? "upload" : "gdrive"
  );
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError(null);

    // Vercel Serverless payload limit is 4.5 MB. Large E-Books, Audio, and Video files must use Google Drive
    const MAX_DIRECT_BYTES = 4.2 * 1024 * 1024;
    if (file.size > MAX_DIRECT_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setError(
        `This file is ${sizeMb} MB. Direct upload is limited to 4 MB. For large Sound Effects, Videos, Bundles, or PDFs, please paste your Google Drive link below.`
      );
      setActiveTab("gdrive");
      setUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      // Safely read response text first to guard against HTTP 413 or HTML error pages
      const responseText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        if (res.status === 413 || responseText.includes("Request Entity Too Large")) {
          throw new Error(
            `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB) for direct upload. Please paste a Google Drive link instead.`
          );
        }
        throw new Error(
          `Upload failed (${res.status}). Please paste a Google Drive link.`
        );
      }

      if (!res.ok) {
        throw new Error(data.error || "File upload failed");
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "Upload failed. Please paste a Google Drive link instead.");
      setActiveTab("gdrive");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const copyToClipboard = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUrlChange = (inputUrl: string) => {
    let clean = inputUrl.trim();
    // Auto-clean Google Drive file links
    if (clean.includes("drive.google.com/file/d/")) {
      const match = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        if (clean.includes("/preview")) {
          clean = `https://drive.google.com/file/d/${match[1]}/preview`;
        } else {
          clean = `https://drive.google.com/file/d/${match[1]}/view`;
        }
      }
    } else if (clean.includes("drive.google.com/open?id=")) {
      const match = clean.match(/id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        clean = `https://drive.google.com/file/d/${match[1]}/view`;
      }
    } else if (clean.includes("drive.google.com/drive/folders/")) {
      const match = clean.match(/\/drive\/folders\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        clean = `https://drive.google.com/drive/folders/${match[1]}`;
      }
    }
    onChange(clean);
  };

  const selectCuratedBook = (book: CuratedBook) => {
    onChange(book.url);
    if (onSelectCuratedBook) {
      onSelectCuratedBook(book);
    }
    setError(null);
  };

  const getTypeLabel = () => {
    switch (fileType) {
      case "image":
        return "Photo / Image (PNG, JPG, WebP, SVG)";
      case "pdf":
        return "PDF Document (E-Book, Guide, Planner)";
      case "video":
        return "MP4 / Reel Video (MP4, MOV, WebM)";
      case "audio":
        return "Audio Track (MP3, WAV, OGG)";
      default:
        return "File / Archive (ZIP, PDF, MP4, Audio, Photo)";
    }
  };

  const getIcon = () => {
    switch (fileType) {
      case "image":
        return <ImageIcon className="h-5 w-5 text-blue-400" />;
      case "pdf":
        return <FileText className="h-5 w-5 text-amber-400" />;
      case "video":
        return <Film className="h-5 w-5 text-[#FF5A36]" />;
      case "audio":
        return <Music className="h-5 w-5 text-emerald-400" />;
      default:
        return <UploadCloud className="h-5 w-5 text-zinc-400" />;
    }
  };

  const isVideo = fileType === "video" || value?.match(/\.(mp4|mov|webm)$/i);
  const isImage =
    fileType === "image" ||
    value?.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i) ||
    value?.startsWith("https://images.unsplash.com") ||
    value?.startsWith("https://covers.openlibrary.org") ||
    value?.startsWith("data:image/");
  const isPdf =
    fileType === "pdf" ||
    value?.match(/\.pdf$/i) ||
    value?.includes("/preview") ||
    value?.startsWith("data:application/pdf");
  const isAudio =
    fileType === "audio" ||
    value?.match(/\.(mp3|wav|ogg|m4a)$/i) ||
    value?.startsWith("data:audio/");
  const isGeneric = !isVideo && !isImage && !isPdf && !isAudio;
  const isGoogleDrive = value?.includes("drive.google.com");
  const isGitHubRaw = value?.includes("raw.githubusercontent.com");

  return (
    <div className="space-y-2">
      {/* Header with Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
          {label}
          {required && <span className="text-[#FF5A36]">*</span>}
        </label>

        {/* Action Toggle Pills */}
        <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab("gdrive")}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md transition-colors cursor-pointer font-bold ${
              activeTab === "gdrive"
                ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <HardDrive className="h-3 w-3 text-blue-400" />
            <span>Google Drive</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer font-medium ${
              activeTab === "upload"
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("link")}
            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer font-medium ${
              activeTab === "link"
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Direct Link
          </button>
          {(fileType === "pdf" || fileType === "any") && (
            <button
              type="button"
              onClick={() => setActiveTab("library")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors cursor-pointer font-medium ${
                activeTab === "library"
                  ? "bg-amber-500/20 text-amber-300"
                  : "text-zinc-400 hover:text-amber-300"
              }`}
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Verified Books</span>
            </button>
          )}
        </div>
      </div>

      {hint && <p className="text-[11px] text-zinc-500">{hint}</p>}

      {error && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300 space-y-1.5">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
            <span className="leading-snug">{error}</span>
          </div>
        </div>
      )}

      {/* When a file or link is already present */}
      {value ? (
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-3 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 truncate max-w-[70%]">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="font-mono text-xs text-zinc-200 truncate">{value}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                title="Copy file URL"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("link")}
                className="rounded-lg bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                title="Edit Link"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-lg bg-zinc-900 border border-zinc-800 p-1 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                title="Remove file"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Live Previews */}
          {isImage && (
            <div className="relative aspect-[16/9] max-h-48 w-full overflow-hidden rounded-xl border border-zinc-800 bg-black/60">
              <img src={value} alt="Uploaded Preview" className="h-full w-full object-contain" />
            </div>
          )}

          {isVideo && (
            <div className="relative aspect-[16/9] max-h-48 w-full overflow-hidden rounded-xl border border-zinc-800 bg-black">
              {value.includes("youtube.com") || value.includes("youtu.be") ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${
                    value.includes("v=") ? value.split("v=")[1]?.split("&")[0] : value.split("/").pop()
                  }`}
                  className="h-full w-full border-0"
                  allowFullScreen
                />
              ) : (
                <video src={value} controls className="h-full w-full object-contain" />
              )}
            </div>
          )}

          {isPdf && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl bg-zinc-900/60 p-3 border border-zinc-800 gap-2">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-amber-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isGitHubRaw
                      ? "Verified GitHub CDN PDF Attached (100% Working)"
                      : isGoogleDrive
                      ? "Google Drive PDF Attached"
                      : "PDF Document Attached"}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    Live stream ready for on-site reader &amp; instant buyer downloads
                  </span>
                </div>
              </div>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 text-[11px] font-semibold text-amber-400 hover:bg-amber-500/25"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Test Open PDF</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {isAudio && (
            <div className="rounded-xl bg-zinc-900/60 p-3 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <Music className="h-4 w-4" />
                <span>Audio Track Attached</span>
              </div>
              <audio src={value} controls className="w-full h-8" />
            </div>
          )}

          {isGeneric && (
            <div className="flex items-center justify-between rounded-xl bg-zinc-900/60 p-3 border border-zinc-800">
              <div className="flex items-center gap-2.5 truncate max-w-[70%]">
                <UploadCloud className="h-5 w-5 text-zinc-400 shrink-0" />
                <div className="truncate">
                  <span className="text-xs font-bold text-white block">File Attached</span>
                  <span className="text-[10px] text-zinc-500 truncate block font-mono">{value}</span>
                </div>
              </div>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-[11px] font-semibold text-zinc-300 hover:text-white"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download / View</span>
              </a>
            </div>
          )}
        </div>
      ) : activeTab === "gdrive" ? (
        /* Dedicated Google Drive Cloud Vault Tab */
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                <HardDrive className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Google Drive Asset Connector</h4>
                <p className="text-[10px] text-zinc-400">
                  Ideal for Sound Packs, 4K Footage, E-Book PDFs, and Mega Bundles with zero file size limits.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400 uppercase">
              No Size Limit
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              value={value || ""}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Paste Google Drive share link: https://drive.google.com/file/d/... or /drive/folders/..."
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none font-mono"
            />
            {value && isGoogleDrive && (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors shrink-0"
              >
                <span>Test Link</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {value && isGoogleDrive ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                {value.includes("/drive/folders/")
                  ? "Google Drive Folder connected — Full folder access delivered to customers."
                  : "Google Drive File connected — Auto-configured for in-browser streaming and direct download."}
              </span>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3 text-[11px] text-zinc-400 space-y-1">
              <span className="font-semibold text-zinc-300 block">How to get your Google Drive link:</span>
              <ol className="list-decimal list-inside space-y-0.5 text-zinc-400 pl-1">
                <li>Upload your PDF, ZIP, MP3, or Video folder to your Google Drive.</li>
                <li>Right-click the file/folder &rarr; click <strong>Share</strong> &rarr; change General access to <strong>&ldquo;Anyone with the link&rdquo;</strong>.</li>
                <li>Click <strong>&ldquo;Copy link&rdquo;</strong> and paste it into the box above.</li>
              </ol>
            </div>
          )}
        </div>
      ) : activeTab === "library" ? (
        /* Verified Book Presets Library */
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3 space-y-2.5">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span>Verified High-Retention E-Books (1-Click Attach)</span>
            </div>
            <span className="text-[10px] font-medium text-emerald-400">
              Direct CDN &bull; 100% Working
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {VERIFIED_EBOOKS.map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => selectCuratedBook(book)}
                className="flex items-start gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-2 text-left hover:border-amber-400/50 hover:bg-zinc-800/60 transition-all cursor-pointer group"
              >
                <img
                  src={book.cover}
                  alt={book.name}
                  className="h-14 w-10 shrink-0 rounded object-cover shadow-sm group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                    {book.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 truncate">{book.author}</p>
                  <div className="mt-1 flex items-center gap-2 text-[9px] text-zinc-500 font-mono">
                    <span>{book.pages} Pages</span>
                    <span>&bull;</span>
                    <span>{book.size}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : activeTab === "link" ? (
        /* Manual URL link input (Google Drive / GitHub / CDN) */
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={value || ""}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Paste Google Drive link, GitHub raw URL, or CDN link..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none font-mono"
            />
          </div>

          {/* Google Drive 3-Step Guide */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 text-[11px] text-zinc-400 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
              <Info className="h-3.5 w-3.5 text-[#FF5A36]" />
              <span>How to link Google Drive for large E-Books &amp; Planners:</span>
            </div>
            <ol className="list-decimal list-inside space-y-0.5 text-zinc-400 pl-1">
              <li>Upload your PDF or ZIP to Google Drive</li>
              <li>Right-click the file &rarr; click <strong>Share</strong> &rarr; change General access to <strong>&ldquo;Anyone with the link&rdquo;</strong></li>
              <li>Click <strong>&ldquo;Copy link&rdquo;</strong> and paste it into the field above</li>
            </ol>
          </div>
        </div>
      ) : (
        /* Drag and Drop Zone */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
            dragActive
              ? "border-[#FF5A36] bg-[#FF5A36]/10 scale-[1.01]"
              : "border-zinc-800 bg-zinc-950 hover:border-[#FF5A36]/60 hover:bg-zinc-900/50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <Loader2 className="h-7 w-7 animate-spin text-[#FF5A36]" />
              <span className="text-xs font-semibold text-white">Processing &amp; uploading file...</span>
              <span className="text-[10px] text-zinc-500">Please wait while the file is linked</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 group-hover:scale-110 group-hover:border-[#FF5A36]/40 transition-all">
                {getIcon()}
              </div>

              <div>
                <p className="text-xs font-semibold text-white">
                  Drag &amp; drop {getTypeLabel()}, or{" "}
                  <span className="text-[#FF5A36] underline underline-offset-2">browse device</span>
                </p>
                <p className="mt-0.5 text-[10px] text-zinc-500">
                  Direct upload supports files under 4MB. For large books, use{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab("link");
                    }}
                    className="text-zinc-400 underline hover:text-[#FF5A36]"
                  >
                    Google Drive link
                  </button>{" "}
                  or{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab("library");
                    }}
                    className="text-amber-400 underline hover:text-amber-300"
                  >
                    Verified Books
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden native input */}
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
      />
    </div>
  );
}
