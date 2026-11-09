"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { Button } from "./ui/button";

// true in the browser, false during server rendering — without an extra re-render effect.
const useIsClient = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

export default function ThemeToggle() {
  // resolvedTheme is always "light" or "dark" (theme can also be "system").
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useIsClient();

  // The server can't know the visitor's theme, so it renders an empty button.
  // The icon appears once we're in the browser — no server/browser mismatch.
  const isLight = resolvedTheme !== "dark";

  return (
    <Button
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="h-8 w-8 cursor-pointer rounded-full [&_svg:not([class*='size-'])]:size-4"
      variant="ghost"
      title={isClient ? (isLight ? "Dark mode" : "Light mode") : "Toggle theme"}
      aria-label="Toggle theme"
    >
      {isClient && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isLight ? "darkmode" : "lightmode"}
            initial={{ opacity: 0, rotate: 180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 180 }}
          >
            {isLight ? <IconMoon /> : <IconSun />}
          </motion.span>
        </AnimatePresence>
      )}
    </Button>
  );
}
