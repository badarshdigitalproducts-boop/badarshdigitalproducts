"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AiSupportAgent } from "@/components/shared/ai-support-agent";
import { SocialProofToast } from "@/components/shared/social-proof-toast";
import { FirebaseAnalytics } from "@/components/shared/firebase-analytics";
import { FloatingAudioPlayer } from "@/components/audio/floating-audio-player";

function StorefrontNavInner() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) return null;
  return <Navbar />;
}

export function StorefrontNav() {
  return (
    <Suspense fallback={null}>
      <StorefrontNavInner />
    </Suspense>
  );
}

function StorefrontFooterInner() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) return null;

  return (
    <>
      <Footer />
      <FloatingAudioPlayer />
      <AiSupportAgent />
      <SocialProofToast />
      <FirebaseAnalytics />
    </>
  );
}

export function StorefrontFooter() {
  return (
    <Suspense fallback={null}>
      <StorefrontFooterInner />
    </Suspense>
  );
}
