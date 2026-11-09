"use client";

// The chat itself: messages + quick actions + input.
// useChat keeps the list of messages, sends them to /api/chat, and updates the screen
// as the answer streams in. We render each message's "parts": text (as formatted markdown),
// tool cards (resume, contacts, projects… — generative UI), and the email status.

import { useEffect, useRef, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { useChat, type Chat } from "@ai-sdk/react";
import type { ChatUIMessage } from "@/lib/ai/types";
import { IconSend2 } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ToolCard, { isShowToolPart } from "./cards/ToolCard";

// One tap = one ready-made question (no typing needed).
const QUICK_ACTIONS = [
  { label: "📄 Resume", ask: "Can I see Lokesh's resume?" },
  { label: "🚀 Projects", ask: "Show me Lokesh's projects" },
  { label: "💼 Experience", ask: "What's Lokesh's work experience?" },
  { label: "📅 Book a call", ask: "I'd like to book a call with Lokesh" },
  { label: "🔗 Contact", ask: "How can I contact Lokesh?" },
];

// How Byte's markdown answers look in the small bubble. No raw HTML is ever rendered.
const MARKDOWN: Components = {
  p: ({ children }) => <p className="[&:not(:first-child)]:mt-2">{children}</p>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-orange-600 underline underline-offset-2">
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  ul: ({ children }) => <ul className="mt-1 list-disc space-y-0.5 pl-4">{children}</ul>,
  ol: ({ children }) => <ol className="mt-1 list-decimal space-y-0.5 pl-4">{children}</ol>,
  code: ({ children }) => <code className="rounded bg-black/5 px-1 text-[0.85em] dark:bg-white/10">{children}</code>,
};

const BUBBLE = "max-w-[85%] break-words rounded-2xl px-3 py-2 text-sm";

type ChatBoxProps = {
  /** The shared chat (created in ChatWidget), so the mascot can see the same state. */
  chat: Chat<ChatUIMessage>;
  /** Tells the parent when the visitor is typing (input focused and not empty). */
  onTypingChange?: (typing: boolean) => void;
  /** Called when a visitor uses a card (download, open a link, copy) — Byte reacts. */
  onCardAction?: () => void;
};

export default function ChatBox({ chat, onTypingChange, onCardAction }: ChatBoxProps) {
  const { messages, sendMessage, status, error } = useChat({ chat });
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const typing = focused && input.trim().length > 0;
  useEffect(() => {
    onTypingChange?.(typing);
  }, [typing, onTypingChange]);

  // "submitted" = waiting for the first word, "streaming" = words are arriving
  const isBusy = status === "submitted" || status === "streaming";

  // Keep the newest message in view while the answer streams in.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, status]);

  function send(text: string) {
    if (!text.trim() || isBusy) return;
    sendMessage({ text });
    setInput("");
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Hi! 👋 I&apos;m Byte, Lokesh&apos;s AI assistant. Ask me anything about his projects, skills, or
            experience — or tap a button below.
          </p>
        )}

        {messages.map((message) =>
          message.role === "user" ? (
            <div key={message.id} className="flex justify-end">
              <div className={`${BUBBLE} rounded-br-sm bg-neutral-900 whitespace-pre-wrap text-white dark:bg-white dark:text-neutral-900`}>
                {message.parts.map((part) => (part.type === "text" ? part.text : "")).join("")}
              </div>
            </div>
          ) : (
            <AssistantMessage key={message.id} message={message} onCardAction={onCardAction} />
          ),
        )}

        {status === "submitted" && <p className="animate-pulse text-sm text-neutral-500">Thinking…</p>}
        {error && (
          <p className="text-sm text-red-500">
            {/* 400/429 = our own friendly limit messages from /api/chat; anything else = generic. */}
            {"statusCode" in error && (error.statusCode === 400 || error.statusCode === 429)
              ? error.message
              : "Something went wrong. Please try again."}
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick actions — always available, scroll sideways on small screens */}
      <div className="flex gap-1.5 overflow-x-auto border-t border-neutral-200 px-3 pt-2.5 [scrollbar-width:none] dark:border-neutral-800">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => send(action.ask)}
            disabled={isBusy}
            className="shrink-0 cursor-pointer rounded-full border border-neutral-200 px-2.5 py-1 text-xs whitespace-nowrap text-neutral-700 transition-colors hover:border-orange-500/60 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-orange-950/30"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2 p-3"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask about Lokesh…"
          aria-label="Your message"
          maxLength={1000}
        />
        <Button
          type="submit"
          size="icon"
          variant="secondary"
          disabled={isBusy || !input.trim()}
          aria-label="Send message"
          className="cursor-pointer"
        >
          <IconSend2 className="size-4" />
        </Button>
      </form>
    </div>
  );
}

/** Byte's message: its words in one bubble first, then any cards and status lines below it. */
function AssistantMessage({ message, onCardAction }: { message: ChatUIMessage; onCardAction?: () => void }) {
  const text = message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .filter((t) => t.trim())
    .join("\n\n");

  return (
    <div className="flex flex-col items-start gap-2">
      {text && (
        <div className={`${BUBBLE} rounded-bl-sm bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100`}>
          <ReactMarkdown components={MARKDOWN}>{text}</ReactMarkdown>
        </div>
      )}

      {message.parts.map((part, i) => {
        if (isShowToolPart(part)) return <ToolCard key={i} part={part} onAction={onCardAction} />;

        if (part.type === "tool-sendEmail") {
          const label =
            part.state === "output-available"
              ? "✅ Message sent to Lokesh"
              : part.state === "output-error"
                ? "❌ Couldn't send the message"
                : "📧 Sending your message…";
          return (
            <span key={i} className="text-xs font-medium text-neutral-500">
              {label}
            </span>
          );
        }

        return null;
      })}
    </div>
  );
}
