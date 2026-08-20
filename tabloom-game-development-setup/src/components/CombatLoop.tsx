import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Scissors, Sprout } from "lucide-react";
import { audio } from "../game/audio";

/* ------------------------------------------------------------------ */
/*  CombatLoop — stance-and-timing click battler for static sprites.   */
/*  Click a husk to target → hold to charge a Prune strike → release  */
/*  on the pulse for a clean hit (stagger). Finishing click ends it.   */
/*  Graft stance knits your own heart back. The loop watches.          */
/* ------------------------------------------------------------------ */

type Stance = "prune" | "graft";
type HuskState = "alive" | "staggered" | "defeated" | "ghost";

interface Husk {
  id: number;
  x: number; // % of stage
  y: number;
  s: number; // depth scale
  hp: number;
  state: HuskState;
  atkIn: number; // seconds until it strikes
}

const START: Husk[] = [
  { id: 0, x: 60, y: 40, s: 0.95, hp: 2, state: "alive", atkIn: 7 },
  { id: 1, x: 74, y: 32, s: 1.2, hp: 2, state: "alive", atkIn: 8.6 },
  { id: 2, x: 87, y: 44, s: 0.8, hp: 2, state: "alive", atkIn: 9.8 },
];

const PULSE_MS = 1600;
const CHARGE_MS = 1050;
const MAX_HP = 5;

const phaseNow = () => (performance.now() % PULSE_MS) / PULSE_MS;
const inSweetZone = () => {
  const p = phaseNow();
  return p >= 0.55 && p <= 0.92;
};

function FrostHusk({ state, slashKey }: { state: HuskState; slashKey: number }) {
  const ice = "#9fd7ff";
  const amber = "#ffce8a";
  const cracked = state === "staggered" || state === "defeated";
  return (
    <svg
      viewBox="0 0 100 210"
      className="h-full w-full overflow-visible"
      style={{
        filter: state === "ghost" ? "blur(1.6px) grayscale(1)" : "blur(1.2px)",
        opacity: state === "ghost" ? 0.4 : 1,
        transform: state === "staggered" ? "rotate(9deg) translateY(6px)" : state === "defeated" ? "rotate(72deg) translateY(30px)" : undefined,
        transformOrigin: "50% 100%",
        transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.7s ease",
      }}
    >
      {/* spired, hunched form */}
      <path
        d="M50 6 L60 34 L54 34 C 70 40 78 54 74 76 L 70 98 L 79 114 L 66 110 L 62 142 L 58 176 L 42 176 L 38 142 L 34 110 L 21 114 L 30 98 L 26 76 C 22 54 30 40 46 34 L 40 34 Z"
        fill="rgba(5,9,15,0.96)"
      />
      {/* claws */}
      <path d="M21 114 L 14 128 M24 116 L 20 132 M79 114 L 86 128 M76 116 L 80 132" stroke="rgba(5,9,15,0.95)" strokeWidth="4" strokeLinecap="round" />
      {/* frost cracks */}
      <g stroke={ice} strokeWidth="1.2" opacity="0.5" fill="none" strokeLinecap="round">
        <path d="M44 60 L 52 78 L 46 92" />
        <path d="M58 96 L 50 112 L 56 126" />
      </g>
      {/* amber cracks when staggered */}
      {cracked && (
        <g stroke={amber} strokeWidth="1.6" opacity="0.9" fill="none" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 5px rgba(255,206,138,0.7))" }}>
          <path d="M40 48 L 54 70 L 48 88" />
          <path d="M60 84 L 48 106" />
        </g>
      )}
      {/* eyes */}
      {state !== "ghost" && (
        <>
          <circle cx="46" cy="46" r="2" fill={cracked ? amber : ice} style={{ animation: "pulseglow 2.2s ease-in-out infinite" }} />
          <circle cx="56" cy="46" r="2" fill={cracked ? amber : ice} style={{ animation: "pulseglow 2.7s ease-in-out infinite" }} />
        </>
      )}
      {/* prune slash */}
      {slashKey > 0 && (
        <motion.path
          key={slashKey}
          d="M14 30 L 88 156"
          stroke="#ff8a6a"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          style={{ filter: "drop-shadow(0 0 10px rgba(255,120,90,0.9))" }}
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: 1, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      )}
    </svg>
  );
}

