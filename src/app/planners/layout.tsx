import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Digital Planners for GoodNotes & Print",
  description:
    "Organize fitness, content calendars, habits, and client projects with interactive GoodNotes PDF planners and printable productivity systems by BADARSH.",
  image: "/api/og?title=Digital+Planners+%26+Systems&badge=GoodNotes+%26+Printable+PDF",
  canonical: "/planners",
});

export default function PlannersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
