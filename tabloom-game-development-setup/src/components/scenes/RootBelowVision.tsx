import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import rootBg from "../../assets/images/root-below.jpg";
import StaticNoise from "../fx/StaticNoise";
import Motes from "../fx/Motes";
import DeadAri from "../sprites/DeadAri";

/* ------------------------------------------------------------------ */
/*  RootBelowVision — the uninvited glimpse. Desaturated, chromatic-   */
/*  split, static-veiled. Clicking anywhere pans the camera along a    */
/*  FIXED preset path — never toward what the player chose. Agency,    */
/*  faked away.                                                        */
/* ------------------------------------------------------------------ */

/* the drift the vision has already decided on */
const DRIFT: { x: number; y: number; s: number }[] = [
  { x: 0, y: 0, s: 1.22 },
  { x: -7, y: 3, s: 1.3 },
  { x: -13, y: -2, s: 1.38 },
  { x: -6, y: -7, s: 1.46 },
  { x: 3, y: -4, s: 1.54 },
  { x: 9, y: 2, s: 1.62 },
];

export default function RootBelowVision({ showDead }: { showDead: boolean }) {
  const [step, setStep] = useState(0);

  /* any click, anywhere — the camera goes where it was always going */
  useEffect(() => {
    const onDown = () => setStep((s) => Math.min(s + 1, DRIFT.length - 1));
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  const d = DRIFT[step];

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* the painted rot, drifting on rails */}
      <motion.div
        className="absolute inset-[-8%]"
        animate={{ x: `${d.x}%`, y: `${d.y}%`, scale: d.s }}
        transition={{ duration: 6, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {/* chromatic aberration: three offset channel copies */}
        <img
          src={rootBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "grayscale(0.85) contrast(1.15) brightness(0.72)" }}
          draggable={false}
        />
        <img
          src={rootBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            filter: "grayscale(1) brightness(0.7) sepia(1) hue-rotate(-30deg) saturate(3)",
            mixBlendMode: "screen",
            transform: "translate(0.5%, -0.3%) scale(1.008)",
            opacity: 0.5,
          }}
          draggable={false}
        />
        <img
          src={rootBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            filter: "grayscale(1) brightness(0.7) sepia(1) hue-rotate(140deg) saturate(3)",
            mixBlendMode: "screen",
            transform: "translate(-0.5%, 0.3%) scale(1.008)",
            opacity: 0.45,
          }}
          draggable={false}
        />
      </motion.div>

      {/* the dead one — no hotspot, no approach, no permission */}
      <AnimatePresence>
        {showDead && (
          <motion.div
            className="absolute"
            style={{ left: "44%", top: "34%", width: "13%", height: "44%" }}
            initial={{ opacity: 0, filter: "blur(14px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.6, ease: "easeOut" }}
          >
            <DeadAri className="h-full w-full" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ash */}
      <Motes tone="dust" count={26} className="absolute inset-0 h-full w-full opacity-70" />

      {/* the vision's own grain — heavier than anywhere else */}
      <StaticNoise className="absolute inset-0 h-full w-full" opacity={0.5} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0 2px, transparent 2px 5px)" }}
      />
      {/* breathing dark — something down here is inhaling */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 260px rgba(0,0,0,0.9)" }}
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="grain-layer pointer-events-none absolute inset-0" style={{ opacity: 0.11 }} />
    </div>
  );
}
