"use client";

// The chat itself: messages + input.
// useChat keeps the list of messages, sends them to /api/chat, and updates the screen
// as the answer streams in. We just render the messages and an input.

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { IconSend2 } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = ["What has Lokesh built?", "What's his experience?", "What's his tech stack?"];

export default function ChatBox() {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

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
          <div className="space-y-3">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Hi! 👋 I&apos;m Lokesh&apos;s AI assistant. Ask me anything about his projects,
              skills, or experience.
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="cursor-pointer rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm ${
                message.role === "user"
                  ? "rounded-br-sm bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "rounded-bl-sm bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
              }`}
            >
              {/* A message is made of "parts": text, and (STEP 5) tool calls. */}
              {message.parts.map((part, i) => {
                if (part.type === "text") return <span key={i}>{part.text}</span>;

                if (part.type === "tool-sendEmail") {
                  // A tool part goes through states: input-streaming → input-available → output-available (or output-error)
                  const label =
                    part.state === "output-available"
                      ? "✅ Message sent to Lokesh"
                      : part.state === "output-error"
                        ? "❌ Couldn't send the message"
                        : "📧 Sending your message…";
                  return (
                    <span key={i} className="my-1 block text-xs font-medium opacity-80">
                      {label}
                    </span>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}

        {status === "submitted" && (
          <p className="animate-pulse text-sm text-neutral-500">Thinking…</p>
        )}
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

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2 border-t border-neutral-200 p-3 dark:border-neutral-800"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
