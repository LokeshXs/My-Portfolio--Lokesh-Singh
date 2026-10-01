import { IconArrowRight, IconBrandReact } from "@tabler/icons-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import TechStackBadge from "./TechStackBadge";


export default function ProjectCard({
  project,
  className,
  imageClassName,
}: {
  project: {
    title: string;
    src: string;
    href: string;
    description: string;
      tech: {
        name: string;
        icon: string;
        width: number;
    }[];
  };
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={cn("group hover:shadow-custom relative rounded-xl border p-4 max-sm:p-2 transition-all duration-300 hover:border-neutral-200 max-sm:border-neutral-200 dark:hover:border-neutral-800 dark:max-sm:border-neutral-800", className)}>
      <Link href={project.href} target="_blank" className="flex h-full flex-col items-center">
        <div className={cn("group-hover:shadow-custom relative z-0 h-[200px] w-full overflow-hidden rounded-md transition-all duration-300 group-hover:-translate-y-1", imageClassName)}>
          <Image
            src={project.src}
            alt={project.title}
            fill
            className="object-cover object-top"
          />
          <div className="absolute right-2 bottom-2 z-[2] flex h-8 w-8 items-center justify-center rounded-full bg-muted p-2 shadow-xl border">
            <IconArrowRight className="text-muted-foreground  transition-all duration-300 group-hover:-rotate-45 " />
           
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col items-start">
          <h2 className="mt-2 font-medium tracking-tight text-primary-foreground">
            {project.title}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">{project.description}</p>
          <div className="mt-auto flex justify-start pt-2">
          {project.tech.map((tech,idx)=>(
            <TechStackBadge key={`tech-${idx}`} name={tech.name} iconImg={tech.icon} width={tech.width} translateValue={idx*4}  />
          ))}
          
          </div>
        </div>
      </Link>
    </div>
  );
}
