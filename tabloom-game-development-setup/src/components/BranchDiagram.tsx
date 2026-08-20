import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  BranchDiagram — Aevum's fifteen branches fanned from one trunk.    */
/*  `dead=false`: all fifteen lit. `dead=true`: ten gutter out.        */
/*  Branch tips end in tiny tab shapes — the tree blooms tabs.         */
/* ------------------------------------------------------------------ */

export default function BranchDiagram({
  dead = false,
  width = 420,
  height = 300,
}: {
  dead?: boolean;
  width?: number;
  height?: number;
}) {
  const branches = Array.from({ length: 15 }, (_, i) => {
    const f = i / 14; // 0..1
    const angle = -72 + f * 144; // fan
    const len = 150 + Math.sin(i * 1.7) * 24 + (i % 3) * 12;
    const rad = (angle * Math.PI) / 180;
    const x1 = 210 + Math.sin(rad) * len * 0.45;
    const y1 = 285 - Math.cos(rad) * len * 0.5;
    const x2 = 210 + Math.sin(rad) * len;
    const y2 = 285 - Math.cos(rad) * len;
    // which survive: keep 5 scattered branches alive
    const alive = [1, 4, 7, 10, 13].includes(i);
    return { i, angle, x1, y1, x2, y2, alive };
  });

  return (
    <svg
      viewBox="0 0 420 300"
      width={width}
      height={height}
      className="mx-auto block max-w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="bd-live" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#2c8f6b" />
          <stop offset="100%" stopColor="#a9f5d4" />
        </linearGradient>
        <filter id="bd-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* trunk */}
      <motion.path
        d="M210 300 C 206 280, 214 268, 210 246"
        stroke="url(#bd-live)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
        filter="url(#bd-glow)"
      />

      {branches.map((b) => {
        const lit = dead ? b.alive : true;
        return (
          <g key={b.i}>
            <motion.path
              d={`M210 252 C ${b.x1} ${b.y1}, ${b.x1} ${b.y1}, ${b.x2} ${b.y2}`}
              stroke={lit ? "url(#bd-live)" : "rgba(255,255,255,0.1)"}
              strokeWidth={lit ? 2.2 : 1.4}
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: dead && !b.alive ? 0.5 : 1 }}
              transition={{ delay: 0.25 + b.i * 0.06, duration: 0.9 }}
              filter={lit ? "url(#bd-glow)" : undefined}
            />
            {/* tab tip */}
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.85 + b.i * 0.06, type: "spring", stiffness: 200, damping: 14 }}
              style={{ transformOrigin: `${b.x2}px ${b.y2}px` }}
            >
              <rect
                x={b.x2 - 7}
                y={b.y2 - 6}
                width="14"
                height="10"
                rx="2.5"
                fill={lit ? "rgba(127,245,201,0.16)" : "rgba(255,255,255,0.03)"}
                stroke={lit ? "rgba(169,245,212,0.9)" : "rgba(255,255,255,0.14)"}
                strokeWidth="1"
              />
              {lit && (
                <circle cx={b.x2} cy={b.y2 - 1} r="1.6" fill="#a9f5d4" filter="url(#bd-glow)" />
              )}
            </motion.g>
          </g>
        );
      })}

      {/* count readout */}
      <motion.text
        x="210"
        y="296"
        textAnchor="middle"
        className="font-term"
        fill="rgba(232,236,239,0.55)"
        fontSize="10"
        letterSpacing="4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {dead ? "5 ALIVE · 10 DEAD" : "15 BRANCHES"}
      </motion.text>
    </svg>
  );
}
