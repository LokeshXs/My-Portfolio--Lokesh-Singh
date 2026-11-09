"use client";

// The floating mascot button (bottom-right) that opens the chat panel.
//
// ONE shared `Chat` object holds the conversation. Both the chat box (messages/input)
// and the mascot (its mood) read from it, so they always agree on what's happening.
// The panel stays mounted when closed (just hidden), so the conversation isn't lost.

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { IconX } from "@tabler/icons-react";
import { Chat, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ChatBox from "./ChatBox";
import Mascot from "@/components/mascot/Mascot";
import TerminalIcon from "@/components/mascot/TerminalIcon";
import { BYTE_TOOLTIP_CLASS } from "@/components/mascot/tooltipStyles";
import { useMascotExpression, type AiMood } from "@/components/mascot/useMascotExpression";
import { registerByteElement, useByteAct } from "@/components/mascot/byteStore";
import { useByteDirector } from "@/components/mascot/useByteDirector";
import { NIGHT_LINE, isNightTime } from "@/components/mascot/byteScripts";
import type { ChatUIMessage } from "@/lib/ai/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CENTER, useEyeFollow } from "@/components/mascot/useEyeFollow";
import type { Expression } from "@/components/mascot/expressions";

// A different line each time the visitor hovers the mascot (edit freely!).
const TIPS = [
  "Psst… I know everything about Lokesh 👀",
  "Hiring? I can pass him a message ✉️",
  "Ask me about his projects 🚀",
  "I don't bite. I only blink.",
  "Beep boop — click to chat 🤖",
  "Curious about his tech stack? Ask away ⚡",
];

// Faces whose eyes follow the mouse. The others have their own eye movement
// (thinking looks around, sad looks down, the heart stays centred).
const FOLLOWS_MOUSE: Expression[] = ["idle", "happy", "excited"];

// Page-load hello from Byte:
const HELLO_DELAY_MS = 1000; // wait a moment, so the page's own entrance animations go first
const HELLO_MS = 1400; // Byte looks happy + a light sweeps once around its ring
const AUTO_TIP = "Click me anytime 👋";
const AUTO_TIP_DELAY_MS = 600; // then this tip pops up by itself…
const AUTO_TIP_MS = 3000; // …for a few seconds
const TIP_FADE_MS = 300; // tooltip fade-out time (keep the text steady until it's gone)
const CARD_HEART_MS = 2000; // heart eyes after a visitor uses a chat card

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [typing, setTyping] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(-1); // -1 → the first hover shows TIPS[0]
  const [hello, setHello] = useState<Expression | null>(null); // the face Byte makes while saying hello
  const [autoTip, setAutoTip] = useState<string | null>(null); // text of the one-time hello tip
  const [autoTipOpen, setAutoTipOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // A visitor used a chat card (downloaded the resume, opened a link…) → heart eyes for a moment.
  const [cardHeart, setCardHeart] = useState(false);
  const cardHeartTimer = useRef(0);
  const onCardAction = useCallback(() => {
    setCardHeart(true);
    window.clearTimeout(cardHeartTimer.current);
    cardHeartTimer.current = window.setTimeout(() => setCardHeart(false), CARD_HEART_MS);
  }, []);

  // Hide the hello tip, but keep its text until the fade-out ends (so it never flips mid-fade).
  const hideAutoTip = useCallback(() => {
    setAutoTipOpen(false);
    window.setTimeout(() => setAutoTip(null), TIP_FADE_MS);
  }, []);

  // On page load, Byte says hello: happy face + ring light sweep, then "Click me anytime 👋".
  // Late at night (visitor's clock) it's a sleepy face and "Working late? Same 🌙" instead.
  useEffect(() => {
    const night = isNightTime();
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    later(() => setHello(night ? "sleep" : "happy"), HELLO_DELAY_MS);
    later(() => setHello(null), HELLO_DELAY_MS + HELLO_MS + (night ? 1500 : 0));
    later(() => {
      setAutoTip(night ? NIGHT_LINE : AUTO_TIP);
      setAutoTipOpen(true);
    }, HELLO_DELAY_MS + AUTO_TIP_DELAY_MS);
    later(hideAutoTip, HELLO_DELAY_MS + AUTO_TIP_DELAY_MS + AUTO_TIP_MS);
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [hideAutoTip]);

  const [aiMood, setAiMood] = useState<AiMood | null>(null);
  const [messagesLeft, setMessagesLeft] = useState<number | null>(null); // only known once it's running low

  // Created once, shared by ChatBox and the mascot.
  const [chat] = useState(
    () =>
      new Chat<ChatUIMessage>({
        transport: new DefaultChatTransport({ api: "/api/chat" }),
        // MILESTONE 5: the server sends the AI-picked mood as a "data-mood" part after each reply.
        onData: (part) => {
          if (part.type === "data-mood") {
            setAiMood((prev) => ({ mood: part.data, id: (prev?.id ?? 0) + 1 }));
          }
          // The server says how many AI messages are left today (only when it's running low).
          if (part.type === "data-quota") setMessagesLeft(part.data.remaining);
        },
      }),
  );
  const { status, error, messages } = useChat({ chat });
  const chatExpression = useMascotExpression({ status, error, messages, hovered, aiMood });

  // The director makes Byte do things on its own (sleep, chat with the hero Byte, react…).
  // Paused while the chat is open.
  const pathname = usePathname();
  useByteDirector({ paused: open, pathname });
  const act = useByteAct("corner");
  useEffect(() => {
    registerByteElement("corner", buttonRef.current);
    return () => registerByteElement("corner", null);
  }, []);

  // Priority: a card was just used → the director's act → the page-load hello → the chat's own mood.
  const expression: Expression = cardHeart ? "heart" : (act.expression ?? hello ?? chatExpression);
  const eyes = useEyeFollow(buttonRef, { typing: open && typing });
  const look = act.look ?? (FOLLOWS_MOUSE.includes(expression) ? eyes : CENTER);

  // Close with the Escape key.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Chat panel */}
      <motion.div
        role="dialog"
        aria-label="Chat with Byte, Lokesh's AI assistant"
        inert={!open}
        initial={false}
        animate={
          open
            ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
            : { opacity: 0, y: 16, scale: 0.97, filter: "blur(6px)" }
        }
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`fixed right-4 bottom-20 z-50 flex h-[min(34rem,calc(100dvh-7rem))] w-[calc(100vw-2rem)] max-w-sm origin-bottom-right flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl md:right-6 md:bottom-24 dark:border-neutral-800 dark:bg-neutral-900 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-white">
              <TerminalIcon size={18} />
              Byte
            </p>
            <p className="text-xs text-neutral-500">Lokesh&apos;s AI assistant · may make mistakes</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="cursor-pointer rounded-md p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <IconX className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1">
          <ChatBox chat={chat} onTypingChange={setTyping} onCardAction={onCardAction} messagesLeft={messagesLeft} />
        </div>
      </motion.div>

      {/* Floating mascot button — always visible, so it can react while the chat is open. */}
      <Tooltip
        // Shown on hover, or by itself once after the page loads. Hidden while the chat is open.
        open={(tipOpen || autoTipOpen || !!act.talking) && !open}
        onOpenChange={(isOpen) => {
          setTipOpen(isOpen);
          // Pick the next tip as it OPENS (not as it closes, or the text would flip while fading out).
          if (isOpen && autoTip === null && act.say === undefined) setTipIndex((i) => (i + 1) % TIPS.length);
          if (!isOpen && autoTip !== null) hideAutoTip();
        }}
        delayDuration={300}
      >
        <TooltipTrigger asChild>
          <motion.button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            aria-label={open ? "Close chat" : "Open chat with Byte, Lokesh's AI assistant"}
            aria-expanded={open}
            whileTap={{ scale: 0.92 }}
            className="fixed right-4 bottom-4 z-50 cursor-pointer rounded-full shadow-lg outline-offset-4 focus-visible:outline-2 focus-visible:outline-orange-600 md:right-6 md:bottom-6"
          >
            <Mascot
              expression={expression}
              look={look}
              size={56}
              highlight={hello !== null}
              effect={act.effect}
              wobble={act.wobble}
            />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent
          side="left"
          sideOffset={10}
          // Byte's style: black "screen", orange LED-style text (shared with the hero badge).
          className={BYTE_TOOLTIP_CLASS}
        >
          {act.say ?? autoTip ?? TIPS[Math.max(0, tipIndex)]}
        </TooltipContent>
      </Tooltip>
    </>
  );
}
