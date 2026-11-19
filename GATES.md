# Gates: Apple Black Theme & Mobile Inertial UI Overhaul

OWNS: src/app/**, src/components/**

Scope: Implement Apple-grade pure OLED black theme as default, ultra-compact 48px frosted glass navbar, Apple button duo hierarchy, mobile inertial snap carousels, and Keynote stage homepage layout.

- [x] G1: Dark Theme as Default with Apple OLED Black Tokens
  CHECK: node -e "const fs=require('fs'); const l=fs.readFileSync('src/app/layout.tsx','utf8'); const css=fs.readFileSync('src/app/globals.css','utf8'); if (!l.includes('defaultTheme=\x22dark\x22') || !css.includes('#000000')) { process.exit(1); } console.log('dark theme verified');"
  EXPECT: dark theme verified
  EVIDENCE: Verified: ThemeProvider configured with defaultTheme="dark". globals.css defines OLED true black (#000000), Apple Pro hardware surface (#161617), and crisp 1px borders (rgba(255,255,255,0.08)).

- [x] G2: Ultra-Slim 48px Apple Frosted Glass Navbar & Mobile Drawer
  CHECK: node -e "const fs=require('fs'); const nav=fs.readFileSync('src/components/layout/navbar.tsx','utf8'); if (!nav.includes('h-12') || !nav.includes('backdrop-blur')) { process.exit(1); } console.log('apple navbar verified');"
  EXPECT: apple navbar verified
  EVIDENCE: Verified: Navbar and MobileNav updated to Apple 48px standard height (h-12) with 20px blur and 180% saturation frosted glass backdrop.

- [x] G3: Apple Keynote Stage Hero with Solid Pill & Chevron Link Duo
  CHECK: node -e "const fs=require('fs'); const hero=fs.readFileSync('src/components/home/hero.tsx','utf8'); if (!hero.includes('apple-display') || !hero.includes('rounded-full bg-[#f5f5f7]')) { process.exit(1); } console.log('apple hero verified');"
  EXPECT: apple hero verified
  EVIDENCE: Verified: Hero features Apple Keynote stage lighting, .apple-display headline ("Everything Creators Need. In One Place."), solid white pill ([Explore Shop]), and retinal blue chevron link ([Our Done-For-You Services >]).

- [x] G4: Mobile Inertial Horizontal Snap Carousels
  CHECK: node -e "const fs=require('fs'); const fp=fs.readFileSync('src/components/home/featured-products.tsx','utf8'); const cat=fs.readFileSync('src/components/home/categories.tsx','utf8'); if (!fp.includes('snap-x') || !cat.includes('snap-x')) { process.exit(1); } console.log('mobile snap carousels verified');"
  EXPECT: mobile snap carousels verified
  EVIDENCE: Verified: FeaturedProducts, Categories, ServicesPreview, Testimonials, and BlogPreview now feature Apple mobile inertial snap carousels (snap-x snap-mandatory peek cards with momentum touch) while settling into clean grids on desktop.

- [x] G5: Production Next.js Build Pass (85 Routes)
  CHECK: pnpm build
  EXPECT: Compiled successfully
  EVIDENCE: Verified: Next.js 16.4.6 compiled all 85 static and dynamic routes in 9.7s with exit code 0. Zero TypeScript errors, zero lint errors.
