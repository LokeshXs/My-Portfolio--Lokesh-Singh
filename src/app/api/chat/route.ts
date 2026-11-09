// The chat API (runs on the server, so the API key stays secret).
//
// The browser sends the WHOLE conversation every time, because the AI has no memory.
// We check it's safe and not too big, add the system prompt, and stream the answer back.

import { streamText, convertToModelMessages, isStepCount, type UIMessage } from "ai";
import { z } from "zod";
import { CHAT_MODEL } from "@/lib/ai/model";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { createTools } from "@/lib/ai/tools";
import { DAY, MINUTE, getClientIp, rateLimit } from "@/lib/rate-limit";

// STEP 6 — limits (tweak these numbers any time)
const MAX_MESSAGES_PER_CHAT = 30; // longer chats cost more, because the whole history is re-sent
const MAX_CHARS_PER_MESSAGE = 1000; // stops someone pasting a whole book
const MAX_REQUESTS_PER_10_MIN = 20; // per visitor
const MAX_REQUESTS_PER_DAY = 100; // per visitor

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

export async function POST(request: Request) {
  // 1. Rate limit: is this visitor sending too much?
  const ip = getClientIp(request);
  if (
    !rateLimit(`chat:${ip}`, MAX_REQUESTS_PER_10_MIN, 10 * MINUTE) ||
    !rateLimit(`chat-day:${ip}`, MAX_REQUESTS_PER_DAY, DAY)
  ) {
    return new Response("You're sending messages too quickly. Please wait a few minutes.", {
      status: 429,
    });
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
  const messages = parsed.data.messages as unknown as UIMessage[];

  // 3. Ask the model. streamText = send the answer back piece by piece as it's written.
  const result = streamText({
    model: CHAT_MODEL,
    instructions: SYSTEM_PROMPT,
    // The browser's message format includes UI details; convert it to the format the model expects.
    messages: await convertToModelMessages(messages),
    // The tools the AI may use (built for this visitor, so email caps know who's asking).
    tools: createTools({ ip }),
    // By default the AI stops right after calling a tool. Allow a few "steps" so it can
    // call the tool, read the result, and then write a reply like "Done, message sent!".
    stopWhen: isStepCount(3),
    // STEP 6: cap how long one answer can be (output tokens cost the most).
    maxOutputTokens: 1000,
  });

  // 4. Send the stream back in the format useChat (in the browser) understands.
  return result.toUIMessageStreamResponse();
}
