import { useCallback, useEffect, useRef, useState } from "react";
import type { MetaSave, RunSave, RunStats } from "./game/types";
import { META_KEY, RUN_KEY } from "./game/types";
import { CODEX } from "./game/codex";
import { audio } from "./game/audio";
import TitleScreen from "./components/TitleScreen";
import GameShell from "./components/GameShell";
import EndOfAct from "./components/EndOfAct";
import CodexPanel from "./components/CodexPanel";

/* ------------------------------------------------------------------ */
/*  TABLOOM: The Last Mind of Aevum                                    */
/*  title → run → end · persistent meta (codex / completion / mute)    */
/* ------------------------------------------------------------------ */

type Phase = "title" | "play" | "end";

const FRESH_RUN: RunSave = {
  sceneIdx: 0,
  coherence: 64,
  tabs: ["void"],
  branch: "void",
  flags: {},
  grafted: false,
};

function loadMeta(): MetaSave {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (raw)
      return {
        codex: [],
        act1Complete: false,
        act2Complete: false,
        act3Complete: false,
        act4Complete: false,
        act5Complete: false,
        act6Complete: false,
        act7Complete: false,
        act8Complete: false,
        act9Complete: false,
        endings: [],
        muted: false,
        ...JSON.parse(raw),
      };
  } catch {
    /* ignore */
  }
  return {
    codex: [],
    act1Complete: false,
    act2Complete: false,
    act3Complete: false,
    act4Complete: false,
    act5Complete: false,
    act6Complete: false,
    act7Complete: false,
    act8Complete: false,
    act9Complete: false,
    endings: [],
    muted: false,
  };
}

function loadRun(): RunSave | null {
  try {
    const raw = localStorage.getItem(RUN_KEY);
    if (raw) return { ...FRESH_RUN, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return null;
}

export default function App() {
  const [phase, setPhase] = useState<Phase>("title");
  const [meta, setMeta] = useState<MetaSave>(loadMeta);
  const [run, setRun] = useState<RunSave | null>(null);
  const [hasSave, setHasSave] = useState<boolean>(() => loadRun() !== null);
  const [codexOpen, setCodexOpen] = useState(false);
  const [endStats, setEndStats] = useState<RunStats | null>(null);
  const endCodexCount = useRef(0);

  /* persist meta */
  useEffect(() => {
    try {
      localStorage.setItem(META_KEY, JSON.stringify(meta));
    } catch {
      /* ignore */
    }
  }, [meta]);

  /* reflect mute into engine */
  useEffect(() => {
    audio.setMuted(meta.muted);
  }, [meta.muted]);

  const unlockCodex = useCallback((id: string): boolean => {
    let fresh = false;
    setMeta((m) => {
      if (m.codex.includes(id)) return m;
      fresh = true;
      return { ...m, codex: [...m.codex, id] };
    });
    return fresh;
  }, []);

  const toggleMute = useCallback(() => {
    setMeta((m) => ({ ...m, muted: !m.muted }));
  }, []);

  const recordEnding = useCallback((id: string) => {
    setMeta((m) => (m.endings.includes(id) ? m : { ...m, endings: [...m.endings, id] }));
  }, []);

  const begin = useCallback(() => {
    try {
      localStorage.removeItem(RUN_KEY);
    } catch {
      /* ignore */
    }
    setRun({ ...FRESH_RUN });
    setPhase("play");
  }, []);

  const continueRun = useCallback(() => {
    const save = loadRun();
    setRun(save ?? { ...FRESH_RUN });
    setPhase("play");
  }, []);

  const onEnd = useCallback((stats: RunStats) => {
    setMeta((m) => {
      endCodexCount.current = m.codex.length;
      return {
        ...m,
        act1Complete: true,
        act2Complete: true,
        act3Complete: true,
        act4Complete: true,
        act5Complete: true,
        act6Complete: true,
        act7Complete: true,
        act8Complete: true,
        act9Complete: true,
      };
    });
    try {
      localStorage.removeItem(RUN_KEY);
    } catch {
      /* ignore */
    }
    setHasSave(false);
    setEndStats({ ...stats, codexCount: meta.codex.length });
    setPhase("end");
  }, [meta.codex.length]);

  const onExit = useCallback(() => {
    setHasSave(loadRun() !== null);
    setPhase("title");
  }, []);

  return (
    <div className="h-full overflow-hidden bg-[#05070a] text-[#e8ecef]">
      {phase === "title" && (
        <TitleScreen
          hasSave={hasSave}
          completed={
            meta.act9Complete
              ? 9
              : meta.act8Complete
                ? 8
                : meta.act7Complete
                ? 7
                : meta.act6Complete
                ? 6
                : meta.act5Complete
                  ? 5
                  : meta.act4Complete
                    ? 4
                    : meta.act3Complete
                      ? 3
                      : meta.act2Complete
                        ? 2
                        : meta.act1Complete
                          ? 1
                          : 0
          }
          onBegin={begin}
          onContinue={continueRun}
          onOpenCodex={() => setCodexOpen(true)}
        />
      )}

      {phase === "play" && run && (
        <GameShell
          initial={run}
          muted={meta.muted}
          onToggleMute={toggleMute}
          unlockCodex={unlockCodex}
          onOpenCodex={() => setCodexOpen(true)}
          onEnd={onEnd}
          onExit={onExit}
          onReplayAll={begin}
          onEnding={recordEnding}
        />
      )}

      {phase === "end" && endStats && (
        <EndOfAct
          act={9}
          completedActs={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
          stats={{ ...endStats, codexCount: endCodexCount.current || endStats.codexCount }}
          codexCount={endCodexCount.current || meta.codex.length}
          codexTotal={CODEX.length}
          onReplay={begin}
          onTitle={() => setPhase("title")}
          onOpenCodex={() => setCodexOpen(true)}
        />
      )}

      <CodexPanel open={codexOpen} unlocked={meta.codex} onClose={() => setCodexOpen(false)} />
    </div>
  );
}
