"use client";

// Makes the mascot's eyes look toward the mouse — one pixel in 8 possible directions.
//   • While the visitor is typing, the eyes look at the input box instead.
//   • Off for touch screens (no mouse to follow) and for visitors who prefer reduced motion.
//   • If the mouse stops moving for a while, the eyes drift back to the centre.

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

export type Look = { x: number; y: number };
export const CENTER: Look = { x: 0, y: 0 };

const IDLE_MS = 4000; // mouse still this long → look back to the centre
const LOOK_AT_INPUT: Look = { x: -1, y: -1 }; // the input is up-left of the button

/** Live result of a CSS media query (false during server rendering). */
function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** -1, 0 or 1 for one axis. 0.38 ≈ cos(67.5°), which splits the circle into 8 equal directions. */
const step = (n: number) => (n > 0.38 ? 1 : n < -0.38 ? -1 : 0);

/** Which way `from` should look to see `to` (e.g. so the two Bytes can look at each other). */
export function lookToward(from: Element, to: Element): Look {
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const distance = Math.hypot(dx, dy) || 1;
  // A looser threshold than for the mouse, so a mostly-vertical but slightly diagonal
  // direction still reads as diagonal — the Bytes clearly look AT each other.
  const loose = (n: number) => (n > 0.2 ? 1 : n < -0.2 ? -1 : 0);
  return { x: loose(dx / distance), y: loose(dy / distance) };
}

export function useEyeFollow(target: RefObject<HTMLElement | null>, { typing }: { typing: boolean }): Look {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const hasMouse = useMediaQuery("(pointer: fine)");
  const follow = hasMouse && !reducedMotion;
  const [look, setLook] = useState<Look>(CENTER);

  useEffect(() => {
    if (!follow) return;
    let frame = 0;
    let idleTimer = 0;
    let lastEvent: PointerEvent | null = null;

    // Runs at most once per screen frame, however fast the mouse moves.
    const update = () => {
      frame = 0;
      const el = target.current;
      if (!el || !lastEvent) return;
      const box = el.getBoundingClientRect();
      const dx = lastEvent.clientX - (box.left + box.width / 2);
      const dy = lastEvent.clientY - (box.top + box.height / 2);
      const distance = Math.hypot(dx, dy);
      // Mouse on the mascot itself → look straight ahead.
      const next = distance < box.width / 2 ? CENTER : { x: step(dx / distance), y: step(dy / distance) };
      setLook((prev) => (prev.x === next.x && prev.y === next.y ? prev : next));
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      lastEvent = e;
      if (!frame) frame = requestAnimationFrame(update);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setLook(CENTER), IDLE_MS);
    };
    const onLeavePage = () => setLook(CENTER);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeavePage);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeavePage);
      cancelAnimationFrame(frame);
      window.clearTimeout(idleTimer);
      setLook(CENTER);
    };
  }, [follow, target]);

  if (reducedMotion) return CENTER;
  if (typing) return LOOK_AT_INPUT;
  return follow ? look : CENTER;
}
