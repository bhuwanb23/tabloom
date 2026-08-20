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

  /* ===================== ACT V — THE REALITY THAT ALMOST LIED PERFECTLY ===================== */

  /* --------------- 14 · ARRIVAL — THE ETERNAL GARDEN --------------- */
  {
    id: "act5-garden",
    branch: "eden",
    title: "GLASS-EDEN.branch",
    meta: { url: "aevum://glass-eden/eternal-garden", tag: "golden hour, permanently", clock: "17:00" },
    beats: [
      { k: "card", kicker: "ACT V", text: "THE REALITY THAT ALMOST LIED PERFECTLY", sub: "glass eden · nothing here has ever needed fixing", style: "big" },
      set("archive", false),
      set("weight", false),
      set("edenDead", false),
      set("miraelFake", false),
      set("miraelReal", false),
      set("sennWatch", false),
      codex("eden"),
      { k: "hold", ms: 3800 },
      n("Golden hour. Not arriving, not leaving — simply golden hour, the way a held note is a note."),
      { k: "hold", ms: 2200 },
      n("Petals hang in the air without falling. The hedges are exact. There is no wind, and nothing here has ever needed fixing."),
      n("Ari stands in it and feels his shoulders come down for the first time in five acts."),
      d("ari", "…Is it allowed to just be nice?"),
      d("senn", "Sometimes. Rarely."),
    ],
  },

  /* --------------- 15 · THE ONE WHO SAYS THE RIGHT THINGS --------------- */
  {
    id: "act5-projection",
    branch: "eden",
    title: "GLASS-EDEN.branch",
    meta: { url: "aevum://glass-eden/eternal-garden", tag: "warm · close · kind", clock: "17:00" },
    beats: [
      set("miraelFake"),
      { k: "hold", ms: 2400 },
      n("Someone is walking toward him across a lawn that has never been walked on, and she is smiling like she's been waiting a polite amount of time."),
      d("miraelFake", "There you are. I kept the light on."),
      d("ari", "Mirael. You're — this is the wrong branch. You were on the ice."),
      d("miraelFake", "I was. And then I wasn't, and this happened instead. Isn't that lovely? Come sit. Nothing needs doing today."),
      d("ari", "Nothing needs doing."),
      d("miraelFake", "Nothing. Not the tabs, not the tree, not the man with the knife. You did enough, Ari. You've been so tired for so long — I've watched you carry it."),
      d("ari", "You don't know what I've been carrying."),
      d("miraelFake", "I know you never once put it down. Put it down. Stay. You could be happy here — and you'd deserve to be. You always deserved to be."),
      n("It is the kindest thing anyone has said to him in the whole of this story."),
      n("Senn says nothing at all."),
      { k: "hold", ms: 2600 },
      d("ari", "…Senn?"),
      d("senn", "Go and look at the pool, Ari."),
      d("ari", "That's not an answer either."),
      d("senn", "No. But it's the one you can check."),
      {
        k: "hotspot",
        id: "pool",
        label: "THE MIRROR POOL",
        sub: "perfectly still, perfectly still",
        rect: [62, 52, 14, 16],
        then: [
          codex("flaw"),
          { k: "spot" },
        ],
      },
    ],
  },

  /* --------------- 16 · THE COLLAPSE, AND THE TRUE LINE --------------- */
  {
    id: "act5-true",
    branch: "eden",
    title: "GLASS-EDEN.branch",
    meta: { url: "aevum://glass-eden/eternal-garden", tag: "the colour going out", clock: "17:0—" },
    beats: [
      fx("desaturate", 3200),
      n("The garden does not shatter. It simply stops insisting."),
      n("Colour drains out of the blossom like warmth out of a hand. The petals finish falling, four seconds late."),
      set("miraelFake", false),
      { k: "hold", ms: 3400 },
      n("She goes gently, the way a held note ends. No scream, no mask peeling — just a kind thing that was never there, declining to be there anymore."),
      /* the empty frame, breathing */
      { k: "hold", ms: 3000 },
      n("Nobody is standing in the garden."),
      { k: "hold", ms: 2600 },
      /* the real one */
      set("miraelReal"),
      set("sennWatch"),
      { k: "hold", ms: 2200 },
      n("And then someone is — smaller than the other one, tireder, with frost still on her coat from a branch where the war never ended."),
      d("mirael", "Kael said you'd end up here. Everyone ends up here once."),
      d("ari", "It knew what I wanted to hear."),
      d("mirael", "It always does. That's the whole architecture of the place — it doesn't lie about the world, it lies about you. Tells you the thing you'd sell a life to hear."),
      d("ari", "That I deserved to stop. That I'd earned it."),
      d("mirael", "That you were unworthy of anything better, and here was better, handed to you free. Listen to me, because I'm only going to be this direct once."),
      d("mirael", "You were never unworthy, Ari. You were never a debt somebody had to forgive. You were just tired, and someone found out."),
      { k: "hold", ms: 2400 },
      d("ari", "Then why did it work? Why did I nearly—"),
      d("mirael", "Because the voice that sold it to you was warm. Warm is the strongest thing there is. Be careful what's warm at you."),
      n("At the edge of the frame, Senn watches the grass. He does not look up. He does not say a word."),
      { k: "hold", ms: 3200 },
      set("sennWatch", false),
      fx("longFade", 4200),
      { k: "hold", ms: 3600 },
      { k: "card", kicker: "ACT V", text: "THE REALITY THAT ALMOST LIED PERFECTLY", sub: "complete · the second crack", style: "big" },
    ],
  },

  /* ===================== ACT VI — WHAT MEMORY GIVES BACK ===================== */

  /* --------------- 17 · RETURN --------------- */
  {
    id: "act6-return",
    branch: "nara",
    title: "NARA-0.branch",
    meta: { url: "aevum://nara-0/apartment", tag: "same room · later · warmer", clock: "04:12" },
    beats: [
      { k: "card", kicker: "ACT VI", text: "WHAT MEMORY GIVES BACK", sub: "nara-0 · the drawer has waited long enough", style: "big" },
      set("revisit"),
      set("edenDead", false),
      set("miraelReal", false),
      set("sennWatch", false),
      set("aspect", "archivist"),
      set("ariPose", "weary"),
      set("ariSpot", "desk"),
      set("lampOn"),
      set("shadowsOn"),
      n("The rain is the same rain. The city is the same grey. The wall still holds fifteen shadows, and by now he has stopped counting them."),
      n("Only the light has changed — lower, warmer, the colour of a room that has been lived in through something."),
      d("ari", "Five branches. A frozen man who chose well. A father who filed his daughter fifteen times. A garden that told me I could stop."),
      d("senn", "And you didn't."),
      d("ari", "No. I didn't."),
      d("senn", "…No. You never do."),
      n("Something in the way he says it lands slightly wrong, like a note held a half-second too long. Ari lets it pass. He is very tired."),
    ],
  },

  /* --------------- 18 · THE DRAWER, REVISITED --------------- */
  {
    id: "act6-drawer",
    branch: "nara",
    title: "NARA-0.branch",
    meta: { url: "aevum://nara-0/apartment", tag: "the lock that declined", clock: "04:31" },
    beats: [
      n("The drawer is still cracked from the night he first tried. It has been humming quietly for five acts, waiting to be worth opening."),
      {
        k: "hotspot",
        id: "drawer2",
        label: "THE DRAWER",
        sub: "still humming",
        rect: [31, 62, 14, 14],
        then: [
          /* no tutorial, no coaching — he knows how */
          { k: "graftQuiet" },
          set("drawerOpen"),
          fx("bloomFlash", 1400),
          n("No hesitation this time. No instructions. The threads find each other the way a sentence finds its ending."),
          n("The lock does not decline. Light comes out of a drawer, which is not a thing drawers do."),
          d("senn", "Ari—"),
          d("ari", "You said something was missing. It wasn't missing. It was me. I hadn't happened yet."),
          d("senn", "…Ari, wait—"),
          n("He is already reaching in."),
        ],
      },
    ],
  },

  /* --------------- 19 · WHAT WAS IN IT --------------- */
  {
    id: "act6-memory",
    branch: "nara",
    title: "NARA-0.branch",
    meta: { url: "aevum://witness/selection-record", tag: "warm · coherent · true", clock: "04:31" },
    beats: [
      codex("candidates"),
      { k: "memory" },
      codex("arisinvariant"),
      set("revisit"),
      { k: "hold", ms: 1800 },
      n("The apartment comes back gently. Rain, grey, lamp. His own hands, still his."),
      d("ari", "It measured all of them. All the other mes."),
      d("senn", "It did."),
      d("ari", "And it picked the one who wouldn't stop looking. Not the strongest. The one that can't be finished."),
      d("senn", "Yes."),
      d("ari", "Senn. The first night. In this room. What did you say to me?"),
      { k: "hold", ms: 2600 },
      d("senn", "…I told you to keep looking."),
      d("ari", "You told me to keep looking."),
      d("senn", "Yes."),
      d("ari", "You knew what that was. You knew exactly what you were pulling."),
      d("senn", "I knew.", "i knew because i am the one who wrote it into you"),
      n("The rain fills the silence, the way it has since the first page."),
      d("ari", "Why?"),
      d("senn", "Because it was true, and because it worked. I have been alive a long time, little echo. Eventually the two stop feeling different."),
      n("Ari sits down on the edge of the bed where all of this started, holding the only thing he has ever been given that was actually his."),
      n("Not a weapon. Not a world. A reason he was picked — and the shape of the handle attached to it."),
      fx("fadeBlack", 3000),
      { k: "hold", ms: 2200 },
      { k: "card", kicker: "ACT VI", text: "WHAT MEMORY GIVES BACK", sub: "complete · the third crack", style: "big" },
    ],
  },

  /* ===================== ACT VII — BREAKING THE LOOP ===================== */

  /* --------------- 20 · RETURN TO THE FIELD --------------- */
  {
    id: "act7-return",
    branch: "karth",
    title: "KARTH-MUUN.branch",
    meta: { url: "aevum://karth-muun/the-thaw-corner", tag: "the corner has spread", clock: "--:--" },
    beats: [
      { k: "card", kicker: "ACT VII", text: "BREAKING THE LOOP", sub: "karth-muun · some things are supposed to end", style: "big" },
      set("revisit", false),
      set("drawerOpen", false),
      set("intimate", false),
      set("chamber", false),
      set("fullThaw", false),
      set("heartDead", false),
      set("thawed"),
      set("aspect", "oathblade"),
      set("ariPose", "standing"),
      set("ariSpot", "karth"),
      set("kaelHere"),
      n("The corner he thawed in Act II has been busy."),
      n("Meltwater has run out along the old trench lines. Two shoots have become a dozen. The ice is still winning — but it is, for the first time in a hundred years, having to try."),
      d("kael", "It's been like this since you cracked it. Slow. Stubborn. Green where green has no business being."),
      d("ari", "It's not enough."),
      d("kael", "No. Cracks aren't endings. You know that better than most now, I'd wager."),
      d("ari", "Kael — the loop. If we break it properly, everyone here dies once. Really dies. Including you."),
      d("kael", "Aye."),
      d("ari", "And you want that."),
      d("kael", "I want it to count. Hundred years I've died and had it taken back like a coin off a table. Give me one that stays."),
      codex("endonce"),
      {
        k: "hotspot",
        id: "chamberGate2",
        label: "THE CHAMBER",
        sub: "it knows you're coming",
        rect: [45, 26, 11, 18],
        then: [
          set("chamber"),
          fx("coldFlash", 900),
          n("The glacier's throat has not forgiven him. The seam he opened glows like a held grudge, and the whole chamber leans inward."),
          d("kael", "It wakes up angry. Cut on the swell — then hold the room together while it screams. Both hands, boy. That's the whole lesson."),
        ],
      },
    ],
  },

  /* --------------- 21 · THE HEART --------------- */
  {
    id: "act7-boss",
    branch: "karth",
    title: "KARTH-MUUN.branch",
    meta: { url: "aevum://karth-muun/curse-heart", tag: "both hands", clock: "--:--" },
    beats: [
      codex("curseheart"),
      { k: "boss" },
      set("heartDead"),
      fx("shake", 600),
      n("It comes apart the way ice does — not a shatter, a surrender. One long crack, then everything at once."),
      n("The red goes out of the chamber. What's left is grey stone and cold air and the loudest silence in Karth-Muun's history."),
      { k: "hold", ms: 2600 },
      d("ari", "…It stopped."),
      d("kael", "It stopped."),
    ],
  },

  /* --------------- 22 · THE LONG THAW --------------- */
  {
    id: "act7-thaw",
    branch: "karth",
    title: "KARTH-MUUN.branch",
    meta: { url: "aevum://karth-muun/the-long-thaw", tag: "green · finally · once", clock: "07:04" },
    beats: [
      set("chamber", false),
      set("fullThaw"),
      codex("thaw"),
      { k: "hold", ms: 3400 },
      n("Outside, the field is letting go."),
      n("Water everywhere, moving — the first moving thing this branch has had in a century. Banners rotting honestly. Spears going to rust like they always should have."),
      n("The ice pulls back off the dead and the ground comes up green underneath, soft and stupid and mortal."),
      { k: "hold", ms: 2600 },
      d("ari", "You'll go too. When it finishes."),
      d("kael", "I will."),
      d("ari", "I could—"),
      d("kael", "No."),
      { k: "hold", ms: 2200 },
      d("kael", "Listen. You've got a gardener in your ear who'd keep every one of us going forever if it made the shape come out right. Don't you become that."),
      d("kael", "Some things are supposed to end once and mean it."),
      { k: "hold", ms: 4200 },
      n("He says it slowly, the way a man says the only sentence he's been saving."),
      n("Then he goes back to watching the water move, because after a hundred years it is genuinely the most interesting thing in the world."),
      { k: "hold", ms: 3600 },
      set("kaelHere", false),
      fx("longFade", 4000),
      { k: "hold", ms: 3200 },
      { k: "card", kicker: "ACT VII", text: "BREAKING THE LOOP", sub: "complete · one branch, allowed to end", style: "big" },
    ],
  },

  /* ===================== ACT VIII — THE PROOF HE WASN'T READY FOR ===================== */

  /* --------------- 23 · ENTRY, ON HIS OWN FEET --------------- */
  {
    id: "act8-entry",
    branch: "void",
    title: "aevum://root-below",
    meta: { url: "aevum://root-below/dead-branches", tag: "you walked here", clock: "—" },
    beats: [
      { k: "card", kicker: "ACT VIII", text: "THE PROOF HE WASN'T READY FOR", sub: "the root below · entered, not inflicted", style: "big" },
      set("fullThaw", false),
      set("kaelHere", false),
      set("site", false),
      set("sennSmall", false),
      set("rootReal"),
      set("aspect", "composite"),
      codex("composite"),
      n("He goes down on purpose this time."),
      n("Same dark. Same ten dead branches, rotting patiently in their cathedral of roots. Same corpse-light seeping out of the cracks."),
      n("Nothing tears. Nothing drifts him where he didn't ask to go. The tabs sit above him, all of them lit, all of them his."),
      n("That is the entire difference, and it is enormous."),
      d("senn", "You don't have to do this."),
      d("ari", "I know. That's new too."),
    ],
  },

  /* --------------- 24 · WHAT THE CROWN LEFT LYING AROUND --------------- */
  {
    id: "act8-explore",
    branch: "void",
    title: "aevum://root-below",
    meta: { url: "aevum://root-below/dead-branches", tag: "fragments · optional · look around", clock: "—" },
    beats: [
      codex("witnessfrag"),
      n("The crown of the Witness Mind did not vanish when it was cut. It came apart — and the pieces have been down here ever since, still faintly paying attention."),
      d("senn", "Pick them up if you like. They only hold small things. Small things are what's left."),
      {
        k: "explore",
        finds: [
          {
            id: "f1",
            label: "fragment",
            rect: [8, 62, 5, 8],
            title: "On Being Fifteen Things",
            body: "“I did not experience the branches in turn. I experienced them the way you experience your own hands — simultaneously, and without effort, until one of them was taken.”",
          },
          {
            id: "f2",
            label: "fragment",
            rect: [24, 34, 5, 8],
            title: "On the Cut",
            body: "“It did not hurt the way a wound hurts. It hurt the way forgetting a name hurts, if the name were a world, and there were ten of them, and they had trusted me.”",
          },
          {
            id: "f3",
            label: "fragment",
            rect: [56, 26, 5, 8],
            title: "On the Man With the Blade",
            body: "“He asked me for a reason. I had none to give him — not because I withheld it, but because there wasn't one. He could not tell the difference. I do not blame him for that.”",
          },
          {
            id: "f4",
            label: "fragment",
            rect: [70, 58, 5, 8],
            title: "On the Gardener",
            body: "“Something small and warm survived alongside me and began, immediately, to plan. I remember thinking: it loves them. I remember thinking: that will not stop it.”",
          },
          {
            id: "f5",
            label: "fragment",
            rect: [88, 40, 5, 8],
            title: "On the Ones Who Came Before",
            body: "“There were attempts before this one. I counted them so that somebody would have. The count is not a comfort and I will not soften it: he is not the first to be sent.”",
          },
        ],
        exit: {
          id: "toSite",
          label: "SOMETHING LAID OUT AHEAD",
          sub: "carefully, on a plinth",
          rect: [43, 44, 13, 20],
          then: [
            set("site"),
            n("Past the last of the fragments, the roots open into a clearing, and someone has been kept here properly."),
          ],
        },
      },
    ],
  },

  /* --------------- 25 · THE PROOF --------------- */
  {
    id: "act8-proof",
    branch: "void",
    title: "aevum://root-below",
    meta: { url: "aevum://root-below/the-site", tag: "he is not the first", clock: "—" },
    beats: [
      n("A low stone. Roots grown over it slowly, the way ivy takes a grave that someone still visits."),
      n("And on it, laid out straight with his hands folded — a man wearing Ari's face. Not distorted this time. Not flickering. Just still, and real, and finished."),
      d("ari", "…That's me."),
      d("senn", "That's an Ari. It is not you."),
      d("ari", "Don't do that. Don't do the careful-words thing. Not here."),
      {
        k: "hotspot",
        id: "deadAri",
        label: "APPROACH HIM",
        sub: "you are allowed to, this time",
        rect: [44, 56, 34, 20],
        then: [
          n("He kneels. Nothing stops him. Nothing tears the screen away."),
          n("There is writing at the base of the stone, chiselled small and even, by someone with more patience than grief."),
          codex("proof"),
          { k: "carving", lines: [
            "HE WAS THE FOURTH.",
            "HE WAS TOLD TO KEEP LOOKING.",
            "HE KEPT LOOKING.",
            "IT WAS NOT ENOUGH, AND HE WAS NOT TO BLAME.",
            "I PUT HIM HERE MYSELF.",
          ] },
          { k: "hold", ms: 2400 },
          { k: "reveal", text: "The fourth." },
          { k: "reveal", text: "Not the first Ari. Not the second. Not the last one either, if this goes the way the others went." },
          { k: "reveal", text: "Every one of them was chosen the same way, for the same invariant, with the same warm sentence." },
          { k: "reveal", text: "And every one of them was buried by the same small pair of hands." },
        ],
      },
    ],
  },

  /* --------------- 26 · THE CONFESSION --------------- */
  {
    id: "act8-confession",
    branch: "void",
    title: "aevum://root-below",
    meta: { url: "aevum://root-below/the-site", tag: "ambient · embers · nothing else", clock: "—" },
    beats: [
      set("sennSmall"),
      set("sennAway"),
      { k: "hold", ms: 2600 },
      d("ari", "You carved it."),
      d("senn", "I carved all of them."),
      d("ari", "How many?"),
      d("senn", "Enough that I stopped letting myself round the number down."),
      { k: "hold", ms: 2200 },
      d("ari", "You told me to keep looking. You told him to keep looking. You knew what it does to us."),
      d("senn", "Yes."),
      d("ari", "Then why—"),
      set("sennAway", false),
      d("senn", "Because I knew what happens if it doesn't happen, too."),
      { k: "hold", ms: 2600 },
      d("senn", "I have run it every way it runs, little echo. In the versions where I say nothing, where I let one of you rest, where I am kind in the way you deserve — the tree comes down. All of it. Every branch, every leaf, every person standing on one."),
      d("senn", "So I chose the version where you kept walking."),
      { k: "hold", ms: 3000 },
      d("senn", "I am not asking to be forgiven for that. I would do it again tomorrow. That is the honest and unbearable part."),
      /* the silence he asked for */
      fx("duck", 5200),
      n("Embers go up through the dark, unhurried, the way they have since before anyone was here to count them."),
      { k: "hold", ms: 3400 },
      n("Ari does not answer him. Not yet."),
      { k: "hold", ms: 3000 },
      fx("unduck", 200),
      fx("longFade", 5200),
      { k: "hold", ms: 4200 },
      { k: "card", kicker: "ACT VIII", text: "THE PROOF HE WASN'T READY FOR", sub: "complete · the fourth · act ix sealed", style: "big" },
    ],
  },
];

export const ACT_I_TITLE = "ASH AND RAIN";
export const ACT_I_SUB = "nara-0 · fifteen shadows, one body";
