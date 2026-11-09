"use client";

// The "director": decides when the Bytes do something on their own, and runs little scripts.
//
//   • Idle 10s → if the hero Byte is on screen, the two Bytes chat (a random conversation);
//                then, still idle, they both fall asleep (Z z z). Otherwise the corner Byte just dozes off.
//   • Any activity → a sleeping Byte wakes up startled; a conversation stops.
//   • Theme toggle → "Too bright! 😎" / "Ahh, much better 🌙"
//   • Email copied (event from the hero) → heart eyes
//   • A section scrolls into view → a one-time comment about it
//
// Nothing runs while the chat is open or the tab is in the background.

import { useEffect } from "react";
import {
  NO_ACT,
  getByteElement,
  onByteEvent,
  patchByteAct,
  setByteAct,
  type ByteAct,
  type ByteId,
} from "./byteStore";
import {
  CONVERSATIONS,
  DARK_THEME_LINE,
  EMAIL_LINE,
  LIGHT_THEME_LINE,
  SECTION_LINES,
  SLEEP_LINE,
  WAKE_LINE,
} from "./byteScripts";
import { lookToward } from "./useEyeFollow";

const IDLE_MS = 10_000; // no activity this long → do something
const LINE_MS = 2300; // how long each line of a conversation stays up
const SLEEP_AFTER_CHAT_MS = 6000; // still idle after chatting → fall asleep
const SLEEP_LINE_MS = 3000; // "zzz…" tooltip (the Zs keep floating after)
const WAKE_MS = 1600; // startled face after waking
const REACTION_MS = 2800; // theme / email / section comments
const TIP_FADE_MS = 300; // keep the text while the tooltip fades out
const SECTIONS_START_MS = 5000; // don't comment on sections before the page-load hello is done
const THEME_START_MS = 1500; // ignore the theme being set while the page loads

// Sections already commented on (once per page load, kept across chat open/close).
const commentedSections = new Set<string>();

