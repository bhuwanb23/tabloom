import { motion } from "framer-motion";
import naraBg from "../../assets/images/nara-apartment.jpg";
import streetsBg from "../../assets/images/nara-streets.jpg";
import RainGlass from "../fx/RainGlass";
import Motes from "../fx/Motes";
import AriSprite from "../sprites/AriSprite";
import { MiraelSprite } from "../sprites/CastSprites";

/* ------------------------------------------------------------------ */
/*  Epilogue — Nara-0, where it started. Regrowth walks the rain       */
/*  streets; sundering returns to the apartment lamp; merge leaves     */
/*  Ari alone in a hollow frame.                                       */
/* ------------------------------------------------------------------ */

export type EpilogueMode = "together" | "alone" | "herAlone";

export default function Epilogue({ mode, lampFlicker = false }: { mode: EpilogueMode; lampFlicker?: boolean }) {
  const grade =
    mode === "together"
      ? "saturate(1.05) brightness(0.95)"
      : mode === "alone"
        ? "saturate(0.25) brightness(0.6)"
        : "saturate(0.5) brightness(0.72)";

  const bg = mode === "together" ? streetsBg : naraBg;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0b0e14]">
      {/* full circle for regrowth; apartment for the lamp endings */}
      <motion.img
        src={bg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transformOrigin: mode === "together" ? "50% 55%" : "22% 40%", filter: grade }}
        initial={{ scale: mode === "together" ? 1.18 : 1.34, opacity: 0 }}
        animate={{ scale: mode === "together" ? 1.08 : 1.24, opacity: 1 }}
        transition={{ scale: { duration: 34, ease: "easeOut" }, opacity: { duration: 3 } }}
        draggable={false}
      />

      {/* rain on the glass — the first sound in the game */}
      {mode !== "together" && (
        <div className="absolute inset-y-0 left-0 w-[58%] opacity-90">
          <RainGlass className="h-full w-full" />
        </div>
      )}
      {mode === "together" && (
        <div className="absolute inset-0 opacity-55">
          <RainGlass className="h-full w-full" />
        </div>
      )}

      {/* warmth, or its absence */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            mode === "together"
              ? "radial-gradient(ellipse at 62% 46%, rgba(255,214,150,0.22), transparent 62%)"
              : mode === "herAlone"
                ? "radial-gradient(ellipse at 66% 44%, rgba(255,206,138,0.14), transparent 58%)"
                : "radial-gradient(ellipse at 50% 50%, rgba(120,130,150,0.07), transparent 60%)",
          mixBlendMode: "screen",
        }}
      />

      {/* the lamp from act i — still answering, or barely */}
      {(mode === "together" || mode === "herAlone") && (
        <div
          className="absolute rounded-full"
          style={{
            left: "63%",
            top: "38%",
            width: "1.5%",
            paddingTop: "1.5%",
            background: "radial-gradient(circle, #ffe9b3, rgba(255,200,120,0.45) 60%, transparent)",
            boxShadow: "0 0 44px rgba(255,214,150,0.75)",
            animation: lampFlicker ? "flick 2.6s linear infinite" : "pulseglow 5s ease-in-out infinite",
          }}
        />
      )}

      {/* who is left in the room */}
      {mode === "together" && (
        <>
          <motion.div
            className="absolute"
            style={{ left: "40%", top: "44%", width: "9%", height: "40%" }}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2.4, delay: 0.6 }}
          >
            <AriSprite aspect="archivist" pose="standing" rim="#ffd9a3" />
          </motion.div>
          <motion.div
            className="absolute"
            style={{ left: "51%", top: "45%", width: "8%", height: "39%" }}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2.4, delay: 1 }}
          >
            <MiraelSprite className="h-full w-full" />
          </motion.div>
        </>
      )}

      {/* the hollow one: tiny figure, enormous empty frame */}
      {mode === "alone" && (
        <motion.div
          className="absolute"
          style={{ left: "47%", top: "58%", width: "4.5%", height: "20%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 4 }}
        >
          <AriSprite aspect="composite" pose="standing" rim="#8a94a6" />
        </motion.div>
      )}

      {/* her, and a lamp that keeps answering something that isn't there */}
      {mode === "herAlone" && (
        <motion.div
          className="absolute"
          style={{ left: "47%", top: "45%", width: "8%", height: "39%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3 }}
        >
          <MiraelSprite className="h-full w-full" />
        </motion.div>
      )}

      <Motes tone={mode === "alone" ? "dust" : "root"} count={mode === "alone" ? 10 : 18} className="absolute inset-0 h-full w-full opacity-50" />
      <div className="vignette-layer pointer-events-none absolute inset-0" />
      <div className="grain-layer pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/78 via-black/22 to-transparent" />
    </div>
  );
}
