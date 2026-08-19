/**
 * Generates SVG glyphs and rasterizes them to PNG via sharp (if available)
 * or leaves SVG for <img> use.
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svgDir = join(root, "assets", "svg");
const glyphDir = join(root, "assets", "glyphs");
mkdirSync(svgDir, { recursive: true });
mkdirSync(glyphDir, { recursive: true });

const svgs = {
  "concord-eye.svg": `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="g" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#F4EBD0"/>
      <stop offset="55%" stop-color="#C9A227"/>
      <stop offset="100%" stop-color="#2A1A0A"/>
    </radialGradient>
  </defs>
  <circle cx="200" cy="200" r="18" fill="url(#g)"/>
  ${Array.from({ length: 15 }, (_, i) => {
    const a = (i / 15) * Math.PI * 2 - Math.PI / 2;
    const r = 70 + (i % 3) * 28;
    const x = 200 + Math.cos(a) * r;
    const y = 200 + Math.sin(a) * r;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${8 - (i % 3)}" fill="none" stroke="#C9A227" stroke-width="2" opacity="${0.55 + (i % 3) * 0.12}"/>`;
  }).join("\n  ")}
  <ellipse cx="200" cy="200" rx="110" ry="48" fill="none" stroke="#F4EBD0" stroke-width="2" opacity="0.7"/>
  <circle cx="200" cy="200" r="8" fill="#07090F"/>
</svg>`,

  "aevum-tree.svg": `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <radialGradient id="glow" cx="50%" cy="35%" r="50%">
      <stop offset="0%" stop-color="#F4EBD0" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#F4EBD0" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="trunk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E8E2D4"/>
      <stop offset="100%" stop-color="#8A8496"/>
    </linearGradient>
  </defs>
  <ellipse cx="400" cy="320" rx="280" ry="220" fill="url(#glow)"/>
  <path d="M400 920 C380 780 370 640 400 480 C430 640 420 780 400 920 Z" fill="url(#trunk)"/>
  <path d="M400 500 C280 420 180 300 140 200" fill="none" stroke="#E8E2D4" stroke-width="6" opacity="0.85"/>
  <path d="M400 500 C520 420 620 300 660 200" fill="none" stroke="#E8E2D4" stroke-width="6" opacity="0.85"/>
  <path d="M400 560 C300 520 220 460 160 380" fill="none" stroke="#C9A227" stroke-width="3" opacity="0.7"/>
  <path d="M400 560 C500 520 580 460 640 380" fill="none" stroke="#C9A227" stroke-width="3" opacity="0.7"/>
  <path d="M400 620 C340 700 280 820 260 920" fill="none" stroke="#8A8496" stroke-width="4" opacity="0.6"/>
  <path d="M400 620 C460 700 520 820 540 920" fill="none" stroke="#8A8496" stroke-width="4" opacity="0.6"/>
  ${[140,200,260,320,380,460,520,580,640,200,300,500,600,250,550].map((x,i)=>{
    const y = 160 + (i%5)*55 + (i%3)*10;
    return `<circle cx="${x}" cy="${y}" r="${4+(i%3)}" fill="${i%2?'#C9A227':'#F4EBD0'}" opacity="0.85"/>`;
  }).join("\n  ")}
</svg>`,

  "veil.svg": `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" width="600" height="200">
  <defs>
    <linearGradient id="v" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#F4EBD0" stop-opacity="0"/>
      <stop offset="50%" stop-color="#F4EBD0" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#F4EBD0" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="40" y="90" width="520" height="2" fill="url(#v)"/>
  <path d="M80 100 Q150 40 300 100 T520 100" fill="none" stroke="#F4EBD0" stroke-width="1.5" opacity="0.6"/>
  <path d="M80 100 Q150 160 300 100 T520 100" fill="none" stroke="#C9A227" stroke-width="1" opacity="0.45"/>
</svg>`,

  "cracks.svg": `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <g fill="none" stroke="#D4A017" stroke-width="3" stroke-linecap="round" opacity="0.9">
    <path d="M960 0 L940 280 L860 420 L960 540 L1020 780 L980 1080"/>
    <path d="M940 280 L720 340 L500 300"/>
    <path d="M940 280 L1180 320 L1400 280"/>
    <path d="M860 420 L700 560 L620 720"/>
    <path d="M960 540 L1180 600 L1320 760"/>
  </g>
  <g fill="none" stroke="#2A1A0A" stroke-width="8" opacity="0.55">
    <path d="M960 0 L940 280 L860 420 L960 540 L1020 780 L980 1080"/>
  </g>
</svg>`,

  "title-lockup.svg": `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 320" width="1400" height="320">
  <text x="700" y="140" text-anchor="middle" font-family="Georgia, serif" font-size="92" fill="#F4EBD0" letter-spacing="18">TABLOOM</text>
  <text x="700" y="210" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#C9A227" letter-spacing="10">THE LAST MIND OF AEVUM</text>
  <line x1="420" y1="170" x2="980" y2="170" stroke="#C9A227" stroke-width="1.5" opacity="0.7"/>
</svg>`,

  "terminal-frame.svg": `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" width="900" height="520">
  <rect x="10" y="10" width="880" height="500" rx="8" fill="#0C1018" stroke="#C9A227" stroke-width="2"/>
  <rect x="10" y="10" width="880" height="36" rx="8" fill="#151A24"/>
  <circle cx="40" cy="28" r="6" fill="#8A8496"/><circle cx="60" cy="28" r="6" fill="#8A8496"/><circle cx="80" cy="28" r="6" fill="#C9A227"/>
  <text x="40" y="90" font-family="monospace" font-size="22" fill="#8A8496">nara-0://ari/terminal</text>
  <text x="40" y="150" font-family="monospace" font-size="26" fill="#F4EBD0">IF YOU ARE READING THIS,</text>
  <text x="40" y="190" font-family="monospace" font-size="26" fill="#F4EBD0">YOU ARE NOT THE FIRST ARI.</text>
  <text x="40" y="270" font-family="monospace" font-size="24" fill="#C9A227">DO NOT OPEN THE OTHER WORLDS.</text>
  <text x="40" y="360" font-family="monospace" font-size="24" fill="#A8C4D4" opacity="0.9">OPEN THEM,</text>
  <text x="40" y="400" font-family="monospace" font-size="24" fill="#A8C4D4" opacity="0.9">OR THEY DIE ALONE.</text>
</svg>`,

  "particle.svg": `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <circle cx="16" cy="16" r="6" fill="#F4EBD0" opacity="0.9"/>
  <circle cx="16" cy="16" r="12" fill="#F4EBD0" opacity="0.2"/>
</svg>`,
};

for (const [name, content] of Object.entries(svgs)) {
  writeFileSync(join(svgDir, name), content);
  writeFileSync(join(glyphDir, name), content);
}

let rasterized = 0;
try {
  const sharp = (await import("sharp")).default;
  for (const name of Object.keys(svgs)) {
    const pngName = name.replace(/\.svg$/, ".png");
    await sharp(join(svgDir, name)).png().toFile(join(glyphDir, pngName));
    rasterized++;
  }
  console.log(`Wrote ${Object.keys(svgs).length} SVGs; rasterized ${rasterized} PNGs`);
} catch (e) {
  console.log(`Wrote ${Object.keys(svgs).length} SVGs (sharp unavailable: ${e.message})`);
}
