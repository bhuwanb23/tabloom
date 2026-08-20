import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  StaticNoise — the raw churn between tabs. Low-fps ImageData        */
/*  noise with drifting root-light veins.                              */
/* ------------------------------------------------------------------ */

export default function StaticNoise({
  className = "",
  opacity = 1,
}: {
  className?: string;
  opacity?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const NW = 160;
    const NH = 100;
    const off = document.createElement("canvas");
    off.width = NW;
    off.height = NH;
    const octx = off.getContext("2d")!;
    const img = octx.createImageData(NW, NH);

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let frame = 0;
    let veinT = 0;
    const draw = () => {
      if (!running) return;
      frame++;
      veinT += 0.008;

      if (frame % 3 === 0) {
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const v = Math.random() * 255;
          d[i] = v * 0.55;
          d[i + 1] = v;
          d[i + 2] = v * 0.8;
          d[i + 3] = Math.random() > 0.5 ? 26 : 8;
        }
        octx.putImageData(img, 0, 0);
      }

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(off, 0, 0, w, h);

      // drifting veins of root-light inside the static
      ctx.globalCompositeOperation = "lighter";
      for (let k = 0; k < 4; k++) {
        ctx.beginPath();
        const yBase = h * (0.2 + k * 0.22);
        for (let x = 0; x <= w; x += 14) {
          const y =
            yBase +
            Math.sin(x * 0.008 + veinT * (1 + k * 0.3) + k * 2.2) * 26 +
            Math.sin(x * 0.02 - veinT * 1.7 + k) * 10;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(127, 245, 201, ${0.05 - k * 0.008})`;
        ctx.lineWidth = 1.4 - k * 0.2;
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} style={{ opacity }} aria-hidden />;
}
