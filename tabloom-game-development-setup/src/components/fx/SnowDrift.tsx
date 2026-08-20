import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  SnowDrift — layered falling snow with wind gusts. Pure canvas.     */
/* ------------------------------------------------------------------ */

export default function SnowDrift({ className = "" }: { className?: string }) {
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

    const flakes = Array.from({ length: 150 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 2.4,
      vy: 0.0006 + Math.random() * 0.0016,
      ph: Math.random() * Math.PI * 2,
      sw: 0.2 + Math.random() * 0.8,
      o: 0.25 + Math.random() * 0.6,
    }));

    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      const gust = Math.sin(t * 0.4) * 0.5 + Math.sin(t * 0.13) * 0.5;

      for (const f of flakes) {
        f.y += f.vy * (1 + Math.abs(gust) * 0.4);
        const drift = Math.sin(t * f.sw + f.ph) * 0.0006 + gust * 0.0009 * f.sw;
        f.x += drift;
        if (f.y > 1.05) {
          f.y = -0.05;
          f.x = Math.random();
        }
        if (f.x > 1.05) f.x = -0.05;
        if (f.x < -0.05) f.x = 1.05;

        const fx2 = f.x * w;
        const fy = f.y * h;
        ctx.globalAlpha = f.o * (0.6 + 0.4 * Math.sin(t * 1.4 + f.ph));
        if (f.r > 2.2) {
          // foreground blur flake
          const g = ctx.createRadialGradient(fx2, fy, 0, fx2, fy, f.r * 2.6);
          g.addColorStop(0, "rgba(225, 240, 255, 0.8)");
          g.addColorStop(1, "rgba(225, 240, 255, 0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(fx2, fy, f.r * 2.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = "rgba(215, 233, 250, 1)";
          ctx.beginPath();
          ctx.arc(fx2, fy, f.r, 0, Math.PI * 2);
          ctx.fill();
        }
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
