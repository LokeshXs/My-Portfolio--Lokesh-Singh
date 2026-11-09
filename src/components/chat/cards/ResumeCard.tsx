// "Can I get his resume?" → a card to download or open the PDF.

import { IconDownload, IconExternalLink, IconFileText } from "@tabler/icons-react";
import { RESUME_FILE_NAME, RESUME_URL } from "@/lib/links";
import { CARD, PRIMARY_BUTTON, SECONDARY_BUTTON } from "./CardShell";

export default function ResumeCard({ onAction }: { onAction?: () => void }) {
  return (
    <div className={`${CARD} flex items-center gap-3`}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/40">
        <IconFileText className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">Resume</p>
        <p className="truncate text-xs text-neutral-500">Lokesh Singh · PDF</p>
      </div>
      <div className="flex shrink-0 gap-1.5">
        <a href={RESUME_URL} download={RESUME_FILE_NAME} onClick={onAction} className={PRIMARY_BUTTON}>
          <IconDownload className="size-3.5" />
          Download
        </a>
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onAction}
          aria-label="Open resume in a new tab"
          className={SECONDARY_BUTTON}
        >
          <IconExternalLink className="size-3.5" />
        </a>
      </div>
    </div>
  );
}
