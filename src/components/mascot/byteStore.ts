"use client";

// A tiny shared "stage" for the two Bytes (the corner chat button and the hero badge).
// The director (useByteDirector) writes what each Byte should do right now — a face, a line
// in its tooltip, Zs, a wobble — and both Byte components read it and act it out.

import { useSyncExternalStore } from "react";
import type { Expression } from "./expressions";
import type { Look } from "./useEyeFollow";

export type ByteId = "corner" | "hero";

export type ByteAct = {
  expression?: Expression;
  look?: Look; // where to look (overrides following the mouse)
  effect?: "zzz" | null;
  wobble?: boolean;
  say?: string; // the line shown in its tooltip
  talking?: boolean; // tooltip visible? (false while it fades out — the text is kept so it never flips)
};

export const NO_ACT: ByteAct = {};

let acts: Record<ByteId, ByteAct> = { corner: NO_ACT, hero: NO_ACT };
const listeners = new Set<() => void>();

export function setByteAct(id: ByteId, act: ByteAct) {
  acts = { ...acts, [id]: act };
  listeners.forEach((listener) => listener());
}

export function patchByteAct(id: ByteId, patch: ByteAct) {
  setByteAct(id, { ...acts[id], ...patch });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** What this Byte should be doing right now (re-renders when it changes). */
export function useByteAct(id: ByteId): ByteAct {
  return useSyncExternalStore(
    subscribe,
    () => acts[id],
    () => NO_ACT,
  );
}

// ── Where each Byte is on screen (so they can look at each other) ──
const elements: Partial<Record<ByteId, HTMLElement>> = {};
export function registerByteElement(id: ByteId, el: HTMLElement | null) {
  if (el) elements[id] = el;
  else delete elements[id];
}
export function getByteElement(id: ByteId): HTMLElement | null {
  return elements[id] ?? null;
}

// ── Events from the rest of the page (e.g. "the email was copied") ──
export type ByteEvent = { type: "email-copied" };
const eventListeners = new Set<(event: ByteEvent) => void>();
export function emitByteEvent(event: ByteEvent) {
  eventListeners.forEach((listener) => listener(event));
}
export function onByteEvent(listener: (event: ByteEvent) => void) {
  eventListeners.add(listener);
  return () => {
    eventListeners.delete(listener);
  };
}
