import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, GripVertical, Lock } from "lucide-react";
import { audio } from "../game/audio";

/* ------------------------------------------------------------------ */
/*  DocPuzzle — reconstruct Veyr's archive. Six parchment tiles,       */
/*  shuffled; drag them into chronological order. Correct order gilds  */
/*  the row and a seventh file — the one he never filed — fades in.    */
/* ------------------------------------------------------------------ */

interface Doc {
  id: number;
  branch: string;
  head: string;
  body: string;
  stamp: string;
  order: number; // true chronological position
}

const DOCS: Doc[] = [
  {
    id: 0,
    order: 0,
    branch: "ORA-VELL",
    head: "ADMISSION — WARD OF SAINT VELLUM",
    body: "Patient: AURIC, LIORA. Age 11. Wasting of the root-nerve. Prognosis guarded. Father present, refuses to leave the ward.",
    stamp: "FILE 01",
  },
  {
    id: 1,
    order: 1,
    branch: "ORA-VELL",
    head: "EXPENDITURE — HOUSE AURIC",
    body: "Sale of the northern holdings. Sale of the observatory. Sale of the name. Every physician in four cities retained. Nothing held.",
    stamp: "FILE 02",
  },
  {
    id: 2,
    order: 2,
    branch: "ORA-VELL",
    head: "CERTIFICATE OF DEATH",
    body: "AURIC, LIORA. Age 11. Cause: wasting of the root-nerve. The attending notes the father did not weep. He asked for the exact minute.",
    stamp: "FILE 03",
  },
  {
    id: 3,
    order: 3,
    branch: "TESS-4",
    head: "FIELD NOTE — SECOND BRANCH",
    body: "Found her. Different city, different mother, different sky. Same age. Same wasting. I changed the physician, the season, the water. She died on the same date.",
    stamp: "FILE 04",
  },
  {
    id: 4,
    order: 4,
    branch: "BRANCHES V–XIV",
    head: "TALLY — TEN MORE",
    body: "Ten branches. Ten Lioras. I stopped changing the medicine and started changing the world around her. Wars averted. Plagues bought off. She dies on the date.",
    stamp: "FILE 05",
  },
  {
    id: 5,
    order: 5,
    branch: "ORA-VELL",
    head: "PETITION TO THE WITNESS MIND",
    body: "To the thing that watches all branches and intervenes in none: I have brought you fifteen proofs. Answer me, or admit you are only furniture.",
    stamp: "FILE 06",
  },
];

const FINAL: Doc = {
  id: 99,
  order: 6,
  branch: "UNFILED",
  head: "THE FILE HE NEVER PUT AWAY",
  body: "Fifteen dates. I have compared them to the hour. They are not fifteen dates. They are one date, copied fifteen times, and it will not move for love or money or war. If a thing cannot be changed, it was never a life. It was a wall. I am going to cut the wall down.",
  stamp: "— V. S. A.",
};

/* deterministic scramble that guarantees nothing starts solved */
const SHUFFLED = [3, 0, 5, 1, 4, 2];

