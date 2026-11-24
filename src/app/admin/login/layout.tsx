import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Founder Admin Access",
  description: "Secure administrative gateway for BADARSH.",
  canonical: "/admin/login",
  noIndex: true,
});

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
