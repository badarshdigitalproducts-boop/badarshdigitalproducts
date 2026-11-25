import { Metadata } from "next";
import { SoundEffectsCatalog } from "@/components/audio/sound-effects-catalog";
import { constructMetadata, SITE_URL } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const metadata: Metadata = constructMetadata({
  title: "24-Bit WAV Sound Effects & Audio Packs",
  description:
    "Browse 24-bit 48kHz WAV sound effects: whooshes, cinema impacts, UI transitions, and ambient beds. Instant digital delivery with full commercial licensing.",
  image: "/api/og?title=24-Bit+WAV+Sound+Effects&badge=Audio+%26+SFX+Vault",
  canonical: "/sound-effects",
});

export default function SoundEffectsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "BADARSH Royalty-Free Sound Effects Library",
    description:
      "24-Bit / 48kHz uncompressed master sound effects for video creators, editors, and filmmakers.",
    url: `${SITE_URL}/sound-effects`,
    publisher: {
      "@type": "Organization",
      name: "BADARSH Digital Products",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
        <Breadcrumbs items={[{ label: "Sound Effects", href: "/sound-effects" }]} />
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
