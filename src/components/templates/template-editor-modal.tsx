"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Download, Sliders, Type, Palette, Sparkles, RefreshCw, Layers } from "lucide-react";

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateTitle: string;
  defaultHeadline?: string;
  defaultSubheadline?: string;
  defaultBrandName?: string;
  defaultContact?: string;
  backgroundImage?: string;
}

export function TemplateEditorModal({
  isOpen,
  onClose,
  templateTitle,
  defaultHeadline = "GROW YOUR BRAND IN 2026",
  defaultSubheadline = "Proven strategies to scale your creative business to 7 figures.",
  defaultBrandName = "YOUR BUSINESS NAME",
  defaultContact = "@yourhandle • yourwebsite.com",
  backgroundImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
}: TemplateEditorModalProps) {
  const [headline, setHeadline] = useState(defaultHeadline);
  const [subheadline, setSubheadline] = useState(defaultSubheadline);
  const [brandName, setBrandName] = useState(defaultBrandName);
  const [contact, setContact] = useState(defaultContact);

  const [accentColor, setAccentColor] = useState("#38bdf8"); // Sky blue default
  const [themeMode, setThemeMode] = useState<"dark" | "light" | "luxury" | "minimal">("dark");
  const [fontStyle, setFontStyle] = useState<"sans" | "serif" | "mono">("sans");
  const [isExporting, setIsExporting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Redraw canvas whenever inputs change
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High resolution canvas (1080x1350 for Instagram portrait 4:5 ratio)
    const W = 1080;
    const H = 1350;
    canvas.width = W;
    canvas.height = H;

    // 1. Background Fill based on themeMode
    if (themeMode === "dark") {
      ctx.fillStyle = "#0c0d10";
      ctx.fillRect(0, 0, W, H);
      // Subtle gradient glow
      const grad = ctx.createRadialGradient(W / 2, 300, 50, W / 2, 300, 700);
      grad.addColorStop(0, `${accentColor}25`);
      grad.addColorStop(1, "#0c0d10");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    } else if (themeMode === "light") {
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, W, H);
      const grad = ctx.createRadialGradient(W / 2, 250, 50, W / 2, 250, 600);
      grad.addColorStop(0, `${accentColor}18`);
      grad.addColorStop(1, "#f8fafc");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    } else if (themeMode === "luxury") {
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, W, H);
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, "#18181b");
      grad.addColorStop(1, "#09090b");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
    }

    // 2. Decorative Border Frame
    ctx.strokeStyle = themeMode === "light" || themeMode === "minimal" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)";
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, W - 120, H - 120);

    // 3. Brand Pill / Top Tag
    ctx.fillStyle = accentColor;
    ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(brandName.toUpperCase(), W / 2, 170);

    // Subtle divider under brand
    ctx.fillStyle = accentColor;
    ctx.fillRect(W / 2 - 40, 205, 80, 4);

    // 4. Headline Text
    const primaryFont =
      fontStyle === "serif"
        ? "Georgia, serif"
        : fontStyle === "mono"
        ? "'SF Mono', Monaco, monospace"
        : "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif";

    ctx.fillStyle = themeMode === "light" || themeMode === "minimal" ? "#0f172a" : "#ffffff";
    ctx.font = `800 72px ${primaryFont}`;
    ctx.textAlign = "center";

    // Wrap headline text
    const words = headline.split(" ");
    let line = "";
    let y = 460;
    const maxWidth = W - 220;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), W / 2, y);
        line = words[n] + " ";
        y += 88;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), W / 2, y);

    // 5. Subheadline Text
    y += 80;
    ctx.fillStyle = themeMode === "light" || themeMode === "minimal" ? "#475569" : "#94a3b8";
    ctx.font = `400 36px ${primaryFont}`;

    const subWords = subheadline.split(" ");
    let subLine = "";
    for (let n = 0; n < subWords.length; n++) {
      const testLine = subLine + subWords[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(subLine.trim(), W / 2, y);
        subLine = subWords[n] + " ";
        y += 52;
      } else {
        subLine = testLine;
      }
    }
    ctx.fillText(subLine.trim(), W / 2, y);

    // 6. Center Decorative Graphic Accent
    const decorY = Math.max(y + 110, 880);
    ctx.fillStyle = `${accentColor}20`;
    ctx.beginPath();
    ctx.arc(W / 2, decorY, 90, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(W / 2, decorY, 90, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = accentColor;
    ctx.font = "bold 34px -apple-system, sans-serif";
    ctx.fillText("✦", W / 2, decorY + 12);

    // 7. Footer Contact / Handle
    ctx.fillStyle = themeMode === "light" || themeMode === "minimal" ? "#64748b" : "#64748b";
    ctx.font = "500 28px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(contact, W / 2, H - 120);
  }, [headline, subheadline, brandName, contact, accentColor, themeMode, fontStyle]);

  useEffect(() => {
    if (isOpen) {
      renderCanvas();
    }
  }, [isOpen, renderCanvas]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsExporting(true);

    try {
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      const cleanName = brandName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
      link.download = `badarsh-template-${cleanName || "custom"}-1080x1350.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative flex flex-col md:flex-row h-[94vh] w-full max-w-6xl rounded-3xl border border-card-border/80 bg-card shadow-2xl overflow-hidden">
        {/* Left Side: Customization Controls Panel */}
        <div className="w-full md:w-[420px] flex flex-col border-b md:border-b-0 md:border-r border-card-border bg-background/90 p-5 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-card-border">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <h3 className="font-heading text-sm font-bold text-foreground">
                Template Studio
              </h3>
            </div>
            <button
              onClick={onClose}
              className="md:hidden rounded-full p-1.5 text-muted hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-xs text-muted">
            Personalize your graphic text, brand colors, and theme below. Live preview updates automatically.
          </p>

          <div className="mt-5 space-y-4">
            {/* Brand / Business Name */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Your Brand / Business Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. LUXURY STUDIO"
                className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
              />
            </div>

            {/* Headline */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Main Headline
              </label>
              <textarea
                rows={2}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Write your high-impact title"
                className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none resize-none"
              />
            </div>

            {/* Subheadline */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Sub-Text / Offer Details
              </label>
              <textarea
                rows={2}
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                placeholder="Brief description or callout"
                className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none resize-none"
              />
            </div>

            {/* Handle / Website */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Handle / Contact Info
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="@yourbrand • website.com"
                className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
              />
            </div>

            {/* Theme & Palette Selectors */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Visual Theme
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(["dark", "light", "luxury", "minimal"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setThemeMode(t)}
                      className={`rounded-lg py-1.5 text-[11px] font-medium capitalize border transition-all ${
                        themeMode === t
                          ? "border-accent bg-accent/10 text-accent font-bold"
                          : "border-card-border text-muted hover:border-foreground/20"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Typography
                </label>
                <div className="flex flex-col gap-1.5">
                  {(["sans", "serif", "mono"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFontStyle(f)}
                      className={`rounded-lg py-1 text-[11px] capitalize border transition-all ${
                        fontStyle === f
                          ? "border-accent bg-accent/10 text-accent font-bold"
                          : "border-card-border text-muted hover:border-foreground/20"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Accent Color Picker */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Accent Brand Color
              </label>
              <div className="flex items-center gap-2">
                {["#38bdf8", "#ec4899", "#10b981", "#f59e0b", "#a855f7", "#ffffff"].map((color) => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    style={{ backgroundColor: color }}
                    className={`h-6 w-6 rounded-full border transition-transform ${
                      accentColor === color ? "scale-125 border-foreground shadow-md ring-2 ring-accent" : "border-black/20"
                    }`}
                  />
                ))}
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-7 w-7 rounded-lg cursor-pointer bg-transparent border-0"
                  title="Pick custom color"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-6 space-y-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 py-3 text-xs font-bold text-background shadow-md transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>{isExporting ? "Rendering..." : "Download High-Res PNG (1080×1350)"}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Live Canvas Rendering Stage */}
        <div className="flex-1 flex flex-col bg-neutral-950 p-4 sm:p-6 overflow-hidden">
          <div className="hidden md:flex items-center justify-between pb-3 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time High-Res Canvas (4:5 Ratio)</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Canvas Wrapper */}
          <div className="flex-1 flex items-center justify-center overflow-auto p-2">
            <canvas
              ref={canvasRef}
              className="max-h-[76vh] max-w-full rounded-2xl shadow-2xl border border-white/10 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
