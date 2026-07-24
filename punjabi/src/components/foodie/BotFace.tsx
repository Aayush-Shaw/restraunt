"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Foodie launcher: the user's hand-built chef-robot SVG, with the animated parts
// grouped so GSAP can drive them independently — an idle eye-blink, a gentle
// antenna sway, and a hover zoom + hat-tilt. Reds map to the brand token so the
// launcher matches the rest of the UI (imperceptibly different from the source
// #E53935). Decorative — the wrapping <button> owns the accessible name.
//
// Visibility (Rule 5): the launcher unmounts while the chat panel is open, so
// useGSAP's cleanup kills the loops — nothing animates off-screen.

export function BotFace({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hover = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      // prefers-reduced-motion: leave it in its resting state (eyes open, already
      // smiling, antennas still). No loops, no hover motion.
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Blink — both eyes squish to a line and back (~0.2s) on a ~3s cycle.
      gsap.set(".bot-eyes", { transformOrigin: "50% 50%" });
      gsap
        .timeline({ repeat: -1, repeatDelay: 2.7 })
        .to(".bot-eyes", { scaleY: 0.1, duration: 0.08, ease: "power2.in" })
        .to(".bot-eyes", { scaleY: 1, duration: 0.12, ease: "power2.out" });

      // Antennas — a slow symmetric sway, forever.
      gsap.fromTo(
        ".bot-antennas",
        { rotation: -4 },
        {
          rotation: 4,
          duration: 1.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          transformOrigin: "50% 100%",
        },
      );

      // Hover — springy zoom + hat tilt; built paused, played/reversed on pointer.
      hover.current = gsap
        .timeline({ paused: true, defaults: { duration: 0.3, ease: "back.out(2)" } })
        .to(".bot-zoom", { scale: 1.06, transformOrigin: "50% 50%" }, 0)
        .to(".bot-hat", { rotation: -7, transformOrigin: "50% 100%" }, 0);
    },
    { scope: svgRef },
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 512 512"
      className={className}
      aria-hidden="true"
      onMouseEnter={() => hover.current?.play()}
      onMouseLeave={() => hover.current?.reverse()}
    >
      <g className="bot-zoom">
        {/* Background */}
        <circle cx="256" cy="256" r="240" fill="var(--color-brand)" />

        {/* Chef hat */}
        <g className="bot-hat" fill="var(--color-cream)">
          <circle cx="256" cy="100" r="40" />
          <circle cx="214" cy="118" r="42" />
          <circle cx="298" cy="118" r="42" />
          <rect x="140" y="116" width="190" height="76" rx="38" />
          <rect x="253" y="116" width="116" height="76" rx="38" />
          {/* Hat base */}
          <rect x="170" y="196" width="172" height="20" rx="10" />
          {/* Hat folds */}
          <g stroke="var(--color-brand)" strokeWidth="5" strokeLinecap="round">
            <line x1="210" y1="140" x2="214" y2="191" />
            <line x1="256" y1="110" x2="256" y2="191" />
            <line x1="302" y1="140" x2="298" y2="191" />
          </g>
        </g>

        {/* Head */}
        <rect x="130" y="220" width="252" height="180" rx="64" fill="var(--color-cream)" />

        {/* Antennas (bases sit inside the head so they emerge from the body) */}
        <g className="bot-antennas">
          <g stroke="var(--color-cream)" strokeWidth="5" strokeLinecap="round">
            <line x1="168" y1="248" x2="135.24" y2="199.175" />
            <line x1="344" y1="248" x2="376.76" y2="199.175" />
          </g>
          <circle cx="135.24" cy="199.175" r="8" fill="var(--color-cream)" />
          <circle cx="376.76" cy="199.175" r="8" fill="var(--color-cream)" />
        </g>

        {/* Side ears */}
        <rect x="99" y="286" width="28" height="50" rx="14" fill="var(--color-cream)" />
        <rect x="385" y="286" width="28" height="50" rx="14" fill="var(--color-cream)" />

        {/* Face screen */}
        <rect x="160" y="250" width="190" height="120" rx="60" fill="var(--color-brand)" />

        {/* Eyes */}
        <g className="bot-eyes" fill="var(--color-cream)">
          <circle cx="214" cy="290" r="12" />
          <circle cx="298" cy="290" r="12" />
        </g>

        {/* Smile */}
        <path
          d="M220 325 Q256 360 292 325"
          fill="none"
          stroke="var(--color-cream)"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
