import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Minus, Plus, Radio } from "lucide-react";
import type { Beat, BranchId, FxId, RunSave, RunStats } from "../game/types";
import { SCENES } from "../game/story";
import { codexById } from "../game/codex";
import { RUN_KEY } from "../game/types";
import { audio } from "../game/audio";
import TabBar from "./TabBar";
import NarrativeLayer, { type BeatHandle } from "./NarrativeLayer";
import GraftGame from "./GraftGame";
import CombatLoop from "./CombatLoop";
import PruneCharge from "./PruneCharge";
import DocPuzzle from "./DocPuzzle";
import InvariantDiagram from "./InvariantDiagram";
import MirrorPool from "./MirrorPool";
import QuietGraft from "./QuietGraft";
import MemoryPlayback from "./MemoryPlayback";
import BossFight from "./BossFight";
import ExploreLayer from "./ExploreLayer";
import Carving from "./Carving";
import VeyrFight from "./VeyrFight";
import TheTruth from "./TheTruth";
import Credits from "./Credits";
import VnScene from "./VnScene";
import GraftCast from "./fx/GraftCast";
import StaticNoise from "./fx/StaticNoise";
import SennAvatar from "./SennAvatar";

/* ------------------------------------------------------------------ */
/*  GameShell — the narrative engine + stage. Tab bar up top (once     */
/*  unlocked), painted branch art in the middle, beats flowing.        */
/* ------------------------------------------------------------------ */

interface Toast {
  id: number;
  text: string;
  sub?: string;
  kind: "codex" | "coh" | "info";
}

const clampCoh = (c: number) => Math.max(0, Math.min(100, Math.round(c)));

