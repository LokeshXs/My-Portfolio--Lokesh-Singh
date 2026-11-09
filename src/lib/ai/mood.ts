// MILESTONE 5 — STRUCTURED OUTPUT: the AI picks the mascot's mood.
//
// Normally an AI answers with free text ("I'd say it's quite happy!").
// With `Output.choice`, we tell the AI SDK: "the answer MUST be exactly one of these words".
// The SDK passes that rule to the model and checks the result — so we always get back
// a clean "happy" | "excited" | "thinking" | "heart" | "sad", ready to use in code.

import { generateText, Output } from "ai";
import { MOOD_MODEL } from "./model";
import { MOODS, type Mood } from "./types";

const MOOD_INSTRUCTIONS = `
You control the face of a small mascot on a portfolio website's chatbot.
Read what the visitor said and how the chatbot replied, then pick the ONE mood that fits best:
- excited: the visitor brings great news for Lokesh — wants to hire him (freelance or full-time),
  offers a job or collaboration, or praises his work (e.g. "wow", "amazing", "love it")
- heart: the visitor says thanks or a warm goodbye, or a message was just sent to Lokesh
- sad: the chatbot declines, apologises, or can't help
- thinking: the chatbot is unsure, or the question is about something it doesn't know
- happy: anything else — a normal, friendly, helpful exchange
Read the visitor's message first: if they want to hire or work with Lokesh, choose "excited"
even if the chatbot then asks them for details.
`.trim();

/**
 * Returns the mood for one exchange (visitor message + chatbot reply),
 * or null if anything goes wrong (the mascot just stays as it is).
 */
export async function pickMood({
  visitorMessage,
  reply,
}: {
  visitorMessage: string;
  reply: string;
}): Promise<Mood | null> {
  if (!reply.trim()) return null;
  try {
    const { output } = await generateText({
      model: MOOD_MODEL,
      instructions: MOOD_INSTRUCTIONS,
      prompt:
        `Visitor said:\n"""\n${visitorMessage.slice(0, 1000)}\n"""\n\n` +
        `Chatbot replied:\n"""\n${reply.slice(0, 1500)}\n"""`,
      // The structured output: exactly one of our 5 moods.
      output: Output.choice({ options: [...MOODS] }),
      // A tiny job: little thinking needed, and the answer is one word.
      providerOptions: { openai: { reasoningEffort: "low" } },
      maxOutputTokens: 300,
    });
    return output;
  } catch (err) {
    console.error("pickMood failed:", err);
    return null;
  }
}
