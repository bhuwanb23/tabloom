import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Scissors } from "lucide-react";
import { audio } from "../game/audio";
import { KaelSprite } from "./sprites/CastSprites";

/* ------------------------------------------------------------------ */
/*  PruneCharge — the other hand of root-craft, taught on the Frost-   */
/*  Curse Heart. Hold to charge. Release when the ring kisses the      */
/*  band. Mercy, sharpened.                                            */
/* ------------------------------------------------------------------ */

const PULSE_MS = 1400;
const CHARGE_MS = 1050;

const inSweetZone = () => {
  const p = (performance.now() % PULSE_MS) / PULSE_MS;
  return p >= 0.5 && p <= 0.92;
};

const KAEL_LINES = {
  start: "Hold. Feel the pulse through the ice — release when the ring kisses the band.",
  fail1: "Off-beat. It's a heart, not a drum — wait for the swell.",
  fail2: "Charging is only half of it. The pulse is the other half.",
  success: "There. Mercy, sharpened.",
};

export default function PruneCharge({ onSuccess }: { onSuccess: () => void }) {
  const [charge, setCharge] = useState(0);
  const [fails, setFails] = useState(0);
  const [line, setLine] = useState(KAEL_LINES.start);
  const [burst, setBurst] = useState(false);
  const chargeStart = useRef<number | null>(null);
  const raf = useRef(0);
  const resolved = useRef(false);

  const tick = () => {
    if (chargeStart.current == null) return;
    setCharge(Math.min((performance.now() - chargeStart.current) / CHARGE_MS, 1));
    raf.current = requestAnimationFrame(tick);
  };

  const down = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (resolved.current || chargeStart.current != null) return;
    chargeStart.current = performance.now();
    audio.ui(440);
    raf.current = requestAnimationFrame(tick);
  };

  const up = () => {
    if (chargeStart.current == null || resolved.current) return;
    const pct = Math.min((performance.now() - chargeStart.current) / CHARGE_MS, 1);
    cancelAnimationFrame(raf.current);
    chargeStart.current = null;
    setCharge(0);
    if (pct >= 0.5 && inSweetZone()) {
      resolved.current = true;
      setBurst(true);
      setLine(KAEL_LINES.success);
      audio.thud();
      window.setTimeout(() => audio.staticBurst(0.5), 120);
      window.setTimeout(() => onSuccess(), 1500);
    } else {
      setFails((f) => {
        const n2 = f + 1;
        setLine(n2 >= 2 ? KAEL_LINES.fail2 : KAEL_LINES.fail1);
        return n2;
      });
      audio.ui(280);
    }
  };

  useEffect(() => {
    const onUp = () => up();
    window.addEventListener("pointerup", onUp);
    return () => window.removeEventListener("pointerup", onUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass-panel w-full max-w-xl rounded-2xl p-6 sm:p-8"
        initial={{ scale: 0.94, y: 18 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
      >
        <p className="font-term text-[10px] tracking-[0.4em] text-red-300/70">ROOT-CRAFT · THE OTHER HAND</p>
        <h3 className="font-display mt-1 flex items-center gap-3 text-3xl font-medium text-white/95">
          Pruning
          <Scissors size={20} className="text-red-300/80" />
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/50">
          Press and hold on the heart. When the falling ring meets the ember band —{" "}
          <span className="text-red-200/90">release</span>. Cut exactly what asks to be cut. Nothing more.
        </p>

        {/* the pad */}
        <div
          className="relative mx-auto mt-4 aspect-square w-full max-w-[400px] cursor-pointer touch-none select-none"
          onPointerDown={down}
        >
          <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible">
            <defs>
              <radialGradient id="pc-heart" cx="50%" cy="42%" r="60%">
                <stop offset="0%" stopColor="#3d0d12" />
                <stop offset="55%" stopColor="#1a060a" />
                <stop offset="100%" stopColor="#070308" />
              </radialGradient>
              <filter id="pc-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* pulse ring 1.5→0.7 per PULSE_MS */}
            <circle
              cx="200" cy="200" r="120" fill="none" stroke="#ff8a6a" strokeWidth="2"
              style={{ transformOrigin: "200px 200px", animation: `pcPulse ${PULSE_MS}ms linear infinite` }}
            />
            {/* the ember band — kiss this */}
            <circle cx="200" cy="200" r="104" fill="none" stroke="rgba(255,206,138,0.55)" strokeWidth="1.4" strokeDasharray="4 8" />
            {/* charge arc */}
            {charge > 0 && (
              <circle
                cx="200" cy="200" r="136" fill="none" stroke="#ffd9a3" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${charge * 854.5} 854.5`}
                transform="rotate(-90 200 200)"
                style={{ filter: "drop-shadow(0 0 8px rgba(255,217,163,0.8))" }}
              />
            )}

            {/* the Frost-Curse Heart */}
            <g style={{ transformOrigin: "200px 210px", animation: "pcBeat 1.4s ease-in-out infinite" }}>
              <path
                d="M200 300 C 120 248 96 196 108 150 C 118 112 156 96 186 116 C 194 121 200 130 200 130 C 200 130 206 121 214 116 C 244 96 282 112 292 150 C 304 196 280 248 200 300 Z"
                fill="url(#pc-heart)"
                stroke="rgba(255,120,100,0.5)"
                strokeWidth="2"
                filter="url(#pc-glow)"
              />
              {/* red ice veins */}
              <g stroke="#ff5a44" strokeWidth="1.8" fill="none" opacity="0.75" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 5px rgba(255,80,60,0.8))" }}>
                <path d="M200 140 C 190 168 196 190 182 214" />
                <path d="M200 140 C 212 166 206 192 222 218" />
                <path d="M168 152 C 176 168 172 186 180 198" />
                <path d="M234 154 C 226 170 232 188 224 200" />
              </g>
              {/* the hairline Ari made possible */}
              <path d="M200 132 L 186 180 L 204 214 L 192 262" stroke="#ffce8a" strokeWidth="1.6" fill="none" opacity="0.8" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px rgba(255,206,138,0.7))" }} />
            </g>

            {/* success burst */}
            {burst && (
              <g style={{ transformOrigin: "200px 210px" }}>
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={i}
                    cx="200" cy="210" r="90" fill="none"
                    stroke={i === 1 ? "#ffce8a" : "#ff5a44"}
                    strokeWidth={2.6 - i * 0.6}
                    initial={{ scale: 0.4, opacity: 0.95 }}
                    animate={{ scale: 2.4 + i * 0.5, opacity: 0 }}
                    transition={{ delay: i * 0.14, duration: 1.2, ease: "easeOut" }}
                  />
                ))}
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i / 12) * Math.PI * 2;
                  return (
                    <motion.circle
                      key={`m-${i}`}
                      cx="200" cy="210" r={2.4 + (i % 3)}
                      fill={i % 2 ? "#1a060a" : "#ff8a6a"}
                      initial={{ x: 0, y: 0, opacity: 1 }}
                      animate={{ x: Math.cos(a) * (90 + (i % 4) * 26), y: Math.sin(a) * (90 + (i % 4) * 26), opacity: 0 }}
                      transition={{ duration: 1.05, ease: "easeOut" }}
                    />
                  );
                })}
              </g>
            )}
          </svg>
        </div>

        {/* kael coaching */}
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-300/15 bg-black/30 px-4 py-3">
          <div className="h-11 w-8 shrink-0 overflow-hidden">
            <KaelSprite className="h-full w-full" />
          </div>
          <p className="font-display flex-1 text-[15px] italic leading-snug text-red-100/85">“{line}”</p>
          <div className="font-term shrink-0 text-[9px] tracking-[0.2em] text-white/25">
            {fails > 0 ? `ATTEMPT ${fails + 1}` : "FIRST CUT"}
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes pcPulse {
          from { transform: scale(1.5); opacity: 0.95; }
          to { transform: scale(0.62); opacity: 0.3; }
        }
        @keyframes pcBeat {
          0%, 100% { transform: scale(1); }
          38% { transform: scale(1.045); }
          55% { transform: scale(0.99); }
        }
      `}</style>
    </motion.div>
  );
}
