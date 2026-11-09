"use client";

// The mascot: a black face inside an orange ring, with pixel eyes.
// Every pixel of the grid is always drawn — "off" pixels are just invisible —
// so switching faces fades pixels in and out instead of jumping.
// Each face also has its own animation (see Mascot.module.css).

import type { CSSProperties } from "react";
import { COLS, EXPRESSIONS, ROWS, type Expression } from "./expressions";
import { useBlink } from "./useBlink";
import styles from "./Mascot.module.css";

const ORANGE = "#ea580c";

// Normal ring: a calm orange gradient.
const RING_NORMAL = `linear-gradient(160deg, #f97316, ${ORANGE} 45%, #9a3412)`;
// "Thinking" ring: LED-style segments (the gaps are see-through).
const RING_THINKING = `repeating-conic-gradient(${ORANGE} 0deg 7deg, transparent 7deg 12deg)`;
// Highlight: a bright arc of light (the rest transparent) that rotates once around the ring.
const LIGHT_ARC = `conic-gradient(from 0deg, transparent 0deg 250deg, #fdba74 300deg, #fff7ed 330deg, ${ORANGE} 345deg, transparent 360deg)`;

// The heart is red-orange: lighter at the top, deeper at the bottom.
const HEART_TOP = [255, 112, 67]; // #ff7043
const HEART_BOTTOM = [200, 40, 24]; // #c82818
function heartColor(row: number) {
  const t = Math.min(1, Math.max(0, (row - 1) / 6));
  const [r, g, b] = HEART_TOP.map((c, i) => Math.round(c + (HEART_BOTTOM[i] - c) * t));
  return `rgb(${r}, ${g}, ${b})`;
}

// A fixed "random-looking" number 0..1 per pixel (same on server and browser).
const seed = (i: number) => ((i * 37) % 23) / 23;

// Where the sad face's tear starts (column, row).
const TEAR = { col: 3, row: 7 };

type MascotProps = {
  expression: Expression;
  /** Where the eyes look: each of x and y is -1, 0 or 1 (one pixel shift). */
  look?: { x: number; y: number };
  /** Size in pixels (the whole circle, ring included). */
  size?: number;
  /** Blink every few seconds while idle (default: on). */
  autoBlink?: boolean;
  /** Play a one-time light sweep around the ring (e.g. when the page loads). */
  highlight?: boolean;
  /** Fill the parent element instead of using `size` (then `size` only sets the ring thickness). */
  fill?: boolean;
  /** Extra effect around the mascot: "zzz" = little Zs float up (sleeping). */
  effect?: "zzz" | null;
  /** Rock side to side (e.g. when dizzy). */
  wobble?: boolean;
  className?: string;
};

export default function Mascot({
  expression,
  look = { x: 0, y: 0 },
  size = 56,
  autoBlink = true,
  highlight = false,
  fill = false,
  effect = null,
  wobble = false,
  className,
}: MascotProps) {
  const blinking = useBlink(autoBlink && expression === "idle");
  const shown: Expression = blinking ? "blink" : expression;
  const pixels = EXPRESSIONS[shown];
  const thinking = expression === "thinking";
  const ringWidth = Math.max(2, Math.round(size / 28));

  return (
    <div
      aria-hidden
      data-expression={expression}
      data-shown={shown}
      data-look={`${look.x},${look.y}`}
      className={`relative rounded-full ${wobble ? styles.wobble : ""} ${className ?? ""}`}
      style={fill ? { width: "100%", height: "100%" } : { width: size, height: size }}
    >
      {/* Highlight, part 1: a soft blurred halo of light travelling just OUTSIDE the ring. */}
      {highlight && (
        <div
          className={`pointer-events-none absolute rounded-full blur-[6px] ${styles.sweep}`}
          style={{ inset: -ringWidth * 2, background: LIGHT_ARC }}
        />
      )}

      {/* Two ring layers on top of each other; they cross-fade when "thinking" starts/stops. */}
      <div
        className="absolute inset-0 rounded-full transition-opacity duration-300 motion-reduce:transition-none"
        style={{ background: RING_NORMAL, opacity: thinking ? 0 : 1 }}
      />
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-300 motion-reduce:transition-none ${
          thinking ? "animate-[spin_8s_linear_infinite] motion-reduce:animate-none" : ""
        }`}
        style={{ background: RING_THINKING, opacity: thinking ? 1 : 0 }}
      />

      {/* Highlight, part 2: the same light, sharp, travelling ON the ring itself. */}
      {highlight && (
        <div
          className={`pointer-events-none absolute inset-0 rounded-full ${styles.sweep}`}
          style={{ background: LIGHT_ARC }}
        />
      )}

      {/* The face (white in light theme, black in dark theme) with the pixel eyes. */}
      <div
        className="absolute flex items-center justify-center rounded-full bg-white dark:bg-black"
        style={{ inset: ringWidth }}
      >
        {/* 86% wide: the grid's empty outer border may touch the circle edge, the eyes never do. */}
        <svg viewBox={`0 0 ${COLS} ${ROWS}`} className="w-[86%]" shapeRendering="geometricPrecision">
          {/* Outer group: where the eyes look (eye-follow). CSS transform so the shift glides. */}
          <g
            style={{ transform: `translate(${look.x}px, ${look.y}px)` }}
            className="transition-transform duration-150 ease-out motion-reduce:transition-none"
          >
            {/* Inner group: this face's movement (hop, bounce, heartbeat…). A new class restarts it. */}
            <g className={`${styles.face} ${styles[`motion_${expression}`] ?? ""}`}>
              {pixels.map((lit, i) => {
                const col = i % COLS;
                const row = Math.floor(i / COLS);
                return (
                  <rect
                    key={i}
                    x={col + 0.1}
                    y={row + 0.1}
                    width={0.8}
                    height={0.8}
                    rx={0.18}
                    className={`${styles.px} ${styles[`px_${expression}`] ?? ""}`}
                    style={
                      {
                        opacity: lit ? 1 : 0,
                        fill: shown === "heart" ? heartColor(row) : ORANGE,
                        "--col": col,
                        "--seed": seed(i),
                      } as CSSProperties
                    }
                  />
                );
              })}

              {expression === "sad" && (
                <rect
                  x={TEAR.col + 0.25}
                  y={TEAR.row + 0.1}
                  width={0.5}
                  height={0.8}
                  rx={0.25}
                  fill="#fb923c"
                  className={styles.tear}
                />
              )}
            </g>
          </g>
        </svg>
      </div>

      {/* Sleeping: little pixel Zs rise one after another from the top-right of the face. */}
      {effect === "zzz" && (
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{ right: size * 0.05, top: size * 0.02, ["--s" as string]: `${size}px` } as CSSProperties}
        >
          {[0, 1, 2].map((i) => (
            <PixelZ
              key={i}
              size={size * 0.2}
              className={`absolute top-0 right-0 ${styles.z}`}
              style={{ animationDelay: `${i * 0.8}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** A tiny "Z" drawn with 4×4 orange pixels. */
const Z_PIXELS = ["####", "..#.", ".#..", "####"];
function PixelZ({ size, className, style }: { size: number; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 4 4" width={size} height={size} className={className} style={style}>
      {Z_PIXELS.flatMap((row, y) =>
        row.split("").map((ch, x) =>
          ch === "#" ? <rect key={`${x}-${y}`} x={x + 0.1} y={y + 0.1} width={0.8} height={0.8} rx={0.15} fill={ORANGE} /> : null,
        ),
      )}
    </svg>
  );
}
