import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Unsubscribe from Newsletter",
  description: "Manage your email communication preferences on BADARSH.",
  canonical: "/unsubscribe",
  noIndex: true,
});

export default function UnsubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
