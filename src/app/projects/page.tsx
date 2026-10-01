"use client";

import AnimatedSubheading from "@/components/common/AnimatedSubHeading";
import ProjectCard from "@/components/common/ProjectCard";
import Container from "@/components/Container";
import { PROJECTS } from "@/lib/data";

import { motion } from "motion/react";

const PROJECTS_DESCRIPTION =
  "Here you’ll find a collection of the best magics i did using my skills";
export default function Page() {
  return (
    <Container className="relative min-h-screen overflow-x-hidden">
      <div>
        <div className="space-y-2 px-4 max-sm:px-2 py-8 max-sm:py-6">
          <motion.h1 className="text-primary-foreground text-2xl font-medium tracking-tight drop-shadow-xl md:text-4xl">
            {"Projects 🔮".split(" ").map((word, idx) => (
              <motion.span
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.1 + idx / 10 }}
                viewport={{ once: true }}
                key={`${word}-${idx}`}
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </motion.h1>
          <motion.p className="text-muted-foreground max-w-xl pt-4 max-sm:pt-2 text-base max-sm:text-sm break-normal">
            {PROJECTS_DESCRIPTION.split(" ").map((word, idx) => (
              <motion.span
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.2 + idx / 20 }}
                viewport={{ once: true }}
                key={`${word}-${idx}`}
                className="inline-block"
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </motion.p>
        </div>
        <div className="mx-auto block h-[2px] w-full bg-muted" />
        <div className="px-4 max-sm:px-2 py-8 max-sm:py-6">
          <div className="flex justify-center">
            <AnimatedSubheading subheading="I love building things" />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-10 gap-y-12 max-sm:gap-y-6 md:grid-cols-2">
            {PROJECTS.map((project, idx) => (
              <motion.div
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
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
        <div className="absolute top-0 left-0 col-start-2 row-span-full row-start-1 h-full w-10 max-md:w-6 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"></div>
        <div className="absolute top-0 right-0 col-start-2 row-span-full row-start-1 h-full w-10  max-md:w-6 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"></div>
    </Container>
  );
}
