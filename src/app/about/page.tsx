"use client";

import TimelineBlock from "@/components/about/TimelineBlock";
import AnimatedSubheading from "@/components/common/AnimatedSubHeading";
import Container from "@/components/Container";
import { ABOUT_IMAGES, ACHIVEMENTSTIMELINE } from "@/lib/data";

import { motion } from "motion/react";
import Image from "next/image";

const ABOUT_DESCRIPTION =
  "Talking about myself is always a little difficult, but I’m someone who values balance. I enjoy taking care of my health, exploring new places, and hope to visit New Zealand someday 🫶. Professionally, I began as a full-stack developer, but my growing interest in the visual side of products naturally led me toward frontend development.";

export default function Page() {
  const variants = {
    hiddenVariants: {
      opacity: 0,
      filter: "blur(10px)",
      y: 10,
    },
    visibleVariants: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
    },
  };

  return (
    <Container className="min-h-screen overflow-x-hidden relative">
      
        <div className="space-y-2 py-8 max-sm:py-6 px-4 max-sm:px-2">
          <motion.h1
            variants={variants}
            initial="hiddenVariants"
            animate="visibleVariants"
          className="text-primary-foreground text-2xl font-medium tracking-tight drop-shadow-xl md:text-4xl"
          >
            {"About Me 🙂".split(" ").map((word, idx) => (
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
          <motion.p
            variants={variants}
            initial="hiddenVariants"
            animate="visibleVariants"
           className="text-muted-foreground max-w-xl pt-4 max-sm:pt-2 text-base max-sm:text-sm break-normal"
          >
            {ABOUT_DESCRIPTION.split(" ").map((word, idx) => (
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
        <div className="py-8 max-sm:py-6 px-4 max-sm:px-2">
          <div className="flex justify-center">
            <AnimatedSubheading subheading="Travelling is in my blood" />
          </div>
         <div className=" flex justify-center">
           <div className="mt-6 columns-3 max-md:columns-2 gap-4 max-sm:gap-2  ">
            {ABOUT_IMAGES.map((aboutImg, idx) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -40,
                  filter: "blur(40px)",
                  scale: 0.8,
                }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.1 + idx / 10,
                }}
                key={idx}
              >
                <Image
                  src={aboutImg}
                  alt="About Image"
                  height={300}
                  width={300}
                  className="mb-4 rounded-xl max-sm:mb-2 max-sm:rounded-md"
                />
              </motion.div>
            ))}
          </div>
         </div>
        </div>
        {/* <div className="mx-auto block h-[2px] w-full bg-muted" />
        <div className="py-8 max-sm:py-6 px-4 max-sm:px-2">
          <div className="flex justify-center">
            <AnimatedSubheading subheading="Timeline of achivements" />
          </div>
          <div className="mt-6 space-y-6">
            {ACHIVEMENTSTIMELINE.map((item, idx) => (
              <TimelineBlock key={`achivement-${idx}`} achivement={item} index={idx} />
            ))}
          </div>
        </div> */}
        <div className="absolute top-0 left-0 col-start-2 row-span-full row-start-1 h-full w-10 max-md:w-6 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"></div>
        <div className="absolute top-0 right-0 col-start-2 row-span-full row-start-1 h-full w-10  max-md:w-6 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"></div>
    </Container>
  );
}
