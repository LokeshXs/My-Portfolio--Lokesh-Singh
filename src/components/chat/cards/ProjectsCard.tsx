// "Show me his projects" → thumbnail cards (screenshot, name, one-liner, tech, Visit site).
// Several projects scroll sideways; a single project takes the full width.

import Image from "next/image";
import { IconArrowUpRight } from "@tabler/icons-react";
import { PROJECTS } from "@/lib/data";

export default function ProjectsCard({ projects, onAction }: { projects: string[]; onAction?: () => void }) {
  // Look the details up from the portfolio data (the AI only sent the names).
  const items = projects.flatMap((name) => PROJECTS.filter((p) => p.title === name));
  if (items.length === 0) return null;
  const single = items.length === 1;

  return (
    <div className={`flex w-full gap-2 ${single ? "" : "-mx-1 snap-x snap-mandatory overflow-x-auto px-1 pb-2"}`}>
      {items.map((project) => (
        <article
          key={project.title}
          className={`flex shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 ${
            single ? "w-full" : "w-[220px]"
          }`}
        >
          <div className="relative aspect-video w-full bg-neutral-100 dark:bg-neutral-900">
            <Image
              src={project.src}
              alt={`${project.title} screenshot`}
              fill
              sizes={single ? "340px" : "220px"}
              className="object-cover object-top"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-3">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">{project.title}</p>
            <p className="line-clamp-2 text-xs text-neutral-600 dark:text-neutral-400">{project.description}</p>
            <div className="flex flex-wrap gap-1">
              {project.tech.map((t) => (
                <span
                  key={t.name}
                  className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  {t.name}
                </span>
              ))}
            </div>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onAction}
              className="mt-auto inline-flex items-center gap-1 self-start text-xs font-medium text-orange-600 hover:underline"
            >
              Visit site
              <IconArrowUpRight className="size-3.5" />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
