import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Scissors, Sprout } from "lucide-react";
import { audio } from "../game/audio";
import VeyrSprite, { type VeyrState } from "./sprites/VeyrSprite";
import StaticNoise from "./fx/StaticNoise";

/* ------------------------------------------------------------------ */
/*  VeyrFight — three phases. Phase 1 he tests you (prune windows).    */
/*  Phase 2 he opens with the Nullroot (graft the unmade ground, or    */
/*  lose a heart). Phase 3 both, fast. He never taunts. He explains.   */
/* ------------------------------------------------------------------ */

type Stance = "prune" | "graft";
type Mode = "window" | "null" | "recover" | "beaten";

const PULSE_MS = 1150;
const CHARGE_MS = 820;
const HITS = [3, 3, 3];
const NULL_MS = 4200;
const MAX_HP = 4;

const inSweet = () => {
  const p = (performance.now() % PULSE_MS) / PULSE_MS;
  return p >= 0.54 && p <= 0.9;
};

/* he speaks the whole time. none of it is trash talk. */
const BARKS: Record<string, string[]> = {
  open: ["You've grown into it. Good. I'd hate to do this to the version that was still asking permission."],
  hit: [
    "Yes. That's the arm. Whoever taught you pruning did it properly.",
    "You cut like a man who's been told cutting is mercy. It is. That's the trouble.",
    "Better. Do you feel how easy it is to be good at this?",
  ],
  null: [
    "This is the Nullroot. It does not wound — it withdraws permission.",
    "Hold the ground together, boy. I am not attacking you. I am subtracting the floor.",
    "Everything you are standing on is a claim. I am disputing it.",
  ],
  nullFail: ["You let it go. Feel that? That's a small piece of you that no longer has a reason to have happened."],
  phase: [
    "Second wind. I have had eleven of them and none were pleasant.",
    "You're still here. Of course you are. That's the whole reason they picked you.",
  ],
  beaten: ["…Enough. Enough. Put it down — you've earned the part where I talk."],
};

const pick = (k: string, i = 0) => BARKS[k][i % BARKS[k].length];

