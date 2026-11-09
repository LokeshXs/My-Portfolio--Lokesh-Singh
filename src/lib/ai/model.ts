// The ONE place where we choose the AI provider + model.
// To switch provider later (e.g. Anthropic, Google), change only this file.

import { openai } from "@ai-sdk/openai";

export const CHAT_MODEL = openai("gpt-5.4-mini");

// A smaller, cheaper model for tiny jobs — like picking the mascot's mood.
export const MOOD_MODEL = openai("gpt-5.4-nano");
