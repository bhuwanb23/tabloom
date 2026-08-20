import { AnimatePresence, motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  AriSprite — the Archivist / the Oathblade, drawn as rim-lit       */
/*  silhouettes so he melts into the painted backgrounds and rhymes    */
/*  with the fifteen shadows he keeps casting.                         */
/* ------------------------------------------------------------------ */

export type AriAspect = "archivist" | "oathblade" | "patient" | "composite";
export type AriPose = "lying" | "sitting" | "standing" | "weary";

function Lying({ rim }: { rim: string }) {
  return (
    <svg viewBox="0 0 220 90" className="h-full w-full" style={{ filter: "blur(1.6px)" }}>
      {/* huddled form under a blanket */}
      <path
        d="M14 78 C 20 52, 44 40, 78 44 C 96 46, 104 52, 116 52 C 148 52, 186 56, 200 66 C 208 72, 208 82, 200 84 L 20 86 C 10 86, 10 82, 14 78 Z"
        fill="rgba(4,6,10,0.94)"
      />
      {/* head on the pillow */}
      <ellipse cx="36" cy="60" rx="16" ry="13" fill="rgba(4,6,10,0.95)" />
      <path d="M22 56 C 26 48, 38 44, 48 50" stroke={rim} strokeWidth="1.6" fill="none" opacity="0.55" strokeLinecap="round" />
      <path d="M80 46 C 100 48, 120 52, 150 54" stroke={rim} strokeWidth="1.4" fill="none" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

function Sitting({ rim }: { rim: string }) {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full" style={{ filter: "blur(1.5px)" }}>
      {/* torso leaning forward on the edge of the bed */}
      <path
        d="M62 148 C 58 118, 56 96, 64 76 C 70 62, 82 56, 90 60 C 100 66, 102 82, 104 96 C 106 112, 108 130, 112 148 Z"
        fill="rgba(4,6,10,0.94)"
      />
      {/* head, slightly bowed */}
      <circle cx="84" cy="44" r="17" fill="rgba(4,6,10,0.95)" />
      {/* hanging arm */}
      <path d="M66 82 C 58 100, 54 118, 56 136" stroke="rgba(4,6,10,0.94)" strokeWidth="11" strokeLinecap="round" fill="none" />
      {/* legs folding off the bed */}
      <path d="M78 148 L 150 148 C 156 133, 150 122, 136 120 L 96 116" fill="rgba(4,6,10,0.94)" />
      {/* rim light down the back */}
      <path d="M64 76 C 70 62, 82 56, 90 60" stroke={rim} strokeWidth="1.8" fill="none" opacity="0.6" strokeLinecap="round" />
      <path d="M71 30 C 78 26, 88 26, 96 32" stroke={rim} strokeWidth="1.4" fill="none" opacity="0.4" strokeLinecap="round" />
    </svg>
  );
}

function Weary({ rim }: { rim: string }) {
  /* the archivist, five acts later — shoulders lower, head heavier, coat the same */
  return (
    <svg viewBox="0 0 160 240" className="h-full w-full" style={{ filter: "blur(1.4px)" }}>
      {/* coat, hanging heavier, one shoulder dropped */}
      <path
        d="M80 38 C 95 38, 101 50, 99 63 C 111 80, 115 106, 114 138 L 116 216 L 96 216 L 92 152 L 86 152 L 82 216 L 62 216 L 63 138 C 63 106, 59 80, 62 63 C 61 50, 66 38, 80 38 Z"
        fill="rgba(4,6,10,0.95)"
      />
      {/* head, tipped forward a few degrees */}
      <g style={{ transformOrigin: "80px 40px", transform: "rotate(5deg)" }}>
        <circle cx="79" cy="25" r="15" fill="rgba(4,6,10,0.96)" />
        <path d="M66 13 C 73 9, 85 9, 92 14" stroke={rim} strokeWidth="1.2" fill="none" opacity="0.32" strokeLinecap="round" />
      </g>
      {/* both hands down — nothing held, nothing carried */}
      <path d="M63 84 C 56 106, 54 128, 56 146" stroke="rgba(4,6,10,0.94)" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M112 86 C 118 108, 118 130, 115 148" stroke="rgba(4,6,10,0.94)" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* satchel strap, worn thinner */}
      <path d="M67 62 L 106 118" stroke="rgba(20,26,34,0.85)" strokeWidth="5" strokeLinecap="round" />
      {/* the book-light is out now */}
      <circle cx="57" cy="150" r="3.4" fill={rim} opacity="0.22" />
      <path d="M62 63 C 61 50, 66 38, 80 38" stroke={rim} strokeWidth="1.5" fill="none" opacity="0.38" strokeLinecap="round" />
    </svg>
  );
}

function Standing({ aspect, rim }: { aspect: AriAspect; rim: string }) {
  if (aspect === "composite") {
    /* all of them at once — coat AND cloak AND blade, threaded with root-light */
    return (
      <svg viewBox="0 0 160 240" className="h-full w-full overflow-visible" style={{ filter: "blur(1.2px)" }}>
        <defs>
          <linearGradient id="cmp-rim" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#2c8f6b" />
            <stop offset="55%" stopColor="#7ff5c9" />
            <stop offset="100%" stopColor="#ffd9a3" />
          </linearGradient>
          <filter id="cmp-glow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="3.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* the aura of everything carried */}
        <ellipse cx="80" cy="140" rx="52" ry="96" fill="rgba(127,245,201,0.07)" style={{ animation: "breathe 6s ease-in-out infinite", transformOrigin: "80px 140px" }} />

        {/* ghost-layers of the earlier aspects, faint, offset — they are still in there */}
        <g opacity="0.22">
          <path d="M80 40 C 92 40, 97 51, 96 62 C 105 78, 108 104, 107 134 L 109 214 L 92 214 L 89 152 L 84 152 L 80 214 L 63 214 L 65 134 C 65 104, 62 78, 64 62 C 63 51, 68 40, 80 40 Z" fill="#7ff5c9" transform="translate(-7,0)" />
          <path d="M80 40 C 92 40, 97 51, 96 62 C 105 78, 108 104, 107 134 L 109 214 L 92 214 L 89 152 L 84 152 L 80 214 L 63 214 L 65 134 C 65 104, 62 78, 64 62 C 63 51, 68 40, 80 40 Z" fill="#ffd9a3" transform="translate(7,0)" />
        </g>

        {/* long coat with a war-cloak hem */}
        <path
          d="M80 34 C 95 34, 102 47, 100 60 C 113 78, 118 104, 118 136 L 124 216 L 110 220 L 102 208 L 94 222 L 86 206 L 76 220 L 68 206 L 56 216 L 44 212 L 44 136 C 44 104, 49 78, 60 60 C 58 47, 65 34, 80 34 Z"
          fill="rgba(4,6,10,0.95)"
        />
        <circle cx="80" cy="21" r="15" fill="rgba(4,6,10,0.96)" />

        {/* the oathblade, carried low and easy */}
        <path d="M118 60 L 106 168" stroke="rgba(4,6,10,0.9)" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M118 60 L 122 46" stroke="url(#cmp-rim)" strokeWidth="2.4" strokeLinecap="round" filter="url(#cmp-glow)" />

        {/* archivist strap + satchel */}
        <path d="M64 58 L 104 116" stroke="rgba(20,26,34,0.9)" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M98 110 L 114 106 L 116 124 L 100 128 Z" fill="rgba(4,6,10,0.95)" />

        {/* root-light grafted through the whole figure — the thing that's actually new */}
        <g stroke="url(#cmp-rim)" strokeWidth="1.7" fill="none" strokeLinecap="round" filter="url(#cmp-glow)" opacity="0.9">
          <path d="M80 44 C 72 70, 84 88, 76 118 C 70 142, 82 160, 78 190" />
          <path d="M66 76 C 56 92, 58 110, 64 124" />
          <path d="M96 82 C 108 98, 106 118, 98 132" />
        </g>
        {/* the heart-point: where everything grafted meets */}
        <circle cx="80" cy="104" r="4.2" fill="#ffe9b3" filter="url(#cmp-glow)" style={{ animation: "pulseglow 3s ease-in-out infinite" }} />

        {/* bright, level rim */}
        <path d="M60 60 C 58 47, 65 34, 80 34" stroke={rim} strokeWidth="1.9" fill="none" opacity="0.7" strokeLinecap="round" />
        <path d="M67 8 C 74 4, 86 4, 93 9" stroke={rim} strokeWidth="1.4" fill="none" opacity="0.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (aspect === "patient") {
    /* convalescent — narrower, slightly stooped, robe not coat */
    return (
      <svg viewBox="0 0 160 240" className="h-full w-full" style={{ filter: "blur(1.5px)" }}>
        {/* ward robe, loose */}
        <path
          d="M80 40 C 92 40, 97 51, 96 62 C 105 78, 108 104, 107 134 L 109 214 L 92 214 L 89 152 L 84 152 L 80 214 L 63 214 L 65 134 C 65 104, 62 78, 64 62 C 63 51, 68 40, 80 40 Z"
          fill="rgba(6,8,12,0.9)"
        />
        <circle cx="79" cy="28" r="14" fill="rgba(6,8,12,0.92)" />
        {/* one hand steadying against something unseen */}
        <path d="M64 84 C 54 96, 50 110, 52 124" stroke="rgba(6,8,12,0.9)" strokeWidth="9" strokeLinecap="round" fill="none" />
        {/* bandage band at the forearm */}
        <path d="M53 112 L 60 108" stroke={rim} strokeWidth="3.4" strokeLinecap="round" opacity="0.5" />
        {/* soft rim — weaker light than his other aspects */}
        <path d="M64 62 C 63 51, 68 40, 80 40" stroke={rim} strokeWidth="1.4" fill="none" opacity="0.42" strokeLinecap="round" />
        <path d="M68 17 C 74 13, 84 13, 90 18" stroke={rim} strokeWidth="1.1" fill="none" opacity="0.32" strokeLinecap="round" />
      </svg>
    );
  }
  if (aspect === "oathblade") {
    return (
      <svg viewBox="0 0 160 240" className="h-full w-full" style={{ filter: "blur(1.4px)" }}>
        {/* tattered war-cloak */}
        <path
          d="M80 30 C 96 30, 104 44, 102 58 C 114 72, 120 96, 122 128 L 128 210 L 110 216 L 100 204 L 92 226 L 82 208 L 70 224 L 60 206 L 48 214 L 52 128 C 54 96, 60 72, 60 58 C 58 44, 66 30, 80 30 Z"
          fill="rgba(5,8,14,0.95)"
        />
        <circle cx="80" cy="20" r="15" fill="rgba(5,8,14,0.96)" />
        {/* the oathblade, carried point-down behind the shoulder */}
        <path d="M112 20 L 96 118" stroke="rgba(5,8,14,0.9)" strokeWidth="5" strokeLinecap="round" />
        <path d="M112 20 L 118 6" stroke={rim} strokeWidth="2.4" strokeLinecap="round" opacity="0.9" />
        <path d="M104 44 L 118 40" stroke={rim} strokeWidth="1.6" opacity="0.5" strokeLinecap="round" />
        {/* wind in the cloak-hem */}
        <path d="M52 128 C 54 96, 60 74, 60 60" stroke={rim} strokeWidth="1.6" fill="none" opacity="0.5" strokeLinecap="round" />
        <path d="M70 8 C 76 5, 86 5, 92 9" stroke={rim} strokeWidth="1.3" fill="none" opacity="0.45" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 240" className="h-full w-full" style={{ filter: "blur(1.4px)" }}>
      {/* long archivist coat */}
      <path
        d="M80 34 C 94 34, 100 46, 99 58 C 110 74, 114 100, 114 132 L 116 214 L 96 214 L 92 150 L 86 150 L 82 214 L 62 214 L 64 132 C 64 100, 60 74, 61 58 C 60 46, 66 34, 80 34 Z"
        fill="rgba(4,6,10,0.95)"
      />
      <circle cx="80" cy="22" r="15" fill="rgba(4,6,10,0.96)" />
      {/* satchel strap across the chest */}
      <path d="M66 60 L 108 118" stroke="rgba(20,26,34,0.9)" strokeWidth="6" strokeLinecap="round" />
      <path d="M100 112 L 116 108 L 118 126 L 102 130 Z" fill="rgba(4,6,10,0.95)" />
      {/* book-light held low — the archivist always carries one */}
      <circle cx="58" cy="140" r="4" fill={rim} opacity="0.85">
        <animate attributeName="opacity" values="0.85;0.4;0.85" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* rim light */}
      <path d="M61 58 C 60 46, 66 34, 80 34" stroke={rim} strokeWidth="1.6" fill="none" opacity="0.5" strokeLinecap="round" />
      <path d="M67 10 C 74 6, 86 6, 93 11" stroke={rim} strokeWidth="1.3" fill="none" opacity="0.45" strokeLinecap="round" />
    </svg>
  );
}

export default function AriSprite({
  aspect = "archivist",
  pose = "sitting",
  rim = "#9fb4c8",
  className = "",
}: {
  aspect?: AriAspect;
  pose?: AriPose;
  rim?: string;
  className?: string;
}) {
  return (
    <div className={`pointer-events-none no-select ${className}`} aria-hidden>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${aspect}-${pose}`}
          className="h-full w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="h-full w-full" style={{ animation: "breathe 5.5s ease-in-out infinite" }}>
            {pose === "lying" && <Lying rim={rim} />}
            {pose === "sitting" && <Sitting rim={rim} />}
            {pose === "weary" && <Weary rim={rim} />}
            {pose === "standing" && <Standing aspect={aspect} rim={rim} />}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
