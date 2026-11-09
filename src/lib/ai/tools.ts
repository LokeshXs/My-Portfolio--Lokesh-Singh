// STEP 5 — TOOLS: things the AI is allowed to DO (not just say).
//
// The AI never runs this code itself. It only ASKS to use a tool, by sending back:
//   "please call sendEmail with { name, email, type, description }"
// The AI SDK checks those inputs against the schema below, runs `execute` on OUR server,
// and gives the result back to the AI so it can tell the visitor what happened.

import { tool } from "ai";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";
import { DAY, rateLimit } from "@/lib/rate-limit";

// STEP 6 — email caps, so nobody can flood your inbox through the chat.
const EMAILS_PER_VISITOR_PER_DAY = 3;
const EMAILS_TOTAL_PER_DAY = 30;

// A function that builds the tools for ONE request, so the tool knows who's asking (their IP).
export function createTools({ ip }: { ip: string }) {
  const sendEmail = tool({
    // The description is how the AI knows WHEN to use this tool. Write it like instructions.
    description:
      "Send a message from a website visitor to Lokesh by email. " +
      "Only use this after the visitor has given their name, email, inquiry type and description " +
      "AND has confirmed they want to send it.",

    // The inputs the AI must fill in. .describe() tells the AI what each field means.
    inputSchema: z.object({
      name: z.string().min(1).max(100).describe("The visitor's name"),
      email: z.email().describe("The visitor's email address, so Lokesh can reply"),
      type: z
        .enum(["freelance", "full-time", "other"])
        .describe(
          "freelance = hire Lokesh for a project, full-time = a full-time job offer, " +
            "other = collaboration, a question, or just saying hi",
        ),
      description: z
        .string()
        .min(1)
        .max(2000)
        .describe("What the visitor wants or needs, in their own words"),
    }),

    // What actually happens when the tool runs.
    execute: async ({ name, email, type, description }) => {
      // STEP 6: check the caps BEFORE sending.
      if (
        !rateLimit(`email:${ip}`, EMAILS_PER_VISITOR_PER_DAY, DAY) ||
        !rateLimit("email:all", EMAILS_TOTAL_PER_DAY, DAY)
      ) {
        throw new Error(
          "Too many messages have been sent today. Ask the visitor to reach Lokesh on LinkedIn instead.",
        );
      }

      try {
        await sendContactEmail({ name, email, type, description, source: "AI chat" });
        return { success: true };
      } catch (err) {
        // Log the real reason for you (in the server terminal / Vercel logs)…
        console.error("sendEmail tool failed:", err);
        // …but only tell the AI (and so the visitor) a simple message — never internal details.
        throw new Error("The message could not be sent right now.");
      }
    },
  });

  return { sendEmail };
}
