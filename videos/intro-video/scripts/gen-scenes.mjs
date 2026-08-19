/**
 * Regenerates dressed+animated frames with lint-clean paths/fonts.
 * Asset paths are project-root relative (assets/...). Display font: Oswald.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "compositions", "frames");
mkdirSync(dir, { recursive: true });

const sharedCss = `
#root{position:absolute;inset:0;width:1920px;height:1080px;overflow:hidden;background:#07090F;color:#E8E2D4;font-family:"Montserrat",sans-serif}
.shake{position:absolute;inset:0}
.plate-far{position:absolute;inset:-40px;width:calc(100% + 80px);height:calc(100% + 80px);background-position:center;background-size:cover;background-repeat:no-repeat;transform-origin:50% 45%}
.plate-mid{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(244,235,208,.12),transparent 55%);pointer-events:none}
.chrome{position:absolute;top:56px;left:100px;right:100px;display:flex;justify-content:space-between;z-index:8;font-family:"IBM Plex Mono",monospace;font-size:18px;letter-spacing:.22em;color:#C9A227}
.title{position:absolute;left:100px;bottom:180px;max-width:1400px;font-family:"Oswald",sans-serif;font-weight:700;font-size:68px;line-height:1.1;color:#F4EBD0;z-index:8;text-shadow:0 4px 40px rgba(0,0,0,.65);letter-spacing:.04em}
.caption{position:absolute;left:100px;bottom:100px;font-size:28px;color:#E8E2D4;z-index:8;opacity:.92;font-family:"Montserrat",sans-serif}
.glyph{position:absolute;z-index:7;pointer-events:none}
.rain{position:absolute;inset:0;z-index:4;background-image:repeating-linear-gradient(100deg,transparent 0 14px,rgba(74,90,106,.18) 14px 15px);mix-blend-mode:screen;pointer-events:none}
.embers{position:absolute;inset:0;z-index:5;background:radial-gradient(circle at 30% 35%,rgba(201,162,39,.35) 0 2px,transparent 3px),radial-gradient(circle at 55% 28%,rgba(244,235,208,.4) 0 2px,transparent 3px),radial-gradient(circle at 70% 42%,rgba(201,162,39,.3) 0 2px,transparent 3px);pointer-events:none}
.pulse{position:absolute;left:50%;top:40%;width:420px;height:420px;margin:-210px 0 0 -210px;border-radius:50%;background:radial-gradient(circle,rgba(244,235,208,.35),transparent 65%);z-index:3}
.gold-wash{position:absolute;inset:0;background:radial-gradient(ellipse at 75% 45%,rgba(201,162,39,.35),transparent 50%);z-index:3;pointer-events:none}
.flash{position:absolute;inset:0;background:#F4EBD0;z-index:9;opacity:0;pointer-events:none}
.soft-veil{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(244,235,208,.2),transparent 55%);z-index:3}
.ember{position:absolute;left:50%;top:42%;width:200px;height:200px;margin:-100px;border-radius:50%;background:radial-gradient(circle,rgba(201,162,39,.45),transparent 70%);z-index:4}
.glitch-r,.glitch-b{position:absolute;inset:0;z-index:6;opacity:0;pointer-events:none}
.glitch-r{background:rgba(201,80,60,.25);mix-blend-mode:screen}
.glitch-b{background:rgba(80,160,200,.25);mix-blend-mode:screen}
.scan{position:absolute;left:0;width:100%;height:4px;background:linear-gradient(90deg,transparent,#A8C4D4,transparent);z-index:7;opacity:0}
.tab2{position:absolute;right:120px;top:220px;width:420px;height:480px;border:2px solid #A8C4D4;background:rgba(10,18,24,.55);z-index:5;opacity:0}
.tab2::after{content:"TAB · 02  →  KARTH-MUUN";position:absolute;left:28px;top:36px;font-family:"IBM Plex Mono",monospace;font-size:20px;color:#A8C4D4;letter-spacing:.12em}
.impact{position:absolute;inset:0;background:#F4EBD0;opacity:0;z-index:10;pointer-events:none}
.fade-end{position:absolute;inset:0;background:#000;opacity:0;z-index:12;pointer-events:none}
.grain{position:absolute;inset:0;z-index:11;pointer-events:none;opacity:.12;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")}
`;

const shots = [
  {
    id: "01-darkness",
    file: "01-darkness.html",
    dur: 6.2,
    plate: "assets/plates/01-darkness.png",
    metaL: "BEFORE",
    metaR: "REMEMBRANCE",
    title: "",
    caption: "Before men named the stars…",
    extraCss: "",
    layers: `<div class="plate-far" style="background-image:url('assets/plates/01-darkness.png')"></div><div class="rain"></div>`,
    anim: `
      tl.fromTo(q(".plate-far"), { scale: 1.0, y: 0 }, { scale: 1.06, y: -20, duration: 6.2, ease: "none" }, 0);
      tl.fromTo(q(".rain"), { opacity: 0 }, { opacity: 0.7, duration: 1.2, ease: "sine.out" }, 0.2);
      tl.fromTo(q(".caption"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.4, ease: "power2.out" }, 0.8);
      tl.fromTo(q(".meta-l"), { opacity: 0 }, { opacity: 1, duration: 1 }, 0.4);
    `,
  },
  {
    id: "02-aevum-tree",
    file: "02-aevum-tree.html",
    dur: 13,
    plate: "assets/plates/02-aevum-tree.png",
    metaL: "AEVUM",
    metaR: "WORLD-TREE",
    title: "A living bough",
    caption: "Worlds flowered apart",
    extraCss: "",
    layers: `<div class="plate-far" style="background-image:url('assets/plates/02-aevum-tree.png')"></div><div class="plate-mid"></div><div class="embers"></div>`,
    anim: `
      tl.fromTo(q(".plate-far"), { scale: 1.0, x: 0 }, { scale: 1.08, x: -30, duration: 13, ease: "none" }, 0);
      tl.fromTo(q(".plate-mid"), { y: 40, opacity: 0.6 }, { y: 0, opacity: 1, duration: 3, ease: "power2.out" }, 0);
      tl.fromTo(q(".title"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, 0.6);
      tl.fromTo(q(".caption"), { opacity: 0 }, { opacity: 1, duration: 1.2 }, 1.8);
      tl.fromTo(q(".embers"), { opacity: 0 }, { opacity: 0.9, duration: 2 }, 0.8);
    `,
  },
  {
    id: "03-the-mind",
    file: "03-the-mind.html",
    dur: 13,
    metaL: "THE MIND",
    metaR: "THAT REMEMBERS",
    title: "It held the Veil",
    caption: "All things remained themselves",
    extraCss: `.glyph{left:160px;top:460px;width:1600px;height:auto}`,
    layers: `<div class="plate-far" style="background-image:url('assets/plates/03-the-mind.png')"></div><div class="pulse"></div><img class="glyph" src="assets/glyphs/veil.png" alt="" />`,
    anim: `
      tl.fromTo(q(".plate-far"), { scale: 1.02 }, { scale: 1.1, duration: 13, ease: "none" }, 0);
      tl.fromTo(q(".glyph"), { opacity: 0, scaleX: 0.6 }, { opacity: 0.85, scaleX: 1, duration: 2, ease: "power2.out" }, 1.0);
      tl.fromTo(q(".title"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.4 }, 0.5);
      tl.fromTo(q(".pulse"), { opacity: 0.2, scale: 0.9 }, { opacity: 0.55, scale: 1.08, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: 4 }, 0.4);
    `,
  },
  {
    id: "04-veyr-luma",
    file: "04-veyr-luma.html",
    dur: 20.3,
    metaL: "ORA-VELL",
    metaR: "GRIEF · MERCY",
    title: "Grief put on the raiment of mercy",
    caption: "One branch ash · another sun",
    extraCss: "",
    layers: `<div class="plate-far" style="background-image:url('assets/plates/04-veyr-luma.png')"></div><div class="gold-wash"></div>`,
    anim: `
      tl.fromTo(q(".plate-far"), { scale: 1.0, x: 20 }, { scale: 1.05, x: -20, duration: 20.3, ease: "none" }, 0);
      tl.fromTo(q(".title"), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.6, ease: "power2.out" }, 0.8);
      tl.fromTo(q(".gold-wash"), { opacity: 0 }, { opacity: 0.35, duration: 3, ease: "sine.out" }, 1.5);
      tl.fromTo(q(".caption"), { opacity: 0 }, { opacity: 1, duration: 1.2 }, 2.5);
    `,
  },
  {
    id: "05-lament-engine",
    file: "05-lament-engine.html",
    dur: 14.5,
    metaL: "CONCORD OF ONE",
    metaR: "LAMENT ENGINE",
    title: "Sorrow beyond measure",
    caption: "Remembered too much",
    extraCss: `.glyph{left:760px;top:300px;width:400px;height:400px}`,
    layers: `<div class="plate-far" style="background-image:url('assets/plates/05-lament-engine.png')"></div><img class="glyph" src="assets/glyphs/concord-eye.png" alt="" />`,
    anim: `
      tl.fromTo(q(".plate-far"), { scale: 1.0, y: 0 }, { scale: 1.07, y: -16, duration: 14.5, ease: "none" }, 0);
      tl.fromTo(q(".glyph"), { opacity: 0, scale: 0.6, rotate: 0 }, { opacity: 1, scale: 1, rotate: 8, duration: 2.5, ease: "power3.out" }, 1.0);
      tl.fromTo(q(".title"), { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0.5);
    `,
  },
  {
    id: "06-shattering",
    file: "06-shattering.html",
    dur: 9.6,
    metaL: "THE BLEED",
    metaR: "ONE BREATH",
    title: "Aevum shattered",
    caption: "Every world heard every wound",
    extraCss: `.glyph{left:0;top:0;width:1920px;height:1080px}`,
    layers: `<div class="plate-far" style="background-image:url('assets/plates/06-shattering.png')"></div><div class="flash"></div><img class="glyph" src="assets/glyphs/cracks.png" alt="" />`,
    anim: `
      tl.fromTo(q(".plate-far"), { scale: 1.0 }, { scale: 1.12, duration: 9.6, ease: "power1.in" }, 0);
      tl.fromTo(q(".glyph"), { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "power4.out" }, 2.0);
      tl.fromTo(q(".shake"), { x: 0 }, { x: 12, duration: 0.08, yoyo: true, repeat: 7, ease: "none" }, 2.0);
      tl.fromTo(q(".title"), { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.8, ease: "power4.out" }, 2.3);
      tl.fromTo(q(".flash"), { opacity: 0 }, { opacity: 0.55, duration: 0.12, yoyo: true, repeat: 1 }, 2.05);
    `,
  },
  {
    id: "07-ari-wakes",
    file: "07-ari-wakes.html",
    dur: 14.5,
    metaL: "NARA-0",
    metaR: "ARI VAAN",
    title: "The wound that endured",
    caption: "Not lord. Not saint.",
    extraCss: "",
    layers: `<div class="plate-far" style="background-image:url('assets/plates/07-ari-wakes.png')"></div><div class="rain"></div>`,
    anim: `
      tl.fromTo(q(".plate-far"), { scale: 1.04, y: 10 }, { scale: 1.0, y: 0, duration: 14.5, ease: "none" }, 0);
      tl.fromTo(q(".rain"), { opacity: 0 }, { opacity: 0.55, duration: 1.5 }, 0.2);
      tl.fromTo(q(".title"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.5 }, 1.0);
      tl.fromTo(q(".caption"), { opacity: 0 }, { opacity: 1, duration: 1.2 }, 2.2);
    `,
  },
  {
    id: "08-mirael-hope",
    file: "08-mirael-hope.html",
    dur: 9.3,
    metaL: "MIRAEL",
    metaR: "A KEY",
    title: "Where a heart still hopes",
    caption: "A name the worlds had not erased",
    extraCss: "",
    layers: `<div class="plate-far" style="background-image:url('assets/plates/08-mirael-hope.png')"></div><div class="soft-veil"></div><div class="ember"></div>`,
    anim: `
      tl.fromTo(q(".plate-far"), { scale: 1.0 }, { scale: 1.06, duration: 9.3, ease: "none" }, 0);
      tl.fromTo(q(".soft-veil"), { opacity: 0.15 }, { opacity: 0.4, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0);
      tl.fromTo(q(".title"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.6 }, 0.6);
      tl.fromTo(q(".ember"), { opacity: 0, scale: 0.8 }, { opacity: 0.7, scale: 1, duration: 2, ease: "sine.out" }, 1.2);
    `,
  },
  {
    id: "09-terminal",
    file: "09-terminal.html",
    dur: 8.8,
    metaL: "TERMINAL",
    metaR: "BRANCHFALL",
    title: "Find the five severed relics",
    caption: "Restore the bough",
    extraCss: "",
    layers: `<div class="plate-far" style="background-image:url('assets/plates/09-terminal.png')"></div><div class="glitch-r"></div><div class="glitch-b"></div><div class="scan"></div><div class="tab2"></div>`,
    anim: `
      tl.fromTo(q(".plate-far"), { opacity: 0.7 }, { opacity: 1, duration: 0.8 }, 0);
      tl.fromTo(q(".glitch-r"), { opacity: 0, x: 0 }, { opacity: 0.35, x: 8, duration: 0.12, yoyo: true, repeat: 5 }, 0.3);
      tl.fromTo(q(".glitch-b"), { opacity: 0, x: 0 }, { opacity: 0.35, x: -8, duration: 0.12, yoyo: true, repeat: 5 }, 0.3);
      tl.fromTo(q(".tab2"), { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" }, 2.0);
      tl.fromTo(q(".title"), { opacity: 0 }, { opacity: 1, duration: 1 }, 0.8);
      tl.fromTo(q(".scan"), { y: -200, opacity: 0.4 }, { y: 900, opacity: 0, duration: 1.8, ease: "none", repeat: 3 }, 0.4);
    `,
  },
  {
    id: "10-title",
    file: "10-title.html",
    dur: 11,
    metaL: "KARTH-MUUN",
    metaR: "OATHBLADE",
    title: "",
    caption: "I remember dying.",
    extraCss: `.glyph{left:260px;bottom:80px;width:1400px;height:auto}.caption{top:120px;bottom:auto;left:100px;font-family:"Oswald",sans-serif;font-size:42px;font-style:normal;letter-spacing:.06em;color:#F4EBD0}`,
    layers: `<div class="plate-far" style="background-image:url('assets/plates/10-title.png')"></div><div class="impact"></div><img class="glyph" src="assets/glyphs/title-lockup.png" alt="" /><div class="fade-end"></div>`,
    anim: `
      tl.fromTo(q(".plate-far"), { scale: 1.08 }, { scale: 1.0, duration: 4, ease: "power2.out" }, 0);
      tl.fromTo(q(".caption"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.2 }, 0.4);
      tl.fromTo(q(".glyph"), { opacity: 0, y: 40, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power4.out" }, 3.2);
      tl.fromTo(q(".impact"), { opacity: 0 }, { opacity: 0.4, duration: 0.15, yoyo: true, repeat: 1 }, 3.2);
      tl.to(q(".fade-end"), { opacity: 1, duration: 2, ease: "sine.in" }, 9);
    `,
  },
];

function html(s) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
</head>
<body>
<template>
<style>
${sharedCss}
${s.extraCss}
</style>
<div id="root" data-composition-id="${s.id}" data-width="1920" data-height="1080" data-duration="${s.dur}">
  <div class="shake">
    ${s.layers}
    <div class="chrome"><span class="meta-l">${s.metaL}</span><span class="meta-r">${s.metaR}</span></div>
    ${s.title ? `<div class="title">${s.title}</div>` : ""}
    ${s.caption ? `<div class="caption">${s.caption}</div>` : ""}
    <div class="grain"></div>
  </div>
</div>
<script>
window.__timelines = window.__timelines || {};
(function(){
  const host = document.getElementById("root");
  const q = (sel) => host.querySelector(sel);
  const tl = gsap.timeline({ paused: true });
  ${s.anim.trim()}
  window.__timelines["${s.id}"] = tl;
})();
</script>
</template>
</body>
</html>
`;
}

for (const s of shots) {
  writeFileSync(join(dir, s.file), html(s));
  console.log(s.file, s.dur);
}
console.log("ok", shots.length);
