import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { buildServiceSchemas } from "@/lib/seo-schema";

export const metadata: Metadata = constructMetadata({
  title: "Video Editing Services in Bengaluru, from ₹250 per Video | BADARSH",
  description:
    "Hire dedicated video editors in Bengaluru from ₹250 per video. Fast 24-48 hour turnaround on Reels, YouTube Shorts, podcasts, sound design, and color grading.",
  image: "/api/og?title=Video+Editing+Services&badge=From+INR+250+per+Video",
  canonical: "/services/video-editing",
});

const { professionalServiceJsonLd, serviceJsonLd } = buildServiceSchemas({
  name: "Video Editing Services in Bengaluru",
  description:
    "High-retention vertical Reels, YouTube Shorts, sound design, captions, and cinematic color grading delivered in 24-48 hours.",
  urlPath: "/services/video-editing",
  serviceType: "Video Editing Service",
  offers: [
    { name: "Standard Reel / Short Cut", price: 250, description: "1 to 30 sec tight edit with B-roll & audio" },
    { name: "Motion Graphics High-Retention Edit", price: 400, description: "3D tracking, bespoke sound effects & color grade" },
    { name: "Monthly Creator Editing Retainer", price: 7999, description: "Dedicated editing sprint package" },
  ],
});

export default function VideoEditingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {children}
    </>
  );
}
