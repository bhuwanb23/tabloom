import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Search } from "lucide-react";
import { audio } from "../game/audio";
import poolBg from "../assets/images/mirror-pool.jpg";

/* ------------------------------------------------------------------ */
/*  MirrorPool — find the flaw. The sky above and the sky below are    */
/*  identical, except for one star that came back the wrong colour.    */
/*  Click it and the forgery admits itself.                            */
/* ------------------------------------------------------------------ */

/* star field, in % of the SKY half — mirrored into the pool half */
const STARS = [
  { x: 12, y: 30, r: 1.5 },
  { x: 21, y: 58, r: 1.1 },
  { x: 28, y: 22, r: 2.1 },
  { x: 34, y: 46, r: 1.3 },
  { x: 41, y: 66, r: 1.7 },
  { x: 47, y: 18, r: 1.2 },
  { x: 53, y: 40, r: 2.4 }, // ← the flawed one
  { x: 59, y: 62, r: 1.4 },
  { x: 66, y: 26, r: 1.8 },
  { x: 72, y: 52, r: 1.2 },
  { x: 79, y: 34, r: 1.6 },
  { x: 86, y: 60, r: 1.3 },
  { x: 92, y: 24, r: 1.9 },
];

const FLAW = 6;
const CLEAN = "rgba(240, 246, 255, 0.92)";
const WRONG = "rgba(255, 176, 140, 0.95)"; // warm where everything else is cold

export default function MirrorPool({ onFound }: { onFound: () => void }) {
  const [found, setFound] = useState(false);
  const [, setMisses] = useState(0);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const [hint, setHint] = useState(false);

  const wrongClick = (x: number, y: number) => {
    if (found) return;
    setMisses((m) => {
      if (m + 1 >= 4) setHint(true);
      return m + 1;
    });
    setRipple({ x, y, id: Date.now() });
    audio.ui(300);
  };

  const hit = () => {
    if (found) return;
    setFound(true);
    audio.thud();
    window.setTimeout(() => audio.staticBurst(0.45), 120);
    window.setTimeout(() => onFound(), 4200);
  };

  /* one star, drawn in either half */
  const Star = ({ i, reflected }: { i: number; reflected: boolean }) => {
    const s = STARS[i];
    const isFlaw = i === FLAW;
    const wrongHere = isFlaw && reflected; // the flaw lives only in the reflection
    const color = wrongHere ? WRONG : CLEAN;
    const clickable = wrongHere && !found;
    return (
      <button
        className={`absolute ${clickable ? "cursor-crosshair" : "cursor-default"}`}
        style={{
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: `${Math.max(s.r * 2.4, 3)}%`,
          paddingTop: `${Math.max(s.r * 2.4, 3)}%`,
          transform: "translate(-50%, -50%)",
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (wrongHere) hit();
          else wrongClick(s.x, s.y);
        }}
        aria-label={wrongHere ? "a star that came back wrong" : "star"}
      >
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: `${s.r * 5}px`,
            height: `${s.r * 5}px`,
            background: color,
            boxShadow: `0 0 ${s.r * 7}px ${color}`,
            opacity: reflected ? 0.72 : 0.95,
            animation: `pulseglow ${3 + (i % 4)}s ease-in-out infinite`,
          }}
        />
        {/* the tell, if they've struggled */}
        {wrongHere && hint && !found && (
          <motion.span
            className="absolute left-1/2 top-1/2 block h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40"
            animate={{ scale: [0.7, 1.9], opacity: [0.7, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        {found && wrongHere && (
          <motion.span
            className="absolute left-1/2 top-1/2 block h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#ffb08c]"
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
          />
        )}
      </button>
    );
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4 }}
    >
      {/* the pool, desaturating once the lie is caught */}
      <motion.img
        src={poolBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        animate={{ filter: found ? "saturate(0.12) brightness(0.72)" : "saturate(1) brightness(1)" }}
        transition={{ duration: 3.6, ease: "easeInOut" }}
        draggable={false}
      />

      {/* SKY — the true half */}
      <div className="absolute inset-x-0 top-0 h-1/2">
        {STARS.map((_, i) => (
          <Star key={`sky-${i}`} i={i} reflected={false} />
        ))}
      </div>

      {/* POOL — the copied half, flipped */}
      <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ transform: "scaleY(-1)" }}>
        {STARS.map((_, i) => (
          <Star key={`pool-${i}`} i={i} reflected />
        ))}
      </div>

      {/* the crack — the reflection admits it was made */}
      <AnimatePresence>
        {found && (
          <motion.svg
            viewBox="0 0 1000 500"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <defs>
              <filter id="mp-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {[
              "M530 40 L 470 150 L 520 250 L 430 380 L 470 500",
              "M530 40 L 640 120 L 700 260 L 640 400 L 690 500",
              "M530 40 L 400 90 L 250 180 L 120 210 L 0 190",
              "M530 40 L 700 70 L 860 130 L 1000 120",
              "M470 150 L 330 260 L 250 420",
              "M640 120 L 800 250 L 880 420",
            ].map((d, i) => (
              <motion.path
                key={i}
                d={d}
                stroke="rgba(235,245,255,0.85)"
                strokeWidth={2.4 - i * 0.2}
                fill="none"
                strokeLinecap="round"
                filter="url(#mp-glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.11, duration: 0.5, ease: "easeOut" }}
              />
            ))}
          </motion.svg>
        )}
      </AnimatePresence>

      {/* miss ripple — the water forgives, briefly */}
      <AnimatePresence>
        {ripple && (
          <motion.span
            key={ripple.id}
            className="pointer-events-none absolute rounded-full border border-white/35"
            style={{ left: `${ripple.x}%`, top: `${50 + ripple.y / 2}%`, width: 40, height: 40, marginLeft: -20, marginTop: -20 }}
            initial={{ scale: 0.3, opacity: 0.8 }}
            animate={{ scale: 2.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            onAnimationComplete={() => setRipple(null)}
          />
        )}
      </AnimatePresence>

      {/* the waterline */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/15" />

      {/* chrome — deliberately minimal */}
      <div className="pointer-events-none absolute inset-x-0 top-6 flex flex-col items-center gap-2">
        <motion.p
          className="font-term flex items-center gap-2 text-[10px] tracking-[0.45em] text-white/55"
          initial={{ opacity: 0 }}
          animate={{ opacity: found ? 0 : 1 }}
          transition={{ duration: 1.2 }}
        >
          <Search size={11} />
          THE SKY AND ITS REFLECTION DISAGREE ABOUT ONE THING
        </motion.p>
        {hint && !found && (
          <motion.p
            className="font-term text-[9px] tracking-[0.3em] text-white/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            LOOK BELOW THE WATERLINE · LOOK FOR WARMTH
          </motion.p>
        )}
      </div>

      {/* the admission */}
      <AnimatePresence>
        {found && (
          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.6 }}
          >
            <div className="text-center">
              <Eye size={18} className="mx-auto text-white/40" />
              <p
                className="font-display mt-4 text-3xl font-light italic text-white/90 sm:text-4xl"
                style={{ textShadow: "0 0 40px rgba(0,0,0,0.9)" }}
              >
                One star came back the wrong colour.
              </p>
              <p className="font-term mt-4 text-[10px] tracking-[0.4em] text-white/35">
                EVERY LIE HAS ONE
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