export default function CombatLoop({ onCleared }: { onCleared: () => void }) {
  const [stance, setStance] = useState<Stance>("prune");
  const [health, setHealth] = useState(MAX_HP);
  const [husks, setHusks] = useState<Husk[]>(START);
  const [selected, setSelected] = useState<number | null>(null);
  const [chargePct, setChargePct] = useState(0);
  const [hint, setHint] = useState("Click a husk to target — hold to charge a Prune strike.");
  const [feedback, setFeedback] = useState<{ id: number; text: string; tone: string } | null>(null);
  const [resetPhase, setResetPhase] = useState<"none" | "death" | "loop">("none");
  const [slash, setSlash] = useState<Record<number, number>>({});
  const [shakeAll, setShakeAll] = useState(false);
  const [hurtFlash, setHurtFlash] = useState(false);

  const chargeStart = useRef<number | null>(null);
  const raf = useRef(0);
  const cleared = useRef(false);

  /* charge ticker */
  const stopCharge = useCallback(() => {
    cancelAnimationFrame(raf.current);
    chargeStart.current = null;
    setChargePct(0);
  }, []);

  const tick = useCallback(() => {
    if (chargeStart.current == null) return;
    const pct = Math.min((performance.now() - chargeStart.current) / CHARGE_MS, 1);
    setChargePct(pct);
    raf.current = requestAnimationFrame(tick);
  }, []);

  /* enemy attack timers */
  useEffect(() => {
    if (resetPhase !== "none") return;
    const iv = window.setInterval(() => {
      setHusks((hs) => {
        let fired = false;
        const next = hs.map((h) => {
          if (h.state !== "alive") return h;
          const nextAtk = h.atkIn - 0.25;
          if (nextAtk <= 0 && !fired) {
            fired = true;
            return { ...h, atkIn: 6.5 + h.id * 1.6 };
          }
          return { ...h, atkIn: nextAtk };
        });
        if (fired) {
          setHealth((hp) => Math.max(0, hp - 1));
          setHurtFlash(true);
          setShakeAll(true);
          audio.thud();
          setHint("A husk breaks through — graft your heart shut, or end them faster.");
          window.setTimeout(() => {
            setHurtFlash(false);
            setShakeAll(false);
          }, 480);
        }
        return next;
      });
    }, 250);
    return () => window.clearInterval(iv);
  }, [resetPhase]);

  /* death → the loop catches you */
  useEffect(() => {
    if (health > 0 || resetPhase !== "none" || cleared.current) return;
    setResetPhase("death");
    setHint("The loop catches you. It rewinds — your bruises stay.");
    audio.staticBurst(0.7);
    window.setTimeout(() => {
      setHusks(START.map((h) => ({ ...h })));
      setHealth(MAX_HP);
      setSelected(null);
      setResetPhase("none");
    }, 2400);
  }, [health, resetPhase]);

  /* wave cleared → the reset beat, then out */
  useEffect(() => {
    if (cleared.current || resetPhase !== "none") return;
    if (husks.every((h) => h.state === "defeated")) {
      cleared.current = true;
      window.setTimeout(() => {
        setResetPhase("loop");
        audio.staticBurst(0.8);
      }, 700);
      window.setTimeout(() => {
        setHusks(START.map((h) => ({ ...h, state: "ghost" as HuskState })));
        setSelected(null);
      }, 1300);
      window.setTimeout(() => onCleared(), 3600);
    }
  }, [husks, resetPhase, onCleared]);

  /* keyboard stances */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "1") setStance("prune");
      if (e.key === "2") setStance("graft");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* release anywhere */
  useEffect(() => {
    const up = () => {
      if (chargeStart.current == null) return;
      releaseStrike();
    };
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, stance, husks]);

  const showFeedback = (id: number, text: string, tone: string) => {
    setFeedback({ id, text, tone });
    window.setTimeout(() => setFeedback((f) => (f?.text === text ? null : f)), 900);
  };

  const releaseStrike = () => {
    const pct = Math.min((performance.now() - (chargeStart.current ?? 0)) / CHARGE_MS, 1);
    const id = selected;
    stopCharge();
    if (id == null) return;
    const husk = husks.find((h) => h.id === id);
    if (!husk || husk.state !== "alive") return;
    if (pct < 0.5) {
      showFeedback(id, "TOO QUICK — HOLD THE CHARGE", "#aebfd0");
      audio.ui(300);
      return;
    }
    if (!inSweetZone()) {
      showFeedback(id, "GRAZE — OFF-PULSE", "#9fd7ff");
      audio.ui(340);
      return;
    }
    /* clean hit */
    const nextHp = husk.hp - 1;
    setSlash((s) => ({ ...s, [id]: (s[id] ?? 0) + 1 }));
    setShakeAll(true);
    window.setTimeout(() => setShakeAll(false), 300);
    audio.thud();
    window.setTimeout(() => audio.staticBurst(0.2), 60);
    if (nextHp <= 0) {
      setHusks((hs) => hs.map((h) => (h.id === id ? { ...h, hp: 0, state: "staggered" } : h)));
      showFeedback(id, "STAGGERED — FINISH IT", "#ffce8a");
      setHint("Clean. One more click, while it reels.");
    } else {
      setHusks((hs) => hs.map((h) => (h.id === id ? { ...h, hp: nextHp } : h)));
    }
  };

  const onHuskDown = (h: Husk, e: React.PointerEvent) => {
    e.stopPropagation();
    if (resetPhase !== "none" || h.state === "defeated" || h.state === "ghost") return;
    if (stance === "graft") {
      showFeedback(h.id, "NO THREAD LEFT TO KNIT — PRUNE IT", "#7ff5c9");
      audio.ui(420);
      return;
    }
    if (selected === h.id && h.state === "staggered") {
      /* finishing click */
      setSlash((s) => ({ ...s, [h.id]: (s[h.id] ?? 0) + 1 }));
      setHusks((hs) => hs.map((x) => (x.id === h.id ? { ...x, state: "defeated" } : x)));
      setSelected((s) => (s === h.id ? null : s));
      audio.staticBurst(0.35);
      window.setTimeout(() => audio.thud(), 90);
      showFeedback(h.id, "PRUNED", "#ff8a6a");
      setHint(husks.filter((x) => x.state !== "defeated" && x.id !== h.id).length + " left. The loop is watching.");
      return;
    }
    setSelected(h.id);
    chargeStart.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  };

  const healSelf = () => {
    if (stance !== "graft" || resetPhase !== "none") return;
    if (health >= MAX_HP) {
      setHint("Your heart is already whole.");
      return;
    }
    setHealth((h) => Math.min(MAX_HP, h + 1));
    audio.chime();
    setHint("You knit the worst of it shut. It holds — mostly.");
  };

  const stanceBtn = (s: Stance, label: string, Icon: typeof Scissors, tone: string) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setStance(s);
        audio.ui(s === "prune" ? 520 : 700);
      }}
      className="flex items-center gap-2 rounded-lg border px-3.5 py-2 font-term text-[10px] tracking-[0.22em] transition-all"
      style={{
        borderColor: stance === s ? tone : "rgba(255,255,255,0.1)",
        background: stance === s ? `${tone}18` : "rgba(8,10,15,0.7)",
        color: stance === s ? tone : "rgba(255,255,255,0.45)",
        boxShadow: stance === s ? `0 0 22px ${tone}30` : undefined,
      }}
    >
      <Icon size={13} />
      {label}
    </button>
  );

  return (
    <motion.div
      className="absolute inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* hurt vignette */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30"
        style={{ boxShadow: "inset 0 0 120px rgba(255,60,40,0.45)" }}
        animate={{ opacity: hurtFlash ? 1 : 0 }}
      />

      {/* reset flash */}
      <AnimatePresence>
        {resetPhase !== "none" && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
            style={{ background: "rgba(210,235,255,0.85)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.85, 0.2] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, times: [0, 0.15, 0.5, 1] }}
          >
            <p className="font-term text-[11px] tracking-[0.6em] text-[#0a1626]">
              {resetPhase === "death" ? "THE LOOP CATCHES YOU" : "IT RESETS — NOT YOU"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* the pack */}
      <motion.div className="absolute inset-0 z-10" animate={shakeAll ? { x: [0, -7, 7, -4, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
        {husks.map((h, i) => {
          const isSel = selected === h.id && h.state !== "ghost" && h.state !== "defeated";
          return (
            <motion.div
              key={h.id}
              className="absolute"
              style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${11 * h.s}vmin`, height: `${23 * h.s}vmin` }}
              initial={{ opacity: 0, x: 90 }}
              animate={{ opacity: h.state === "defeated" ? 0 : 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.35, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {resetPhase === "none" && (
                <div className="h-full w-full" style={{ animation: h.state === "alive" ? `sway ${6 + i}s ease-in-out infinite` : undefined }}>
                  <FrostHusk state={h.state} slashKey={slash[h.id] ?? 0} />
                </div>
              )}
              {resetPhase !== "none" && <FrostHusk state={h.state} slashKey={0} />}

              {/* target ring + charge */}
              {isSel && (
                <button
                  className="absolute -inset-4 cursor-crosshair"
                  onPointerDown={(e) => onHuskDown(h, e)}
                  aria-label="strike"
                >
                  <svg viewBox="0 0 120 120" className="absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 overflow-visible">
                    {/* pulse ring 1.5→0.7 */}
                    <circle
                      cx="60" cy="60" r="46" fill="none" stroke="#ff8a6a" strokeWidth="1.6"
                      style={{ transformOrigin: "60px 60px", animation: `targetPulse ${PULSE_MS}ms linear infinite` }}
                    />
                    {/* sweet band */}
                    <circle cx="60" cy="60" r="38" fill="none" stroke="rgba(255,206,138,0.4)" strokeWidth="1" strokeDasharray="3 6" />
                    {/* charge arc */}
                    {chargePct > 0 && (
                      <circle
                        cx="60" cy="60" r="52" fill="none" stroke="#ffd9a3" strokeWidth="3.4" strokeLinecap="round"
                        strokeDasharray={`${chargePct * 326.7} 326.7`}
                        transform="rotate(-90 60 60)"
                        style={{ filter: "drop-shadow(0 0 6px rgba(255,217,163,0.8))" }}
                      />
                    )}
                  </svg>
                </button>
              )}
              {/* clickable body */}
              <button
                className="absolute inset-0 cursor-pointer"
                onPointerDown={(e) => onHuskDown(h, e)}
                aria-label="hoarfrost husk"
              />
              {/* hp pips */}
              {h.state !== "ghost" && h.state !== "defeated" && (
                <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
                  {Array.from({ length: 2 }).map((_, p) => (
                    <span
                      key={p}
                      className="h-1 w-3 rounded-full"
                      style={{
                        background: p < (h.state === "staggered" ? 1 : h.hp) ? "#ff8a6a" : "rgba(255,255,255,0.15)",
                        boxShadow: p < h.hp ? "0 0 6px rgba(255,138,106,0.6)" : undefined,
                      }}
                    />
                  ))}
                </div>
              )}
              {/* feedback tag */}
              <AnimatePresence>
                {feedback?.id === h.id && (
                  <motion.p
                    className="font-term absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] tracking-[0.2em]"
                    style={{ color: feedback.tone, textShadow: "0 0 12px rgba(0,0,0,0.9)" }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {feedback.text}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* combat chrome */}
      <div className="absolute bottom-4 left-4 z-30 flex flex-col gap-2.5 no-select">
        {/* health */}
        <div className="glass-panel flex items-center gap-2 rounded-lg px-3.5 py-2">
          <Heart size={12} className="text-emerald-300" />
          <div className="flex gap-1">
            {Array.from({ length: MAX_HP }).map((_, i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-[3px] transition-all"
                style={{
                  background: i < health ? "#7ff5c9" : "rgba(255,255,255,0.12)",
                  boxShadow: i < health ? "0 0 6px rgba(127,245,201,0.6)" : undefined,
                }}
              />
            ))}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              healSelf();
            }}
            className={`ml-2 rounded border px-2 py-0.5 font-term text-[9px] tracking-[0.18em] transition-colors ${
              stance === "graft"
                ? "border-emerald-300/50 text-emerald-100 hover:bg-emerald-300/10"
                : "border-white/10 text-white/25"
            }`}
          >
            KNIT SELF
          </button>
        </div>
        {/* stance */}
        <div className="flex gap-2">
          {stanceBtn("prune", "PRUNE", Scissors, "#ff8a6a")}
          {stanceBtn("graft", "GRAFT", Sprout, "#7ff5c9")}
        </div>
        {/* hint */}
        <p className="font-term max-w-xs text-[9px] leading-relaxed tracking-[0.14em] text-white/40">{hint}</p>
      </div>

      <style>{`
        @keyframes targetPulse {
          from { transform: scale(1.5); opacity: 0.95; }
          to { transform: scale(0.7); opacity: 0.35; }
        }
      `}</style>
    </motion.div>
  );
}
