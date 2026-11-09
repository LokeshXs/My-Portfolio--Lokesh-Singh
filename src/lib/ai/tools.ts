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
import { PROJECTS } from "@/lib/data";

// GENERATIVE UI — "show" tools. They don't DO anything on the server: they let the AI choose a
// card for the chat to display (resume, contacts, a call, projects, experience). Each one returns
// only WHICH items to show — the browser looks up the details — because tool results are sent back
// to the AI with every later message, and small results = fewer tokens.
export const CONTACT_LINKS = ["linkedin", "github", "x", "email", "schedule"] as const;
// Project names come straight from the portfolio data: the AI can only pick projects that exist.
const PROJECT_NAMES = PROJECTS.map((p) => p.title) as [string, ...string[]];

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
      // The HTML5 email pattern (same as <input type="email">). Zod's default pattern uses regex
      // "lookaround", which OpenAI can't use in tool schemas (it would drop it with a warning).
      email: z
        .email({ pattern: z.regexes.html5Email })
        .describe("The visitor's email address, so Lokesh can reply"),
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

  const showResume = tool({
    description:
      "Show a card where the visitor can download or open Lokesh's resume (PDF). " +
      "Use it whenever they ask for his resume or CV.",
    inputSchema: z.object({}),
    execute: async () => ({ shown: "resume" as const }),
  });

  const showContact = tool({
    description:
      "Show buttons for Lokesh's contact links. Include only the links the visitor asked for " +
      "(e.g. just linkedin); include all five (linkedin, github, x, email, schedule) if they ask generally how to reach or contact him.",
    inputSchema: z.object({
      links: z
        .array(z.enum(CONTACT_LINKS))
        .min(1)
        .describe("Which links to show: linkedin, github, x (Twitter), email, schedule (book a call)"),
    }),
    execute: async ({ links }) => ({ links }),
  });

  const showBookCall = tool({
    description:
      "Show a card to book a call or meeting with Lokesh (via Cal.com). " +
      "Use it when the visitor wants to schedule a call, meeting, or chat with him.",
    inputSchema: z.object({}),
    execute: async () => ({ shown: "book-call" as const }),
  });

  const showProjects = tool({
    description:
      "Show visual cards for Lokesh's projects (screenshot, description, tech, link). " +
      "Pick the projects that match the question; pick all of them if they ask about his projects in general.",
    inputSchema: z.object({
      projects: z.array(z.enum(PROJECT_NAMES)).min(1).describe("Exact project names to show"),
    }),
    execute: async ({ projects }) => ({ projects }),
  });

  const showExperience = tool({
    description:
      "Show a timeline card of Lokesh's work experience (companies, roles, dates). " +
      "Use it when asked about his experience, jobs, career, or where he has worked.",
    inputSchema: z.object({}),
    execute: async () => ({ shown: "experience" as const }),
  });

  return { sendEmail, showResume, showContact, showBookCall, showProjects, showExperience };
}
