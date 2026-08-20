import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  SennAvatar — half plant, half something gentler. A seed-body of    */
/*  root-light with leaf antlers, blinking eyes, a heart-light, and    */
/*  orbiting motes. Pulses when speaking.                              */
/* ------------------------------------------------------------------ */

export default function SennAvatar({
  speaking = false,
  size = 130,
  arriving = false,
  lookAway = false,
}: {
  speaking?: boolean;
  size?: number;
  arriving?: boolean;
  /** the pose he takes when he cannot watch what he arranged */
  lookAway?: boolean;
}) {
  return (
    <motion.div
      className="relative no-select"
      style={{ width: size, height: size * 1.2 }}
      initial={arriving ? { scale: 0, y: -60, opacity: 0, rotate: -14 } : false}
      animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 13 }}
    >
      <div className="h-full w-full" style={{ animation: "floaty 7s ease-in-out infinite" }}>
        <svg viewBox="0 0 120 144" className="h-full w-full overflow-visible">
          <defs>
            <radialGradient id="senn-body" cx="50%" cy="42%" r="65%">
              <stop offset="0%" stopColor="#fff6dd" />
              <stop offset="38%" stopColor="#d8ffd9" />
              <stop offset="78%" stopColor="#77e8b8" />
              <stop offset="100%" stopColor="#2c8f6b" />
            </radialGradient>
            <radialGradient id="senn-heart" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffedb8" />
              <stop offset="60%" stopColor="#ffc46b" />
              <stop offset="100%" stopColor="rgba(255, 180, 90, 0)" />
            </radialGradient>
            <linearGradient id="senn-leaf" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#4fd3a0" />
              <stop offset="100%" stopColor="#baffdf" />
            </linearGradient>
            <filter id="senn-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* aura */}
          <ellipse
            cx="60"
            cy="88"
            rx="42"
            ry="46"
            fill="rgba(127, 245, 201, 0.12)"
            style={{ animation: "breathe 5s ease-in-out infinite", transformOrigin: "60px 88px" }}
          />

          {/* leaf antlers */}
          <g style={{ animation: "sway 8s ease-in-out infinite", transformOrigin: "60px 46px" }}>
            <path
              d="M52 44 C38 34 30 20 32 6 C46 10 54 24 55 40 Z"
              fill="url(#senn-leaf)"
              opacity="0.95"
            />
            <path
              d="M68 44 C82 34 90 20 88 6 C74 10 66 24 65 40 Z"
              fill="url(#senn-leaf)"
              opacity="0.95"
            />
            <path d="M60 44 C57 32 58 22 60 12 C62 22 63 32 60 44 Z" fill="#c9ffe4" />
            <circle cx="60" cy="10" r="2.4" fill="#ffe9b3" filter="url(#senn-glow)" />
          </g>

          {/* root threads under body */}
          <g stroke="#6fe3b4" strokeWidth="1.6" fill="none" opacity="0.8" strokeLinecap="round">
            <path d="M48 118 C44 128 40 132 34 136" style={{ animation: "sway 6s ease-in-out infinite", transformOrigin: "48px 118px" }} />
            <path d="M60 122 C60 130 58 136 56 141" style={{ animation: "sway 7s ease-in-out infinite 0.8s", transformOrigin: "60px 122px" }} />
            <path d="M72 118 C76 128 80 132 86 136" style={{ animation: "sway 6.5s ease-in-out infinite 0.4s", transformOrigin: "72px 118px" }} />
          </g>

          {/* body */}
          <path
            d="M60 40 C90 62 96 96 60 126 C24 96 30 62 60 40 Z"
            fill="url(#senn-body)"
            stroke="#a9f5d4"
            strokeWidth="1.4"
            filter="url(#senn-glow)"
          />

          {/* belly veins */}
          <g stroke="#2f9a72" strokeWidth="1" fill="none" opacity="0.55" strokeLinecap="round">
            <path d="M60 96 C56 88 52 84 46 80" />
            <path d="M60 96 C64 88 68 84 74 80" />
            <path d="M60 96 L60 76" />
          </g>

          {/* heart light */}
          <circle
            cx="60"
            cy="96"
            r={speaking ? 10 : 7}
            fill="url(#senn-heart)"
            style={{
              transition: "r 0.4s ease",
              animation: speaking ? "pulseglow 0.8s ease-in-out infinite" : "pulseglow 3s ease-in-out infinite",
            }}
          />

          {/* eyes — lowered and averted when he cannot watch what he arranged */}
          {lookAway ? (
            <g>
              <path d="M44.6 73 C47 69.6 51 69.6 53.4 73" stroke="#10382a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <path d="M66.6 73 C69 69.6 73 69.6 75.4 73" stroke="#10382a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            <g style={{ animation: "blinkeye 6.4s ease-in-out infinite", transformOrigin: "60px 72px" }}>
              <ellipse cx="49" cy="72" rx="4.6" ry="5.4" fill="#10382a" />
              <ellipse cx="71" cy="72" rx="4.6" ry="5.4" fill="#10382a" />
              <circle cx="50.4" cy="70.4" r="1.5" fill="#eafff4" />
              <circle cx="72.4" cy="70.4" r="1.5" fill="#eafff4" />
            </g>
          )}

          {/* mouth — a content curve, or a flat line that isn't one */}
          <path
            d={lookAway ? "M56 85 L64 85" : speaking ? "M55 84 C58 88 62 88 65 84" : "M56 84 C59 86.4 61 86.4 64 84"}
            stroke="#155d43"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* orbiting motes */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: 4 + i,
              height: 4 + i,
              left: "50%",
              top: "55%",
              background: i === 1 ? "#ffd9a3" : "#a9f5d4",
              boxShadow: `0 0 8px ${i === 1 ? "#ffd9a3" : "#7ff5c9"}`,
              animation: `orbit${i} ${6 + i * 2.4}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* speaking ring */}
      {speaking && (
        <span
          className="absolute inset-0 rounded-full border border-emerald-200/50"
          style={{ animation: "rippleout 1.4s ease-out infinite" }}
        />
      )}

      <style>{`
        @keyframes orbit0 { from { transform: rotate(0deg) translateX(46px) rotate(0deg); } to { transform: rotate(360deg) translateX(46px) rotate(-360deg); } }
        @keyframes orbit1 { from { transform: rotate(120deg) translateX(56px) rotate(-120deg); } to { transform: rotate(480deg) translateX(56px) rotate(-480deg); } }
        @keyframes orbit2 { from { transform: rotate(240deg) translateX(38px) rotate(-240deg); } to { transform: rotate(600deg) translateX(38px) rotate(-600deg); } }
      `}</style>
    </motion.div>
  );
}
