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
} from "lucide-react";

interface FileUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
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
  accept,
  hint,
  placeholder,
  fileType = "any",
  required = false,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "File upload failed");
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "Upload failed. Try again or paste a Google Drive link.");
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

  const getTypeLabel = () => {
    switch (fileType) {
      case "image":
        return "Photo / Image (PNG, JPG, WebP, SVG)";
      case "pdf":
        return "PDF Document (Book, Guide, Planner)";
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
  const isImage = fileType === "image" || value?.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i) || value?.startsWith("https://images.unsplash.com");
  const isPdf = fileType === "pdf" || value?.match(/\.pdf$/i) || value?.includes("/preview");
  const isAudio = fileType === "audio" || value?.match(/\.(mp3|wav|ogg|m4a)$/i);
  const isGeneric = !isVideo && !isImage && !isPdf && !isAudio;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
          {label}
          {required && <span className="text-[#FF5A36]">*</span>}
        </label>

        <button
          type="button"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className="text-[11px] text-zinc-400 hover:text-[#FF5A36] flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="h-3 w-3" />
          <span>{showLinkInput ? "Use File Upload" : "Paste Drive/Web Link"}</span>
        </button>
      </div>

      {hint && <p className="text-[11px] text-zinc-500">{hint}</p>}

      {error && (
        <div className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* When a file is already uploaded/present */}
      {value ? (
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate max-w-[70%]">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="font-mono text-xs text-zinc-200 truncate">{value}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
                title="Copy file URL"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
                title="Replace file"
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-lg bg-zinc-900 border border-zinc-800 p-1 text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                title="Remove file"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Live Preview based on type */}
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
            <div className="flex items-center justify-between rounded-xl bg-zinc-900/60 p-3 border border-zinc-800">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-amber-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">PDF Document Attached</span>
                  <span className="text-[10px] text-zinc-500">Ready for on-site preview reader &amp; downloads</span>
                </div>
              </div>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 text-[11px] font-semibold text-amber-400 hover:bg-amber-500/25"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Open PDF</span>
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
      ) : showLinkInput ? (
        /* Manual URL link input */
        <div className="relative">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste Google Drive link, CDN link or YouTube link..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none"
          />
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
              <span className="text-xs font-semibold text-white">Uploading file directly to server...</span>
              <span className="text-[10px] text-zinc-500">Please wait while the file is saved</span>
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
                  Files are saved on your server and linked instantly
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
