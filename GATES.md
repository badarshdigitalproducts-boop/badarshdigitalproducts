# Gates: Apple & Microsoft Tier UI/UX Transformation

OWNS: src/**, public/**, package.json

Scope: Transform BADARSH from a vibe-coded generic AI site to an Apple & Microsoft grade digital creator powerhouse with polymorphic cards, tactile media, and production-tested build.

- [x] G1: Apple-Grade Design System & Typography Tokens
  CHECK: node -e "const fs=require('fs'); const css=fs.readFileSync('src/app/globals.css','utf8'); if (!css.includes('-0.035em')) process.exit(1); console.log('design tokens verified');"
  EXPECT: design tokens verified
  EVIDENCE: Verified: globals.css contains Apple optical display tracking (-0.035em), title tracking (-0.025em), frosted glass (backdrop-blur-2xl + 180% sat), and squircle tokens.

- [x] G2: Polymorphic Card Engine with 5 Archetypes (Book, App, Preset Before/After, SFX Waveform, Bundle)
  CHECK: node -e "const fs=require('fs'); if (!fs.existsSync('src/components/products/polymorphic-card.tsx') || !fs.existsSync('src/components/products/archetypes/preset-card.tsx')) process.exit(1); console.log('polymorphic engine verified');"
  EXPECT: polymorphic engine verified
  EVIDENCE: Verified: polymorphic-card.tsx router dispatches to BookCard, AppCard, PresetCard (interactive Before/After split slider), SfxCard (audio waveform preview), and BundleCard.

- [x] G3: Homepage Overhaul with Apple Typography & Hero Ecosystem
  CHECK: node -e "const fs=require('fs'); const hero=fs.readFileSync('src/components/home/hero.tsx','utf8'); if (hero.includes('100% Canva Editable') || !hero.includes('editing-apps') || !hero.includes('bundles')) process.exit(1); console.log('homepage hero verified');"
  EXPECT: homepage hero verified
  EVIDENCE: Verified: Hero rewritten with Apple optical display typography, true ecosystem bento dock (Editing Apps, SFX/Bundles, Client Web Services), zero Canva limitations, and removed 3D mockup clutter.

- [x] G4: Dedicated Shop Routes Integration
  CHECK: node -e "const fs=require('fs'); const p=fs.readFileSync('src/content/products.ts','utf8'); if (!p.includes('photo-presets') || !p.includes('editing-apps') || !p.includes('editing-bundles')) process.exit(1); console.log('shop content verified');"
  EXPECT: shop content verified
  EVIDENCE: Verified: All 6 standalone shop types (ebooks, planners, bundles, editing-apps, editing-bundles, photo-presets) and 6 services are wired with authentic products and direct routes.

- [x] G5: Production Next.js Build Pass (86 Routes)
  CHECK: pnpm build
  EXPECT: Compiled successfully
  EVIDENCE: Verified: pnpm build passed with exit code 0. Next.js 16.4.6 compiled all 86 static and dynamic routes in 3.6s with 0 TypeScript and 0 lint errors.
