import { useState } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  ShadowWall — fifteen shadows, cast by nothing. Each is a soft      */
/*  humanoid silhouette with its own flicker timing; a few of them     */
/*  breathe. Hover reveals an exhibit tag, like a roll call.           */
/* ------------------------------------------------------------------ */

/* five silhouette variants, drawn in a 100x220 box */
const BODIES: string[] = [
  "M50 14 C62 14 68 25 66 38 C64 48 58 53 50 53 C42 53 36 48 34 38 C32 25 38 14 50 14 Z M30 62 C44 54 56 54 70 62 C82 72 86 96 84 130 L80 210 L60 210 L56 145 L44 145 L40 210 L20 210 L16 130 C14 96 18 72 30 62 Z",
  "M50 18 C60 18 66 28 64 39 C62 48 57 52 50 52 C43 52 38 48 36 39 C34 28 40 18 50 18 Z M32 60 C46 53 54 53 68 60 C80 70 88 92 84 128 L78 206 L58 210 L54 140 L46 140 L42 210 L22 206 L16 128 C12 92 20 70 32 60 Z",
  "M50 12 C63 12 69 24 67 37 C65 47 59 54 50 54 C41 54 35 47 33 37 C31 24 37 12 50 12 Z M28 64 C44 55 56 55 72 64 C84 76 86 100 86 132 L82 212 L62 212 L55 146 L45 146 L38 212 L18 212 L14 132 C14 100 16 76 28 64 Z",
  "M50 16 C61 16 66 26 65 38 C64 47 58 52 50 52 C42 52 36 47 35 38 C34 26 39 16 50 16 Z M34 58 C46 53 54 53 66 58 C76 66 82 88 82 124 L80 204 L60 208 L55 138 L45 138 L40 208 L20 204 L18 124 C18 88 24 66 34 58 Z",
  "M50 14 C62 14 67 24 66 36 C65 46 59 53 50 53 C41 53 35 46 34 36 C33 24 38 14 50 14 Z M31 61 C45 54 55 54 69 61 C81 73 85 95 83 128 L79 208 L59 208 L55 142 L45 142 L41 208 L21 208 L17 128 C15 95 19 73 31 61 Z",
];

interface ShadowSpec {
  x: number; // % left within container
  y: number; // % top
  s: number; // scale
  tilt: number;
  v: number; // body variant
  dur: number; // sway duration
  delay: number;
  awake: boolean; // breathes noticeably
}

const SPECS: ShadowSpec[] = [
  { x: 2, y: 6, s: 0.72, tilt: -4, v: 0, dur: 7.2, delay: 0.0, awake: false },
  { x: 9, y: 12, s: 0.95, tilt: 3, v: 1, dur: 8.4, delay: 0.7, awake: false },
  { x: 17, y: 4, s: 0.8, tilt: -2, v: 2, dur: 6.6, delay: 1.4, awake: true },
  { x: 25, y: 14, s: 1.05, tilt: 5, v: 3, dur: 9.2, delay: 0.3, awake: false },
  { x: 33, y: 7, s: 0.78, tilt: -6, v: 4, dur: 7.8, delay: 2.1, awake: false },
  { x: 41, y: 16, s: 0.98, tilt: 2, v: 0, dur: 8.8, delay: 1.0, awake: false },
  { x: 49, y: 5, s: 0.85, tilt: -3, v: 1, dur: 7.0, delay: 1.8, awake: true },
  { x: 57, y: 13, s: 1.1, tilt: 4, v: 2, dur: 9.6, delay: 0.5, awake: false },
  { x: 64, y: 3, s: 0.74, tilt: -5, v: 3, dur: 6.4, delay: 2.6, awake: false },
  { x: 71, y: 11, s: 0.94, tilt: 1, v: 4, dur: 8.2, delay: 1.2, awake: false },
  { x: 78, y: 6, s: 0.82, tilt: -2, v: 0, dur: 7.4, delay: 0.9, awake: true },
  { x: 84, y: 15, s: 1.02, tilt: 6, v: 1, dur: 9.0, delay: 2.3, awake: false },
  { x: 90, y: 4, s: 0.7, tilt: -7, v: 2, dur: 6.8, delay: 1.6, awake: false },
  { x: 95, y: 12, s: 0.88, tilt: 3, v: 3, dur: 8.6, delay: 0.2, awake: false },
  { x: 44, y: 24, s: 0.62, tilt: -1, v: 4, dur: 7.6, delay: 2.9, awake: false },
];

export default function ShadowWall({
  tone = "wall",
  onCount,
}: {
  tone?: "wall" | "ice";
  onCount?: (n: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const isIce = tone === "ice";

  return (
    <div className="absolute inset-0 no-select" aria-hidden>
      {SPECS.map((sp, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${sp.x}%`,
            top: `${sp.y}%`,
            width: `${9 * sp.s}vmin`,
            height: `${20 * sp.s}vmin`,
            transformOrigin: "50% 100%",
          }}
          initial={{ opacity: 0, scaleY: 0.7 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 0.15 + i * 0.09, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="relative h-full w-full"
            style={{
              animation: `flick ${sp.dur * 0.8}s linear infinite ${sp.delay}s, shadowtilt ${sp.dur}s ease-in-out infinite ${sp.delay}s`,
              transformOrigin: "50% 100%",
            }}
            onMouseEnter={() => {
              setHovered(i);
              onCount?.(i + 1);
            }}
            onMouseLeave={() => setHovered(null)}
          >
            <svg
              viewBox="0 0 100 220"
              className="h-full w-full"
              style={{
                transform: `rotate(${sp.tilt}deg) ${isIce ? "skewX(-24deg) scaleY(0.8)" : ""}`,
                filter: `blur(${isIce ? 5 : 3.2}px)`,
              }}
            >
              <path
                d={BODIES[sp.v]}
                fill={isIce ? "rgba(8, 18, 32, 0.55)" : "rgba(2, 3, 6, 0.72)"}
              />
            </svg>
            {/* awake shadows carry a faint ember behind the eyes */}
            {sp.awake && (
              <div
                className="absolute rounded-full"
                style={{
                  left: "44%",
                  top: "12%",
                  width: "12%",
                  height: "3.2%",
                  background: isIce
                    ? "radial-gradient(circle, rgba(159,215,255,0.7), transparent 70%)"
                    : "radial-gradient(circle, rgba(127,245,201,0.55), transparent 70%)",
                  animation: `pulseglow ${2.4 + i * 0.3}s ease-in-out infinite`,
                }}
              />
            )}
            {hovered === i && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-term absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.3em]"
                style={{ color: isIce ? "rgba(159,215,255,0.7)" : "rgba(127,245,201,0.6)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
