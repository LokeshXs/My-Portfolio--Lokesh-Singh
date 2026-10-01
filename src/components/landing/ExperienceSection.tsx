"use client";

import Image from "next/image";
import AnimatedSubheading from "../common/AnimatedSubHeading";
import { EXPERIENCE } from "@/lib/data";
import {
  IconClockHour5,
  IconCode,
} from "@tabler/icons-react";
import TechStackBadge from "../common/TechStackBadge";
import { cn } from "@/lib/utils";

export default function ExperienceSection() {
  return (
    <div className="px-4 max-sm:px-2 py-8 max-sm:py-6">
      <div className="flex justify-center">
        <AnimatedSubheading subheading="Work Experiences" />
      </div>

      <div className="space-y-8 py-6">
        {EXPERIENCE.map((exp, idx) => (
          <div key={`exp-${idx}`} className="flex items-start gap-12">
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <p className="text-lg font-medium">{exp.companyName}</p>{" "}
                  {idx === 0 && (
                    <div className="relative h-2 w-2 rounded-full bg-orange-400">
                      <div className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-orange-400" />
                    </div>
                  )}
                </div>
                <div className={cn("rounded-md bg-muted p-1", exp.logoContainerClassName)}>
                  <Image
                    src={exp.companyLogoPath}
                    alt={exp.companyName}
                    width={100}
                    height={100}
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <p className="text-primary-foreground/80 flex items-center gap-1 max-sm:text-sm">
                  <span className="text-muted-foreground border-accent bg-muted shrink-0 rounded-full border p-1">
                    <IconCode className="h-3 w-3" />{" "}
                  </span>
                  {exp.designation}{" "}
                </p>{" "}
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground border-accent bg-muted shrink-0 rounded-full border p-1">
                    <IconClockHour5 className="h-3 w-3" />{" "}
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="text-primary-foreground/80 text-sm">
                      {exp.jobType}
                    </p>
                    <div className="h-4 w-[2px] rounded-full bg-neutral-200" />
                    <p className="text-primary-foreground/80 text-sm">
                      {exp.period}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-1 pl-10 max-sm:pl-6">
                <ul className="marker:text-secondary/80 text-muted-foreground list-disc space-y-1 text-sm max-w-lg max-sm:max-w-full">
                  {exp.expPoints.map((point, i) => (
                    <li key={`point-${idx}-${i}`}>{point}</li>
                  ))}
                </ul>
              </div>
              {/* <div className="flex justify-start pl-1">
                {exp.tech.map((tech, index) => (
                  <TechStackBadge
                    key={`tech-${idx}-${index}`}
                    name={tech.name}
                    iconImg={tech.icon}
                    width={tech.width}
                    translateValue={index * 4}
                  />
                ))}
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