export default function GameShell({
  initial,
  muted,
  onToggleMute,
  unlockCodex,
  onOpenCodex,
  onEnd,
  onExit,
  onReplayAll,
  onEnding,
}: {
  initial: RunSave;
  muted: boolean;
  onToggleMute: () => void;
  unlockCodex: (id: string) => boolean;
  onOpenCodex: () => void;
  onEnd: (stats: RunStats) => void;
  onExit: () => void;
  onReplayAll: () => void;
  onEnding: (id: string) => void;
}) {
  const [sceneIdx, setSceneIdx] = useState(initial.sceneIdx);
  const [queue, setQueue] = useState<Beat[]>(SCENES[initial.sceneIdx]?.beats ?? []);
  const [idx, setIdx] = useState(0);
  const [branch, setBranch] = useState<BranchId>(initial.branch);
  const [tabs, setTabs] = useState<BranchId[]>(initial.tabs);
  const [flags, setFlags] = useState<Record<string, boolean | string | number>>(initial.flags);
  const [coherence, setCoherence] = useState(initial.coherence);
  const [grafted, setGrafted] = useState(initial.grafted);
  const [sennHere, setSennHere] = useState(Boolean(initial.flags.sennHere));
  const [sennBurst, setSennBurst] = useState(false);
  const [overlay, setOverlay] = useState<
    | "graft"
    | "combat"
    | "prune"
    | "docs"
    | "diagram"
    | "spot"
    | "graftQuiet"
    | "memory"
    | "boss"
    | "carving"
    | "veyrFight"
    | "truth"
    | null
  >(null);
  const [transitioning, setTransitioning] = useState(false);
  const [flash, setFlash] = useState<"root" | "white" | "cold" | "tear" | null>(null);
  const [fadeBlack, setFadeBlack] = useState(false);
  const [fadeTone, setFadeTone] = useState("#000000");
  const [credits, setCredits] = useState<string | null>(null);
  const [castOn, setCastOn] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const handleRef = useRef<BeatHandle | null>(null);
  const lastPress = useRef(0);
  const toastId = useRef(0);
  const finishedRef = useRef(false);

  const scene = SCENES[sceneIdx];
  const beat: Beat | undefined = queue[idx];
  const beatKey = `${sceneIdx}:${idx}`;
  const tabBarOn = Boolean(flags.tabBarOn);
  const awaitingTab = beat?.k === "awaitTab" && beat.branch !== branch ? beat.branch : null;

  /* ---------------- toasts ---------------- */
  const toast = useCallback((text: string, kind: Toast["kind"], sub?: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, text, kind, sub }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);

  /* ---------------- flags ---------------- */
  const setFlag = useCallback((name: string, value: boolean | string | number = true) => {
    setFlags((f) => ({ ...f, [name]: value }));
  }, []);

  /* ---------------- branch switching ---------------- */
  const switchBranch = useCallback(
    (b: BranchId, silent = false) => {
      if (b === branch) return;
      if (silent) {
        setBranch(b);
        audio.setBranch(b);
        return;
      }
      setTransitioning(true);
      audio.staticBurst(0.35);
      window.setTimeout(() => {
        setBranch(b);
        audio.setBranch(b);
      }, 200);
      window.setTimeout(() => setTransitioning(false), 750);
    },
    [branch],
  );

  /* ---------------- fx ---------------- */
  const runFx = useCallback(
    (f: FxId) => {
      switch (f) {
        case "shadowsOn":
          setFlag("shadowsOn");
          audio.heart();
          break;
        case "terminalOn":
          setFlag("terminalOn");
          audio.staticBurst(0.3);
          break;
        case "terminalOff":
          setFlag("terminalOn", false);
          break;
        case "openTabKarth":
          audio.staticBurst(0.7);
          window.setTimeout(() => {
            setTabs((t) => (t.includes("karth") ? t : [...t, "karth"]));
          }, 420);
          break;
        case "shake":
          setShaking(true);
          audio.thud();
          window.setTimeout(() => setShaking(false), 500);
          break;
        case "glitch":
          setTransitioning(true);
          audio.staticBurst(0.4);
          window.setTimeout(() => setTransitioning(false), 800);
          break;
        case "sennArrive":
          setSennHere(true);
          setSennBurst(true);
          setFlag("sennHere");
          audio.shimmer();
          window.setTimeout(() => setSennBurst(false), 2400);
          break;
        case "sennLeave":
          setSennHere(false);
          setFlag("sennHere", false);
          break;
        case "night":
          setFlag("night");
          break;
        case "bloomFlash":
          setFlash("root");
          window.setTimeout(() => setFlash(null), 1100);
          break;
        case "whiteFlash":
          setFlash("white");
          audio.staticBurst(0.25);
          window.setTimeout(() => setFlash(null), 650);
          break;
        case "tabBarOn":
          setFlag("tabBarOn");
          audio.shimmer();
          break;
        case "graftCast":
          setCastOn(true);
          audio.shimmer();
          window.setTimeout(() => audio.chime(), 900);
          window.setTimeout(() => setCastOn(false), 2200);
          break;
        case "fadeBlack":
          setFadeTone("#000000");
          setFadeBlack(true);
          break;
        case "chimeLamp":
          audio.chime();
          break;
        case "coldFlash":
          setFlash("cold");
          audio.staticBurst(0.5);
          window.setTimeout(() => setFlash(null), 900);
          break;
        case "duck":
          audio.setDucked(true);
          break;
        case "unduck":
          audio.setDucked(false);
          break;
        case "tear":
          setFlash("tear");
          audio.staticBurst(0.28);
          audio.ui(1650);
          window.setTimeout(() => audio.thud(), 90);
          window.setTimeout(() => setFlash(null), 260);
          break;
        case "startle":
          setShaking(true);
          audio.heart();
          window.setTimeout(() => audio.heart(), 520);
          window.setTimeout(() => setShaking(false), 420);
          break;
        case "desaturate":
          setFlag("edenDead");
          audio.setDucked(true);
          window.setTimeout(() => audio.setDucked(false), 4200);
          break;
        case "longFade":
          setFadeTone("#000000");
          setFadeBlack(true);
          audio.setDucked(true);
          break;
        case "fadeWhite":
          setFadeTone("#f6fbf8");
          setFadeBlack(true);
          audio.setDucked(true);
          break;
        case "fadeGrey":
          setFadeTone("#9aa3ad");
          setFadeBlack(true);
          audio.setDucked(true);
          break;
        case "staticUp":
          setFlag("staticUp");
          audio.staticBurst(0.8);
          break;
        case "staticDown":
          setFlag("staticUp", false);
          break;
      }
    },
    [setFlag],
  );

  /* ---------------- finish / save ---------------- */
  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onEnd({
      coherence,
      codexCount: 0,
      grafted,
      sleepBranch: null,
    });
  }, [coherence, grafted, onEnd]);

  useEffect(() => {
    const save: RunSave = { sceneIdx, coherence, tabs, branch, flags, grafted };
    try {
      localStorage.setItem(RUN_KEY, JSON.stringify(save));
    } catch {
      /* storage unavailable — play on */
    }
  }, [sceneIdx, coherence, tabs, branch, flags, grafted]);

  /* ---------------- scene loading ---------------- */
  const loadScene = useCallback(
    (next: number) => {
      if (next >= SCENES.length) {
        finish();
        return;
      }
      const sc = SCENES[next];
      setSceneIdx(next);
      setQueue(sc.beats);
      setIdx(0);
      setFadeBlack(false);
      audio.setDucked(false);
      setTabs((t) => {
        const withoutVoid = t.filter((x) => x !== "void");
        if (sc.branch === "void") return ["void"];
        return withoutVoid.includes(sc.branch) ? withoutVoid : [...withoutVoid, sc.branch];
      });
      switchBranch(sc.branch, true);
    },
    [finish, switchBranch],
  );

  /* ---------------- auto beats ---------------- */
  useEffect(() => {
    if (!beat) {
      const t = window.setTimeout(() => loadScene(sceneIdx + 1), 420);
      return () => window.clearTimeout(t);
    }
    if (beat.k === "fx") {
      runFx(beat.fx);
      const t = window.setTimeout(() => setIdx((i) => i + 1), beat.autoMs ?? 850);
      return () => window.clearTimeout(t);
    }
    if (beat.k === "codex") {
      const fresh = unlockCodex(beat.id);
      const entry = codexById(beat.id);
      if (fresh && entry) {
        audio.ui(880);
        toast(entry.title, "codex", "codex unlocked");
      }
      const t = window.setTimeout(() => setIdx((i) => i + 1), 80);
      return () => window.clearTimeout(t);
    }
    if (beat.k === "coh") {
      setCoherence((c) => {
        const next = clampCoh(c + beat.d);
        if (!beat.silent)
          window.setTimeout(
            () => toast(`${beat.d > 0 ? "+" : ""}${beat.d} COHERENCE`, "coh", beat.d > 0 ? "the weave holds" : "the weave frays"),
            60,
          );
        return next;
      });
      const t = window.setTimeout(() => setIdx((i) => i + 1), 70);
      return () => window.clearTimeout(t);
    }
    if (beat.k === "set") {
      setFlag(beat.flag, beat.value);
      const t = window.setTimeout(() => setIdx((i) => i + 1), 60);
      return () => window.clearTimeout(t);
    }
    if (beat.k === "hold") {
      const t = window.setTimeout(() => setIdx((i) => i + 1), beat.ms);
      return () => window.clearTimeout(t);
    }
    if (beat.k === "setTab") {
      switchBranch(beat.branch);
      const t = window.setTimeout(() => setIdx((i) => i + 1), 620);
      return () => window.clearTimeout(t);
    }
    if (beat.k === "graft") {
      setOverlay("graft");
      return;
    }
    if (beat.k === "combat") {
      setOverlay("combat");
      return;
    }
    if (beat.k === "prune") {
      setOverlay("prune");
      return;
    }
    if (beat.k === "docs") {
      setOverlay("docs");
      return;
    }
    if (beat.k === "diagram") {
      setOverlay("diagram");
      return;
    }
    if (beat.k === "spot") {
      setOverlay("spot");
      return;
    }
    if (beat.k === "graftQuiet") {
      setOverlay("graftQuiet");
      return;
    }
    if (beat.k === "memory") {
      setOverlay("memory");
      return;
    }
    if (beat.k === "boss") {
      setOverlay("boss");
      return;
    }
    if (beat.k === "carving") {
      setOverlay("carving");
      return;
    }
    if (beat.k === "veyrFight") {
      setOverlay("veyrFight");
      return;
    }
    if (beat.k === "truth") {
      setOverlay("truth");
      return;
    }
    if (beat.k === "credits") {
      setCredits(beat.ending);
      onEnding(beat.ending);
      audio.setDucked(false);
      try {
        localStorage.removeItem(RUN_KEY);
      } catch {
        /* ignore */
      }
      return;
    }
    if (beat.k === "awaitTab" && beat.branch === branch) {
      // already standing in the awaited reality — linger, then move on
      const t = window.setTimeout(() => setIdx((i) => i + 1), 2600);
      return () => window.clearTimeout(t);
    }
  }, [beat, idx, queue.length, sceneIdx, branch, loadScene, runFx, unlockCodex, toast, setFlag, switchBranch]);

  /* ---------------- audio ambience on mount ---------------- */
  useEffect(() => {
    audio.setBranch(branch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- press / advance ---------------- */
  const advance = useCallback(() => setIdx((i) => i + 1), []);

  const press = useCallback(() => {
    if (overlay || transitioning) return;
    /* auto-advancing beats own their own clock — clicks must not jump them */
    const k = queue[idx]?.k;
    if (k === "hold" || k === "fx" || k === "set" || k === "codex" || k === "coh" || k === "setTab") return;
    /* exploration owns its own exit — clicking the scenery must not skip it */
    if (k === "explore") return;
    const now = Date.now();
    if (now - lastPress.current < 180) return;
    lastPress.current = now;
    const consumed = handleRef.current?.press() ?? false;
    if (!consumed) advance();
  }, [overlay, transitioning, advance, queue, idx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "BUTTON" || tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        press();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  /* ---------------- choice / hotspot splicing ---------------- */
  const insertThen = useCallback(
    (then: Beat[]) => {
      setQueue((q) => [...q.slice(0, idx + 1), ...then, ...q.slice(idx + 1)]);
      setIdx((i) => i + 1);
    },
    [idx],
  );

  const onChoose = useCallback(
    (i: number) => {
      const b = queue[idx];
      if (b?.k !== "choice") return;
      insertThen(b.options[i].then);
    },
    [queue, idx, insertThen],
  );

  const onHotspotThen = useCallback(() => {
    const b = queue[idx];
    if (b?.k !== "hotspot") return;
    insertThen(b.then);
  }, [queue, idx, insertThen]);

  const closeOverlayAdvance = useCallback(() => {
    setOverlay(null);
    advance();
  }, [advance]);

  /* ---------------- tab selection (may satisfy an awaitTab beat) ---------------- */
  const onSelectTab = useCallback(
    (b: BranchId) => {
      if (b === branch) return;
      if (flags.tabLock === b) {
        audio.staticBurst(0.14);
        toast("this tab is sealed for now", "info", "karth-muun isn't finished with you");
        return;
      }
      switchBranch(b);
      const cur = queue[idx];
      if (cur?.k === "awaitTab" && cur.branch === b) {
        window.setTimeout(() => setIdx((i) => i + 1), 650);
      }
    },
    [branch, queue, idx, switchBranch],
  );

  /* ---------------- graft callbacks (reserved for later acts) ---------------- */
  const onGraftFail = useCallback(() => {
    setCoherence((c) => clampCoh(c - 3));
    toast("−3 COHERENCE", "coh", "the lock bites");
  }, [toast]);

  const onGraftComplete = useCallback(() => {
    setGrafted(true);
    setOverlay(null);
    advance();
  }, [advance]);

  /* ---------------- progress ---------------- */
  const progress = ((sceneIdx + Math.min(idx, Math.max(queue.length - 1, 1)) / Math.max(queue.length, 1)) / SCENES.length) * 100;

  /* the story is over. everything else stops mattering. */
  if (credits) {
    return <Credits ending={credits} onReplay={onReplayAll} onTitle={onExit} />;
  }

  return (
    <div className="flex h-full flex-col bg-[#05070a]">
      {/* the tab bar arrives when the story earns it — and is taken away when it doesn't */}
      <AnimatePresence>
        {tabBarOn && !flags.tabHide && (
          <motion.div
            initial={{ y: -48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -48, opacity: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 20 }}
          >
            <TabBar
              tabs={tabs}
              active={branch}
              sceneUrl={scene?.meta.url ?? "aevum://…"}
              sceneTag={scene?.meta.tag ?? ""}
              coherence={coherence}
              muted={muted}
              locked={overlay !== null}
              awaiting={awaitingTab}
              glowTab={(flags.tabGlow as BranchId | undefined) ?? null}
              disabledTabs={flags.tabLock ? [flags.tabLock as BranchId] : []}
              onSelect={onSelectTab}
              onTease={() => {
                audio.staticBurst(0.18);
                toast("the static churns", "info", "nothing there yet — keep looking");
              }}
              onCodex={onOpenCodex}
              onMute={onToggleMute}
              onHome={onExit}
            />
            <div className="relative z-40 h-[2px] bg-white/[0.04]">
              <motion.div
                className="h-full"
                style={{ background: "linear-gradient(90deg, #2c8f6b, #7ff5c9)" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* stage */}
      <div className="relative flex-1 overflow-hidden" onPointerDown={press}>
        {/* branch art */}
        <AnimatePresence mode="wait">
          <motion.div
            key={branch}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div className="absolute inset-0" animate={shaking ? { x: [0, -9, 9, -5, 5, 0] } : { x: 0 }} transition={{ duration: 0.45 }}>
              <VnScene branch={branch} flags={flags} />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* static veil between tabs */}
        <AnimatePresence>
          {Boolean(flags.staticUp) && (
            <motion.div
              className="absolute inset-0 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-black/45" />
              <StaticNoise className="absolute inset-0 h-full w-full" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* vignette + grain */}
        <div className="vignette-layer absolute inset-0 z-[21]" />
        <div className="grain-layer absolute inset-0 z-[22]" />

        {/* beats */}
        <AnimatePresence mode="wait">
          {beat && (
            <NarrativeLayer
              key={beatKey}
              beat={beat}
              beatKey={beatKey}
              sennHere={sennHere}
              handleRef={handleRef}
              onChoose={onChoose}
              onHotspotThen={onHotspotThen}
            />
          )}
        </AnimatePresence>

        {/* senn, present but silent — watching from the edge, not looking */}
        <AnimatePresence>
          {Boolean(flags.sennWatch) && !overlay && (
            <motion.div
              className="pointer-events-none absolute bottom-[26%] left-4 z-30 sm:left-8"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 0.72, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <SennAvatar size={72} lookAway />
            </motion.div>
          )}
        </AnimatePresence>

        {/* senn dock during narration */}
        <AnimatePresence>
          {sennHere && !flags.sennWatch && beat?.k === "n" && !overlay && (
            <motion.div
              className="pointer-events-none absolute bottom-28 right-5 z-30 hidden sm:bottom-32 sm:right-8 md:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 0.95, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <SennAvatar size={64} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* senn's grand entrance — unfolding out of the static */}
        <AnimatePresence>
          {sennBurst && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.5, transition: { duration: 0.5 } }}
            >
              <motion.div
                className="absolute h-72 w-72 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(127,245,201,0.18), transparent 65%)" }}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.4, 1] }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.div
                className="absolute h-52 w-52 rounded-full border border-emerald-200/40"
                initial={{ scale: 0.2, opacity: 0.9 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ delay: 0.3, duration: 1.4, ease: "easeOut" }}
              />
              <SennAvatar arriving size={170} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* graft cast flourish over the drawer */}
        <AnimatePresence>{castOn && <GraftCast x={38} y={69} />}</AnimatePresence>

        {/* branch transition glitch */}
        <AnimatePresence>
          {transitioning && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StaticNoise className="absolute inset-0 h-full w-full" opacity={0.55} />
              <div className="glitching absolute inset-0 bg-emerald-200/[0.05]" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-emerald-200/60 blur-[2px]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* flashes */}
        <AnimatePresence>
          {flash && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-[61]"
              style={{
                background:
                  flash === "white" || flash === "tear"
                    ? "#ffffff"
                    : flash === "cold"
                      ? "linear-gradient(180deg, rgba(215,236,255,0.95), rgba(180,215,255,0.9))"
                      : "radial-gradient(ellipse at 50% 55%, rgba(200,255,230,0.5), rgba(127,245,201,0.18) 45%, transparent 75%)",
              }}
              initial={{ opacity: flash === "tear" ? 1 : 0 }}
              animate={{ opacity: flash === "white" ? [0, 1, 0] : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: flash === "white" ? 0.55 : flash === "tear" ? 0.05 : 0.35 }}
            />
          )}
        </AnimatePresence>

        {/* act-out fade — black, or white for hope, or grey for what's left */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[27]"
          style={{ background: fadeTone }}
          animate={{ opacity: fadeBlack ? 1 : 0 }}
          transition={{ duration: fadeTone === "#000000" ? 2.2 : 5.5 }}
        />

        {/* graft overlay (reserved for later acts) */}
        <AnimatePresence>
          {overlay === "graft" && <GraftGame onComplete={onGraftComplete} onFail={onGraftFail} />}
        </AnimatePresence>

        {/* act ii — the loop's combat */}
        <AnimatePresence>
          {overlay === "combat" && <CombatLoop onCleared={closeOverlayAdvance} />}
        </AnimatePresence>

        {/* act ii — pruning the frost-curse heart */}
        <AnimatePresence>
          {overlay === "prune" && <PruneCharge onSuccess={closeOverlayAdvance} />}
        </AnimatePresence>

        {/* act iv — reconstructing veyr's archive */}
        <AnimatePresence>
          {overlay === "docs" && <DocPuzzle onSolved={closeOverlayAdvance} />}
        </AnimatePresence>

        {/* act iv — the invariant, explained to the player */}
        <AnimatePresence>
          {overlay === "diagram" && <InvariantDiagram onClose={closeOverlayAdvance} />}
        </AnimatePresence>

        {/* act v — find the flaw in the reflection */}
        <AnimatePresence>
          {overlay === "spot" && <MirrorPool onFound={closeOverlayAdvance} />}
        </AnimatePresence>

        {/* act vi — the same craft, no tutorial */}
        <AnimatePresence>
          {overlay === "graftQuiet" && <QuietGraft onDone={closeOverlayAdvance} />}
        </AnimatePresence>

        {/* act vi — what the drawer was holding */}
        <AnimatePresence>
          {overlay === "memory" && <MemoryPlayback onDone={closeOverlayAdvance} />}
        </AnimatePresence>

        {/* act vii — the frost-curse heart, properly */}
        <AnimatePresence>
          {overlay === "boss" && <BossFight onWin={closeOverlayAdvance} />}
        </AnimatePresence>

        {/* act ix — the grieving father */}
        <AnimatePresence>
          {overlay === "veyrFight" && <VeyrFight onWin={closeOverlayAdvance} />}
        </AnimatePresence>

        {/* act ix — the point of the whole game */}
        <AnimatePresence>
          {overlay === "truth" && <TheTruth onDone={closeOverlayAdvance} />}
        </AnimatePresence>

        {/* act viii — the inscription at the base */}
        <AnimatePresence>
          {overlay === "carving" && beat?.k === "carving" && (
            <Carving lines={beat.lines} onDone={closeOverlayAdvance} />
          )}
        </AnimatePresence>

        {/* act x — the confirming action */}
        <AnimatePresence>
          {beat?.k === "act" && !overlay && (
            <motion.button
              className="absolute z-30"
              style={{ left: `${beat.rect[0]}%`, top: `${beat.rect[1]}%`, width: `${beat.rect[2]}%`, height: `${beat.rect[3]}%` }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4 }}
              onClick={(e) => {
                e.stopPropagation();
                audio.bloom();
                insertThen(beat.then);
              }}
            >
              <motion.span
                className="absolute inset-0 rounded-2xl border border-emerald-200/40"
                style={{ background: "radial-gradient(ellipse, rgba(127,245,201,0.12), transparent 72%)" }}
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 2.8, repeat: Infinity }}
              />
              <span className="absolute left-1/2 top-full flex -translate-x-1/2 translate-y-3 flex-col items-center gap-1 whitespace-nowrap">
                <span className="font-term rounded-md border border-emerald-200/40 bg-[#060a0e]/90 px-4 py-2 text-[11px] tracking-[0.35em] text-emerald-100">
                  {beat.label}
                </span>
                {beat.sub && <span className="font-term text-[9px] tracking-[0.25em] text-white/35">{beat.sub}</span>}
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* act viii — fragments to find, and one way onward */}
        <AnimatePresence>
          {beat?.k === "explore" && !overlay && (
            <ExploreLayer
              finds={beat.finds}
              exit={beat.exit}
              onFind={() => setCoherence((c) => clampCoh(c + 2))}
              onExit={() => insertThen(beat.exit.then)}
            />
          )}
        </AnimatePresence>

        {/* toasts */}
        <div className="pointer-events-none absolute right-3 top-3 z-[70] flex flex-col items-end gap-2">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                className="glass-panel flex items-center gap-2.5 rounded-lg px-3.5 py-2"
                initial={{ opacity: 0, x: 30, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "spring", stiffness: 240, damping: 22 }}
              >
                {t.kind === "codex" && <BookOpen size={12} className="text-amber-200/90" />}
                {t.kind === "coh" &&
                  (t.text.startsWith("−") || t.text.startsWith("-") ? (
                    <Minus size={12} className="text-red-400" />
                  ) : (
                    <Plus size={12} className="text-emerald-300" />
                  ))}
                {t.kind === "info" && <Radio size={12} className="text-emerald-300/80" />}
                <div>
                  <p className="font-term text-[10px] tracking-[0.2em] text-white/85">{t.text}</p>
                  {t.sub && <p className="font-term text-[9px] tracking-[0.14em] text-white/35">{t.sub}</p>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
