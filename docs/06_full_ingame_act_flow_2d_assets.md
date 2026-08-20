# TABLOOM: The Last Mind of Aevum
### Full In-Game Act Flow — Built for 2D Static Image Assets

---

## Read This First: Why the Format Below Fits Your Assets

You have 2D static images (backgrounds, character portraits/sprites, item icons, VFX stills), not animated rigs or 3D models. The right structure for that asset type is a **visual novel / point-and-click hybrid** — NOT a side-scrolling action game. This is good news: it's the cheapest structure to build well, it's exactly what FromSoft-style narrative weight actually needs (stillness, held frames, meaningful pauses), and it fully supports the tab-switching mechanic as an overlay UI layer on top of static scenes.

**The screen, at any moment, is built from layers:**
1. **Background layer** — one static environment image (from Doc 4)
2. **Character layer** — one or more character sprite/portrait images placed on top (from Doc 2)
3. **VFX layer** — particle/glow overlays (from Doc 3), can be simple animated PNG sequences or CSS/shader glow effects on a static image
4. **UI layer** — dialogue box, tab-bar (the browser-tab simulation), hotspot cursors, choice buttons

**Motion without animation** — since your images are static, you fake motion with code, not art:
- Slow zoom/pan on a background (Ken Burns) for "cinematic" moments
- Fade/cross-dissolve between two static images for transitions
- Screen-shake, flash, or color-overlay pulses for impact moments (the Act IV "shattered" beat, boss hits)
- Sprite position tweening (character slides in from off-screen rather than "walking" frame-by-frame)

Every act below is written using ONLY these tools, so nothing here requires assets you don't have.

---

## Universal Screen Template (use for every act)

```
[BACKGROUND: environment image]
  [CHARACTER SPRITE(S): positioned left/center/right]
    [VFX OVERLAY: optional, per-moment]
      [DIALOGUE BOX: bottom third, name + text]
      [TAB BAR: top strip, shows open reality-tabs, only visible once unlocked in Act I]
      [HOTSPOT CURSORS: appear on interactable image regions]
```

---

# ACT I — "Ash and Rain" (Nara-0)

### Screen 1 — Apartment, Ari's bed
**Assets used:** Nara-0 Apartment background, Ari Aspect 1 (Archivist) sprite, 15-shadows overlay (a semi-transparent shadow-layer PNG placed on the wall)

**Flow:**
1. Fade in from black onto the apartment background. Ari sprite lying down, not yet standing.
2. Rain SFX + ambient Nara-0 music bed starts.
3. Player clicks/taps anywhere → Ari sprite sits up (swap to a second "sitting" pose of the same sprite, or a simple position-shift if you only have one pose).
4. The 15-shadows overlay fades in on the wall background over 2 seconds — this is your first "wow" beat, make the fade slow.
5. Dialogue box, no character speaking (internal narration font style): *"Fifteen shadows. One body."*
6. Hotspot appears on the terminal (a small clickable region on the desk in the background image). Player must click it to proceed — this teaches "click glowing/highlighted objects to progress," your core interaction language for the whole game.

### Screen 2 — Terminal message
7. Screen darkens slightly (dark overlay at 40% opacity) to focus attention on a terminal-text popup box.
8. Text types out letter-by-letter (classic VN technique, cheap to build, high tension payoff): *"IF YOU ARE READING THIS, YOU ARE NOT THE FIRST ARI. DO NOT OPEN THE OTHER WORLDS."*
9. A single glowing button appears: **[Open the other world]**. No alternative choice — player must click it (illusion of choice here is fine; this isn't a branching moment, it's a forced-inevitability beat).

### Screen 3 — Tab-bar introduction
10. Screen flashes white briefly (a full-screen white overlay, opacity animated 0→100→0 over 0.3s) — sells "tearing open a new reality."
11. **The tab bar UI slides down from the top of the screen for the first time.** Two tabs now visible: "Nara-0" (highlighted/active) and a new tab "Karth-Muun" (pulsing to draw the eye).
12. Tooltip/tutorial popup: *"Click a tab to shift your mind into that reality."*
13. Player clicks the Karth-Muun tab.

