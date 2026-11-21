import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "iOS & Android Mobile App Development Services",
  description:
    "Turn your product vision into reality with cross-platform Flutter and React Native mobile app development. Fast, reliable, and scalable.",
  canonical: "/services/app-development",
  keywords: [
    "mobile app development",
    "ios app developers",
    "android app agency",
    "react native development",
    "flutter app developers India",
  ],
});

export default function AppDevelopmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
