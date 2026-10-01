"use client";

import { PROJECTS } from "@/lib/data";
import { motion } from "motion/react";
import AnimatedSubheading from "../common/AnimatedSubHeading";
import ProjectCard from "../common/ProjectCard";

export default function Projects() {
  return (
    <div className="py-8 max-sm:py-6  px-4 max-sm:px-2">
      <div className="flex justify-center">
        <AnimatedSubheading subheading="I love building things" />
      </div>

      <div className=" grid grid-cols-1 gap-10 max-sm:gap-4  py-6  md:grid-cols-2">
        {PROJECTS.slice(0,4).map((project, idx) => (
          <motion.div
            className={idx === 0 || idx === 3 ? "md:col-span-2" : undefined}
            initial={{
              opacity: 0,
              filter: "blur(10px)",
              y: 10,
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
            }}
            transition={{
              duration: 0.3,
              delay: (idx + 1) * 0.1,
              ease: "easeInOut",
            }}
            key={`project-${idx}`}
          >
            <ProjectCard
              project={project}
              className="h-full"
              imageClassName={
                idx === 0 || idx === 3 ? "h-[300px] md:h-[360px]" : undefined
              }
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
