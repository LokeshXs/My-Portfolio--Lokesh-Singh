"use client";

// "How can I reach him?" → a list of contact buttons (only the ones the AI picked).

import { useState } from "react";
import {
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconCalendarEvent,
  IconCheck,
  IconCopy,
  IconMail,
  type Icon,
} from "@tabler/icons-react";
import { EMAIL_ADDRESS, GITHUB_URL, LINKEDIN_URL, SCHEDULE_CALL_URL, X_URL } from "@/lib/links";
import type { ChatTools } from "@/lib/ai/types";
import { CARD } from "./CardShell";

export type ContactLink = ChatTools["showContact"]["input"]["links"][number];

const handle = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const LINKS: Record<ContactLink, { label: string; detail: string; href: string; icon: Icon }> = {
  linkedin: { label: "LinkedIn", detail: handle(LINKEDIN_URL), href: LINKEDIN_URL, icon: IconBrandLinkedin },
  github: { label: "GitHub", detail: handle(GITHUB_URL), href: GITHUB_URL, icon: IconBrandGithub },
  x: { label: "X (Twitter)", detail: handle(X_URL), href: X_URL, icon: IconBrandX },
  email: { label: "Email", detail: EMAIL_ADDRESS, href: `mailto:${EMAIL_ADDRESS}`, icon: IconMail },
  schedule: { label: "Book a call", detail: handle(SCHEDULE_CALL_URL), href: SCHEDULE_CALL_URL, icon: IconCalendarEvent },
};

export default function ContactCard({ links, onAction }: { links: ContactLink[]; onAction?: () => void }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setCopied(true);
      onAction?.();
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — the mailto link still works
    }
  };

  return (
    <ul className={`${CARD} divide-y divide-neutral-100 p-1 dark:divide-neutral-800`}>
      {[...new Set(links)].map((key) => {
        const { label, detail, href, icon: LinkIcon } = LINKS[key];
        const external = key !== "email";
        return (
          <li key={key} className="flex items-center gap-1">
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              onClick={onAction}
              className="group flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <LinkIcon className="size-5 shrink-0 text-orange-600" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-neutral-900 dark:text-white">{label}</span>
                <span className="block truncate text-xs text-neutral-500">{detail}</span>
              </span>
              <IconArrowUpRight className="size-4 shrink-0 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            {key === "email" && (
              <button
                type="button"
                onClick={copyEmail}
                aria-label={copied ? "Email copied" : "Copy email address"}
                className="mr-1 cursor-pointer rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                {copied ? <IconCheck className="size-4 text-green-600" /> : <IconCopy className="size-4" />}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
