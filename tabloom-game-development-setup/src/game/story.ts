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
      { k: "card", kicker: "ACT I", text: "ASH AND RAIN", sub: "complete · act ii — the man who chose well", style: "big" },
    ],
  },

  /* ===================== ACT II — THE MAN WHO CHOSE WELL ===================== */

  /* --------------- 6 · THE LOOP, MID-ARGUMENT --------------- */
  {
    id: "act2-field",
    branch: "karth",
    title: "KARTH-MUUN.branch",
    meta: { url: "aevum://karth-muun/the-long-ice", tag: "snow · the loop", clock: "--:--" },
    beats: [
      { k: "card", kicker: "ACT II", text: "THE MAN WHO CHOSE WELL", sub: "karth-muun · the loop, mid-argument", style: "big" },
      set("tabLock", "nara"),
      set("aspect", "oathblade"),
      set("ariPose", "standing"),
      set("ariSpot", "karthFar"),
      n("The loop has no sky, only a ceiling of moving light. Beneath it, the war holds its breath for the hundredth year."),
      n("Ari stands small in the frame of it — one shadow among fifteen, on an ocean of ice that remembers every boot."),
      n("The Nara-0 tab hangs grey and sealed above. Whatever this is, it wants him alone in it."),
      n("Then the field notices him. Hoofbeats of frost on the wind — the loop's keepers, waking for him again."),
      { k: "combat", wave: 3 },
      n("The last husk folds like a letter nobody wrote."),
      n("It resets. Not you. Just — everything else."),
      n("Somewhere a clock clears its throat and starts the same sentence over. Ari keeps the bruises. The field keeps everything back."),
    ],
  },

  /* --------------- 7 · KAEL ORIN, AND THE OTHER HAND --------------- */
  {
    id: "act2-kael",
    branch: "karth",
    title: "KARTH-MUUN.branch",
    meta: { url: "aevum://karth-muun/the-long-ice", tag: "the man who chose well", clock: "--:--" },
    beats: [
      set("kaelHere"),
      set("miraelHere"),
      set("ariSpot", "karth"),
      codex("kael"),
      n("Out of the reset's white, a man walks in — unhurried, unhurtable, like punctuation that refuses the sentence."),
      d("kael", "You kept your hands. Most arrivals lose those by the second reset."),
      d("ari", "You know what I am."),
      d("kael", "A fellow haunting. Kael Orin — I've died on this field more honestly than most men live. And yes, before you ask: I knew the you that belonged here. He owed me money."),
      d("ari", "Did I — did he pay?"),
      d("kael", "He died well instead. That's legal tender in Karth-Muun."),
      n("At the far edge of the field, by the frozen banners, a distant figure watches the loop as if it's about to move."),
      codex("mirael"),
      d("kael", "Mirael. Different branch, same gravity. And before you start making shapes out of it — she was never a prize between us. Not between me and the other Ari. Not between you and whatever you think you're owed. People aren't wagers, boy."),
      d("ari", "…Noted."),
      d("kael", "Good. Now — the fist holding this loop shut sits under the ice behind me. Time you learned the other hand of root-craft, before the garden eats you."),
      {
        k: "hotspot",
        id: "chamberGate",
        label: "HEART CHAMBER",
        sub: "the ice beats here",
        rect: [45, 26, 11, 18],
        then: [
          set("chamber"),
          fx("coldFlash", 900),
          n("Inside the glacier's throat hangs a heart that should not still be beating — black ice, red veins, a frost that bites upward into the weather of the whole branch."),
          codex("curseheart"),
          d("kael", "The Frost-Curse Heart. It holds the loop shut like a fist. Reach it wrong and it frosts you hollow."),
          codex("pruning"),
          d("kael", "Pruning is the other hand of everything your little gardener taught you. Where grafting knits, pruning cuts — one true line, nothing extra. It is not murder, Ari. It is mercy with sharp edges."),
          { k: "prune", target: "heart" },
          set("heartCracked"),
          set("thawed"),
          fx("shake", 500),
          n("Red-black motes scatter like startled crows. The heart… blinks. A seam wider than before runs down its middle, weeping warm dark."),
          d("kael", "Good. You cut to heal — that's the whole trade. Feel how the field exhales?"),
        ],
      },
    ],
  },

  /* --------------- 8 · THE THAW CORNER — THE DYING SOLDIER --------------- */
  {
    id: "act2-soldier",
    branch: "karth",
    title: "KARTH-MUUN.branch",
    meta: { url: "aevum://karth-muun/the-thaw-corner", tag: "where the ice lets go", clock: "--:--" },
    beats: [
      set("chamber", false),
      set("intimate"),
      set("soldierHere"),
      n("Outside, beyond the chamber mouth, one corner of the frozen field is no longer frozen. Water. Steam. Two green shoots, stupid with hope."),
      n("They find the soldier where the thaw begins — half in the ice, half out of time."),
      d("soldier", "…Back again, oathblade? You always come back at the end."),
      d("ari", "Do I know you?"),
      d("soldier", "Every turn, you ask. Every turn it lands the same. Yeah. You knew me."),
      d("ari", "Do I make it? In the other turns?"),
      d("soldier", "Sometimes you win the field and lose the point. Listen — whoever's been guiding your hands. The warm little voice in the spaces between…"),
      n("A cough takes him. Red on the ice, gone under the snowmelt."),
      d("soldier", "Careful who tells you what you want to hear, Ari. Kind voices keep the sharpest gardens."),
      n("The question Ari wants to ask never finishes forming."),
      set("soldierGone"),
      fx("duck", 3400),
      n("The frost finishes first. It always asks less of you than the living do."),
      fx("unduck", 100),
      fx("fadeBlack", 2400),
      set("tabLock", ""),
      { k: "card", kicker: "ACT II", text: "THE MAN WHO CHOSE WELL", sub: "complete · above, the nara-0 tab rekindles", style: "big" },
    ],
  },

  /* ===================== ACT III — A GLIMPSE, UNINVITED ===================== */

  /* --------------- 9 · THE INTRUSION (no transition, no chrome, no tabs) --------------- */
  {
    id: "act3-vision",
    branch: "karth",
    title: "—",
    meta: { url: "▓▓▓▓://root-below/▓▓▓▓", tag: "you did not open this" },
    beats: [
      /* hard cut — everything the player had is taken in one frame */
      set("tabHide"),
      set("rootBelow"),
      set("intimate", false),
      set("soldierHere", false),
      set("kaelHere", false),
      set("miraelHere", false),
      { k: "hold", ms: 2600 },
      { k: "vision", text: "Something opens its eye somewhere underneath everything." },
      { k: "vision", text: "This is not a dream. Dreams are yours." },
      { k: "vision", text: "THE ROOT BELOW", size: "huge" },
      codex("vision"),
      { k: "vision", text: "Ten branches came down here to rot. They are not finished doing it." },
      { k: "vision", text: "The dark is not empty. The dark is occupied." },
      /* the body he is not allowed to approach */
      set("deadAri"),
      codex("deadari"),
      { k: "hold", ms: 3600 },
      { k: "vision", text: "Someone is already lying where you are standing." },
      { k: "vision", text: "He is wearing your face. He is wearing it badly." },
      { k: "hold", ms: 3800 },
      /* the tear — harder and shorter than act i's flash */
      fx("tear", 700),
    ],
  },

  /* --------------- 10 · WAKING --------------- */
  {
    id: "act3-waking",
    branch: "karth",
    title: "KARTH-MUUN.branch",
    meta: { url: "aevum://karth-muun/the-thaw-corner", tag: "back · heart going too fast", clock: "--:--" },
    beats: [
      set("rootBelow", false),
      set("deadAri", false),
      set("intimate"),
      set("ariSpot", "karth"),
      fx("startle", 900),
      n("The ice comes back all at once — cold, ordinary, blessedly solid. His own breath, too loud. His own hands, still his."),
      fx("sennArrive", 2200),
      d("ari", "What was that? Senn — what was that place? There was a body. It had my—"),
      d("senn", "Nothing that's happened yet."),
      d("ari", "That's not an answer."),
      d("senn", "No. It's a kindness. There's a difference, and tonight you don't get to know which one I'm handing you."),
      d("senn", "Rest, Ari.", "rest before you ask me the question i cannot survive answering"),
      n("Somewhere far under the ice, ten dead branches keep rotting, patiently, in a place he was never supposed to see this early."),
      set("tabHide", false),
      fx("fadeBlack", 2600),
      { k: "card", kicker: "ACT III", text: "A GLIMPSE, UNINVITED", sub: "complete · the tab bar returns", style: "big" },
    ],
  },

  /* ===================== ACT IV — THE FATHER WHO CATALOGUED A DEATH ===================== */

  /* --------------- 11 · ARRIVAL — THE GRAND WARD --------------- */
  {
    id: "act4-ward",
    branch: "ora",
    title: "ORA-VELL.branch",
    meta: { url: "aevum://ora-vell/ward-of-saint-vellum", tag: "gold light · recovering", clock: "14:20" },
    beats: [
      { k: "card", kicker: "ACT IV", text: "THE FATHER WHO CATALOGUED A DEATH", sub: "ora-vell · the branch that could afford to try", style: "big" },
      set("intimate", false),
      set("archive", false),
      set("weight", false),
      set("aspect", "patient"),
      codex("oravell"),
      n("A third tab surfaces on its own — gold-lit, unhurried, obscenely well-funded."),
      n("Ora-Vell. Vaulted ribs of gilt, windows tall enough to embarrass a cathedral, marble that has never once been asked to hold a war."),
      n("Ari wakes here thinner than he arrived. The ward is the finest in any reality; it is also, somehow, the loneliest room he has ever stood in."),
      n("A hundred beds. Every one of them empty, made, waiting. As if the whole branch were holding a place for someone who never came back."),
      d("senn", "Careful. You're mending, and mending is slower than you'd like. Walk gently here."),
      d("ari", "Why this branch?"),
      d("senn", "Because this is where he lost her. And because a man who catalogues his grief always leaves the catalogue where someone can find it."),
      {
        k: "hotspot",
        id: "archiveDoor",
        label: "THE ARCHIVE",
        sub: "a door nobody has locked in years",
        rect: [66, 34, 12, 22],
        then: [
          set("archive"),
          n("Down a corridor of gold, one door has no gold on it at all."),
          n("Veyr Sol Auric's archive: filing drawers to the ceiling, red thread strung wall to wall, and a desk arranged with the terrible neatness of a man who has nothing left to do but sort."),
        ],
      },
    ],
  },

  /* --------------- 12 · THE RECONSTRUCTION --------------- */
  {
    id: "act4-archive",
    branch: "ora",
    title: "ORA-VELL.branch",
    meta: { url: "aevum://ora-vell/veyr-archive", tag: "lamp · red thread", clock: "15:47" },
    beats: [
      codex("veyr"),
      d("senn", "He kept everything. Every branch, every attempt, every bill. What he never did — not once — was read it all in a row."),
      d("ari", "Why not?"),
      d("senn", "Because a man can survive fifteen tragedies. Nobody survives noticing they were the same one."),
      n("The files are scattered across the desk, out of sequence. Somewhere in their order is the sentence that ended a universe."),
      { k: "docs" },
      codex("liora"),
      /* the reveal — real, not a vision */
      set("weight"),
      { k: "reveal", text: "Fifteen deaths.", size: "huge" },
      { k: "reveal", text: "Not fifteen different griefs — one grief wearing fifteen coats." },
      { k: "reveal", text: "He checked every world for a version where his daughter lived. Every world handed him the same date." },
      { k: "reveal", text: "So he stopped asking reality for mercy, and started asking it for a reason." },
      { k: "reveal", text: "It did not have one." },
      d("ari", "…He wasn't mad when he started."),
      d("senn", "No. He was thorough. That's so much worse, Ari. Madness burns out. Thoroughness files everything and comes back in the morning."),
      n("On the desk, beneath the last page, something small and hard catches the lamp — a relic, worn smooth by a thumb that held it for years."),
    ],
  },

  /* --------------- 13 · THE INVARIANT --------------- */
  {
    id: "act4-invariant",
    branch: "ora",
    title: "ORA-VELL.branch",
    meta: { url: "aevum://ora-vell/veyr-archive", tag: "the point that will not move", clock: "16:12" },
    beats: [
      {
        k: "hotspot",
        id: "relic",
        label: "THE RELIC",
        sub: "worn smooth by one thumb",
        rect: [47, 58, 9, 12],
        then: [
          codex("invariant"),
          { k: "diagram" },
          d("senn", "That is what he found. That is the whole engine of him."),
          d("ari", "One point that stays the same in every world."),
          d("senn", "And he read it as a verdict. As if the universe had bothered to sentence him personally."),
          d("ari", "What is it really?"),
          d("senn", "A hinge, little echo. The only thing that holds still in every world is the only thing you can hang a door on. Remember that — I mean it more than I usually mean things."),
          n("Ari puts the relic down exactly where it was. It seems important not to move it."),
          n("Behind him, fifteen files lie in order for the first time since they were written. The archive is very quiet, in the way of rooms that have finally been understood."),
        ],
      },
      fx("fadeBlack", 2600),
      { k: "card", kicker: "ACT IV", text: "THE FATHER WHO CATALOGUED A DEATH", sub: "complete · you know what he knows now", style: "big" },
    ],
  },
];

export const ACT_I_TITLE = "ASH AND RAIN";
export const ACT_I_SUB = "nara-0 · fifteen shadows, one body";
