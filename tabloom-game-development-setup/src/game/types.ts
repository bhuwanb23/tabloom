/* ------------------------------------------------------------------ */
/*  TABLOOM — narrative engine types                                   */
/* ------------------------------------------------------------------ */

export type BranchId = "nara" | "karth" | "void";

export type Speaker = "ari" | "ari2" | "senn" | "terminal" | "veyr" | "kael" | "soldier";

export type FxId =
  | "shadowsOn"
  | "terminalOn"
  | "terminalOff"
  | "openTabKarth"
  | "shake"
  | "glitch"
  | "sennArrive"
  | "sennLeave"
  | "night"
  | "bloomFlash"
  | "staticUp"
  | "staticDown"
  | "whiteFlash"
  | "tabBarOn"
  | "graftCast"
  | "fadeBlack"
  | "chimeLamp"
  | "coldFlash"
  | "duck"
  | "unduck";

export interface Option {
  label: string;
  sub?: string;
  then: Beat[];
}

export type Beat =
  | {
      k: "card";
      text: string;
      sub?: string;
      kicker?: string;
      style?: "lit" | "term" | "big";
      viz?: "branches" | "branchesDead";
    }
  | { k: "n"; text: string }
  | { k: "d"; who: Speaker; text: string; omit?: string }
  | { k: "t"; title?: string; lines: string[] }
  | { k: "choice"; prompt?: string; options: Option[] }
  | { k: "fx"; fx: FxId; autoMs?: number }
  | { k: "simul"; text: string }
  | { k: "graft"; pairs: number }
  | {
      k: "sleepTab";
      prompt?: string;
      options: { branch: BranchId; label: string; sub: string; then: Beat[] }[];
    }
  | { k: "codex"; id: string }
  | { k: "coh"; d: number; silent?: boolean }
  | { k: "setTab"; branch: BranchId }
  | { k: "set"; flag: string; value: boolean | string | number }
  | {
      k: "hotspot";
      id: string;
      label: string;
      sub?: string;
      rect: [number, number, number, number]; // x%, y%, w%, h%
      then: Beat[];
    }
  | { k: "echo"; text: string }
  | { k: "awaitTab"; branch: BranchId; text: string }
  | { k: "unlock"; title: string; sub: string }
  | { k: "combat"; wave: number }
  | { k: "prune"; target: string };

export interface SceneMeta {
  url: string;
  tag: string;
  clock?: string;
}

export interface Scene {
  id: string;
  branch: BranchId;
  title: string;
  meta: SceneMeta;
  beats: Beat[];
}

export interface CodexEntry {
  id: string;
  cat: "people" | "places" | "things";
  title: string;
  kicker: string;
  body: string;
}

export interface RunSave {
  sceneIdx: number;
  coherence: number;
  tabs: BranchId[];
  branch: BranchId;
  flags: Record<string, boolean | string | number>;
  grafted: boolean;
}

export interface MetaSave {
  codex: string[];
  act1Complete: boolean;
  act2Complete: boolean;
  muted: boolean;
}

export interface RunStats {
  coherence: number;
  codexCount: number;
  grafted: boolean;
  sleepBranch: BranchId | null;
}

export const RUN_KEY = "tabloom-save-v1";
export const META_KEY = "tabloom-meta-v1";
