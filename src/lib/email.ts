// Sends a visitor's message to Lokesh's inbox using Resend.
// Used by the AI chatbot's sendEmail tool.

import { Resend } from "resend";

type InquiryType = "freelance" | "full-time" | "other";

const SUBJECT_LABEL: Record<InquiryType, string> = {
  freelance: "Freelance",
  "full-time": "Full-time",
  other: "Message",
};

export async function sendContactEmail(input: {
  name: string;
  email: string;
  type: InquiryType;
  description: string;
  source: string; // where it came from, e.g. "AI chat"
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  if (!apiKey || !to) {
    throw new Error("RESEND_API_KEY or CONTACT_EMAIL is missing in .env.local");
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    // Without your own domain, Resend only allows this "from" address.
    from: "Portfolio <onboarding@resend.dev>",
    to,
    // Pressing "Reply" in Gmail answers the visitor directly.
    replyTo: input.email,
    subject: `[${SUBJECT_LABEL[input.type]}] ${input.name} — via your portfolio`,
    // Plain text keeps it simple and safe (no HTML from visitors).
    text: [
      `Name:  ${input.name}`,
      `Email: ${input.email}`,
      `Type:  ${SUBJECT_LABEL[input.type]}`,
      `From:  ${input.source}`,
      "",
      input.description,
    ].join("\n"),
  });

  if (error) {
    throw new Error(`Resend failed: ${error.message}`);
  }
}
