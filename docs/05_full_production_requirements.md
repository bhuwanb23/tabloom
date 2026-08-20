# TABLOOM: The Last Mind of Aevum
### Document 5 of 5 — Full Production Requirements

This is the "everything you need" checklist — engine, tools, full asset list pulled from Documents 1–4, audio needs, UI needs, and a realistic hackathon-scoped build order.

---

## 1. Engine & Core Tech Choice

Given this is browser-native (tabs = timelines is the core hook), your engine choice should prioritize **web deployment first**, not port-to-web-later.

**Recommended: Godot 4 (HTML5/Web export) or a browser-native JS/TS framework (Phaser 3, or PixiJS + custom state management).**

- **Godot 4** — best if you want proper 2D lighting, shader support for the Root-craft glow effects, and a real scene/state system, and you're okay with a slightly heavier learning curve. Exports cleanly to web.
- **Phaser 3** — best if you're already comfortable in JS/TS and want the fastest iteration loop for a hackathon. Slightly more manual work for the glow/particle VFX described in Doc 3, but very achievable with shaders or sprite-based fakes.

**The actual "multiple tabs = multiple timelines" mechanic** is the one piece that needs special attention: this isn't just an art style, it needs either (a) real browser `window.open()` / multi-tab communication via `BroadcastChannel` or `localStorage` events, or (b) a simulated-tabs UI within a single page (fake browser chrome, switchable panels) which is *much* easier to build reliably in a hackathon timeframe and still sells the concept visually. **Recommend (b) for a hackathon build** — simulate the tab bar as UI, don't fight real multi-window browser APIs under time pressure.

---

## 2. Full Asset Checklist (pulled from Documents 2–4)

### Characters — need base art + expression variants
- [ ] Ari — Aspect 1 (Archivist)
- [ ] Ari — Aspect 2 (Oathblade)
- [ ] Ari — Aspect 3 (Patient/Machine Saint)
- [ ] Ari — Aspect 4 (Glass Eden)
- [ ] Ari — Aspect 5 (Composite/Root Below)
- [ ] Mirael — base + per-reality clothing variants (3 minimum: Nara-0, Karth-Muun, Glass Eden)
- [ ] Kael Orin
- [ ] Veyr Sol Auric
- [ ] Senn (+ idle animation/particle trail)
- [ ] The Witness Mind (final reveal only — one hero asset)
- [ ] Dying Soldier (minor, Act II)
- [ ] Glass Eden Mirael (projection variant)
- [ ] Dead Ari (Root Below variant)

### Weapons & Items
- [ ] Wardensroot — neutral pose
- [ ] Wardensroot — Prune-stance glow variant
- [ ] Wardensroot — Graft-stance glow variant
- [ ] Nullroot
- [ ] Witness Fragment (collectible)
- [ ] Memory-Lock Construct (puzzle object)
- [ ] Frost-Curse Heart (2 states: cracked/Act II, destroyed/Act VII)

### Environments (backgrounds/skyboxes/key set-pieces)
- [ ] Nara-0: Apartment, Rain Streets, The Archive
- [ ] Karth-Muun: Frozen Battlefield, Ice Gate, Curse-Heart Chamber (2 states)
- [ ] Ora-Vell: Grand Ward, Veyr's Archive, Ritual Theatre
- [ ] Glass Eden: Eternal Garden, Mirror Pool
- [ ] Root Below: Dead Branches, Dead Ari Site (2 states — vision/unstable, full/stable)
- [ ] Heartwood: Siege Approach, Root Chamber

### UI/Icon Set
- [ ] Prune Strike icon
- [ ] Prune Sever icon
- [ ] Graft Mend icon
- [ ] Graft Stabilize icon
- [ ] Tab-Shift icon
- [ ] Per-reality tab icons ×6 (5 realities + Heartwood), color-coded per Doc 4's palette key
- [ ] Health/stance UI bar (dual-color for Prune/Graft states)
- [ ] Dialogue box frame (consider 2 variants — "normal" for most characters, subtly different frame for Senn to visually cue "this voice isn't quite human")

