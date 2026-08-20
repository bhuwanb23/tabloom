import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ChevronUp, MousePointerClick, Sprout } from "lucide-react";
import type { Beat } from "../game/types";
import { audio } from "../game/audio";
import BranchDiagram from "./BranchDiagram";
import SennAvatar from "./SennAvatar";

/* ------------------------------------------------------------------ */
/*  NarrativeLayer — renders the current beat: cinematic cards,        */
/*  narration, dialogue, terminal typeouts, choices, hotspots,         */
/*  echo lines, tab tutorials, unlock popups. Exposes press().         */
/* ------------------------------------------------------------------ */

export interface BeatHandle {
  press: () => boolean; // true = consumed (skip typing), false = advance
}

const WHO: Record<string, { name: string; color: string; glow: string }> = {
  ari: { name: "ARI VAAN", color: "#aebfd0", glow: "rgba(174,191,208,0.4)" },
  ari2: { name: "ARI — KARTH-MUUN", color: "#9fd7ff", glow: "rgba(159,215,255,0.4)" },
  senn: { name: "SENN", color: "#7ff5c9", glow: "rgba(127,245,201,0.45)" },
  terminal: { name: "TERMINAL", color: "#8ef5c9", glow: "rgba(142,245,201,0.4)" },
  veyr: { name: "VEYR SOL AURIC", color: "#ff6a4d", glow: "rgba(255,106,77,0.4)" },
};

function useTypewriter(text: string, active: boolean, cps = 42) {
  const [count, setCount] = useState(0);
  const done = count >= text.length;
  useEffect(() => {
    setCount(0);
  }, [text]);
  useEffect(() => {
    if (!active || done) return;
    const iv = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) return c;
        const next = c + 1;
        if (next % 3 === 0) audio.type();
        return next;
      });
    }, 1000 / cps);
    return () => window.clearInterval(iv);
  }, [text, active, done, cps]);
  return { shown: text.slice(0, count), done, skip: () => setCount(text.length) };
}

/* ------------------------- card beat ------------------------- */
function CardBeat({ beat, onReady }: { beat: Extract<Beat, { k: "card" }>; onReady: (h: BeatHandle) => void }) {
  useEffect(() => {
    onReady({ press: () => false });
  }, [onReady]);

  const isBig = beat.style === "big";
  const isTerm = beat.style === "term";

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#05070a]/92 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      {beat.kicker && (
        <motion.p
          className="font-term mb-6 text-[11px] tracking-[0.55em] text-emerald-300/70"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {beat.kicker}
        </motion.p>
      )}
      <motion.p
        className={`max-w-3xl text-center ${
          isBig
            ? "font-display text-4xl font-medium tracking-wide text-white text-glow-root sm:text-6xl"
            : isTerm
              ? "font-term text-base text-emerald-200/90 sm:text-lg"
              : "font-display text-2xl font-light italic leading-relaxed text-white/88 sm:text-[34px] sm:leading-[1.5]"
        }`}
        initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.35, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {beat.text}
      </motion.p>
      {beat.sub && (
        <motion.p
          className="font-term mt-6 text-xs tracking-[0.35em] text-white/35"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {beat.sub}
        </motion.p>
      )}
      {beat.viz && (
        <motion.div
          className="mt-8 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.9 }}
        >
          <BranchDiagram dead={beat.viz === "branchesDead"} height={250} />
        </motion.div>
      )}
      <motion.div
        className="absolute bottom-10 flex items-center gap-2 font-term text-[10px] tracking-[0.4em] text-white/25"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.4, 1] }}
        transition={{ delay: 1.6, duration: 1.2 }}
      >
        <span>CLICK TO CONTINUE</span>
        <ChevronRight size={11} className="animate-pulse" />
      </motion.div>
    </motion.div>
  );
}

/* ------------------------- terminal beat ------------------------- */
function TerminalBeat({ beat, onReady }: { beat: Extract<Beat, { k: "t" }>; onReady: (h: BeatHandle) => void }) {
  const full = useMemo(() => beat.lines.join("\n"), [beat.lines]);
  const { shown, done, skip } = useTypewriter(full, true, 64);
  const mountedAt = useRef(Date.now());

  useEffect(() => {
    onReady({
      press: () => {
        if (Date.now() - mountedAt.current < 320) return true;
        if (!done) {
          skip();
          return true;
        }
        return false;
      },
    });
  }, [done, onReady, skip]);

  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/45 px-4 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
    >
      <motion.div
        className="scanlines relative w-full max-w-xl overflow-hidden rounded-lg border border-emerald-300/25 bg-[#04120c] shadow-[0_0_80px_rgba(127,245,201,0.15)]"
        initial={{ y: 26, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 170, damping: 19 }}
      >
        <div className="crt-band" />
        <div className="flex items-center gap-2 border-b border-emerald-300/15 bg-black/30 px-4 py-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2 w-2 rounded-full" style={{ background: i === 0 ? "rgba(255,106,77,0.7)" : "rgba(255,255,255,0.15)" }} />
          ))}
          <span className="font-term ml-2 text-[10px] tracking-[0.3em] text-emerald-200/60">{beat.title ?? "TERMINAL"}</span>
          <span className="font-term ml-auto text-[9px] tracking-[0.2em] text-emerald-200/30">tty·witness</span>
        </div>
        <pre className="font-term min-h-[120px] whitespace-pre-wrap px-5 py-4 text-[13px] leading-[1.9] text-emerald-200/95 sm:text-sm">
          {shown}
          {!done && <span className="term-caret" />}
        </pre>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------- choice beat ------------------------- */
