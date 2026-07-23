"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { MagneticCTAButton } from "@/components/ui/MagneticCTAButton";
import { gsap, useGSAP } from "@/lib/gsap";

interface Plate {
  src: string;
  alt: string;
  label: string;
  depth: number;
  pos: string;
}

const PLATES: Plate[] = [
  { src: "/images/hero-tandoori.jpg", alt: "Charred tandoori chicken on a black plate", label: "Charcoal Tandoor", depth: 1, pos: "top-0 right-0" },
  { src: "/images/butter-naan.webp", alt: "Butter Naan in a dark bowl", label: "Butter NaaN", depth: 2, pos: "top-[20%] left-0" },
  { src: "/images/dish-butter-chicken.jpg", alt: "Butter chicken plate", label: "Butter Chicken", depth: 3, pos: "bottom-0 right-[8%]" },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const plateColRef = useRef<HTMLDivElement>(null);

  // Two-column layout only (>900px): pin the plate column's height to the text
  // column's height + 20px. Below 900px the layout stacks and CSS owns height.
  // CSS can't reference a sibling's height, so measure it. Not React state — a
  // direct style write, so no re-render and no lint friction.
  useEffect(() => {
    const left = leftRef.current;
    const right = plateColRef.current;
    if (!left || !right) return;
    const twoCol = window.matchMedia("(min-width: 901px)");
    const sync = (): void => {
      right.style.height = twoCol.matches ? `${left.offsetHeight + 20}px` : "";
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(left);
    twoCol.addEventListener("change", sync);
    return () => {
      ro.disconnect();
      twoCol.removeEventListener("change", sync);
    };
  }, []);

  useGSAP(
    () => {
      // ponytail: static reduced-motion guard; swap to gsap.matchMedia only if
      // live media toggling ever matters.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("h1 > span", { yPercent: 110, duration: 1, stagger: 0.12 })
        .from(".js-hero-fade", { y: 30, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.5")
        .from(".plate", { y: 80, opacity: 0, rotate: 8, duration: 1, stagger: 0.15 }, "-=0.6");

      // idle float
      gsap.utils.toArray<HTMLElement>(".plate").forEach((p, i) => {
        gsap.to(p, { y: "+=14", duration: 2.4 + i * 0.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
      });

      // depth-scaled parallax on scroll
      gsap.utils.toArray<HTMLElement>(".plate").forEach((p) => {
        gsap.to(p, {
          yPercent: -8 * (Number(p.dataset.depth) || 1),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="mx-auto grid max-w-310 grid-cols-[1.1fr_1fr] items-start gap-8 px-8 pt-30 pb-20 max-[900px]:pb-14 max-[860px]:px-4 max-[860px]:gap-0 max-[900px]:grid-cols-1 max-[900px]:gap-0 max-[900px]:px-6 max-[900px]:pt-20 [@media(min-width:901px)_and_(max-width:1024px)_and_(orientation:portrait)]:items-start [@media(min-width:901px)_and_(max-width:1024px)_and_(orientation:portrait)]:pt-20"
    >
      <div ref={leftRef}>
        <h1 className="overflow-hidden font-display text-[clamp(4.5rem,12vw,10rem)] font-medium uppercase leading-[.95] tracking-[-.01em]">
          <span className="block">INDIAN</span>
          <span className="block text-brand">GRILL</span>
        </h1>
        <p className="js-hero-fade mt-7 mb-9 max-w-[42ch] text-[1.1rem] text-muted">
          Charcoal-fired Punjabi kitchen. Overnight marinades, slow curries, meat
          off the open flame - village recipes, now in Canada.
        </p>
        <MagneticCTAButton href="/contact" className="js-hero-fade group gap-2">
          Book a Table
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[.9em] w-[.9em] transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          >
            <path d="M7 17 17 7M7 7h10v10" />
          </svg>
        </MagneticCTAButton>
      </div>

      <div
        ref={plateColRef}
        className="relative h-155 max-[900px]:static max-[900px]:h-auto max-[900px]:flex max-[900px]:flex-wrap max-[900px]:justify-center max-[900px]:gap-5"
      >
        {PLATES.map((plate) => (
          <figure
            key={plate.label}
            data-depth={plate.depth}
            className={`plate absolute w-[min(320px,58%)] ${plate.pos} max-[900px]:static max-[900px]:flex max-[900px]:w-[min(180px,30%)] max-[900px]:flex-col max-[900px]:items-center max-[640px]:w-[min(150px,44%)]`}
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-full shadow-[0_40px_80px_rgba(0,0,0,.65)]">
              {/* Any of the three can be the LCP depending on viewport, so eager
                  (no preload) per the Next 16 image docs — preloading all three
                  just makes them starve each other. */}
              <Image
                src={plate.src}
                alt={plate.alt}
                fill
                sizes="(max-width:640px) 150px, (max-width:900px) 180px, 320px"
                className="object-cover"
                loading="eager"
              />
            </div>
            <figcaption className="absolute -left-5 top-3.5 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[rgba(85,85,85,.185)] px-4.5 py-2 font-display text-[.85rem] backdrop-blur-md max-[900px]:static max-[900px]:mt-3.5 max-[900px]:px-3 max-[900px]:py-1.5 max-[900px]:text-[.75rem]">
              <i className="inline-block h-2 w-2 rounded-full bg-brand" />
              {plate.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