### VFX (particle/shader assets)
- [ ] Prune-stance combat particles (red-black, angular)
- [ ] Graft-stance combat particles (teal-gold, curling)
- [ ] Reality-ripple effect (visual feedback when an action in one tab affects another — critical, this IS the core mechanic's feedback loop, don't underbuild this one)
- [ ] Senn's idle particle trail
- [ ] Nullroot's "wrongness" distortion effect

---

## 3. Audio Requirements

- [ ] VO: full script from the intro video doc, plus in-game dialogue for all 10 acts (scope this down hard for a hackathon — see Section 5 below)
- [ ] Music: one ambient bed per reality (6 total — 5 realities + Heartwood), matching the palette/mood identities in Doc 4
- [ ] SFX: rain (Nara-0), wind/ice-creak (Karth-Muun), sterile hum (Ora-Vell), unnaturally quiet ambience (Glass Eden), silence/faint embers (Root Below), deep resonant hum (Heartwood)
- [ ] Combat SFX: Prune strike (sharp, cutting), Graft mend (soft, growing/organic), tab-switch transition sound (a signature, distinctive sound — this plays constantly, get it right)

**Free tools:** Pixabay Music / YouTube Audio Library (music + ambience beds), freesound.org (SFX, check license per clip), ElevenLabs free tier or Edge neural TTS (VO, per the intro-video doc's guidance).

---

## 4. Team Roles Needed (even if it's just you wearing every hat)

| Role | Responsibility | Can AI-assist? |
|---|---|---|
| Game/systems designer | Puzzle logic, tab-ripple mechanic, combat balancing | Partially — I can help design and pseudocode systems |
| Programmer | Engine implementation | Yes — I can write actual Godot/Phaser code with you |
| Artist | Character/environment/weapon art | Yes — via image-gen tools per Docs 2–4's prompts |
| Writer | Dialogue, in-game text | Done — Docs already written |
| Audio | VO, music, SFX | Partially — free tools + AI TTS, sourcing is manual |
| Producer/scope-cutter | Deciding what NOT to build | This is the most important hat for a hackathon — see Section 5 |

---

## 5. Realistic Hackathon Scope (READ THIS BEFORE BUILDING ANYTHING)

A full 10-act, 5-reality, fully-voiced game is a 6–12 month indie scope, not a hackathon scope. Here's what to actually build, in priority order:

### Tier 1 — Must build (this alone is a complete, demoable hackathon entry)
1. The **simulated tab-switching UI** — this is your entire pitch, it needs to work and look good even if nothing else does.
2. **Act I** in full — apartment, 15-shadows puzzle, Senn intro, first tab-ripple puzzle (lamp → ice-gate).
3. One combat encounter (a trimmed version of Act II) to prove the Prune/Graft stance-switch works.
4. A short, text-only or minimally-animated ending scene that at least gestures at the emotional core (doesn't need all 3 endings — even a single strong ending beat sells the pitch).

### Tier 2 — Build if time remains
5. Act IV's document-puzzle (investigation gameplay is cheap to build — mostly UI + text — and shows genre range).
6. A second reality's environment art fully realized (Karth-Muun, since you'll already have combat there from Tier 1).

### Tier 3 — Cut unless you have a full team and extra days
- Full VO for all acts (use text + minimal ambient VO barks instead)
- All 5 Ari aspect models (reuse one model with palette-swapped costume overlays instead of 5 distinct builds)
- The full 3-ending branching sequence (a single true ending, well-executed, beats three shallow ones for a demo)

---

## 6. What I Can Build With You Directly, Right Now

I can write real, running code in this chat for:
- The tab-switching UI simulation (HTML/JS or a Godot scene structure)
- The reality-ripple mechanic (state management logic connecting two "tabs")
- Combat stance-switch logic (Prune/Graft toggle + basic attack states)
- A working playable prototype artifact you can test in-browser immediately

Bring me generated art assets (from the prompts in Docs 2–4) whenever you have them, and I'll wire them into a real interactive build.
