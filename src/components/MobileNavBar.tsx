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

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconHome, IconMoon, IconSun } from "@tabler/icons-react";
import { IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import MobileNavContextProvider from "@/context/MobileNavContextProvider";
import AnimatedHamburgerButton from "./ui/MobileNavToggleButton";
import MobileNavToggleButton from "./ui/MobileNavToggleButton";
import { cn } from "@/lib/utils";
import MobileNavPanel from "./MobileNavPanel";


export default function MobileNavBar() {

  const pathName = usePathname();
  const router = useRouter();
  const { setTheme, theme } = useTheme();



  return (
    <MobileNavContextProvider>
      <div className="fixed inset-x-0 top-0 z-10 bg-white/80 backdrop-blur-lg dark:bg-neutral-900/80 px-4 py-2 shadow-custom  max-w-5xl w-full mx-auto      ">
        <nav
      
          className="relative mx-auto flex items-center justify-between gap-6 overflow-hidden  "
        >
          <AnimatePresence>
            {pathName !== "/" ? (
              <motion.div
                key="home"
                title="Home"
                className="group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full bg-neutral-100 p-2  dark:bg-neutral-700"
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                 
                  opacity: 1,
                  scale: 1,
                }}
                onClick={() => router.push("/")}
              >
                <IconHome className="text-neutral-700 transition-all duration-300 group-hover:scale-105 group-hover:text-neutral-900 dark:text-neutral-200 h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="profile"
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                 
                  opacity: 1,
                  scale: 1,
                }}
                className="relative h-9 w-9 overflow-hidden rounded-full"
              >
                <Image
                  src="/me.jpg"
                  alt="Lokesh Singh"
                  fill
                  className="object-cover object-center"
                />
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
            className="text-primary-foreground/80 flex items-center gap-1 text-sm"
          >
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

            <Button
              asChild
              size="sm"
              variant="outline"
              className="h-8 rounded-full px-2.5"
            >
              <Link
                href="https://github.com/LokeshXs/My-Portfolio--Lokesh-Singh"
                target="_blank"
                rel="noopener noreferrer"
              >
                Star on <IconBrandGithub stroke={2} />
              </Link>
            </Button>

            <Link
              href="https://buymeacoffee.com/lokesh1129m"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buy me a coffee"
              className="shrink-0"
            >
              <Image
                alt=""
                width={36}
                height={36}
                src="/buy_me_coffee.png"
                className="rotate-6 object-contain transition-transform duration-300 hover:rotate-0"
              />
            </Link>

            <MobileNavToggleButton />
          </motion.ul>
        </nav>
       <MobileNavPanel/>
      </div>
    </MobileNavContextProvider>
  );
}
