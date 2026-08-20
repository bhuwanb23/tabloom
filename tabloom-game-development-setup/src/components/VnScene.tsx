import { AnimatePresence, motion } from "framer-motion";
import type { BranchId } from "../game/types";
import naraBg from "../assets/images/nara-apartment.jpg";
import karthBg from "../assets/images/karth-battlefield.jpg";
import chamberBg from "../assets/images/curse-heart-chamber.jpg";
import wardBg from "../assets/images/ora-ward.jpg";
import archiveBg from "../assets/images/veyr-archive.jpg";
import edenBg from "../assets/images/eden-garden.jpg";
import rootBg from "../assets/images/root-below.jpg";
import siteBg from "../assets/images/dead-ari-site.jpg";
import DeadAri from "./sprites/DeadAri";
import SennAvatar from "./SennAvatar";
import ShadowWall from "./ShadowWall";
import AriSprite, { type AriPose } from "./sprites/AriSprite";
import { KaelSprite, MiraelSprite, SoldierSprite, CastPresence } from "./sprites/CastSprites";
import RootBelowVision from "./scenes/RootBelowVision";
import RainGlass from "./fx/RainGlass";
import SnowDrift from "./fx/SnowDrift";
import Motes from "./fx/Motes";
import { useParallax, parallaxStyle } from "../hooks/useParallax";

