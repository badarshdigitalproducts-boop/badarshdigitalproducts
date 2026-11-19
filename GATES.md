# Gates: Remove Contact Page & Build Executive Apple-Grade About Page

OWNS: src/app/about/**, src/app/contact/**, src/components/layout/**, next.config.ts, src/app/sitemap.ts

Scope: Completely remove standalone contact page, route all contact links to executive About page with permanent redirects, and rebuild About page with Apple-grade craftsmanship, studio pillars, and integrated contact channels.

- [x] G1: Contact Page Completely Removed & Redirected
  CHECK: node -e "const fs=require('fs'); if (fs.existsSync('src/app/contact/page.tsx')) process.exit(1); const cfg=fs.readFileSync('next.config.ts','utf8'); if (!cfg.includes('/contact') || !cfg.includes('/about')) process.exit(1); console.log('contact removal and redirect verified');"
  EXPECT: contact removal and redirect verified
  EVIDENCE: Verified: src/app/contact/page.tsx deleted; next.config.ts configured with permanent redirect: source /contact -> destination /about.

- [x] G2: Navigation Cleaned of /contact
  CHECK: node -e "const fs=require('fs'); const nav=fs.readFileSync('src/components/layout/navbar.tsx','utf8'); const mob=fs.readFileSync('src/components/layout/mobile-nav.tsx','utf8'); if (nav.includes('/contact') || mob.includes('/contact')) { process.exit(1); } console.log('nav clean verified');"
  EXPECT: nav clean verified
  EVIDENCE: Verified: Navbar and mobile navigation updated to direct clean links (Blog, About) without any /contact entries. Footer updated to link to /about#contact.

- [x] G3: Executive Apple-Grade About Page with Direct Channels
  CHECK: node -e "const fs=require('fs'); const about=fs.readFileSync('src/app/about/page.tsx','utf8'); if (!about.includes('apple-display') || !about.includes('WHATSAPP_DISPLAY') || about.includes('href=\x22/contact\x22')) { process.exit(1); } console.log('about page verified');"
  EXPECT: about page verified
  EVIDENCE: Verified: About page rewritten with Apple optical display typography, 4 ecosystem pillars, verified performance metrics, and an integrated direct communication suite (WhatsApp desk + CRM executive dispatch form).

- [x] G4: Production Next.js Build Pass
  CHECK: pnpm build
  EXPECT: Compiled successfully
  EVIDENCE: Verified: pnpm build passed with exit code 0. Next.js 16.4.6 compiled all 85 static and dynamic routes with zero TypeScript or lint errors.
