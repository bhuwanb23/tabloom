import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { audio } from "../game/audio";

/* ------------------------------------------------------------------ */
/*  Carving — the close-up on the inscription at the figure's base.    */
/*  Lines surface one at a time, chiselled and fully legible.          */
/* ------------------------------------------------------------------ */

export default function Carving({ lines, onDone }: { lines: string[]; onDone: () => void }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= lines.length) return;
    const t = window.setTimeout(() => {
      setShown((s) => s + 1);
      audio.ui(420 + shown * 40);
    }, shown === 0 ? 1200 : 1500);
    return () => window.clearTimeout(t);
  }, [shown, lines.length]);

  const complete = shown >= lines.length;

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-[#07060a]/95 p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.4 } }}
      transition={{ duration: 1.2 }}
    >
      {/* the light that falls on it */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(255,206,138,0.13), transparent 62%)" }}
      />

      <motion.div
        className="relative w-full max-w-2xl"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* the stone */}
        <div
          className="relative overflow-hidden rounded-sm px-8 py-10 sm:px-12 sm:py-14"
          style={{
            background: "linear-gradient(160deg, #2a2620, #17150f 60%, #100e0a)",
            boxShadow: "inset 0 2px 0 rgba(255,255,255,0.05), inset 0 -30px 60px rgba(0,0,0,0.6), 0 30px 70px -20px rgba(0,0,0,0.9)",
          }}
        >
          {/* weathering */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse at 20% 10%, rgba(120,105,80,0.18), transparent 45%), radial-gradient(ellipse at 85% 85%, rgba(80,70,55,0.22), transparent 42%)",
            }}
          />
          <div className="grain-layer absolute inset-0" style={{ opacity: 0.09 }} />

          <p className="font-term relative mb-6 text-center text-[9px] tracking-[0.5em] text-amber-200/40">
            CARVED AT THE BASE
          </p>

          <div className="relative space-y-4 text-center">
            {lines.map((l, i) => (
              <motion.p
                key={i}
                className={`font-display ${i === lines.length - 1 ? "text-2xl text-amber-100/95 sm:text-3xl" : "text-xl text-white/80 sm:text-2xl"}`}
                style={{
                  textShadow: "0 1px 0 rgba(255,225,180,0.14), 0 -1px 2px rgba(0,0,0,0.9)",
                  letterSpacing: "0.06em",
                }}
                initial={{ opacity: 0, y: 8, filter: "blur(5px)" }}
                animate={i < shown ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {l}
              </motion.p>
            ))}
          </div>
        </div>

        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onDone();
          }}
          className="mx-auto mt-8 flex items-center gap-3 rounded-xl border border-amber-200/35 bg-amber-200/[0.06] px-7 py-3 font-term text-[11px] tracking-[0.3em] text-amber-100 transition-all hover:bg-amber-200/[0.13]"
          initial={{ opacity: 0 }}
          animate={{ opacity: complete ? 1 : 0 }}
          transition={{ delay: complete ? 1.6 : 0, duration: 1.2 }}
          style={{ pointerEvents: complete ? "auto" : "none" }}
        >
          STAND BACK UP
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
