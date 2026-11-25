import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE_URL } from "@/lib/constants";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "mb-6" }: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = [{ label: "Home", href: "/" }, ...items];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullItems.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      item:
        item.href === "/"
          ? SITE_URL
          : item.href.startsWith("http")
            ? item.href
            : `${SITE_URL}${item.href.startsWith("/") ? item.href : `/${item.href}`}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`flex flex-wrap items-center gap-1.5 text-xs text-muted ${className}`}
      >
        {fullItems.map((item, idx) => {
          const isLast = idx === fullItems.length - 1;
          return (
            <span key={`${item.href}-${idx}`} className="inline-flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />}
              {isLast ? (
                <span className="truncate font-medium text-foreground max-w-[260px] sm:max-w-md" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
