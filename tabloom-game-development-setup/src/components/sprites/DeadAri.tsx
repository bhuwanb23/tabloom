import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  DeadAri — the unstable vision variant. A body wearing his face,    */
/*  refusing to hold one shape: RGB-split ghosts, glitch slices, and   */
/*  a silhouette that never quite settles. Deliberately untouchable.   */
/* ------------------------------------------------------------------ */

const BODY =
  "M80 36 C 94 36, 100 48, 99 60 C 110 76, 114 102, 114 134 L 116 216 L 96 216 L 92 152 L 86 152 L 82 216 L 62 216 L 64 134 C 64 102, 60 76, 61 60 C 60 48, 66 36, 80 36 Z";
const HEAD = "M80 8 A 15 15 0 1 1 79.9 8 Z";

function Layer({ color, dx, dy, opacity }: { color: string; dx: number; dy: number; opacity: number }) {
  return (
    <g transform={`translate(${dx}, ${dy})`} opacity={opacity} style={{ mixBlendMode: "screen" }}>
      <path d={BODY} fill={color} />
      <path d={HEAD} fill={color} />
    </g>
  );
}

export default function DeadAri({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none no-select ${className}`} aria-hidden>
      <motion.div
        className="relative h-full w-full"
        animate={{ opacity: [0.72, 0.92, 0.66, 0.88, 0.74] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* rgb-split ghosts — the shape can't agree with itself */}
        <svg viewBox="0 0 160 230" className="absolute inset-0 h-full w-full" style={{ filter: "blur(2.4px)" }}>
          <Layer color="#ff3b3b" dx={-5} dy={2} opacity={0.5} />
          <Layer color="#3bffd0" dx={5} dy={-2} opacity={0.45} />
          <Layer color="#5b7bff" dx={2} dy={4} opacity={0.35} />
        </svg>

        {/* the body proper — near-black, hollow */}
        <svg viewBox="0 0 160 230" className="absolute inset-0 h-full w-full" style={{ filter: "blur(1.1px)" }}>
          <path d={BODY} fill="rgba(3,4,7,0.9)" />
          <path d={HEAD} fill="rgba(3,4,7,0.92)" />
          {/* the face that is his — two dead lights */}
          <circle cx="74" cy="6" r="2.2" fill="#ffb9a0" opacity="0.75">
            <animate attributeName="opacity" values="0.75;0.15;0.75" dur="4.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="86" cy="6" r="2.2" fill="#ffb9a0" opacity="0.75">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="5.1s" repeatCount="indefinite" />
          </circle>
          {/* root-threads growing through him, the wrong way */}
          <g stroke="#8a9a7a" strokeWidth="1.2" fill="none" opacity="0.5" strokeLinecap="round">
            <path d="M80 60 C 70 84, 92 96, 80 124" />
            <path d="M68 92 C 56 100, 52 112, 56 126" />
            <path d="M100 100 C 112 108, 114 122, 108 134" />
          </g>
        </svg>

        {/* glitch slices — brief horizontal tears through the figure */}
        <div className="glitching absolute inset-0" style={{ animationDuration: "0.9s" }}>
          <svg viewBox="0 0 160 230" className="h-full w-full">
            <path d={BODY} fill="rgba(255,255,255,0.14)" />
            <path d={HEAD} fill="rgba(255,255,255,0.14)" />
          </svg>
        </div>

        {/* the dark it stands in */}
        <div
          className="absolute inset-[-30%] -z-10 rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.6), transparent 68%)" }}
        />
      </motion.div>
    </div>
  );
}
