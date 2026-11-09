// Everything the Bytes say on their own. Edit freely!

import type { ByteId } from "./byteStore";

// ── 1. Falling asleep / waking up ──
export const SLEEP_LINE = "zzz… dreaming of TypeScript…";
export const WAKE_LINE = "I'm up! I'm up! 😳";

// ── 2. The two Bytes chatting (one conversation is picked at random) ──
export type Line = { who: ByteId; say: string };
export const CONVERSATIONS: Line[][] = [
  [
    { who: "corner", say: "Psst… hero Byte. They stopped moving." },
    { who: "hero", say: "Maybe they're reading Lokesh's projects 🤓" },
    { who: "corner", say: "Or they fell asleep. Like you did yesterday." },
    { who: "hero", say: "That was POWER-SAVE MODE. 😤" },
  ],
  [
    { who: "hero", say: "Why are you stuck down in the corner?" },
    { who: "corner", say: "Someone has to guard the chat button 💂" },
    { who: "hero", say: "You literally just blink all day." },
    { who: "corner", say: "Professionally. 😌" },
  ],
  [
    { who: "corner", say: "Nice spot next to Lokesh's photo, hero." },
    { who: "hero", say: "I'm basically famous now ✨" },
    { who: "corner", say: "You're 36 pixels wide." },
    { who: "hero", say: "36 VERY famous pixels." },
  ],
  [
    { who: "hero", say: "Knock knock." },
    { who: "corner", say: "Who's there?" },
    { who: "hero", say: "Cache." },
    { who: "corner", say: "Cache who?" },
    { who: "hero", say: "Bless you! 🤧" },
  ],
];

// ── 4. Poked too many times ──
export const DIZZY_LINE = "Stop poking me 😵‍💫";

// ── 6. Theme toggle ──
export const LIGHT_THEME_LINE = "Too bright! 😎";
export const DARK_THEME_LINE = "Ahh, much better 🌙";

// ── 7. Email copied ──
export const EMAIL_LINE = "Ooh, emailing Lokesh? Good choice ❤️";

// ── 8. Section comments (once each, when the section scrolls into view) ──
// Keys match the data-byte-section="…" attributes in src/app/page.tsx.
export const SECTION_LINES: Record<string, string> = {
  projects: "Psst… Xenith is my favourite 👀",
  experience: "From HCL Tech to PharmaEdge — busy guy 💼",
  github: "So many green squares. He codes a LOT 🟩",
  contact: "Or skip all that — I can pass him a message ✉️",
};

// ── 9. Night owl (page opened late at night, visitor's local time) ──
export const NIGHT_LINE = "Working late? Same 🌙";
export const isNightTime = (date = new Date()) => date.getHours() >= 22 || date.getHours() < 5;
