// A tiny ">_" terminal prompt drawn with orange pixel dots — same style as Byte's eyes.
// The "_" cursor blinks like a real terminal (not for visitors who prefer reduced motion).

import styles from "./Mascot.module.css";

const ORANGE = "#ea580c";

// "#" = prompt pixel, "_" = cursor pixel, "." = empty. 7 columns × 5 rows (chunky, readable when small).
const ICON = [
  "#......",
  ".#.....",
  "..#....",
  ".#.....",
  "#..____",
];
const COLS = ICON[0].length;
const ROWS = ICON.length;

export default function TerminalIcon({ size = 18, className }: { size?: number; className?: string }) {
  const pixels = ICON.flatMap((row, y) =>
    row.split("").flatMap((ch, x) => (ch === "." ? [] : [{ x, y, cursor: ch === "_" }])),
  );

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${COLS} ${ROWS}`}
      width={size}
      height={(size * ROWS) / COLS}
      className={className}
    >
      {pixels.map(({ x, y, cursor }) => (
        <rect
          key={`${x}-${y}`}
          x={x + 0.12}
          y={y + 0.12}
          width={0.76}
          height={0.76}
          rx={0.2}
          fill={ORANGE}
          className={cursor ? styles.cursor : undefined}
        />
      ))}
    </svg>
  );
}
