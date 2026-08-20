/* ------------------------------------------------------------------ */
/*  TABLOOM — ACT I script                                             */
/*  "Ash and Rain" (Nara-0)                                            */
/*  Visual-novel / point-and-click flow — layered 2D assets, hotspots, */
/*  tab-shift tutorials, and the lamp→gate ripple lesson.              */
/* ------------------------------------------------------------------ */

import type { Beat, FxId, Scene, Speaker } from "./types";

/* small beat helpers */
const n = (text: string): Beat => ({ k: "n", text });
const d = (who: Speaker, text: string, omit?: string): Beat => ({ k: "d", who, text, omit });
const fx = (f: FxId, autoMs?: number): Beat => ({ k: "fx", fx: f, autoMs });
const codex = (id: string): Beat => ({ k: "codex", id });
const set = (flag: string, value: boolean | string | number = true): Beat => ({ k: "set", flag, value });

/* ============================ SCENES ============================ */

export const SCENES: Scene[] = [
  /* ------------------------- 0 · PROLOGUE ------------------------- */
  {
    id: "prologue",
    branch: "void",
    title: "aevum://prologue",
    meta: { url: "aevum://prologue", tag: "what the reader should know" },
    beats: [
      { k: "card", kicker: "TABLOOM", text: "Somewhere beneath every branch of every reality, there is a tree that is not a metaphor.", style: "lit" },
      { k: "card", text: "It does not represent the multiverse. It is the medium the multiverse thinks in — the way a brain is not a symbol for a mind, but the meat it happens inside of.", style: "lit" },
      { k: "card", text: "Its name is AEVUM.", style: "big" },
      codex("aevum"),
      { k: "card", kicker: "ONCE", text: "A single consciousness held every branch steady at once. The branches called it the Witness Mind.", style: "lit", viz: "branches" },
      codex("witness"),
      { k: "card", text: "Fifteen branches, once.", style: "big", viz: "branches" },
      { k: "card", text: "Ten are dead now.", style: "big", viz: "branchesDead" },
      codex("rootbelow"),
      { k: "card", text: "The Witness Mind was not defeated by an army. It was cut.", style: "lit" },
      { k: "card", text: "Not by a god. Not by a monster. By a grieving father, holding a blade made from the one fact his daughter's death never changed — no matter which reality he searched.", style: "lit" },
      { k: "card", text: "The blade is called the Nullroot.", style: "big" },
      codex("veyr"),
      codex("nullroot"),
      { k: "card", text: "The man is Veyr Sol Auric.", style: "big" },
      { k: "card", text: "This is where his story and Ari's story become the same story — though neither of them will understand that until it is almost too late to matter.", style: "lit" },
      { k: "card", kicker: "ACT I", text: "ASH AND RAIN", sub: "nara-0 · fifteen shadows, one body", style: "big" },
    ],
  },

  /* --------------- 1 · SCREEN ONE — APARTMENT, WAKING WRONG --------------- */
  {
    id: "nara-wake",
    branch: "nara",
    title: "NARA-0.branch",
    meta: { url: "aevum://nara-0/apartment", tag: "rain · night", clock: "23:47" },
    beats: [
      codex("nara"),
      set("ariPose", "lying"),
      set("aspect", "archivist"),
      n("Rain against glass."),
      n("Nara-0. A grey city, a grey apartment — ordinary in the specific way that makes ordinary things feel like a held breath."),
      codex("ari"),
      n("Ari Vaan wakes wrong. Not injured — wrong, the way a word feels wrong after you've said it forty times in a row."),
      set("ariPose", "sitting"),
      n("He sits up. Somewhere in his chest, an echo sits up with him."),
      fx("shadowsOn", 2600),
      n("The wall across from his bed is doing something walls don't do."),
      n("It is holding fifteen shadows. Cast by nothing. None of them quite matching the one body sitting in the bed."),
      n("Fifteen shadows. One body."),
      fx("terminalOn", 800),
      {
        k: "hotspot",
        id: "terminal",
        label: "TERMINAL",
        sub: "it booted itself",
        rect: [38, 42, 12, 18],
        then: [
          {
            k: "t",
            title: "WITNESS PROTOCOL",
            lines: [
              "WITNESS PROTOCOL v15.0.1",
              "handshake ......... FAILED (crown missing)",
              "branch integrity .. 5/15",
              "",
              "IF YOU ARE READING THIS, YOU ARE NOT THE FIRST ARI.",
              "DO NOT OPEN THE OTHER WORLDS.",
            ],
          },
          n("The message sits there, patient as a knife."),
        ],
      },
      {
        k: "choice",
        prompt: "“Do not open the other worlds.”",
        options: [
          {
            label: "Open the other world",
            sub: "there was never another way this ends",
            then: [],
          },
        ],
      },
      n("Not out of bravery. Out of the specific helplessness of a person told not to touch the one thing now impossible to ignore."),
      fx("whiteFlash", 800),
      fx("openTabKarth", 1000),
      fx("tabBarOn", 1500),
      {
        k: "awaitTab",
        branch: "karth",
        text: "Click a tab to shift your mind into that reality.",
      },
    ],
  },

  /* --------------- 2 · SCREEN FOUR — CROSS-FADE TO KARTH-MUUN --------------- */
  {
    id: "karth-wake",
    branch: "karth",
    title: "KARTH-MUUN.branch",
    meta: { url: "aevum://karth-muun/the-long-ice", tag: "snow · aurora", clock: "--:--" },
    beats: [
      codex("karth"),
      set("aspect", "oathblade"),
      set("ariPose", "standing"),
      set("ariSpot", "karth"),
      n("The cold arrives first — a fact before a place."),
      n("Karth-Muun. A battlefield, frozen mid-argument. Ice over the banners, ice over the spears, ice over the reasons."),
      n("And on the ice — a second Ari, waking. His own fifteen shadows fall wrong across it, pointing at a sun that is not in the sky anymore."),
      { k: "echo", text: "I remember dying." },
      n("He didn't. That is the thing worth holding still for: neither of them did."),
      {
        k: "t",
        title: "WITNESS PROTOCOL",
        lines: [
          "[memory fragment not found]",
          "[origin: ████████ — WITNESS]",
          "[do not stitch]",
        ],
      },
      {
        k: "awaitTab",
        branch: "karth",
        text: "Stay. Something is unfolding between the tabs.",
      },
    ],
  },

  /* --------------- 3 · SCREEN FIVE — SENN, BETWEEN THE TABS --------------- */
  {
    id: "between-tabs",
    branch: "karth",
    title: "between.tabs",
    meta: { url: "aevum://between-tabs", tag: "static · root-light", clock: "?" },
    beats: [
      fx("staticUp", 700),
      fx("sennArrive", 2400),
      codex("senn"),
      d("senn", "Easy now. Breathe. You're awake in two places at once — that's the whole emergency, and also the proof you're still you."),
      d("senn", "Name's Senn. I grow in the space between pages. Between… tabs, I suppose you'd say."),
      d("ari", "That's not an explanation. That's a brochure."),
      d("senn", "Good. You joke when you're frightened. Hold onto that — it's the most load-bearing thing about you."),
      d("senn", "Here is the shape of it. The realities are collapsing. The mind that held them apart is shattered. A man named Veyr wants to finish the collapse — on purpose."),
      d("senn", "But tonight you learn one small mercy before any of that can matter. Watch your hands — they will remember before you do."),
      fx("staticDown", 700),
      codex("grafting"),
      { k: "unlock", title: "ROOT-CRAFT · GRAFTING", sub: "to knit instead of cut" },
      {
        k: "awaitTab",
        branch: "nara",
        text: "Back to your room, little echo. Follow the light home. — Senn",
      },
    ],
  },

  /* --------------- 4 · SCREEN SIX — THE MEMORY-LOCK --------------- */
  {
    id: "the-lock",
    branch: "nara",
    title: "NARA-0.branch",
    meta: { url: "aevum://nara-0/apartment", tag: "rain · the lock in the drawer", clock: "00:31" },
    beats: [
      set("ariPose", "standing"),
      set("ariSpot", "desk"),
      d("senn", "Your desk keeps secrets. The left drawer in particular — it hums, doesn't it? Doors keep their dead. Drawers keep their locks."),
      d("senn", "That is a memory-lock, bound in root-vine. Take the threads, Ari. Knit — don't cut."),
      {
        k: "hotspot",
        id: "drawer",
        label: "DRAWER",
        sub: "bound in root-vines",
        rect: [31, 62, 14, 14],
        then: [
          fx("graftCast", 2200),
          n("Teal and gold. His hands move before he tells them to — the thread finds the seam, the seam finds the thread."),
          set("drawerCracked"),
          n("A crack. Hairline. And then the weave slips, the threads let go all at once, like a held breath deciding not to be held."),
          n("“Not yet. Something's missing.” — the lock declines, politely, like a door on a chain."),
          d("ari", "It talked back?"),
          d("senn", "It declined. There's a difference. Whatever this lock wants grafted back, you don't have it yet. You will. Not tonight."),
          d("senn", "Keep looking, Ari."),
          d("senn", "You may be surprised."),
        ],
      },
    ],
  },

  /* --------------- 5 · SCREEN SEVEN — THE RIPPLE --------------- */
  {
    id: "the-ripple",
    branch: "nara",
    title: "NARA-0.branch",
    meta: { url: "aevum://nara-0/apartment", tag: "rain · a light answers", clock: "00:58" },
    beats: [
      d("senn", "One more thing before sleep finds you. See the lamp?"),
      n("“Every light you light answers somewhere,” Senn says. “The worlds are one tree, little echo. Shake a leaf here —”"),
      {
        k: "hotspot",
        id: "lamp",
        label: "LAMP",
        sub: "currently off, currently everywhere",
        rect: [56, 38, 9, 24],
        then: [
          set("lampOn"),
          set("tabGlow", "karth"),
          set("gateWarm"),
          fx("chimeLamp", 600),
          n("A small sun, rented from the grid."),
          n("And on the tab above — a glow where no glow was."),
        ],
      },
      {
        k: "awaitTab",
        branch: "karth",
        text: "Something answered. Check the other world.",
      },
      n("Karth-Muun. The gate in the glacier — ice for a hundred years, older than the war it watched."),
      n("A seam of warm light, thin as a rumor, runs down its middle like the first sentence of spring."),
      n("Somewhere, something answered."),
      fx("fadeBlack", 2600),
      { k: "card", kicker: "ACT I", text: "ASH AND RAIN", sub: "end — the static holds its breath for act ii", style: "big" },
    ],
  },
];

export const ACT_I_TITLE = "ASH AND RAIN";
export const ACT_I_SUB = "nara-0 · fifteen shadows, one body";
