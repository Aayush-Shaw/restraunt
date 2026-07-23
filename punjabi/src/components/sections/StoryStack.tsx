"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const IMAGES = [
  { src: "/images/story-fire.jpg", alt: "Flames inside a clay tandoor oven" },
  { src: "/images/hero-curry.jpg", alt: "Butter chicken simmering in a dark bowl" },
  { src: "/images/dish-rara-gosht.jpg", alt: "Rara gosht mutton curry in a rustic bowl" },
];

// Rotating duotone image stack (CSS handles the fade/tilt via .story-stack).
// `eager` is set only where this stack is the page's first image (/story).
export function StoryStack({ eager = false }: { eager?: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % IMAGES.length),
      4500,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="story-stack" data-reveal="">
      {IMAGES.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          sizes="(max-width:900px) 100vw, 45vw"
          className={i === active ? "is-active" : ""}
          loading={eager && i === 0 ? "eager" : "lazy"}
        />
      ))}
    </div>
  );
}
