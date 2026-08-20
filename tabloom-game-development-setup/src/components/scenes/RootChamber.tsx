import { motion } from "framer-motion";
import Motes from "../fx/Motes";
import AriSprite from "../sprites/AriSprite";
import SennAvatar from "../SennAvatar";
import { NullrootObject } from "../sprites/VeyrSprite";

/* ------------------------------------------------------------------ */
/*  RootChamber — the largest space in the game, drawn rather than     */
/*  painted so it can carry four states: the wound, the mending, the   */
/*  merge, and the sundering. The Witness Mind's face is inside the    */
/*  root pattern — never a sprite, never pointed at.                   */
/* ------------------------------------------------------------------ */

export type ChamberState = "wound" | "healed" | "merge" | "sunder";

type Flags = Record<string, boolean | string | number>;

/* the great arching roots of the vault */
const ARCHES = [
  { d: "M-40 620 C 120 380, 200 180, 300 -30", w: 26 },
  { d: "M60 640 C 200 420, 280 220, 360 -20", w: 18 },
  { d: "M1240 620 C 1080 380, 1000 180, 900 -30", w: 26 },
  { d: "M1140 640 C 1000 420, 920 220, 840 -20", w: 18 },
  { d: "M240 660 C 340 460, 420 260, 470 0", w: 12 },
  { d: "M960 660 C 860 460, 780 260, 730 0", w: 12 },
  { d: "M420 680 C 470 500, 520 300, 550 40", w: 8 },
  { d: "M780 680 C 730 500, 680 300, 650 40", w: 8 },
];

