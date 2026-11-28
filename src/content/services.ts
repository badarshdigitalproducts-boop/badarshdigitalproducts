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
      "/videos/badarsh-showreel.mp4",
    ],
    portfolioImages: [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80",
      "/images/catalog/video-bundle-cover.png",
      "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=1200&q=80",
      "/images/catalog/cinematic-reels-cover.png",
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
        name: "Normal Reel / Shorts Cut",
        price: 250,
        currency: "INR",
        period: "per video",
        description:
          "Crisp pacing cuts, smooth transitions, background audio balance, and clean 1080p export.",
        features: [
          "Up to 60 seconds duration",
          "Clean pacing cuts & trim",
          "Smooth transitions",
          "Royalty-free background music",
          "Audio level normalization",
          "Delivery in 24 to 48 hours",
          "1 revision included",
        ],
        isPopular: false,
        ctaText: "Book ₹250 Edit",
        whatsappMessage:
          "Hi BADARSH! I want to book a Normal Reel Cut (₹250). Can I send my raw footage?",
      },
      {
        name: "Viral Retention / Crazy Level",
        price: 400,
        currency: "INR",
        period: "per video",
        description:
          "High-retention dynamic cuts, Hormozi-style animated captions, zoom punches, and impact sound effects.",
        features: [
          "Up to 90 seconds duration",
          "Dynamic jump cuts & zoom punches",
          "Animated kinetic captions & emojis",
          "Impact sound design (whooshes, risers, hits)",
          "B-roll & overlay integration",
          "Fast 24-hour delivery",
          "2 revision rounds",
        ],
        isPopular: true,
        ctaText: "Most Popular (₹400)",
        whatsappMessage:
          "Hi BADARSH! I want to book a Viral Retention Video Edit (₹400). Here is my footage concept.",
      },
      {
        name: "Mind-Blowing Cinematic Master",
        price: 799,
        currency: "INR",
        period: "per video",
        description:
          "Hollywood-level color grading, multi-layered sound design, motion graphics, and 4K ProRes master export.",
        features: [
          "Up to 3 minutes duration (or full long-form clip)",
          "Bespoke film emulation color grading",
          "Complex sound design & spatial audio FX",
          "Custom 3D titles & animated lower thirds",
          "4K 60FPS ProRes & H.265 master files",
          "Click-worthy thumbnail concept included",
          "Unlimited revisions until 100% thrilled",
        ],
        isPopular: false,
        ctaText: "Book Cinematic (₹799)",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the Mind-Blowing Cinematic Master video edit (₹799). Let's discuss my project!",
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
          "Single platform (Android Build or iOS TestFlight)",
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
        name: "Basic Retouch & Color Clean",
        price: 150,
        currency: "INR",
        period: "per photo",
        description:
          "Color balancing, brightness correction, light skin blemish removal, and crisp crop.",
        features: [
          "Color grade & exposure correction",
          "Basic blemish & stray hair cleanup",
          "High-res web & social media export",
          "Delivery in 24 hours",
          "1 revision round included",
        ],
        isPopular: false,
        ctaText: "Order ₹150 Edit",
        whatsappMessage:
          "Hi BADARSH! I want to order a Basic Photo Retouch (₹150). Can I send my image?",
      },
      {
        name: "Editorial Grade & Skin Retouch",
        price: 350,
        currency: "INR",
        period: "per photo",
        description:
          "Studio-grade frequency separation, natural skin texture preservation, and cinematic mood grading.",
        features: [
          "Advanced frequency separation skin retouching",
          "Natural skin texture (zero plastic look)",
          "Background cleanup & distraction removal",
          "Custom film color grading (Kodak/Portra tone)",
          "Delivery in 24 to 48 hours",
          "Unlimited revisions",
        ],
        isPopular: true,
        ctaText: "Most Popular (₹350)",
        whatsappMessage:
          "Hi BADARSH! I want to book the Editorial Photo Retouching (₹350). Here is my image.",
      },
      {
        name: "High-End Commercial & Composite",
        price: 799,
        currency: "INR",
        period: "per photo",
        description:
          "Magazine & billboard caliber retouching for luxury fashion, jewelry, and commercial advertising.",
        features: [
          "Magazine-grade frequency separation & dodge/burn",
          "Clothing crease removal & shape refinement",
          "Jewelry, reflection & metal surface cleanup",
          "300 DPI CMYK print-ready master TIFF/PNG",
          "Delivery in 2 to 3 business days",
          "VIP revisions until 100% satisfied",
        ],
        isPopular: false,
        ctaText: "Order Commercial (₹799)",
        whatsappMessage:
          "Hi BADARSH! I'm interested in High-End Commercial Retouching (₹799). Let's discuss my brief!",
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
        name: "Minimalist Vector Logo",
        price: 500,
        currency: "INR",
        period: "one-time",
        description:
          "Essential clean vector logo concept for startups, creators, and new businesses.",
        features: [
          "1 custom modern vector logo concept",
          "High-res PNG (transparent background) & JPEG",
          "Vector SVG source file included",
          "Black & white monochrome variants",
          "Delivery in 48 hours",
          "1 revision included",
        ],
        isPopular: false,
        ctaText: "Order ₹500 Logo",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the Minimalist Vector Logo (₹500). Can we discuss my brand name?",
      },
      {
        name: "Brand Logo & Typography Suite",
        price: 1199,
        currency: "INR",
        period: "one-time",
        description:
          "Complete primary and secondary logo suite with typography pairing and color system.",
        features: [
          "2 bespoke logo design directions",
          "Primary logo + horizontal + icon submark",
          "Typography pairing & hex color palette",
          "Social media avatar & watermark kit",
          "Full vector source files (SVG, EPS, PDF, PNG)",
          "Delivery in 3 to 4 business days",
          "2 revision rounds",
        ],
        isPopular: true,
        ctaText: "Most Popular (₹1,199)",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the Brand Logo & Typography Suite (₹1,199). Here is my brand concept.",
      },
      {
        name: "Full Signature Identity Pack",
        price: 1999,
        currency: "INR",
        period: "one-time",
        description:
          "Billion-dollar caliber brand identity package with stationery, 3D mockups, and commercial rights.",
        features: [
          "3 premium custom logo directions",
          "Complete logo suite (primary, stacked, emblem, favicon)",
          "Brand guidelines booklet (colors, fonts, dos & don'ts)",
          "Realistic 3D mockup set (cards, apparel, signage)",
          "Print-ready stationery & business card design",
          "Full commercial copyright transfer",
          "Unlimited revisions until 100% satisfied",
        ],
        isPopular: false,
        ctaText: "Order Identity (₹1,999)",
        whatsappMessage:
          "Hi BADARSH! I want to order the Full Signature Identity Pack (₹1,999). Let's schedule a brand brief!",
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
  {
    id: "svc-007",
    slug: "event-photography",
    title: "Event Photography & Cinematography",
    description:
      "Luxury multi-cam photography and 4K storytelling for weddings, birthdays, corporate summits, and commercial shoots across Karnataka.",
    longDescription:
      "Capturing timeless elegance, authentic raw emotions, and grand celebrations. Our master photography team deploys full-frame Sony Alpha & FX3 cinema bodies, high-aperture G-Master prime glass, studio lighting grids, and DJI Pro stabilizer systems to capture your once-in-a-lifetime moments in pristine fidelity.",
    icon: "Camera",
    portfolioImages: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1200&q=80",
    ],
    features: [
      "Sony FX3 & A7 IV dual-operator camera package",
      "Prime 35mm, 50mm, 85mm f/1.4 Sony G-Master glass",
      "Godox AD600 Pro high-speed strobe lights & softboxes",
      "Skin-tone perfecting RAW color grading & magazine retouching",
      "Private password-protected cloud client gallery for 1 year",
      "Next-day sneak peek album (30 highlight photos)",
      "Printed Italian leather photo album optional add-on",
      "Available across Bengaluru, Mysuru, Hubli & Pan-India",
    ],
    packages: [
      {
        name: "Silver Essential Coverage",
        price: 14999,
        currency: "INR",
        period: "per event",
        description:
          "Perfect for intimate birthdays, baby showers, engagements & private family gatherings up to 4 hours.",
        features: [
          "1 Senior Candid Photographer",
          "Up to 4 hours continuous coverage",
          "150+ high-res color-graded RAW photos",
          "Private cloud gallery with instant download",
          "48-hour sneak peek delivery (20 photos)",
          "Full delivery within 7 working days",
        ],
        isPopular: false,
        ctaText: "Book Silver (₹14,999)",
        whatsappMessage:
          "Hi BADARSH! I want to check availability for the Silver Event Photography package (₹14,999).",
      },
      {
        name: "Gold Wedding & Grand Gala",
        price: 34999,
        currency: "INR",
        period: "per event",
        description:
          "Full-day comprehensive dual-crew coverage with 4K cinematic highlight teaser for unforgettable celebrations.",
        features: [
          "2 Senior Photographers (Candid + Traditional)",
          "1 Cinematographer for 4K highlight film",
          "Up to 8 hours comprehensive coverage",
          "400+ master retouched photos + 3-minute teaser",
          "Same-day 30-photo sneak peek for Instagram",
          "Custom luxury USB presentation box",
          "Full delivery within 14 working days",
        ],
        isPopular: true,
        ctaText: "Most Popular (₹34,999)",
        whatsappMessage:
          "Hi BADARSH! I want to reserve the Gold Wedding & Grand Gala package (₹34,999) for my upcoming date.",
      },
      {
        name: "Royal Platinum Grand Celebration",
        price: 74999,
        currency: "INR",
        period: "per event",
        description:
          "The ultimate luxury 3-day multi-ceremony production with licensed drone cinematography and imported leather album.",
        features: [
          "Full 4-person senior crew (2 Photos + 2 Cinema)",
          "DJI Mavic 3 Cine 4K aerial drone coverage",
          "Multi-event coverage (Haldi, Sangeet, Muhurtham, Reception)",
          "1,000+ master edited images + 10-minute feature film",
          "Handcrafted 40-page Italian leather flush-mount album",
          "VIP priority editing & 5-day delivery",
        ],
        isPopular: false,
        ctaText: "Book Royal Platinum (₹74,999)",
        whatsappMessage:
          "Hi BADARSH! I want to book the Royal Platinum Celebration package (₹74,999). Let's schedule an in-person or call consultation.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Date & Location Lock",
        description:
          "Connect on WhatsApp to confirm crew availability for your dates and event venue.",
        icon: "Calendar",
      },
      {
        step: 2,
        title: "Shotlist & Moodboard",
        description:
          "We tailor key family portraits, rituals, and lighting aesthetics to match your style.",
        icon: "Lightbulb",
      },
      {
        step: 3,
        title: "Day-of Production",
        description:
          "Punctual, discreet, and creative multi-cam capture ensuring zero intrusive disruptions.",
        icon: "Camera",
      },
      {
        step: 4,
        title: "Signature Master Delivery",
        description:
          "Private cloud gallery link with full-resolution lossless downloads and optional physical album delivery.",
        icon: "Archive",
      },
    ],
    faq: [
      {
        question: "How long after the event will we receive our photos?",
        answer:
          "You receive a 30-photo sneak peek album within 24-48 hours. The complete color-graded gallery is delivered in 7 to 14 working days.",
      },
      {
        question: "Do you travel outside Bengaluru?",
        answer:
          "Yes! We regularly travel across Karnataka, Goa, Kerala, and pan-India. Travel and stay accommodations are billed at actuals.",
      },
    ],
  },
  {
    id: "svc-008",
    slug: "pre-wedding-cinematic",
    title: "Cinematic Pre-Wedding Shoots & Love Stories",
    description:
      "4K drone cinematography, editorial fashion portraits, and story-driven film shoots at exotic destinations across India.",
    longDescription:
      "Turn your relationship into a high-budget cinema trailer. We script personalized love story narratives, capture sweeping 4K aerial drone vistas, direct candid romantic interactions, and score your film with licensed cinematic music.",
    icon: "Video",
    portfolioVideos: [
      "/videos/badarsh-showreel.mp4",
    ],
    portfolioImages: [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&q=80",
    ],
    features: [
      "Sony FX3 Cinema Line 4K 120FPS slow-motion camera",
      "DJI Mavic 3 Cine licensed drone pilot aerials",
      "DJI Ronin RS3 Pro 3-axis cinema stabilization",
      "Editorial fashion direction & outfit coordination guide",
      "Hollywood-style film emulation (Kodak 2383 look)",
      "Original story scripting & interview voiceover recording",
      "30-sec Instagram Reel teaser + 3 to 5-minute cinema film",
      "75+ magazine-retouched portrait photos included",
    ],
    packages: [
      {
        name: "Romantic Teaser Film",
        price: 24999,
        currency: "INR",
        period: "per shoot",
        description:
          "1-day local destination shoot with 40 editorial portraits and a 60-second 4K cinematic teaser.",
        features: [
          "1 Senior Cinematographer + 1 Senior Photographer",
          "1 Day local shoot (up to 2 locations)",
          "40 magazine-retouched portraits",
          "60-second 4K cinematic teaser for Instagram",
          "Styling & outfit guidance guide",
          "Delivery in 10 working days",
        ],
        isPopular: false,
        ctaText: "Book Teaser (₹24,999)",
        whatsappMessage:
          "Hi BADARSH! I'm interested in the Romantic Teaser Pre-Wedding Shoot (₹24,999).",
      },
      {
        name: "Royal Romance Cinema Master",
        price: 54999,
        currency: "INR",
        period: "per shoot",
        description:
          "Our signature package: 4K aerial drone shots, couple voiceover audio story, 3-minute film, and 80 fine-art photos.",
        features: [
          "Full 3-person cinema crew (Director + Drone Pilot + Photographer)",
          "1-2 Days at iconic heritage or scenic destinations",
          "4K licensed drone aerial cinematography",
          "Couple love-story audio interview recording",
          "3 to 4-minute 4K cinematic short film",
          "60-sec Instagram Reel cut + 80 fine-art photos",
          "Delivery within 14 working days",
        ],
        isPopular: true,
        ctaText: "Signature Choice (₹54,999)",
        whatsappMessage:
          "Hi BADARSH! I want to book the Royal Romance Pre-Wedding Cinema package (₹54,999). Can we discuss locations?",
      },
      {
        name: "Destination Luxe Feature Film",
        price: 109999,
        currency: "INR",
        period: "per shoot",
        description:
          "Exotic pan-India shoot (Goa beaches, Udaipur palaces, Chikmagalur misty hills) with bespoke soundtrack and luxury photo book.",
        features: [
          "Full 4-person production unit with lighting setup",
          "2 Full days multi-location shoot anywhere in India",
          "Extensive 4K drone cinematography",
          "Bespoke music license tailored to your story",
          "5-minute theatrical cut + 3 viral Reels cuts",
          "150+ magazine portraits + handcrafted 30-page album",
          "Express 7-day editing turnaround",
        ],
        isPopular: false,
        ctaText: "Book Destination Luxe (₹1,09,999)",
        whatsappMessage:
          "Hi BADARSH! I want to discuss the Destination Luxe Pre-Wedding Feature Film (₹1,09,999) for our upcoming trip.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Story Brief & Vision",
        description:
          "We chat about how you met, your personal vibe, favorite songs, and aesthetic preferences.",
        icon: "Lightbulb",
      },
      {
        step: 2,
        title: "Destination & Wardrobe Selection",
        description:
          "We help you pick stunning locations and curate matching outfit color schemes.",
        icon: "Compass",
      },
      {
        step: 3,
        title: "Cinematic Shoot Day",
        description:
          "Relaxed, candid direction where you have fun while our crew captures magic in golden hour lighting.",
        icon: "Camera",
      },
      {
        step: 4,
        title: "Premiere Delivery",
        description:
          "Receive your 4K theatrical film and color-graded editorial gallery ready to share with friends and family.",
        icon: "Play",
      },
    ],
    faq: [
      {
        question: "Can you help us choose pre-wedding shoot locations?",
        answer:
          "Absolutely! We provide a curated catalog of 30+ picturesque locations across Karnataka (Chikmagalur tea estates, Hampi ruins, Mysore palaces, Sakleshpur misty peaks) and Goa beaches.",
      },
      {
        question: "Do you supply shoot permits and travel?",
        answer:
          "We assist with permit requirements for government and private venues. Travel and venue entry fees are covered by the client at actuals.",
      },
    ],
  },
];
