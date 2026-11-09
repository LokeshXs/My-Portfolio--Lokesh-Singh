// "What's his experience?" → a mini timeline (newest first) from the portfolio data.

import Image from "next/image";
import { EXPERIENCE } from "@/lib/data";
import { CARD } from "./CardShell";

export default function ExperienceCard() {
  return (
    <ol className={`${CARD} space-y-0`}>
      {EXPERIENCE.map((job, i) => {
        const last = i === EXPERIENCE.length - 1;
        return (
          <li key={job.companyName} className="relative flex gap-3 pb-3 last:pb-0">
            {/* The timeline line connecting the logos. */}
            {!last && (
              <span aria-hidden className="absolute top-9 bottom-0 left-[15px] w-px bg-neutral-200 dark:bg-neutral-800" />
            )}
            <div
              className={`relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 ${
                job.logoContainerClassName ?? "bg-white"
              }`}
            >
              <Image src={job.companyLogoPath} alt={`${job.companyName} logo`} width={22} height={22} className="object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">{job.designation}</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {job.companyName} · {job.jobType} · {job.jobLocation}
              </p>
              <p className="mt-0.5 text-[11px] text-orange-600">{job.period}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
