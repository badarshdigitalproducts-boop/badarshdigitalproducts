import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Professional Event & Portrait Photography Services — Bengaluru & Across India",
  description:
    "Luxury event and portrait photography for weddings, birthdays, corporate conferences, and fashion model portfolios. Sony G-Master optics, same-day teaser delivery.",
  canonical: "/services/event-photography",
  keywords: [
    "wedding photography Bengaluru",
    "birthday photoshoot",
    "corporate event photographer",
    "model portfolio shoot",
    "event photographer India",
  ],
});

export default function EventPhotographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
