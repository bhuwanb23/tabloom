import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Lock, X } from "lucide-react";
import { CODEX } from "../game/codex";
import { audio } from "../game/audio";

/* ------------------------------------------------------------------ */
/*  CodexPanel — everything Aevum has let you remember. Locked entries */
/*  stay redacted until the story unlocks them.                        */
/* ------------------------------------------------------------------ */

const CATS = [
  { id: "people", label: "PEOPLE" },
  { id: "places", label: "PLACES" },
  { id: "things", label: "THINGS" },
] as const;

export default function CodexPanel({
  open,
  unlocked,
  onClose,
}: {
  open: boolean;
  unlocked: string[];
  onClose: () => void;
}) {
  const [cat, setCat] = useState<(typeof CATS)[number]["id"]>("people");
  const entries = CODEX.filter((e) => e.cat === cat);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              audio.click(520);
              onClose();
            }}
          />
          <motion.aside
            className="glass-panel fixed bottom-0 right-0 top-0 z-[90] flex w-full max-w-md flex-col border-l border-emerald-200/15"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-6 py-5">
              <BookOpen size={16} className="text-emerald-300/80" />
              <div>
                <h2 className="font-display text-2xl font-medium text-white/95">Codex</h2>
                <p className="font-term text-[9px] tracking-[0.35em] text-white/35">
                  WHAT AEVUM HAS LET YOU REMEMBER
                </p>
              </div>
              <span className="font-term ml-auto rounded-md border border-emerald-200/20 bg-emerald-200/[0.06] px-2 py-1 text-[11px] tabular-nums text-emerald-200/90">
                {unlocked.length}/{CODEX.length}
              </span>
              <button
                onClick={() => {
                  audio.click(520);
                  onClose();
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] text-white/50 transition-colors hover:border-emerald-200/30 hover:text-emerald-100"
              >
                <X size={14} />
              </button>
            </div>

            {/* categories */}
            <div className="flex gap-2 px-6 pt-4">
              {CATS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    audio.select(600);
                    setCat(c.id);
                  }}
                  className={`font-term rounded-md px-3.5 py-1.5 text-[10px] tracking-[0.28em] transition-all ${
                    cat === c.id
                      ? "border border-emerald-300/40 bg-emerald-300/[0.1] text-emerald-100"
                      : "border border-white/[0.08] text-white/40 hover:text-white/70"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* entries */}
            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
              {entries.map((e, i) => {
                const isOpen = unlocked.includes(e.id);
                return (
                  <motion.article
                    key={e.id}
                    className="relative overflow-hidden rounded-xl border p-4"
                    style={{
                      borderColor: isOpen ? "rgba(127,245,201,0.16)" : "rgba(255,255,255,0.06)",
                      background: isOpen ? "rgba(127,245,201,0.03)" : "rgba(255,255,255,0.015)",
                    }}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    {isOpen ? (
                      <>
                        <p className="font-term text-[9px] tracking-[0.3em] text-emerald-300/60">{e.kicker.toUpperCase()}</p>
                        <h3 className="font-display mt-1 text-xl text-white/95">{e.title}</h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-white/55">{e.body}</p>
                      </>
                    ) : (
                      <div className="flex items-center gap-3 py-1.5">
                        <Lock size={13} className="shrink-0 text-white/25" />
                        <div>
                          <p className="font-term text-[11px] tracking-[0.3em] text-white/25">
                            {"█".repeat(Math.max(4, e.title.length))}
                          </p>
                          <p className="font-term mt-1 text-[9px] tracking-[0.2em] text-white/15">
                            SEALED — THE STORY HAS NOT SPOKEN THIS YET
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.article>
                );
              })}
            </div>

            <div className="border-t border-white/[0.07] px-6 py-3">
              <p className="font-term text-center text-[9px] tracking-[0.35em] text-white/25">
                TEN ACTS · THE REST IS ROOT BELOW
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
