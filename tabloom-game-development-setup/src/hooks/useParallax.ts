import { useEffect, useRef, type CSSProperties } from "react";

/* Tiny parallax: sets --px / --py (-1..1) CSS vars on the container. */
export function useParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = ((e.clientX - r.left) / Math.max(r.width, 1) - 0.5) * 2;
      const py = ((e.clientY - r.top) / Math.max(r.height, 1) - 0.5) * 2;
      el.style.setProperty("--px", px.toFixed(3));
      el.style.setProperty("--py", py.toFixed(3));
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return ref;
}

export const parallaxStyle = (depth: number): CSSProperties => ({
  transform: `translate3d(calc(var(--px, 0) * ${depth * 14}px), calc(var(--py, 0) * ${depth * 9}px), 0)`,
  transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
});
