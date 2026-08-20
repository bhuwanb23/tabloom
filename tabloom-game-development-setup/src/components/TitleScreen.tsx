import { motion } from "framer-motion";
import { BookOpen, Headphones, Play, RotateCcw, Sparkles } from "lucide-react";
import BranchDiagram from "./BranchDiagram";
import Motes from "./fx/Motes";
import { audio } from "../game/audio";

/* ------------------------------------------------------------------ */
/*  TitleScreen — Aevum's fan of fifteen branches, ten of them dead,   */
/*  each tip a tab. The tree literally blooms tabs.                    */
/* ------------------------------------------------------------------ */

export default function TitleScreen({
  hasSave,
  completed,
  onBegin,
  onContinue,
  onOpenCodex,
}: {
  hasSave: boolean;
  completed: number; // 0 = fresh, 1 = act i done, 2 = act ii done
  onBegin: () => void;
  onContinue: () => void;
  onOpenCodex: () => void;
}) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[#04060a] no-select">
      {/* backdrop glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 62%, rgba(44,143,107,0.14), transparent 70%), radial-gradient(ellipse 90% 60% at 50% 110%, rgba(127,245,201,0.06), transparent 60%)",
        }}
      />
      <Motes tone="root" count={42} className="absolute inset-0 h-full w-full" />
      <div className="grain-layer absolute inset-0" />

      {/* the tree */}
      <motion.div
        className="pointer-events-none absolute bottom-[8%] left-1/2 -translate-x-1/2 opacity-80"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      >
        <BranchDiagram dead width={560} height={400} />
      </motion.div>

      {/* content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.p
          className="font-term mb-5 flex items-center gap-3 text-[10px] tracking-[0.6em] text-emerald-300/60"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9 }}
        >
          <Sparkles size={11} />
          THE LAST MIND OF AEVUM
          <Sparkles size={11} />
        </motion.p>

        <h1 className="font-display text-glow-root text-[17vw] font-medium leading-none tracking-[0.08em] text-white sm:text-[110px] md:text-[130px]">
          {"TABLOOM".split("").map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.55 + i * 0.08, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="font-display mt-6 max-w-xl text-lg font-light italic text-white/55 sm:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 1 }}
        >
          A story told in tabs that should never have opened.
        </motion.p>

        {/* menu */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <button
            onClick={() => {
              audio.start();
              audio.bloom();
              onBegin();
            }}
            className="group relative flex items-center gap-3 rounded-xl border border-emerald-300/40 bg-emerald-300/[0.07] px-8 py-3.5 font-term text-xs tracking-[0.3em] text-emerald-100 transition-all hover:border-emerald-200/70 hover:bg-emerald-300/[0.14] hover:shadow-[0_0_44px_rgba(127,245,201,0.25)]"
          >
            <Play size={13} className="transition-transform group-hover:scale-125" />
            {completed >= 2 ? "REPLAY — ACTS I–IV" : completed === 1 ? "REPLAY ACT I" : "BEGIN — ACT I"}
            <span className="absolute -top-px left-1/2 h-px w-0 -translate-x-1/2 bg-emerald-200 transition-all duration-500 group-hover:w-3/4" />
          </button>

          {hasSave && (
            <button
              onClick={() => {
                audio.start();
                audio.ui();
                onContinue();
              }}
              className="flex items-center gap-3 rounded-xl border border-white/[0.12] bg-white/[0.03] px-8 py-3.5 font-term text-xs tracking-[0.3em] text-white/70 transition-all hover:border-amber-200/40 hover:text-amber-100"
            >
              <RotateCcw size={13} />
              CONTINUE
            </button>
          )}

          <button
            onClick={() => {
              audio.start();
              audio.ui();
              onOpenCodex();
            }}
            className="flex items-center gap-3 rounded-xl border border-white/[0.12] bg-white/[0.03] px-8 py-3.5 font-term text-xs tracking-[0.3em] text-white/70 transition-all hover:border-emerald-200/35 hover:text-emerald-100"
          >
            <BookOpen size={13} />
            CODEX
          </button>
        </motion.div>

        {/* footer */}
        <motion.div
          className="mt-14 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <p className="font-term text-[10px] tracking-[0.4em] text-white/30">
            15 BRANCHES · 10 DEAD · 1 MIND LEFT
          </p>
          <p className="font-term flex items-center gap-2 text-[9px] tracking-[0.3em] text-white/20">
            <Headphones size={10} />
            SOUND RECOMMENDED · A STORY IN TEN ACTS — ACTS I–IV PLAYABLE
          </p>
        </motion.div>
      </div>

      <div className="vignette-layer absolute inset-0" />
    </div>
  );
}
