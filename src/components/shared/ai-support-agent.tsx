"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  RotateCcw,
  Sparkles,
  ArrowRight,
  MessageSquare,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { cn, getWhatsAppUrl } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

const INITIAL_SUGGESTIONS = [
  "🎬 Tell me about the 2026 Video Mega Bundle",
  "📱 How does the CapCut Pro APK work?",
  "💻 What are your website development prices?",
  "🎨 How do 1-click Lightroom Presets work?",
  "🛡️ What are the commercial licensing rights?",
];

// Helper: Parse markdown-like text with links, bolding, and bullet points safely
function RenderMessageContent({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-2 text-[13px] leading-relaxed break-words">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }

        // Headings: ###
        if (trimmed.startsWith("### ")) {
          return (
            <h4
              key={lineIdx}
              className="font-heading text-[14px] font-bold text-foreground mt-2 mb-1"
            >
              {trimmed.replace(/^###\s+/, "")}
            </h4>
          );
        }

        // Bullet points: - or *
        const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
        const contentText = isBullet ? trimmed.slice(2) : trimmed;

        // Parse markdown links [text](url) and bold **text**
        const elements: (string | ReactNode)[] = [];
        const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(contentText)) !== null) {
          // Plain text before match
          if (match.index > lastIndex) {
            elements.push(contentText.substring(lastIndex, match.index));
          }

          if (match[1] && match[2]) {
            // [text](url) link
            const linkText = match[1];
            const href = match[2];
            const isInternal = href.startsWith("/");

            if (isInternal) {
              elements.push(
                <Link
                  key={`link-${lineIdx}-${match.index}`}
                  href={href}
                  className="inline-flex items-center gap-0.5 font-semibold text-accent hover:underline"
                >
                  <span>{linkText}</span>
                  <ArrowRight className="inline h-3 w-3" />
                </Link>
              );
            } else {
              elements.push(
                <a
                  key={`ext-${lineIdx}-${match.index}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 font-semibold text-accent hover:underline"
                >
                  <span>{linkText}</span>
                  <ExternalLink className="inline h-3 w-3" />
                </a>
              );
            }
          } else if (match[3]) {
            // **text** bold
            elements.push(
              <strong
                key={`bold-${lineIdx}-${match.index}`}
                className="font-semibold text-foreground"
              >
                {match[3]}
              </strong>
            );
          }

          lastIndex = regex.lastIndex;
        }

        // Remaining text
        if (lastIndex < contentText.length) {
          elements.push(contentText.substring(lastIndex));
        }

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1">
              <span className="text-accent text-[11px] mt-1 shrink-0">&bull;</span>
              <div className="flex-1">{elements}</div>
            </div>
          );
        }

        return <p key={lineIdx}>{elements}</p>;
      })}
    </div>
  );
}

export function AiSupportAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize initial greeting once
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome-msg",
          role: "assistant",
          content:
            "### Welcome to BADARSH Studio Intelligence\n\nI am your dedicated 24/7 AI Concierge, trained on our complete 2026 creator ecosystem:\n\n- **Digital Assets**: [2026 Video Mega Bundle](/bundles), [CapCut Pro APKs](/editing-apps), [Lightroom Presets](/photo-presets), and [SFX Overlays](/editing-bundles).\n- **Engineering & Production**: [Next.js Websites (₹3k–₹15k)](/services/website-design), [Mobile Apps](/services/app-development), and [Reel Video Editing](/services/video-editing).\n\nHow can I help elevate your project today?",
          createdAt: Date.now(),
        },
      ]);
    }
  }, [messages.length]);

  // Scroll to bottom when messages update
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading, scrollToBottom]);

  // Hide badge tooltip after 8s
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    setHasInteracted(true);
    setInput("");

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageContent,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/support-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach support agent");
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I am here to help! Ask me anything about our bundles or services.",
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: "assistant",
          content:
            "I am available to assist you! Explore our [All-in-One Bundles](/bundles) or connect directly with our founders on our [Executive Studio Desk](/about#contact).",
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content:
          "Conversation reset. How can I assist you with BADARSH digital products, creator software APKs, or custom web engineering?",
        createdAt: Date.now(),
      },
    ]);
    setHasInteracted(false);
  };

  return (
    <>
      {/* ─── Floating Trigger Button (Bottom Right) ─── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Subtle Tooltip preview on initial load */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="hidden sm:flex items-center gap-2 rounded-full border border-border/70 bg-card/95 px-3.5 py-1.5 shadow-xl backdrop-blur-xl"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[12px] font-semibold text-foreground tracking-tight">
                BADARSH AI
              </span>
              <span className="text-[11px] text-muted">&bull; 24/7 Studio Concierge</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Circular Luxury Badge Button */}
        <motion.button
          onClick={() => {
            setIsOpen((prev) => !prev);
            setShowTooltip(false);
          }}
          className={cn(
            "group relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 shadow-2xl active:scale-95",
            isOpen
              ? "border-accent bg-accent text-white shadow-accent/25"
              : "border-white/20 bg-[#141416]/95 text-foreground hover:border-white/40 hover:scale-105 backdrop-blur-2xl"
          )}
          whileTap={{ scale: 0.92 }}
          aria-label={isOpen ? "Close BADARSH AI Concierge" : "Open BADARSH AI Concierge"}
        >
          {/* Ambient Glow */}
          <span className="absolute -inset-1 rounded-full bg-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />

          {isOpen ? (
            <ChevronDown className="h-6 w-6 transition-transform duration-200" />
          ) : (
            <div className="relative flex items-center justify-center">
              {/* Luxury BADARSH Brand Emblem */}
              <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                <Image
                  src="/logo-icon-light-v3.png"
                  alt="BADARSH Emblem"
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>

              {/* Online indicator dot */}
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-[#141416] bg-emerald-500" />
              </span>
            </div>
          )}
        </motion.button>
      </div>

      {/* ─── Floating Apple-Grade Chat Island Modal ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 flex w-[calc(100vw-2rem)] sm:w-[410px] h-[80vh] sm:h-[580px] max-h-[640px] flex-col overflow-hidden rounded-3xl border border-border/80 bg-background/95 shadow-2xl backdrop-blur-3xl"
            style={{ WebkitBackdropFilter: "blur(28px) saturate(180%)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 bg-card/60 px-5 py-3.5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-white/10 bg-accent/15 p-1">
                  <Image
                    src="/logo-icon-light-v3.png"
                    alt="BADARSH Emblem"
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading text-sm font-bold text-foreground">
                      BADARSH AI
                    </h3>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.2 text-[10px] font-semibold text-emerald-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <p className="text-[11px] text-muted leading-tight">
                    Trained on 2026 Products &amp; Services
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  className="cursor-pointer rounded-full p-1.5 text-muted hover:bg-muted/30 hover:text-foreground transition-colors"
                  title="Reset conversation"
                  aria-label="Reset conversation"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer rounded-full p-1.5 text-muted hover:bg-muted/30 hover:text-foreground transition-colors"
                  title="Close AI Concierge"
                  aria-label="Close AI Concierge"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((message) => {
                const isUser = message.role === "user";
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "flex flex-col",
                      isUser ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 shadow-xs",
                        isUser
                          ? "max-w-[85%] rounded-br-xs bg-accent text-white"
                          : "max-w-[92%] rounded-bl-xs border border-border/60 bg-card/80 text-foreground"
                      )}
                    >
                      {isUser ? (
                        <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      ) : (
                        <RenderMessageContent text={message.content} />
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Thinking / Streaming Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/80 px-4 py-3 w-max"
                >
                  <Sparkles className="h-3.5 w-3.5 text-accent animate-spin" />
                  <span className="text-[12px] text-muted">
                    BADARSH AI is thinking...
                  </span>
                  <div className="flex gap-1 ml-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.3s]" />
                  </div>
                </motion.div>
              )}

              {/* Quick Starter Suggestions */}
              {!hasInteracted && messages.length <= 1 && (
                <div className="pt-2 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted px-1">
                    Suggested Inquiries
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {INITIAL_SUGGESTIONS.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(suggestion)}
                        className="cursor-pointer text-left rounded-xl border border-border/60 bg-card/50 hover:bg-card hover:border-accent/40 px-3 py-2 text-[12px] text-foreground/90 transition-all active:scale-[0.98]"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-border/60 bg-card/40 p-3 backdrop-blur-md">
              <form onSubmit={handleFormSubmit} className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about bundles, APKs, website prices..."
                  disabled={isLoading}
                  className="w-full rounded-full border border-border/70 bg-background/90 px-4 py-2.5 pr-11 text-[13px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-accent text-white shadow-xs hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>

              {/* Quick Direct Desk Action */}
              <div className="mt-2 flex items-center justify-between px-2 text-[11px] text-muted">
                <span>24/7 Studio Concierge</span>
                <a
                  href={getWhatsAppUrl("Hi BADARSH! I'd like to chat with the founders.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-emerald-500 hover:underline"
                >
                  <MessageSquare className="h-3 w-3" />
                  <span>Direct WhatsApp Desk</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