function ChoiceBeat({
  beat,
  onReady,
  onSelect,
}: {
  beat: Extract<Beat, { k: "choice" }>;
  onReady: (h: BeatHandle) => void;
  onSelect: (i: number) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => {
    onReady({ press: () => true });
  }, [onReady]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const idx = parseInt(e.key, 10) - 1;
      if (idx >= 0 && idx < beat.options.length && picked === null) choose(idx);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat, picked]);

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    audio.ui(520);
    window.setTimeout(() => onSelect(i), 420);
  };

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center px-4 pb-8 sm:pb-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {beat.prompt && (
        <p className="font-display mb-5 max-w-xl text-center text-xl italic text-white/75 sm:text-2xl">{beat.prompt}</p>
      )}
      <div className="flex w-full max-w-lg flex-col gap-2.5">
        {beat.options.map((opt, i) => {
          const isPicked = picked === i;
          const collapsed = picked !== null && !isPicked;
          return (
            <motion.button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                choose(i);
              }}
              className="group relative overflow-hidden rounded-xl border px-5 py-3.5 text-left transition-all duration-300"
              style={{
                borderColor: isPicked ? "rgba(127,245,201,0.7)" : "rgba(255,255,255,0.1)",
                background: isPicked ? "rgba(127,245,201,0.08)" : "rgba(10,13,19,0.82)",
                boxShadow: isPicked ? "0 0 30px rgba(127,245,201,0.18)" : undefined,
              }}
              animate={collapsed ? { opacity: 0, x: 24, height: 0, paddingTop: 0, paddingBottom: 0, marginBottom: -10 } : { opacity: 1 }}
              transition={{ duration: 0.35 }}
              whileHover={{ x: 6, borderColor: "rgba(127,245,201,0.45)" }}
            >
              <div className="flex items-center gap-3">
                <span className="font-term text-[10px] tracking-[0.2em] text-emerald-300/50">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex-1">
                  <span className="text-[15px] font-medium text-white/90">{opt.label}</span>
                  {opt.sub && <span className="mt-0.5 block text-xs text-white/38">{opt.sub}</span>}
                </div>
                <ChevronRight size={15} className="text-emerald-300/40 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.button>
          );
        })}
      </div>
      {beat.options.length > 1 && (
        <p className="font-term mt-4 text-[9px] tracking-[0.35em] text-white/20">THE CHOICE IS YOURS · KEYS 1–{beat.options.length}</p>
      )}
    </motion.div>
  );
}

