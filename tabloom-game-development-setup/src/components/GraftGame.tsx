import { useMemo, useRef, useState, type ReactElement, type PointerEvent as RPointerEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hand, Sparkles } from "lucide-react";
import { audio } from "../game/audio";
import SennAvatar from "./SennAvatar";

/* ------------------------------------------------------------------ */
/*  GraftGame — root-craft tutorial. Six severed thread-pairs around   */
/*  a memory-lock. Knit each lit anchor to its matching stub.          */
/*  Wrong threads bite. The lock remembers. The door blooms.           */
/* ------------------------------------------------------------------ */

const C = 280; // svg center
const ANCHOR_R = 208;
const ANCHOR_ANGLES = [-90, -30, 30, 90, 150, 210];
const STUB_ANGLES = [205, 15, 252, 82, 322, 142];
const STUB_RADII = [122, 98, 132, 106, 120, 94];
const STUB_PAIRS = [3, 0, 5, 1, 4, 2]; // stub index -> anchor pair

const polar = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: C + Math.cos(a) * r, y: C + Math.sin(a) * r };
};

/* six little rune marks, drawn in a 20x20 box centered at 0,0 */
const RUNES: ReactElement[] = [
  <g key="sprout" strokeWidth="1.8" strokeLinecap="round" fill="none">
    <path d="M0 8 L0 -4 M0 -4 C -5 -6, -7 -9, -7 -12 M0 -4 C 5 -6, 7 -9, 7 -12" />
  </g>,
  <g key="eye" strokeWidth="1.7" fill="none">
    <ellipse cx="0" cy="-2" rx="8" ry="4.6" />
    <circle cx="0" cy="-2" r="1.8" fill="currentColor" stroke="none" />
  </g>,
  <g key="wave" strokeWidth="1.8" strokeLinecap="round" fill="none">
    <path d="M-9 -2 C -5 -8, -2 -8, 1 -2 C 4 4, 6 4, 9 -2" />
  </g>,
  <g key="thorn" strokeWidth="1.8" strokeLinejoin="round" fill="none">
    <path d="M-8 4 L0 -12 L8 4 L2 0 L0 6 L-2 0 Z" />
  </g>,
  <g key="ring" strokeWidth="1.8" fill="none">
    <circle cx="0" cy="-3" r="6" />
    <path d="M0 3 L0 8" strokeLinecap="round" />
  </g>,
  <g key="fork" strokeWidth="1.8" strokeLinecap="round" fill="none">
    <path d="M0 8 L0 0 M0 0 L-6 -10 M0 0 L6 -10 M-6 -10 l-2 3 M6 -10 l2 3" />
  </g>,
];

const SENN_LINES = {
  start: "Six threads, cut clean through. Each anchor hums for its match — the runes remember the shapes.",
  first: "There. Knit, don't cut.",
  half: "Half. Feel how the lock stops shivering?",
  fail: "The lock bites. Let the thread go slack — try another.",
  hint: "The lock wants a shape. Look — ghost-lines.",
};

