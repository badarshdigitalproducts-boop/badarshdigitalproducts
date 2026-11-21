import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Best-Selling Business & Growth E-Books — Read Online & Instant PDF",
  description:
    "Read in-browser and download digital business, finance, and productivity e-books including Rich Dad Poor Dad, Atomic Habits, and The Psychology of Money.",
  canonical: "/ebooks",
  keywords: [
    "business ebooks",
    "growth playbooks",
    "rich dad poor dad pdf",
    "atomic habits pdf",
    "finance books online",
    "entrepreneurship guides",
  ],
});

export default function EbooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
