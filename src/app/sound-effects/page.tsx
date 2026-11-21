import { Metadata } from "next";
import { SoundEffectsCatalog } from "@/components/audio/sound-effects-catalog";
import { Music, CheckCircle2, ShieldCheck, Download, Sparkles } from "lucide-react";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Sound Effects & Audio Library — 24-Bit Royalty-Free SFX",
  description:
    "Explore and download royalty-free sound effects, whooshes, gaming hits, cartoon drops, and cinematic impacts. 24-bit 48kHz WAV audio for video creators, reels, and commercial edits.",
  canonical: "/sound-effects",
});

export default function SoundEffectsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "BADARSH Sound Effects & Audio Vault",
    description:
      "24-Bit / 48kHz uncompressed master sound effects for video creators, editors, and filmmakers.",
    url: "https://badarshdigitalproducts.vercel.app/sound-effects",
    publisher: {
      "@type": "Organization",
      name: "BADARSH Digital Products",
      url: "https://badarshdigitalproducts.vercel.app",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 md:py-16">
        {/* Header Hero */}
        <div className="max-w-3xl mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1 text-xs font-semibold text-foreground shadow-2xs">
            <Music className="h-3.5 w-3.5 text-accent" />
            BADARSH Audio Library
          </span>
          <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Sound Effects &amp; Audio Library
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted">
            Instant live waveform previews, uncompressed 24-bit 48kHz WAV downloads, and 100% royalty-free commercial licenses. Filter by category, audition with zero latency, and drop straight into your timeline.
          </p>

          {/* Quick Specs Badges */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground shadow-2xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>24-Bit / 48kHz WAV</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Royalty-Free Commercial License</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Premiere &bull; CapCut &bull; DaVinci Ready</span>
            </div>
          </div>
        </div>

        {/* Audio Catalog Component */}
        <SoundEffectsCatalog />
      </div>
    </>
  );
}