### Screen 4 — Cross-fade to Karth-Muun
14. Background cross-dissolves from Nara-0 apartment to Karth-Muun frozen battlefield over 1.5 seconds. Character sprite swaps from Ari Aspect 1 to Ari Aspect 2 (Oathblade) during the fade's midpoint, hidden by the dissolve.
15. Both Ari sprites (conceptually) say the same line — show it as overlapping/echoing text in the dialogue box: **"I remember dying."** (styled with a faint double-exposure text effect if your engine supports it — even a simple drop-shadow in a second color sells this cheaply).

### Screen 5 — Senn's introduction
16. Small Senn sprite fades in at center screen, between where the two tab-scenes conceptually meet (use a neutral dark backdrop, or a soft blurred blend of both environment colors).
17. Senn's dialogue plays out (use the script from the "Opening" document — the "You're awake in two places at once" lines).
18. First Root-craft tutorial popup appears: **[Grafting unlocked — click the glowing drawer in your apartment to try it]**
19. Tab bar highlights "Nara-0" tab to guide the player back.

### Screen 6 — Memory-lock puzzle (Grafting tutorial)
20. Back in the apartment background, a hotspot glows on a desk-drawer (a small root-vine-bound-box overlay image, from Doc 3's Memory-Lock Construct asset).
21. Click it → a simple minigame or single-click "cast" animation (teal-gold Graft VFX overlay plays on top of the drawer image, looping 1-2 seconds).
22. Drawer visually shifts to a "still locked, but cracked" state (swap to an alternate version of the same image with a visible crack — cheap to generate, one extra image) — text: *"Not yet. Something's missing."* This plants the Act VI payoff.
23. Senn: *"Keep looking, Ari. You may be surprised."* — the lie line, delivered gently.

### Screen 7 — Lamp/Ice-gate ripple puzzle (core mechanic tutorial)
24. Hotspot on the apartment's lamp. Click → lamp sprite swaps to "on" state (simple image swap, glow overlay added).
25. Tab bar: the Karth-Muun tab icon itself visibly changes (small glowing accent added to the tab icon) — teaches "watch the tabs themselves for feedback, not just the scene."
26. Player clicks over to Karth-Muun tab → background shows the Ice Gate image now in a "partially melted" state (swap to alternate version with a visible crack of warm light through the ice).
27. Dialogue/narration: *"Somewhere, something answered."*

### Act I ends
28. Fade to black. Title card reappears briefly (reuse the intro-video title asset) before cutting to Act II's opening screen.

---

# ACT II — "The Man Who Chose Well" (Karth-Muun)

### Screen 1 — Battlefield establishing shot
1. Fade in on Frozen Battlefield background (wide/epic framing), Ari Aspect 2 sprite small in frame to sell scale — slow Ken Burns zoom-in over 4 seconds before gameplay unlocks.
2. Tab bar visible but Nara-0 tab greyed out/disabled for this act's opening (signals "you're committed to this scene for now" — reintroduce cross-tab puzzles mid-act once mechanic is re-established).

### Screen 2 — Combat introduction
3. Enemy squad sprite group fades in from the right side of the screen.
4. Combat UI appears: Prune/Graft stance icons (bottom corner), health bar.
5. Tutorial popup: **[Click enemy to target — hold to charge a Prune strike]**
6. Since assets are static 2D, combat plays as a **stance-and-timing click battler** rather than real-time action: player picks Prune or Graft stance (swaps a small stance-icon UI state), then clicks the enemy sprite on a rhythm/timing prompt (a simple filling bar or pulsing ring overlay) to land a "clean" hit. Successful hits swap the enemy sprite to a "staggered" pose image; a finishing click swaps it to a "defeated" pose or fades it out.
7. This loop repeats for a small wave (3-4 enemies) — first real combat encounter, keep it short and readable.

### Screen 3 — The loop-reset beat
8. After the wave, screen briefly flashes white/cold-blue, sprites reset to their Screen 2 starting positions (visually communicates the time-loop without needing new animation — just replaying the same static setup).
9. Narration: *"It resets. Not you. Just — everything else."*

### Screen 4 — Meeting Kael
10. New sprite fades in: Kael Orin, positioned opposite Ari.
11. Dialogue sequence plays (Kael's introduction lines, his "she was never a prize between us" line).
12. A second background character silhouette (Mirael, Karth-Muun variant) appears distant/small in the background layer, non-interactive — visual context only, not a full scene yet.

### Screen 5 — Pruning tutorial (partial loop-break)
13. Hotspot appears on the Frost-Curse Heart Chamber entrance (a doorway region on the battlefield background, or a scene-transition hotspot to a new background image).
14. Enter chamber → Curse-Heart background/object image (cracked state) shown.
15. Prune-stance tutorial popup: **[Hold to charge, release on the glowing pulse]** — a timing-based single interaction, not a full fight yet (full fight is Act VII).
16. Successful input → Curse-Heart image swaps to "partially cracked" state, VFX overlay (red-black Prune particles) plays once.
17. A small section of the battlefield background (shown on return to Screen 1's environment) is now in an alternate "thawed corner" state — plant this visual change permanently for the rest of the act.

### Screen 6 — The dying soldier
18. New background/framing: a close, intimate shot (crop in tighter than the wide battlefield shot — use a cropped/zoomed version of the battlefield image, or a dedicated close-up background).
19. Dying Soldier sprite, lying down pose.
20. Dialogue plays out, ending on the doubt-seed line: *"Careful who tells you what you want to hear..."*
21. Soldier sprite fades out (opacity animate to 0) — no death animation needed, the fade sells it respectfully.
22. Beat of silence — no music, 2-3 seconds — before act transitions. Let it sit.

### Act II ends
23. Cross-fade to black, tab bar re-enables Nara-0 tab as available (though the story moves to Act III next, not back to Nara-0 yet — this just signals "you could revisit if you wanted," supporting nonlinear exploration if your build allows free tab access between acts).

---

# ACT III — "A Glimpse, Uninvited" (Root Below — vision)

### Screen 1 — The intrusion
1. NO fade-in — this act should interrupt jarringly. If built as a scripted trigger after Act II, cut hard (no transition) directly to a distorted version of the Root Below background (apply a cheap "vision" filter: desaturate, add chromatic-aberration-style color offset if your tool supports it, or simply overlay a semi-transparent noise/static texture PNG on top of the background image).
2. Tab bar is HIDDEN entirely this act — mechanically reinforces "you are not in control right now."

### Screen 2 — Drifting
3. Player input is limited: clicking anywhere causes the background to slowly pan (not toward a destination the player chose — a fixed, pre-set slow drift, ignoring where they clicked) — this fakes "loss of agency" cheaply, since you're just playing a pre-set camera pan regardless of input.
4. No dialogue box UI chrome — if you have any narration here, render it directly on-screen as large, semi-transparent text that fades in/out, not in a normal dialogue box (visually distinct from every other act).

### Screen 3 — The dead Ari (unstable version)
5. Dead Ari sprite (unstable/vision variant asset from Doc 4) fades in, partially obscured by the noise-overlay.
6. Player is NOT given a hotspot to click on it — deliberately withheld, contrasting Act VIII where they can.
7. After 3-4 seconds of holding this frame, the whole screen "tears" — a fast white-flash cut, harder and more jarring than Act I's white-flash (shorter duration, higher opacity, maybe paired with a sharp SFX sting).

### Screen 4 — Waking
8. Hard cut to whichever reality background the player was last in before Act III triggered (Karth-Muun, most likely), Ari sprite in a "waking startled" pose if you have one, or just a snap-back to normal framing.
9. Senn fades in.
10. Dialogue: Ari's question, Senn's non-answer ("Nothing that's happened yet. Rest.") — direct from the story doc.
11. Fade to black, tab bar re-enabled.

---

# ACT IV — "The Father Who Catalogued a Death" (Ora-Vell)

### Screen 1 — Arrival
1. Fade in on Grand Ward background, Ari Aspect 3 (Patient) sprite, posture/positioning should read "recovering" — if you only have one pose, a simple trick: render this sprite slightly smaller/lower in frame than other acts, implying weakness without new art.
2. Slow Ken Burns push-in to establish scale of the opulent hall.

### Screen 2 — Investigation puzzle (document reconstruction)
3. Transition to Veyr's Archive background.
4. Puzzle UI: a set of 5-6 draggable "document" image tiles (simple rectangles with text/illustration, can literally be styled as parchment/paper images) scattered on screen.
5. Player drags tiles into a horizontal timeline order (simple drag-and-drop, very buildable with static images + basic drag logic).
6. Correct order → tiles glow gold, a final hidden document tile fades in at the end of the row.
7. Click final tile → full-screen close-up of that "document" image with its text fully legible, dramatic pause before dialogue resumes.

### Screen 3 — The reveal
8. Narration/text overlay (large on-screen text style, similar treatment to Act III's vision but WITHOUT the noise-overlay — this is real, not a vision, keep visually distinct):
   *"Fifteen deaths. Not fifteen different griefs — one grief wearing fifteen coats..."*
9. Background subtly shifts — a dark vignette creeps in from the edges of the Archive image (simple gradient overlay, animated opacity) as the weight of the discovery lands.

### Screen 4 — Concept tutorial (the Invariant)
10. A special "relic" hotspot appears — clicking it opens a full-screen diagram overlay (a single illustrated image you can commission/generate: simple branching-lines diagram showing "many things, one unchanging point").
11. Tutorial popup explains the invariant concept directly to the player, not just Ari — this is a rare moment of breaking toward direct player-address, useful because this concept is mechanically necessary for later puzzles.

### Act IV ends
12. Fade to black.

---

# ACT V — "The Reality That Almost Lied Perfectly" (Glass Eden)

### Screen 1 — Arrival
1. Fade in on Eternal Garden background — use a slightly longer, slower fade than other acts (3-4 seconds) to establish the "too calm" mood.
2. Ari Aspect 4 sprite, relaxed pose if available.
3. No music sting, no UI popups — let this screen sit in near-silence for a beat before anything happens. Restraint is the tool here.

### Screen 2 — Mirael (projection)
4. Glass Eden Mirael sprite fades in, positioned close to Ari (closer framing than other character-meeting scenes in the game so far — visually signal intimacy).
5. Dialogue sequence plays — warm, hopeful lines, deliberately the "happiest" dialogue exchange in the whole game so far.
6. Optional: a subtle visual tell for attentive players — the Mirael sprite could have an almost-imperceptible glow/outline (5-10% opacity soft glow) throughout this scene, invisible unless you're looking, foreshadowing "this isn't real" without spelling it out.

### Screen 3 — The Mirror Pool puzzle
7. Transition to Mirror Pool background.
8. "Find the flaw" puzzle: present the pool reflection as a second image layered on top of the sky — player must click the ONE detail that doesn't match (a single differently-colored star, or a reflected object that isn't present above) — classic spot-the-difference mechanic, cheap and effective with static images.
9. Correct click → the reflection image cracks (swap to a cracked-glass version of the same asset) and the whole Glass Eden background begins to desaturate (simple color-filter animation, gradually reducing saturation over 3-4 seconds).

### Screen 4 — The collapse and the true line
10. Glass Eden Mirael sprite fades out entirely (dissolve, not a dramatic destruction — respectful, sad, not horror-coded).
11. A moment of empty background (no character on screen at all) — let it breathe for 2-3 seconds.
12. The REAL Mirael-of-this-branch sprite fades in (same base Mirael asset, no "too-perfect" glow this time).
13. Her key line delivered: *"You were never unworthy, Ari..."*
14. Senn fades in at the edge of frame, but is NOT part of this dialogue — positioned watching, silent. If you can manage even a subtle "looking away" alternate pose for Senn here, use it; if not, simply having Senn present-but-silent during this exchange sells the second crack.

### Act V ends
15. Fade to black, longer hold than usual before cutting (let the emotional beat land).

---

# ACT VI — "What Memory Gives Back" (Nara-0, revisit)

### Screen 1 — Return
1. Fade in on the apartment background — but use a subtly different lighting overlay (slightly warmer or slightly dimmer color-grade layer) to signal time has passed / Ari has changed, even with the same background asset.
2. Ari Aspect 1 sprite — if you can generate even one alternate "wearier" version of this sprite (different eyes/posture), use it here; if not, the lighting shift alone can carry it.

### Screen 2 — The drawer, revisited
3. Hotspot glows on the same drawer object from Act I.
4. Click → new tutorial-free Graft interaction (player already knows this mechanic — no popup this time, mechanically signals mastery).
5. Drawer swaps fully to "open" state image (a third version of this asset: locked → cracked (Act I) → open (Act VI)).

### Screen 3 — The memory-playback vision
6. Screen transitions into a vision sequence — visually distinct from Act III's vision (Act III used noise/static distortion for disorientation; this one should use a soft, warm double-exposure blend instead, since this vision is coherent, not disorienting).
7. A sequence of 3-4 quick background cross-fades (fragments of the Witness Mind's memory: brief glimpses of other candidate-Aris, indistinct/blurred, before settling on a clear image representing Ari's own invariant) — this can be built entirely from existing character/background assets layered with blur filters, no new art required.
8. Text overlay narration carries the reveal: *why* Ari was chosen.

### Act VI ends
9. Vision fades, return to normal apartment lighting. Fade to black.

---

# ACT VII — "Breaking the Loop" (Karth-Muun, revisit)

### Screen 1 — Return to the battlefield
1. Fade in on Frozen Battlefield background — but use the "thawed corner" state established back in Act II Screen 5, expanded further (if you generated a second alternate version showing more thaw, use it; otherwise the single altered-corner asset still communicates progress).

### Screen 2 — The Curse-Heart boss encounter
2. Transition to Curse-Heart Chamber, now in its more-cracked state.
3. This is your first full boss fight — build it as an extended version of Act II's combat loop: multiple stance-switch prompts (Prune AND Graft required this time — e.g., Graft-stance prompts to "stabilize" the shaking chamber background between Prune-stance damage phases, sold via a simple screen-shake effect that stops when the player hits the Graft prompt correctly).
4. Structure: 3 rounds of Prune-damage-phase → Graft-stabilize-phase → repeat, final round ends with the Curse-Heart image swapping to its fully destroyed state (shattered/dark, no more glow).

### Screen 3 — Kael's payoff line
5. Cut to battlefield background, now shown in a fully-thawed state (green/thaw color grade overlay replacing the ice-white palette — a strong, satisfying visual payoff for a puzzle-heavy act).
6. Kael sprite present, watching.
7. His line: *"Some things are supposed to end once and mean it."* — deliver this slowly, hold on his sprite for a beat before fading.

### Act VII ends
8. Fade to black.

---

# ACT VIII — "The Proof He Wasn't Ready For" (The Root Below, full)

### Screen 1 — Entry (contrast with Act III)
1. Fade in on Dead Branches background — this time with tab bar fully visible/enabled (signals: this is real access, not an intrusion, contrasting Act III directly).
2. Ari Aspect 5 (Composite) sprite used for the first time here — establish this visually as a meaningful shift (this sprite should look different enough from earlier aspects that players notice immediately).

### Screen 2 — Exploration
3. This act should have the MOST hotspots of any act — multiple small lore-item hotspots scattered across the Dead Branches background (Witness Fragment collectibles), each opening a short text/image popup when clicked. Purely optional, rewards exploration.
4. A final mandatory hotspot leads to the Dead Ari Site.

### Screen 3 — The full reveal
5. Transition to Dead Ari Site (full/stable version asset — the clear, non-distorted version from Doc 4).
6. THIS time, a hotspot IS available directly on the dead Ari sprite (contrasting Act III's withheld interaction).
7. Click it → close-up crop/zoom on the carved text at the figure's base, rendered as fully legible on-screen text.
8. The full explanation plays out via narration text.

### Screen 4 — Senn's confession
9. Senn fades in, positioned smaller/lower in frame than usual (a simple positioning choice to sell "diminished," even without a new pose asset).
10. Dialogue: *"I knew what happens if it doesn't happen, too. I chose the version where you kept walking."*
11. Hold this frame in silence for a few seconds after the line — no music, just ambient Root Below wind/embers SFX.

### Act VIII ends
12. Fade to black, slower than usual.

---

# ACT IX — "What Veyr Knows That Ari Doesn't" (Heartwood Siege)

### Screen 1 — Arrival
1. Fade in on Siege Approach background, epic wide framing, slow push-in.
2. Ari Aspect 5 sprite.

### Screen 2 — Veyr's dialogue (pre-fight)
3. Veyr sprite fades in from the opposite side of the screen — largest, most dramatic character-entrance framing in the game (consider a slower fade, 3+ seconds, and hold both characters in a wide two-shot before cutting closer).
4. His key lines delivered in full: *"I do not kill worlds. I end their loneliness."* / *"Every reality denied you. Why defend them?"*
5. Ari's rebuttal (the evolved Kael-callback line).

### Screen 3 — Phase 1: The fight
6. Full boss-fight structure, most complex combat sequence in the game: alternating Prune/Graft stance prompts, multiple "phases" signaled by swapping Veyr's sprite to alternate damaged-state poses (if you have 2-3 damage-state variants of his sprite, use them; if only one, use color-grade shifts — darker/redder overlay as he takes more damage — to fake progression).
7. The Nullroot's "wrongness" VFX (distortion overlay) should trigger on his special attacks, visually distinct from his normal-attack telegraph.
8. Boss defeated → his sprite swaps to a "kneeling/defeated" pose, VFX clears.

### Screen 4 — Phase 2: The truth (non-combat, guaranteed)
9. Combat UI fully disappears — signals clearly to the player "this next part isn't a fight, it's the point of the whole game."
10. Veyr's full monologue plays out — the invariant, why Ari was chosen, the Root Below confirmation, and the sharpest reveal about the Mind's incentive.
11. Camera (background) does a very slow zoom on Veyr's sprite throughout this monologue — the slowest, longest sustained push-in in the entire game, reserved for this because it's the emotional climax.
12. Veyr offers the Nullroot — a new item hotspot appears in the scene (the Nullroot asset, placed between the two characters).

### Act IX ends
13. Screen holds on the Nullroot hotspot, unclicked, as the act fades to black — deliberately end on the object itself, not a character, so the player carries the weight of the impending choice into Act X.

---

# ACT X — "Three Ways to Finish a Sentence" (The Heartwood — Endings)

### Screen 1 — Arrival at the Root Chamber
1. Fade in on Root Chamber background — the largest, most awe-scaled environment in the game, held on screen longer before any UI appears (let the player just look at it for 3-4 seconds).
2. Senn present. The Witness Mind's presence suggested within the background art itself (per Doc 4/2's description — the barely-visible face within the root patterns), not as a separate sprite layer necessarily — this can be baked into the background image itself.

### Screen 2 — The choice sequence (NOT a menu)
3. Rather than a dialogue-wheel, structure this as a short sequence of 2-3 smaller interactive beats that combine into an ending:
   - **Beat A:** What does the player do with the Nullroot hotspot (still carried from Act IX)? Options presented as physical actions in the scene — e.g., a hotspot on the ground ("set it down") vs. a hotspot on Ari's own hand/the weapon-slot UI ("take it up").
   - **Beat B:** A short dialogue exchange with Senn — player selects from 2-3 response lines that lean toward acceptance, anger, or transcendence (flavoring rather than fully branching, unless you want full branches).
   - **Beat C:** A final action at the Root itself — confirm the ending.
4. Track player choices across Beats A-C; combination determines which of the three endings triggers. (Simplest reliable version: Beat A alone can determine the ending if you want to keep it simple for a hackathon build — "set down" → Ending One, "take up + reject" → Ending Three, "take up + accept" → Ending Two.)

### Screen 3A — Ending One: The Regrowth
5. Background: Root Chamber background swaps to a "healed" alternate version (brighter, crack visually mended — one new asset variant, high value for the payoff).
6. Final scene: cut to Nara-0 Rain Streets background (bring the story full circle to where it started), Ari and Mirael sprites together, final dialogue exchange, slow fade to white (not black — white signals hope, distinct from every other act's black fade).

### Screen 3B — Ending Two: The Merge
7. Background: Root Chamber swaps to a "collapsing/merging" alternate version (realities visually bleeding together — color-mixing overlay effect across the whole frame).
8. Final scene: Ari alone, sprite small in an oversized, empty frame — deliberate use of negative space to sell the hollowness of this ending. Fade to black, no music, just silence held for several seconds before credits.

### Screen 3C — Ending Three: The Sundering
9. Background: Root Chamber background, Ari sprite dissolving into the root-pattern itself (a cross-fade of his sprite directly into the background art, opacity animating to 0 while the background's glow intensifies to compensate).
10. Final scene: cut to Nara-0, Mirael alone, looking at a flickering lamp (from Act I) — final narration line, slow fade to a soft grey (distinct again from the other two endings' fade colors).

### Game ends
11. Credits sequence — can reuse the intro video's title-card asset as a bookend.
