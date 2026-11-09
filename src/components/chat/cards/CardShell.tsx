// Shared look for Byte's chat cards (resume, contacts, call, projects, experience).

export const CARD = "w-full rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950";

// Buttons inside cards: a solid orange "main" one and a quiet outlined one.
export const PRIMARY_BUTTON =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-orange-700";
export const SECONDARY_BUTTON =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800";

/** Shown while the AI is still preparing a card. */
export function CardSkeleton() {
  return <div aria-hidden className={`${CARD} h-16 animate-pulse bg-neutral-100 dark:bg-neutral-900`} />;
}
