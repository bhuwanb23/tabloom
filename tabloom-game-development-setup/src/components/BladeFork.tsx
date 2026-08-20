import { useState } from "react";
import { motion } from "framer-motion";
import { audio } from "../game/audio";
import type { Beat } from "../game/types";

/* ------------------------------------------------------------------ */
/*  BladeFork — Act X Beat A. Two physical actions in the chamber,     */
/*  not a dialogue menu: set the Nullroot down, or take it up.         */
/* ------------------------------------------------------------------ */

type ForkOpt = Extract<Beat, { k: "fork" }>["options"][number];

export default function BladeFork({
  options,
  onPick,
}: {
  options: ForkOpt[];
  onPick: (then: Beat[]) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);

  const choose = (opt: ForkOpt) => {
    if (picked) return;
    setPicked(opt.id);
    audio.select(opt.id === "down" ? 480 : 640);
    window.setTimeout(() => onPick(opt.then), 480);
  };

  return (
    <>
      <motion.p
        className="pointer-events-none absolute inset-x-0 top-8 z-30 text-center font-term text-[10px] tracking-[0.4em] text-white/45"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        THE BLADE IS STILL AN OPTION · CHOOSE WITH YOUR HANDS
      </motion.p>
      {options.map((opt, i) => (
        <motion.button
          key={opt.id}
          className="absolute z-30"
          style={{
            left: `${opt.rect[0]}%`,
            top: `${opt.rect[1]}%`,
            width: `${opt.rect[2]}%`,
            height: `${opt.rect[3]}%`,
          }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{
            opacity: picked && picked !== opt.id ? 0.2 : 1,
            scale: 1,
          }}
          transition={{ delay: 0.35 + i * 0.2, duration: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            choose(opt);
          }}
          disabled={picked !== null}
          aria-label={opt.label}
        >
          <motion.span
            className="absolute inset-0 rounded-2xl border-2"
            style={{
              borderColor: opt.id === "down" ? "rgba(127,245,201,0.45)" : "rgba(255,90,68,0.5)",
              background:
                opt.id === "down"
                  ? "radial-gradient(ellipse, rgba(127,245,201,0.14), transparent 72%)"
                  : "radial-gradient(ellipse, rgba(255,90,68,0.14), transparent 72%)",
              boxShadow:
                opt.id === "down"
                  ? "0 0 28px rgba(127,245,201,0.2)"
                  : "0 0 28px rgba(255,90,68,0.22)",
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.6, repeat: Infinity }}
          />
          <span className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-[115%] flex-col items-center gap-1 whitespace-nowrap">
            <span
              className="font-term rounded-md border bg-[#060a0e]/95 px-4 py-2 text-[11px] tracking-[0.3em]"
              style={{
                borderColor: opt.id === "down" ? "rgba(127,245,201,0.45)" : "rgba(255,140,120,0.5)",
                color: opt.id === "down" ? "#d8fff0" : "#ffd0c8",
              }}
            >
              {opt.label}
            </span>
            {opt.sub && <span className="font-term text-[9px] tracking-[0.22em] text-white/40">{opt.sub}</span>}
          </span>
        </motion.button>
      ))}
    </>
  );
}