interface Thread {
  pair: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default function GraftGame({
  onComplete,
  onFail,
}: {
  onComplete: () => void;
  onFail: () => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [armed, setArmed] = useState<number | null>(null);
  const [drag, setDrag] = useState<{ anchor: number; x: number; y: number } | null>(null);
  const [fails, setFails] = useState(0);
  const [failStub, setFailStub] = useState<number | null>(null);
  const [phase, setPhase] = useState<"play" | "bloom">("play");
  const [sennLine, setSennLine] = useState(SENN_LINES.start);
  const bloomDone = useRef(false);

  const anchors = useMemo(() => ANCHOR_ANGLES.map((a) => polar(a, ANCHOR_R)), []);
  const stubs = useMemo(() => STUB_ANGLES.map((a, i) => polar(a, STUB_RADII[i])), []);
  const done = threads.length;
  const hintOn = fails >= 3;

  const toSvg = (clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: C, y: C };
    const s = 560 / rect.width;
    return { x: (clientX - rect.left) * s, y: (clientY - rect.top) * s };
  };

  const hitStub = (p: { x: number; y: number }) =>
    stubs.findIndex((s) => Math.hypot(s.x - p.x, s.y - p.y) < 30);

  const threadPath = (x1: number, y1: number, x2: number, y2: number, pair: number) => {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const sag = (pair % 2 === 0 ? 1 : -1) * (18 + pair * 5);
    const cx = mx + (-dy / len) * sag;
    const cy = my + (dx / len) * sag;
    return `M${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  const attempt = (anchorIdx: number, stubIdx: number) => {
    if (phase !== "play") return;
    const alreadyDone = threads.some((t) => t.pair === STUB_PAIRS[stubIdx]);
    if (anchorIdx === STUB_PAIRS[stubIdx] && !alreadyDone) {
      const a = anchors[anchorIdx];
      const s = stubs[stubIdx];
      const next = [...threads, { pair: anchorIdx, x1: a.x, y1: a.y, x2: s.x, y2: s.y }];
      setThreads(next);
      setArmed(null);
      audio.chime();
      if (next.length === 1) setSennLine(SENN_LINES.first);
      else if (next.length === 3) setSennLine(SENN_LINES.half);
      if (next.length === ANCHOR_ANGLES.length) {
        window.setTimeout(() => {
          setPhase("bloom");
          audio.bloom();
        }, 550);
        window.setTimeout(() => {
          if (!bloomDone.current) {
            bloomDone.current = true;
            onComplete();
          }
        }, 3400);
      }
    } else if (!alreadyDone) {
      setFails((f) => f + 1);
      setFailStub(stubIdx);
      audio.thud();
      onFail();
      setSennLine(fails + 1 >= 6 ? SENN_LINES.hint : SENN_LINES.fail);
      window.setTimeout(() => setFailStub(null), 600);
    }
  };

  const sennHelp = () => {
    const remaining = anchors
      .map((_, i) => i)
      .filter((i) => !threads.some((t) => t.pair === i));
    if (remaining.length === 0) return;
    const pair = remaining[Math.floor(Math.random() * remaining.length)];
    const stubIdx = STUB_PAIRS.indexOf(pair);
    attempt(pair, stubIdx);
    setSennLine("Here — watch my hands this time.");
  };

  const onAnchorDown = (i: number, e: RPointerEvent) => {
    if (phase !== "play" || threads.some((t) => t.pair === i)) return;
    e.stopPropagation();
    const p = toSvg(e.clientX, e.clientY);
    setArmed(i);
    setDrag({ anchor: i, x: p.x, y: p.y });
    audio.ui(660);
  };

  const onStubDown = (i: number, e: RPointerEvent) => {
    if (phase !== "play") return;
    e.stopPropagation();
    if (armed !== null) attempt(armed, i);
    else audio.reject(300);
  };

  const onMove = (e: RPointerEvent) => {
    if (!drag) return;
    const p = toSvg(e.clientX, e.clientY);
    setDrag({ ...drag, x: p.x, y: p.y });
  };

  const onUp = (e: RPointerEvent) => {
    if (!drag) return;
    const a = anchors[drag.anchor];
    const moved = Math.hypot(drag.x - a.x, drag.y - a.y);
    if (moved > 14) {
      const p = toSvg(e.clientX, e.clientY);
      const idx = hitStub(p);
      if (idx >= 0) attempt(drag.anchor, idx);
    }
    setDrag(null);
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/78 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onPointerMove={onMove}
      onPointerUp={onUp}
    >
      <motion.div
        className="glass-panel relative w-full max-w-3xl rounded-2xl p-5 sm:p-7"
        initial={{ scale: 0.94, y: 18 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
      >
        {/* header */}
        <div className="mb-2 flex items-start justify-between gap-4">
          <div>
            <p className="font-term text-[10px] tracking-[0.4em] text-emerald-300/70">ROOT-CRAFT · LESSON ONE</p>
            <h3 className="font-display mt-1 text-2xl font-medium text-white/95 sm:text-3xl">Grafting</h3>
          </div>
          <div className="flex items-center gap-1.5" title={`${done} of 6 threads`}>
            {anchors.map((_, i) => (
              <span
                key={i}
                className="h-1.5 w-4 rounded-full transition-all duration-500"
                style={{
                  background: threads.some((t) => t.pair === i)
                    ? "#7ff5c9"
                    : "rgba(255,255,255,0.12)",
                  boxShadow: threads.some((t) => t.pair === i) ? "0 0 8px rgba(127,245,201,0.7)" : undefined,
                }}
              />
            ))}
          </div>
        </div>

        <p className="mb-3 max-w-xl text-sm leading-relaxed text-white/50">
          Drag from a lit <span className="text-emerald-300/90">anchor</span> on the ring to its matching{" "}
          <span className="text-amber-200/90">stub</span> — the runes tell you which. Or tap anchor, then tap stub.
        </p>

        {/* the lock */}
        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          <svg
            ref={svgRef}
            viewBox="0 0 560 560"
            className="h-full w-full touch-none"
            style={{ cursor: drag ? "grabbing" : "default" }}
          >
            <defs>
              <filter id="g-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="g-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(127,245,201,0.16)" />
                <stop offset="70%" stopColor="rgba(127,245,201,0.04)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* lock rings */}
            <circle cx={C} cy={C} r="76" fill="url(#g-core)" />
            <circle cx={C} cy={C} r="76" fill="none" stroke="rgba(127,245,201,0.25)" strokeWidth="1.4" strokeDasharray="4 7" style={{ animation: "dashflow 3s linear infinite" }} />
            <circle cx={C} cy={C} r="168" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <circle cx={C} cy={C} r={ANCHOR_R} fill="none" stroke="rgba(127,245,201,0.14)" strokeWidth="1" strokeDasharray="2 9" />

            {/* ghost hints */}
            {anchors.map((a, i) => {
              const si = STUB_PAIRS.indexOf(i);
              const s = stubs[si];
              return (
                <path
                  key={`ghost-${i}`}
                  d={threadPath(a.x, a.y, s.x, s.y, i)}
                  fill="none"
                  stroke="rgba(127,245,201,0.6)"
                  strokeWidth="1"
                  strokeDasharray="3 8"
                  opacity={hintOn ? 0.22 : 0.05}
                  style={{ transition: "opacity 1s ease" }}
                />
              );
            })}

            {/* knitted threads */}
            {threads.map((t) => (
              <g key={`thread-${t.pair}`}>
                <motion.path
                  d={threadPath(t.x1, t.y1, t.x2, t.y2, t.pair)}
                  fill="none"
                  stroke="#7ff5c9"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  filter="url(#g-glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
                <motion.circle
                  cx={(t.x1 + t.x2) / 2}
                  cy={(t.y1 + t.y2) / 2}
                  r="3"
                  fill="#ffe9b3"
                  filter="url(#g-glow)"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 12 }}
                />
              </g>
            ))}

            {/* live drag thread */}
            {drag && (
              <path
                d={threadPath(anchors[drag.anchor].x, anchors[drag.anchor].y, drag.x, drag.y, drag.anchor)}
                fill="none"
                stroke="#bfffe2"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeLinecap="round"
                style={{ animation: "dashflow 0.9s linear infinite" }}
                opacity="0.9"
              />
            )}

            {/* stubs */}
            {stubs.map((s, i) => {
              const pair = STUB_PAIRS[i];
              const isDone = threads.some((t) => t.pair === pair);
              return (
                <g
                  key={`stub-${i}`}
                  onPointerDown={(e) => onStubDown(i, e)}
                  className="cursor-pointer"
                  style={{ color: isDone ? "#7ff5c9" : "#ffd9a3" }}
                >
                  <motion.g
                    animate={failStub === i ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <circle
                      cx={s.x}
                      cy={s.y}
                      r="15"
                      fill={failStub === i ? "rgba(255,106,77,0.16)" : isDone ? "rgba(127,245,201,0.14)" : "rgba(255,217,163,0.06)"}
                      stroke={failStub === i ? "#ff6a4d" : isDone ? "#7ff5c9" : "rgba(255,217,163,0.55)"}
                      strokeWidth="1.6"
                      strokeDasharray={isDone ? "none" : "4 4"}
                      filter={isDone ? "url(#g-glow)" : undefined}
                      style={!isDone && failStub !== i ? { animation: `flick ${3 + i * 0.7}s linear infinite` } : undefined}
                    />
                    <g transform={`translate(${s.x}, ${s.y + 2}) scale(0.85)`} opacity={isDone ? 1 : 0.8}>
                      {RUNES[pair]}
                    </g>
                  </motion.g>
                </g>
              );
            })}

            {/* anchors */}
            {anchors.map((a, i) => {
              const isDone = threads.some((t) => t.pair === i);
              const isArmed = armed === i;
              return (
                <g
                  key={`anchor-${i}`}
                  onPointerDown={(e) => onAnchorDown(i, e)}
                  className={isDone ? "" : "cursor-grab"}
                  style={{ color: "#bfffe2" }}
                >
                  {(isArmed || (!isDone && true)) && (
                    <circle
                      cx={a.x}
                      cy={a.y}
                      r={isArmed ? 23 : 19}
                      fill="none"
                      stroke={isArmed ? "#bfffe2" : "rgba(127,245,201,0.35)"}
                      strokeWidth="1"
                      opacity={isDone ? 0 : isArmed ? 0.95 : 0.5}
                      style={{ transformOrigin: `${a.x}px ${a.y}px`, animation: "breathe 2.6s ease-in-out infinite" }}
                    />
                  )}
                  <circle
                    cx={a.x}
                    cy={a.y}
                    r="15"
                    fill={isDone ? "rgba(127,245,201,0.2)" : "rgba(8,20,14,0.9)"}
                    stroke={isDone ? "#7ff5c9" : "rgba(127,245,201,0.8)"}
                    strokeWidth="1.8"
                    filter="url(#g-glow)"
                    opacity={isDone ? 0.9 : 1}
                  />
                  <g transform={`translate(${a.x}, ${a.y + 2}) scale(0.85)`} opacity={isDone ? 0.55 : 1}>
                    {RUNES[i]}
                  </g>
                </g>
              );
            })}

            {/* bloom flourish */}
            {phase === "bloom" && (
              <g style={{ transformOrigin: `${C}px ${C}px` }}>
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={i}
                    cx={C}
                    cy={C}
                    r="80"
                    fill="none"
                    stroke="#7ff5c9"
                    strokeWidth={2 - i * 0.5}
                    initial={{ scale: 0.3, opacity: 0.9 }}
                    animate={{ scale: 3 + i * 0.6, opacity: 0 }}
                    transition={{ delay: i * 0.2, duration: 1.6, ease: "easeOut" }}
                  />
                ))}
                {anchors.map((a, i) => (
                  <motion.circle
                    key={`p-${i}`}
                    cx={a.x}
                    cy={a.y}
                    r="7"
                    fill="#ffe9b3"
                    filter="url(#g-glow)"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.6, 0.4] }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 1.4 }}
                  />
                ))}
              </g>
            )}
          </svg>

          {/* bloom banner */}
          <AnimatePresence>
            {phase === "bloom" && (
              <motion.div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center">
                  <motion.p
                    className="font-term text-[10px] tracking-[0.5em] text-emerald-200/90"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    GRAFT COMPLETE
                  </motion.p>
                  <motion.p
                    className="font-display mt-2 text-2xl italic text-white/95 text-glow-root"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    The lock remembers. The door blooms.
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* footer — senn coaching */}
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-200/10 bg-black/30 px-4 py-3">
          <div className="shrink-0" style={{ width: 44 }}>
            <SennAvatar speaking size={44} />
          </div>
          <p className="font-display flex-1 text-[15px] italic leading-snug text-emerald-100/85">“{sennLine}”</p>
          {fails >= 6 && phase === "play" && (
            <button
              onClick={sennHelp}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-200/25 bg-amber-200/[0.06] px-3 py-1.5 font-term text-[10px] tracking-[0.18em] text-amber-200/90 transition-colors hover:bg-amber-200/[0.14]"
            >
              <Hand size={11} />
              SENN GUIDES
            </button>
          )}
          {phase === "play" && (
            <div className="hidden shrink-0 items-center gap-1 font-term text-[9px] tracking-[0.2em] text-white/25 sm:flex">
              <Sparkles size={10} />
              KNIT · DON'T CUT
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
