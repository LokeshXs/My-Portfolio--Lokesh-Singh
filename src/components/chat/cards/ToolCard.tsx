// GENERATIVE UI: turns a "show" tool part from the AI into the matching card.
// A tool part goes through states: input-streaming → input-available → output-available (or output-error).
// While it's running we show a placeholder; when the output arrives, the real card.

import type { ChatUIMessage } from "@/lib/ai/types";
import BookCallCard from "./BookCallCard";
import { CardSkeleton } from "./CardShell";
import ContactCard from "./ContactCard";
import ExperienceCard from "./ExperienceCard";
import ProjectsCard from "./ProjectsCard";
import ResumeCard from "./ResumeCard";

type Part = ChatUIMessage["parts"][number];

/** True for the parts this component knows how to show. */
export function isShowToolPart(part: Part): boolean {
  return (
    part.type === "tool-showResume" ||
    part.type === "tool-showContact" ||
    part.type === "tool-showBookCall" ||
    part.type === "tool-showProjects" ||
    part.type === "tool-showExperience"
  );
}

export default function ToolCard({ part, onAction }: { part: Part; onAction?: () => void }) {
  if (!("state" in part) || part.state === "output-error") return null;
  if (part.state !== "output-available") return <CardSkeleton />;

  switch (part.type) {
    case "tool-showResume":
      return <ResumeCard onAction={onAction} />;
    case "tool-showContact":
      return <ContactCard links={part.output.links} onAction={onAction} />;
    case "tool-showBookCall":
      return <BookCallCard onAction={onAction} />;
    case "tool-showProjects":
      return <ProjectsCard projects={part.output.projects} onAction={onAction} />;
    case "tool-showExperience":
      return <ExperienceCard />;
    default:
      return null;
  }
}
