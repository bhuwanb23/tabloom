import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Motes — drifting root-light particles. `tone` chooses palette.     */
/* ------------------------------------------------------------------ */

export default function Motes({
  className = "",
  tone = "root",
  count = 36,
}: {
  className?: string;
  tone?: "root" | "ice" | "dust" | "ember";
  count?: number;
}) {
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

    const colors = {
      root: ["127, 245, 201", "168, 255, 219", "255, 230, 168"],
      ice: ["159, 215, 255", "200, 235, 255", "140, 190, 240"],
      dust: ["170, 175, 185", "150, 155, 165", "130, 135, 145"],
      ember: ["255, 150, 120", "255, 110, 80", "210, 80, 60"],
    }[tone];

    const ps = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1.4,
      vy: 0.0002 + Math.random() * 0.0007,
      vx: (Math.random() - 0.5) * 0.0004,
      ph: Math.random() * Math.PI * 2,
      c: Math.floor(Math.random() * colors.length),
      o: 0.15 + Math.random() * 0.5,
    }));

    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of ps) {
        p.y -= p.vy;
        p.x += p.vx + Math.sin(t * 0.7 + p.ph) * 0.0002;
        if (p.y < -0.05) {
          p.y = 1.05;
          p.x = Math.random();
        }
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        const tw = 0.5 + 0.5 * Math.sin(t * 1.2 + p.ph);
        const a = p.o * tw;
        const px = p.x * w;
        const py = p.y * h;
        const g = ctx.createRadialGradient(px, py, 0, px, py, p.r * 4);
        g.addColorStop(0, `rgba(${colors[p.c]}, ${a})`);
        g.addColorStop(1, `rgba(${colors[p.c]}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [tone, count]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
