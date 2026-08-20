import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lightbulb } from "lucide-react";
import { audio } from "../game/audio";

/* ------------------------------------------------------------------ */
/*  InvariantDiagram — the concept overlay. Many branches, wildly      */
/*  different, all passing through one point that refuses to move.     */
/*  Addresses the PLAYER directly — this is load-bearing for later.    */
/* ------------------------------------------------------------------ */

/* fifteen wandering paths that all cross the same node */
const KNOT = { x: 300, y: 150 };

function pathFor(i: number) {
  const spreadL = -70 + (i / 14) * 140;
  const spreadR = -80 + (((i * 7) % 15) / 14) * 160;
  const bowA = 40 + ((i * 13) % 60);
  const bowB = 40 + ((i * 23) % 70);
  return `M20 ${150 + spreadL}
          C 110 ${150 + spreadL - bowA}, 200 ${KNOT.y + (i % 2 ? bowA : -bowA) * 0.35}, ${KNOT.x} ${KNOT.y}
          C ${KNOT.x + 100} ${KNOT.y + (i % 3 ? -bowB : bowB) * 0.4}, 490 ${150 + spreadR + bowB * 0.2}, 580 ${150 + spreadR}`;
}

export default function InvariantDiagram({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0); // 0 = many, 1 = the point, 2 = the hinge

  const next = () => {
    if (step < 2) {
      setStep((s) => s + 1);
      audio.ui(step === 0 ? 620 : 820);
    } else {
      audio.chime();
      onClose();
    }
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-[#05070a]/95 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-3xl"
        initial={{ scale: 0.95, y: 18 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        <p className="font-term text-center text-[10px] tracking-[0.55em] text-amber-200/70">
          A CONCEPT YOU WILL NEED
        </p>
        <h2 className="font-display mt-2 text-center text-4xl font-medium text-white text-glow-amber sm:text-5xl">
          The Invariant
        </h2>

        {/* the diagram */}
        <div className="mt-6 rounded-2xl border border-amber-200/15 bg-black/40 p-4">
          <svg viewBox="0 0 600 300" className="h-full w-full">
            <defs>
              <linearGradient id="inv-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(159,215,255,0.15)" />
                <stop offset="50%" stopColor="rgba(255,217,163,0.75)" />
                <stop offset="100%" stopColor="rgba(127,245,201,0.15)" />
              </linearGradient>
              <filter id="inv-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* the fifteen branches */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.path
                key={i}
                d={pathFor(i)}
                fill="none"
                stroke="url(#inv-line)"
                strokeWidth={step === 0 ? 1.5 : 1}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: step === 0 ? 0.75 : 0.25,
                }}
                transition={{ delay: i * 0.05, duration: 1.4, ease: "easeInOut" }}
              />
            ))}

            {/* labels for the soft edges */}
            <text x="18" y="286" className="font-term" fill="rgba(232,236,239,0.35)" fontSize="9" letterSpacing="3">
              EVERYTHING CHANGES
            </text>
            <text x="466" y="286" className="font-term" fill="rgba(232,236,239,0.35)" fontSize="9" letterSpacing="3">
              EVERYTHING CHANGES
            </text>

            {/* the knot */}
            {step >= 1 && (
              <g>
                <motion.circle
                  cx={KNOT.x}
                  cy={KNOT.y}
                  r="46"
                  fill="none"
                  stroke="rgba(255,217,163,0.35)"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, rotate: 360 }}
                  transition={{ scale: { duration: 0.7 }, opacity: { duration: 0.5 }, rotate: { duration: 40, repeat: Infinity, ease: "linear" } }}
                  style={{ transformOrigin: `${KNOT.x}px ${KNOT.y}px` }}
                />
                <motion.circle
                  cx={KNOT.x}
                  cy={KNOT.y}
                  r="11"
                  fill="#ffd9a3"
                  filter="url(#inv-glow)"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                />
                <motion.text
                  x={KNOT.x}
                  y={KNOT.y - 62}
                  textAnchor="middle"
                  className="font-term"
                  fill="#ffd9a3"
                  fontSize="10"
                  letterSpacing="4"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  THIS DOES NOT
                </motion.text>
              </g>
            )}

            {/* the hinge reading */}
            {step >= 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                {/* the door swinging on the point */}
                <motion.path
                  d={`M${KNOT.x} ${KNOT.y} L ${KNOT.x + 130} ${KNOT.y - 66}`}
                  stroke="#7ff5c9"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  filter="url(#inv-glow)"
                  animate={{ rotate: [0, -26, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: `${KNOT.x}px ${KNOT.y}px` }}
                />
                <motion.text
                  x={KNOT.x}
                  y={KNOT.y + 78}
                  textAnchor="middle"
                  className="font-term"
                  fill="#7ff5c9"
                  fontSize="10"
                  letterSpacing="4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  SO IT CAN BE USED
                </motion.text>
              </motion.g>
            )}
          </svg>
        </div>

        {/* direct player address */}
        <motion.div
          key={step}
          className="mt-5 rounded-xl border border-amber-200/15 bg-black/30 px-6 py-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <Lightbulb size={15} className="mt-0.5 shrink-0 text-amber-200/80" />
            <div>
              {step === 0 && (
                <p className="text-[15px] leading-relaxed text-white/70">
                  Across the branches of Aevum, almost everything is <span className="text-white">soft</span>. Change a
                  season, a city, a war — the branch bends around it and carries on. Fifteen versions of a life can run
                  fifteen different ways.
                </p>
              )}
              {step === 1 && (
                <p className="text-[15px] leading-relaxed text-white/70">
                  A rare few facts are not soft. An <span className="text-amber-200">invariant</span> is identical in
                  every version of every world. Veyr found one and read it as a wall — proof that reality had decided
                  something and would not be argued with.
                </p>
              )}
              {step === 2 && (
                <p className="text-[15px] leading-relaxed text-white/70">
                  He is wrong. An invariant is not a wall — it is a <span className="text-emerald-200">hinge</span>. The
                  one point that holds still in every world is the only place you can put a lever.{" "}
                  <span className="text-white/90">Remember this. You will need it before the end.</span>
                </p>
              )}
              <p className="font-term mt-3 text-[9px] tracking-[0.3em] text-white/25">
                {step === 0 ? "1 / 3 · THE SOFT WORLD" : step === 1 ? "2 / 3 · THE POINT THAT WON'T MOVE" : "3 / 3 · WHAT IT IS ACTUALLY FOR"}
              </p>
            </div>
          </div>
        </motion.div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="mx-auto mt-5 flex items-center gap-3 rounded-xl border border-amber-200/40 bg-amber-200/[0.07] px-7 py-3 font-term text-[11px] tracking-[0.3em] text-amber-100 transition-all hover:bg-amber-200/[0.14] hover:shadow-[0_0_36px_rgba(255,217,163,0.2)]"
        >
          {step < 2 ? "CONTINUE" : "UNDERSTOOD"}
          <ArrowRight size={13} />
        </button>
      </motion.div>
    </motion.div>
  );
}
