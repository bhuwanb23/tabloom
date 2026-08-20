import { AnimatePresence, motion } from "framer-motion";
import type { BranchId } from "../game/types";
import naraBg from "../assets/images/nara-apartment.jpg";
import karthBg from "../assets/images/karth-battlefield.jpg";
import ShadowWall from "./ShadowWall";
import AriSprite, { type AriPose } from "./sprites/AriSprite";
import RainGlass from "./fx/RainGlass";
import SnowDrift from "./fx/SnowDrift";
import Motes from "./fx/Motes";
import { useParallax, parallaxStyle } from "../hooks/useParallax";

/* ------------------------------------------------------------------ */
/*  VnScene — the visual-novel stage. One painted background per       */
/*  branch, character sprite layer, state overlays (lamp, drawer,      */
/*  gate), weather VFX. Static art, motion from code.                  */
/* ------------------------------------------------------------------ */

type Flags = Record<string, boolean | string | number>;

function KenBurns({ src, tone }: { src: string; tone: "nara" | "karth" }) {
  return (
    <motion.img
      src={src}
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
      initial={{ scale: 1.06 }}
      animate={{ scale: 1.13, x: tone === "nara" ? "-0.8%" : "0.6%", y: "-0.4%" }}
      transition={{ duration: 46, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      draggable={false}
    />
  );
}

/* ------------------------- NARA-0 ------------------------- */
function NaraScene({ flags }: { flags: Flags }) {
  const pose = (flags.ariPose as AriPose | undefined) ?? "sitting";
  const spot = (flags.ariSpot as string | undefined) ?? "bed";
  const night = Boolean(flags.night);

  return (
    <>
      <div style={parallaxStyle(0.3)} className="absolute inset-[-2%]">
        <KenBurns src={naraBg} tone="nara" />
      </div>

      {/* rain on the window region (left third) */}
      <div className="absolute left-[2%] top-[6%] h-[66%] w-[32%] opacity-80">
        <RainGlass className="h-full w-full" />
      </div>

      {/* the wall of fifteen shadows — fades in slow, stays */}
      <div className="absolute right-[6%] top-[8%] h-[52%] w-[48%]">
        <AnimatePresence>
          {Boolean(flags.shadowsOn) && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.92 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2 }}
            >
              <ShadowWall tone="wall" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* terminal glow on the monitor */}
      <AnimatePresence>
        {Boolean(flags.terminalOn) && (
          <motion.div
            className="absolute"
            style={{ left: "39.5%", top: "44%", width: "9%", height: "13%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="h-full w-full rounded-[3px]"
              style={{
                background: "rgba(6,32,22,0.9)",
                boxShadow: "0 0 26px rgba(127,245,201,0.45), 0 0 70px rgba(127,245,201,0.15)",
                animation: "flick 4s linear infinite",
              }}
            />
            <div
              className="absolute -bottom-3 left-1/2 h-5 w-[220%] -translate-x-1/2 rounded-[50%]"
              style={{ background: "radial-gradient(ellipse, rgba(127,245,201,0.2), transparent 70%)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* lamp light */}
      <AnimatePresence>
        {Boolean(flags.lampOn) && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
          >
            <div
              className="absolute h-[46%] w-[34%]"
              style={{
                left: "46%",
                top: "18%",
                background: "radial-gradient(ellipse at 62% 30%, rgba(255,214,150,0.42), rgba(255,196,110,0.14) 45%, transparent 72%)",
                mixBlendMode: "screen",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                left: "59.4%",
                top: "36%",
                width: "1.6%",
                paddingTop: "1.6%",
                background: "radial-gradient(circle, #ffe9b3, rgba(255,200,120,0.5) 60%, transparent)",
                boxShadow: "0 0 40px rgba(255,214,150,0.8)",
                animation: "pulseglow 4s ease-in-out infinite",
              }}
            />
            {/* warm light pooling on the floor */}
            <div
              className="absolute rounded-[50%]"
              style={{
                left: "50%",
                top: "72%",
                width: "22%",
                height: "12%",
                background: "radial-gradient(ellipse, rgba(255,214,150,0.2), transparent 70%)",
                mixBlendMode: "screen",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* drawer crack — amber seep through a hairline split */}
      <AnimatePresence>
        {Boolean(flags.drawerCracked) && (
          <motion.div
            className="absolute"
            style={{ left: "34%", top: "66%", width: "8%", height: "9%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg viewBox="0 0 100 110" className="h-full w-full overflow-visible">
              <path
                d="M12 8 L 34 34 L 26 52 L 52 78 L 46 100"
                stroke="#ffce8a"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 6px rgba(255,206,138,0.8))" }}
              />
            </svg>
            <div
              className="absolute inset-[-30%] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(255,206,138,0.18), transparent 70%)", animation: "pulseglow 3.4s ease-in-out infinite" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ari — the one body */}
      {spot === "bed" && (
        <div
          className="absolute"
          style={
            pose === "lying"
              ? { left: "59%", top: "62%", width: "27%", height: "13%" }
              : { left: "63%", top: "47%", width: "17%", height: "30%" }
          }
        >
          <AriSprite aspect="archivist" pose={pose} rim="#9fb4c8" />
        </div>
      )}
      {spot === "desk" && pose === "standing" && (
        <div className="absolute" style={{ left: "47.5%", top: "30%", width: "13%", height: "44%" }}>
          <AriSprite aspect="archivist" pose="standing" rim="#9fb4c8" />
        </div>
      )}

      <Motes tone="dust" count={14} className="absolute inset-0 h-full w-full opacity-60" />

      {/* readability scrim */}
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 bg-[#020409] transition-opacity duration-[2200ms]"
        style={{ opacity: night ? 0.42 : 0 }}
      />
    </>
  );
}

/* ------------------------- KARTH-MUUN ------------------------- */
function KarthScene({ flags }: { flags: Flags }) {
  const ariHere = (flags.ariSpot as string | undefined) === "karth";
  const night = Boolean(flags.night);

  return (
    <>
      <div style={parallaxStyle(0.3)} className="absolute inset-[-2%]">
        <KenBurns src={karthBg} tone="karth" />
      </div>

      {/* faint living aurora over the painted one */}
      <div className="absolute inset-x-[-6%] top-[2%] h-[34%] opacity-50">
        <div
          className="absolute left-[16%] top-0 h-[80%] w-[40%]"
          style={{
            background: "linear-gradient(180deg, rgba(96,255,196,0.22), transparent 70%)",
            filter: "blur(30px)",
            animation: "auroraA 24s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute left-[48%] top-[6%] h-[74%] w-[36%]"
          style={{
            background: "linear-gradient(180deg, rgba(160,140,255,0.18), transparent 70%)",
            filter: "blur(34px)",
            animation: "auroraB 29s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* the ice gate's seam of warm light */}
      <AnimatePresence>
        {Boolean(flags.gateWarm) && (
          <motion.div
            className="absolute"
            style={{ left: "46.6%", top: "24%", width: "7%", height: "34%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.2 }}
          >
            <svg viewBox="0 0 100 400" className="h-full w-full overflow-visible" preserveAspectRatio="none">
              <path
                d="M50 4 L 38 90 L 58 150 L 42 210 L 60 280 L 48 360 L 52 396"
                stroke="#ffe0ae"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 14px rgba(255,214,150,0.9)) drop-shadow(0 0 44px rgba(255,196,110,0.5))" }}
              />
            </svg>
            <div
              className="absolute inset-[-40%] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(255,214,150,0.2), transparent 65%)", animation: "pulseglow 4s ease-in-out infinite" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {Boolean(flags.gateWarm) && <Motes tone="root" count={10} className="absolute inset-0 h-full w-full opacity-50" />}

      {/* his fifteen shadows, falling wrong across the ice */}
      <div className="absolute bottom-[0%] left-[8%] right-[8%] h-[26%]">
        <AnimatePresence>
          {Boolean(flags.shadowsOn) && (
            <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ duration: 2.4 }}>
              <ShadowWall tone="ice" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* the oathblade on the ice */}
      {ariHere && (
        <div className="absolute" style={{ left: "24%", top: "34%", width: "9.5%", height: "42%" }}>
          <AriSprite aspect="oathblade" pose="standing" rim="#9fd7ff" />
        </div>
      )}

      <SnowDrift className="absolute inset-0 h-full w-full" />
      <Motes tone="ice" count={14} className="absolute inset-0 h-full w-full opacity-45" />

      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 bg-[#01040c] transition-opacity duration-[2200ms]"
        style={{ opacity: night ? 0.3 : 0 }}
      />
    </>
  );
}

/* ------------------------- SHELL ------------------------- */

export default function VnScene({
  branch,
  flags,
}: {
  branch: BranchId;
  flags: Flags;
}) {
  const ref = useParallax<HTMLDivElement>();
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-[#05070a]">
      {branch === "nara" && <NaraScene flags={flags} />}
      {branch === "karth" && <KarthScene flags={flags} />}
      {branch === "void" && (
        <div className="absolute inset-0 bg-[#05070a]">
          <Motes tone="root" count={26} className="absolute inset-0 h-full w-full opacity-60" />
        </div>
      )}
    </div>
  );
}
