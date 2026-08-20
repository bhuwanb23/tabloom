import { AnimatePresence, motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  AriSprite — the Archivist / the Oathblade, drawn as rim-lit       */
/*  silhouettes so he melts into the painted backgrounds and rhymes    */
/*  with the fifteen shadows he keeps casting.                         */
/* ------------------------------------------------------------------ */

export type AriAspect = "archivist" | "oathblade";
export type AriPose = "lying" | "sitting" | "standing";

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

function Standing({ aspect, rim }: { aspect: AriAspect; rim: string }) {
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
            {pose === "standing" && <Standing aspect={aspect} rim={rim} />}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
