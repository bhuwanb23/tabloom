import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, GitBranch, Home, Lock, Plus, Volume2, VolumeX } from "lucide-react";
import type { BranchId } from "../game/types";

/* ------------------------------------------------------------------ */
/*  TabBar — the game's crown jewel: realities as browser tabs.        */
/* ------------------------------------------------------------------ */

const BRANCH_STYLE: Record<BranchId, { dot: string; glow: string; label: string }> = {
  nara: { dot: "#aebfd0", glow: "rgba(174,191,208,0.5)", label: "NARA-0.branch" },
  karth: { dot: "#9fd7ff", glow: "rgba(159,215,255,0.55)", label: "KARTH-MUUN.branch" },
  void: { dot: "#7ff5c9", glow: "rgba(127,245,201,0.5)", label: "aevum://root" },
};

export default function TabBar({
  tabs,
  active,
  sceneUrl,
  sceneTag,
  coherence,
  muted,
  locked,
  awaiting = null,
  glowTab = null,
  disabledTabs = [],
  onSelect,
  onTease,
  onCodex,
  onMute,
  onHome,
}: {
  tabs: BranchId[];
  active: BranchId;
  sceneUrl: string;
  sceneTag: string;
  coherence: number;
  muted: boolean;
  locked: boolean;
  awaiting?: BranchId | null;
  glowTab?: BranchId | null;
  disabledTabs?: BranchId[];
  onSelect: (b: BranchId) => void;
  onTease: () => void;
  onCodex: () => void;
  onMute: () => void;
  onHome: () => void;
}) {
  return (
    <div className="relative z-40 flex h-11 items-stretch gap-2 border-b border-white/[0.06] bg-[#070910] no-select">
      {/* left cluster — window dots, but they're tiny branches */}
      <div className="hidden items-center gap-1.5 pl-4 pr-1 sm:flex">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full"
            style={{
              background: i === 0 ? "rgba(127,245,201,0.7)" : "rgba(255,255,255,0.14)",
              boxShadow: i === 0 ? "0 0 6px rgba(127,245,201,0.6)" : undefined,
            }}
          />
        ))}
      </div>

      {/* tabs */}
      <div className="flex min-w-0 items-end gap-1 pt-1.5">
        <AnimatePresence>
          {tabs.map((t) => {
            const st = BRANCH_STYLE[t];
            const isActive = t === active;
            const isAwaited = awaiting === t;
            const isGlowing = glowTab === t;
            const isDisabled = disabledTabs.includes(t);
            return (
              <motion.button
                key={t}
                initial={{ width: 0, opacity: 0, y: 8 }}
                animate={{
                  width: "auto",
                  opacity: 1,
                  y: 0,
                  boxShadow: isAwaited
                    ? ["0 0 0px rgba(127,245,201,0)", "0 0 26px rgba(127,245,201,0.5)", "0 0 0px rgba(127,245,201,0)"]
                    : isGlowing
                      ? "0 0 18px rgba(255,217,163,0.35)"
                      : "0 0 0px rgba(0,0,0,0)",
                }}
                exit={{ width: 0, opacity: 0 }}
                transition={
                  isAwaited
                    ? { boxShadow: { duration: 1.4, repeat: Infinity }, type: "spring", stiffness: 260, damping: 26 }
                    : { type: "spring", stiffness: 260, damping: 26 }
                }
                onClick={() => !isActive && !isDisabled && onSelect(t)}
                className={`clip-tab group relative flex h-9 items-center gap-2 overflow-visible px-3.5 font-term text-[10px] tracking-[0.14em] transition-colors sm:px-4 sm:text-[11px] ${
                  isDisabled
                    ? "cursor-not-allowed bg-white/[0.015] text-white/18"
                    : isActive
                      ? "bg-[#101623] text-white"
                      : "cursor-pointer bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white/70"
                } ${isAwaited ? "text-emerald-100" : ""}`}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    background: isDisabled ? "rgba(255,255,255,0.15)" : isGlowing ? "#ffd9a3" : st.dot,
                    boxShadow: isDisabled ? "none" : isGlowing ? "0 0 10px rgba(255,217,163,0.9)" : `0 0 8px ${st.glow}`,
                  }}
                />
                <span className="whitespace-nowrap">{st.label}</span>
                {isDisabled && <Lock size={10} className="text-white/25" />}
                {isAwaited && (
                  <motion.span
                    className="absolute -top-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-emerald-300"
                    style={{ boxShadow: "0 0 8px rgba(127,245,201,0.9)" }}
                    animate={{ y: [0, -3, 0], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                {isActive && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute inset-x-2 bottom-0 h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${st.dot}, transparent)`,
                      boxShadow: `0 0 12px ${st.glow}`,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* the plus — a door that isn't a door yet */}
        <button
          onClick={onTease}
          className="group mb-1 ml-1 flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.07] text-white/30 transition-all hover:border-emerald-200/25 hover:text-emerald-200/70"
          title="open another world"
        >
          <Plus size={12} className="transition-transform group-hover:rotate-90" />
        </button>
      </div>

      {/* address strip */}
      <div className="mx-2 mb-1.5 hidden min-w-0 flex-1 items-center gap-2 self-end rounded-md border border-white/[0.05] bg-black/40 px-3 py-1 md:flex">
        <span className="h-1 w-1 shrink-0 animate-pulse rounded-full bg-emerald-300/80" />
        <span className="truncate font-term text-[10px] tracking-wider text-white/45">
          {sceneUrl}
          <span className="mx-2 text-white/15">·</span>
          <span className="text-white/30">{sceneTag}</span>
        </span>
        {locked && <span className="ml-auto font-term text-[9px] tracking-[0.25em] text-white/20">WITNESSING</span>}
      </div>

      <div className="flex-1 md:hidden" />

      {/* right cluster — integrity, coherence, actions */}
      <div className="flex items-center gap-2 pr-2 sm:gap-3 sm:pr-3">
        {/* branch integrity 5/15 */}
        <div className="hidden items-center gap-1.5 lg:flex" title="branch integrity — 5 of 15 alive">
          <div className="flex gap-[3px]">
            {Array.from({ length: 15 }).map((_, i) => (
              <span
                key={i}
                className="h-3 w-[3px] rounded-full"
                style={{
                  background: i < 5 ? "rgba(127,245,201,0.8)" : "rgba(255,255,255,0.09)",
                  boxShadow: i < 5 ? "0 0 5px rgba(127,245,201,0.5)" : undefined,
                }}
              />
            ))}
          </div>
          <span className="font-term text-[10px] tracking-[0.2em] text-white/35">5/15</span>
        </div>

        {/* coherence */}
        <div className="flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-black/30 px-2 py-1" title="coherence">
          <GitBranch size={12} className="text-emerald-300/80" />
          <span className="font-term text-[11px] tabular-nums text-white/70">{coherence}</span>
          <div className="hidden h-1 w-10 overflow-hidden rounded-full bg-white/[0.07] sm:block">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #2c8f6b, #7ff5c9)" }}
              animate={{ width: `${coherence}%` }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
            />
          </div>
        </div>

        <button
          onClick={onCodex}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.07] text-white/40 transition-colors hover:border-emerald-200/25 hover:text-emerald-200/80"
          title="codex"
        >
          <BookOpen size={13} />
        </button>
        <button
          onClick={onMute}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.07] text-white/40 transition-colors hover:border-emerald-200/25 hover:text-emerald-200/80"
          title={muted ? "unmute" : "mute"}
        >
          {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
        <button
          onClick={onHome}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.07] text-white/40 transition-colors hover:border-emerald-200/25 hover:text-emerald-200/80"
          title="return to title"
        >
          <Home size={13} />
        </button>
      </div>
    </div>
  );
}
