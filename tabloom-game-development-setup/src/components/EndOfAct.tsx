import { motion } from "framer-motion";
import { BookOpen, Check, GitBranch, Heart, Home, KeyRound, Layers, Lock, RotateCcw, Scissors } from "lucide-react";
import type { RunStats } from "../game/types";
import Motes from "./fx/Motes";
import SennAvatar from "./SennAvatar";
import { KaelSprite } from "./sprites/CastSprites";

/* ------------------------------------------------------------------ */
/*  EndOfAct — the report card after an act. Per-act titles, quotes,   */
/*  stat chips, and the sealed roadmap of remaining acts.              */
/* ------------------------------------------------------------------ */

const ACT_INFO: Record<
  number,
  {
    title: string;
    sub: string;
    kicker: string;
    quote: string;
    quoteBy: string;
    caption: string;
    chips: { icon: typeof GitBranch; label: string; value: string; tone: string }[];
  }
> = {
  1: {
    title: "Ash and Rain",
    sub: "NARA-0 · FIFTEEN SHADOWS, ONE BODY",
    kicker: "END OF ACT I",
    quote: "Keep looking, Ari. You may be surprised.",
    quoteBy: "— SENN, LAST WORDS OF ACT I",
    caption: "It does not feel like a lie. That is the whole design of it.",
    chips: [
      { icon: GitBranch, label: "COHERENCE", value: "", tone: "#7ff5c9" },
      { icon: KeyRound, label: "THE DRAWER", value: "CRACKED", tone: "#ffd9a3" },
      { icon: Layers, label: "TABS OPENED", value: "2", tone: "#9fd7ff" },
      { icon: BookOpen, label: "CODEX RECOVERED", value: "", tone: "#c9b8ff" },
    ],
  },
  2: {
    title: "The Man Who Chose Well",
    sub: "KARTH-MUUN · THE LOOP, A CRACK IN THE FIST",
    kicker: "END OF ACT II",
    quote: "You cut to heal — that's the whole trade.",
    quoteBy: "— KAEL ORIN, BESIDE THE HEART",
    caption: "Kind voices keep the sharpest gardens.",
    chips: [
      { icon: GitBranch, label: "COHERENCE", value: "", tone: "#7ff5c9" },
      { icon: Scissors, label: "FIRST PRUNE", value: "CLEAN", tone: "#ff8a6a" },
      { icon: Heart, label: "CURSE-HEART", value: "CRACKED", tone: "#ff5a44" },
      { icon: BookOpen, label: "CODEX RECOVERED", value: "", tone: "#c9b8ff" },
    ],
  },
};

const ROMANS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export default function EndOfAct({
  act,
  completedActs,
  stats,
  codexCount,
  codexTotal,
  onReplay,
  onTitle,
  onOpenCodex,
}: {
  act: number;
  completedActs: number[];
  stats: RunStats;
  codexCount: number;
  codexTotal: number;
  onReplay: () => void;
  onTitle: () => void;
  onOpenCodex: () => void;
}) {
  const info = ACT_INFO[act] ?? ACT_INFO[1];
  const chips = info.chips.map((c, i) => ({
    ...c,
    value:
      i === 0
        ? `${stats.coherence}%`
        : c.label === "CODEX RECOVERED"
          ? `${codexCount}/${codexTotal}`
          : c.label === "THE DRAWER" && stats.grafted
            ? "GRAFTED"
            : c.value,
  }));

  return (
    <div className="relative flex h-full flex-col items-center overflow-y-auto bg-[#04060a] px-4 py-10 no-select">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            act === 2
              ? "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(120,60,40,0.14), transparent 70%)"
              : "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(44,143,107,0.12), transparent 70%)",
        }}
      />
      <Motes tone={act === 2 ? "ice" : "root"} count={30} className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />
      <div className="grain-layer pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <motion.p
          className="font-term text-[10px] tracking-[0.6em] text-emerald-300/70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {info.kicker}
        </motion.p>
        <motion.h1
          className="font-display mt-3 text-center text-5xl font-medium text-white text-glow-root sm:text-6xl"
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.15, duration: 0.9 }}
        >
          {info.title}
        </motion.h1>
        <motion.p
          className="font-term mt-3 text-[10px] tracking-[0.4em] text-white/35"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {info.sub}
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

        {/* the quote that matters */}
        <motion.div
          className="glass-panel mt-8 flex w-full items-center gap-5 rounded-2xl px-6 py-5"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          <div className="hidden shrink-0 sm:block">
            {act === 2 ? (
              <div className="h-24 w-16">
                <KaelSprite className="h-full w-full" />
              </div>
            ) : (
              <SennAvatar size={84} />
            )}
          </div>
          <div>
            <p className="font-display text-xl italic leading-relaxed text-white/90 sm:text-2xl">
              “{info.quote}”
            </p>
            <p className="font-term mt-2 text-[10px] tracking-[0.35em] text-emerald-300/60">{info.quoteBy}</p>
            <p className="mt-2 text-xs italic text-white/35">{info.caption}</p>
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
              const num = i + 1;
              const done = completedActs.includes(num);
              return (
                <div
                  key={num}
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
                  <span className="font-term mt-1.5 text-[10px] tracking-[0.2em] text-white/60">ACT {ROMANS[i]}</span>
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
            REPLAY FROM ACT I
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
