# TABLOOM: The Last Mind of Aevum
### Document 3 of 5 — Weapons, Root-Craft System & Key Items

---

## The Root-Craft System (Magic/Ability Framework)

All abilities in this game are grown, not cast in the traditional "spellbook" sense. Everything channels through Rootsteel — living wood-metal drawn from Heartwood matter. Two disciplines:

### PRUNING (Destructive Discipline)
**Function:** Severs. Ends things permanently — curses, bridges between realities, loops, paradox-creatures.
**Combat feel:** Hard-hitting, deliberate, "deathblow" philosophy (Sekiro-inspired) — not rapid combo-based, more about precise, committed strikes that feel final.
**Visual language:** Sharp, angular root-light, colored deep red-black when active, particle effects that look like something being cut cleanly rather than exploding.

### GRAFTING (Creative Discipline)
**Function:** Mends. Regrows dead matter, stitches wounds, revives, bridges realities safely, stabilizes collapsing environments.
**Combat feel:** Sustain-oriented, defensive, utility-based (Elden Ring Incantation-inspired) — shields, healing-over-time, environmental stabilization during boss fights.
**Visual language:** Soft, curling root-light, colored warm teal-gold when active, particle effects that look like vines growing/knitting rather than striking.

**Design rule for asset generation:** every Root-craft VFX asset should be generated in BOTH a Prune variant (red-black, sharp/angular) and a Graft variant (teal-gold, soft/curling) so the two disciplines are instantly visually distinguishable at a glance during fast combat.

---

## THE WARDENSROOT (Ari's Weapon)

**Lore:** The only known weapon grown to hold both Root-craft disciplines in a single form — because Ari himself is a paradox-stable vessel, nothing else can carry the contradiction of "kills and grows" without tearing apart.

**Mechanical function:** Stance-switch weapon — player toggles between Prune-stance and Graft-stance mid-combat (similar rhythm to Sekiro's prosthetic-tool swap). Prune-stance for boss damage and severing curses; Graft-stance for sustain and stabilizing collapsing arenas mid-fight.

**Visual generation prompt:**
```
ornate living weapon, half dark twisted rootwood blade half pale living
vine-wood, dual nature clearly visible down its length — one edge sharp
angular black-red rootsteel, the other soft curling teal-gold living wood
with small growing leaves, ancient and organic craftsmanship, glowing
faint dual-colored light along a central seam where the two halves meet,
fantasy weapon concept art, dark background, dramatic side lighting,
highly detailed, no text, no watermark
```

**Alternate close-up prompts (for icon/UI asset):**
- Prune-stance active: `same weapon, only the red-black edge glowing, angular sharp light, aggressive stance-ready pose`
- Graft-stance active: `same weapon, only the teal-gold edge glowing, soft curling light, small vines visibly growing along the blade in real time`

---

## THE NULLROOT (Veyr's Weapon)

**Lore:** Not forged — grown from a single repeated fact: his daughter's death, identical across every reality he searched. It doesn't fit Pruning or Grafting; it belongs to a third, wrong category — it doesn't sever or grow, it **collapses**, forcing separate things into one.

**Mechanical function:** In the final boss fight, Nullroot attacks should visually and mechanically read as "wrong" compared to normal Root-craft — not more powerful in an obvious numbers sense, but *unstable*, warping the arena, briefly merging two versions of a boss-attack-pattern together as a signature move.

**Visual generation prompt:**
```
dark twisted blade grown from black root-matter, no leaves, no living
growth, veins of sickly grey-white light running through it like scar
tissue, unnaturally still and heavy-looking, faint distortion/warping
effect visible in the air immediately around the blade, mournful and
wrong rather than evil-looking, dark fantasy weapon concept art,
dramatic lighting, high detail, no text, no watermark
```

**Design note:** Avoid generic "evil sword" tropes (no skulls, no obvious spikes-for-menace). The horror of the Nullroot should come from its wrongness and stillness, not aggression — it should look like grief given a shape, not violence given a shape.

---

## SECONDARY / ENVIRONMENTAL ROOT-CRAFT ITEMS

### Witness Fragments (collectible/story items)
**Lore:** Small pieces of the Witness Mind's memory, scattered across the five realities — collecting these is how the player pieces together backstory (used narratively in Acts I, IV, VI, VIII).
**Visual prompt:**
```
small glowing shard of root-light, teal-white, faintly pulsing like a
heartbeat, suspended in the air, delicate and precious, soft particle
glow, small scale object, fantasy collectible item icon, dark
background, no text, no watermark
```

### Memory-Lock Constructs (Nara-0 puzzle objects)
**Lore:** Root-grown seals binding old memories shut until the player understands enough to open them (Act I introduces, Act VI resolves).
**Visual prompt:**
```
small ornate wooden drawer/box bound shut with glowing root-vines,
faint lock-pattern of light etched across its surface, modern furniture
combined with ancient root-growth, warm indoor lighting, fantasy puzzle
object, no text, no watermark
```

### The Frost-Curse Heart (Karth-Muun boss-adjacent object, Acts II & VII)
**Lore:** The source of the battlefield's time-loop; partially severed in Act II, fully destroyed in Act VII.
**Visual prompt:**
```
pulsing crystalline heart-shaped object embedded in ice, dark red-black
cracks spreading through frozen crystal, faint frozen battlefield
reflected inside its surface, ominous glow, dark fantasy environmental
object, dramatic cold lighting, no text, no watermark
```

---

## COMBAT ABILITY ICON SET (for UI, generate as a matched set)

Generate these together in one prompt batch for visual consistency, using this shared suffix: `simple fantasy game UI icon, circular frame, single clear silhouette, dark background, glowing accent color, minimal detail, easily readable at small size, no text`

1. **Prune Strike** — `angular blade-slash icon, red-black glow`
2. **Prune Sever** (heavy attack) — `single deep diagonal cut icon, intense red-black glow, small particle burst`
3. **Graft Mend** — `curling vine-heal icon, teal-gold glow, small leaf motif`
4. **Graft Stabilize** (environmental) — `root-anchor icon, teal-gold glow, ground-spreading root pattern`
5. **Tab-Shift** (reality switch, core mechanic icon) — `two overlapping translucent browser-tab shapes, one warm one cold toned, glowing seam between them`

---

## Global Style Guardrail (append to every weapon/item prompt)

```
dark fantasy concept art, painterly digital illustration,
Elden Ring / FromSoftware item-design aesthetic, dramatic single-source
lighting, high detail, no text, no watermark, object isolated against
dark or softly blurred background unless otherwise specified
```
