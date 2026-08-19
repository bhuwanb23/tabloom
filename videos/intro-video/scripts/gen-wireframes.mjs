/**
 * Writes 10 wireframe sketch compositions for the storyboard board.
 * Plain blocks + real copy; void bg + ink + auric accent; empty paused timelines.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "compositions", "frames");
mkdirSync(dir, { recursive: true });

const frames = [
  {
    id: "01-darkness",
    file: "01-darkness.html",
    title: "DARKNESS",
    meta: "BRANCH · BEFORE",
    blocks: [
      { cls: "media-block", label: "void / rain breath", style: "top:120px;left:160px;width:1600px;height:720px;" },
      { cls: "label", text: "REMEMBRANCE RAIN", style: "top:80px;left:160px;" },
      { cls: "vo", text: "Before men named the stars… there was Aevum.", style: "bottom:100px;left:160px;width:1400px;" },
    ],
  },
  {
    id: "02-aevum-tree",
    file: "02-aevum-tree.html",
    title: "AEVUM",
    meta: "WORLD-TREE OF BECOMING",
    blocks: [
      { cls: "media-block tall", label: "cosmic tree plate", style: "top:80px;left:480px;width:960px;height:900px;" },
      { cls: "chip", text: "world-glimpse", style: "top:180px;left:160px;" },
      { cls: "chip", text: "world-glimpse", style: "top:280px;right:160px;left:auto;" },
      { cls: "chip", text: "dead ages", style: "bottom:160px;left:200px;" },
      { cls: "vo", text: "A living bough of all that might become.", style: "bottom:80px;left:160px;width:1400px;" },
    ],
  },
  {
    id: "03-the-mind",
    file: "03-the-mind.html",
    title: "THE MIND",
    meta: "THAT REMEMBERS",
    blocks: [
      { cls: "media-block", label: "faceless light-figure", style: "top:140px;left:560px;width:800px;height:700px;" },
      { cls: "accent-bar", text: "VEIL OF SEVERANCE", style: "top:480px;left:160px;width:1600px;" },
      { cls: "label", text: "HEARTWOOD", style: "top:100px;left:160px;" },
      { cls: "vo", text: "It held the Veil, and by that Veil, all things remained themselves.", style: "bottom:80px;left:160px;width:1500px;" },
    ],
  },
  {
    id: "04-veyr-luma",
    file: "04-veyr-luma.html",
    title: "VEY R",
    meta: "ORA-VELL · GRIEF",
    blocks: [
      { cls: "media-block half", label: "Luma · ash", style: "top:160px;left:140px;width:780px;height:640px;" },
      { cls: "media-block half", label: "Luma · laughing", style: "top:160px;left:1000px;width:780px;height:640px;border-color:#C9A227;" },
      { cls: "label", text: "ONE BRANCH / ANOTHER", style: "top:100px;left:160px;" },
      { cls: "vo", text: "From that hour, grief put on the raiment of mercy.", style: "bottom:80px;left:160px;width:1500px;" },
    ],
  },
  {
    id: "05-lament-engine",
    file: "05-lament-engine.html",
    title: "LAMENT",
    meta: "CONCORD OF ONE",
    blocks: [
      { cls: "media-block", label: "cathedral of memory", style: "top:100px;left:200px;width:1520px;height:760px;" },
      { cls: "focal", text: "◉ CONCORD EYE", style: "top:420px;left:760px;" },
      { cls: "vo", text: "He gave it sorrow beyond measure.", style: "bottom:80px;left:160px;width:1500px;" },
    ],
  },
  {
    id: "06-shattering",
    file: "06-shattering.html",
    title: "SHATTER",
    meta: "THE BLEED",
    blocks: [
      { cls: "media-block", label: "Aevum cracks / rain→snow", style: "top:100px;left:160px;width:1600px;height:740px;border-color:#D4A017;" },
      { cls: "crack", text: "✕", style: "top:300px;left:900px;" },
      { cls: "vo", text: "And in that breath, Aevum shattered.", style: "bottom:80px;left:160px;width:1500px;" },
    ],
  },
  {
    id: "07-ari-wakes",
    file: "07-ari-wakes.html",
    title: "ARI VAAN",
    meta: "NARA-0 · THE WOUND",
    blocks: [
      { cls: "media-block", label: "rain apartment · Ari on floor", style: "top:120px;left:280px;width:1360px;height:700px;" },
      { cls: "chip", text: "15 shadows", style: "top:160px;left:160px;" },
      { cls: "vo", text: "Only the wound that endured.", style: "bottom:80px;left:160px;width:1500px;" },
    ],
  },
  {
    id: "08-mirael-hope",
    file: "08-mirael-hope.html",
    title: "MIRAEL",
    meta: "A NAME · A KEY",
    blocks: [
      { cls: "media-block soft", label: "soft rain memory (face veiled)", style: "top:120px;left:420px;width:1080px;height:720px;" },
      { cls: "chip", text: "hope only", style: "top:160px;left:160px;" },
      { cls: "vo", text: "Where a heart still hopes, even a broken god may place a key.", style: "bottom:80px;left:160px;width:1500px;" },
    ],
  },
  {
    id: "09-terminal",
    file: "09-terminal.html",
    title: "TERMINAL",
    meta: "BRANCHFALL",
    blocks: [
      { cls: "media-block mono", label: "nara-0://ari/terminal", style: "top:140px;left:260px;width:900px;height:620px;" },
      { cls: "media-block mono", label: "TAB 2 · glitch open", style: "top:200px;left:1080px;width:680px;height:560px;border-color:#A8C4D4;" },
      { cls: "vo", text: "Find the five severed relics. Restore the bough.", style: "bottom:80px;left:160px;width:1500px;" },
    ],
  },
  {
    id: "10-title",
    file: "10-title.html",
    title: "TABLOOM",
    meta: "THE LAST MIND OF AEVUM",
    blocks: [
      { cls: "media-block", label: "Karth-Muun · Oathblade · dual Ari", style: "top:80px;left:160px;width:1600px;height:680px;" },
      { cls: "title-lock", text: "TABLOOM", style: "bottom:180px;left:0;width:1920px;text-align:center;" },
      { cls: "subtitle", text: "THE LAST MIND OF AEVUM", style: "bottom:120px;left:0;width:1920px;text-align:center;" },
      { cls: "vo", text: "I remember dying.", style: "top:80px;left:160px;" },
    ],
  },
];

function htmlFor(f) {
  const blocks = f.blocks
    .map((b) => {
      if (b.cls.includes("media-block")) {
        return `<div class="${b.cls}" style="${b.style}"><span>${b.label}</span></div>`;
      }
      return `<div class="${b.cls}" style="${b.style}">${b.text}</div>`;
    })
    .join("\n      ");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  </head>
  <body>
    <template>
      <style>
        #root {
          position: absolute;
          inset: 0;
          width: 1920px;
          height: 1080px;
          overflow: hidden;
          background: #07090F;
          color: #E8E2D4;
          font-family: "Montserrat", sans-serif;
        }
        .wire-chrome {
          position: absolute;
          top: 48px;
          left: 160px;
          right: 160px;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          z-index: 5;
        }
        .wire-chrome .t {
          font-family: "Spectral", serif;
          font-weight: 700;
          font-size: 42px;
          letter-spacing: 0.12em;
          color: #F4EBD0;
        }
        .wire-chrome .m {
          font-family: "IBM Plex Mono", monospace;
          font-size: 18px;
          letter-spacing: 0.18em;
          color: #C9A227;
        }
        .media-block {
          position: absolute;
          border: 3px solid #8A8496;
          background: rgba(14, 18, 28, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        .media-block span {
          font-family: "IBM Plex Mono", monospace;
          font-size: 22px;
          color: #8A8496;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .media-block.soft { border-style: dashed; opacity: 0.95; }
        .media-block.mono { border-color: #C9A227; }
        .label {
          position: absolute;
          font-family: "IBM Plex Mono", monospace;
          font-size: 20px;
          letter-spacing: 0.2em;
          color: #C9A227;
          z-index: 4;
        }
        .chip {
          position: absolute;
          font-family: "IBM Plex Mono", monospace;
          font-size: 18px;
          padding: 10px 16px;
          border: 2px solid #C9A227;
          color: #F4EBD0;
          z-index: 4;
        }
        .accent-bar {
          position: absolute;
          height: 48px;
          border-top: 2px solid #F4EBD0;
          border-bottom: 2px solid #F4EBD0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "IBM Plex Mono", monospace;
          font-size: 20px;
          letter-spacing: 0.35em;
          color: #F4EBD0;
          z-index: 4;
        }
        .focal {
          position: absolute;
          font-family: "Spectral", serif;
          font-size: 36px;
          color: #C9A227;
          z-index: 4;
        }
        .crack {
          position: absolute;
          font-size: 120px;
          color: #D4A017;
          z-index: 4;
          opacity: 0.85;
        }
        .title-lock {
          position: absolute;
          font-family: "Spectral", serif;
          font-weight: 700;
          font-size: 96px;
          letter-spacing: 0.2em;
          color: #F4EBD0;
          z-index: 6;
        }
        .subtitle {
          position: absolute;
          font-family: "IBM Plex Mono", monospace;
          font-size: 28px;
          letter-spacing: 0.28em;
          color: #C9A227;
          z-index: 6;
        }
        .vo {
          position: absolute;
          font-family: "Montserrat", sans-serif;
          font-size: 28px;
          line-height: 1.4;
          color: #E8E2D4;
          z-index: 6;
        }
        .reg {
          position: absolute;
          bottom: 40px;
          right: 80px;
          font-family: "IBM Plex Mono", monospace;
          font-size: 16px;
          color: #8A8496;
          letter-spacing: 0.12em;
        }
      </style>
      <div id="root" data-composition-id="${f.id}" data-width="1920" data-height="1080">
        <div class="wire-chrome">
          <div class="t">${f.title}</div>
          <div class="m">${f.meta}</div>
        </div>
      ${blocks}
        <div class="reg">WF · ${f.id.toUpperCase()}</div>
      </div>
      <script>
        window.__timelines = window.__timelines || {};
        const tl = gsap.timeline({ paused: true });
        window.__timelines["${f.id}"] = tl;
      </script>
    </template>
  </body>
</html>
`;
}

for (const f of frames) {
  writeFileSync(join(dir, f.file), htmlFor(f));
  console.log("wrote", f.file);
}
console.log("wireframes ready:", frames.length);
