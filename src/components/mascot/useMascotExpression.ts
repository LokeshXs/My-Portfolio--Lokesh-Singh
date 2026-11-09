"use client";

// Decides which face the mascot shows, based on what the chat is doing.
// Highest priority first:
//   1. an error just happened        → sad      (for a few seconds)
//   2. an email was just sent         → heart    (for a few seconds)
//   3. waiting for the AI's answer    → thinking
//   4. the answer is streaming in     → happy
//   5. the AI picked a mood for its reply → that mood (for a few seconds)
//   6. the mouse is over the button   → excited
//   7. nothing happening              → idle (with blinking)

import { useEffect, useState } from "react";
import type { ChatStatus, UIMessage } from "ai";
import type { Mood } from "@/lib/ai/types";
import type { Expression } from "./expressions";

/** A mood from the AI, with an id so the same mood twice in a row still restarts the timer. */
export type AiMood = { mood: Mood; id: number };

const FLASH_MS = 4000; // how long sad/heart stay before going back to normal

/** True while `key` is new — for `ms` after it first appears. */
function useRecent(key: string | null, ms: number): boolean {
  const [expiredKey, setExpiredKey] = useState<string | null>(null);
  useEffect(() => {
    if (!key) return;
    const timer = window.setTimeout(() => setExpiredKey(key), ms);
    return () => window.clearTimeout(timer);
  }, [key, ms]);
  return key !== null && key !== expiredKey;
}

/** The id of the most recent sendEmail tool call that succeeded, if any. */
function lastSentEmailId(messages: UIMessage[]): string | null {
  for (let m = messages.length - 1; m >= 0; m--) {
    for (const part of messages[m].parts) {
      if (part.type === "tool-sendEmail" && part.state === "output-available") {
        return part.toolCallId;
      }
    }
  }
  return null;
}

export function useMascotExpression({
  status,
  error,
  messages,
  hovered,
  aiMood,
}: {
  status: ChatStatus;
  error: Error | undefined;
  messages: UIMessage[];
  hovered: boolean;
  aiMood: AiMood | null;
}): Expression {
  // Each error/email/mood gets its own key, so a NEW one restarts the few-second "flash".
  const errorKey = error ? `${messages.length}:${error.message}` : null;
  const recentError = useRecent(errorKey, FLASH_MS);
  const recentEmail = useRecent(lastSentEmailId(messages), FLASH_MS);
  const recentMood = useRecent(aiMood ? String(aiMood.id) : null, FLASH_MS);

  if (recentError) return "sad";
  if (recentEmail) return "heart";
  if (status === "submitted") return "thinking";
  if (status === "streaming") return "happy";
  if (recentMood && aiMood) return aiMood.mood;
  if (hovered) return "excited";
  return "idle";
}