function Parchment({
  doc,
  gilded,
  dragging,
  big = false,
}: {
  doc: Doc;
  gilded?: boolean;
  dragging?: boolean;
  big?: boolean;
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[3px] px-3 py-2.5"
      style={{
        background: gilded
          ? "linear-gradient(155deg, #efe3c8, #d8c8a4)"
          : "linear-gradient(155deg, #ded3ba, #c6b998)",
        boxShadow: dragging
          ? "0 22px 40px -10px rgba(0,0,0,0.7)"
          : gilded
            ? "0 0 24px rgba(255,206,138,0.4), inset 0 0 0 1px rgba(255,222,170,0.7)"
            : "0 6px 18px -6px rgba(0,0,0,0.6)",
        color: "#2a2115",
      }}
    >
      {/* paper fibre + stain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          background:
            "radial-gradient(ellipse at 15% 10%, rgba(120,90,50,0.18), transparent 45%), radial-gradient(ellipse at 85% 90%, rgba(90,70,40,0.2), transparent 40%)",
        }}
      />
      <div className="relative flex items-center gap-1.5">
        <FileText size={big ? 13 : 9} className="opacity-60" />
        <span className={`font-term ${big ? "text-[10px]" : "text-[7px]"} tracking-[0.2em] opacity-65`}>{doc.branch}</span>
        <span className={`font-term ml-auto ${big ? "text-[10px]" : "text-[7px]"} tracking-[0.15em] opacity-45`}>{doc.stamp}</span>
      </div>
      <p className={`font-term mt-1.5 ${big ? "text-[13px]" : "text-[8px]"} font-medium leading-tight tracking-[0.06em]`}>
        {doc.head}
      </p>
      <div className="my-1.5 h-px w-full" style={{ background: "rgba(60,45,25,0.28)" }} />
      <p
        className={`${big ? "text-[15px] leading-relaxed" : "text-[7.5px] leading-[1.45]"} opacity-80`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {doc.body}
      </p>
      {gilded && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(115deg, transparent 30%, rgba(255,230,170,0.35) 50%, transparent 70%)" }}
        />
      )}
    </div>
  );
}

export default function DocPuzzle({ onSolved }: { onSolved: () => void }) {
  const [slots, setSlots] = useState<number[]>(SHUFFLED);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [phase, setPhase] = useState<"play" | "gilded" | "final">("play");
  const [openFinal, setOpenFinal] = useState(false);

  const solved = useMemo(() => slots.every((id, i) => DOCS[id].order === i), [slots]);

  const commit = (from: number, to: number) => {
    if (from === to) return;
    const next = [...slots];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setSlots(next);
    audio.ui(560);
    if (next.every((id, i) => DOCS[id].order === i)) {
      audio.chime();
      setPhase("gilded");
      window.setTimeout(() => {
        setPhase("final");
        audio.bloom();
      }, 1400);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass-panel relative w-full max-w-4xl rounded-2xl p-5 sm:p-7"
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
      >
        <div className="mb-1 flex items-start justify-between gap-4">
          <div>
            <p className="font-term text-[10px] tracking-[0.4em] text-amber-200/70">VEYR'S ARCHIVE · RECONSTRUCTION</p>
            <h3 className="font-display mt-1 text-2xl font-medium text-white/95 sm:text-3xl">Put the grief in order</h3>
          </div>
          <div className="flex items-center gap-1.5">
            {slots.map((_, i) => (
              <span
                key={i}
                className="h-1.5 w-5 rounded-full transition-all duration-500"
                style={{
                  background: phase !== "play" ? "#ffd9a3" : "rgba(255,255,255,0.12)",
                  boxShadow: phase !== "play" ? "0 0 8px rgba(255,217,163,0.6)" : undefined,
                }}
              />
            ))}
          </div>
        </div>
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-white/50">
          He kept everything. He just never let anyone read it in sequence. Drag the files into{" "}
          <span className="text-amber-200/90">chronological order</span>, earliest on the left.
        </p>

        {/* the timeline */}
        <div className="relative">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-amber-200/25 to-transparent" />
          <div className="relative grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {slots.map((id, i) => {
              const doc = DOCS[id];
              return (
                <motion.div
                  key={doc.id}
                  layout
                  draggable={phase === "play"}
                  onDragStart={() => setDragIdx(i)}
                  onDragEnter={() => setOverIdx(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnd={() => {
                    if (dragIdx !== null && overIdx !== null) commit(dragIdx, overIdx);
                    setDragIdx(null);
                    setOverIdx(null);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    /* tap fallback: tap A then tap B to swap */
                    if (phase !== "play") return;
                    if (dragIdx === null) {
                      setDragIdx(i);
                      audio.ui(680);
                    } else {
                      commit(dragIdx, i);
                      setDragIdx(null);
                    }
                  }}
                  className="relative aspect-[3/4] cursor-grab active:cursor-grabbing"
                  animate={{
                    scale: dragIdx === i ? 1.05 : 1,
                    y: overIdx === i && dragIdx !== i ? -6 : 0,
                    rotate: dragIdx === i ? -1.5 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  <Parchment doc={doc} gilded={phase !== "play"} dragging={dragIdx === i} />
                  <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1">
                    <GripVertical size={9} className="text-white/20" />
                    <span className="font-term text-[8px] tracking-[0.2em] text-white/25">{i + 1}</span>
                  </div>
                  {dragIdx === i && (
                    <div className="pointer-events-none absolute -inset-1 rounded-[5px] border border-amber-200/70" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* the seventh file */}
        <div className="mt-9 flex min-h-[92px] items-center justify-center">
          <AnimatePresence>
            {phase === "final" ? (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenFinal(true);
                  audio.heart();
                }}
                className="group relative w-full max-w-md cursor-pointer"
                initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="absolute -inset-3 rounded-lg" style={{ background: "radial-gradient(ellipse, rgba(255,206,138,0.2), transparent 70%)", animation: "pulseglow 2.6s ease-in-out infinite" }} />
                <div className="relative flex items-center gap-3 rounded-lg border border-amber-200/40 bg-[#0d0b07]/80 px-5 py-4 transition-colors group-hover:border-amber-200/70">
                  <FileText size={16} className="shrink-0 text-amber-200" />
                  <div className="text-left">
                    <p className="font-term text-[9px] tracking-[0.35em] text-amber-200/70">UNFILED · FOUND BENEATH THE DESK</p>
                    <p className="font-display mt-0.5 text-lg text-white/90">The file he never put away</p>
                  </div>
                  <span className="font-term ml-auto shrink-0 text-[9px] tracking-[0.2em] text-white/30 group-hover:text-amber-200/80">READ →</span>
                </div>
              </motion.button>
            ) : (
              <motion.div
                className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] px-5 py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Lock size={13} className="text-white/20" />
                <p className="font-term text-[10px] tracking-[0.25em] text-white/25">
                  {solved ? "SOMETHING IS SURFACING…" : "ONE FILE REMAINS HIDDEN UNTIL THE ORDER IS TRUE"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* the full-screen read */}
      <AnimatePresence>
        {openFinal && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/92 p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl"
              initial={{ scale: 0.9, y: 26, rotate: -1 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 130, damping: 18 }}
            >
              <div className="aspect-[16/9] w-full">
                <Parchment doc={FINAL} gilded big />
              </div>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  audio.click(560);
                  onSolved();
                }}
                className="mx-auto mt-7 flex items-center gap-3 rounded-xl border border-amber-200/40 bg-amber-200/[0.07] px-7 py-3 font-term text-[11px] tracking-[0.3em] text-amber-100 transition-all hover:bg-amber-200/[0.14]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.4, duration: 1.2 }}
              >
                CLOSE THE FILE
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
