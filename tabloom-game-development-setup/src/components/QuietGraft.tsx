import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { audio } from "../game/audio";

/* ------------------------------------------------------------------ */
/*  QuietGraft — the drawer, revisited. Same craft as Act I, no        */
/*  tutorial, no coaching, no prompts: three threads, drawn in one     */
/*  continuous gesture. Mastery, signalled by the absence of UI.       */
/* ------------------------------------------------------------------ */

const NODES = [
  { x: 200, y: 96 },
  { x: 306, y: 200 },
  { x: 200, y: 304 },
  { x: 94, y: 200 },
];

export default function QuietGraft({ onDone }: { onDone: () => void }) {
  const [linked, setLinked] = useState(0); // 0..3 segments drawn
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [done, setDone] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const finished = useRef(false);

  const toSvg = (cx: number, cy: number) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return { x: 200, y: 200 };
    const s = 400 / r.width;
    return { x: (cx - r.left) * s, y: (cy - r.top) * s };
  };

  useEffect(() => {
    if (linked < 3 || finished.current) return;
    finished.current = true;
    setDone(true);
    audio.bloom();
    window.setTimeout(onDone, 2300);
  }, [linked, onDone]);

  const near = (p: { x: number; y: number }, i: number) =>
    Math.hypot(NODES[i].x - p.x, NODES[i].y - p.y) < 46;

  const move = (e: React.PointerEvent) => {
    const p = toSvg(e.clientX, e.clientY);
    setCursor(p);
    if (!drawing || done) return;
    const nextIdx = linked + 1;
    if (nextIdx <= 3 && near(p, nextIdx)) {
      setLinked(nextIdx);
      audio.chime();
    }
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-[3px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onPointerMove={move}
      onPointerUp={() => setDrawing(false)}
      onPointerDown={(e) => {
        const p = toSvg(e.clientX, e.clientY);
        if (near(p, 0) || linked > 0) setDrawing(true);
      }}
    >
      <div className="relative aspect-square w-full max-w-[440px] touch-none">
        <svg ref={svgRef} viewBox="0 0 400 400" className="h-full w-full overflow-visible">
          <defs>
            <filter id="qg-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="qg-thread" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7ff5c9" />
              <stop offset="100%" stopColor="#ffd9a3" />
            </linearGradient>
          </defs>

          {/* the lock's quiet frame */}
          <circle
            cx="200"
            cy="200"
            r="132"
            fill="none"
            stroke="rgba(127,245,201,0.13)"
            strokeWidth="1"
            strokeDasharray="2 10"
            style={{ transformOrigin: "200px 200px", animation: "dashflow 6s linear infinite" }}
          />

          {/* drawn segments */}
          {NODES.slice(0, linked).map((_, i) => (
            <motion.line
              key={i}
              x1={NODES[i].x}
              y1={NODES[i].y}
              x2={NODES[i + 1].x}
              y2={NODES[i + 1].y}
              stroke="url(#qg-thread)"
              strokeWidth="2.6"
              strokeLinecap="round"
              filter="url(#qg-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
          ))}

          {/* live thread */}
          {drawing && cursor && linked < 3 && (
            <line
              x1={NODES[linked].x}
              y1={NODES[linked].y}
              x2={cursor.x}
              y2={cursor.y}
              stroke="#bfffe2"
              strokeWidth="1.8"
              strokeDasharray="5 6"
              strokeLinecap="round"
              opacity="0.75"
              style={{ animation: "dashflow 0.9s linear infinite" }}
            />
          )}

          {/* nodes */}
          {NODES.map((nd, i) => {
            const reached = i <= linked;
            const isNext = i === linked + 1 && !done;
            return (
              <g key={i}>
                {isNext && (
                  <circle
                    cx={nd.x}
                    cy={nd.y}
                    r="22"
                    fill="none"
                    stroke="rgba(127,245,201,0.4)"
                    strokeWidth="1"
                    style={{ transformOrigin: `${nd.x}px ${nd.y}px`, animation: "breathe 2.4s ease-in-out infinite" }}
                  />
                )}
                <circle
                  cx={nd.x}
                  cy={nd.y}
                  r="9"
                  fill={reached ? "rgba(127,245,201,0.25)" : "rgba(8,14,12,0.85)"}
                  stroke={reached ? "#7ff5c9" : "rgba(127,245,201,0.55)"}
                  strokeWidth="1.8"
                  filter={reached ? "url(#qg-glow)" : undefined}
                />
              </g>
            );
          })}

          {/* the drawer opens */}
          {done && (
            <g>
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx="200"
                  cy="200"
                  r="70"
                  fill="none"
                  stroke={i === 1 ? "#ffd9a3" : "#7ff5c9"}
                  strokeWidth={2 - i * 0.4}
                  initial={{ scale: 0.4, opacity: 0.9 }}
                  animate={{ scale: 2.8 + i * 0.5, opacity: 0 }}
                  transition={{ delay: i * 0.18, duration: 1.5, ease: "easeOut" }}
                  style={{ transformOrigin: "200px 200px" }}
                />
              ))}
            </g>
          )}
        </svg>

        {/* the only words on screen */}
        <motion.p
          className="font-display absolute inset-x-0 -bottom-2 text-center text-lg italic text-white/45"
          animate={{ opacity: done ? 0 : 1 }}
        >
          {linked === 0 ? "His hands already know." : linked < 3 ? "" : ""}
        </motion.p>
        {done && (
          <motion.p
            className="font-display absolute inset-x-0 -bottom-2 text-center text-xl italic text-emerald-100/80"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            The drawer opens.
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