export function useByteDirector({ paused, pathname }: { paused: boolean; pathname: string }) {
  useEffect(() => {
    const clearStage = () => {
      setByteAct("corner", NO_ACT);
      setByteAct("hero", NO_ACT);
    };
    if (paused) {
      clearStage();
      return;
    }

    const startedAt = Date.now();
    let mode: "awake" | "chatting" | "reacting" | "asleep" | "waking" = "awake";
    let generation = 0; // bumping it cancels whatever script is running
    let idleTimer = 0;
    let lastReschedule = 0;
    const timers = new Set<number>();

    /** Wait `ms`; resolves false if the script was cancelled meanwhile. */
    const wait = (ms: number, gen: number) =>
      new Promise<boolean>((resolve) => {
        const t = window.setTimeout(() => {
          timers.delete(t);
          resolve(gen === generation);
        }, ms);
        timers.add(t);
      });

    /** Show a line in a Byte's tooltip for `ms`, then fade it out (keeping the face). */
    const speak = async (id: ByteId, act: ByteAct, ms: number, gen: number) => {
      setByteAct(id, { ...act, talking: true });
      if (!(await wait(ms, gen))) return false;
      patchByteAct(id, { talking: false });
      return wait(TIP_FADE_MS, gen);
    };

    const heroOnScreen = () => {
      const hero = getByteElement("hero")?.getBoundingClientRect();
      return !!hero && hero.width > 0 && hero.bottom > 0 && hero.top < window.innerHeight;
    };

    // ── Falling asleep ──
    const fallAsleep = async (gen: number) => {
      mode = "asleep";
      setByteAct("hero", { expression: "sleep", effect: "zzz" });
      await speak("corner", { expression: "sleep", effect: "zzz", say: SLEEP_LINE }, SLEEP_LINE_MS, gen);
    };

    // ── The two Bytes chatting, then (still idle) falling asleep ──
    const chat = async (gen: number) => {
      mode = "chatting";
      const corner = getByteElement("corner");
      const hero = getByteElement("hero");
      if (!corner || !hero) return fallAsleep(gen);
      const looks: Record<ByteId, ByteAct["look"]> = {
        corner: lookToward(corner, hero),
        hero: lookToward(hero, corner),
      };
      const lines = CONVERSATIONS[Math.floor(Math.random() * CONVERSATIONS.length)];
      for (const line of lines) {
        const listener: ByteId = line.who === "corner" ? "hero" : "corner";
        setByteAct(listener, { expression: "idle", look: looks[listener] });
        if (!(await speak(line.who, { expression: "happy", look: looks[line.who], say: line.say }, LINE_MS, gen))) return;
      }
      setByteAct("corner", { expression: "idle", look: looks.corner });
      setByteAct("hero", { expression: "idle", look: looks.hero });
      if (await wait(SLEEP_AFTER_CHAT_MS, gen)) await fallAsleep(gen);
    };

    const onIdle = () => {
      if (mode !== "awake" || document.hidden) return;
      const gen = ++generation;
      if (heroOnScreen()) void chat(gen);
      else void fallAsleep(gen);
    };

    const scheduleIdle = () => {
      window.clearTimeout(idleTimer);
      if (!document.hidden) idleTimer = window.setTimeout(onIdle, IDLE_MS);
    };

    // ── Waking up (startled) ──
    const wakeUp = async () => {
      const gen = ++generation;
      mode = "waking";
      setByteAct("hero", { expression: "surprised" });
      const done = await speak("corner", { expression: "surprised", say: WAKE_LINE }, WAKE_MS, gen);
      if (!done) return;
      clearStage();
      mode = "awake";
      scheduleIdle();
    };

    // ── A short reaction from the corner Byte (theme, email, sections) ──
    const react = async (act: ByteAct) => {
      const gen = ++generation;
      mode = "reacting";
      setByteAct("hero", NO_ACT);
      const done = await speak("corner", act, REACTION_MS, gen);
      if (!done) return;
      setByteAct("corner", NO_ACT);
      mode = "awake";
      scheduleIdle();
    };

    // ── Any activity ──
    const onActivity = () => {
      if (mode === "asleep") void wakeUp();
      else if (mode === "chatting") {
        generation++;
        clearStage();
        mode = "awake";
      }
      // Rescheduling on every mouse move is wasteful — a few times a second is plenty.
      const now = Date.now();
      if (now - lastReschedule > 200) {
        lastReschedule = now;
        if (mode === "awake") scheduleIdle();
      }
    };
    const activityEvents = ["pointermove", "pointerdown", "keydown", "wheel", "scroll", "touchstart"] as const;
    activityEvents.forEach((type) => window.addEventListener(type, onActivity, { passive: true }));

    // Tab hidden → stop everything; visible again → start counting from zero.
    const onVisibility = () => {
      if (document.hidden) {
        generation++;
        window.clearTimeout(idleTimer);
        clearStage();
        mode = "awake";
      } else scheduleIdle();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // ── 6. Theme toggle ──
    let wasDark = document.documentElement.classList.contains("dark");
    const themeObserver = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark === wasDark) return;
      wasDark = isDark;
      if (Date.now() - startedAt < THEME_START_MS) return;
      void react(isDark ? { expression: "happy", say: DARK_THEME_LINE } : { expression: "cool", say: LIGHT_THEME_LINE });
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // ── 7. Email copied ──
    const offEvent = onByteEvent((event) => {
      if (event.type === "email-copied") void react({ expression: "heart", say: EMAIL_LINE });
    });

    // ── 8. Section comments (once each) ──
    let sectionObserver: IntersectionObserver | null = null;
    const sectionsTimer = window.setTimeout(
      () => {
        sectionObserver = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              const name = (entry.target as HTMLElement).dataset.byteSection ?? "";
              const line = SECTION_LINES[name];
              // Only when nothing else is going on, so comments never interrupt a chat or a reaction.
              if (!entry.isIntersecting || !line || commentedSections.has(name) || mode !== "awake") continue;
              commentedSections.add(name);
              void react({ expression: "excited", say: line });
              break;
            }
          },
          { threshold: 0.35 },
        );
        document.querySelectorAll("[data-byte-section]").forEach((el) => sectionObserver?.observe(el));
      },
      Math.max(0, SECTIONS_START_MS - (Date.now() - startedAt)),
    );

    scheduleIdle();

    return () => {
      generation++;
      window.clearTimeout(idleTimer);
      window.clearTimeout(sectionsTimer);
      timers.forEach((t) => window.clearTimeout(t));
      activityEvents.forEach((type) => window.removeEventListener(type, onActivity));
      document.removeEventListener("visibilitychange", onVisibility);
      themeObserver.disconnect();
      sectionObserver?.disconnect();
      offEvent();
      clearStage();
    };
  }, [paused, pathname]);
}
