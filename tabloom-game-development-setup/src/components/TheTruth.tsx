import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { audio } from "../game/audio";
import VeyrSprite from "./sprites/VeyrSprite";
import siegeBg from "../assets/images/heartwood-siege.jpg";
import Motes from "./fx/Motes";

/* ------------------------------------------------------------------ */
/*  TheTruth — no combat UI, no hurry. The camera pushes in on Veyr    */
/*  for four straight minutes of screen-time's worth of patience:      */
/*  the slowest sustained zoom in the game, reserved for this.         */
/* ------------------------------------------------------------------ */

interface Line {
  who: "veyr" | "ari" | "n";
  text: string;
  ms: number;
}

const SCRIPT: Line[] = [
  { who: "n", text: "The fight simply stops being what is happening. He kneels, and the world lowers its voice.", ms: 5200 },
  { who: "veyr", text: "You fight like someone defending a house he's never been allowed inside.", ms: 5600 },
  { who: "ari", text: "Say what you came to say.", ms: 3600 },
  { who: "veyr", text: "You found the archive. So you know about the invariant — the one fact that will not move no matter which world you check.", ms: 6400 },
  { who: "veyr", text: "Mine was my daughter's death. Fifteen worlds, one date. I built this blade out of it because it was the only thing solid enough to hold an edge.", ms: 7600 },
  { who: "ari", text: "I know. I read every page.", ms: 3400 },
  { who: "veyr", text: "Then read the next one, boy. Because you have one too.", ms: 5400 },
  { who: "veyr", text: "Yours is that you never stop. Change your branch, your war, your name — you keep looking. It is the most beautiful thing about you and it is the reason you are here.", ms: 8200 },
  { who: "ari", text: "The Mind chose me for it. I know that as well.", ms: 4200 },
  { who: "veyr", text: "You know it was chosen. You have not asked why that particular quality.", ms: 5800 },
  { who: "n", text: "Ari says nothing. The Heartwood bleeds light behind them both.", ms: 4600 },
  { who: "veyr", text: "A Witness that cannot act needs hands. Fine. But hands that finish a task go home. Hands that finish go free.", ms: 7000 },
  { who: "veyr", text: "It did not need the strongest, or the kindest, or the cleverest. It needed the one who could never be finished — because that one can be spent forever, and never notice he was spending.", ms: 9000 },
  { who: "veyr", text: "You were not chosen because you were the best of them. You were chosen because you were the most reusable.", ms: 7400 },
  { who: "ari", text: "…You're guessing.", ms: 3600 },
  { who: "veyr", text: "I went down to the Root Below. I counted them, same as your gardener did. Only he carved the stones and I read them.", ms: 7000 },
  { who: "veyr", text: "You have seen the fourth. There are more than four.", ms: 5400 },
  { who: "n", text: "The worst part is his voice. There is nothing triumphant in it at all. It is the voice of a man reading out a bill.", ms: 6400 },
  { who: "veyr", text: "I do not kill worlds, Ari. I end their loneliness.", ms: 6600 },
  { who: "veyr", text: "Fifteen rooms, and in each one the same girl dies with nobody who remembers the other fourteen. Collapse them and she dies once — witnessed, whole, and only the one time.", ms: 9200 },
  { who: "veyr", text: "Every reality denied you. Every single one used you and buried you and started again. Why defend them?", ms: 7400 },
  { who: "n", text: "He lifts the Nullroot — not to strike. To hand over.", ms: 5000 },
  { who: "veyr", text: "One cut. You have the hands for it now; I watched you find them. Take the blade, and nobody has to be the fifth.", ms: 8000 },
];

export default function TheTruth({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (i >= SCRIPT.length) {
      onDone();
      return;
    }
    if (i === 0) audio.setDucked(true);
    if (i === 12 || i === 18) audio.heart();
    const t = window.setTimeout(() => setI((n) => n + 1), SCRIPT[i].ms);
    return () => window.clearTimeout(t);
  }, [i, onDone]);

  useEffect(() => () => audio.setDucked(false), []);

  const line = SCRIPT[Math.min(i, SCRIPT.length - 1)];
  /* the whole overlay lasts ~2.5 min; the zoom runs the entire length, once */
  const TOTAL = SCRIPT.reduce((a, l) => a + l.ms, 0);

  return (
    <motion.div
      className="absolute inset-0 z-50 overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 2.6 } }}
      transition={{ duration: 2.4 }}
    >
      {/* the slowest push-in in the game — one continuous move, no loop */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.02, x: "0%", y: "0%" }}
        animate={{ scale: 1.46, x: "-7%", y: "2%" }}
        transition={{ duration: TOTAL / 1000, ease: "linear" }}
      >
        <img
          src={siegeBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "brightness(0.62) saturate(0.85)" }}
          draggable={false}
        />
        {/* he is the point of the frame */}
        <div className="absolute" style={{ left: "56%", top: "30%", width: "26%", height: "60%" }}>
          <VeyrSprite state="kneel" nullrootGlow className="h-full w-full" />
        </div>
      </motion.div>

      {/* the tree's wound-light, breathing behind everything */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 35% 40%, rgba(127,245,201,0.1), transparent 60%)", animation: "pulseglow 9s ease-in-out infinite" }}
      />
      <Motes tone="ember" count={16} className="pointer-events-none absolute inset-0 h-full w-full opacity-45" />
      <div className="grain-layer pointer-events-none absolute inset-0" style={{ opacity: 0.04 }} />
      <div className="vignette-layer pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* no combat UI. only the words. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex min-h-[34%] flex-col items-center justify-end px-8 pb-14 sm:pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            className="max-w-3xl text-center"
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.7 } }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {line.who !== "n" && (
              <p
                className="font-term mb-3 text-[9px] tracking-[0.45em]"
                style={{ color: line.who === "veyr" ? "rgba(255,140,110,0.75)" : "rgba(191,255,226,0.6)" }}
              >
                {line.who === "veyr" ? "VEYR SOL AURIC" : "ARI VAAN"}
              </p>
            )}
            <p
              className={`font-display font-light leading-relaxed ${
                line.who === "n"
                  ? "text-xl italic text-white/50 sm:text-2xl"
                  : line.who === "veyr"
                    ? "text-2xl text-red-50/92 sm:text-[32px]"
                    : "text-2xl text-emerald-50/85 sm:text-3xl"
              }`}
              style={{ textShadow: "0 0 44px rgba(0,0,0,0.96)" }}
            >
              {line.who === "n" ? line.text : `“${line.text}”`}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* progress hairline — the only chrome allowed */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/[0.06]">
        <motion.div
          className="h-full bg-red-400/40"
          animate={{ width: `${(i / SCRIPT.length) * 100}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </motion.div>
  );
}
