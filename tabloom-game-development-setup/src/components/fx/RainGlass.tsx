import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  RainGlass — raindrops beading & running down a window, plus        */
/*  faint rainfall streaks beyond the glass. Pure canvas.              */
/* ------------------------------------------------------------------ */

interface Drop {
  x: number;
  y: number;
  r: number;
  vy: number;
  wob: number;
  trail: { x: number; y: number; a: number }[];
}

export default function RainGlass({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // static beads
    const beads = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.6,
      tw: Math.random() * Math.PI * 2,
    }));

    // running drops
    const runners: Drop[] = [];
    const spawn = () => {
      runners.push({
        x: Math.random(),
        y: -0.05,
        r: 1.6 + Math.random() * 2.2,
        vy: 0.06 + Math.random() * 0.12,
        wob: Math.random() * Math.PI * 2,
        trail: [],
      });
    };
    for (let i = 0; i < 5; i++) {
      spawn();
      runners[i].y = Math.random();
    }

    // distant rain streaks
    const streaks = Array.from({ length: 36 }, () => ({
      x: Math.random(),
      y: Math.random(),
      len: 0.04 + Math.random() * 0.08,
      sp: 0.012 + Math.random() * 0.012,
      o: 0.05 + Math.random() * 0.08,
    }));

    let t = 0;
    let lastSpawn = 0;

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);

      // streaks beyond the glass
      ctx.strokeStyle = "rgba(180, 205, 225, 1)";
      ctx.lineWidth = 1;
      for (const s of streaks) {
        s.y += s.sp;
        if (s.y > 1.1) {
          s.y = -0.15;
          s.x = Math.random();
        }
        ctx.globalAlpha = s.o;
        ctx.beginPath();
        ctx.moveTo(s.x * w, s.y * h);
        ctx.lineTo(s.x * w - s.len * h * 0.18, s.y * h + s.len * h);
        ctx.stroke();
      }

      // static beads — tiny refraction glints
      for (const b of beads) {
        const tw = 0.5 + 0.5 * Math.sin(t * 0.02 + b.tw);
        ctx.globalAlpha = 0.1 + tw * 0.14;
        const bx = b.x * w;
        const by = b.y * h;
        const g = ctx.createRadialGradient(bx - b.r * 0.4, by - b.r * 0.4, 0.1, bx, by, b.r * 2.2);
        g.addColorStop(0, "rgba(220, 240, 255, 0.9)");
        g.addColorStop(0.5, "rgba(160, 190, 215, 0.25)");
        g.addColorStop(1, "rgba(120, 150, 180, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(bx, by, b.r * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // runners
      if (t - lastSpawn > 140 && runners.length < 9) {
        spawn();
        lastSpawn = t;
      }
      for (let i = runners.length - 1; i >= 0; i--) {
        const r = runners[i];
        r.wob += 0.03 + Math.random() * 0.02;
        r.x += Math.sin(r.wob) * 0.0006;
        r.y += r.vy * 0.012 * (1 + r.r * 0.25);
        r.trail.push({ x: r.x, y: r.y, a: 0.35 });
        if (r.trail.length > 26) r.trail.shift();

        // trail
        for (const p of r.trail) {
          p.a *= 0.94;
          ctx.globalAlpha = p.a * 0.6;
          ctx.fillStyle = "rgba(190, 215, 235, 1)";
          ctx.beginPath();
          ctx.arc(p.x * w, p.y * h, r.r * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }

        // head
        const hx = r.x * w;
        const hy = r.y * h;
        const g = ctx.createRadialGradient(hx - r.r * 0.5, hy - r.r * 0.6, 0.2, hx, hy, r.r * 2.4);
        g.addColorStop(0, "rgba(235, 248, 255, 0.95)");
        g.addColorStop(0.45, "rgba(170, 200, 225, 0.4)");
        g.addColorStop(1, "rgba(140, 170, 200, 0)");
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(hx, hy, r.r * 2.4, 0, Math.PI * 2);
        ctx.fill();

        if (r.y > 1.1) runners.splice(i, 1);
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
