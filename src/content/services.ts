import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "svc-001",
    slug: "video-editing",
    title: "Video Editing",
    description:
      "Professional video editing for YouTube, Instagram Reels, ads, and brand content. From raw footage to polished, scroll-stopping videos.",
    longDescription:
      "Transform your raw footage into cinematic content that captivates your audience. Our video editing service covers everything from YouTube long-form to Instagram Reels and ad creatives. We handle color grading, motion graphics, subtitles, sound design, and transitions — all tailored to your brand's aesthetic and platform requirements. Whether you're a creator, coach, or business, we'll make your videos look like they were produced by a studio.",
    icon: "Video",
    features: [
      "Professional color grading & correction",
      "Motion graphics & text animations",
      "Subtitle & caption integration",
      "Royalty-free music & sound design",
      "Multi-platform export (YouTube, Reels, TikTok)",
      "Thumbnail design included",
      "Unlimited revisions on all packages",
      "Fast 48-hour turnaround available",
    ],
    packages: [
      {
        name: "Basic",
        price: 1499,
        currency: "INR",
        period: "per video",
        description:
          "Perfect for simple edits on short-form content like Reels and Shorts.",
        features: [
          "Up to 60 seconds duration",
          "Basic cuts & transitions",
          "Background music",
          "Text overlays & captions",
          "1 revision round",
          "Delivery in 3 business days",
        ],
        isPopular: false,
        ctaText: "Get Started",
        whatsappMessage:
          "Hi! I'm interested in the Basic Video Editing package (₹1,499/video). Can we discuss my project?",
      },
      {
        name: "Standard",
        price: 3999,
        currency: "INR",
        period: "per video",
        description:
          "Ideal for YouTube videos, brand content, and marketing videos up to 10 minutes.",
        features: [
          "Up to 10 minutes duration",
          "Advanced transitions & effects",
          "Color grading",
          "Motion graphics & lower thirds",
          "Subtitles & captions",
          "Custom thumbnail design",
          "2 revision rounds",
          "Delivery in 5 business days",
        ],
        isPopular: true,
        ctaText: "Most Popular",
        whatsappMessage:
          "Hi! I'm interested in the Standard Video Editing package (₹3,999/video). Can we discuss my project?",
      },
      {
        name: "Premium",
        price: 7999,
        currency: "INR",
        period: "per video",
        description:
          "Full-production editing for ads, course content, and cinematic brand films.",
        features: [
          "Up to 30 minutes duration",
          "Cinematic color grading",
          "Advanced motion graphics",
          "Sound design & mixing",
          "Multi-cam editing",
          "Custom animated intro/outro",
          "Subtitles in multiple languages",
          "Unlimited revisions",
          "Priority delivery in 3 business days",
        ],
        isPopular: false,
        ctaText: "Go Premium",
        whatsappMessage:
          "Hi! I'm interested in the Premium Video Editing package (₹7,999/video). Can we discuss my project?",
      },
    ],
    process: [
      {
        step: 1,
        title: "Share Your Vision",
        description:
          "Send us your raw footage, reference videos, and brief via WhatsApp or email. Tell us your style, platform, and goals.",
        icon: "MessageSquare",
      },
      {
        step: 2,
        title: "Review the Draft",
        description:
          "We deliver a first draft within the agreed timeline. Review it and share your feedback — we'll make it perfect.",
        icon: "Play",
      },
      {
        step: 3,
        title: "Revisions & Polish",
        description:
          "Based on your feedback, we refine the edit — color, sound, pacing, graphics. Until you love it.",
        icon: "Settings",
      },
      {
        step: 4,
        title: "Final Delivery",
        description:
          "Get your final video exported in all required formats and resolutions, ready to upload and publish.",
        icon: "Download",
      },
    ],
    faq: [
      {
        question: "What formats do you deliver the final video in?",
        answer:
          "We deliver in MP4 (H.264) by default, optimized for the platform you specify (YouTube, Instagram, TikTok, etc.). If you need other formats like MOV or ProRes, just let us know.",
      },
      {
        question: "How long does editing typically take?",
        answer:
          "Basic edits are delivered in 3 business days, Standard in 5 business days, and Premium in 3 business days (priority). Rush delivery within 24 hours is available for an additional fee.",
      },
      {
        question: "Can I provide my own music or do you source it?",
        answer:
          "Both! You can provide your own licensed music, or we'll select royalty-free tracks that match the mood and energy of your video. All music we use is copyright-safe for commercial use.",
      },
      {
        question: "Do you offer monthly retainer packages?",
        answer:
          "Yes! If you need regular editing (e.g., weekly YouTube videos or daily Reels), we offer custom monthly packages at discounted rates. Message us on WhatsApp to discuss.",
      },
    ],
  },
  {
    id: "svc-002",
    slug: "website-building",
    title: "Website Building",
    description:
      "Custom, responsive websites for businesses, portfolios, and e-commerce — built with modern tech that loads fast and looks stunning.",
    longDescription:
      "Get a website that actually works for your business. We design and build fast, responsive, SEO-optimized websites using the latest technologies — from simple landing pages and portfolios to full e-commerce stores. Every site is mobile-first, loads under 3 seconds, and is designed to convert visitors into customers. We handle everything: design, development, hosting setup, domain configuration, and post-launch support.",
    icon: "Globe",
    features: [
      "Custom responsive design",
      "Mobile-first approach",
      "SEO-optimized structure",
      "Fast load times (under 3 seconds)",
      "SSL certificate & security setup",
      "Google Analytics & Search Console integration",
      "Contact forms & WhatsApp integration",
      "Post-launch support & training",
    ],
    packages: [
      {
        name: "Basic",
        price: 4999,
        currency: "INR",
        description:
          "A clean, professional single-page website — perfect for freelancers and personal brands.",
        features: [
          "Single-page responsive website",
          "Up to 5 sections",
          "Mobile-optimized design",
          "Contact form integration",
          "Basic SEO setup",
          "WhatsApp chat button",
          "Delivery in 7 business days",
          "1 month free support",
        ],
        isPopular: false,
        ctaText: "Get Started",
        whatsappMessage:
          "Hi! I'm interested in the Basic Website package (₹4,999). Can we discuss my requirements?",
      },
      {
        name: "Standard",
        price: 14999,
        currency: "INR",
        description:
          "Multi-page business website with blog, animations, and full SEO — ideal for growing businesses.",
        features: [
          "Up to 7 pages",
          "Custom UI/UX design",
          "Blog/News section",
          "Smooth animations & interactions",
          "Full SEO optimization",
          "Google Analytics & Search Console",
          "Social media integration",
          "Delivery in 14 business days",
          "3 months free support",
        ],
        isPopular: true,
        ctaText: "Most Popular",
        whatsappMessage:
          "Hi! I'm interested in the Standard Website package (₹14,999). Can we discuss my requirements?",
      },
      {
        name: "Premium",
        price: 29999,
        currency: "INR",
        description:
          "Full-featured e-commerce or web application with payment gateway, admin panel, and advanced functionality.",
        features: [
          "Unlimited pages",
          "E-commerce / booking functionality",
          "Payment gateway integration",
          "Admin dashboard & CMS",
          "Advanced animations & micro-interactions",
          "Performance optimization",
          "Multi-language support",
          "Email marketing integration",
          "Delivery in 21 business days",
          "6 months free support & maintenance",
        ],
        isPopular: false,
        ctaText: "Go Premium",
        whatsappMessage:
          "Hi! I'm interested in the Premium Website package (₹29,999). Can we discuss my requirements?",
      },
    ],
    process: [
      {
        step: 1,
        title: "Discovery Call",
        description:
          "We discuss your business, goals, target audience, and design preferences to create a clear project brief.",
        icon: "Phone",
      },
      {
        step: 2,
        title: "Design & Prototype",
        description:
          "We create wireframes and a high-fidelity design mockup for your review before writing a single line of code.",
        icon: "Palette",
      },
      {
        step: 3,
        title: "Development & Testing",
        description:
          "We build your site with clean code, then test it across devices and browsers to ensure a flawless experience.",
        icon: "Code",
      },
      {
        step: 4,
        title: "Launch & Support",
        description:
          "We deploy your site, set up analytics, and provide training so you can manage content confidently on your own.",
        icon: "Rocket",
      },
    ],
    faq: [
      {
        question: "What technologies do you use to build websites?",
        answer:
          "We primarily use Next.js, React, and Tailwind CSS for custom builds. For simpler projects, we also work with WordPress, Framer, and Webflow depending on your needs and budget.",
      },
      {
        question: "Do you provide hosting and domain setup?",
        answer:
          "Yes! We help you choose and set up the right hosting provider (Vercel, Hostinger, or AWS) and configure your domain. Hosting costs are separate from our development fee and typically range from ₹200–₹1,000/month.",
      },
      {
        question: "Can I update the website content myself after launch?",
        answer:
          "Absolutely. We provide a content management system (CMS) and a training session so you can update text, images, and blog posts without any technical knowledge.",
      },
      {
        question: "What if I need changes after the website is launched?",
        answer:
          "All packages include free support (1–6 months depending on the plan). After that, we offer affordable maintenance plans starting at ₹999/month for ongoing updates, backups, and security monitoring.",
      },
    ],
  },
  {
    id: "svc-003",
    slug: "social-media-management",
    title: "Social Media Management",
    description:
      "End-to-end social media management — strategy, content creation, scheduling, engagement & analytics for Instagram, LinkedIn & more.",
    longDescription:
      "Stop spending hours on social media and let us handle it. Our social media management service covers everything from content strategy and creation to daily posting, community engagement, and performance analytics. We craft platform-specific content that resonates with your audience, maintains brand consistency, and drives real business results — whether that's followers, leads, or sales.",
    icon: "Share2",
    features: [
      "Custom content strategy & calendar",
      "Professional graphic design for posts",
      "Copywriting & hashtag research",
      "Daily posting & scheduling",
      "Community management & engagement",
      "Monthly analytics & performance reports",
      "Competitor analysis",
      "Trend monitoring & content ideas",
    ],
    packages: [
      {
        name: "Basic",
        price: 4999,
        currency: "INR",
        period: "per month",
        description:
          "Essential social media presence for small businesses — 12 posts per month on one platform.",
        features: [
          "1 social media platform",
          "12 posts per month (3/week)",
          "Custom graphic design",
          "Caption writing & hashtags",
          "Content calendar",
          "Basic monthly report",
          "Response to comments (business hours)",
        ],
        isPopular: false,
        ctaText: "Get Started",
        whatsappMessage:
          "Hi! I'm interested in the Basic Social Media Management package (₹4,999/month). Can we discuss my brand?",
      },
      {
        name: "Standard",
        price: 9999,
        currency: "INR",
        period: "per month",
        description:
          "Comprehensive management for 2 platforms with Reels, Stories, and active community engagement.",
        features: [
          "2 social media platforms",
          "20 posts per month",
          "4 Reels/short videos per month",
          "Story content (10/month)",
          "Advanced copywriting & hashtags",
          "Community engagement (daily)",
          "Competitor analysis",
          "Detailed monthly analytics report",
        ],
        isPopular: true,
        ctaText: "Most Popular",
        whatsappMessage:
          "Hi! I'm interested in the Standard Social Media Management package (₹9,999/month). Can we discuss my brand?",
      },
      {
        name: "Premium",
        price: 19999,
        currency: "INR",
        period: "per month",
        description:
          "Full-scale social media growth engine across 3+ platforms with paid ad management and influencer outreach.",
        features: [
          "3+ social media platforms",
          "30 posts per month",
          "8 Reels/short videos per month",
          "Daily Stories content",
          "Paid ad campaign management",
          "Influencer outreach & collaboration",
          "Crisis management",
          "Weekly performance calls",
          "Real-time analytics dashboard",
          "Dedicated account manager",
        ],
        isPopular: false,
        ctaText: "Go Premium",
        whatsappMessage:
          "Hi! I'm interested in the Premium Social Media Management package (₹19,999/month). Can we discuss my brand?",
      },
    ],
    process: [
      {
        step: 1,
        title: "Brand Audit & Strategy",
        description:
          "We analyze your current social media presence, competitors, and audience to build a tailored growth strategy.",
        icon: "Search",
      },
      {
        step: 2,
        title: "Content Creation",
        description:
          "Our team creates scroll-stopping graphics, writes engaging captions, and builds a monthly content calendar for your approval.",
        icon: "PenTool",
      },
      {
        step: 3,
        title: "Publish & Engage",
        description:
          "We schedule and publish content at optimal times, respond to comments and DMs, and actively grow your community.",
        icon: "Send",
      },
      {
        step: 4,
        title: "Report & Optimize",
        description:
          "Every month you receive a detailed performance report. We analyze what worked, what didn't, and refine the strategy.",
        icon: "BarChart3",
      },
    ],
    faq: [
      {
        question: "Which social media platforms do you manage?",
        answer:
          "We specialize in Instagram, LinkedIn, Facebook, Pinterest, YouTube, and Twitter/X. The number of platforms depends on your package — Basic covers 1, Standard covers 2, and Premium covers 3 or more.",
      },
      {
        question: "Do I need to provide content or photos?",
        answer:
          "Not necessarily! We create all graphics and write all copy. However, if you have brand photos, product images, or behind-the-scenes content, those perform exceptionally well and we encourage sharing them with us.",
      },
      {
        question: "How soon will I see results?",
        answer:
          "Social media growth is a long game, but most clients see noticeable improvements in engagement within the first month. Significant follower growth and lead generation typically kick in by months 2–3 with consistent effort.",
      },
      {
        question: "Can I approve content before it goes live?",
        answer:
          "Of course! We share the entire monthly content calendar and all creatives for your approval before anything is published. You have full control over your brand's voice.",
      },
    ],
  },
  {
    id: "svc-004",
    slug: "app-development",
    title: "App Development",
    description:
      "Native & cross-platform mobile apps for iOS and Android, plus progressive web applications with seamless cloud backends.",
    longDescription:
      "Turn your product vision into a polished, high-performance app on the App Store and Google Play. We develop responsive cross-platform mobile apps using React Native and Flutter, complete with secure authentication, real-time database sync, push notifications, and payment processing. Designed to scale from day one.",
    icon: "Smartphone",
    features: [
      "iOS and Android store readiness",
      "Modern React Native / Flutter architecture",
      "Secure user authentication (OTP, Google, Apple ID)",
      "Instant payment gateway integration (Razorpay, Stripe)",
      "Push notifications & analytics tracking",
      "Admin control panel for content management",
      "API integrations & cloud database setup",
      "App Store & Play Store publishing support",
    ],
    packages: [
      {
        name: "MVP Starter",
        price: 24999,
        currency: "INR",
        description:
          "Quick-launch prototype or MVP to validate your concept with early users.",
        features: [
          "Single platform (Android or iOS)",
          "Up to 5 functional screens",
          "Firebase backend & authentication",
          "Basic database integration",
          "Delivery in 21 business days",
          "1 month post-launch support",
        ],
        isPopular: false,
        ctaText: "Start MVP",
        whatsappMessage:
          "Hi! I'm interested in the MVP Starter App Development package (₹24,999). Can we discuss my app concept?",
      },
      {
        name: "Cross-Platform Pro",
        price: 49999,
        currency: "INR",
        description:
          "Full-fledged production app for both iOS & Android with admin dashboard and payments.",
        features: [
          "Both iOS & Android native builds",
          "Up to 12 responsive screens",
          "Full payment gateway & push notifications",
          "Admin management dashboard",
          "Automated cloud backups & security",
          "Store submission & approval guarantee",
          "Delivery in 30 business days",
          "3 months dedicated warranty support",
        ],
        isPopular: true,
        ctaText: "Most Popular",
        whatsappMessage:
          "Hi! I'm interested in the Cross-Platform Pro App package (₹49,999). Can we discuss my app?",
      },
      {
        name: "Enterprise Custom",
        price: 89999,
        currency: "INR",
        description:
          "Complex mobile application with real-time chat, AI integration, and multi-tenant infrastructure.",
        features: [
          "Unlimited custom screens & complex workflows",
          "Real-time chat / audio / video capabilities",
          "AI model integration (Gemini / Claude APIs)",
          "Custom microservices backend",
          "Full source code ownership & CI/CD pipeline",
          "Delivery in 45-60 business days",
          "6 months 24/7 priority support",
        ],
        isPopular: false,
        ctaText: "Contact Enterprise",
        whatsappMessage:
          "Hi! I'm interested in the Enterprise App Development package (₹89,999). Can we schedule a technical scoping call?",
      },
    ],
    process: [
      {
        step: 1,
        title: "Architecture & Wireframing",
        description:
          "We map user journeys, database schemas, and interactive wireframes before coding begins.",
        icon: "FileCode",
      },
      {
        step: 2,
        title: "Sprint Development",
        description:
          "Bi-weekly testable builds delivered straight to TestFlight and Android Internal Track.",
        icon: "Code",
      },
      {
        step: 3,
        title: "Quality Audit",
        description:
          "Rigorous performance, security, and edge-case testing on real iOS & Android hardware.",
        icon: "CheckCircle",
      },
      {
        step: 4,
        title: "Store Launch",
        description:
          "We handle end-to-end publishing, screenshots, metadata, and review compliance on Apple & Google.",
        icon: "Rocket",
      },
    ],
    faq: [
      {
        question: "Do you build for both iPhone and Android?",
        answer:
          "Yes! We build using modern cross-platform frameworks (React Native / Flutter) so you get native performance on both iOS and Android from a single codebase, saving you 40% in cost and time.",
      },
      {
        question: "Will I own the complete source code?",
        answer:
          "100%. Upon completion and final payment, the entire GitHub repository and all intellectual property belong entirely to you.",
      },
    ],
  },
  {
    id: "svc-005",
    slug: "photo-editing",
    title: "Photo Editing & Retouching",
    description:
      "Studio-grade retouching for e-commerce, high-fashion portfolios, jewelry, real estate, and digital ad campaigns.",
    longDescription:
      "Transform raw photos into high-converting commercial assets. We provide high-end frequency separation, realistic lighting correction, reflection manipulation, clean background isolation, and color grading that meets the exacting standards of luxury brands and top marketplaces.",
    icon: "Camera",
    features: [
      "High-end frequency separation skin retouching",
      "E-commerce pure white/transparent cutouts",
      "Shadow & reflection generation",
      "Jewelry, watch & metal reflection cleanup",
      "Bulk catalog batch processing",
      "Color matching across product SKUs",
      "High-resolution print export (CMYK ready)",
      "Rapid 24-48 hour turnaround",
    ],
    packages: [
      {
        name: "E-Commerce Batch",
        price: 1999,
        currency: "INR",
        description:
          "Clean product cutouts and alignment for Amazon, Shopify, or catalog listings.",
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
          "Hi! I'm interested in the E-Commerce Batch Photo Editing (₹1,999). Can I send sample photos?",
      },
      {
        name: "High-End Commercial",
        price: 4999,
        currency: "INR",
        description:
          "Editorial & luxury retouching for hero brand banners, fashion, and social media campaigns.",
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
          "Hi! I'm interested in the High-End Commercial Photo Editing package (₹4,999). Can we discuss my photoshoot?",
      },
      {
        name: "Brand Campaign Suite",
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
          "Hi! I'm interested in the Brand Campaign Suite Photo Editing package (₹9,999). Let's chat!",
      },
    ],
    process: [
      {
        step: 1,
        title: "Upload Raw Photos",
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
        title: "Full Production",
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
    title: "Brand Identity Design",
    description:
      "Timeless logo systems, typography palettes, brand books, and design tokens that position you as an industry leader.",
    longDescription:
      "Great brands are not designed by accident. We build cohesive visual identity systems that communicate prestige, trust, and clarity across every touchpoint — from business cards and packaging to mobile apps and investor pitch decks.",
    icon: "Sparkles",
    features: [
      "Custom primary, secondary & submark logo suite",
      "Typography pairing & font licensing guide",
      "Semantic color palette with dark/light mode codes",
      "30+ page comprehensive Brand Guidelines PDF",
      "Social media profile & cover kit",
      "Vector source files (.AI, .SVG, .EPS, .PDF)",
      "Stationery & merchandise mockups",
      "Complete commercial copyright transfer",
    ],
    packages: [
      {
        name: "Founder Essentials",
        price: 7999,
        currency: "INR",
        description:
          "Essential visual kit for new startups, consultants, and creators launching their brand.",
        features: [
          "2 distinct logo concept directions",
          "Primary logo + monochrome variations",
          "Curated font pairing & hex color palette",
          "Social media avatar & banner templates",
          "Delivery in 7 business days",
          "2 revision rounds",
        ],
        isPopular: false,
        ctaText: "Launch Brand",
        whatsappMessage:
          "Hi! I'm interested in the Founder Essentials Brand Identity package (₹7,999). Can we discuss my startup?",
      },
      {
        name: "Full Brand System",
        price: 18999,
        currency: "INR",
        description:
          "Complete end-to-end corporate identity system for ambitious companies and scaling businesses.",
        features: [
          "3 premium custom logo directions",
          "Full logo suite (horizontal, stacked, icon badge)",
          "Detailed 30-page Brand Style Guidebook",
          "Stationery pack (Business card, letterhead, email signature)",
          "Packaging or merchandise mockup set",
          "Vector & high-res PNG/SVG exports",
          "Delivery in 14 business days",
          "Unlimited revisions",
        ],
        isPopular: true,
        ctaText: "Most Popular",
        whatsappMessage:
          "Hi! I'm interested in the Full Brand System package (₹18,999). Can we schedule a brand discovery call?",
      },
      {
        name: "Agency Brand & Web",
        price: 34999,
        currency: "INR",
        description:
          "Comprehensive rebrand paired with a custom high-converting Next.js website design.",
        features: [
          "Everything in Full Brand System",
          "Custom Figma UI design system & components",
          "Matching 5-page responsive website build",
          "Pitch deck & presentation template in Canva",
          "Delivery in 25 business days",
          "6 months dedicated design support",
        ],
        isPopular: false,
        ctaText: "Get Complete Suite",
        whatsappMessage:
          "Hi! I'm interested in the Agency Brand & Web package (₹34,999). Let's collaborate!",
      },
    ],
    process: [
      {
        step: 1,
        title: "Moodboard & Strategy",
        description:
          "We explore your market positioning, aesthetic references, and audience psychology.",
        icon: "Lightbulb",
      },
      {
        step: 2,
        title: "Concept Presentation",
        description:
          "We present distinct logo concepts shown in real-world contexts and mockups.",
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
        question: "Do you provide editable vector files?",
        answer:
          "Yes! You receive fully editable Adobe Illustrator (.AI), vector SVG, EPS, high-resolution print PDF, and transparent PNG files.",
      },
    ],
  },
];
