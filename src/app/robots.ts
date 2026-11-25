import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  const disallowed = [
    "/login",
    "/signup",
    "/cart",
    "/checkout",
    "/account",
    "/account/",
    "/orders/",
    "/admin",
    "/admin/",
    "/unsubscribe",
    "/api/",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...disallowed, "/_next/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: disallowed,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: disallowed,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
