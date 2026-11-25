"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film,
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Compass,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Award,
  Video,
  Camera,
} from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";
import { ServiceCheckoutModal } from "@/components/services/service-checkout-modal";

export default function PreWeddingCinematicPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const destinations = [
    {
      name: "Heritage Palaces of Bengaluru",
      desc: "Architectural Tudor-style stone towers, royal ballrooms, and sweeping botanical gardens at Bangalore Palace and ITC Windsor.",
      img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
    },
    {
      name: "Goa Coastal Cliffs & Golden Sunsets",
      desc: "Warm turquoise Arabian sea, dramatic cliffside silhouettes, and tropical palm tree drone sweeps at Morjim and Vagator.",
      img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    },
    {
      name: "Chikmagalur & Coorg Misty Peaks",
      desc: "Cascading waterfalls, lush emerald coffee estates, and cinematic high-altitude fog at Mullayanagiri and Baba Budangiri.",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
    },
  ];

  const packages = [
    {
      id: "prewed-teaser",
      name: "The Instagram 4K Teaser",
      price: 25000,
      description: "Fast-paced, high-impact 60-second vertical 4K cinematic reel engineered for viral Instagram sharing.",
      features: [
        "1-Day shoot (4-5 hours) in Bengaluru",
        "1 Senior Director of Photography (Sony FX3)",
        "DJI Mavic 3 4K Aerial Drone sweeps",
        "Licensed trending soundtrack audio mix",
        "1-Minute master vertical 4K reel + 3 story snippets",
      ],
      turnaround: "3 business days",
      badge: "Viral Reel",
    },
    {
      id: "prewed-story",
      name: "The Cinematic Story Film",
      price: 48000,
      description: "Our signature 3 to 5-minute Bollywood-grade cinematic short film featuring your real couple story and voiceover narration.",
      features: [
        "Full-day exotic destination shoot (Bengaluru / Coorg / Goa)",
        "2-Camera cinema crew + dedicated licensed Drone pilot",
        "Voiceover lapel audio recording of couple's vows or story",
        "Full color grading in DaVinci Resolve (Arri/Kodak look)",
        "Full 3-5 minute 4K Master film + 60s Instagram teaser",
        "RAW footage backup archived for 2 years",
      ],
      turnaround: "7 business days",
      badge: "Signature Choice",
      isPopular: true,
    },
    {
      id: "prewed-royal",
      name: "The Royal Cinema & Photo Suite",
      price: 85000,
      description: "The complete luxury experience: Full 5-minute cinematic film + 100 color-graded couple portraits + save-the-date animation.",
      features: [
        "2 Days multi-destination shoot (e.g. Palace + Beach/Hills)",
        "Full 4-person motion picture & photography crew",
        "High-altitude 4K 120fps drone cinematography",
        "5-Minute 4K master film + 2 vertical teaser cuts",
        "100+ master retouched couple editorial portraits",
        "Luxury acrylic photo album + 4K engraved wooden USB drive",
      ],
      turnaround: "10 business days",
      badge: "Royal Luxury",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
      {/* Compact Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
          Cinematic Pre-Wedding Films
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Story-driven 4K motion pictures shot on Sony FX3 Cinema Line &amp; drone across Goa, Coorg, and Bengaluru.
        </p>
      </div>

      {/* 4K Cinematic Showreel Video Player */}
      <div className="overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-950 shadow-2xl relative">
        <div className="relative aspect-video w-full max-h-[580px] bg-black">
          <video
            ref={videoRef}
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4"
            loop
            muted={isMuted}
            playsInline
            className="h-full w-full object-cover"
          />

          {/* Central Play/Pause Trigger */}
          <div
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors cursor-pointer"
          >
            {!isPlaying && (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-neutral-900 shadow-2xl hover:scale-110 active:scale-95 transition-transform">
                <Play className="h-8 w-8 fill-current ml-1" />
              </div>
            )}
          </div>

          {/* Floating Player Status Bar */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between rounded-2xl bg-black/75 backdrop-blur-md px-5 py-3 text-white border border-white/10">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <div>
                <span className="text-xs font-bold block">BADARSH Pre-Wedding Master Reel</span>
                <span className="text-[10px] text-white/60">Sony FX3 Full-Frame Cinema Line • 4K 60fps Drone</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-amber-400" />}
              </button>
              <a
                href={getWhatsAppUrl("Hi BADARSH! I just watched your pre-wedding showreel and would love to discuss shooting our couple film!")}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 px-4 py-2 text-xs font-bold transition-transform hover:scale-102"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Book This Cinema Crew</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Destination Location Curation */}
      <div className="mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Curated Backdrops
          </span>
          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
            Exotic South Indian Locations
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-500">
            We handle scouting, permits, timing, and drone flight coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinations.map((dest, idx) => (
            <div
              key={idx}
              className="group rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs hover:shadow-xl transition-all"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 rounded-md bg-black/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-amber-400" />
                  <span>Curated Destination</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-lg font-bold text-neutral-900 dark:text-white">
                  {dest.name}
                </h3>
                <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                  {dest.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Packages */}
      <div className="mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Investment &amp; Packages
          </span>
          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
            Pre-Wedding Cinema Packages
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-500">
            Turn your real love story into a timeless cinematic film you will watch for decades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-3xl p-8 flex flex-col justify-between border ${
                pkg.isPopular
                  ? "border-amber-500 shadow-2xl bg-white dark:bg-neutral-900 ring-2 ring-amber-500/30"
                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 text-neutral-950 px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Most Popular Film
                </div>
              )}

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {pkg.badge}
                </span>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
                  {pkg.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                    ₹{pkg.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-neutral-400">all inclusive</span>
                </div>
                <p className="mt-3 text-xs text-neutral-500 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="mt-6 space-y-2.5 border-t border-neutral-100 dark:border-neutral-800 pt-6">
                  {pkg.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                <div className="text-[11px] text-neutral-400 mb-3 text-center">
                  Delivery: <span className="font-bold text-neutral-800 dark:text-neutral-200">{pkg.turnaround}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedPackage(pkg)}
                    className="w-full rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 py-3 text-xs font-bold shadow-md hover:scale-102 transition-transform"
                  >
                    Reserve Shoot Date
                  </button>
                  <a
                    href={getWhatsAppUrl(`Hi BADARSH! We're planning our pre-wedding shoot and would love to reserve the ${pkg.name}. Can we discuss dates?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 py-2.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Checkout Modal */}
      {selectedPackage && (
        <ServiceCheckoutModal
          isOpen={Boolean(selectedPackage)}
          onClose={() => setSelectedPackage(null)}
          plan={{
            id: selectedPackage.id,
            name: selectedPackage.name,
            price: selectedPackage.price,
            period: "one-time",
            description: selectedPackage.description,
            features: selectedPackage.features,
            turnaround: selectedPackage.turnaround,
          }}
          serviceTitle="Cinematic Pre-Wedding Film"
        />
      )}
    </div>
  );
}
