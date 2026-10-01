"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Image from "next/image";
import Container from "./Container";
import { NAV_LINKS } from "@/lib/data";

import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconHome, IconMoon, IconSun } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { IconBrandGithub } from "@tabler/icons-react";
import {
  FolderOpenIcon,
  type FolderOpenIconHandle,
  UserRoundIcon,
  type UserRoundIconHandle,
} from "@animateicons/react/lucide";

export default function NavBar() {
  const [hovered, setHovered] = useState<number | null>(null);
  const aboutIconRef = useRef<UserRoundIconHandle>(null);
  const projectsIconRef = useRef<FolderOpenIconHandle>(null);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const pathName = usePathname();
  const showAvatar = pathName !== "/" || scrolled;
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  return (
    <Container className="fixed inset-x-0 top-0 z-10 flex items-center justify-between bg-transparent px-4 py-4 md:px-12 dark:bg-transparent">
      <motion.nav
        animate={{
          width: scrolled ? "90%" : "100%",
          boxShadow: scrolled ? "var(--shadow-custom)" : "none",
          paddingLeft: scrolled ? "8px" : "6px",
          paddingRight: scrolled ? "8px" : "6px",
          paddingTop: scrolled ? "8px" : "6px",
          paddingBottom: scrolled ? "8px" : "6px",
        }}
        transition={{
          duration: 0.3,
          ease: "linear",
        }}
        className="relative mx-auto flex items-center justify-between gap-6 overflow-hidden rounded-full bg-white/80 backdrop-blur-sm dark:bg-neutral-900/80"
      >
        <motion.div
          animate={{ paddingLeft: showAvatar ? 50 : 0 }}
          transition={{
            duration: 0.25,
            delay: showAvatar ? 0 : 0.2,
            ease: "linear",
          }}
          className="relative flex shrink-0 items-center"
        >
          <AnimatePresence>
            {showAvatar && (
              <motion.div
                key="avatar"
                initial={{ opacity: 0, scale: 0.65 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.65 }}
                transition={{
                  duration: 0.2,
                  delay: showAvatar ? 0.25 : 0,
                  ease: "linear",
                }}
                className="absolute inset-y-0 left-1 flex items-center"
              >
                <Link
                  href="/"
                  aria-label="Go to home page"
                  className="relative h-10 w-10 overflow-hidden rounded-full"
                >
                  <Image
                    src="/me.jpg"
                    alt="Lokesh Singh"
                    fill
                    className="object-cover object-center"
                  />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.ul
            initial={{ opacity: 0, y: -40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.3,
              delay: 0.3,
            }}
            className="text-primary-foreground/80 flex items-center text-base"
          >
            {NAV_LINKS.map((linkObj, idx) => (
              <li key={`link-${idx}`}>
                <Link
                  href={linkObj.href}
                  onMouseEnter={() => {
                    setHovered(idx);
                    if (linkObj.title === "About") {
                      aboutIconRef.current?.startAnimation();
                    } else {
                      projectsIconRef.current?.startAnimation();
                    }
                  }}
                  onMouseLeave={() => {
                    setHovered(null);
                    if (linkObj.title === "About") {
                      aboutIconRef.current?.stopAnimation();
                    } else {
                      projectsIconRef.current?.stopAnimation();
                    }
                  }}
                  className="hover:text-primary-foreground relative inline-flex items-center justify-center rounded-md px-2 py-1 transition-colors duration-300"
                >
                  <span className="relative z-[2] inline-flex items-center gap-1.5">
                    {linkObj.title === "About" ? (
                      <UserRoundIcon
                        ref={aboutIconRef}
                        size={16}
                        isAnimated={false}
                        className="shrink-0"
                      />
                    ) : (
                      <FolderOpenIcon
                        ref={projectsIconRef}
                        size={16}
                        isAnimated={false}
                        className="shrink-0"
                      />
                    )}
                    {linkObj.title}
                  </span>
                  {hovered === idx && (
                    <motion.span
                      layoutId="hovered-span"
                      className="pointer-events-none absolute inset-0 z-0 rounded-md bg-neutral-100 dark:bg-neutral-800 border-1 border-neutral-200/40"
                    />
                  )}
                </Link>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: -40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.3,
            delay: 0.3,
          }}
          className="text-primary-foreground/80 flex items-center gap-2 text-sm"
        >
          

          <Link
            href="https://buymeacoffee.com/lokesh1129m"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-transparent dark:hover:bg-transparent"
          >
            <Image
              alt="Buy Me Coffee"
              width={40}
              height={40}
              src="/buy_me_coffee.png"
              className="rotate-6 object-contain transition-transform duration-300 hover:rotate-0"
            />
          </Link>

          <Button
            onClick={() => {
              if (theme === "light") {
                setTheme("dark");
              } else {
                setTheme("light");
              }
            }}
            className="h-8 w-8 cursor-pointer rounded-full [&_svg:not([class*='size-'])]:size-4"
            variant="ghost"
            title={theme === "light" ? "Dark mode" : "Light Mode"}
          >
            <AnimatePresence mode="wait">
              {theme === "light" ? (
                <motion.span
                  key="darkmode"
                  initial={{ opacity: 0, rotate: 180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 180 }}
                >
                  <IconMoon />
                </motion.span>
              ) : (
                <motion.span
                  key="lightmode"
                  initial={{ opacity: 0, rotate: 180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 180 }}
                >
                  <IconSun />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.ul>
      </motion.nav>
    </Container>
  );
}
