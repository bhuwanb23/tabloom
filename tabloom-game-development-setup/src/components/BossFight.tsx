import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Scissors, Sprout } from "lucide-react";
import { audio } from "../game/audio";
import { KaelSprite } from "./sprites/CastSprites";

/* ------------------------------------------------------------------ */
/*  BossFight — the Frost-Curse Heart, properly this time.             */
/*  Three rounds: PRUNE the heart (charge + release on the pulse),     */
/*  then GRAFT the chamber shut before the ceiling comes down.         */
/*  Both hands of root-craft, alternating, under pressure.             */
/* ------------------------------------------------------------------ */

type Stance = "prune" | "graft";
type Phase = "prune" | "graft" | "between" | "dead";

const PULSE_MS = 1250;
const CHARGE_MS = 900;
const ROUNDS = 3;
const HITS_PER_ROUND = 2;
const STABILIZE_MS = 9000;

const inSweet = () => {
  const p = (performance.now() % PULSE_MS) / PULSE_MS;
  return p >= 0.52 && p <= 0.9;
};

/* fracture points that open in the chamber during graft phases */
const FRACTURES = [
  [{ x: 16, y: 24 }, { x: 78, y: 30 }, { x: 44, y: 74 }],
  [{ x: 24, y: 66 }, { x: 68, y: 18 }, { x: 86, y: 58 }, { x: 12, y: 42 }],
  [{ x: 20, y: 20 }, { x: 50, y: 16 }, { x: 82, y: 26 }, { x: 30, y: 76 }, { x: 72, y: 72 }],
];

const KAEL = {
  open: "It wakes up angry. Cut on the swell — then hold the room together while it screams.",
  toGraft: "Ceiling's going. GRAFT — knit the cracks before they finish opening.",
  toPrune: "Room's holding. Back to the blade.",
  hurt: "Sloppy. It feeds on sloppy.",
  last: "Once more. Make it mean something.",
  done: "…That's it. That's the fist, unclenched.",
};

