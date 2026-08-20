import { motion } from "framer-motion";
import { Home, RotateCcw } from "lucide-react";
import { audio } from "../game/audio";
import BranchDiagram from "./BranchDiagram";
import Motes from "./fx/Motes";

/* ------------------------------------------------------------------ */
/*  Credits — the title card as a bookend. Same tree, different truth  */
/*  depending on how the sentence was finished.                        */
/* ------------------------------------------------------------------ */

const ENDINGS: Record<
  string,
  { name: string; numeral: string; line: string; tone: string; sub: string }
> = {
  regrowth: {
    name: "THE REGROWTH",
    numeral: "ENDING ONE",
    line: "The wound was mended, and the branches grew back knowing what they had cost.",
    tone: "#7ff5c9",
    sub: "he set it down",
  },
  merge: {
    name: "THE MERGE",
    numeral: "ENDING TWO",
    line: "Fifteen rooms became one room. Everyone came home. There was nobody left to be from anywhere.",
    tone: "#ffb08c",
    sub: "he took it up, and agreed",
  },
  sundering: {
    name: "THE SUNDERING",
    numeral: "ENDING THREE",
    line: "He cut the root-system free of its keeper. Nothing was steered again — including him.",
    tone: "#cfd6e4",
    sub: "he took it up, and refused",
  },
};

export default function Credits({
  ending,
  onReplay,
  onTitle,
}: {
  ending: string;
  onReplay: () => void;
  onTitle: () => void;
}) {
  const e = ENDINGS[ending] ?? ENDINGS.regrowth;

  return (
    <div className="relative h-full overflow-y-auto bg-[#04060a] no-select">
      <div
        className="pointer-events-none fixed inset-0"
        style={{ background: `radial-gradient(ellipse 70% 55% at 50% 58%, ${e.tone}14, transparent 70%)` }}
      />
      <Motes tone={ending === "merge" ? "ember" : ending === "sundering" ? "ice" : "root"} count={34} className="pointer-events-none fixed inset-0 h-full w-full" />
      <div className="grain-layer pointer-events-none fixed inset-0" />

      <div className="relative z-10 mx-auto flex min-h-full max-w-3xl flex-col items-center px-6 py-16 text-center">
        <motion.p
          className="font-term text-[10px] tracking-[0.6em]"
          style={{ color: `${e.tone}b0` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {e.numeral}
        </motion.p>
        <motion.h1
          className="font-display mt-4 text-5xl font-medium text-white sm:text-6xl"
          style={{ textShadow: `0 0 50px ${e.tone}55` }}
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2.2, delay: 0.4 }}
        >
          {e.name}
        </motion.h1>
        <motion.p
          className="font-display mt-6 max-w-xl text-lg font-light italic leading-relaxed text-white/60 sm:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.4 }}
        >
          {e.line}
        </motion.p>
        <motion.p
          className="font-term mt-4 text-[9px] tracking-[0.4em] text-white/25"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
        >
          {e.sub.toUpperCase()}
        </motion.p>

        {/* the tree, bookended */}
        <motion.div
          className="mt-10 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ duration: 2.4, delay: 2.4 }}
        >
          <BranchDiagram dead={ending !== "regrowth"} height={230} />
        </motion.div>

        {/* the title card, returned */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.4, delay: 3.2 }}
        >
          <p className="font-term text-[9px] tracking-[0.55em] text-emerald-300/50">THE LAST MIND OF AEVUM</p>
          <h2 className="font-display text-glow-root mt-3 text-6xl font-medium tracking-[0.1em] text-white sm:text-7xl">
            TABLOOM
          </h2>
          <p className="font-display mt-4 text-base italic text-white/40">
            A story told in tabs that should never have opened.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 w-full max-w-sm space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 3.8 }}
        >
          <div className="hair-line w-full" />
          {[
            ["WRITTEN IN", "TEN ACTS"],
            ["BRANCHES", "FIFTEEN · TEN DEAD"],
            ["ROOT-CRAFT", "GRAFT · PRUNE"],
            ["THE FIRST LIE", "“KEEP LOOKING, ARI.”"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="font-term text-[9px] tracking-[0.3em] text-white/30">{k}</span>
              <span className="font-term text-[9px] tracking-[0.2em] text-white/60">{v}</span>
            </div>
          ))}
          <div className="hair-line w-full" />
        </motion.div>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-3 pb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 4.4 }}
        >
          <button
            onClick={() => {
              audio.bloom();
              onReplay();
            }}
            className="flex items-center gap-2.5 rounded-xl border px-6 py-3 font-term text-[11px] tracking-[0.28em] transition-all"
            style={{ borderColor: `${e.tone}66`, background: `${e.tone}12`, color: "#eef6f2" }}
          >
            <RotateCcw size={13} />
            BEGIN AGAIN
          </button>
          <button
            onClick={() => {
              audio.click(640);
              onTitle();
            }}
            className="flex items-center gap-2.5 rounded-xl border border-white/[0.12] bg-white/[0.03] px-6 py-3 font-term text-[11px] tracking-[0.28em] text-white/70 transition-all hover:border-white/30 hover:text-white"
          >
            <Home size={13} />
            TITLE
          </button>
        </motion.div>

        <motion.p
          className="font-term pb-6 text-[9px] tracking-[0.35em] text-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 5 }}
        >
          THREE WAYS TO FINISH A SENTENCE · YOU FOUND ONE
        </motion.p>
      </div>
    </div>
  );
}
