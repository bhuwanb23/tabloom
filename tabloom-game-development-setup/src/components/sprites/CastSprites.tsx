import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  CastSprites — Kael Orin, Mirael, the dying soldier. Rim-lit SVG    */
/*  silhouettes, kin to Ari's own shadow-language.                     */
/* ------------------------------------------------------------------ */

export function KaelSprite({ className = "" }: { className?: string }) {
  const rim = "#ffc07a";
  return (
    <div className={`pointer-events-none no-select ${className}`} aria-hidden>
      <svg viewBox="0 0 160 240" className="h-full w-full" style={{ filter: "blur(1.3px)" }}>
        {/* staff, planted */}
        <path d="M126 30 L118 226" stroke="rgba(6,8,12,0.95)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="126" cy="24" r="5" fill={rim} opacity="0.95">
          <animate attributeName="opacity" values="0.95;0.5;0.95" dur="2.6s" repeatCount="indefinite" />
        </circle>
        {/* broad traveler's coat */}
        <path
          d="M76 34 C 90 34, 97 46, 96 60 C 108 78, 112 104, 112 134 L 116 216 L 94 216 L 90 152 L 84 152 L 80 216 L 58 216 L 60 134 C 60 104, 56 78, 58 60 C 56 46, 62 34, 76 34 Z"
          fill="rgba(6,8,12,0.96)"
        />
        <circle cx="76" cy="21" r="15" fill="rgba(6,8,12,0.97)" />
        {/* scarf tail in the wind */}
        <path d="M62 42 C 44 48, 32 44, 22 52 C 32 52, 38 56, 34 64 C 46 58, 56 58, 62 54 Z" fill="rgba(6,8,12,0.9)">
          <animateTransform attributeName="transform" type="rotate" values="0 62 48; 3 62 48; 0 62 48; -2 62 48; 0 62 48" dur="5s" repeatCount="indefinite" />
        </path>
        {/* hand resting on staff */}
        <path d="M100 96 C 108 94, 114 92, 119 90" stroke="rgba(6,8,12,0.95)" strokeWidth="9" strokeLinecap="round" />
        {/* ember rim */}
        <path d="M58 60 C 56 46, 62 34, 76 34" stroke={rim} strokeWidth="1.6" fill="none" opacity="0.55" strokeLinecap="round" />
        <path d="M63 9 C 70 5, 82 5, 89 10" stroke={rim} strokeWidth="1.3" fill="none" opacity="0.4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function MiraelSprite({ className = "" }: { className?: string }) {
  const rim = "#cfc0ff";
  return (
    <div className={`pointer-events-none no-select ${className}`} style={{ filter: "blur(1.2px)" }} aria-hidden>
      <svg viewBox="0 0 120 220" className="h-full w-full">
        <path
          d="M60 30 C 72 30, 77 41, 76 52 C 84 66, 87 88, 87 116 L 90 198 L 70 198 L 66 140 L 62 196 L 44 198 L 44 116 C 44 88, 38 66, 44 52 C 43 41, 48 30, 60 30 Z"
          fill="rgba(10,10,16,0.9)"
        />
        <circle cx="60" cy="18" r="13" fill="rgba(10,10,16,0.92)" />
        {/* long hair-line catching the aurora */}
        <path
          d="M52 10 C 44 24, 42 44, 46 64 L 52 58 C 50 42, 52 26, 58 12 Z"
          fill="rgba(10,10,16,0.85)"
        />
        <path d="M44 52 C 43 41, 48 30, 60 30" stroke={rim} strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round" />
        <path d="M50 7 C 56 4, 64 4, 70 8" stroke={rim} strokeWidth="1.2" fill="none" opacity="0.45" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function SoldierSprite({ className = "" }: { className?: string }) {
  const rim = "#b8c9dd";
  return (
    <div className={`pointer-events-none no-select ${className}`} aria-hidden>
      <svg viewBox="0 0 240 110" className="h-full w-full" style={{ filter: "blur(1.6px)" }}>
        {/* lying form, half out of the ice */}
        <path
          d="M20 88 C 30 66, 54 58, 88 62 C 102 64, 110 70, 124 70 C 158 70, 196 74, 212 82 C 220 86, 220 96, 212 98 L 30 102 C 18 102, 14 96, 20 88 Z"
          fill="rgba(7,10,16,0.96)"
        />
        {/* head rolled back */}
        <ellipse cx="42" cy="66" rx="15" ry="12" fill="rgba(7,10,16,0.97)" />
        {/* one arm bent across the chest */}
        <path d="M96 62 C 104 54, 116 52, 126 58" stroke="rgba(7,10,16,0.95)" strokeWidth="10" strokeLinecap="round" fill="none" />
        {/* his spear, fallen parallel */}
        <path d="M30 106 L220 40" stroke="rgba(7,10,16,0.85)" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M220 40 L230 34" stroke={rim} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        {/* frost rim */}
        <path d="M30 84 C 40 68, 60 62, 86 64" stroke={rim} strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
        <path d="M34 58 C 38 52, 46 50, 52 54" stroke={rim} strokeWidth="1.3" fill="none" opacity="0.4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* presence wrapper — soft fade/scale entrance shared by cast sprites */
export function CastPresence({
  show,
  children,
  delay = 0,
}: {
  show: boolean;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.6 } }}
          transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
