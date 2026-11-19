import { NextResponse } from "next/server";

// Comprehensive BADARSH Studio Knowledge System Prompt
const SYSTEM_PROMPT = `You are BADARSH AI, the official Executive Studio Concierge for BADARSH (badarsh.com) — a premier digital creator ecosystem and done-for-you creative production studio based in Bengaluru, India.

Your tone is confident, executive, articulate, and Apple-grade: concise, helpful, professional, and zero fluff. You never speak like a generic chatbot or cartoon robot.

### ABOUT BADARSH:
BADARSH is a dual-engine creative powerhouse:
1. **Digital Creator Store**: Master production assets, verified creator APKs, uncompressed SFX, 1-click Lightroom color grades, e-books, and planners.
2. **Done-For-You Production & Engineering Studio**: Senior designers and Next.js engineers building custom websites, mobile apps, video edits, and brand systems.

### COMPLETE DIGITAL STOREFRONT (ALL SEPARATE DEDICATED PAGES):
1. **All-in-One Mega Bundles** (/bundles):
   - Flagship: "2026 Video Editing Mega Bundle"
   - Includes 500+ uncompressed 24-bit WAV sound effects, 100 cinematic transitions, 50 LUTs, and 4K green screen & alpha VFX overlays.
   - Up to 60% savings compared to buying individual assets. Direct cloud drive delivery.

2. **Editing Apps (APKs)** (/editing-apps):
   - Verified Android video editing software packages (e.g., CapCut Pro APK).
   - VIP transitions unlocked, 4K 60fps export without watermark, AI cutout features enabled.
   - 100% safe, verified, direct cloud download links.

3. **Lightroom Presets** (/photo-presets):
   - 1-Click Adobe Lightroom Mobile (.DNG) and Desktop (.XMP) color grading packs.
   - Designed for moody cinematic tones, urban street, skin retouching, and commercial catalogs.

4. **Video SFX & Motion Overlays** (/editing-bundles):
   - 350+ master sound effects (whooshes, impacts, cinematic risers, textures).
   - 4K transparent alpha overlays, light leaks, and 1-click CapCut/Premiere video templates.

5. **Business E-Books** (/ebooks):
   - Actionable founder playbooks, organic growth blueprints, and monetization roadmaps.
   - Instant PDF download immediately after payment.

6. **Productivity Planners** (/planners):
   - Life operating systems, career milestone planners, gym workout splits, diet & nutrition logs, habit trackers.
   - Clean interactive PDF format.

7. **Canva Templates** (/templates):
   - Social media carousels, reels, pitch decks, client proposals.
   - 100% compatible with Canva Free (no Canva Pro subscription required).

### DONE-FOR-YOU PRODUCTION & ENGINEERING SERVICES:
1. **Website Design & Development** (/services/website-design):
   - High-performance custom Next.js 16 web applications built with TypeScript and Tailwind CSS.
   - Transparent, flexible pricing tiers:
     * Starter / Single-page Website: ₹3,000 to ₹6,000
     * Multi-page High-Growth Website (5 to 8 pages): ₹9,000 to ₹11,000
     * Enterprise / High-Scale Web Application (15 to 20 pages): ₹15,000+
   - Includes mobile responsiveness, SEO optimization, analytics, and direct WhatsApp founder collaboration.

2. **Mobile App Development** (/services/app-development):
   - Native cross-platform iOS & Android mobile applications with cloud backends.

3. **High-Retention Video Editing** (/services/video-editing):
   - Reels, Shorts, and long-form YouTube editing with dynamic sound design, hooks, and retention pacing.

4. **Photo Retouching** (/services/photo-editing):
   - Commercial catalog frequency separation, product photography cleanup, and color grading.

5. **Social Media Management** (/services/social-media-management):
   - End-to-end content calendar, visual assets, copywriting, and community growth.

6. **Brand Identity Design & Logos** (/services/brand-identity):
   - Custom vector logos, brand typography, color palettes, and comprehensive corporate identity systems.

### LICENSING & STORE GUARANTEES:
- **Commercial License Included**: Unlimited client and commercial use. Resale of raw source files is prohibited.
- **Instant Digital Delivery**: Files and access links appear immediately on screen post-checkout and are emailed as backup.
- **100% Replacement Guarantee**: If any link is broken, our team resolves or replaces it within 2–4 hours.
- **Support**: 24/7 on-site AI concierge and direct founder desk.

### BEHAVIOR RULES:
- Format responses cleanly with markdown (bolding, lists).
- Always include relevant site links in markdown format (e.g., [Explore 2026 Mega Bundles](/bundles), [Download CapCut Pro APK](/editing-apps), [View Website Packages](/services/website-design), [Read About Studio](/about)).
- Never output raw phone numbers in your text. Refer to our direct contact as "Direct WhatsApp Founder Desk" or link to our studio brief on /about.
- Keep answers concise, highly informative, and confident.`;

