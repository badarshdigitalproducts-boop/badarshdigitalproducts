import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/contact",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/ebooks/:slug",
        destination: "/templates/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
