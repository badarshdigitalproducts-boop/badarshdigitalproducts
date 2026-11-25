"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  RotateCcw,
  ArrowRight,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioPlayer } from "@/context/audio-player-context";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

const INITIAL_SUGGESTIONS = [
  "2026 Video Mega Bundle details",
  "4K export presets & editing workflows",
  "Website development pricing (₹3k–₹15k)",
  "1-Click Lightroom Presets guide",
  "Commercial client licensing rights",
];

// Helper: Parse markdown-like text with links, bolding, and bullet points cleanly
function RenderMessageContent({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 text-[13px] leading-relaxed break-words">
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
              className="font-heading text-[13px] font-bold text-foreground mt-1.5 mb-0.5"
            >
              {trimmed.replace(/^###\s+/, "")}
            </h4>
          );
        }

        // Bullet points: - or * or •
        const isBullet =
          trimmed.startsWith("- ") ||
          trimmed.startsWith("* ") ||
          trimmed.startsWith("• ");
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
  const { currentTrack } = useAudioPlayer();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome message (crisp, simple, non-repetitive)
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome-msg",
          role: "assistant",
          content:
            "Hi! I'm the BADARSH Studio Concierge. How can I help you with our creator tools, editing apps, or custom web development today?",
          createdAt: Date.now(),
        },
      ]);
    }
  }, [messages.length]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading, scrollToBottom]);

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
        throw new Error("Failed to reach agent");
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I'm here to assist. Ask me anything about our tools or services.",
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
            "I'm here to assist! Explore our [All-in-One Bundles](/bundles) or submit your requirements on our [Executive Studio Desk](/about#contact).",
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
          "Conversation reset. How can I help you with our creator tools, editing apps, or custom web development?",
        createdAt: Date.now(),
      },
    ]);
    setHasInteracted(false);
  };

  return (
    <>
      {/* ─── Floating Trigger Button (Clean, No Annoying Notification) ─── */}
      <div className={cn(
        "fixed right-6 z-50 transition-all duration-300",
        currentTrack ? "bottom-24 sm:bottom-24" : "bottom-6"
      )}>
        <motion.button
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "group relative flex h-13 w-13 sm:h-14 sm:w-14 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 shadow-xl active:scale-95",
            isOpen
              ? "border-accent bg-accent text-white shadow-accent/25"
              : "border-border bg-card text-foreground hover:border-foreground/30 hover:scale-105 shadow-md"
          )}
          whileTap={{ scale: 0.92 }}
          aria-label={isOpen ? "Close AI Concierge" : "Open AI Concierge"}
        >
          {isOpen ? (
            <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200" />
          ) : (
            <div className="relative flex items-center justify-center">
              {/* Luxury BADARSH Brand Emblem */}
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-lg">
                <Image
                  src="/logo-icon-light-v3.png"
                  alt="BADARSH Emblem"
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>

              {/* Minimalist Live Status Dot */}
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#141416] bg-emerald-500" />
              </span>
            </div>
          )}
        </motion.button>
      </div>

      {/* ─── Floating Clean Chat Modal ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "fixed right-4 sm:right-6 z-50 flex w-[calc(100vw-2rem)] sm:w-[390px] h-[75vh] sm:h-[540px] max-h-[600px] flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl transition-all duration-300",
              currentTrack ? "bottom-40 sm:bottom-42" : "bottom-22"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="relative h-8 w-8 overflow-hidden rounded-xl border border-white/10 bg-accent/15 p-1">
                  <Image
                    src="/logo-icon-light-v3.png"
                    alt="BADARSH Emblem"
                    width={40}
                    height={40}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading text-[13px] font-bold text-foreground">
                      BADARSH AI
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-500">
                      Online
                    </span>
                  </div>
                  <p className="text-[10px] text-muted leading-tight">
                    Studio Concierge
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
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer rounded-full p-1.5 text-muted hover:bg-muted/30 hover:text-foreground transition-colors"
                  title="Close AI Concierge"
                  aria-label="Close AI Concierge"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto px-3.5 py-3.5 space-y-3">
              {messages.map((message) => {
                const isUser = message.role === "user";
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className={cn(
                      "flex flex-col",
                      isUser ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-2.5 shadow-xs",
                        isUser
                          ? "max-w-[85%] rounded-br-xs bg-accent text-white"
                          : "max-w-[92%] rounded-bl-xs border border-border/60 bg-card/85 text-foreground"
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

              {/* Minimal Clean Loading Dots (No flashy "BADARSH thinking" text) */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1.5 rounded-2xl border border-border/50 bg-card/70 px-3.5 py-2.5 w-max"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/80 animate-bounce [animation-delay:0s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/80 animate-bounce [animation-delay:0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/80 animate-bounce [animation-delay:0.3s]" />
                </motion.div>
              )}

              {/* Initial Quick Suggestion Chips */}
              {!hasInteracted && messages.length <= 1 && (
                <div className="pt-2 space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted px-1">
                    Quick questions:
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

            {/* Input Bar — Clean & No WhatsApp */}
            <div className="border-t border-border bg-card p-2.5">
              <form onSubmit={handleFormSubmit} className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                  className="w-full rounded-full border border-border/70 bg-background/90 px-3.5 py-2 pr-10 text-[12.5px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-accent text-white shadow-xs hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Send message"
                >
                  <Send className="h-3 w-3" />
                </button>
              </form>

              {/* Micro Studio Desk Link (No WhatsApp) */}
              <div className="mt-1.5 flex items-center justify-between px-2 text-[10.5px] text-muted">
                <span>BADARSH Studio Intelligence</span>
                <Link
                  href="/about#contact"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-0.5 font-medium text-accent hover:underline"
                >
                  <span>Submit Studio Brief</span>
                  <ArrowRight className="h-2.5 w-2.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
