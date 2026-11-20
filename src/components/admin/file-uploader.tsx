"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Link as LinkIcon, FileText, Film, Music, Image as ImageIcon, Loader2, X } from "lucide-react";

interface FileUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  hint?: string;
  placeholder?: string;
  fileType?: "image" | "pdf" | "video" | "audio" | "any";
}

export function FileUploader({
  label,
  value,
  onChange,
  accept,
  hint,
  placeholder = "Upload file or paste link (Google Drive / Cloud URL)...",
  fileType = "any",
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    setSuccess(false);

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
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Upload failed. Try using a direct Google Drive link.");
    } finally {
      setUploading(false);
    }
  };

  const getIcon = () => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-4 w-4 text-amber-400" />;
      case "video":
        return <Film className="h-4 w-4 text-[#FF5A36]" />;
      case "audio":
        return <Music className="h-4 w-4 text-emerald-400" />;
      case "image":
        return <ImageIcon className="h-4 w-4 text-blue-400" />;
      default:
        return <UploadCloud className="h-4 w-4 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
          {getIcon()}
          <span>{label}</span>
        </label>
        {success && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 animate-fadeIn">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Uploaded successfully!</span>
          </span>
        )}
      </div>

      {hint && <p className="text-[11px] text-zinc-500">{hint}</p>}

      {error && (
        <div className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF5A36] focus:outline-none transition-colors"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-white"
              title="Clear input"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

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

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex cursor-pointer items-center gap-1.5 shrink-0 rounded-xl bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white disabled:opacity-50 transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FF5A36]" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-3.5 w-3.5 text-[#FF5A36]" />
              <span>Upload File</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
