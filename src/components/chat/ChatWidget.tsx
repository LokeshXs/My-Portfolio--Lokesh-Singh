"use client";

// STEP 4 — the floating chat button (bottom-right) that opens the chat panel.
//
// The panel stays mounted when closed (just hidden), so the conversation
// isn't lost when the visitor closes and reopens it.

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { IconMessageCircle, IconX } from "@tabler/icons-react";
import ChatBox from "./ChatBox";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

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
        aria-label="Chat with Lokesh's AI assistant"
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
            <p className="text-sm font-medium text-neutral-900 dark:text-white">Ask about Lokesh</p>
            <p className="text-xs text-neutral-500">AI assistant · may make mistakes</p>
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
          <ChatBox />
        </div>
      </motion.div>

      {/* Floating button */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-4 bottom-4 z-50 flex size-12 cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg md:right-6 md:bottom-6 md:size-14 dark:bg-white dark:text-neutral-900"
      >
        {open ? <IconX className="size-5" /> : <IconMessageCircle className="size-6" />}
      </motion.button>
    </>
  );
}