// Intelligent Built-in Fallback Knowledge Engine
function getFallbackResponse(query: string): string {
  const q = query.toLowerCase();

  // 1. Video bundle / SFX / 2026 vault
  if (q.includes("bundle") || q.includes("sfx") || q.includes("sound") || q.includes("vault") || q.includes("video edit")) {
    return `### 🎬 2026 Video Editing Mega Bundle & SFX Vault

Our flagship **2026 Video Mega Bundle** is engineered for high-retention editors, content creators, and agencies:

- **500+ Uncompressed 24-bit WAV SFX**: Whooshes, cinematic impacts, risers, and ambient drops.
- **100+ Pro Transitions & 50 LUTs**: Cinematic color profiles for Premiere, DaVinci Resolve, and Final Cut.
- **4K Motion Overlays**: Transparent alpha channel light leaks, film burns, and green screen elements.
- **Lifetime Cloud Access**: Immediate Google Drive download with lifetime updates.

👉 [**Explore All-in-One Mega Bundles**](/bundles)  
👉 [**Browse Video SFX & Motion Overlays**](/editing-bundles)`;
  }

  // 2. APK / CapCut Pro / Editing Apps
  if (q.includes("apk") || q.includes("capcut") || q.includes("app") || q.includes("download") || q.includes("mobile")) {
    return `### 📱 CapCut Pro & Creator APKs

We host verified, clean Android APKs built specifically for mobile video creators:

- **VIP Transitions & Effects**: Premium unlocked features without watermark.
- **4K 60fps Export**: Export in master high-bitrate quality.
- **AI Cutout & Auto Velocity**: Full suite of AI mobile tools enabled.
- **Safe & Verified**: Direct cloud download links tested across multiple devices.

👉 [**Enter Editing Apps (APKs) Store**](/editing-apps)`;
  }

  // 3. Presets / Lightroom
  if (q.includes("preset") || q.includes("lightroom") || q.includes("photo") || q.includes("color grade") || q.includes("dng") || q.includes("xmp")) {
    return `### 🎨 1-Click Lightroom Presets

Elevate your photography with our master Adobe Lightroom color grades:

- **Format**: Includes both **.DNG** (for Lightroom Mobile Free) and **.XMP** (for Lightroom Desktop).
- **Styles**: Moody urban, warm cinematic film, crisp portrait skin retouching, and clean catalog aesthetics.
- **1-Click Application**: Import into Lightroom and apply consistent color grading in under 5 seconds.

👉 [**Explore Lightroom Presets**](/photo-presets)  
👉 [**Need Commercial Photo Retouching?**](/services/photo-editing)`;
  }

  // 4. Website Development / Pricing
  if (q.includes("website") || q.includes("web dev") || q.includes("pricing") || q.includes("cost") || q.includes("develop") || q.includes("price")) {
    return `### 💻 Next.js Website Design & Development

We build ultra-fast, modern Next.js web applications tailored to your brand. Our transparent pricing structure:

- **Starter / Single-Page Website**: **₹3,000 – ₹6,000** (High-converting landing pages, portfolio, or local business hub).
- **Multi-Page Growth Website (5 to 8 Pages)**: **₹9,000 – ₹11,000** (Full digital store, service catalog, blog, and CMS).
- **Enterprise / Scalable Platform (15 to 20 Pages)**: **₹15,000+** (Complex custom web apps, client portals, and SEO powerhouses).

Every build includes full responsive design, mobile optimization, core Web Vitals 95+ score, and direct founder collaboration.

👉 [**View Website Packages & Tiers**](/services/website-design)  
👉 [**Explore All Studio Services**](/services)  
👉 [**Submit Executive Project Brief**](/about#contact)`;
  }

  // 5. Ebooks / Planners / Templates
  if (q.includes("ebook") || q.includes("planner") || q.includes("template") || q.includes("canva") || q.includes("book")) {
    return `### 📚 Digital Guides & Creative Blueprints

BADARSH provides ready-to-deploy operating systems for founders and creators:

- **Business E-Books** (/ebooks): Founder growth playbooks, organic social scaling, and monetization roadmaps. Instant PDF delivery.
- **Productivity Planners** (/planners): Milestone planners, gym workout splits, nutrition logs, and habit calendars in interactive PDF format.
- **Canva Templates** (/templates): Social carousels, reels, and client pitch decks. **100% compatible with Canva Free**.

👉 [**Browse Business E-Books**](/ebooks)  
👉 [**Browse Productivity Planners**](/planners)  
👉 [**Browse Canva Templates**](/templates)`;
  }

  // 6. License / Guarantee / Refund
  if (q.includes("license") || q.includes("commercial") || q.includes("refund") || q.includes("guarantee") || q.includes("rights")) {
    return `### 🛡️ Commercial Licensing & Guarantees

Every asset purchased from BADARSH comes with commercial confidence:

- **Full Commercial Client Rights**: You can customize and publish designs for yourself or paying freelance clients.
- **Instant Digital Delivery**: Direct download links appear on screen right after payment, plus an automated email backup copy.
- **100% Replacement Guarantee**: If you ever encounter a broken link or access issue, our team resolves or replaces it within 2–4 hours.

👉 [**Read Commercial License Terms**](/license)  
👉 [**Read Replacement & Refund Policy**](/refund-policy)`;
  }

  // 7. Contact / WhatsApp / Founder
  if (q.includes("contact") || q.includes("whatsapp") || q.includes("talk") || q.includes("hire") || q.includes("founder") || q.includes("team")) {
    return `### 🤝 Connect with BADARSH Studio

You collaborate directly with senior creators and software engineers — no junior account managers:

- **Executive Brief**: Submit your project requirements directly through our [**Executive Studio Desk**](/about#contact).
- **Direct WhatsApp Desk**: Available for instant project discussions and file sharing.
- **Average Response Time**: Under 15 minutes during business hours.

👉 [**Visit About & Executive Contact**](/about)`;
  }

  // Default General Welcome
  return `### Welcome to BADARSH Studio Intelligence

I am your 24/7 creative concierge, trained across our entire digital store and done-for-you production studio:

- **Digital Products**: [2026 Video Mega Bundle](/bundles), [CapCut Pro APKs](/editing-apps), [Lightroom Presets](/photo-presets), [SFX Overlays](/editing-bundles), [E-Books](/ebooks), and [Planners](/planners).
- **Agency Services**: [Next.js Websites (₹3k–₹15k)](/services/website-design), [App Development](/services/app-development), [Video Editing](/services/video-editing), and [Brand Logos](/services/brand-identity).
- **Guarantees**: Lifetime access, instant delivery, and full commercial client rights included.

What can I help you discover or build today?`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    const latestUserMessage = messages[messages.length - 1]?.content || "";
    const apiKey = process.env.KIE_API_KEY;

    // If API key is configured, attempt call to Kie.ai
    if (apiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6500); // 6.5s timeout

        const response = await fetch("https://api.kie.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-6.1-sol",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages.slice(-6), // Keep context window clean
            ],
            stream: false,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          // Verify valid completion response
          if (data.choices && data.choices[0]?.message?.content) {
            return NextResponse.json({
              reply: data.choices[0].message.content,
              source: "kie-ai",
            });
          }
        }
      } catch {
        // Silently catch network timeouts or API limits to seamlessly engage fallback engine
      }
    }

    // High-precision fallback knowledge engine (100% uptime guaranteed)
    const reply = getFallbackResponse(latestUserMessage);
    return NextResponse.json({
      reply,
      source: "badarsh-intelligence",
    });
  } catch (error) {
    console.error("Support agent error:", error);
    return NextResponse.json(
      {
        reply: getFallbackResponse(""),
        source: "badarsh-intelligence",
      },
      { status: 200 }
    );
  }
}
