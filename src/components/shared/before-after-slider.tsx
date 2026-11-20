"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  aspectRatio?: string;
  initialSliderPosition?: number;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Original RAW",
  afterLabel = "BADARSH Grade",
  className = "",
  aspectRatio = "aspect-4/3",
  initialSliderPosition = 50,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(initialSliderPosition);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    },
    [handleMove]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    },
    [isDragging, handleMove]
  );

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleGlobalPointerUp = () => setIsDragging(false);
    window.addEventListener("pointerup", handleGlobalPointerUp);
    return () => window.removeEventListener("pointerup", handleGlobalPointerUp);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={(e) => handleMove(e.clientX)}
      className={`group relative overflow-hidden select-none cursor-ew-resize rounded-2xl border border-card-border/60 bg-neutral-900 shadow-xl ${aspectRatio} ${className}`}
    >
      {/* After Image (Full width background) */}
      <img
        src={afterImage}
        alt="After color grading"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Before Image (Clipped container based on slider percentage) */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Before unedited"
          className="absolute inset-0 h-full w-full max-w-none object-cover pointer-events-none"
          style={{
            width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%",
          }}
        />
      </div>

      {/* Vertical Slider Divider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.7)] pointer-events-none transition-transform duration-75"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Center Drag Handle */}
        <div
          onPointerDown={handlePointerDown}
          className="pointer-events-auto absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/70 backdrop-blur-md text-white shadow-2xl transition-transform hover:scale-110 active:scale-95 cursor-grab active:cursor-grabbing"
        >
          <MoveHorizontal className="h-4 w-4" />
        </div>
      </div>

      {/* Badges */}
      <div className="absolute top-3 left-3 pointer-events-none">
        <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90 border border-white/10 shadow-sm">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute top-3 right-3 pointer-events-none">
        <span className="rounded-full bg-accent/80 backdrop-blur-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white border border-white/20 shadow-sm">
          {afterLabel}
        </span>
      </div>

      {/* Bottom Hint on hover */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[10px] text-white/80 font-medium">
          Drag to compare
        </span>
      </div>
    </div>
  );
}
