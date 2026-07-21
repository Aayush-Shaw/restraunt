"use client";

import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Global scroll reveals for every [data-reveal] element — the 1:1 equivalent of
// the original script.js block. Selector-based (not per-component refs) so it
// matches the source exactly; re-runs per route so client navigation re-binds.
// ponytail: selector sweep over ref-per-element — smaller and identical in effect.
export function MotionProvider() {
  const pathname = usePathname();

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      reveals.forEach((el) => {
        gsap.from(el, {
          y: 48,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
      ScrollTrigger.refresh();
    },
    { dependencies: [pathname] },
  );

  return null;
}
