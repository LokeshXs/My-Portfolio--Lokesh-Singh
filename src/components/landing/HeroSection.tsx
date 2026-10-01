"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import {
  CalendarDaysIcon,
  type CalendarDaysIconHandle,
  CheckIcon,
  CopyIcon,
  type CopyIconHandle,
  DownloadIcon,
  type DownloadIconHandle,
} from "@animateicons/react/lucide";
import { DESCRIPTION, NAME } from "@/lib/data";
import { Button } from "../ui/button";

const emailAddress = "hi@lokeshbuilds.in";

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const copyIconRef = useRef<CopyIconHandle>(null);
  const calendarIconRef = useRef<CalendarDaysIconHandle>(null);
  const resumeIconRef = useRef<DownloadIconHandle>(null);
  const copyResetTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (copyResetTimer.current !== null) {
        window.clearTimeout(copyResetTimer.current);
      }
    },
    [],
  );

  const actionItemVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, transform: "translateY(8px)" },
    visible: {
      opacity: 1,
      ...(shouldReduceMotion ? {} : { transform: "translateY(0px)" }),
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.24,
        ease: [0.23, 1, 0.32, 1] as const,
      },
    },
  };

  const actionListVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: shouldReduceMotion ? 0 : 1,
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
      },
    },
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      if (copyResetTimer.current !== null) {
        window.clearTimeout(copyResetTimer.current);
      }
      copyResetTimer.current = window.setTimeout(() => {
        setCopied(false);
        copyResetTimer.current = null;
      }, 500);
      toast.success("Email copied to clipboard");
    } catch {
      toast.error("Could not copy email. Please copy it manually.");
    }
  };

  return (
    <div className="flex flex-col-reverse items-start justify-between gap-6 px-4 py-8 max-sm:px-2 max-sm:py-6 md:flex-row md:items-center">
      <div className="min-w-0">
        <h1 className="text-primary-foreground text-2xl font-medium tracking-tight drop-shadow-xl md:text-4xl">
          {NAME.split(" ").map((word, idx) => (
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
        </h1>

        <p className="text-muted-foreground max-w-xl break-normal pt-4 text-base max-sm:pt-2 max-sm:text-sm">
          {DESCRIPTION.split(" ").map((word, idx) => (
            <motion.span
              initial={{ opacity: 0, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.2 + idx / 50 }}
              viewport={{ once: true }}
              key={`${word}-${idx}`}
              className="inline-block"
            >
              {word}&nbsp;
            </motion.span>
          ))}
        </p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={actionListVariants}
          className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm " 
        >
          <motion.div
            variants={actionItemVariants}
            className="inline-flex items-center gap-1 text-primary-foreground/80 transition-colors hover:text-primary-foreground"
          >
            <span>{emailAddress}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={copied ? "Email copied" : "Copy email address"}
              title={copied ? "Email copied" : "Copy email address"}
              onClick={copyEmail}
              onMouseEnter={() => {
                if (!shouldReduceMotion) copyIconRef.current?.startAnimation();
              }}
              onMouseLeave={() => {
                if (!shouldReduceMotion) copyIconRef.current?.stopAnimation();
              }}
              className="size-7 rounded-full text-primary-foreground/80 transition-colors hover:bg-transparent hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="relative flex size-4 items-center justify-center">
                <AnimatePresence initial={false} mode="sync">
                  {copied ? (
                    <motion.span
                      key="check"
                      layoutId="email-copy-feedback"
                      initial={{
                        opacity: 0,
                        ...(shouldReduceMotion
                          ? {}
                          : { transform: "scale(0.9) rotate(35deg)" }),
                      }}
                      animate={{
                        opacity: 1,
                        ...(shouldReduceMotion
                          ? {}
                          : { transform: "scale(1) rotate(0deg)" }),
                      }}
                      exit={{
                        opacity: 0,
                        ...(shouldReduceMotion
                          ? {}
                          : { transform: "scale(0.9) rotate(-35deg)" }),
                      }}
                      transition={{
                        duration: shouldReduceMotion ? 0.15 : 0.18,
                        ease: [0.77, 0, 0.175, 1],
                      }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <CheckIcon size={16} isAnimated={false} aria-hidden="true" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      layoutId="email-copy-feedback"
                      initial={{
                        opacity: 0,
                        ...(shouldReduceMotion
                          ? {}
                          : { transform: "scale(0.9) rotate(-35deg)" }),
                      }}
                      animate={{
                        opacity: 1,
                        ...(shouldReduceMotion
                          ? {}
                          : { transform: "scale(1) rotate(0deg)" }),
                      }}
                      exit={{
                        opacity: 0,
                        ...(shouldReduceMotion
                          ? {}
                          : { transform: "scale(0.9) rotate(35deg)" }),
                      }}
                      transition={{
                        duration: shouldReduceMotion ? 0.15 : 0.18,
                        ease: [0.77, 0, 0.175, 1],
                      }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <CopyIcon
                        ref={copyIconRef}
                        size={16}
                        isAnimated={false}
                        aria-hidden="true"
                      />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </Button>
          </motion.div>

          <motion.div
            variants={actionItemVariants}
            className="inline-flex items-center gap-2"
          >
            <span
              aria-hidden="true"
              className="size-1 shrink-0 rounded-full bg-muted-foreground"
            />
            <Link
              href="https://cal.com/lokesh1129/meeting"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => {
                if (!shouldReduceMotion) {
                  calendarIconRef.current?.startAnimation();
                }
              }}
              onMouseLeave={() => {
                if (!shouldReduceMotion) {
                  calendarIconRef.current?.stopAnimation();
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Schedule call
              <CalendarDaysIcon
                ref={calendarIconRef}
                size={16}
                isAnimated={false}
                aria-hidden="true"
              />
            </Link>
          </motion.div>

          <motion.div
            variants={actionItemVariants}
            className="inline-flex items-center gap-2"
          >
            <span
              aria-hidden="true"
              className="size-1 shrink-0 rounded-full bg-muted-foreground"
            />
            <Link
              href="/Lokesh_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open resume PDF in a new tab"
              title="Resume"
              onMouseEnter={() => {
                if (!shouldReduceMotion) resumeIconRef.current?.startAnimation();
              }}
              onMouseLeave={() => {
                if (!shouldReduceMotion) resumeIconRef.current?.stopAnimation();
              }}
              className="inline-flex items-center gap-1.5 rounded-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <DownloadIcon
                ref={resumeIconRef}
                size={16}
                isAnimated={false}
                aria-hidden="true"
              />
              Resume
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative size-28 shrink-0 overflow-hidden rounded-full sm:size-32 md:size-40 md:-translate-x-12">
        <Image
          fill
          priority
          alt="Lokesh Profile Image"
          src="/me.jpg"
          className="object-cover"
        />
      </div>
    </div>
  );
}