export default function BossFight({ onWin }: { onWin: () => void }) {
  const [stance, setStance] = useState<Stance>("prune");
  const [phase, setPhase] = useState<Phase>("prune");
  const [round, setRound] = useState(0);
  const [, setHits] = useState(0);
  const [hp, setHp] = useState(ROUNDS * HITS_PER_ROUND);
  const [charge, setCharge] = useState(0);
  const [sealed, setSealed] = useState<number[]>([]);
  const [shake, setShake] = useState(0); // 0..1 chamber instability
  const [line, setLine] = useState(KAEL.open);
  const [flash, setFlash] = useState<"cut" | "seal" | null>(null);
  const [tag, setTag] = useState<string | null>(null);

  const chargeStart = useRef<number | null>(null);
  const raf = useRef(0);
  const stabDeadline = useRef(0);
  const won = useRef(false);

  const showTag = (t: string) => {
    setTag(t);
    window.setTimeout(() => setTag((x) => (x === t ? null : x)), 900);
  };

  /* charge ticker */
  const tick = useCallback(() => {
    if (chargeStart.current == null) return;
    setCharge(Math.min((performance.now() - chargeStart.current) / CHARGE_MS, 1));
    raf.current = requestAnimationFrame(tick);
  }, []);

  /* graft phase pressure — instability climbs until sealed */
  useEffect(() => {
    if (phase !== "graft") return;
    stabDeadline.current = performance.now() + STABILIZE_MS;
    const iv = window.setInterval(() => {
      const left = (stabDeadline.current - performance.now()) / STABILIZE_MS;
      setShake(Math.max(0, Math.min(1, 1 - left)));
      if (left <= 0) {
        /* the room wins this exchange — reset the seals, keep going */
        audio.thud();
        setSealed([]);
        setLine(KAEL.hurt);
        stabDeadline.current = performance.now() + STABILIZE_MS;
      }
    }, 90);
    return () => window.clearInterval(iv);
  }, [phase]);

  /* all fractures sealed → back to the blade */
  useEffect(() => {
    if (phase !== "graft") return;
    if (sealed.length < FRACTURES[round].length) return;
    audio.chime();
    setFlash("seal");
    window.setTimeout(() => setFlash(null), 500);
    setShake(0);
    setSealed([]);
    if (round + 1 >= ROUNDS) {
      /* the heart is out of rounds */
      setPhase("dead");
      won.current = true;
      audio.bloom();
      window.setTimeout(() => audio.staticBurst(0.9), 300);
      setLine(KAEL.done);
      window.setTimeout(onWin, 4200);
    } else {
      setRound((r) => r + 1);
      setHits(0);
      setPhase("prune");
      setLine(round + 2 >= ROUNDS ? KAEL.last : KAEL.toPrune);
      setStance("prune");
    }
  }, [sealed, phase, round, onWin]);

  /* keyboard stance */
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "1") {
        setStance("prune");
        audio.select(520);
      }
      if (e.key === "2") {
        setStance("graft");
        audio.select(700);
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  /* release anywhere */
  useEffect(() => {
    const up = () => {
      if (chargeStart.current == null) return;
      const pct = Math.min((performance.now() - chargeStart.current) / CHARGE_MS, 1);
      cancelAnimationFrame(raf.current);
      chargeStart.current = null;
      setCharge(0);
      if (phase !== "prune") return;
      if (stance !== "prune") {
        showTag("WRONG HAND");
        audio.reject(320);
        return;
      }
      if (pct < 0.5) {
        showTag("TOO QUICK");
        audio.ui(300);
        return;
      }
      if (!inSweet()) {
        showTag("OFF THE SWELL");
        audio.ui(340);
        return;
      }
      /* clean cut */
      audio.thud();
      window.setTimeout(() => audio.staticBurst(0.3), 60);
      setFlash("cut");
      window.setTimeout(() => setFlash(null), 260);
      setHp((h) => Math.max(0, h - 1));
      showTag("CLEAN");
      setHits((n) => {
        const next = n + 1;
        if (next >= HITS_PER_ROUND) {
          setPhase("graft");
          setStance("graft");
          setLine(KAEL.toGraft);
          audio.staticBurst(0.6);
        }
        return next;
      });
    };
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, [phase, stance]);

  const heartDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (phase !== "prune" || chargeStart.current != null) return;
    if (stance !== "prune") {
      showTag("SWITCH TO PRUNE");
      audio.ui(320);
      return;
    }
    chargeStart.current = performance.now();
    audio.ui(460);
    raf.current = requestAnimationFrame(tick);
  };

  const sealFracture = (i: number, e: React.PointerEvent) => {
    e.stopPropagation();
    if (phase !== "graft" || sealed.includes(i)) return;
    if (stance !== "graft") {
      showTag("SWITCH TO GRAFT");
      audio.ui(320);
      return;
    }
    setSealed((s) => [...s, i]);
    audio.ui(880);
  };

  const stanceBtn = (s: Stance, label: string, Icon: typeof Scissors, tone: string, wanted: boolean) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setStance(s);
        audio.ui(s === "prune" ? 520 : 700);
      }}
      className="relative flex items-center gap-2 rounded-lg border px-3.5 py-2 font-term text-[10px] tracking-[0.22em] transition-all"
      style={{
        borderColor: stance === s ? tone : "rgba(255,255,255,0.1)",
        background: stance === s ? `${tone}18` : "rgba(8,10,15,0.72)",
        color: stance === s ? tone : "rgba(255,255,255,0.45)",
        boxShadow: stance === s ? `0 0 22px ${tone}30` : undefined,
      }}
    >
      <Icon size={13} />
      {label}
      {wanted && stance !== s && (
        <motion.span
          className="absolute -inset-px rounded-lg border-2"
          style={{ borderColor: tone }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
      )}
    </button>
  );

  const sh = shake * (phase === "graft" ? 1 : 0);

  return (
    <motion.div className="absolute inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* chamber instability */}
      <motion.div
        className="absolute inset-0"
        animate={sh > 0 ? { x: [0, -9 * sh, 9 * sh, -6 * sh, 0], y: [0, 5 * sh, -5 * sh, 3 * sh, 0] } : { x: 0, y: 0 }}
        transition={{ duration: 0.34, repeat: sh > 0 ? Infinity : 0 }}
      >
        {/* red pressure from the heart */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 34%, rgba(255,60,40,0.16), transparent 62%)",
            animation: "breathe 1.25s ease-in-out infinite",
          }}
        />
      </motion.div>

      {/* danger vignette while the room is coming apart */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 160px rgba(255,50,30,0.5)" }}
        animate={{ opacity: sh }}
      />

      {/* the heart */}
      <div className="absolute left-1/2 top-[34%] h-[38vmin] w-[38vmin] -translate-x-1/2 -translate-y-1/2">
        <button
          className={`relative h-full w-full ${phase === "prune" ? "cursor-crosshair" : "cursor-default"}`}
          onPointerDown={heartDown}
          aria-label="the frost-curse heart"
        >
          <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible">
            <defs>
              <radialGradient id="bf-h" cx="50%" cy="42%" r="60%">
                <stop offset="0%" stopColor={phase === "dead" ? "#141216" : "#4a0f16"} />
                <stop offset="60%" stopColor={phase === "dead" ? "#0a0a0c" : "#1c0609"} />
                <stop offset="100%" stopColor="#050407" />
              </radialGradient>
              <filter id="bf-g" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* pulse ring — only while it can be cut */}
            {phase === "prune" && (
              <>
                <circle
                  cx="200" cy="200" r="150" fill="none" stroke="#ff8a6a" strokeWidth="2.4"
                  style={{ transformOrigin: "200px 200px", animation: `bfPulse ${PULSE_MS}ms linear infinite` }}
                />
                <circle cx="200" cy="200" r="128" fill="none" stroke="rgba(255,206,138,0.5)" strokeWidth="1.4" strokeDasharray="4 8" />
              </>
            )}
            {charge > 0 && (
              <circle
                cx="200" cy="200" r="172" fill="none" stroke="#ffd9a3" strokeWidth="4.5" strokeLinecap="round"
                strokeDasharray={`${charge * 1080.7} 1080.7`}
                transform="rotate(-90 200 200)"
                style={{ filter: "drop-shadow(0 0 8px rgba(255,217,163,0.9))" }}
              />
            )}

            <g style={{ transformOrigin: "200px 210px", animation: phase === "dead" ? "none" : "bfBeat 1.25s ease-in-out infinite" }}>
              <path
                d="M200 316 C 108 254 80 194 94 142 C 106 100 148 82 182 104 C 191 110 200 122 200 122 C 200 122 209 110 218 104 C 252 82 294 100 306 142 C 320 194 292 254 200 316 Z"
                fill="url(#bf-h)"
                stroke={phase === "dead" ? "rgba(120,120,130,0.4)" : "rgba(255,120,100,0.55)"}
                strokeWidth="2.4"
                filter={phase === "dead" ? undefined : "url(#bf-g)"}
              />
              {phase !== "dead" && (
                <g stroke="#ff5a44" strokeWidth="2" fill="none" opacity={0.35 + (1 - hp / (ROUNDS * HITS_PER_ROUND)) * 0.6} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px rgba(255,80,60,0.85))" }}>
                  <path d="M200 132 C 188 166 196 192 178 222" />
                  <path d="M200 132 C 214 164 206 194 226 226" />
                  <path d="M162 150 C 172 170 166 192 176 206" />
                  <path d="M240 152 C 230 172 238 194 228 208" />
                </g>
              )}
              {/* accumulating wounds */}
              {Array.from({ length: ROUNDS * HITS_PER_ROUND - hp }).map((_, i) => (
                <path
                  key={i}
                  d={
                    [
                      "M120 150 L 268 246",
                      "M262 140 L 128 252",
                      "M110 214 L 292 200",
                      "M186 108 L 214 306",
                      "M132 122 L 276 274",
                      "M270 122 L 126 276",
                    ][i]
                  }
                  stroke={phase === "dead" ? "rgba(150,150,160,0.5)" : "#ffce8a"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.85"
                  style={{ filter: phase === "dead" ? undefined : "drop-shadow(0 0 8px rgba(255,206,138,0.8))" }}
                />
              ))}
            </g>

            {/* shatter */}
            {phase === "dead" && (
              <g>
                {Array.from({ length: 16 }).map((_, i) => {
                  const a = (i / 16) * Math.PI * 2;
                  return (
                    <motion.path
                      key={i}
                      d="M-8 -14 L 8 -6 L 4 12 L -10 6 Z"
                      fill="#1a171c"
                      stroke="rgba(160,160,175,0.35)"
                      strokeWidth="0.8"
                      initial={{ x: 200, y: 210, opacity: 1, rotate: 0 }}
                      animate={{
                        x: 200 + Math.cos(a) * (150 + (i % 5) * 40),
                        y: 210 + Math.sin(a) * (150 + (i % 4) * 46) + 60,
                        opacity: 0,
                        rotate: (i % 2 ? 1 : -1) * 220,
                      }}
                      transition={{ duration: 2.4, ease: "easeOut" }}
                    />
                  );
                })}
              </g>
            )}
          </svg>
        </button>
      </div>

      {/* fracture points — graft phase */}
      <AnimatePresence>
        {phase === "graft" &&
          FRACTURES[round].map((f, i) => {
            const done = sealed.includes(i);
            return (
              <motion.button
                key={`${round}-${i}`}
                className="absolute z-10"
                style={{ left: `${f.x}%`, top: `${f.y}%`, width: 74, height: 74, marginLeft: -37, marginTop: -37 }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ delay: i * 0.12 }}
                onPointerDown={(e) => sealFracture(i, e)}
                aria-label="fracture"
              >
                <svg viewBox="0 0 74 74" className="h-full w-full overflow-visible">
                  <path
                    d="M10 6 L 34 26 L 24 40 L 48 54 L 40 70"
                    stroke={done ? "#7ff5c9" : "#9fd7ff"}
                    strokeWidth={done ? 2.6 : 2}
                    fill="none"
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 8px ${done ? "rgba(127,245,201,0.9)" : "rgba(159,215,255,0.85)"})` }}
                  />
                  {!done && (
                    <motion.circle
                      cx="30" cy="38" r="24" fill="none" stroke="rgba(127,245,201,0.55)" strokeWidth="1.4"
                      animate={{ scale: [1.5, 0.75], opacity: [0.9, 0.15] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      style={{ transformOrigin: "30px 38px" }}
                    />
                  )}
                  {done && <circle cx="30" cy="38" r="6" fill="#7ff5c9" style={{ filter: "drop-shadow(0 0 10px #7ff5c9)" }} />}
                </svg>
              </motion.button>
            );
          })}
      </AnimatePresence>

      {/* hit flashes */}
      <AnimatePresence>
        {flash && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: flash === "cut" ? "rgba(255,120,90,0.3)" : "rgba(127,245,201,0.22)" }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: flash === "cut" ? 0.26 : 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* feedback tag */}
      <AnimatePresence>
        {tag && (
          <motion.p
            className="font-term pointer-events-none absolute left-1/2 top-[16%] -translate-x-1/2 text-[11px] tracking-[0.4em] text-white/85"
            style={{ textShadow: "0 0 16px rgba(0,0,0,0.9)" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {tag}
          </motion.p>
        )}
      </AnimatePresence>

      {/* chrome */}
      <div className="absolute inset-x-0 top-4 flex flex-col items-center gap-2 no-select">
        <p className="font-term text-[9px] tracking-[0.5em] text-white/40">
          THE FROST-CURSE HEART · ROUND {Math.min(round + 1, ROUNDS)}/{ROUNDS}
        </p>
        <div className="flex h-2 w-56 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full"
            style={{ background: "linear-gradient(90deg, #ff5a44, #ffce8a)" }}
            animate={{ width: `${(hp / (ROUNDS * HITS_PER_ROUND)) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        {phase === "graft" && (
          <div className="mt-1 flex h-1 w-40 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full bg-emerald-300" animate={{ width: `${(1 - shake) * 100}%` }} transition={{ duration: 0.1 }} />
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 flex flex-col gap-2.5 no-select">
        <div className="flex gap-2">
          {stanceBtn("prune", "PRUNE", Scissors, "#ff8a6a", phase === "prune")}
          {stanceBtn("graft", "GRAFT", Sprout, "#7ff5c9", phase === "graft")}
        </div>
        <div className="flex max-w-sm items-center gap-2.5 rounded-lg border border-white/10 bg-black/45 px-3 py-2">
          <div className="h-10 w-7 shrink-0">
            <KaelSprite className="h-full w-full" />
          </div>
          <p className="font-display text-[13px] italic leading-snug text-amber-100/85">“{line}”</p>
        </div>
      </div>

      <style>{`
        @keyframes bfPulse { from { transform: scale(1.5); opacity: 0.95; } to { transform: scale(0.66); opacity: 0.3; } }
        @keyframes bfBeat { 0%,100% { transform: scale(1); } 36% { transform: scale(1.05); } 54% { transform: scale(0.985); } }
      `}</style>
    </motion.div>
  );
}
