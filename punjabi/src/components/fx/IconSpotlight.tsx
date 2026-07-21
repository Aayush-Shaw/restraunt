"use client";

import { useEffect, useRef, useState } from "react";

// Faint tiled food-icon texture, always on; a red copy follows the cursor on fine
// pointers, or drifts on its own (CSS) on touch. Ported from script.js — the
// fine/touch split is done with a CSS media query so no client state is needed.
const iconTile = (stroke: string): string =>
  `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140' fill='none' stroke='${stroke}' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M22 46 L37 16 L54 44 Z'/><path d='M37 16 L37 45'/><circle cx='100' cy='26' r='12'/><path d='M109 34 L122 47'/><path d='M122 47 l-6 2 2 6'/><path d='M16 94 Q35 116 54 94'/><path d='M14 93 L56 93'/><path d='M26 86 Q35 92 44 86'/><path d='M30 80 q4 -5 0 -10'/><path d='M40 80 q4 -5 0 -10'/><path d='M76 116 L120 98'/><ellipse cx='86' cy='110' rx='6' ry='5' transform='rotate(-22 86 110)'/><ellipse cx='98' cy='105' rx='6' ry='5' transform='rotate(-22 98 105)'/><ellipse cx='110' cy='100' rx='6' ry='5' transform='rotate(-22 110 100)'/><ellipse cx='72' cy='64' rx='17' ry='12' transform='rotate(-16 72 64)'/><circle cx='68' cy='62' r='1.3'/><circle cx='78' cy='66' r='1.3'/><circle cx='72' cy='68' r='1.3'/></svg>")`.replace(
    /#/g,
    "%23",
  );

export function IconSpotlight() {
  const glowRef = useRef<HTMLDivElement>(null);
  // Mouse users get the cursor glow; touch gets the self-drifting glow.
  // null until detected on mount, so SSR renders neither (no hydration guess).
  const [fine, setFine] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = (): void => setFine(mq.matches);
    update();
    mq.addEventListener("change", update); // e.g. a mouse plugged into a tablet
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!fine) return;
    const onMove = (e: MouseEvent): void => {
      const el = glowRef.current;
      if (!el) return;
      el.style.setProperty("--mouse-x", `${e.clientX}px`);
      el.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [fine]);

  return (
    <>
      <div className="icon-layer icon-layer--base" style={{ backgroundImage: iconTile("#f4f1ea") }} />
      {fine === true && (
        <div ref={glowRef} className="icon-layer icon-layer--glow" style={{ backgroundImage: iconTile("#7a1f1f") }} />
      )}
      {fine === false && (
        <div className="icon-layer icon-layer--auto" style={{ backgroundImage: iconTile("#7a1f1f") }} />
      )}
    </>
  );
}