export default function RootChamber({ flags }: { flags: Flags }) {
  const state = (flags.chamberState as ChamberState | undefined) ?? "wound";
  const healed = state === "healed";
  const merge = state === "merge";
  const sunder = state === "sunder";
  const dissolve = Number(flags.ariDissolve ?? 0); // 0..1 for ending three

  const coreColor = merge ? "#ffb08c" : sunder ? "#cfd6e4" : healed ? "#a9f5d4" : "#7ff5c9";

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#04070a]">
      {/* deep space of the chamber */}
      <div
        className="absolute inset-0"
        style={{
          background: merge
            ? "radial-gradient(ellipse at 50% 46%, #3a1f22 0%, #150d12 45%, #060406 100%)"
            : sunder
              ? "radial-gradient(ellipse at 50% 46%, #232a36 0%, #0d1016 48%, #05070a 100%)"
              : "radial-gradient(ellipse at 50% 46%, #123026 0%, #08131195 45%, #04070a 100%)",
          transition: "background 5s ease-in-out",
        }}
      />

      {/* the vault */}
      <svg viewBox="0 0 1200 620" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="rc-root" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#0a0f0d" />
            <stop offset="100%" stopColor="#1a2b24" />
          </linearGradient>
          <radialGradient id="rc-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={coreColor} stopOpacity="0.95" />
            <stop offset="45%" stopColor={coreColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={coreColor} stopOpacity="0" />
          </radialGradient>
          <filter id="rc-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* arching roots */}
        {ARCHES.map((a, i) => (
          <g key={i}>
            <path d={a.d} stroke="url(#rc-root)" strokeWidth={a.w} fill="none" strokeLinecap="round" />
            <path
              d={a.d}
              stroke={coreColor}
              strokeWidth={a.w * 0.16}
              fill="none"
              strokeLinecap="round"
              opacity={sunder ? 0.12 : merge ? 0.3 : healed ? 0.55 : 0.32}
              style={{ transition: "opacity 4s ease" }}
            />
          </g>
        ))}

        {/* ---- THE FACE IN THE PATTERN ---- */}
        {/* never announced, never a sprite. it is simply how the roots grew. */}
        <g
          opacity={sunder ? 0.05 : merge ? 0.1 : healed ? 0.2 : 0.13}
          style={{ transition: "opacity 5s ease" }}
        >
          {/* brow ridge */}
          <path d="M380 210 C 470 168, 730 168, 820 210" stroke="#dff7ec" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* the two long eyes */}
          <path d="M432 258 C 476 232, 536 232, 578 258 C 536 282, 476 282, 432 258 Z" fill="#dff7ec" opacity="0.5" />
          <path d="M622 258 C 664 232, 724 232, 768 258 C 724 282, 664 282, 622 258 Z" fill="#dff7ec" opacity="0.5" />
          {/* pupils that very slowly track */}
          <motion.circle
            cx="505" cy="258" r="9" fill="#f3fffa"
            animate={{ cx: [498, 512, 498] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="695" cy="258" r="9" fill="#f3fffa"
            animate={{ cx: [688, 702, 688] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* cheek roots and the long jaw */}
          <path d="M400 300 C 440 372, 520 424, 600 436 C 680 424, 760 372, 800 300" stroke="#dff7ec" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M552 300 C 566 336, 634 336, 648 300" stroke="#dff7ec" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>

        {/* the knot — every branch's root, converging */}
        <g style={{ transformOrigin: "600px 330px" }}>
          <circle cx="600" cy="330" r="150" fill="url(#rc-core)" style={{ animation: "breathe 7s ease-in-out infinite", transformOrigin: "600px 330px" }} />
          {Array.from({ length: 15 }).map((_, i) => {
            const a = (i / 15) * Math.PI * 2;
            const alive = sunder ? false : merge ? i % 3 === 0 : healed ? true : [1, 4, 7, 10, 13].includes(i);
            const x2 = 600 + Math.cos(a) * 240;
            const y2 = 330 + Math.sin(a) * 190;
            return (
              <path
                key={i}
                d={`M600 330 Q ${600 + Math.cos(a + 0.5) * 130} ${330 + Math.sin(a + 0.5) * 110} ${x2} ${y2}`}
                stroke={alive ? coreColor : "rgba(255,255,255,0.07)"}
                strokeWidth={alive ? 2.6 : 1.2}
                fill="none"
                strokeLinecap="round"
                filter={alive ? "url(#rc-glow)" : undefined}
                opacity={alive ? 0.85 : 0.5}
                style={{ transition: "stroke 4s ease, opacity 4s ease" }}
              />
            );
          })}

          {/* THE WOUND — the cut the Nullroot made, mended in ending one */}
          <motion.path
            d="M600 168 L 574 254 L 618 320 L 582 400 L 606 488"
            stroke={healed ? coreColor : "#ff5a44"}
            strokeWidth={healed ? 3 : 6}
            fill="none"
            strokeLinecap="round"
            filter="url(#rc-glow)"
            animate={{ opacity: healed ? 0.55 : sunder ? 0.25 : 1, pathLength: 1 }}
            transition={{ duration: 4 }}
            style={{ strokeDasharray: healed ? "6 10" : "none" }}
          />
          {/* mending stitches */}
          {healed &&
            [200, 250, 300, 350, 400, 450].map((y, i) => (
              <motion.path
                key={y}
                d={`M${568 + (i % 2) * 6} ${y} L ${628 - (i % 2) * 6} ${y + 12}`}
                stroke="#a9f5d4"
                strokeWidth="2.2"
                strokeLinecap="round"
                filter="url(#rc-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ delay: 0.6 + i * 0.28, duration: 0.8 }}
              />
            ))}
        </g>
      </svg>

      {/* MERGE — realities bleeding into each other */}
      {merge && (
        <>
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(58deg, rgba(174,191,208,0.16), rgba(159,215,255,0.16) 26%, rgba(255,217,163,0.16) 52%, rgba(255,200,221,0.16) 74%, rgba(127,245,201,0.16))",
              mixBlendMode: "screen",
            }}
            animate={{ opacity: [0.5, 1, 0.5], backgroundPosition: ["0% 50%", "100% 50%"] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="glitching pointer-events-none absolute inset-0 bg-white/[0.04]" />
        </>
      )}

      {/* SUNDER — the light going out of the system, evenly, forever */}
      {sunder && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[#0a0d12]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 6 }}
        />
      )}

      {/* the blade, if it was set down */}
      {Boolean(flags.bladeDown) && (
        <motion.div
          className="absolute"
          style={{ left: "50%", top: "62%", width: "5%", height: "26%", marginLeft: "-2.5%" }}
          initial={{ opacity: 0, rotate: -20 }}
          animate={{ opacity: 0.85, rotate: -74 }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <NullrootObject className="h-full w-full" />
        </motion.div>
      )}

      {/* the blade, if it was taken up */}
      {Boolean(flags.bladeHeld) && !dissolve && (
        <motion.div
          className="absolute"
          style={{ left: "27%", top: "44%", width: "4.5%", height: "26%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
        >
          <NullrootObject className="h-full w-full" />
        </motion.div>
      )}

      {/* ari — dissolving into the pattern in ending three */}
      <motion.div
        className="absolute"
        style={{ left: "31%", top: "40%", width: "10%", height: "44%" }}
        animate={{ opacity: 1 - dissolve, filter: `blur(${dissolve * 8}px)`, scale: 1 + dissolve * 0.12 }}
        transition={{ duration: 6, ease: "easeInOut" }}
      >
        <AriSprite aspect="composite" pose="standing" rim={coreColor} />
      </motion.div>

      {/* senn, small, at the edge of the enormous room */}
      {Boolean(flags.sennHere) && (
        <motion.div
          className="absolute"
          style={{ left: "62%", top: "68%" }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 2.6 }}
        >
          <SennAvatar size={58} lookAway={Boolean(flags.sennAway)} />
        </motion.div>
      )}

      <Motes
        tone={merge ? "ember" : sunder ? "ice" : "root"}
        count={30}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      />
      <div className="vignette-layer pointer-events-none absolute inset-0" />
      <div className="grain-layer pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/80 via-black/24 to-transparent" />
    </div>
  );
}
