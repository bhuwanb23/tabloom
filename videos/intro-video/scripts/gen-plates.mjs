/**
 * Generates mythic SVG plates + glyphs and rasterizes to transparent/scene PNGs via sharp.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svgDir = join(root, "assets", "svg");
const glyphDir = join(root, "assets", "glyphs");
const plateDir = join(root, "assets", "plates");
for (const d of [svgDir, glyphDir, plateDir]) mkdirSync(d, { recursive: true });

const V = "#07090F";
const INK = "#E8E2D4";
const REM = "#F4EBD0";
const GOLD = "#C9A227";
const BLEED = "#2A1A0A";
const EDGE = "#D4A017";
const COLD = "#A8C4D4";
const RAIN = "#4A5A6A";
const MUTED = "#8A8496";

const glyphs = {
  "concord-eye.svg": `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="g" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${REM}"/>
      <stop offset="55%" stop-color="${GOLD}"/>
      <stop offset="100%" stop-color="${BLEED}"/>
    </radialGradient>
  </defs>
  <circle cx="200" cy="200" r="18" fill="url(#g)"/>
  ${Array.from({ length: 15 }, (_, i) => {
    const a = (i / 15) * Math.PI * 2 - Math.PI / 2;
    const r = 70 + (i % 3) * 28;
    const x = 200 + Math.cos(a) * r;
    const y = 200 + Math.sin(a) * r;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${8 - (i % 3)}" fill="none" stroke="${GOLD}" stroke-width="2" opacity="${0.55 + (i % 3) * 0.12}"/>`;
  }).join("\n  ")}
  <ellipse cx="200" cy="200" rx="110" ry="48" fill="none" stroke="${REM}" stroke-width="2" opacity="0.7"/>
  <circle cx="200" cy="200" r="8" fill="${V}"/>
</svg>`,

  "veil.svg": `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 200" width="1920" height="200">
  <defs>
    <linearGradient id="v" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${REM}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${REM}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${REM}" stop and-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="80" y="98" width="1760" height="3" fill="url(#v)"/>
  <path d="M120 100 Q480 20 960 100 T1800 100" fill="none" stroke="${REM}" stroke-width="2" opacity="0.65"/>
  <path d="M120 100 Q480 180 960 100 T1800 100" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity="0.45"/>
</svg>`.replace("stop and-opacity", "stop-opacity"),

  "cracks.svg": `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <g fill="none" stroke="${BLEED}" stroke-width="10" stroke-linecap="round" opacity="0.7">
    <path d="M960 0 L940 280 L860 420 L960 540 L1020 780 L980 1080"/>
    <path d="M940 280 L720 340 L500 300"/>
    <path d="M940 280 L1180 320 L1400 280"/>
    <path d="M860 420 L700 560 L620 720"/>
    <path d="M960 540 L1180 600 L1320 760"/>
  </g>
  <g fill="none" stroke="${EDGE}" stroke-width="3" stroke-linecap="round" opacity="0.95">
    <path d="M960 0 L940 280 L860 420 L960 540 L1020 780 L980 1080"/>
    <path d="M940 280 L720 340 L500 300"/>
    <path d="M940 280 L1180 320 L1400 280"/>
    <path d="M860 420 L700 560 L620 720"/>
    <path d="M960 540 L1180 600 L1320 760"/>
  </g>
</svg>`,

  "title-lockup.svg": `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 320" width="1400" height="320">
  <text x="700" y="140" text-anchor="middle" font-family="Georgia, serif" font-size="92" font-weight="700" fill="${REM}" letter-spacing="18">TABLOOM</text>
  <line x1="420" y1="170" x2="980" y2="170" stroke="${GOLD}" stroke-width="1.5" opacity="0.75"/>
  <text x="700" y="220" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="${GOLD}" letter-spacing="10">THE LAST MIND OF AEVUM</text>
</svg>`,

  "terminal-frame.svg": `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="900" height="520">
  <rect x="10" y="10" width="880" height="500" rx="8" fill="#0C1018" stroke="${GOLD}" stroke-width="2"/>
  <rect x="10" y="10" width="880" height="36" rx="8" fill="#151A24"/>
  <circle cx="40" cy="28" r="6" fill="${MUTED}"/><circle cx="60" cy="28" r="6" fill="${MUTED}"/><circle cx="80" cy="28" r="6" fill="${GOLD}"/>
  <text x="40" y="90" font-family="monospace" font-size="20" fill="${MUTED}">nara-0://ari/terminal</text>
  <text x="40" y="150" font-family="monospace" font-size="26" fill="${REM}">IF YOU ARE READING THIS,</text>
  <text x="40" y="190" font-family="monospace" font-size="26" fill="${REM}">YOU ARE NOT THE FIRST ARI.</text>
  <text x="40" y="270" font-family="monospace" font-size="24" fill="${GOLD}">DO NOT OPEN THE OTHER WORLDS.</text>
  <text x="40" y="360" font-family="monospace" font-size="24" fill="${COLD}">OPEN THEM,</text>
  <text x="40" y="400" font-family="monospace" font-size="24" fill="${COLD}">OR THEY DIE ALONE.</text>
</svg>`,

  "particle.svg": `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <circle cx="16" cy="16" r="6" fill="${REM}" opacity="0.9"/>
  <circle cx="16" cy="16" r="12" fill="${REM}" opacity="0.2"/>
</svg>`,

  "rain-streak.svg": `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 48" width="8" height="48">
  <line x1="4" y1="0" x2="4" y2="48" stroke="${RAIN}" stroke-width="2" opacity="0.55"/>
</svg>`,
};

function plate(name, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="vignette" cx="50%" cy="45%" r="70%">
      <stop offset="40%" stop-color="${V}" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.75"/>
    </radialGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 0.08"/></feComponentTransfer>
    </filter>
  </defs>
  <rect width="1920" height="1080" fill="${V}"/>
  ${body}
  <rect width="1920" height="1080" fill="url(#vignette)"/>
  <rect width="1920" height="1080" filter="url(#grain)"/>
</svg>`;
}

const plates = {
  "01-darkness.svg": plate(
    "01",
    `
  <circle cx="960" cy="200" r="220" fill="${REM}" opacity="0.04"/>
  ${Array.from({ length: 40 }, (_, i) => {
      const x = 80 + ((i * 137) % 1760);
      const y = 40 + ((i * 97) % 1000);
      const h = 40 + (i % 5) * 18;
      return `<line x1="${x}" y1="${y}" x2="${x - 4}" y2="${y + h}" stroke="${RAIN}" stroke-width="2" opacity="${0.25 + (i % 4) * 0.1}"/>`;
    }).join("\n  ")}
  <text x="160" y="980" font-family="monospace" font-size="22" fill="${MUTED}" letter-spacing="6">BEFORE THE STARS</text>
`,
  ),

  "02-aevum-tree.svg": plate(
    "02",
    `
  <defs>
    <radialGradient id="canopy" cx="50%" cy="30%" r="45%">
      <stop offset="0%" stop-color="${REM}" stop-opacity="0.55"/>
      <stop offset="60%" stop-color="${GOLD}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${V}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="trunk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${REM}"/>
      <stop offset="100%" stop-color="${MUTED}"/>
    </linearGradient>
  </defs>
  <ellipse cx="960" cy="340" rx="520" ry="300" fill="url(#canopy)"/>
  <path d="M960 980 C920 780 900 620 960 420 C1020 620 1000 780 960 980 Z" fill="url(#trunk)" opacity="0.9"/>
  <path d="M960 480 C720 380 520 260 380 160" fill="none" stroke="${REM}" stroke-width="8" opacity="0.85"/>
  <path d="M960 480 C1200 380 1400 260 1540 160" fill="none" stroke="${REM}" stroke-width="8" opacity="0.85"/>
  <path d="M960 560 C780 520 620 440 460 340" fill="none" stroke="${GOLD}" stroke-width="4" opacity="0.7"/>
  <path d="M960 560 C1140 520 1300 440 1460 340" fill="none" stroke="${GOLD}" stroke-width="4" opacity="0.7"/>
  <path d="M960 640 C840 760 740 880 700 1000" fill="none" stroke="${MUTED}" stroke-width="5" opacity="0.55"/>
  <path d="M960 640 C1080 760 1180 880 1220 1000" fill="none" stroke="${MUTED}" stroke-width="5" opacity="0.55"/>
  ${[380,520,700,860,1060,1220,1400,480,640,800,1000,1180,1540,420,1480].map((x,i)=>{
    const y = 140 + (i%5)*70 + (i%3)*18;
    return `<circle cx="${x}" cy="${y}" r="${6+(i%4)}" fill="${i%2?GOLD:REM}" opacity="0.85"/>`;
  }).join("\n  ")}
  <text x="160" y="100" font-family="monospace" font-size="20" fill="${GOLD}" letter-spacing="8">AEVUM · LIVING BOUGH</text>
`,
  ),

  "03-the-mind.svg": plate(
    "03",
    `
  <defs>
    <radialGradient id="mind" cx="50%" cy="40%" r="40%">
      <stop offset="0%" stop-color="${REM}" stop-opacity="0.95"/>
      <stop offset="45%" stop-color="${REM}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${V}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="960" cy="420" rx="280" ry="360" fill="url(#mind)"/>
  <ellipse cx="960" cy="400" rx="90" ry="160" fill="${REM}" opacity="0.25"/>
  <ellipse cx="960" cy="280" rx="70" ry="80" fill="${REM}" opacity="0.35"/>
  ${[0,1,2,3,4].map(i=>{
    const a = (i/5)*Math.PI*2;
    const x = 960 + Math.cos(a)*60;
    const y = 420 + Math.sin(a)*90;
    return `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="18" ry="40" fill="${INK}" opacity="0.12"/>`;
  }).join("\n  ")}
  <path d="M200 540 Q960 420 1720 540" fill="none" stroke="${REM}" stroke-width="3" opacity="0.7"/>
  <path d="M200 560 Q960 680 1720 560" fill="none" stroke="${GOLD}" stroke-width="2" opacity="0.4"/>
  <text x="160" y="100" font-family="monospace" font-size="20" fill="${GOLD}" letter-spacing="8">THE MIND THAT REMEMBERS</text>
  <text x="160" y="980" font-family="monospace" font-size="18" fill="${MUTED}" letter-spacing="6">VEIL OF SEVERANCE</text>
`,
  ),

  "04-veyr-luma.svg": plate(
    "04",
    `
  <rect x="80" y="120" width="840" height="820" fill="#121018" stroke="${MUTED}" stroke-width="2"/>
  <rect x="1000" y="120" width="840" height="820" fill="#1A160C" stroke="${GOLD}" stroke-width="2"/>
  <circle cx="500" cy="420" r="120" fill="${MUTED}" opacity="0.25"/>
  <circle cx="500" cy="380" r="50" fill="${INK}" opacity="0.2"/>
  <path d="M420 560 Q500 620 580 560" fill="none" stroke="${MUTED}" stroke-width="3" opacity="0.4"/>
  <text x="500" y="780" text-anchor="middle" font-family="monospace" font-size="22" fill="${MUTED}">LUMA · ASH</text>
  <circle cx="1420" cy="400" r="140" fill="${GOLD}" opacity="0.2"/>
  <circle cx="1420" cy="360" r="55" fill="${REM}" opacity="0.45"/>
  <circle cx="1380" cy="520" r="30" fill="${GOLD}" opacity="0.35"/>
  <text x="1420" y="780" text-anchor="middle" font-family="monospace" font-size="22" fill="${GOLD}">LUMA · UNTOUCHED SUN</text>
  <text x="160" y="100" font-family="monospace" font-size="20" fill="${GOLD}" letter-spacing="8">ORA-VELL · SPLIT MERCY</text>
`,
  ),

  "05-lament-engine.svg": plate(
    "05",
    `
  <defs>
    <linearGradient id="nave" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${BLEED}" stop-opacity="0.8"/>
    </linearGradient>
  </defs>
  <path d="M200 980 L400 200 L1520 200 L1720 980 Z" fill="url(#nave)" opacity="0.55"/>
  <path d="M480 980 L640 280 L1280 280 L1440 980 Z" fill="${BLEED}" opacity="0.45"/>
  ${[520,700,880,1060,1240].map((x)=>`<rect x="${x}" y="320" width="40" height="660" fill="${GOLD}" opacity="0.15"/>`).join("\n  ")}
  <circle cx="960" cy="480" r="90" fill="none" stroke="${GOLD}" stroke-width="3" opacity="0.8"/>
  <circle cx="960" cy="480" r="28" fill="${REM}" opacity="0.85"/>
  ${Array.from({length:15},(_,i)=>{
    const a=(i/15)*Math.PI*2;
    const r=55+(i%3)*18;
    return `<circle cx="${(960+Math.cos(a)*r).toFixed(1)}" cy="${(480+Math.sin(a)*r).toFixed(1)}" r="4" fill="${GOLD}" opacity="0.7"/>`;
  }).join("\n  ")}
  <text x="160" y="100" font-family="monospace" font-size="20" fill="${GOLD}" letter-spacing="8">LAMENT ENGINE · CONCORD</text>
`,
  ),

  "06-shattering.svg": plate(
    "06",
    `
  <ellipse cx="960" cy="400" rx="400" ry="260" fill="${REM}" opacity="0.08"/>
  <path d="M960 120 C880 300 860 420 960 540 C1060 420 1040 300 960 120" fill="${INK}" opacity="0.15"/>
  <g fill="none" stroke="${EDGE}" stroke-width="4">
    <path d="M960 0 L940 280 L860 420 L960 540 L1020 780 L980 1080"/>
    <path d="M940 280 L600 340 L320 260"/>
    <path d="M940 280 L1300 300 L1600 240"/>
    <path d="M860 420 L640 640 L480 900"/>
    <path d="M960 540 L1280 620 L1500 900"/>
  </g>
  ${Array.from({length:25},(_,i)=>{
    const x=100+(i*73)%1720; const y=100+(i*111)%900;
    return `<circle cx="${x}" cy="${y}" r="${2+(i%3)}" fill="${i%2?COLD:REM}" opacity="0.5"/>`;
  }).join("\n  ")}
  <text x="160" y="100" font-family="monospace" font-size="20" fill="${EDGE}" letter-spacing="8">THE BLEED · ONE BREATH</text>
`,
  ),

  "07-ari-wakes.svg": plate(
    "07",
    `
  <rect x="320" y="140" width="1280" height="780" fill="#0C1018" stroke="${RAIN}" stroke-width="2"/>
  <rect x="360" y="180" width="400" height="520" fill="#101820" stroke="${MUTED}" stroke-width="1" opacity="0.7"/>
  <ellipse cx="980" cy="780" rx="180" ry="40" fill="#000" opacity="0.5"/>
  <ellipse cx="980" cy="700" rx="70" ry="100" fill="${INK}" opacity="0.22"/>
  <circle cx="980" cy="580" r="48" fill="${INK}" opacity="0.28"/>
  ${Array.from({length:15},(_,i)=>{
    const x = 520 + i*55;
    return `<ellipse cx="${x}" cy="720" rx="18" ry="70" fill="${MUTED}" opacity="${0.08 + (i%3)*0.04}"/>`;
  }).join("\n  ")}
  ${Array.from({length:30},(_,i)=>{
    const x=360+((i*91)%1200); const y=200+((i*53)%650); const h=30+(i%4)*12;
    return `<line x1="${x}" y1="${y}" x2="${x-3}" y2="${y+h}" stroke="${RAIN}" stroke-width="1.5" opacity="0.35"/>`;
  }).join("\n  ")}
  <text x="160" y="100" font-family="monospace" font-size="20" fill="${GOLD}" letter-spacing="8">NARA-0 · ARI VAAN</text>
`,
  ),

  "08-mirael-hope.svg": plate(
    "08",
    `
  <defs>
    <radialGradient id="soft" cx="50%" cy="45%" r="40%">
      <stop offset="0%" stop-color="${REM}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${V}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="960" cy="460" rx="420" ry="360" fill="url(#soft)"/>
  <ellipse cx="960" cy="500" rx="110" ry="200" fill="${REM}" opacity="0.18"/>
  <circle cx="960" cy="320" r="70" fill="${REM}" opacity="0.28"/>
  <path d="M860 320 Q960 280 1060 320" fill="none" stroke="${REM}" stroke-width="8" opacity="0.35"/>
  <rect x="880" y="300" width="160" height="90" fill="${V}" opacity="0.45"/>
  ${Array.from({length:20},(_,i)=>{
    const x=500+((i*83)%920); const y=180+((i*67)%700);
    return `<line x1="${x}" y1="${y}" x2="${x-2}" y2="${y+28+(i%3)*10}" stroke="${RAIN}" stroke-width="1.5" opacity="0.3"/>`;
  }).join("\n  ")}
  <text x="160" y="100" font-family="monospace" font-size="20" fill="${GOLD}" letter-spacing="8">MIRAEL · HOPE AS KEY</text>
`,
  ),

  "09-terminal.svg": plate(
    "09",
    `
  <rect x="200" y="160" width="900" height="700" rx="10" fill="#0C1018" stroke="${GOLD}" stroke-width="2"/>
  <rect x="200" y="160" width="900" height="48" fill="#151A24"/>
  <text x="240" y="192" font-family="monospace" font-size="20" fill="${MUTED}">nara-0://ari/terminal</text>
  <text x="240" y="280" font-family="monospace" font-size="28" fill="${REM}">IF YOU ARE READING THIS,</text>
  <text x="240" y="330" font-family="monospace" font-size="28" fill="${REM}">YOU ARE NOT THE FIRST ARI.</text>
  <text x="240" y="430" font-family="monospace" font-size="26" fill="${GOLD}">DO NOT OPEN THE OTHER WORLDS.</text>
  <text x="240" y="560" font-family="monospace" font-size="26" fill="${COLD}">OPEN THEM,</text>
  <text x="240" y="610" font-family="monospace" font-size="26" fill="${COLD}">OR THEY DIE ALONE.</text>
  <rect x="1180" y="220" width="560" height="580" rx="10" fill="#0A1218" stroke="${COLD}" stroke-width="2" opacity="0.95"/>
  <text x="1220" y="280" font-family="monospace" font-size="22" fill="${COLD}">TAB · 02</text>
  <text x="1220" y="360" font-family="monospace" font-size="24" fill="${REM}">BRANCHFALL</text>
  <text x="1220" y="420" font-family="monospace" font-size="20" fill="${MUTED}">→ KARTH-MUUN</text>
  <g opacity="0.5">
    <rect x="1180" y="500" width="560" height="4" fill="${COLD}"/>
    <rect x="1200" y="540" width="200" height="8" fill="${GOLD}" opacity="0.4"/>
  </g>
  <text x="160" y="100" font-family="monospace" font-size="20" fill="${GOLD}" letter-spacing="8">TERMINAL · GLITCH OPEN</text>
`,
  ),

  "10-title.svg": plate(
    "10",
    `
  <defs>
    <linearGradient id="snowg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${COLD}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${V}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="700" fill="url(#snowg)"/>
  <ellipse cx="720" cy="620" rx="90" ry="200" fill="${INK}" opacity="0.28"/>
  <circle cx="720" cy="380" r="55" fill="${INK}" opacity="0.32"/>
  <ellipse cx="1180" cy="620" rx="90" ry="200" fill="${COLD}" opacity="0.22"/>
  <circle cx="1180" cy="380" r="55" fill="${COLD}" opacity="0.28"/>
  <path d="M780 520 L900 480 L860 560 Z" fill="${GOLD}" opacity="0.35"/>
  ${Array.from({length:50},(_,i)=>{
    const x=(i*137)%1920; const y=(i*89)%700;
    return `<circle cx="${x}" cy="${y}" r="${1+(i%3)}" fill="${COLD}" opacity="0.55"/>`;
  }).join("\n  ")}
  <text x="960" y="860" text-anchor="middle" font-family="Georgia, serif" font-size="96" font-weight="700" fill="${REM}" letter-spacing="18">TABLOOM</text>
  <line x1="620" y1="890" x2="1300" y2="890" stroke="${GOLD}" stroke-width="2" opacity="0.75"/>
  <text x="960" y="940" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="${GOLD}" letter-spacing="10">THE LAST MIND OF AEVUM</text>
`,
  ),
};

async function rasterize(srcDir, outDir, map) {
  let n = 0;
  for (const [name, content] of Object.entries(map)) {
    const svgPath = join(srcDir, name);
    writeFileSync(svgPath, content);
    const pngName = name.replace(/\.svg$/, ".png");
    await sharp(Buffer.from(content)).png().toFile(join(outDir, pngName));
    // also copy svg into out for fallback
    writeFileSync(join(outDir, name), content);
    n++;
  }
  return n;
}

const g = await rasterize(svgDir, glyphDir, glyphs);
const p = await rasterize(svgDir, plateDir, plates);
console.log(`glyphs: ${g}, plates: ${p}`);
