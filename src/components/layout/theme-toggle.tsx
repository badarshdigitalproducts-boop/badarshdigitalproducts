"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative cursor-pointer rounded-full p-2 transition-colors duration-200 hover:bg-muted/50"
        aria-label="Toggle theme"
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      whileTap={{ scale: 0.88 }}
      className="relative cursor-pointer rounded-full p-2 text-foreground transition-colors duration-150 hover:bg-muted/30 active:bg-muted/50"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -45, opacity: 0, scale: 0.85 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 45, opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", duration: 0.32, bounce: 0.2 }}
          >
            <Sun className="h-5 w-5 text-amber-400" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 45, opacity: 0, scale: 0.85 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -45, opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", duration: 0.32, bounce: 0.2 }}
          >
            <Moon className="h-5 w-5 text-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
