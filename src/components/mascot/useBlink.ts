"use client";

import { useEffect, useState } from "react";

const BLINK_MS = 150; // how long the eyes stay closed
const MIN_WAIT_MS = 2500; // shortest gap between blinks
const MAX_WAIT_MS = 6000; // longest gap between blinks
const DOUBLE_BLINK_CHANCE = 0.2; // sometimes blink twice, like people do

/** Returns true for a short moment every few seconds (at random), while `enabled`. */
export function useBlink(enabled: boolean): boolean {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let timer: number;

    const blink = (thenWait: () => void) => {
      setBlinking(true);
      timer = window.setTimeout(() => {
        setBlinking(false);
        thenWait();
      }, BLINK_MS);
    };

    const scheduleNext = () => {
      const wait = MIN_WAIT_MS + Math.random() * (MAX_WAIT_MS - MIN_WAIT_MS);
      timer = window.setTimeout(() => {
        if (Math.random() < DOUBLE_BLINK_CHANCE) {
          blink(() => (timer = window.setTimeout(() => blink(scheduleNext), BLINK_MS)));
        } else {
          blink(scheduleNext);
        }
      }, wait);
    };

    scheduleNext();
    return () => {
      window.clearTimeout(timer);
      setBlinking(false);
    };
  }, [enabled]);

  return enabled && blinking;
}
