"use client";

import { motion } from "framer-motion";
import { getWhatsAppUrl } from "@/lib/utils";

export function WhatsappButton() {
  return (
    <motion.a
      href={getWhatsAppUrl(
        "Hi BADARSH! I'm browsing your website and have a question about your digital products & services.",
        "Floating Chat Button"
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat directly with BADARSH on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30 transition-shadow duration-200 hover:shadow-xl hover:shadow-green-500/40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-25" />

      {/* WhatsApp SVG icon */}
      <svg
        viewBox="0 0 32 32"
        fill="white"
        className="relative h-7 w-7"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.004 3.2C8.956 3.2 3.21 8.932 3.207 15.964c-.001 2.25.588 4.447 1.707 6.386L3.2 28.8l6.615-1.734a12.77 12.77 0 0 0 6.183 1.577h.005c7.047 0 12.793-5.733 12.797-12.765a12.69 12.69 0 0 0-3.748-9.028A12.72 12.72 0 0 0 16.004 3.2Zm0 23.33h-.004a10.59 10.59 0 0 1-5.408-1.48l-.388-.23-4.022 1.054 1.073-3.922-.253-.402a10.56 10.56 0 0 1-1.62-5.589c.003-5.856 4.773-10.62 10.638-10.62a10.56 10.56 0 0 1 7.523 3.12 10.55 10.55 0 0 1 3.11 7.53c-.003 5.858-4.773 10.623-10.649 10.623v-.084Zm5.834-7.96c-.32-.16-1.89-.933-2.183-1.04-.293-.107-.507-.16-.72.16-.213.32-.826 1.04-1.013 1.253-.187.213-.374.24-.694.08-.32-.16-1.35-.497-2.572-1.586-.95-.847-1.592-1.893-1.778-2.213-.187-.32-.02-.493.14-.652.144-.143.32-.374.48-.56.16-.187.213-.32.32-.534.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.986-2.373-.26-.624-.524-.54-.72-.55l-.614-.01a1.175 1.175 0 0 0-.854.4c-.293.32-1.12 1.094-1.12 2.667 0 1.573 1.147 3.093 1.307 3.307.16.213 2.256 3.444 5.467 4.83.764.33 1.36.527 1.825.675.767.244 1.465.21 2.017.127.615-.092 1.89-.773 2.157-1.52.267-.746.267-1.386.187-1.52-.08-.133-.293-.213-.613-.373Z" />
      </svg>
    </motion.a>
  );
}
