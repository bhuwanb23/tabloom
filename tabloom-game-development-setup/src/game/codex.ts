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
  {
    id: "kael",
    cat: "people",
    title: "Kael Orin",
    kicker: "the man who chose well",
    body: "A survivor of the Karth-Muun loop who walks out of every reset unhurried and unhurtable, like punctuation that refuses the sentence. He knew the Ari that belonged to this branch — and he is particular about the difference between cutting and pruning.",
  },
  {
    id: "mirael",
    cat: "people",
    title: "Mirael",
    kicker: "not a prize",
    body: "A figure at the far edge of the frozen field, watching the banners like they're about to move. She was never a prize between the men of this loop — not between Kael and the Ari who was here before, and not between anyone and what they think they're owed.",
  },
  {
    id: "pruning",
    cat: "things",
    title: "Root-craft: Pruning",
    kicker: "mercy with sharp edges",
    body: "The other hand of root-craft. Where Grafting knits, Pruning cuts — hold the charge, release on the pulse, and cut exactly what asks to be cut, nothing more. Pruning is not murder. Done right, it is how a garden survives its own thorns.",
  },
  {
    id: "curseheart",
    cat: "things",
    title: "The Frost-Curse Heart",
    kicker: "the fist that holds the loop shut",
    body: "A heart of black ice hanging in the glacier's throat, red-veined, beating upward into the weather of the whole branch. It holds the Karth-Muun loop tight as a fist. The true fight for it comes much later — Act I's crack was only an introduction.",
  },
  {
    id: "deadari",
    cat: "people",
    title: "The Dead Ari",
    kicker: "seen once, uninvited",
    body: "In the Root Below, among ten rotting branches, a body wearing his face — unstable, half-there, refusing to hold a single shape. He was given no chance to approach it, no way to touch it, no permission to ask. Only the looking. Only the fact of it.",
  },
  {
    id: "vision",
    cat: "things",
    title: "The Uninvited Glimpse",
    kicker: "not a dream — dreams are yours",
    body: "Something reached up through the root-system and pulled his eye down into a place he has not earned yet. The Witness Mind's wreckage leaks; sometimes it leaks into whoever is nearest. Senn calls it nothing that has happened yet. Senn is choosing words very carefully.",
  },
];

export const codexById = (id: string): CodexEntry | undefined =>
  CODEX.find((e) => e.id === id);
