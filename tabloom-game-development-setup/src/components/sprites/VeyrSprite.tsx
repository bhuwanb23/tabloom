import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  VeyrSprite — the grieving father. Three damage states plus a       */
/*  kneeling pose. Tall, still, expensive: a man who was somebody      */
/*  before he was this. The Nullroot is always in his hand.            */
/* ------------------------------------------------------------------ */

export type VeyrState = 0 | 1 | 2 | "kneel";

const GRADE: Record<string, string> = {
  0: "none",
  1: "brightness(0.92) saturate(1.25) hue-rotate(-8deg)",
  2: "brightness(0.8) saturate(1.5) hue-rotate(-16deg) contrast(1.1)",
  kneel: "brightness(0.62) saturate(0.5)",
};

export default function VeyrSprite({
  state = 0,
  className = "",
  nullrootGlow = true,
}: {
  state?: VeyrState;
  className?: string;
  nullrootGlow?: boolean;
}) {
  const kneeling = state === "kneel";
  const dmg = typeof state === "number" ? state : 3;

  return (
    <div className={`pointer-events-none no-select ${className}`} aria-hidden>
      <motion.div
        className="h-full w-full"
        animate={{ y: kneeling ? 0 : [0, -4, 0] }}
        transition={{ duration: 6, repeat: kneeling ? 0 : Infinity, ease: "easeInOut" }}
        style={{ filter: GRADE[String(state)] }}
      >
        <svg viewBox="0 0 180 300" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="vy-coat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14121a" />
              <stop offset="100%" stopColor="#05050a" />
            </linearGradient>
            <linearGradient id="vy-null" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#2a0a12" />
              <stop offset="60%" stopColor="#ff3b2e" />
              <stop offset="100%" stopColor="#ffd0c0" />
            </linearGradient>
            <filter id="vy-glow" x="-70%" y="-70%" width="240%" height="240%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* the absence he stands in */}
          <ellipse cx="90" cy="250" rx="62" ry="30" fill="rgba(0,0,0,0.5)" style={{ filter: "blur(9px)" }} />

          {kneeling ? (
            /* down on one knee, blade point-down as a crutch */
            <g>
              <path
                d="M96 96 C 116 96, 126 112, 122 132 C 136 154, 142 186, 138 228 L 150 262 L 96 264 L 60 264 C 44 264, 40 250, 52 240 L 72 226 C 62 196, 62 156, 76 132 C 72 112, 80 96, 96 96 Z"
                fill="url(#vy-coat)"
                stroke="rgba(120,40,40,0.3)"
                strokeWidth="1.4"
              />
              <circle cx="94" cy="80" r="19" fill="#0a0910" />
              {/* head bowed */}
              <path d="M76 66 C 84 58, 104 58, 112 68" stroke="rgba(190,150,150,0.3)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              {/* the blade, planted */}
              <path d="M150 118 L 152 258" stroke="#1a1016" strokeWidth="6" strokeLinecap="round" />
              <path d="M150 118 L 148 88" stroke="rgba(120,60,60,0.5)" strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : (
            <g>
              {/* long tailored coat, torn lower as he takes damage */}
              <path
                d={
                  dmg === 0
                    ? "M90 40 C 112 40, 122 58, 119 76 C 136 100, 142 140, 142 186 L 148 272 L 118 274 L 112 194 L 104 194 L 100 274 L 62 272 L 60 186 C 60 140, 44 100, 61 76 C 58 58, 68 40, 90 40 Z"
                    : dmg === 1
                      ? "M90 40 C 112 40, 122 58, 119 76 C 136 100, 142 140, 142 186 L 150 270 L 132 276 L 120 262 L 112 278 L 104 194 L 100 276 L 82 264 L 66 274 L 58 186 C 58 140, 44 100, 61 76 C 58 58, 68 40, 90 40 Z"
                      : "M90 40 C 112 40, 122 58, 119 76 C 138 100, 146 140, 144 186 L 154 268 L 136 278 L 124 258 L 114 280 L 104 256 L 96 278 L 84 258 L 68 276 L 54 264 L 56 186 C 54 140, 42 100, 61 76 C 58 58, 68 40, 90 40 Z"
                }
                fill="url(#vy-coat)"
                stroke={dmg >= 1 ? "rgba(255,70,50,0.35)" : "rgba(80,80,100,0.25)"}
                strokeWidth="1.4"
              />
              <circle cx="90" cy="26" r="19" fill="#0a0910" />
              {/* high collar */}
              <path d="M66 62 L 90 48 L 114 62 L 108 78 L 90 68 L 72 78 Z" fill="#0d0c14" />
              {/* the eyes of a man who has checked everything */}
              <circle cx="83" cy="24" r="1.9" fill="#ff8a7a" opacity={0.6 + dmg * 0.15} style={{ filter: "drop-shadow(0 0 5px rgba(255,90,70,0.9))" }} />
              <circle cx="97" cy="24" r="1.9" fill="#ff8a7a" opacity={0.6 + dmg * 0.15} style={{ filter: "drop-shadow(0 0 5px rgba(255,90,70,0.9))" }} />

              {/* wounds accumulate */}
              {dmg >= 1 && (
                <path d="M70 108 L 116 156" stroke="#ff5a44" strokeWidth="2.6" strokeLinecap="round" opacity="0.8" style={{ filter: "drop-shadow(0 0 6px rgba(255,80,60,0.8))" }} />
              )}
              {dmg >= 2 && (
                <>
                  <path d="M120 96 L 74 150" stroke="#ff5a44" strokeWidth="2.6" strokeLinecap="round" opacity="0.8" style={{ filter: "drop-shadow(0 0 6px rgba(255,80,60,0.8))" }} />
                  <path d="M62 170 L 128 186" stroke="#ff5a44" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" style={{ filter: "drop-shadow(0 0 6px rgba(255,80,60,0.8))" }} />
                </>
              )}

              {/* THE NULLROOT — held low, always */}
              <g>
                <path d="M140 96 L 152 220" stroke="#120a10" strokeWidth="7" strokeLinecap="round" />
                <path
                  d="M140 96 L 152 220"
                  stroke="url(#vy-null)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  filter={nullrootGlow ? "url(#vy-glow)" : undefined}
                  opacity={0.85}
                />
                {/* crossguard: a fact, made into a handle */}
                <path d="M128 100 L 154 92" stroke="#2a1a20" strokeWidth="5" strokeLinecap="round" />
                <circle cx="141" cy="96" r="3.4" fill="#ff3b2e" filter="url(#vy-glow)" style={{ animation: "pulseglow 3.4s ease-in-out infinite" }} />
              </g>
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}

/* the blade, alone, offered */
export function NullrootObject({ className = "" }: { className?: string }) {
  return (
    <div className={`no-select ${className}`} aria-hidden>
      <svg viewBox="0 0 120 260" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="nr-b" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#1a0a10" />
            <stop offset="45%" stopColor="#ff3b2e" />
            <stop offset="100%" stopColor="#fff0e8" />
          </linearGradient>
          <filter id="nr-g" x="-90%" y="-90%" width="280%" height="280%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* the wrongness it sits inside */}
        <ellipse cx="60" cy="130" rx="46" ry="112" fill="rgba(255,50,40,0.07)" style={{ animation: "breathe 4.4s ease-in-out infinite", transformOrigin: "60px 130px" }} />
        {/* blade */}
        <path d="M60 14 L 70 60 L 66 196 L 54 196 L 50 60 Z" fill="#0d070b" stroke="rgba(255,90,70,0.5)" strokeWidth="1.2" />
        <path d="M60 18 L 60 194" stroke="url(#nr-b)" strokeWidth="3" strokeLinecap="round" filter="url(#nr-g)" />
        {/* crossguard + grip */}
        <path d="M32 200 L 88 200" stroke="#2a1a20" strokeWidth="7" strokeLinecap="round" />
        <path d="M60 200 L 60 244" stroke="#1a1016" strokeWidth="8" strokeLinecap="round" />
        <circle cx="60" cy="250" r="7" fill="#0d070b" stroke="rgba(255,90,70,0.45)" strokeWidth="1.4" />
        <circle cx="60" cy="200" r="4.2" fill="#ff3b2e" filter="url(#nr-g)" style={{ animation: "pulseglow 2.8s ease-in-out infinite" }} />
      </svg>
    </div>
  );
}