export default function VeyrFight({ onWin }: { onWin: () => void }) {
  const [stance, setStance] = useState<Stance>("prune");
  const [phase, setPhase] = useState(0);
  const [mode, setMode] = useState<Mode>("window");
  const [hits, setHits] = useState(0);
  const [hp, setHp] = useState(MAX_HP);
  const [charge, setCharge] = useState(0);
  const [nullHold, setNullHold] = useState(0);
  const [bark, setBark] = useState(pick("open"));
  const [tag, setTag] = useState<string | null>(null);
  const [flash, setFlash] = useState<"cut" | "null" | null>(null);

  const chargeStart = useRef<number | null>(null);
  const holdRef = useRef(false);
  const raf = useRef(0);
  const nullStart = useRef(0);
  const done = useRef(false);

  const vState: VeyrState = mode === "beaten" ? "kneel" : (Math.min(phase, 2) as VeyrState);

  const showTag = (t: string) => {
    setTag(t);
    window.setTimeout(() => setTag((x) => (x === t ? null : x)), 900);
  };

  const tick = useCallback(() => {
    if (chargeStart.current == null) return;
    setCharge(Math.min((performance.now() - chargeStart.current) / CHARGE_MS, 1));
    raf.current = requestAnimationFrame(tick);
  }, []);

  /* he opens with the Nullroot on a timer during windows */
  useEffect(() => {
    if (mode !== "window" || done.current) return;
    const t = window.setTimeout(() => {
      setMode("null");
      nullStart.current = performance.now();
      setNullHold(0);
      setBark(pick("null", phase));
      audio.staticBurst(0.8);
    }, 7000 + phase * 500);
    return () => window.clearTimeout(t);
  }, [mode, phase, hits]);

  /* the null window — hold GRAFT to keep the ground */
  useEffect(() => {
    if (mode !== "null") return;
    const iv = window.setInterval(() => {
      const elapsed = performance.now() - nullStart.current;
      if (holdRef.current && stance === "graft") {
        setNullHold((h) => Math.min(1, h + 0.055));
      } else {
        setNullHold((h) => Math.max(0, h - 0.022));
      }
      if (elapsed > NULL_MS) {
        setNullHold((h) => {
          if (h >= 0.85) {
            audio.chime();
            showTag("GROUND HELD");
          } else {
            audio.thud();
            setHp((x) => Math.max(0, x - 1));
            setFlash("null");
            window.setTimeout(() => setFlash(null), 400);
            setBark(pick("nullFail"));
            showTag("UNMADE");
          }
          return 0;
        });
        setMode("recover");
        window.setTimeout(() => {
          setMode("window");
          setStance("prune");
        }, 1400);
      }
    }, 70);
    return () => window.clearInterval(iv);
  }, [mode, stance]);

  /* defeat → he kneels and asks to talk */
  useEffect(() => {
    if (phase < HITS.length || done.current) return;
    done.current = true;
    setMode("beaten");
    setBark(pick("beaten"));
    audio.staticBurst(0.6);
    window.setTimeout(() => audio.bloom(), 700);
    window.setTimeout(onWin, 4600);
  }, [phase, onWin]);

  /* death → he simply waits. you cannot lose this, only be delayed. */
  useEffect(() => {
    if (hp > 0 || done.current) return;
    setHp(MAX_HP);
    setBark("Get up. I have not come all this way to be handed a corpse that agrees with me.");
    audio.heart();
  }, [hp]);

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

  useEffect(() => {
    const up = () => {
      holdRef.current = false;
      if (chargeStart.current == null) return;
      const pct = Math.min((performance.now() - chargeStart.current) / CHARGE_MS, 1);
      cancelAnimationFrame(raf.current);
      chargeStart.current = null;
      setCharge(0);
      if (mode !== "window" || done.current) return;
      if (stance !== "prune") return;
      if (pct < 0.5) {
        showTag("TOO QUICK");
        audio.ui(300);
        return;
      }
      if (!inSweet()) {
        showTag("HE SLIPS IT");
        audio.ui(340);
        return;
      }
      audio.thud();
      setFlash("cut");
      window.setTimeout(() => setFlash(null), 240);
      showTag("CLEAN");
      setHits((h) => {
        const next = h + 1;
        if (next >= HITS[phase]) {
          setPhase((p) => {
            const np = p + 1;
            if (np < HITS.length) {
              setBark(pick("phase", p));
              audio.staticBurst(0.5);
            }
            return np;
          });
          return 0;
        }
        setBark(pick("hit", next - 1));
        return next;
      });
    };
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, [mode, stance, phase]);

  const down = (e: React.PointerEvent) => {
    e.stopPropagation();
    holdRef.current = true;
    if (mode === "null") {
      if (stance !== "graft") {
        showTag("GRAFT — HOLD THE GROUND");
        audio.reject(320);
      }
      return;
    }
    if (mode !== "window" || chargeStart.current != null) return;
    if (stance !== "prune") {
      showTag("SWITCH TO PRUNE");
      audio.reject(320);
      return;
    }
    chargeStart.current = performance.now();
    audio.ui(440);
    raf.current = requestAnimationFrame(tick);
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
      }}
    >
      <Icon size={13} />
      {label}
      {wanted && stance !== s && (
        <motion.span
          className="absolute -inset-px rounded-lg border-2"
          style={{ borderColor: tone }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        />
      )}
    </button>
  );

  return (
    <motion.div
      className="absolute inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onPointerDown={down}
    >
      {/* the nullroot's wrongness — reality declining to continue */}
      <AnimatePresence>
        {mode === "null" && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <StaticNoise className="absolute inset-0 h-full w-full" opacity={0.5} />
            <div className="glitching absolute inset-0 bg-red-500/[0.07]" />
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 62% 46%, rgba(255,40,30,0.22), transparent 62%)" }}
            />
            {/* the floor, being disputed */}
            <motion.div
              className="absolute inset-x-0 bottom-0 h-[34%]"
              style={{ background: "linear-gradient(0deg, rgba(255,40,30,0.28), transparent)" }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* veyr, holding the frame */}
      <motion.div
        className="absolute z-10"
        style={{ left: "58%", top: "22%", width: "26%", height: "62%" }}
        animate={
          mode === "beaten"
            ? { y: 26, scale: 0.94 }
            : flash === "cut"
              ? { x: [0, 10, -6, 0] }
              : { x: 0 }
        }
        transition={{ duration: mode === "beaten" ? 1.6 : 0.34, ease: "easeOut" }}
      >
        <VeyrSprite state={vState} className="h-full w-full" />
        {/* prune pulse ring, on him */}
        {mode === "window" && (
          <svg viewBox="0 0 200 200" className="pointer-events-none absolute left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 overflow-visible">
            <circle
              cx="100" cy="100" r="74" fill="none" stroke="#ff8a6a" strokeWidth="2"
              style={{ transformOrigin: "100px 100px", animation: `vfPulse ${PULSE_MS}ms linear infinite` }}
            />
            <circle cx="100" cy="100" r="62" fill="none" stroke="rgba(255,206,138,0.45)" strokeWidth="1.2" strokeDasharray="4 8" />
            {charge > 0 && (
              <circle
                cx="100" cy="100" r="86" fill="none" stroke="#ffd9a3" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${charge * 540.4} 540.4`}
                transform="rotate(-90 100 100)"
                style={{ filter: "drop-shadow(0 0 7px rgba(255,217,163,0.9))" }}
              />
            )}
          </svg>
        )}
      </motion.div>

      {/* hit flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-30"
            style={{ background: flash === "cut" ? "rgba(255,120,90,0.26)" : "rgba(255,40,30,0.4)" }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: flash === "cut" ? 0.24 : 0.45 }}
          />
        )}
      </AnimatePresence>

      {/* tag */}
      <AnimatePresence>
        {tag && (
          <motion.p
            className="font-term pointer-events-none absolute left-1/2 top-[15%] z-40 -translate-x-1/2 text-[11px] tracking-[0.4em] text-white/90"
            style={{ textShadow: "0 0 16px rgba(0,0,0,0.95)" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {tag}
          </motion.p>
        )}
      </AnimatePresence>

      {/* chrome */}
      <div className="absolute inset-x-0 top-4 z-40 flex flex-col items-center gap-2 no-select">
        <p className="font-term text-[9px] tracking-[0.5em] text-white/45">
          VEYR SOL AURIC · PHASE {Math.min(phase + 1, 3)}/3
        </p>
        <div className="flex gap-1.5">
          {HITS.map((_, i) => (
            <div key={i} className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full"
                style={{ background: "linear-gradient(90deg, #ff5a44, #ffce8a)" }}
                animate={{ width: i < phase ? "0%" : i === phase ? `${100 - (hits / HITS[i]) * 100}%` : "100%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>
        {/* the null bar */}
        <AnimatePresence>
          {mode === "null" && (
            <motion.div
              className="mt-1 flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="font-term text-[9px] tracking-[0.35em] text-red-300">HOLD GRAFT — KEEP THE GROUND</p>
              <div className="h-2 w-52 overflow-hidden rounded-full border border-red-400/30 bg-black/50">
                <motion.div className="h-full bg-emerald-300" animate={{ width: `${nullHold * 100}%` }} transition={{ duration: 0.08 }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* hp */}
      <div className="absolute bottom-4 left-4 z-40 flex flex-col gap-2.5 no-select">
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/45 px-3 py-2">
          <Heart size={12} className="text-emerald-300" />
          <div className="flex gap-1">
            {Array.from({ length: MAX_HP }).map((_, i) => (
              <span
                key={i}
                className="h-2 w-2.5 rounded-[3px]"
                style={{ background: i < hp ? "#7ff5c9" : "rgba(255,255,255,0.12)", boxShadow: i < hp ? "0 0 6px rgba(127,245,201,0.6)" : undefined }}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {stanceBtn("prune", "PRUNE", Scissors, "#ff8a6a", mode === "window")}
          {stanceBtn("graft", "GRAFT", Sprout, "#7ff5c9", mode === "null")}
        </div>
      </div>

      {/* he talks. it is never taunting. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-40 flex justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={bark}
            className="font-display max-w-2xl text-center text-lg italic text-red-100/80 sm:text-xl"
            style={{ textShadow: "0 0 30px rgba(0,0,0,0.95)" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            “{bark}”
          </motion.p>
        </AnimatePresence>
      </div>

      <style>{`@keyframes vfPulse { from { transform: scale(1.5); opacity: 0.95; } to { transform: scale(0.7); opacity: 0.3; } }`}</style>
    </motion.div>
  );
}
