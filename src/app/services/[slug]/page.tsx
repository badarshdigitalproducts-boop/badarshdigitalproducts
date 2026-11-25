import { notFound, redirect } from "next/navigation";
import { services as staticServices } from "@/content/services";
import { getAdminServices } from "@/lib/admin/store";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: "website-building" },
    ...staticServices.map((s) => ({ slug: s.slug })),
  ];
}

export default async function ServiceSlugPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();

  // Canonical redirects to dedicated service pages
  if (decodedSlug === "video-editing") redirect("/services/video-editing");
  if (decodedSlug === "photo-editing") redirect("/services/photo-editing");
  if (decodedSlug === "social-media-management") redirect("/services/social-media-management");
  if (decodedSlug === "website-design" || decodedSlug === "website-building") redirect("/services/website-building");
  if (decodedSlug === "app-development") redirect("/services/app-development");
  if (decodedSlug === "brand-identity" || decodedSlug === "logo-design") redirect("/services/brand-identity");

  // Check dynamic services from admin store
  try {
    const adminServices = await getAdminServices();
    const dynamicService = adminServices.find(
      (s) => s.slug?.toLowerCase() === decodedSlug || s.id === slug
    );
    if (dynamicService) {
      redirect(`/services?service=${encodeURIComponent(dynamicService.slug)}`);
    }
  } catch (err) {
    console.warn("Service dynamic lookup error:", err);
  }

  // Fallback for custom static services
  const service = staticServices.find(
    (s) => s.slug?.toLowerCase() === decodedSlug || s.id === slug
  );
  if (service) {
    redirect("/services");
  }

  redirect("/services");
}
