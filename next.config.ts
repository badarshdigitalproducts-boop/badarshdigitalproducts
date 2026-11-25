import type { NextConfig } from "next";

const securityHeaders = [
  // 1. Force HTTPS via HSTS (Strict-Transport-Security for 2 years)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // 2. Anti-Clickjacking: Allow same-origin framing (e.g. for PDF previews and modals) while blocking external framing
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // 3. Anti-MIME Sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // 4. Referrer Policy: Send full referrer on same-origin, domain-only cross-origin
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // 5. Restrict device hardware permissions
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(self)",
  },
  // 6. DNS Prefetching control
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // 7. Content Security Policy (CSP)
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseapp.com https://*.googleapis.com https://accounts.google.com https://apis.google.com https://sdk.cashfree.com https://payments.cashfree.com https://sandbox.cashfree.com https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https: https://images.unsplash.com https://*.firebasestorage.app https://lh3.googleusercontent.com",
      "media-src 'self' data: blob: https: https://*.cloudflarestorage.com",
      "connect-src 'self' https://*.firebaseapp.com https://*.firebaseio.com https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://accounts.google.com https://*.cloudflarestorage.com https://*.r2.cloudflarestorage.com https://sdk.cashfree.com https://payments.cashfree.com https://sandbox.cashfree.com https://api.cashfree.com https://challenges.cloudflare.com",
      "frame-src 'self' blob: data: https://*.firebaseapp.com https://accounts.google.com https://sdk.cashfree.com https://payments.cashfree.com https://sandbox.cashfree.com https://api.cashfree.com https://challenges.cloudflare.com https://docs.google.com https://drive.google.com https://www.youtube-nocookie.com https://www.youtube.com",
      "frame-ancestors 'self'",
      "object-src 'self' blob: data:",
      "base-uri 'self'",
      "form-action 'self' https://accounts.google.com https://sdk.cashfree.com https://payments.cashfree.com https://sandbox.cashfree.com https://api.cashfree.com",
    ].join("; "),
  },
  // 8. Allow Firebase Google OAuth popup opener communication while isolating unrelated origins
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
];

const nextConfig: NextConfig = {
  serverExternalPackages: ["@aws-sdk/client-s3", "@aws-sdk/s3-request-presigner"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "covers.openlibrary.org" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "*.firebasestorage.app" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "badarsh.com" }],
        destination: "https://www.badarsh.com/:path*",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/editing-bundles",
        destination: "/sound-effects",
        permanent: true,
      },
      {
        source: "/apps",
        destination: "/editing-apps",
        permanent: true,
      },
      {
        source: "/presets",
        destination: "/photo-presets",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/services/website-design",
        destination: "/services/website-building",
        permanent: true,
      },
      {
        source: "/templates/capcut-pro-unlocked-editor",
        destination: "/editing-apps",
        permanent: true,
      },
      {
        source: "/editing-apps/capcut-pro-unlocked-editor",
        destination: "/editing-apps",
        permanent: true,
      },
      {
        source: "/ebooks/the-psychology-of-money",
        destination: "/ebooks",
        permanent: true,
      },
      {
        source: "/templates/the-psychology-of-money",
        destination: "/ebooks",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
