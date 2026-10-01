"use client";

import Link from "next/link";
import { useContext, useRef } from "react";
import { MobileNavContext } from "@/context/MobileNavContextProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import AnimatedHamburgerButton from "./ui/MobileNavToggleButton";
import { NAV_LINKS } from "@/lib/data";
import {
  FolderOpenIcon,
  type FolderOpenIconHandle,
  UserRoundIcon,
  type UserRoundIconHandle,
} from "@animateicons/react/lucide";

const MobileNavPanel = () => {
  const { isOpen, setOpen } = useContext(MobileNavContext);
  const aboutIconRef = useRef<UserRoundIconHandle>(null);
  const projectsIconRef = useRef<FolderOpenIconHandle>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{  opacity: 0 }}
          animate={{  opacity: 1 }}
          exit={{  opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 top-0 h-screen  w-screen bg-primary text-primary-foreground flex justify-center   overflow-y-auto   "
        >
          <div className="  p-8 max-sm:p-6 mt-32 ">
            <motion.ul
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.3, // Delay between each li element
                  },
                },
              }}
              initial="hidden"
              animate={isOpen ? "visible" : ""}
              exit="hidden"
              className=" space-y-6"
            >
           

              {NAV_LINKS.map((navLink, index) => (
                <motion.li
                  key={`link-${index}`}
                  className=" text-xl font-normal text-center"
                  onClick={() => {
                    setOpen(false);
                  }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5 },
                    },
                  }}
                >
                  <Link
                    href={navLink.href}
                    className="inline-flex items-center justify-center gap-2"
                    onMouseEnter={() => {
                      if (navLink.title === "About") {
                        aboutIconRef.current?.startAnimation();
                      } else {
                        projectsIconRef.current?.startAnimation();
                      }
                    }}
                    onMouseLeave={() => {
                      if (navLink.title === "About") {
                        aboutIconRef.current?.stopAnimation();
                      } else {
                        projectsIconRef.current?.stopAnimation();
                      }
                    }}
                  >
                    {navLink.title === "About" ? (
                      <UserRoundIcon
                        ref={aboutIconRef}
                        size={20}
                        isAnimated={false}
                        className="shrink-0"
                      />
                    ) : (
                      <FolderOpenIcon
                        ref={projectsIconRef}
                        size={20}
                        isAnimated={false}
                        className="shrink-0"
                      />
                    )}
                    {navLink.title}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <span className=" absolute top-4 right-[18px]">
            <AnimatedHamburgerButton />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNavPanel;
