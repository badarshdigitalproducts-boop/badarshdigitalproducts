import { Metadata } from "next";
import { SoundEffectsCatalog } from "@/components/audio/sound-effects-catalog";
import { constructMetadata, getBaseUrl } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Royalty-Free Sound Effects & Audio Library — 24-Bit Master WAV",
  description:
    "Explore and download royalty-free sound effects, whooshes, gaming hits, cartoon drops, and cinematic impacts. 24-bit 48kHz WAV audio for video creators, reels, and commercial edits.",
  canonical: "/sound-effects",
});

export default function SoundEffectsPage() {
  const baseUrl = getBaseUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "BADARSH Royalty-Free Sound Effects Library",
    description:
      "24-Bit / 48kHz uncompressed master sound effects for video creators, editors, and filmmakers.",
    url: `${baseUrl}/sound-effects`,
    publisher: {
      "@type": "Organization",
      name: "BADARSH Digital Products",
      url: baseUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
        {/* Simple, crisp title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            Royalty-Free Sound Effects
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Download 24-bit uncompressed WAV sound effects for videos, games, reels, and commercial projects.
          </p>
        </div>

        {/* Audio Catalog matching the user's reference UI */}
        <SoundEffectsCatalog />
      </div>
    </>
  );
}
