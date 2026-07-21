"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { DISHES, MENU_FILTERS, type DishCategory } from "@/data/dishes";
import { DishCard } from "@/components/ui/DishCard";

const pillClass = (pressed: boolean): string =>
  [
    "cursor-pointer rounded-full border px-5 py-[9px] font-display text-[.9rem] transition-[color,background,border-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
    pressed
      ? "border-brand bg-brand text-white"
      : "border-white/[.12] bg-white/[.05] text-muted hover:bg-white/[.09] hover:text-cream",
  ].join(" ");

export function MenuFilters() {
  const [active, setActive] = useState<"all" | DishCategory>("all");
  const gridRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // Re-fade the shown set on filter change (skip the initial mount — the
  // scroll-reveal driver already handles first paint), then refresh triggers.
  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const shown = gridRef.current?.querySelectorAll<HTMLElement>(
        "[data-dish]:not([hidden])",
      );
      if (shown && shown.length > 0) {
        gsap.fromTo(
          shown,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "power2.out", overwrite: true },
        );
      }
      ScrollTrigger.refresh();
    },
    { dependencies: [active] },
  );

  return (
    <>
      <div
        className="mt-10 flex flex-wrap gap-2.5"
        role="group"
        aria-label="Filter menu by category"
        data-reveal=""
      >
        {MENU_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={active === f}
            onClick={() => setActive(f)}
            className={pillClass(active === f)}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      <div
        ref={gridRef}
        className="mt-9 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-10 gap-y-14 max-[640px]:grid-cols-2 max-[640px]:gap-x-4 max-[640px]:gap-y-9"
      >
        {DISHES.map((dish) => (
          <DishCard
            key={dish.name}
            dish={dish}
            hidden={active !== "all" && dish.category !== active}
          />
        ))}
      </div>
    </>
  );
}
