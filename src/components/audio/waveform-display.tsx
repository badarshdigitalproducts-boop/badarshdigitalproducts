"use client";

import React, { useRef, useState, useMemo } from "react";

interface WaveformDisplayProps {
  points?: number[];
  isCurrent: boolean;
  isPlaying: boolean;
  currentTime?: number;
  duration?: number;
  onSeek?: (seconds: number) => void;
}

export function WaveformDisplay({
  points,
  isCurrent,
  isPlaying,
  currentTime = 0,
  duration = 10,
  onSeek,
}: WaveformDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverPercent, setHoverPercent] = useState<number | null>(null);

  // Default fallback envelope data if points not provided
  const dataPoints = useMemo(() => {
    if (points && points.length > 0) return points;
    const res: number[] = [];
    const count = 80;
    for (let i = 0; i < count; i++) {
      const x = i / count;
      const base =
        0.02 +
        0.65 * Math.sin(x * Math.PI * 4) ** 2 * Math.exp(-((x - 0.5) ** 2) * 6) +
        0.3 * Math.sin(x * Math.PI * 12) ** 2;
      res.push(Math.min(1, Math.max(0.02, base)));
    }
    return res;
  }, [points]);

  const progress =
    isCurrent && duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    setHoverPercent(x / rect.width);
  };

  const handlePointerLeave = () => {
    setHoverPercent(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!containerRef.current || !onSeek || duration <= 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const targetTime = (x / rect.width) * duration;
    onSeek(targetTime);
  };

  // SVG dimensions for sharp rendering
  const width = 480;
  const height = 44;
  const midY = height / 2;

  // Build top and bottom paths for smooth audio envelope matching Envato/Apple design
  const envelopePaths = useMemo(() => {
    const n = dataPoints.length;
    const dx = width / (n - 1);

    // Top curve
    let topD = `M 0,${midY}`;
    for (let i = 0; i < n; i++) {
      const x = i * dx;
      const amp = Math.max(0.5, dataPoints[i] * (midY - 2));
      const y = midY - amp;
      topD += ` L ${x.toFixed(1)},${y.toFixed(1)}`;
    }
    topD += ` L ${width},${midY}`;

    // Bottom curve (mirrored)
    for (let i = n - 1; i >= 0; i--) {
      const x = i * dx;
      const amp = Math.max(0.5, dataPoints[i] * (midY - 2));
      const y = midY + amp;
      topD += ` L ${x.toFixed(1)},${y.toFixed(1)}`;
    }
    topD += " Z";

    return topD;
  }, [dataPoints, width, height, midY]);

  // Unique clip-path ID
  const clipId = useMemo(
    () => `wf-clip-${Math.random().toString(36).substring(2, 9)}`,
    []
  );

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex h-12 w-full cursor-pointer select-none items-center group/wf"
      title={isCurrent ? "Click to seek" : "Click to audition waveform"}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
    >
      {/* Background center timeline hairline (subtle 1px line across full width) */}
      <div className="absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2 bg-neutral-200 dark:bg-neutral-800 pointer-events-none" />

      {/* SVG Waveform Silhouette */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-full w-full overflow-hidden"
      >
        <defs>
          {/* Progress clip */}
          <clipPath id={clipId}>
            <rect x="0" y="0" width={`${progress * width}`} height={height} />
          </clipPath>
        </defs>

        {/* Base Unplayed Waveform - Slate/charcoal gray from reference screenshot */}
        <path
          d={envelopePaths}
          className="fill-[#525252] transition-colors duration-150 group-hover/wf:fill-[#3f3f46] dark:fill-[#808080] dark:group-hover/wf:fill-[#a0a0a0]"
        />

        {/* Active Played Waveform Progress - Solid black (or white in dark mode) */}
        {isCurrent && (
          <path
            d={envelopePaths}
            clipPath={`url(#${clipId})`}
            className="fill-black dark:fill-white transition-all duration-75"
          />
        )}
      </svg>

      {/* Live Playhead Scrubber Line when active */}
      {isCurrent && progress > 0 && (
        <div
          className="absolute top-1.5 bottom-1.5 w-[2px] bg-black dark:bg-white rounded-full pointer-events-none shadow-xs"
          style={{ left: `${progress * 100}%` }}
        />
      )}

      {/* Hover position indicator hairline */}
      {hoverPercent !== null && (
        <div
          className="absolute top-1.5 bottom-1.5 w-[1px] bg-black/50 dark:bg-white/60 pointer-events-none"
          style={{ left: `${hoverPercent * 100}%` }}
        />
      )}
    </div>
  );
}