/* ------------------------------------------------------------------ */
/*  VnScene — the visual-novel stage. Painted backgrounds, character   */
/*  sprite layer, state overlays (lamp, drawer, gate, thaw, chamber),  */
/*  weather VFX. Static art, motion from code.                         */
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
  const revisit = Boolean(flags.revisit); // act vi — same room, later, changed

  return (
    <>
      <div style={parallaxStyle(0.3)} className="absolute inset-[-2%]">
        <KenBurns src={naraBg} tone="nara" />
      </div>

      {/* the revisit grade — warmer and dimmer. time has passed; so has he */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(200deg, rgba(120,72,30,0.3), rgba(20,14,10,0.5))", mixBlendMode: "soft-light" }}
        animate={{ opacity: revisit ? 1 : 0 }}
        transition={{ duration: 2.6 }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[#160f08]"
        animate={{ opacity: revisit ? 0.34 : 0 }}
        transition={{ duration: 2.6 }}
      />

      <div className="absolute left-[2%] top-[6%] h-[66%] w-[32%] opacity-80">
        <RainGlass className="h-full w-full" />
      </div>

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

      <AnimatePresence>
        {Boolean(flags.drawerCracked) && !flags.drawerOpen && (
          <motion.div
            className="absolute"
            style={{ left: "34%", top: "66%", width: "8%", height: "9%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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

      {/* the third state: open. light comes out of a drawer, which is not a thing drawers do */}
      <AnimatePresence>
        {Boolean(flags.drawerOpen) && (
          <motion.div
            className="absolute"
            style={{ left: "31%", top: "63%", width: "14%", height: "14%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8 }}
          >
            {/* the opened mouth of it */}
            <div
              className="absolute left-[16%] top-[26%] h-[38%] w-[62%] rounded-[2px]"
              style={{
                background: "linear-gradient(180deg, rgba(255,232,190,0.9), rgba(255,190,110,0.35))",
                boxShadow: "0 0 34px rgba(255,206,138,0.8), 0 0 90px rgba(255,180,90,0.4)",
              }}
            />
            {/* the light it spills across the floor */}
            <div
              className="absolute left-[-30%] top-[52%] h-[70%] w-[170%]"
              style={{
                background: "radial-gradient(ellipse at 40% 20%, rgba(255,206,138,0.32), transparent 70%)",
                mixBlendMode: "screen",
              }}
            />
            <Motes tone="root" count={10} className="absolute inset-[-60%] h-[220%] w-[220%] opacity-70" />
          </motion.div>
        )}
      </AnimatePresence>

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
      {spot === "desk" && (pose === "standing" || pose === "weary") && (
        <div className="absolute" style={{ left: "47.5%", top: "30%", width: "13%", height: "44%" }}>
          <AriSprite aspect="archivist" pose={pose} rim={revisit ? "#e0b48a" : "#9fb4c8"} />
        </div>
      )}

      <Motes tone="dust" count={14} className="absolute inset-0 h-full w-full opacity-60" />

      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 bg-[#020409] transition-opacity duration-[2200ms]"
        style={{ opacity: night ? 0.42 : 0 }}
      />
    </>
  );
}

/* ------------------------- KARTH-MUUN · WIDE ------------------------- */
function KarthWide({ flags }: { flags: Flags }) {
  const spot = (flags.ariSpot as string | undefined) ?? "karth";
  const fullThaw = Boolean(flags.fullThaw); // act vii — the loop is broken

  return (
    <>
      <div style={parallaxStyle(0.3)} className="absolute inset-[-2%]">
        <motion.div
          className="absolute inset-0"
          animate={{
            filter: fullThaw
              ? "hue-rotate(-28deg) saturate(1.35) brightness(1.16) contrast(0.97)"
              : "hue-rotate(0deg) saturate(1) brightness(1)",
          }}
          transition={{ duration: 5, ease: "easeInOut" }}
        >
          <KenBurns src={karthBg} tone="karth" />
        </motion.div>
      </div>

      {/* the thaw grade — green light coming up out of ground that was ice */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,214,150,0.16) 0%, transparent 40%), radial-gradient(ellipse at 50% 96%, rgba(96,200,140,0.4), transparent 62%)",
          mixBlendMode: "screen",
        }}
        animate={{ opacity: fullThaw ? 1 : 0 }}
        transition={{ duration: 5, ease: "easeInOut" }}
      />
      {fullThaw && <Motes tone="root" count={26} className="absolute inset-0 h-full w-full opacity-65" />}

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

      {/* the ice gate's seam of warm light (act i ripple — persists) */}
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

      {/* the thawed corner — permanent once the heart cracks */}
      <AnimatePresence>
        {Boolean(flags.thawed) && (
          <motion.div
            className="absolute bottom-0 left-0 h-[34%] w-[38%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.6 }}
          >
            {/* melt pool */}
            <div
              className="absolute bottom-[4%] left-[6%] h-[42%] w-[74%] rounded-[50%]"
              style={{
                background:
                  "radial-gradient(ellipse at 40% 40%, rgba(80,170,210,0.4), rgba(20,50,80,0.5) 55%, rgba(10,25,45,0.2) 75%, transparent)",
                boxShadow: "inset 0 0 30px rgba(120,200,255,0.25)",
              }}
            />
            {/* aurora reflection in the pool */}
            <div
              className="absolute bottom-[10%] left-[16%] h-[14%] w-[40%] rounded-[50%] opacity-50"
              style={{ background: "linear-gradient(90deg, rgba(96,255,196,0.3), rgba(160,140,255,0.25))", filter: "blur(6px)", animation: "auroraA 18s ease-in-out infinite alternate" }}
            />
            {/* steam */}
            {[0, 1].map((i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  bottom: `${30 + i * 8}%`,
                  left: `${18 + i * 12}%`,
                  width: "26%",
                  height: "30%",
                  background: "radial-gradient(ellipse, rgba(220,235,255,0.16), transparent 70%)",
                  filter: "blur(8px)",
                  animation: `floaty ${5 + i * 1.4}s ease-in-out infinite`,
                }}
              />
            ))}
            {/* the first green — small root-shoots at the pool's edge */}
            <svg viewBox="0 0 200 80" className="absolute bottom-[6%] left-[58%] h-[26%] w-[34%] overflow-visible">
              <g stroke="#7ff5c9" strokeWidth="2" fill="none" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 4px rgba(127,245,201,0.5))" }}>
                <path d="M30 72 C 28 58, 24 50, 18 44 M30 72 C 32 60, 38 52, 46 48 M30 72 L 30 60" />
                <path d="M90 74 C 88 62, 84 56, 78 52 M90 74 C 93 64, 99 58, 106 56" />
                <path d="M150 74 L 150 62 M150 62 C 146 54, 140 50, 134 48 M150 62 C 154 54, 160 50, 166 48" />
              </g>
              <circle cx="18" cy="42" r="2.4" fill="#ffd9a3" />
              <circle cx="106" cy="54" r="2.2" fill="#ffd9a3" />
            </svg>
            <Motes tone="root" count={10} className="absolute inset-0 h-full w-full opacity-60" />
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* ari — small in the establishing frame, or full on the ice */}
      {spot === "karthFar" && (
        <div className="absolute" style={{ left: "42%", top: "47%", width: "5%", height: "22%" }}>
          <AriSprite aspect="oathblade" pose="standing" rim="#9fd7ff" />
        </div>
      )}
      {spot === "karth" && (
        <div className="absolute" style={{ left: "22%", top: "34%", width: "9.5%", height: "42%" }}>
          <AriSprite aspect="oathblade" pose="standing" rim="#9fd7ff" />
        </div>
      )}

      {/* the distant woman by the banners */}
      <CastPresence show={Boolean(flags.miraelHere)} delay={0.4}>
        <div className="absolute" style={{ left: "55%", top: "36%", width: "4.4%", height: "24%", opacity: 0.85 }}>
          <MiraelSprite />
        </div>
      </CastPresence>

      {/* kael orin, out of the reset's white */}
      <CastPresence show={Boolean(flags.kaelHere)} delay={0.2}>
        <div className="absolute" style={{ left: "64%", top: "30%", width: "11%", height: "46%" }}>
          <KaelSprite />
        </div>
      </CastPresence>

      <SnowDrift className="absolute inset-0 h-full w-full" />
      <Motes tone="ice" count={14} className="absolute inset-0 h-full w-full opacity-45" />

      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
    </>
  );
}

/* ------------------------- KARTH-MUUN · INTIMATE (the soldier) ------------------------- */
function KarthIntimate({ flags }: { flags: Flags }) {
  return (
    <>
      {/* zoomed crop of the same painted field — framed on the thaw corner */}
      <motion.img
        src={karthBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transformOrigin: "30% 74%" }}
        initial={{ scale: 1.8 }}
        animate={{ scale: 1.88 }}
        transition={{ duration: 40, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        draggable={false}
      />
      <div className="absolute inset-0 bg-[#07101f]/55" />

      {/* the thaw, close enough to touch */}
      {Boolean(flags.thawed) && (
        <div className="absolute bottom-[2%] left-0 h-[36%] w-[48%]">
          <div
            className="absolute bottom-[4%] left-[5%] h-[44%] w-[76%] rounded-[50%]"
            style={{
              background: "radial-gradient(ellipse at 40% 40%, rgba(80,170,210,0.42), rgba(20,50,80,0.5) 55%, transparent 78%)",
              boxShadow: "inset 0 0 30px rgba(120,200,255,0.25)",
            }}
          />
          <svg viewBox="0 0 200 80" className="absolute bottom-[8%] left-[54%] h-[30%] w-[36%] overflow-visible">
            <g stroke="#7ff5c9" strokeWidth="2.2" fill="none" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 5px rgba(127,245,201,0.6))" }}>
              <path d="M30 72 C 28 58, 24 50, 18 44 M30 72 C 32 60, 38 52, 46 48 M30 72 L 30 60" />
              <path d="M90 74 C 88 62, 84 56, 78 52 M90 74 C 93 64, 99 58, 106 56" />
            </g>
            <circle cx="18" cy="42" r="2.6" fill="#ffd9a3" />
          </svg>
          <Motes tone="root" count={8} className="absolute inset-0 h-full w-full opacity-60" />
        </div>
      )}

      {/* ari standing close */}
      <div className="absolute" style={{ left: "12%", top: "40%", width: "12%", height: "42%" }}>
        <AriSprite aspect="oathblade" pose="standing" rim="#9fd7ff" />
      </div>

      {/* the dying soldier — fades out respectfully when gone */}
      <CastPresence show={Boolean(flags.soldierHere) && !Boolean(flags.soldierGone)} delay={0.3}>
        <div className="absolute" style={{ left: "50%", top: "58%", width: "38%", height: "22%" }}>
          <SoldierSprite />
        </div>
      </CastPresence>

      <SnowDrift className="absolute inset-0 h-full w-full opacity-80" />
      <Motes tone="ice" count={10} className="absolute inset-0 h-full w-full opacity-40" />

      <div className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 200px rgba(0,0,0,0.6)" }} />
    </>
  );
}

/* ------------------------- THE HEART CHAMBER ------------------------- */
function ChamberScene({ flags }: { flags: Flags }) {
  return (
    <>
      <motion.img
        src={chamberBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1.14 }}
        transition={{ duration: 38, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        draggable={false}
      />

      {/* the heart's red pulse — extinguished once it is finally broken */}
      <motion.div
        className="absolute left-1/2 top-[8%] h-[52%] w-[46%] -translate-x-1/2"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(255,70,50,0.22), rgba(160,20,20,0.1) 45%, transparent 70%)",
          animation: "breathe 1.4s ease-in-out infinite",
          mixBlendMode: "screen",
        }}
        animate={{ opacity: flags.heartDead ? 0 : 1 }}
        transition={{ duration: 4 }}
      />
      {/* what is left when it stops: cold, grey, quiet */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(120,130,150,0.14), transparent 60%)", mixBlendMode: "screen" }}
        animate={{ opacity: flags.heartDead ? 1 : 0 }}
        transition={{ duration: 4 }}
      />

      {/* after the prune — the cracked seam bleeds embers */}
      <AnimatePresence>
        {Boolean(flags.heartCracked) && (
          <motion.div
            className="absolute left-1/2 top-[14%] h-[44%] w-[30%] -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <svg viewBox="0 0 200 300" className="h-full w-full overflow-visible">
              <path
                d="M100 10 L 84 90 L 108 140 L 90 200 L 104 250 L 98 290"
                stroke="#ffce8a"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 14px rgba(255,196,110,0.9)) drop-shadow(0 0 44px rgba(255,120,80,0.6))" }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
      {Boolean(flags.heartCracked) && <Motes tone="ember" count={18} className="absolute inset-0 h-full w-full opacity-70" />}

      {/* kael waits by the wall while you work */}
      <CastPresence show={Boolean(flags.kaelHere)} delay={0.2}>
        <div className="absolute" style={{ left: "8%", top: "34%", width: "10%", height: "44%" }}>
          <KaelSprite />
        </div>
      </CastPresence>

      <Motes tone="ice" count={12} className="absolute inset-0 h-full w-full opacity-35" />
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 220px rgba(0,0,0,0.55)" }} />
    </>
  );
}

/* ------------------------- ORA-VELL ------------------------- */
function OraScene({ flags }: { flags: Flags }) {
  const inArchive = Boolean(flags.archive);

  return (
    <>
      {/* the ward pushes in slowly; the archive holds tighter and closer */}
      <motion.img
        key={inArchive ? "arch" : "ward"}
        src={inArchive ? archiveBg : wardBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: inArchive ? 1.04 : 1.02, opacity: 0 }}
        animate={{ scale: inArchive ? 1.1 : 1.16, opacity: 1 }}
        transition={{
          scale: { duration: inArchive ? 40 : 26, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
          opacity: { duration: 1.6 },
        }}
        draggable={false}
      />

      {/* ward: warm shafts through tall windows */}
      {!inArchive && (
        <>
          <div
            className="absolute inset-y-0 left-[6%] w-[34%] opacity-40"
            style={{ background: "linear-gradient(112deg, rgba(255,226,170,0.28), transparent 62%)", mixBlendMode: "screen" }}
          />
          <Motes tone="dust" count={22} className="absolute inset-0 h-full w-full opacity-70" />
        </>
      )}

      {/* archive: the lamp, and the red thread catching it */}
      {inArchive && (
        <>
          <div
            className="absolute h-[38%] w-[30%]"
            style={{
              left: "52%",
              top: "34%",
              background: "radial-gradient(ellipse at 40% 40%, rgba(255,196,110,0.3), transparent 70%)",
              mixBlendMode: "screen",
              animation: "flick 6s linear infinite",
            }}
          />
          <Motes tone="dust" count={16} className="absolute inset-0 h-full w-full opacity-60" />
        </>
      )}

      {/* ari — deliberately smaller and lower in frame: he is recovering */}
      {!inArchive && (
        <div className="absolute" style={{ left: "40%", top: "52%", width: "8.5%", height: "34%" }}>
          <AriSprite aspect="patient" pose="standing" rim="#ffd9a3" />
        </div>
      )}
      {inArchive && (
        <div className="absolute" style={{ left: "16%", top: "44%", width: "9.5%", height: "40%" }}>
          <AriSprite aspect="patient" pose="standing" rim="#ffd9a3" />
        </div>
      )}

      {/* the weight of the discovery — vignette creeping in from the edges */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 200px 40px rgba(0,0,0,0.95)" }}
        animate={{ opacity: flags.weight ? 1 : 0 }}
        transition={{ duration: 4.5, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[#0a0704]"
        animate={{ opacity: flags.weight ? 0.42 : 0 }}
        transition={{ duration: 4.5, ease: "easeInOut" }}
      />

      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/78 via-black/25 to-transparent" />
    </>
  );
}

/* ------------------------- GLASS EDEN ------------------------- */
function EdenScene({ flags }: { flags: Flags }) {
  const dead = Boolean(flags.edenDead); // the lie, caught
  const projection = Boolean(flags.miraelFake);
  const real = Boolean(flags.miraelReal);

  return (
    <>
      {/* the garden. it does not move much, because nothing here does */}
      <motion.img
        src={edenBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.03, opacity: 0 }}
        animate={{
          scale: 1.08,
          opacity: 1,
          filter: dead ? "saturate(0.1) brightness(0.66) contrast(1.05)" : "saturate(1) brightness(1)",
        }}
        transition={{
          scale: { duration: 52, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
          opacity: { duration: 3.6, ease: "easeInOut" }, // the long, slow arrival
          filter: { duration: 4, ease: "easeInOut" },
        }}
        draggable={false}
      />

      {/* honeyed air — withdrawn when the branch stops pretending */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 30% 24%, rgba(255,220,170,0.24), transparent 62%)",
          mixBlendMode: "screen",
        }}
        animate={{ opacity: dead ? 0 : 1 }}
        transition={{ duration: 4 }}
      />
      {!dead && <Motes tone="root" count={18} className="absolute inset-0 h-full w-full opacity-40" />}
      {dead && <Motes tone="dust" count={22} className="absolute inset-0 h-full w-full opacity-60" />}

      {/* ari — relaxed, standing easy for once */}
      <div className="absolute" style={{ left: "31%", top: "42%", width: "9.5%", height: "42%" }}>
        <AriSprite aspect="patient" pose="standing" rim={dead ? "#8f9aa8" : "#ffd9c8"} />
      </div>

      {/* the projection — close, warm, and very slightly too bright */}
      <AnimatePresence>
        {projection && (
          <motion.div
            className="absolute"
            style={{ left: "45%", top: "40%", width: "8.5%", height: "44%" }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, transition: { duration: 3.4, ease: "easeInOut" } }}
            transition={{ duration: 2.4 }}
          >
            {/* the tell: a soft halo at ~8% — invisible unless you're looking */}
            <div
              className="absolute inset-[-18%]"
              style={{
                background: "radial-gradient(ellipse, rgba(255,240,220,0.085), transparent 68%)",
                animation: "pulseglow 7s ease-in-out infinite",
              }}
            />
            <MiraelSprite className="relative h-full w-full" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* the real one — no halo */}
      <CastPresence show={real} delay={0.2}>
        <div className="absolute" style={{ left: "48%", top: "41%", width: "8.5%", height: "43%" }}>
          <MiraelSprite className="h-full w-full" />
        </div>
      </CastPresence>

      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/72 via-black/22 to-transparent" />
    </>
  );
}

/* ------------------------- THE ROOT BELOW · REAL ACCESS ------------------------- */
/* deliberately NOT act iii: no static, no chromatic split, no drift-on-rails.
   he is allowed to be here, and the frame is steady because of it. */
function RootScene({ flags }: { flags: Flags }) {
  const atSite = Boolean(flags.site);

  return (
    <>
      <motion.img
        key={atSite ? "site" : "roots"}
        src={atSite ? siteBg : rootBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1.11, opacity: 1 }}
        transition={{
          scale: { duration: 44, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
          opacity: { duration: 2.2 },
        }}
        draggable={false}
      />

      {/* corpse-light seeping from the dead branches */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(255,196,110,0.12), transparent 60%)",
          mixBlendMode: "screen",
          animation: "pulseglow 7s ease-in-out infinite",
        }}
      />

      {/* ari — composite, standing steady */}
      <div className="absolute" style={{ left: atSite ? "20%" : "38%", top: "38%", width: "11%", height: "44%" }}>
        <AriSprite aspect="composite" pose="standing" rim="#bfffe2" />
      </div>

      {/* the one who came before */}
      {atSite && (
        <motion.div
          className="absolute"
          style={{ left: "44%", top: "56%", width: "34%", height: "20%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: 0.6 }}
        >
          <DeadAri stable className="h-full w-full" />
        </motion.div>
      )}

      {/* senn, diminished — smaller and lower than he has ever been */}
      <AnimatePresence>
        {Boolean(flags.sennSmall) && (
          <motion.div
            className="absolute"
            style={{ left: "72%", top: "72%" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 0.9, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <SennAvatar size={52} lookAway={Boolean(flags.sennAway)} />
          </motion.div>
        )}
      </AnimatePresence>

      <Motes tone="dust" count={24} className="absolute inset-0 h-full w-full opacity-65" />
      <Motes tone="ember" count={10} className="absolute inset-0 h-full w-full opacity-45" />

      <div className="absolute inset-x-0 bottom-0 h-[44%] bg-gradient-to-t from-black/82 via-black/28 to-transparent" />
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 200px rgba(0,0,0,0.72)" }} />
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

  /* act iii: the vision overrides every branch — you are not in control right now */
  if (flags.rootBelow) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-black">
        <RootBelowVision showDead={Boolean(flags.deadAri)} />
      </div>
    );
  }

  /* act viii: the same place, entered on his own feet */
  if (flags.rootReal) {
    return (
      <div ref={ref} className="absolute inset-0 overflow-hidden bg-[#07060a]">
        <RootScene flags={flags} />
      </div>
    );
  }

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-[#05070a]">
      {branch === "nara" && <NaraScene flags={flags} />}
      {branch === "karth" && (
        Boolean(flags.chamber) ? (
          <ChamberScene flags={flags} />
        ) : Boolean(flags.intimate) ? (
          <KarthIntimate flags={flags} />
        ) : (
          <KarthWide flags={flags} />
        )
      )}
      {branch === "ora" && <OraScene flags={flags} />}
      {branch === "eden" && <EdenScene flags={flags} />}
      {branch === "void" && (
        <div className="absolute inset-0 bg-[#05070a]">
          <Motes tone="root" count={26} className="absolute inset-0 h-full w-full opacity-60" />
        </div>
      )}
    </div>
  );
}
