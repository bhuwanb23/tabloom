import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { audio } from "../game/audio";
import karthBg from "../assets/images/karth-battlefield.jpg";
import archiveBg from "../assets/images/veyr-archive.jpg";
import edenBg from "../assets/images/eden-garden.jpg";
import rootBg from "../assets/images/root-below.jpg";
import naraBg from "../assets/images/nara-apartment.jpg";
import AriSprite from "./sprites/AriSprite";
import DeadAri from "./sprites/DeadAri";
import Motes from "./fx/Motes";

/* ------------------------------------------------------------------ */
/*  MemoryPlayback — what the drawer was holding. NOT Act III's        */
/*  vision: no static, no chromatic tearing, no disorientation. This   */
/*  memory is coherent — warm double-exposure, soft bloom, everything  */
/*  legible. It is the Witness Mind showing its work.                  */
/* ------------------------------------------------------------------ */

interface Frag {
  bg: string;
  who: "oathblade" | "patient" | "archivist" | "dead";
  line: string;
  sub: string;
  blur: number;
  ms: number;
}

const FRAGS: Frag[] = [
  {
    bg: karthBg,
    who: "oathblade",
    line: "One of them could fight.",
    sub: "CANDIDATE 03 · KARTH-MUUN",
    blur: 7,
    ms: 4200,
  },
  {
    bg: archiveBg,
    who: "patient",
    line: "One of them could grieve beautifully.",
    sub: "CANDIDATE 07 · ORA-VELL",
    blur: 6,
    ms: 4200,
  },
  {
    bg: edenBg,
    who: "patient",
    line: "One of them was content.",
    sub: "CANDIDATE 11 · GLASS EDEN",
    blur: 8,
    ms: 4200,
  },
  {
    bg: rootBg,
    who: "dead",
    line: "One of them was already finished.",
    sub: "CANDIDATE 14 · THE ROOT BELOW",
    blur: 4,
    ms: 4400,
  },
];

const CLOSE: { line: string; ms: number }[] = [
  { line: "Fourteen were measured. Fourteen could be completed — used up, satisfied, stopped.", ms: 5200 },
  { line: "It did not need the strongest. It needed the one that never finishes.", ms: 5200 },
  { line: "Change your branch, your war, your wound, your name —", ms: 4400 },
  { line: "and you keep looking.", ms: 4600 },
  { line: "That is your invariant. That is why you were chosen.", ms: 5400 },
  { line: "And it is the exact handle by which you can be steered.", ms: 5800 },
];

export default function MemoryPlayback({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0); // 0..3 frags, 4 = settle, 5+ = closing lines
  const total = FRAGS.length + 1 + CLOSE.length;

  useEffect(() => {
    if (step >= total) {
      onDone();
      return;
    }
    const ms =
      step < FRAGS.length ? FRAGS[step].ms : step === FRAGS.length ? 5000 : CLOSE[step - FRAGS.length - 1].ms;
    if (step === 0) audio.shimmer();
    if (step === FRAGS.length) audio.bloom();
    if (step === total - 1) audio.heart();
    const t = window.setTimeout(() => setStep((s) => s + 1), ms);
    return () => window.clearTimeout(t);
  }, [step, total, onDone]);

  const frag = step < FRAGS.length ? FRAGS[step] : null;
  const settled = step >= FRAGS.length;
  const closeIdx = step - FRAGS.length - 1;

  return (
    <motion.div
      className="absolute inset-0 z-50 overflow-hidden bg-[#0b0803]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 2.4 } }}
      transition={{ duration: 2 }}
    >
      {/* base warm plate — the memory's own light */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 45%, #2a1d0f, #0b0803 72%)" }}
      />

      {/* candidate fragments — double-exposed, warm, blurred */}
      <AnimatePresence mode="sync">
        {frag && (
          <motion.div
            key={`frag-${step}`}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.14 }}
            animate={{ opacity: 1, scale: 1.06 }}
            exit={{ opacity: 0, scale: 1.02, transition: { duration: 2.2, ease: "easeInOut" } }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          >
            <img
              src={frag.bg}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                filter: `blur(${frag.blur}px) sepia(0.62) saturate(0.75) brightness(0.68) contrast(1.05)`,
                mixBlendMode: "screen",
                opacity: 0.62,
              }}
              draggable={false}
            />
            {/* the candidate — indistinct, never resolved */}
            <div
              className="absolute"
              style={{ left: "44%", top: "34%", width: "12%", height: "46%", filter: "blur(3.5px)", opacity: 0.66 }}
            >
              {frag.who === "dead" ? (
                <DeadAri className="h-full w-full" />
              ) : (
                <AriSprite aspect={frag.who} pose="standing" rim="#ffd9a3" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* the settle — his own branch, clear for the first time */}
      <AnimatePresence>
        {settled && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1.03 }}
            transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={naraBg}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                filter: "sepia(0.34) saturate(0.9) brightness(0.72)",
                mixBlendMode: "screen",
                opacity: 0.72,
              }}
              draggable={false}
            />
            <div className="absolute" style={{ left: "45%", top: "33%", width: "11%", height: "48%" }}>
              <AriSprite aspect="archivist" pose="standing" rim="#ffe0b0" />
            </div>
            {/* the invariant, marked */}
            <motion.div
              className="absolute"
              style={{ left: "50.5%", top: "56%" }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 160, damping: 14 }}
            >
              <span
                className="block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#ffd9a3]"
                style={{ boxShadow: "0 0 24px rgba(255,217,163,0.9), 0 0 70px rgba(255,196,110,0.5)" }}
              />
              <motion.span
                className="absolute left-0 top-0 block h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-200/50"
                animate={{ scale: [0.6, 2.2], opacity: [0.8, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* warm bloom + soft grain (never static) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,206,138,0.14), transparent 62%)", mixBlendMode: "screen" }}
      />
      <Motes tone="root" count={20} className="pointer-events-none absolute inset-0 h-full w-full opacity-45" />
      <div className="grain-layer pointer-events-none absolute inset-0" style={{ opacity: 0.035 }} />
      <div className="vignette-layer pointer-events-none absolute inset-0" />

      {/* narration — warm, centered, unboxed */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center px-8 pb-16 sm:pb-20">
        <AnimatePresence mode="wait">
          {frag && (
            <motion.div
              key={`t-${step}`}
              className="text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.8 } }}
              transition={{ duration: 1.4 }}
            >
              <p className="font-term mb-3 text-[9px] tracking-[0.45em] text-amber-200/45">{frag.sub}</p>
              <p
                className="font-display text-3xl font-light italic text-amber-50/85 sm:text-4xl"
                style={{ textShadow: "0 0 40px rgba(0,0,0,0.9)" }}
              >
                {frag.line}
              </p>
            </motion.div>
          )}
          {settled && closeIdx >= 0 && closeIdx < CLOSE.length && (
            <motion.p
              key={`c-${closeIdx}`}
              className={`max-w-3xl text-center font-display font-light ${
                closeIdx === 3 || closeIdx === 4 ? "text-4xl text-white sm:text-5xl" : "text-2xl italic text-amber-50/85 sm:text-3xl"
              }`}
              style={{ textShadow: "0 0 44px rgba(0,0,0,0.95), 0 0 90px rgba(255,206,138,0.16)" }}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.9 } }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {CLOSE[closeIdx].line}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* header tag */}
      <motion.p
        className="font-term pointer-events-none absolute inset-x-0 top-6 text-center text-[9px] tracking-[0.5em] text-amber-200/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 2 }}
      >
        WITNESS MIND · SELECTION RECORD · RECOVERED
      </motion.p>
    </motion.div>
  );
}
