"use client";

// The hero profile photo, with a mini Byte badge in the top-right corner.
// Click the small one to swap: Byte grows into the big circle and the photo becomes the badge
// (click the small photo to swap back). The big Byte doesn't open the chat — it just watches
// the cursor, blinks, and gets excited when hovered, like the chat button.
// Poke the big Byte 5 times quickly and it gets dizzy. The director (useByteDirector) can also
// make this Byte chat with the corner Byte, fall asleep, etc.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Mascot from "@/components/mascot/Mascot";
import { CENTER, useEyeFollow } from "@/components/mascot/useEyeFollow";
import { registerByteElement, useByteAct } from "@/components/mascot/byteStore";
import { DIZZY_LINE } from "@/components/mascot/byteScripts";
import type { Expression } from "@/components/mascot/expressions";
import { BYTE_TOOLTIP_CLASS } from "@/components/mascot/tooltipStyles";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Where each item sits: filling the circle, or as the small badge on its top-right edge.
const MAIN = "absolute inset-0 z-0";
const BADGE = "absolute top-0 right-0 z-10 size-7 sm:size-8 md:size-9 shadow-md";
// The swap animation: a spring with a little bounce.
const SWAP = { type: "spring", bounce: 0.25, duration: 0.6 } as const;
// Keeps the corners perfectly round while motion animates the size (layout animation).
const ROUND = { borderRadius: 9999 };
const BADGE_BUTTON =
  "absolute inset-0 cursor-pointer rounded-full outline-offset-2 focus-visible:outline-2 focus-visible:outline-orange-600";

// Hover tooltips on the small badge: Byte talks like a robot (LED screen), Lokesh like a human.
const BYTE_TIP = "Beep boop, I'm Byte 👾 click to swap!";
const LOKESH_TIP = "Hey, I'm Lokesh 👋 click to swap back";
const LOKESH_TOOLTIP_CLASS =
  "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 [&_svg]:bg-neutral-900 [&_svg]:fill-neutral-900 dark:[&_svg]:bg-white dark:[&_svg]:fill-white";

// Poking: this many clicks on the big Byte, each within POKE_WINDOW_MS of the previous one → dizzy.
const POKES_TO_DIZZY = 5;
const POKE_WINDOW_MS = 700;
const DIZZY_MS = 2500;
const TIP_FADE_MS = 300; // keep the dizzy line while its tooltip fades out

export default function HeroAvatar() {
  const [byteInFront, setByteInFront] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [badgeTipOpen, setBadgeTipOpen] = useState(false);
  const [dizzy, setDizzy] = useState<"on" | "fading" | null>(null);
  const pokes = useRef({ count: 0, last: 0 });
  const byteRef = useRef<HTMLDivElement>(null);
  const eyes = useEyeFollow(byteRef, { typing: false });
  const act = useByteAct("hero");
  const swap = () => setByteInFront((b) => !b);

  // Let the director know where this Byte is (so the two Bytes can look at each other).
  useEffect(() => {
    registerByteElement("hero", byteRef.current);
    return () => registerByteElement("hero", null);
  }, []);

  // Dizziness wears off after a moment (the line fades out first, then it's gone).
  useEffect(() => {
    if (!dizzy) return;
    const t = window.setTimeout(
      () => setDizzy(dizzy === "on" ? "fading" : null),
      dizzy === "on" ? DIZZY_MS : TIP_FADE_MS,
    );
    return () => window.clearTimeout(t);
  }, [dizzy]);

  const poke = () => {
    if (!byteInFront || dizzy) return;
    const now = Date.now();
    const p = pokes.current;
    p.count = now - p.last < POKE_WINDOW_MS ? p.count + 1 : 1;
    p.last = now;
    if (p.count >= POKES_TO_DIZZY) {
      p.count = 0;
      setDizzy("on");
    }
  };

  // Priority: dizzy → the director's act → hover → idle.
  const isDizzy = dizzy === "on";
  const expression: Expression = isDizzy ? "dizzy" : (act.expression ?? (hovered ? "excited" : "idle"));
  const look = isDizzy ? CENTER : (act.look ?? eyes);
  const line = dizzy ? DIZZY_LINE : act.say;
  const tipOpen = isDizzy || !!act.talking || (badgeTipOpen && !byteInFront);

  return (
    <div className="relative size-28 shrink-0 sm:size-32 md:size-40 md:-translate-x-12">
      {/* Byte (one tooltip: the badge hover tip, or whatever Byte is saying) */}
      <Tooltip open={tipOpen} onOpenChange={setBadgeTipOpen} delayDuration={200}>
        <TooltipTrigger asChild>
          <motion.div
            ref={byteRef}
            layout
            transition={SWAP}
            style={ROUND}
            className={byteInFront ? MAIN : BADGE}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onClick={poke}
            whileTap={byteInFront ? undefined : { scale: 0.9 }}
            role={byteInFront ? "img" : undefined}
            aria-label={byteInFront ? "Byte, Lokesh's AI assistant" : undefined}
          >
            <Mascot
              expression={expression}
              look={look}
              fill
              size={byteInFront ? 140 : 34}
              effect={act.effect}
              wobble={isDizzy || act.wobble}
            />
            {!byteInFront && (
              <button
                type="button"
                onClick={swap}
                aria-label="Swap the photo with Byte, Lokesh's AI assistant"
                className={BADGE_BUTTON}
              />
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={8} className={BYTE_TOOLTIP_CLASS}>
          {line ?? BYTE_TIP}
        </TooltipContent>
      </Tooltip>

      {/* Lokesh's photo */}
      <motion.div
        layout
        transition={SWAP}
        style={ROUND}
        className={`overflow-hidden ${
          byteInFront ? `${BADGE} ring-2 ring-white dark:ring-neutral-900` : MAIN
        }`}
        whileTap={byteInFront ? { scale: 0.9 } : undefined}
      >
        <Image fill priority alt="Lokesh Profile Image" src="/me.jpg" sizes="160px" className="object-cover" />
        {byteInFront && (
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={swap}
                aria-label="Show Lokesh's photo again"
                className={BADGE_BUTTON}
              />
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8} className={LOKESH_TOOLTIP_CLASS}>
              {LOKESH_TIP}
            </TooltipContent>
          </Tooltip>
        )}
      </motion.div>
    </div>
  );
}
