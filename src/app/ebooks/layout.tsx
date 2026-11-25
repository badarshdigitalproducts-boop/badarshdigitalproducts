import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Digital Growth Playbooks & Creator E-Books",
  description:
    "Read online and download creator playbooks, marketing frameworks, and digital business e-books built for founders and editors. Instant PDF access anytime.",
  image: "/api/og?title=Creator+Playbooks+%26+E-Books&badge=Instant+Digital+PDFs",
  canonical: "/ebooks",
});

export default function EbooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
