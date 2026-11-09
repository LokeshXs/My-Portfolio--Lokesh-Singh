// The chat API (runs on the server, so the API key stays secret).
//
// The browser sends the WHOLE conversation every time, because the AI has no memory.
// We check it's safe and not too big, add the system prompt, and stream the answer back.

import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  isStepCount,
} from "ai";
import { z } from "zod";
import { CHAT_MODEL } from "@/lib/ai/model";
import { pickMood } from "@/lib/ai/mood";
import type { ChatUIMessage } from "@/lib/ai/types";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { createTools } from "@/lib/ai/tools";
import { DAY, MINUTE, checkRateLimit, formatDuration, getClientIp } from "@/lib/rate-limit";

// STEP 6 — limits (tweak these numbers any time)
const MAX_MESSAGES_PER_CHAT = 30; // longer chats cost more, because the whole history is re-sent
const MAX_CHARS_PER_MESSAGE = 1000; // stops someone pasting a whole book
const MAX_REQUESTS_PER_DAY = 20; // per visitor — the daily AI chat allowance
const MAX_REQUESTS_PER_MINUTE = 8; // per visitor — stops rapid-fire spam / scripts
const WARN_WHEN_LEFT = 5; // tell the visitor how many are left once it's this low

// STEP 6 — what a valid request must look like. Anything else is rejected.
const requestSchema = z.object({
  messages: z
    .array(
      z.looseObject({
        // Only "user" and "assistant". A "system" message from the browser could
        // override our rules, so it's never allowed in.
        role: z.enum(["user", "assistant"]),
        parts: z.array(z.looseObject({ type: z.string(), text: z.string().optional() })),
      }),
    )
    .min(1),
});

/** The text of the visitor's latest message (used to pick the mascot's mood). */
function lastVisitorText(messages: ChatUIMessage[]): string {
  const last = messages.findLast((m) => m.role === "user");
  return last?.parts.map((p) => (p.type === "text" ? p.text : "")).join(" ") ?? "";
}

/** A 429 "limit reached" reply: a friendly message + the standard Retry-After header (seconds). */
function limitReached(message: string, resetInMs: number) {
  return new Response(message, {
    status: 429,
    headers: { "Retry-After": String(Math.ceil(resetInMs / 1000)) },
  });
}

export async function POST(request: Request) {
  // 1. Rate limits: sending too fast, or over today's allowance?
  //    The per-minute check comes first, so a "too fast" request doesn't use up a daily message.
  const ip = getClientIp(request);
  const burst = checkRateLimit(`chat-burst:${ip}`, MAX_REQUESTS_PER_MINUTE, MINUTE);
  if (!burst.allowed) {
    return limitReached(
      `Whoa, that's fast! Please wait ${formatDuration(burst.resetInMs)} before sending another message.`,
      burst.resetInMs,
    );
  }
  const daily = checkRateLimit(`chat-day:${ip}`, MAX_REQUESTS_PER_DAY, DAY);
  if (!daily.allowed) {
    return limitReached(
      `You've used all ${MAX_REQUESTS_PER_DAY} of today's AI chat messages. ` +
        `Your limit resets in ${formatDuration(daily.resetInMs)} ⏳`,
      daily.resetInMs,
    );
  }

  // 2. Check the request has the right shape and isn't too big.
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return new Response("Invalid request.", { status: 400 });
  }
  if (parsed.data.messages.length > MAX_MESSAGES_PER_CHAT) {
    return new Response("This chat is too long. Please refresh the page to start a new one.", {
      status: 400,
    });
  }
  const tooLong = parsed.data.messages.some((m) =>
    m.parts.some((p) => (p.text?.length ?? 0) > MAX_CHARS_PER_MESSAGE),
  );
  if (tooLong) {
    return new Response(`Please keep messages under ${MAX_CHARS_PER_MESSAGE} characters.`, {
      status: 400,
    });
  }
  const messages = parsed.data.messages as unknown as ChatUIMessage[];
  const modelMessages = await convertToModelMessages(messages);

  // 3. Build the response stream ourselves, so we can add the mascot's mood after the answer.
  const stream = createUIMessageStream<ChatUIMessage>({
    execute: async ({ writer }) => {
      // Running low on today's messages? Tell the chat (shown above the buttons, not saved in history).
      if (daily.remaining <= WARN_WHEN_LEFT) {
        writer.write({ type: "data-quota", data: { remaining: daily.remaining }, transient: true });
      }

      // 3a. Ask the model. streamText = the answer is written piece by piece.
      const result = streamText({
        model: CHAT_MODEL,
        instructions: SYSTEM_PROMPT,
        messages: modelMessages,
        // The tools the AI may use (built for this visitor, so email caps know who's asking).
        tools: createTools({ ip }),
        // By default the AI stops right after calling a tool. Allow a few "steps" so it can
        // call the tool, read the result, and then write a reply like "Done, message sent!".
        stopWhen: isStepCount(4),
        // STEP 6: cap how long one answer can be (output tokens cost the most).
        maxOutputTokens: 1000,
      });

      // 3b. Pass every piece of the answer to the browser as it arrives.
      //     (We hold back the "finish" signal until the mood is added.)
      for await (const chunk of result.toUIMessageStream<ChatUIMessage>({ sendFinish: false })) {
        writer.write(chunk);
      }

      // 3c. MILESTONE 5: a second, tiny AI call picks the mascot's mood for the reply.
      //     `transient` = deliver it to the browser once, without saving it in the chat history.
      const reply = await Promise.resolve(result.text).catch(() => ""); // "" if the answer failed
      const mood = await pickMood({ visitorMessage: lastVisitorText(messages), reply });
      if (mood) writer.write({ type: "data-mood", data: mood, transient: true });

      // 3d. Now the reply is really finished.
      writer.write({ type: "finish" });
    },
  });

  // 4. Send the stream back in the format useChat (in the browser) understands.
  return createUIMessageStreamResponse({ stream });
}
