"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
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
  { src: "/images/butter-naan.webp", alt: "Butter Naan in a dark bowl", label: "Butter NaaN", depth: 2, pos: "top-[34%] left-0" },
  { src: "/images/dish-butter-chicken.jpg", alt: "Butter chicken plate", label: "Butter Chicken", depth: 3, pos: "bottom-0 right-[8%]" },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);

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
      className="mx-auto grid max-w-310 grid-cols-[1.1fr_1fr] items-start gap-10 px-10 pt-37.5 pb-20 min-h-dvh max-[900px]:min-h-0 max-[900px]:grid-cols-1 max-[900px]:gap-12 max-[900px]:px-6 max-[900px]:pt-30 max-[900px]:pb-16 [@media(min-width:901px)_and_(max-width:1024px)_and_(orientation:portrait)]:min-h-0 [@media(min-width:901px)_and_(max-width:1024px)_and_(orientation:portrait)]:items-start [@media(min-width:901px)_and_(max-width:1024px)_and_(orientation:portrait)]:pt-35 [@media(min-width:901px)_and_(max-width:1024px)_and_(orientation:portrait)]:pb-22.5"
    >
      <div>
        <h1 className="overflow-hidden font-display text-[clamp(4.5rem,12vw,10rem)] font-medium uppercase leading-[.95] tracking-[-.01em]">
          <span className="block">INDIAN</span>
          <span className="block text-brand">GRILL</span>
        </h1>
        <p className="js-hero-fade mt-7 mb-9 max-w-[42ch] text-[1.1rem] text-muted">
          Charcoal-fired Punjabi kitchen. Overnight marinades, slow curries, meat
          off the open flame — village recipes, now in Canada.
        </p>
        <Button href="/contact" lg pulse className="js-hero-fade">
          Book a Table
        </Button>
      </div>

      <div className="relative h-155 max-[900px]:static max-[900px]:h-auto max-[900px]:flex max-[900px]:flex-wrap max-[900px]:justify-center max-[900px]:gap-5">
        {PLATES.map((plate) => (
          <figure
            key={plate.label}
            data-depth={plate.depth}
            className={`plate absolute w-[min(320px,58%)] ${plate.pos} max-[900px]:static max-[900px]:flex max-[900px]:w-[min(180px,30%)] max-[900px]:flex-col max-[900px]:items-center max-[640px]:w-[min(150px,44%)]`}
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-full shadow-[0_40px_80px_rgba(0,0,0,.65)]">
              <Image src={plate.src} alt={plate.alt} fill sizes="320px" className="object-cover" priority />
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
