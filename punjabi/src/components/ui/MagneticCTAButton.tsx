"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const PULL = 0.28; // fraction of the cursor offset the button follows
const REACH = 90; // px outside the button that still attracts

// Hero CTA only — deliberately not the shared Button, so the magnet can't leak
// onto the footer/booking CTAs. Pull is GSAP on `transform`; the gold sweep is
// CSS (`.btn-cta` in globals.css) driven by --sweep, so the idle loop and the
// hover state share one value instead of two animations fighting.
export function MagneticCTAButton({
  href,
  className = "",
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  // Idle attention cue. Toggling the attribute drives the same --sweep
  // transition :hover does, so a real hover just holds it instead of racing it.
  // Runs on touch too — the sweep is the point there, only the magnet isn't.
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let release: ReturnType<typeof setTimeout>;
    const tick = setInterval(() => {
      if (el.matches(":hover")) return; // hover owns it; don't fight
      el.dataset.sweep = "on";
      release = setTimeout(() => delete el.dataset.sweep, 900);
    }, 4000);

    return () => {
      clearInterval(tick);
      clearTimeout(release);
    };
  }, []);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    // No hover on touch — the pull would just read as drift.
    if (!matchMedia("(pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      // Pen/touch still tap fine — they just don't drag the button around.
      if (e.pointerType !== "mouse") {
        xTo(0);
        yTo(0);
        return;
      }
      const r = el.getBoundingClientRect();
      // The rect already includes the current pull — back it out, or the
      // button chases its own offset and never settles.
      const dx = e.clientX - (r.left + r.width / 2 - (gsap.getProperty(el, "x") as number));
      const dy = e.clientY - (r.top + r.height / 2 - (gsap.getProperty(el, "y") as number));
      const gap = Math.hypot(
        Math.max(0, Math.abs(dx) - r.width / 2),
        Math.max(0, Math.abs(dy) - r.height / 2),
      );
      const falloff = gap > REACH ? 0 : 1 - gap / REACH;
      xTo(dx * PULL * falloff);
      yTo(dy * PULL * falloff);
    };

    // Anchor the sweep circle wherever the cursor crossed the edge.
    const onEnter = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerenter", onEnter);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
    };
  });

  return (
    <Link
      ref={ref}
      href={href}
      className={`btn-cta inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-brand px-10 py-3.75 font-display text-[1.05rem] font-medium hover:-translate-y-0.5 active:translate-y-0 active:scale-[.98] ${className}`}
    >
      {children}
    </Link>
  );
}
