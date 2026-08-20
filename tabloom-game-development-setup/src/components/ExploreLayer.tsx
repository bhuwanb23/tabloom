import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MousePointerClick, Sparkles, X } from "lucide-react";
import type { Beat } from "../game/types";
import { audio } from "../game/audio";

/* ------------------------------------------------------------------ */
/*  ExploreLayer — the most hotspots in the game. Optional Witness     */
/*  Fragments scattered across the frame, each a short readable        */
/*  popup, plus one mandatory way onward. Rewards looking.             */
/* ------------------------------------------------------------------ */

type Find = Extract<Beat, { k: "explore" }>["finds"][number];
type Exit = Extract<Beat, { k: "explore" }>["exit"];

export default function ExploreLayer({
  finds,
  exit,
  onFind,
  onExit,
}: {
  finds: Find[];
  exit: Exit;
  onFind: (id: string) => void;
  onExit: () => void;
}) {
  const [taken, setTaken] = useState<string[]>([]);
  const [open, setOpen] = useState<Find | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setShowTip(false), 4200);
    return () => window.clearTimeout(t);
  }, []);

  const pick = (f: Find) => {
    if (taken.includes(f.id)) return;
    setTaken((t) => [...t, f.id]);
    setOpen(f);
    audio.chime();
    onFind(f.id);
  };

    const leave = () => {
    if (leaving) return;
    setLeaving(true);
    audio.select(620);
    window.setTimeout(onExit, 400);
  };

  return (
    <>
      {/* optional fragments */}
      {finds.map((f, i) => {
        const got = taken.includes(f.id);
        return (
          <motion.button
            key={f.id}
            className="absolute z-30"
            style={{ left: `${f.rect[0]}%`, top: `${f.rect[1]}%`, width: `${f.rect[2]}%`, height: `${f.rect[3]}%` }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: got ? 0.35 : 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.14, duration: 0.7 }}
            onClick={(e) => {
              e.stopPropagation();
              pick(f);
            }}
            aria-label={f.label}
          >
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {!got && (
                <motion.span
                  className="absolute left-1/2 top-1/2 block h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-200/50"
                  animate={{ scale: [0.7, 1.9], opacity: [0.75, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: i * 0.3 }}
                />
              )}
              <span
                className="block h-2.5 w-2.5 rotate-45"
                style={{
                  background: got ? "rgba(255,255,255,0.18)" : "#ffe9b3",
                  boxShadow: got ? "none" : "0 0 14px rgba(255,217,163,0.9)",
                  animation: got ? undefined : `pulseglow ${2.4 + (i % 3) * 0.6}s ease-in-out infinite`,
                }}
              />
            </span>
          </motion.button>
        );
      })}

      {/* the way onward */}
      <motion.button
        className="absolute z-30"
        style={{ left: `${exit.rect[0]}%`, top: `${exit.rect[1]}%`, width: `${exit.rect[2]}%`, height: `${exit.rect[3]}%` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          leave();
        }}
        aria-label={exit.label}
      >
        <motion.span
          className="absolute inset-0 rounded-lg"
          style={{ background: "radial-gradient(ellipse, rgba(127,245,201,0.12), transparent 70%)", border: "1px dashed rgba(127,245,201,0.3)" }}
          animate={{ opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 2.6, repeat: Infinity }}
        />
        <span className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-[115%] items-center gap-2 whitespace-nowrap rounded-md border border-emerald-200/30 bg-[#070b10]/90 px-3 py-1.5">
          <MousePointerClick size={11} className="text-emerald-300/90" />
          <span className="font-term text-[10px] tracking-[0.3em] text-emerald-100">{exit.label}</span>
          {exit.sub && <span className="font-term text-[9px] tracking-[0.12em] text-white/40">{exit.sub}</span>}
        </span>
      </motion.button>

      {/* counter + tip */}
      <motion.div
        className="pointer-events-none absolute right-4 top-4 z-30 flex flex-col items-end gap-2"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2 rounded-lg border border-amber-200/20 bg-black/50 px-3 py-2">
          <Sparkles size={11} className="text-amber-200/80" />
          <span className="font-term text-[10px] tracking-[0.25em] text-white/70">
            FRAGMENTS {taken.length}/{finds.length}
          </span>
        </div>
        <AnimatePresence>
          {showTip && (
            <motion.p
              className="rounded-md border border-white/10 bg-black/55 px-3 py-1.5 font-term text-[9px] tracking-[0.28em] text-white/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              OPTIONAL FRAGMENTS · LOOK AROUND
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* fragment reader */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 p-5 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              audio.click(520);
              setOpen(null);
            }}
          >
            <motion.div
              className="glass-panel relative w-full max-w-md rounded-2xl px-6 py-6"
              style={{ borderColor: "rgba(255,217,163,0.22)" }}
              initial={{ scale: 0.92, y: 18 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute right-4 top-4 text-white/35 transition-colors hover:text-white/80"
                onClick={() => {
                  audio.click(520);
                  setOpen(null);
                }}
              >
                <X size={14} />
              </button>
              <p className="font-term text-[9px] tracking-[0.4em] text-amber-200/70">WITNESS FRAGMENT</p>
              <h3 className="font-display mt-1.5 text-2xl text-white/95">{open.title}</h3>
              <div className="hair-line my-4 w-full" />
              <p className="font-display text-[15px] italic leading-relaxed text-white/65">{open.body}</p>
              <button
                onClick={() => {
                  audio.click(520);
                  setOpen(null);
                }}
                className="font-term mt-5 flex items-center gap-2 text-[10px] tracking-[0.28em] text-amber-200/80 transition-colors hover:text-amber-100"
              >
                SET IT DOWN
                <ArrowRight size={11} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
