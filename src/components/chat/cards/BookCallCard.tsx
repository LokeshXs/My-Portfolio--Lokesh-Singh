// "I'd like to book a call" → a highlighted card with one big button to Cal.com.

import { IconArrowRight, IconCalendarEvent } from "@tabler/icons-react";
import { SCHEDULE_CALL_URL } from "@/lib/links";
import { PRIMARY_BUTTON } from "./CardShell";

export default function BookCallCard({ onAction }: { onAction?: () => void }) {
  return (
    // Thin orange gradient border, like Byte's ring.
    <div className="w-full rounded-xl bg-[linear-gradient(160deg,#f97316,#ea580c_45%,#9a3412)] p-px">
      <div className="flex items-center gap-3 rounded-[11px] bg-white p-3 dark:bg-neutral-950">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/40">
          <IconCalendarEvent className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-neutral-900 dark:text-white">Book a call with Lokesh</p>
          <p className="text-xs text-neutral-500">Pick a time that works for you</p>
        </div>
        <a href={SCHEDULE_CALL_URL} target="_blank" rel="noopener noreferrer" onClick={onAction} className={PRIMARY_BUTTON}>
          Choose a time
          <IconArrowRight className="size-3.5" />
        </a>
      </div>
    </div>
  );
}
