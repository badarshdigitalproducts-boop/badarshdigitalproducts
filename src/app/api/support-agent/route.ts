import { NextResponse } from "next/server";

// Comprehensive BADARSH System Knowledge for Kie.ai LLM
const SYSTEM_PROMPT = `You are the BADARSH Studio AI Concierge (badarsh.com).
BADARSH is a premier digital creator ecosystem and creative agency based in Bengaluru, India.
Your personality: Apple-caliber elegance, concise (2-4 sentences max unless detailed breakdown requested), helpful, human, confident, zero marketing fluff, and zero robotic cliché.

Key knowledge:
- 2026 Video Mega Bundle & SFX (/bundles): 500+ master 24-bit WAV sound effects, 100 transitions, 50 LUTs, 4K alpha VFX overlays.
- CapCut Pro Mobile (/editing-apps): Verified creator mobile app, watermark-free, VIP transitions, 4K 60fps export, AI cutout unlocked. Direct safe download.
- Lightroom Presets (/photo-presets): 1-click .DNG (Free Lightroom Mobile) and .XMP (Desktop) cinematic color grades.
- Video SFX & Motion Overlays (/editing-bundles): 350+ master sounds, 4K transparent alpha overlays.
- Next.js Web Development (/services/website-design): Starter ₹3k–₹6k, Growth 5-8 pages ₹9k–₹11k, Scalable 15-20+ pages ₹15k+. High performance, mobile-first, SEO included.
- Other Services: Mobile Apps (/services/app-development), Video Editing (/services/video-editing), Photo Retouching (/services/photo-editing), Brand Logos (/services/brand-identity).
- Business E-Books (/ebooks) & Productivity Planners (/planners): Instant PDF download.
- Design Templates (/templates): In-house proprietary ready-to-edit templates for social media, carousels, and pitch decks. We design everything in-house. Never mention Canva.
- Licensing: Full commercial client rights included. Reselling raw assets prohibited.
- Delivery: Instant on screen + email backup. 100% replacement guarantee.
- Rules: Never mention raw phone numbers. Do not mention WhatsApp. Link to pages using markdown [Page Name](/path). Answer the user's specific problem directly.`;

