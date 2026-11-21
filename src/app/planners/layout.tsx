import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Digital Planners & Daily Systems — GoodNotes, Notion & Printable PDF",
  description:
    "Streamline your day with printable and digital planners. Content calendars, fitness trackers, meal planners, and client management spreadsheets.",
  canonical: "/planners",
  keywords: [
    "digital planners",
    "goodnotes planner",
    "content calendar planner",
    "fitness tracking pdf",
    "printable daily planner",
  ],
});

export default function PlannersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
