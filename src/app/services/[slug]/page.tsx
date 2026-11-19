import { notFound, redirect } from "next/navigation";
import { services } from "@/content/services";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: "website-building" },
    ...services.map((s) => ({ slug: s.slug })),
  ];
}

export default async function ServiceSlugPage({ params }: ServicePageProps) {
  const { slug } = await params;

  // Canonical redirects to dedicated service pages
  if (slug === "video-editing") redirect("/services/video-editing");
  if (slug === "photo-editing") redirect("/services/photo-editing");
  if (slug === "social-media-management") redirect("/services/social-media-management");
  if (slug === "website-design" || slug === "website-building") redirect("/services/website-design");
  if (slug === "app-development") redirect("/services/app-development");
  if (slug === "brand-identity") redirect("/services/brand-identity");

  // Fallback for custom admin-created services
  const service = services.find((s) => s.slug === slug);
  if (!service) {
    notFound();
  }

  // Redirect to services root if not matched
  redirect("/services");
}
