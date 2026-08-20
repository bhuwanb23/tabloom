import { motion } from "framer-motion";
import { BookOpen, Check, GitBranch, Home, Layers, Lock, RotateCcw, Sprout } from "lucide-react";
import type { RunStats } from "../game/types";
import Motes from "./fx/Motes";
import SennAvatar from "./SennAvatar";

/* ------------------------------------------------------------------ */
/*  EndOfAct — the report card after Act I. Stats, Senn's lie, and     */
/*  the sealed roadmap of acts II–X.                                   */
/* ------------------------------------------------------------------ */

export default function EndOfAct({
  stats,
  codexCount,
  codexTotal,
  onReplay,
  onTitle,
  onOpenCodex,
}: {
  stats: RunStats;
  codexCount: number;
  codexTotal: number;
  onReplay: () => void;
  onTitle: () => void;
  onOpenCodex: () => void;
}) {
  const chips = [
    { icon: GitBranch, label: "COHERENCE", value: `${stats.coherence}%`, tone: "#7ff5c9" },
    { icon: Sprout, label: "MEMORIES GRAFTED", value: stats.grafted ? "1" : "0", tone: "#ffd9a3" },
    { icon: Layers, label: "TABS OPENED", value: "2", tone: "#9fd7ff" },
    { icon: BookOpen, label: "CODEX RECOVERED", value: `${codexCount}/${codexTotal}`, tone: "#c9b8ff" },
  ];

  return (
    <div className="relative flex h-full flex-col items-center overflow-y-auto bg-[#04060a] px-4 py-10 no-select">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(44,143,107,0.12), transparent 70%)",
        }}
      />
      <Motes tone="root" count={30} className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />
      <div className="grain-layer pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <motion.p
          className="font-term text-[10px] tracking-[0.6em] text-emerald-300/70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          END OF ACT I
        </motion.p>
        <motion.h1
          className="font-display mt-3 text-center text-5xl font-medium text-white text-glow-root sm:text-6xl"
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.15, duration: 0.9 }}
        >
          Ash and Rain
        </motion.h1>
        <motion.p
          className="font-term mt-3 text-[10px] tracking-[0.4em] text-white/35"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          NARA-0 · FIFTEEN SHADOWS, ONE BODY
        </motion.p>

        {/* stats */}
        <motion.div
          className="mt-9 grid w-full grid-cols-2 gap-2.5 sm:grid-cols-4"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {chips.map((c, i) => (
            <motion.div
              key={c.label}
              className="glass-panel rounded-xl px-4 py-3.5 text-center"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
            >
              <c.icon size={15} className="mx-auto" style={{ color: c.tone }} />
              <p className="mt-2 text-xl font-semibold tabular-nums text-white/90">{c.value}</p>
              <p className="font-term mt-1 text-[8px] tracking-[0.28em] text-white/35">{c.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* senn's lie */}
        <motion.div
          className="glass-panel mt-8 flex w-full items-center gap-5 rounded-2xl px-6 py-5"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          <div className="hidden shrink-0 sm:block">
            <SennAvatar size={84} />
          </div>
          <div>
            <p className="font-display text-xl italic leading-relaxed text-white/90 sm:text-2xl">
              “Keep looking, Ari. You may be surprised.”
            </p>
            <p className="font-term mt-2 text-[10px] tracking-[0.35em] text-emerald-300/60">— SENN, LAST WORDS OF ACT I</p>
            <p className="mt-2 text-xs italic text-white/35">
              It does not feel like a lie. That is the whole design of it.
            </p>
          </div>
        </motion.div>

        {/* roadmap */}
        <motion.div
          className="mt-9 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="font-term mb-3 text-center text-[9px] tracking-[0.45em] text-white/30">
            THE SHAPE OF WHAT'S COMING
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 10 }).map((_, i) => {
              const n = i + 1;
              const done = n === 1;
              const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
              return (
                <div
                  key={n}
                  className="flex min-w-[104px] flex-1 flex-col items-center rounded-lg border px-2 py-3"
                  style={{
                    borderColor: done ? "rgba(127,245,201,0.4)" : "rgba(255,255,255,0.06)",
                    background: done ? "rgba(127,245,201,0.05)" : "rgba(255,255,255,0.015)",
                  }}
                >
                  {done ? (
                    <Check size={13} className="text-emerald-300" />
                  ) : (
                    <Lock size={12} className="text-white/20" />
                  )}
                  <span className="font-term mt-1.5 text-[10px] tracking-[0.2em] text-white/60">ACT {romans[i]}</span>
                  <span className="font-term mt-0.5 text-[8px] tracking-[0.14em] text-white/25">
                    {done ? "COMPLETE" : "SEALED"}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* actions */}
        <motion.div
          className="mt-9 flex flex-wrap items-center justify-center gap-3 pb-6"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <button
            onClick={onReplay}
            className="flex items-center gap-2.5 rounded-xl border border-emerald-300/40 bg-emerald-300/[0.07] px-6 py-3 font-term text-[11px] tracking-[0.28em] text-emerald-100 transition-all hover:bg-emerald-300/[0.14] hover:shadow-[0_0_36px_rgba(127,245,201,0.2)]"
          >
            <RotateCcw size={13} />
            REPLAY ACT I
          </button>
          <button
            onClick={onOpenCodex}
            className="flex items-center gap-2.5 rounded-xl border border-white/[0.12] bg-white/[0.03] px-6 py-3 font-term text-[11px] tracking-[0.28em] text-white/70 transition-all hover:border-amber-200/40 hover:text-amber-100"
          >
            <BookOpen size={13} />
            OPEN CODEX
          </button>
          <button
            onClick={onTitle}
            className="flex items-center gap-2.5 rounded-xl border border-white/[0.12] bg-white/[0.03] px-6 py-3 font-term text-[11px] tracking-[0.28em] text-white/70 transition-all hover:border-white/30 hover:text-white"
          >
            <Home size={13} />
            TITLE
          </button>
        </motion.div>
      </div>
    </div>
  );
}
