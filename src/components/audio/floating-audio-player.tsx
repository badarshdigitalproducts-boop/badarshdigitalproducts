"use client";

import React from "react";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, X, Download, Disc3, ArrowUpRight } from "lucide-react";
import { useAudioPlayer } from "@/context/audio-player-context";
import { useCurrency } from "@/context/currency-context";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function FloatingAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    closePlayer,
  } = useAudioPlayer();

  const { formatPrice } = useCurrency();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isFree = currentTrack.price === 0 || currentTrack.isFree;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background shadow-2xl transition-all duration-300">
      {/* Top Thin Progress Bar (Interactive) */}
      <div
        className="relative h-1.5 w-full bg-secondary cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickPos = (e.clientX - rect.left) / rect.width;
          seek(clickPos * duration);
        }}
      >
        <div
          className="h-full bg-accent transition-all duration-100 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progressPercent}% - 6px)` }}
        />
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 gap-4">
        {/* Track Metadata */}
        <div className="flex items-center gap-3 min-w-0 max-w-[280px] sm:max-w-xs">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-900 border border-card-border text-accent shadow-sm overflow-hidden">
            <Disc3 className={`h-5 w-5 ${isPlaying ? "animate-spin text-accent" : "text-muted"}`} />
            {isPlaying && (
              <div className="absolute inset-0 bg-accent/10 flex items-center justify-center gap-0.5 pointer-events-none">
                <span className="h-3 w-0.5 bg-accent animate-pulse" />
                <span className="h-4 w-0.5 bg-accent animate-pulse delay-75" />
                <span className="h-2 w-0.5 bg-accent animate-pulse delay-150" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="truncate text-xs font-bold text-foreground">
              {currentTrack.title}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              {currentTrack.category && (
                <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">
                  {currentTrack.category}
                </span>
              )}
              <span className="text-[10px] text-muted font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background shadow-md transition-transform hover:scale-105 active:scale-95"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Right Section: Volume & CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Volume Slider (Hidden on small mobile) */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-muted hover:text-foreground transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-foreground"
            />
          </div>

          {/* Download / Buy Button */}
          {isFree ? (
            <a
              href={currentTrack.audioUrl}
              download
              className="flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/30 px-3.5 py-1.5 text-xs font-semibold text-accent hover:bg-accent hover:text-white transition-all active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Free Download</span>
              <span className="sm:hidden">Free</span>
            </a>
          ) : (
            <Link
              href={currentTrack.slug ? `/templates/${currentTrack.slug}` : "/sound-effects"}
              className="flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background hover:opacity-90 transition-opacity active:scale-95"
            >
              <span>{formatPrice(currentTrack.price)}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          )}

          {/* Close Player */}
          <button
            onClick={closePlayer}
            className="rounded-full p-1.5 text-muted hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Close Player"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
