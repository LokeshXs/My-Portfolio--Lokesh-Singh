// Types shared by the chat API (server) and the chat widget (browser).

import type { InferUITools, UIMessage } from "ai";
import type { createTools } from "./tools"; // type-only: no server code reaches the browser

/** The moods the AI may pick for the mascot. Each one is also a mascot face. */
export const MOODS = ["happy", "excited", "thinking", "heart", "sad"] as const;
export type Mood = (typeof MOODS)[number];

/** The chat's tools, as the browser sees them (their inputs and outputs are fully typed). */
export type ChatTools = InferUITools<ReturnType<typeof createTools>>;

/**
 * Our chat messages: text, tool parts (typed from ChatTools, so cards know their data), and one
 * extra kinds of data parts: `data-mood` (the mascot's mood for the reply) and `data-quota`
 * (how many AI messages the visitor has left today, sent only when it's running low).
 */
export type ChatUIMessage = UIMessage<never, { mood: Mood; quota: { remaining: number } }, ChatTools>;
