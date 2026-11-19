import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "svc-001",
    slug: "video-editing",
    title: "Video Editing",
    description:
      "Professional video editing for YouTube, Instagram Reels, ads, and brand content. From raw footage to polished, scroll-stopping videos.",
    longDescription:
      "Transform your raw footage into cinematic content that captivates your audience. Our video editing service covers everything from YouTube long-form to Instagram Reels and ad creatives. We handle color grading, motion graphics, subtitles, sound design, and transitions — all tailored to your brand's aesthetic and platform requirements. Whether you're a creator, coach, or business, we'll make your videos look like they were produced by a top-tier studio.",
    icon: "Video",
    portfolioVideos: [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    ],
    portfolioImages: [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80",
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&q=80",
      "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=1200&q=80",
    ],
    features: [
      "Professional color grading & cinematic LUTs",
      "High-retention motion graphics & text animations",
      "Synchronized subtitles & caption integration (Hormozi style)",
      "Royalty-free audio mastering & sound effects (SFX)",
      "Multi-platform aspect ratios (9:16 Reels, 16:9 YouTube, 4:5 Feed)",
      "Custom high-CTR thumbnail design included",
      "Unlimited revisions until 100% satisfied",
      "Fast 24 to 48-hour delivery turnaround",
    ],
    packages: [
      {
        name: "Basic Reels / Shorts",
        price: 1499,
        currency: "INR",
        period: "per video",
        description:
          "Perfect for short-form content (Reels, TikTok & YouTube Shorts up to 60s).",
        features: [
          "Up to 60 seconds duration",
          "Dynamic cuts, zooms & pacing",
          "Sound effects & background music",
          "Animated word-by-word captions",
          "1 revision round",
          "Delivery in 2 business days",
        ],
        isPopular: false,
        ctaText: "Get Started",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the Basic Reels/Shorts Video Editing package (₹1,499/video). Can we discuss my project?",
      },
      {
        name: "Standard YouTube & Ads",
        price: 3999,
        currency: "INR",
        period: "per video",
        description:
          "Ideal for YouTube long-form videos, high-converting product ads, and brand explainers.",
        features: [
          "Up to 10 minutes duration",
          "Advanced motion graphics & lower thirds",
          "Cinematic color grading",
          "Full sound design & audio clean-up",
          "Subtitles & custom graphics",
          "High-CTR thumbnail design included",
          "2 revision rounds",
          "Delivery in 3 to 4 business days",
        ],
        isPopular: true,
        ctaText: "Most Popular",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the Standard YouTube & Ads Video Editing package (₹3,999/video). Can we discuss my footage?",
      },
      {
        name: "Monthly Creator Retainer",
        price: 14999,
        currency: "INR",
        period: "per month",
        description:
          "Dedicated editor for creators & businesses needing 15 to 20 polished videos monthly.",
        features: [
          "15 to 20 Reels/Shorts per month OR 4 long-form YouTube edits",
          "Dedicated senior editor assigned to your brand",
          "Custom animated intro/outro & brand assets",
          "Raw footage cloud repository management",
          "Unlimited revisions on all deliverables",
          "Priority 24-hour turnaround on urgent drops",
          "Monthly content strategy & trend review",
        ],
        isPopular: false,
        ctaText: "Book Retainer",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the Monthly Creator Retainer (₹14,999/month). Let's set up a monthly editing workflow!",
      },
    ],
    process: [
      {
        step: 1,
        title: "Send Raw Footage",
        description:
          "Share your raw files via Google Drive, Dropbox, or WeTransfer. Tell us your target audience, platform, and preferred reference style.",
        icon: "MessageSquare",
      },
      {
        step: 2,
        title: "First Cut & Review",
        description:
          "We craft the rough cut, timing, and sound design. You receive a private review link within 48 hours to share timestamped feedback.",
        icon: "Play",
      },
      {
        step: 3,
        title: "Color & Motion Polish",
        description:
          "We apply cinematic color grades, animated captions, motion titles, and SFX. We refine until every second hits the mark.",
        icon: "Settings",
      },
      {
        step: 4,
        title: "Final 4K Delivery",
        description:
          "Get your final master exported in 4K ProRes or optimized H.264 MP4, ready to publish directly to Instagram, YouTube, or ad managers.",
        icon: "Download",
      },
    ],
    faq: [
      {
        question: "How do I send my raw footage?",
        answer:
          "You can share a Google Drive, Dropbox, OneDrive, or WeTransfer link directly via WhatsApp or email. We can also provide a dedicated upload folder for your brand.",
      },
      {
        question: "What is your turnaround time?",
        answer:
          "Short-form Reels and Shorts are typically delivered in 24 to 48 hours. Long-form YouTube videos take 3 to 4 business days. Rush 24-hour delivery is also available upon request.",
      },
      {
        question: "Do you include royalty-free music and sound effects?",
        answer:
          "Yes! We license royalty-free commercial tracks and build custom sound design (whooshes, risers, impact hits) so your videos are 100% copyright-safe and monetizable.",
      },
      {
        question: "Can I request changes after the edit is delivered?",
        answer:
          "Absolutely. We offer unlimited revisions until you are completely satisfied with the final cut.",
      },
    ],
  },
  {
    id: "svc-002",
    slug: "website-building",
    title: "Website Design & Development",
    description:
      "Custom, high-speed Next.js websites built to convert visitors into paying clients. Flexible rates from 1-page landing sites to 20-page portals.",
    longDescription:
      "Stop losing clients to slow, outdated websites. At BADARSH, we build blazing-fast, mobile-first websites using Next.js, React, and Tailwind CSS. Every site is designed to look like Apple or Google: ultra-clean typography, smooth micro-interactions, full technical SEO, and instant WhatsApp integration. We handle everything from design to domain launch and hosting setup.",
    icon: "Globe",
    portfolioImages: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80",
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1200&q=80",
    ],
    features: [
      "Custom UI/UX designed in Figma before coding",
      "Next.js 16 + React for sub-second page loads",
      "Complete technical SEO, schema & Google indexing",
      "100% mobile-responsive layout for all screens",
      "Direct WhatsApp chat & dynamic lead capture forms",
      "Free SSL certificate & domain DNS configuration",
      "Admin CMS dashboard to manage your own content",
      "1 to 6 months of dedicated post-launch support",
    ],
    packages: [
      {
        name: "Normal / Landing Page (1 to 3 Pages)",
        price: 3999,
        currency: "INR",
        description:
          "Clean, fast single-page or simple 3-section website. Ideal for personal brands, freelancers, and local businesses (range ₹3,000–₹6,000).",
        features: [
          "1 to 3 responsive sections / pages",
          "Mobile-first responsive design",
          "Fast loading under 2 seconds",
          "WhatsApp direct click-to-chat integration",
          "Contact form with email lead notifications",
          "Basic Google SEO & Google Maps setup",
          "Delivery in 4 to 6 business days",
          "1 month free technical support",
        ],
        isPopular: false,
        ctaText: "Order Landing Page",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the Normal/Landing Page Website package (₹3,999 - ₹6,000). Can we discuss my requirements?",
      },
      {
        name: "Standard Business Site (5 to 8 Pages)",
        price: 9999,
        currency: "INR",
        description:
          "Complete multi-page business website with blog, services showcase, and full SEO setup (range ₹9,000–₹11,000).",
        features: [
          "5 to 8 custom designed pages",
          "Home, About, Services, Portfolio, Blog, Contact",
          "Custom modern UI/UX with smooth animations",
          "Complete On-Page SEO + Google Search Console indexing",
          "WhatsApp chat widget & automated inquiry capture",
          "Admin dashboard to update posts & text anytime",
          "Delivery in 10 to 14 business days",
          "3 months free maintenance & updates",
        ],
        isPopular: true,
        ctaText: "Most Popular",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the 5-8 Pages Business Website package (₹9,999 - ₹11,000). Can we schedule a project call?",
      },
      {
        name: "Enterprise & E-Commerce (15 to 20 Pages)",
        price: 15000,
        currency: "INR",
        description:
          "Full-scale digital platform with up to 20 pages, online store / payments, customer accounts, and advanced SEO.",
        features: [
          "15 to 20 pages + custom architecture",
          "E-commerce catalog or service booking system",
          "UPI, Razorpay, or Stripe payment integration",
          "Full Next.js SSR for maximum Google SEO dominance",
          "Interactive customer dashboard & admin OS",
          "High-conversion copywriting & speed optimization",
          "Delivery in 20 to 25 business days",
          "6 months dedicated support & free hosting setup",
        ],
        isPopular: false,
        ctaText: "Build Enterprise Site",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the 15-20 Pages Enterprise Website package (₹15,000+). Let's discuss my custom specifications!",
      },
    ],
    process: [
      {
        step: 1,
        title: "Requirement Scoping on WhatsApp",
        description:
          "We talk directly with you on WhatsApp or call to understand your target audience, required pages, reference designs, and brand goals.",
        icon: "Phone",
      },
      {
        step: 2,
        title: "Figma UI/UX Mockups",
        description:
          "We create high-fidelity design prototypes showing your exact layout, typography, and color palette for your approval before coding.",
        icon: "Palette",
      },
      {
        step: 3,
        title: "Next.js Development",
        description:
          "We code your website with clean TypeScript, Next.js, and Tailwind CSS. We ensure 95+ Google Lighthouse speed scores across all pages.",
        icon: "Code",
      },
      {
        step: 4,
        title: "Deployment & Training",
        description:
          "We link your custom domain, set up SSL, configure Google Analytics, and give you a walk-through on managing your content effortlessly.",
        icon: "Rocket",
      },
    ],
    faq: [
      {
        question: "Why do you use Next.js instead of generic WordPress?",
        answer:
          "Next.js provides instant page loads, unbeatable Google SEO ranking advantages, zero vulnerability to WordPress plugin hacks, and an Apple-level smooth user experience.",
      },
      {
        question: "Are domain and hosting costs included?",
        answer:
          "We set up free world-class hosting on Vercel for you. If you already have a domain, we connect it for free. If you need a new domain (.com or .in), we help you purchase it at base registrar prices (~₹800/yr).",
      },
      {
        question: "Can I update products, blogs, and images myself after launch?",
        answer:
          "Yes! We provide an intuitive Admin Dashboard where you can edit text, upload new portfolio items, create blog posts, and track inquiries without writing any code.",
      },
    ],
  },
  {
    id: "svc-003",
    slug: "social-media-management",
    title: "Social Media Management",
    description:
      "End-to-end social media growth: strategy, content calendars, Reels production, graphic design, daily publishing, and audience engagement.",
    longDescription:
      "Stop stressing over what to post every day. Let BADARSH manage your entire social media presence. We craft platform-specific content that establishes your authority, builds an engaged community, and drives qualified inbound leads for your business. From Instagram Reels to LinkedIn carousels, we handle scriptwriting, editing, graphic design, scheduling, and community replies.",
    icon: "Share2",
    portfolioImages: [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80",
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80",
    ],
    features: [
      "Tailored 30-day monthly content strategy & calendar",
      "Professional graphic design for feed posts & carousels",
      "Short-form video editing for Reels & Shorts",
      "High-converting caption copywriting & hashtag research",
      "Daily scheduling & optimal posting time management",
      "Community management: comment & DM engagement",
      "Monthly growth analytics & strategy refinement reports",
      "Competitor audit & viral trend surveillance",
    ],
    packages: [
      {
        name: "Starter Growth",
        price: 4999,
        currency: "INR",
        period: "per month",
        description:
          "Essential social media presence for small businesses & solo creators — 12 custom posts per month.",
        features: [
          "1 social platform (Instagram or LinkedIn)",
          "12 high-impact feed posts per month (3 per week)",
          "Custom graphic design & brand styling",
          "Caption copywriting & targeted hashtag strategy",
          "Monthly content calendar shared in advance",
          "Basic monthly growth analytics report",
        ],
        isPopular: false,
        ctaText: "Get Started",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the Starter Social Media Management package (₹4,999/month). Let's discuss my brand!",
      },
      {
        name: "Authority Accelerator",
        price: 9999,
        currency: "INR",
        period: "per month",
        description:
          "Comprehensive multi-format management with Reels, carousels, and active community engagement.",
        features: [
          "2 platforms (e.g. Instagram + LinkedIn or YouTube)",
          "20 custom feed posts / carousels per month",
          "6 professionally edited Reels / short videos",
          "10 interactive story prompts per month",
          "Daily comment & DM customer engagement",
          "Bi-weekly performance review & trend ideation",
          "Detailed monthly metrics & lead tracking report",
        ],
        isPopular: true,
        ctaText: "Most Popular",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the Authority Accelerator Social Media package (₹9,999/month). Can we review my profile?",
      },
      {
        name: "Full Brand Scale",
        price: 19999,
        currency: "INR",
        period: "per month",
        description:
          "Complete agency takeover across 3+ platforms with daily posting, 12+ Reels, and paid ad management.",
        features: [
          "3+ platforms (Instagram, LinkedIn, YouTube, Facebook)",
          "30 posts per month (daily publishing)",
          "12 edited Reels / short-form videos",
          "Daily active story campaigns",
          "Meta Ads setup & campaign optimization",
          "Dedicated social media manager on WhatsApp",
          "Weekly strategy sync & real-time dashboard",
        ],
        isPopular: false,
        ctaText: "Scale My Brand",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the Full Brand Scale Social Media package (₹19,999/month). Let's schedule a kickoff call!",
      },
    ],
    process: [
      {
        step: 1,
        title: "Account Audit & Strategy",
        description:
          "We analyze your current profile, competitors, and target audience to formulate a visual style guide and 30-day content calendar.",
        icon: "Search",
      },
      {
        step: 2,
        title: "Content Production",
        description:
          "Our team writes captions, designs graphics, edits Reels, and sends the entire monthly calendar for your approval before publishing.",
        icon: "PenTool",
      },
      {
        step: 3,
        title: "Publishing & Engagement",
        description:
          "We post at peak engagement hours, interact with followers, reply to comments, and nurture prospective buyer inquiries.",
        icon: "Send",
      },
      {
        step: 4,
        title: "Monthly Optimization",
        description:
          "You receive a transparent monthly report showing follower growth, impressions, post saves, and inbound leads generated.",
        icon: "BarChart3",
      },
    ],
    faq: [
      {
        question: "Do I need to approve posts before they go live?",
        answer:
          "Yes! We share the entire content calendar and all visuals with you on Google Drive or Notion before any post is published. You have 100% editorial control.",
      },
      {
        question: "What platforms do you specialize in?",
        answer:
          "We specialize in Instagram, LinkedIn, YouTube, Facebook, and Twitter/X.",
      },
    ],
  },
  {
    id: "svc-004",
    slug: "app-development",
    title: "Mobile App Development",
    description:
      "Native iOS & Android mobile applications built with React Native and Flutter. Flexible rates from quick MVP prototypes to enterprise platforms.",
    longDescription:
      "Turn your product idea into a high-performance mobile app on the Apple App Store and Google Play Store. We develop responsive cross-platform mobile apps complete with secure authentication, real-time database sync (Firebase / Supabase), push notifications, and payment processing. Designed with Apple Human Interface Guidelines for a fluid, premium feel.",
    icon: "Smartphone",
    portfolioImages: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=80",
      "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=1200&q=80",
      "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=1200&q=80",
    ],
    features: [
      "Native builds for both iOS and Android from one codebase",
      "React Native & Flutter high-performance architecture",
      "Secure user auth (Phone OTP, Google, Apple ID)",
      "Instant UPI & Razorpay in-app payment gateway",
      "Real-time database sync & offline caching",
      "Admin dashboard to manage users, orders & content",
      "Push notifications & user analytics tracking",
      "App Store & Google Play publishing support",
    ],
    packages: [
      {
        name: "MVP Mobile Prototype (3 to 5 Screens)",
        price: 12999,
        currency: "INR",
        description:
          "Quick-launch prototype to validate your mobile app idea with early users and angel investors.",
        features: [
          "Single platform (Android APK or iOS TestFlight)",
          "Up to 5 functional responsive screens",
          "Firebase backend & secure authentication",
          "Clean modern UI following Apple/Google design",
          "Delivery in 14 to 18 business days",
          "1 month post-launch support",
        ],
        isPopular: false,
        ctaText: "Launch MVP App",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the MVP Mobile App package (₹12,999). Can we discuss my app concept?",
      },
      {
        name: "Cross-Platform Pro (6 to 12 Screens)",
        price: 24999,
        currency: "INR",
        description:
          "Full-fledged production app for both iOS & Android with admin dashboard, payments, and push notifications.",
        features: [
          "Both iOS & Android builds included",
          "Up to 12 responsive screens with custom UI",
          "Payment gateway integration (UPI / Razorpay / Stripe)",
          "Push notifications & analytics dashboard",
          "Admin control panel for content management",
          "Store submission & compliance review assistance",
          "Delivery in 25 to 30 business days",
          "3 months dedicated warranty support",
        ],
        isPopular: true,
        ctaText: "Most Popular",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the Cross-Platform Pro App package (₹24,999). Let's review the feature list!",
      },
      {
        name: "Full Enterprise App (15+ Screens)",
        price: 49999,
        currency: "INR",
        description:
          "Complex mobile application with real-time chat, AI integration, audio/video streaming, and microservices backend.",
        features: [
          "15+ custom screens & complex business workflows",
          "Real-time chat / messaging / live updates",
          "AI API integration (Gemini / OpenAI)",
          "High-concurrency cloud backend & database",
          "Full source code ownership on private GitHub repo",
          "Delivery in 40 to 50 business days",
          "6 months priority 24/7 technical support",
        ],
        isPopular: false,
        ctaText: "Build Enterprise App",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the Full Enterprise Mobile App package (₹49,999+). Let's set up a technical scoping call!",
      },
    ],
    process: [
      {
        step: 1,
        title: "Wireframes & Logic Flow",
        description:
          "We map every screen, user permission, database schema, and navigation flow before writing any code.",
        icon: "FileCode",
      },
      {
        step: 2,
        title: "Interactive Prototype",
        description:
          "You test a clickable prototype on your phone to confirm the user experience feels fast and natural.",
        icon: "Code",
      },
      {
        step: 3,
        title: "Production Development",
        description:
          "We build with React Native or Flutter, integrating API endpoints, secure payments, and database logic.",
        icon: "CheckCircle",
      },
      {
        step: 4,
        title: "Store Submission & Launch",
        description:
          "We handle screenshots, metadata, and submission guidelines on Google Play Console and Apple App Store.",
        icon: "Rocket",
      },
    ],
    faq: [
      {
        question: "Will the app work on both iPhone and Android?",
        answer:
          "Yes! We build with cross-platform frameworks (React Native / Flutter) so you get native performance on both operating systems from a single codebase.",
      },
      {
        question: "Do I get full ownership of the source code?",
        answer:
          "Yes, 100%. Upon project completion, all source code, GitHub repositories, and intellectual property belong entirely to you.",
      },
    ],
  },
  {
    id: "svc-005",
    slug: "photo-editing",
    title: "Photo Editing & High-End Retouching",
    description:
      "Studio-grade retouching for e-commerce, portraits, real estate, fashion lookbooks, and luxury advertising campaigns.",
    longDescription:
      "Elevate your visual standards. We provide studio-level frequency separation, skin texture preservation, color grading, shadow creation, background removal, and commercial jewelry/product cleanup. Our edits look natural, crisp, and high-converting — trusted by fashion labels, Amazon sellers, and commercial photographers.",
    icon: "Camera",
    portfolioImages: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80",
      "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=1200&q=80",
      "https://images.unsplash.com/photo-1512361436605-a484bdb34b5f?w=1200&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    ],
    features: [
      "High-end frequency separation skin retouching",
      "Pure white / transparent PNG cutouts for e-commerce",
      "Realistic drop shadow & reflection creation",
      "Jewelry, metals & watch reflection cleanup",
      "Bulk batch processing for catalog listings",
      "Color matching across product SKUs and variants",
      "High-resolution print export (300 DPI CMYK ready)",
      "Fast 24 to 48-hour turnaround on all batches",
    ],
    packages: [
      {
        name: "E-Commerce Batch (20 Photos)",
        price: 1999,
        currency: "INR",
        description:
          "Clean product cutouts, color correction, and natural drop shadows for Amazon, Flipkart, or Shopify listings.",
        features: [
          "Up to 20 product photos",
          "Pure white background / PNG cutout",
          "Natural drop shadow creation",
          "Color correction & cropping",
          "Delivery in 48 hours",
          "2 revision rounds",
        ],
        isPopular: false,
        ctaText: "Order Batch",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the E-Commerce Batch Photo Editing (₹1,999). Can I send sample photos?",
      },
      {
        name: "High-End Commercial Retouching",
        price: 4999,
        currency: "INR",
        description:
          "Editorial & luxury retouching for hero brand banners, fashion portraits, and social media campaigns.",
        features: [
          "Up to 15 high-detail photos",
          "Frequency separation & texture preservation",
          "Lighting enhancements & dodge/burn",
          "Clothing crease removal & shape refinement",
          "Delivery in 3 business days",
          "Unlimited revisions",
        ],
        isPopular: true,
        ctaText: "Most Popular",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the High-End Commercial Photo Editing package (₹4,999). Can we discuss my photoshoot?",
      },
      {
        name: "Brand Campaign Suite (40 Photos)",
        price: 9999,
        currency: "INR",
        description:
          "Complete photo post-production for seasonal campaigns, lookbooks, and multi-channel creative.",
        features: [
          "Up to 40 retouched editorial images",
          "Custom artistic color grading / LUT application",
          "Format variations for Billboard, Print & Web",
          "Dedicated senior retoucher",
          "Delivery in 5 business days",
          "VIP priority support",
        ],
        isPopular: false,
        ctaText: "Book Suite",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the Brand Campaign Suite Photo Editing package (₹9,999). Let's chat!",
      },
    ],
    process: [
      {
        step: 1,
        title: "Send Raw Images",
        description:
          "Upload your high-res RAW or JPEG images via Google Drive, Dropbox, or WeTransfer.",
        icon: "Upload",
      },
      {
        step: 2,
        title: "Test Sample Retouch",
        description:
          "We retouch 1-2 images for style alignment before processing the full batch.",
        icon: "Sparkles",
      },
      {
        step: 3,
        title: "Full Production Edit",
        description:
          "Our retouching team executes meticulous edits with 100% pixel-level quality control.",
        icon: "CheckSquare",
      },
      {
        step: 4,
        title: "Instant Download",
        description:
          "Receive high-resolution print files and optimized web formats ready for publication.",
        icon: "Download",
      },
    ],
    faq: [
      {
        question: "What file formats should I send?",
        answer:
          "We accept RAW (CR2, NEF, ARW, DNG), TIFF, PSD, and high-resolution JPEGs. For the highest quality results, RAW files are always recommended.",
      },
    ],
  },
  {
    id: "svc-006",
    slug: "brand-identity",
    title: "Brand Identity Design (Logos)",
    description:
      "Timeless logo systems, typography palettes, brand books, and design tokens that position you as an industry leader.",
    longDescription:
      "Great brands are not designed by accident. We build cohesive visual identity systems that communicate prestige, trust, and clarity across every touchpoint — from primary logos and submarks to business cards, packaging, and digital guidelines. View our sample logos below or message us directly on WhatsApp to order your custom brand identity.",
    icon: "Sparkles",
    portfolioImages: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=80",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80",
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=80",
      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1200&q=80",
    ],
    features: [
      "Custom primary, secondary & submark logo suite",
      "Typography pairing & commercial font licensing guide",
      "Semantic color palette with HEX, RGB & CMYK codes",
      "25+ page comprehensive Brand Guidelines PDF",
      "Social media profile kit (avatars, covers, favicons)",
      "Vector source files (.AI, .SVG, .EPS, .PDF)",
      "Realistic merchandise & stationery mockups",
      "Complete commercial copyright transfer",
    ],
    packages: [
      {
        name: "Founder Logo Kit",
        price: 4999,
        currency: "INR",
        description:
          "Essential logo suite for new startups, consultants, and creators launching their brand.",
        features: [
          "2 distinct custom logo concept directions",
          "Primary logo + monochrome & transparent versions",
          "Curated font pairing & hex color palette",
          "Social media avatar & banner templates",
          "Vector files (SVG, EPS, PDF, high-res PNG)",
          "Delivery in 5 business days",
          "2 revision rounds",
        ],
        isPopular: false,
        ctaText: "Order Logo Kit",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the Founder Logo Kit (₹4,999). Can we discuss my brand name and style?",
      },
      {
        name: "Full Brand System",
        price: 9999,
        currency: "INR",
        description:
          "Complete end-to-end corporate identity system for ambitious companies and scaling businesses.",
        features: [
          "3 premium custom logo directions",
          "Full logo suite (horizontal, stacked, icon badge, submark)",
          "Detailed 25-page Brand Style Guidebook",
          "Stationery pack (Business card, letterhead, email signature)",
          "Packaging or merchandise mockup set",
          "Vector & high-res PNG/SVG exports",
          "Delivery in 10 to 12 business days",
          "Unlimited revisions until satisfied",
        ],
        isPopular: true,
        ctaText: "Most Popular",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the Full Brand System package (₹9,999). Can we schedule a brand discovery call?",
      },
      {
        name: "Complete Brand & Website Suite",
        price: 19999,
        currency: "INR",
        description:
          "Comprehensive rebrand paired with a custom high-converting Next.js website design.",
        features: [
          "Everything in Full Brand System",
          "Matching 5-page responsive Next.js website build",
          "Custom Figma UI design system & components",
          "Pitch deck & presentation template suite",
          "Delivery in 20 business days",
          "6 months dedicated design support",
        ],
        isPopular: false,
        ctaText: "Get Complete Suite",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the Complete Brand & Website Suite (₹19,999). Let's collaborate!",
      },
    ],
    process: [
      {
        step: 1,
        title: "Moodboard & Strategy",
        description:
          "We explore your market positioning, aesthetic references, and audience psychology via WhatsApp.",
        icon: "Lightbulb",
      },
      {
        step: 2,
        title: "Concept Presentation",
        description:
          "We present distinct logo concepts shown in real-world contexts and mockups for your review.",
        icon: "Eye",
      },
      {
        step: 3,
        title: "Refinement & Polish",
        description:
          "We hone your chosen direction until every curve, kerning, and color feels impeccable.",
        icon: "Sliders",
      },
      {
        step: 4,
        title: "Brand Asset Delivery",
        description:
          "Complete delivery of production-ready vector assets, font guidelines, and style manual.",
        icon: "Archive",
      },
    ],
    faq: [
      {
        question: "Do you provide editable vector source files?",
        answer:
          "Yes! You receive fully editable Adobe Illustrator (.AI), vector SVG, EPS, high-resolution print PDF, and transparent PNG files.",
      },
      {
        question: "Can I download sample logos to review your quality first?",
        answer:
          "Yes! We display our sample logos in the portfolio gallery below so you can inspect our design quality. When you're ready, message us directly on WhatsApp to order your custom logo.",
      },
    ],
  },
];
