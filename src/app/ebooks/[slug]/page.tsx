import { redirect } from "next/navigation";

interface EbookSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EbookSlugPage({ params }: EbookSlugPageProps) {
  const { slug } = await params;
  redirect(`/templates/${slug}`);
}

