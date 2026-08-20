import type { CodexEntry } from "./types";

export const CODEX: CodexEntry[] = [
  {
    id: "aevum",
    cat: "places",
    title: "Aevum",
    kicker: "the tree that is not a metaphor",
    body: "Somewhere beneath every branch of every reality sits Aevum. It does not represent the multiverse — it is the medium the multiverse thinks in, the way a brain is not a symbol for a mind but the actual meat the mind happens inside of.",
  },
  {
    id: "witness",
    cat: "people",
    title: "The Witness Mind",
    kicker: "the one who held the branches apart",
    body: "A single consciousness that once held every branch of Aevum steady at once. It had no name of its own — the branches called it the Witness Mind, because that was its only function: to witness all versions of reality without letting them bleed into one another.",
  },
  {
    id: "nullroot",
    cat: "things",
    title: "The Nullroot",
    kicker: "the blade that is a fact",
    body: "Not steel. Not light. A blade made out of the one fact a daughter's death never changed, no matter which reality her father searched. One cut, precise as a scalpel, severed the Witness Mind's crown from its root-system.",
  },
  {
    id: "veyr",
    cat: "people",
    title: "Veyr Sol Auric",
    kicker: "the grieving father",
    body: "Not a god. Not a monster. A father who checked every reality for the one outcome he needed and never found it. He carries the Nullroot, and he means to finish the collapse of everything — on purpose.",
  },
  {
    id: "ari",
    cat: "people",
    title: "Ari Vaan",
    kicker: "fifteen shadows, one body",
    body: "Woke up wrong in Nara-0 — not injured, wrong, the way a word feels wrong after you've said it forty times in a row. Remembers a death that, as far as anyone can tell, was never his.",
  },
  {
    id: "senn",
    cat: "people",
    title: "Senn",
    kicker: "it grows in the space between pages",
    body: "Half plant, half something gentler than that, made of the same root-light that runs under everything. Warm, funny in a dry old way, protective in the manner of something that has done this before — and lost people doing it.",
  },
  {
    id: "nara",
    cat: "places",
    title: "Nara-0",
    kicker: "a held breath of a city",
    body: "Grey, modern, ordinary in the specific way that makes ordinary things feel like a held breath. Rain most nights. One apartment whose wall casts fifteen shadows from a single body.",
  },
  {
    id: "karth",
    cat: "places",
    title: "Karth-Muun",
    kicker: "the battlefield frozen mid-argument",
    body: "A war that paused and never resumed. Ice over everything — the banners, the spears, the reasons. A second Ari wakes there under an aurora that moves like something breathing.",
  },
  {
    id: "rootbelow",
    cat: "places",
    title: "The Root Below",
    kicker: "where dead branches go",
    body: "Ten branches of fifteen are dead now. They do not vanish — they rot, slowly, as root matter in a place called the Root Below. What decays down there does not always stay down.",
  },
  {
    id: "grafting",
    cat: "things",
    title: "Root-craft: Grafting",
    kicker: "to knit instead of cut",
    body: "Everything sharp in this story cuts — so root-craft teaches the opposite motion. Grafting is the mending of memory-locks: taking severed threads and weaving them back until the door remembers how to bloom.",
  },
];

export const codexById = (id: string): CodexEntry | undefined =>
  CODEX.find((e) => e.id === id);