/* ------------------------- hotspot beat ------------------------- */
function HotspotBeat({
  beat,
  onReady,
  onTrigger,
}: {
  beat: Extract<Beat, { k: "hotspot" }>;
  onReady: (h: BeatHandle) => void;
  onTrigger: () => void;
}) {
  const [fired, setFired] = useState(false);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    onReady({ press: () => true });
  }, [onReady]);

  const [x, y, w, h] = beat.rect;
  const trigger = () => {
    if (fired) return;
    setFired(true);
    audio.ui(760);
    window.setTimeout(onTrigger, 350);
  };

  return (
    <motion.div
      className="absolute z-30"
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        className="relative block h-full w-full cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          trigger();
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label={beat.label}
      >
        {/* region shimmer */}
        <motion.span
          className="absolute inset-0 rounded-lg"
          style={{
            background: "radial-gradient(ellipse, rgba(127,245,201,0.1), transparent 70%)",
            border: "1px dashed rgba(127,245,201,0.28)",
          }}
          animate={{ opacity: hover ? 1 : [0.35, 0.75, 0.35] }}
          transition={hover ? { duration: 0.25 } : { duration: 2.4, repeat: Infinity }}
        />
        {/* marker */}
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.span
            className="absolute left-1/2 top-1/2 block h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-200/60"
            animate={{ scale: [0.6, 1.7], opacity: [0.9, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            className="block h-3.5 w-3.5 rotate-45 border border-emerald-100 bg-emerald-300/30"
            style={{ boxShadow: "0 0 16px rgba(127,245,201,0.8)" }}
            animate={{ rotate: [45, 135, 225, 315, 405] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </span>
        {/* label */}
        <motion.span
          className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-[110%] items-center gap-2 whitespace-nowrap rounded-md border border-emerald-200/30 bg-[#070b10]/90 px-3 py-1.5 backdrop-blur-sm"
          animate={{ y: hover ? -4 : 0 }}
        >
          <MousePointerClick size={11} className="text-emerald-300/90" />
          <span className="font-term text-[10px] tracking-[0.3em] text-emerald-100">{beat.label}</span>
          {beat.sub && <span className="font-term text-[9px] tracking-[0.12em] text-white/40">{beat.sub}</span>}
        </motion.span>
      </button>
    </motion.div>
  );
}

/* ------------------------- echo beat ------------------------- */
function EchoBeat({ beat, onReady }: { beat: Extract<Beat, { k: "echo" }>; onReady: (h: BeatHandle) => void }) {
  const mountedAt = useRef(Date.now());
  useEffect(() => {
    audio.heart();
    onReady({
      press: () => Date.now() - mountedAt.current < 500,
    });
  }, [onReady]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-center pb-24 sm:pb-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      <div className="flex max-w-3xl flex-col items-center px-6 text-center">
        <motion.p
          className="font-term mb-6 text-[9px] tracking-[0.5em] text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          TWO ARIS · ONE SENTENCE
        </motion.p>
        <motion.p
          className="font-display relative text-4xl font-light italic text-white sm:text-6xl"
          initial={{ opacity: 0, letterSpacing: "0.35em", filter: "blur(8px)" }}
          animate={{ opacity: 1, letterSpacing: "0.02em", filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* double-exposure ghosts */}
          <span className="absolute inset-0 -translate-x-[3px] translate-y-[2px] select-none text-emerald-300/50 blur-[1px]" aria-hidden>
            “{beat.text}”
          </span>
          <span className="absolute inset-0 translate-x-[3px] -translate-y-[2px] select-none text-sky-300/50 blur-[1px]" aria-hidden>
            “{beat.text}”
          </span>
          <span className="relative">“{beat.text}”</span>
        </motion.p>
        <motion.div
          className="mt-8 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <div className="hair-line w-12" />
          <ChevronRight size={12} className="animate-pulse text-emerald-300/70" />
          <div className="hair-line w-12" />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ------------------------- await-tab beat ------------------------- */
function AwaitTabBeat({ beat, onReady }: { beat: Extract<Beat, { k: "awaitTab" }>; onReady: (h: BeatHandle) => void }) {
  useEffect(() => {
    onReady({ press: () => true });
  }, [onReady]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 top-3 z-40 flex justify-center"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
    >
      <div className="glass-panel flex items-center gap-3 rounded-b-xl border-t-0 px-5 py-3" style={{ borderColor: "rgba(127,245,201,0.35)" }}>
        <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
          <ChevronUp size={14} className="text-emerald-300" />
        </motion.span>
        <span className="font-term text-[10px] tracking-[0.22em] text-emerald-100/90 sm:text-[11px]">{beat.text}</span>
      </div>
    </motion.div>
  );
}

/* ------------------------- unlock beat ------------------------- */
function UnlockBeat({ beat, onReady }: { beat: Extract<Beat, { k: "unlock" }>; onReady: (h: BeatHandle) => void }) {
  const mountedAt = useRef(Date.now());
  useEffect(() => {
    audio.bloom();
    onReady({ press: () => Date.now() - mountedAt.current < 500 });
  }, [onReady]);

  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/45 px-4 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass-panel flex max-w-sm flex-col items-center rounded-2xl px-8 py-7 text-center"
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 170, damping: 16 }}
      >
        <p className="font-term text-[9px] tracking-[0.5em] text-amber-200/80">ROOT-CRAFT UNLOCKED</p>
        <motion.div
          className="mt-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-300/[0.08]"
          style={{ boxShadow: "0 0 40px rgba(127,245,201,0.25)" }}
          animate={{ rotate: [0, 8, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Sprout size={26} className="text-emerald-200" />
        </motion.div>
        <h3 className="font-display mt-4 text-2xl font-medium text-white">{beat.title}</h3>
        <p className="font-display mt-1.5 text-sm italic text-white/55">{beat.sub}</p>
        <div className="hair-line mt-5 w-24" />
        <p className="font-term mt-4 text-[9px] tracking-[0.35em] text-white/30">CLICK TO CONTINUE</p>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------- main layer ------------------------- */

export default function NarrativeLayer({
  beat,
  beatKey,
  sennHere,
  handleRef,
  onChoose,
  onHotspotThen,
}: {
  beat: Beat;
  beatKey: string;
  sennHere: boolean;
  handleRef: MutableRefObject<BeatHandle | null>;
  onChoose: (i: number) => void;
  onHotspotThen: () => void;
}) {
  const setHandle = (h: BeatHandle) => {
    handleRef.current = h;
  };

  if (beat.k === "n" || beat.k === "d") {
    return <TextBeat key={beatKey} beat={beat} sennHere={sennHere} onReady={setHandle} />;
  }
  if (beat.k === "card") return <CardBeat key={beatKey} beat={beat} onReady={setHandle} />;
  if (beat.k === "t") return <TerminalBeat key={beatKey} beat={beat} onReady={setHandle} />;
  if (beat.k === "choice") return <ChoiceBeat key={beatKey} beat={beat} onReady={setHandle} onSelect={onChoose} />;
  if (beat.k === "hotspot") return <HotspotBeat key={beatKey} beat={beat} onReady={setHandle} onTrigger={onHotspotThen} />;
  if (beat.k === "echo") return <EchoBeat key={beatKey} beat={beat} onReady={setHandle} />;
  if (beat.k === "awaitTab") return <AwaitTabBeat key={beatKey} beat={beat} onReady={setHandle} />;
  if (beat.k === "unlock") return <UnlockBeat key={beatKey} beat={beat} onReady={setHandle} />;

  return null;
}

/* ------------------------- text beat (narration / dialogue) ------------------------- */
function TextBeat({
  beat,
  sennHere,
  onReady,
}: {
  beat: Extract<Beat, { k: "n" | "d" }>;
  sennHere: boolean;
  onReady: (h: BeatHandle) => void;
}) {
  const isN = beat.k === "n";
  const text = beat.text;
  const { shown, done, skip } = useTypewriter(text, true, 44);
  const mountedAt = useRef(Date.now());

  useEffect(() => {
    onReady({
      press: () => {
        if (Date.now() - mountedAt.current < 260) return true;
        if (!done) {
          skip();
          return true;
        }
        return false;
      },
    });
  }, [done, onReady, skip]);

  const who = !isN ? WHO[beat.who] ?? WHO.ari : null;
  const isSenn = !isN && beat.who === "senn";
  const omit = !isN ? beat.omit : undefined;

  return (
    <motion.div
      className={`pointer-events-none absolute z-30 flex ${
        isN ? "inset-x-0 bottom-16 items-end justify-center sm:bottom-20" : "inset-x-0 bottom-14 px-4 sm:bottom-16 sm:px-8"
      }`}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {isN ? (
        <div className="relative max-w-3xl px-6 text-center">
          <p className="font-display text-xl font-light italic leading-relaxed text-white/90 [text-shadow:0_2px_24px_rgba(0,0,0,0.9)] sm:text-[26px] sm:leading-[1.6]">
            {shown}
            {!done && <span className="term-caret" style={{ background: "rgba(127,245,201,0.8)" }} />}
          </p>
          <AnimatePresence>
            {done && (
              <motion.div className="mx-auto mt-5 flex w-fit items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="hair-line w-12" />
                <ChevronRight size={12} className="animate-pulse text-emerald-300/70" />
                <div className="hair-line w-12" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="pointer-events-none flex w-full max-w-3xl items-end gap-4">
          {isSenn && sennHere && (
            <div className="hidden shrink-0 sm:block" style={{ width: 88 }}>
              <SennAvatar speaking={!done} size={88} />
            </div>
          )}
          <div className="glass-panel relative flex-1 rounded-2xl rounded-bl-sm px-5 py-4 sm:px-6" style={{ borderColor: `${who!.color}30` }}>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: who!.color, boxShadow: `0 0 8px ${who!.glow}` }} />
              <span className="font-term text-[10px] tracking-[0.35em]" style={{ color: who!.color }}>
                {who!.name}
              </span>
            </div>
            <p className="font-display text-lg leading-relaxed text-white/92 sm:text-[21px]">
              {shown}
              {!done && <span className="term-caret" style={{ background: who!.color }} />}
            </p>
            {omit && done && (
              <motion.p
                className="font-term mt-2 text-[11px] tracking-wider text-white/25"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.7, 0.3, 0.6] }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <span className="mr-2 text-emerald-300/40">unsaid:</span>
                <span className="line-through decoration-red-400/50">{omit}</span>
              </motion.p>
            )}
            {done && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-2 right-5">
                <ChevronRight size={13} className="animate-pulse text-emerald-300/70" />
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
