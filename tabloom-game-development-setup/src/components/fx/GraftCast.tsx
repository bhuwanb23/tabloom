import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  GraftCast — the teal-and-gold root-craft flourish that plays over  */
/*  a hotspot when Ari attempts a graft. Tendrils weave, ring forms,   */
/*  then the weave slips.                                              */
/* ------------------------------------------------------------------ */

export default function GraftCast({
  x = 38,
  y = 68,
}: {
  x?: number; // center, % of stage
  y?: number;
}) {
  const tendrils = [0, 1, 2, 3, 4, 5];
  return (
    <div
      className="pointer-events-none absolute z-40"
      style={{ left: `${x}%`, top: `${y}%`, width: 260, height: 260, transform: "translate(-50%, -50%)" }}
      aria-hidden
    >
      {/* core glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(127,245,201,0.28), rgba(255,217,163,0.1) 45%, transparent 70%)" }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: [0, 1, 0.85, 0], scale: [0.4, 1, 1.05, 0.7] }}
        transition={{ duration: 2.1, ease: "easeOut" }}
      />
      {/* weaving tendrils */}
      <svg viewBox="0 0 260 260" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="cast-tg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7ff5c9" />
            <stop offset="100%" stopColor="#ffd9a3" />
          </linearGradient>
          <filter id="cast-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {tendrils.map((i) => {
          const a = (i / tendrils.length) * Math.PI * 2;
          const x1 = 130 + Math.cos(a) * 108;
          const y1 = 130 + Math.sin(a) * 108;
          const cx = 130 + Math.cos(a + 0.9) * 46;
          const cy = 130 + Math.sin(a + 0.9) * 46;
          return (
            <motion.path
              key={i}
              d={`M${x1} ${y1} Q ${cx} ${cy} 130 130`}
              stroke="url(#cast-tg)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              filter="url(#cast-glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1, 0.2], opacity: [0, 1, 0.9, 0] }}
              transition={{ duration: 2, delay: i * 0.1, times: [0, 0.45, 0.75, 1], ease: "easeInOut" }}
            />
          );
        })}
        {/* the ring that almost forms */}
        <motion.circle
          cx="130"
          cy="130"
          r="34"
          fill="none"
          stroke="#bfffe2"
          strokeWidth="1.6"
          strokeDasharray="5 7"
          filter="url(#cast-glow)"
          initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
          animate={{ opacity: [0, 1, 0.9, 0], scale: [0.5, 1, 1.06, 1.3], rotate: 90 }}
          transition={{ duration: 2.1, times: [0, 0.4, 0.75, 1], ease: "easeOut" }}
          style={{ transformOrigin: "130px 130px" }}
        />
      </svg>
    </div>
  );
}
