import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Order Confirmation & Downloads",
  description: "Access your verified digital purchases, commercial license keys, and instant downloads.",
  noIndex: true,
});

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