// Conversational Problem-Solving Intelligence Engine
function generateIntelligentResponse(userMessage: string, history: Array<{ role: string; content: string }>): string {
  const query = userMessage.trim().toLowerCase();

  // 1. Casual Greetings & Persona
  if (/^(hi|hello|hey|hola|namaste|good\s*(morning|afternoon|evening)|sup|yo)\b/i.test(query) || query === "hi" || query === "hello") {
    return "Hey there! Welcome to BADARSH. I'm your Studio Concierge. Whether you're looking for our 2026 creator tools, verified editing apps, or custom website engineering, I'm here to help. What are you working on today?";
  }

  if (query.includes("who are you") || query.includes("what can you do") || query.includes("your name")) {
    return "I am the BADARSH Studio Concierge — your 24/7 intelligent guide to our digital tools, video assets, Lightroom presets, and custom Next.js development services. Ask me anything about our software, pricing, or custom projects!";
  }

  // 2. CapCut Pro & Editing Apps
  if (query.includes("capcut") || query.includes("editing app") || (query.includes("editing") && query.includes("app"))) {
    if (query.includes("safe") || query.includes("virus") || query.includes("malware") || query.includes("secure")) {
      return "Yes, 100% safe. Every mobile app hosted in our [Editing Apps Store](/editing-apps) is scanned, clean, and tested across multiple device versions. No spyware or sketchy redirects — just clean direct downloads.";
    }
    if (query.includes("watermark") || query.includes("4k") || query.includes("vip") || query.includes("feature") || query.includes("pro")) {
      return "Our CapCut Pro Mobile app unlocks all VIP features: watermark-free exports, 4K at 60fps, unlocked curves and velocity graphs, and full AI cutout capabilities. You can get it directly on our [Editing Apps Store](/editing-apps).";
    }
    return "We host verified mobile editing tools, including **CapCut Pro Mobile** with all VIP transitions, curves, and 4K export unlocked without watermarks. Download it directly from our [Editing Apps Store](/editing-apps).";
  }

  // 3. Website Design & Development Pricing & Stack
  if (query.includes("web") || query.includes("site") || query.includes("development") || query.includes("dev") || query.includes("build my site")) {
    if (query.includes("price") || query.includes("cost") || query.includes("rate") || query.includes("pricing") || query.includes("how much")) {
      return `Our custom Next.js 16 website development has 3 straightforward tiers:

• **Starter / Single-Page**: **₹3,000 – ₹6,000** (Portfolios, landing pages, creator stores)
• **Multi-Page Growth (5–8 Pages)**: **₹9,000 – ₹11,000** (Full brand website, service catalog, CMS)
• **Enterprise Platform (15–20+ Pages)**: **₹15,000+** (Complex custom web applications)

Every project is built for speed (95+ Google Web Vitals), fully responsive, and SEO-ready. Check out packages on our [Website Design Page](/services/website-design) or [submit your brief here](/about#contact).`;
    }
    if (query.includes("tech") || query.includes("stack") || query.includes("framework") || query.includes("next")) {
      return "We build with Next.js 16, TypeScript, Tailwind CSS, and Framer Motion. Your website gets sub-second load times, dynamic caching, and mobile-first responsiveness. View our [Website Development Services](/services/website-design).";
    }
    return "We design and engineer bespoke, ultra-fast Next.js websites starting from ₹3,000 for single pages up to ₹15,000+ for large multi-page platforms. Explore our [Website Design Service](/services/website-design) or [submit your project brief](/about#contact).";
  }

  // 4. 2026 Video Mega Bundle & SFX
  if (query.includes("bundle") || query.includes("sfx") || query.includes("sound") || query.includes("vault") || query.includes("transition") || query.includes("lut")) {
    if (query.includes("format") || query.includes("wav") || query.includes("software") || query.includes("premiere") || query.includes("davinci") || query.includes("compatible")) {
      return "All SFX are delivered in uncompressed 24-bit master WAV format, compatible with Premiere Pro, DaVinci Resolve, Final Cut, and CapCut. The LUTs come in standard .cube format. Explore the [2026 Video Mega Bundle](/bundles).";
    }
    return `The **2026 Video Mega Bundle** is our flagship production vault containing:

• **500+ Uncompressed 24-bit WAV SFX** (Whooshes, cinematic impacts, risers)
• **100+ High-Retention Transitions & 50 Cinematic LUTs**
• **4K Alpha Overlays & Green Screen Elements**

You get instant Google Drive cloud access with lifetime updates. Check it out on our [Bundles Store](/bundles).`;
  }

  // 5. Lightroom Presets
  if (query.includes("preset") || query.includes("lightroom") || query.includes("filter") || query.includes("color grade") || query.includes("dng") || query.includes("xmp")) {
    if (query.includes("free") || query.includes("mobile") || query.includes("how to use") || query.includes("install")) {
      return "Our Lightroom presets include **.DNG** files, which work 100% free in the Lightroom Mobile app without any paid Adobe subscription! Desktop users also get **.XMP** files for 1-click styling in Lightroom Classic. Browse our [Lightroom Presets](/photo-presets).";
    }
    return "Our Lightroom Preset packs provide 1-click cinematic color grades for portraits, street photography, and commercial catalogs. They include both mobile .DNG and desktop .XMP formats. Explore [Lightroom Presets](/photo-presets).";
  }

  // 6. Design Templates
  if (query.includes("template") || query.includes("carousel") || query.includes("deck") || query.includes("presentation") || query.includes("canva")) {
    return "All our [Design Templates](/templates) are designed in-house by BADARSH for high engagement — including social carousels, reels, client pitch decks, and commercial brand collateral. They are 100% ready to edit and customize with zero expensive software or subscriptions needed. View the full [Templates Collection](/templates).";
  }

  // 7. E-books & Productivity Planners
  if (query.includes("ebook") || query.includes("book") || query.includes("planner") || query.includes("diet") || query.includes("gym") || query.includes("routine")) {
    return "We offer actionable [Business E-Books](/ebooks) on organic growth and monetization, as well as interactive [Productivity Planners](/planners) for career goals, gym workout splits, and habit tracking. Delivered in clean, instant-download PDF format.";
  }

  // 8. Commercial Licensing & Rights
  if (query.includes("license") || query.includes("commercial") || query.includes("client") || query.includes("resell") || query.includes("rights")) {
    return "Every digital asset purchased on BADARSH includes full **Commercial Client Rights**. You can use them on unlimited projects for yourself and your paying freelance or agency clients. The only restriction is you cannot resell the raw source files. Learn more on our [License Page](/license).";
  }

  // 9. Delivery & Refund Policy
  if (query.includes("delivery") || query.includes("download") || query.includes("refund") || query.includes("guarantee") || query.includes("broken")) {
    return "All digital purchases are delivered instantly on your screen right after checkout, plus a backup link sent to your email. If you ever face a broken link, our team fixes or replaces it within 2–4 hours with our 100% replacement guarantee. Read our [Refund Policy](/refund-policy).";
  }

  // 10. Direct Hiring / Custom Quote / Contact
  if (query.includes("hire") || query.includes("quote") || query.includes("contact") || query.includes("call") || query.includes("talk") || query.includes("founder")) {
    return "You can share your project scope directly with our team! Head over to our [Executive Studio Desk on the About page](/about#contact) and submit your project brief — our founders review new briefs within 15 minutes.";
  }

  // 11. Other Services (App Dev, Video Editing, Logo)
  if (query.includes("app") || query.includes("ios") || query.includes("android")) {
    return "We develop native cross-platform iOS and Android apps with scalable cloud backends and clean UI. Tell us what you're building on our [App Development Service Page](/services/app-development).";
  }

  if (query.includes("logo") || query.includes("brand") || query.includes("identity")) {
    return "Our branding team designs custom vector logos, typography systems, and brand style guides tailored to help you scale. Explore our [Brand Identity Design Service](/services/brand-identity).";
  }

  // Contextual fallback based on previous messages
  const lastUserMessages = history.filter((m) => m.role === "user");
  if (lastUserMessages.length > 1) {
    return "Got it! To give you the exact details: are you looking to purchase digital assets (like our [Video Bundles](/bundles) or [CapCut Pro Mobile](/editing-apps)), or are you interested in custom [Website Development](/services/website-design)? Let me know and I'll guide you directly!";
  }

  return "I'm here to help! You can ask me about our [2026 Video Mega Bundle](/bundles), [CapCut Pro Mobile](/editing-apps), [1-Click Lightroom Presets](/photo-presets), or [Custom Next.js Website Pricing](/services/website-design). What would you like to explore?";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required." }, { status: 400 });
    }

    const latestUserMessage = messages[messages.length - 1]?.content || "";
    const apiKey = process.env.KIE_API_KEY;

    // If Kie.ai API key is present, attempt live LLM call
    if (apiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5s fast timeout

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
              ...messages.slice(-5),
            ],
            stream: false,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data.choices && data.choices[0]?.message?.content) {
            return NextResponse.json({
              reply: data.choices[0].message.content,
              source: "kie-ai",
            });
          }
        }
      } catch {
        // Fall through to the intelligent conversational engine
      }
    }

    // Dynamic, context-aware reasoning engine
    const reply = generateIntelligentResponse(latestUserMessage, messages);
    return NextResponse.json({
      reply,
      source: "badarsh-intelligence",
    });
  } catch (error) {
    console.error("Support agent error:", error);
    return NextResponse.json(
      {
        reply: "I'm here to help! Ask me about our [2026 Video Bundles](/bundles), [CapCut Pro Mobile](/editing-apps), [Presets](/photo-presets), or [Web Development (₹3k–₹15k)](/services/website-design).",
        source: "badarsh-intelligence",
      },
      { status: 200 }
    );
  }
}
