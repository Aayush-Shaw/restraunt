"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Variable-weight cursor proximity on headings: each letter morphs its 'wght'
// axis from FROM (rest) toward TO (at cursor), smoothed per frame. Fine-pointer
// only. Ported from script.js; runs per route so new headings get split.
const FROM = 600;
const TO = 900;
const REACH = 200;
const TAU = 0.3;

export function HeadingWeight() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const splitText = (textNode: Text): void => {
      const frag = document.createDocumentFragment();
      for (const part of (textNode.textContent ?? "").split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          continue;
        }
        const word = document.createElement("span");
        word.style.display = "inline-block";
        word.style.whiteSpace = "nowrap";
        for (const ch of part) {
          const s = document.createElement("span");
          s.textContent = ch;
          s.style.display = "inline-block";
          s.style.fontVariationSettings = `'wght' ${FROM}`;
          s.dataset.hwLetter = "1";
          word.appendChild(s);
        }
        frag.appendChild(word);
      }
      textNode.parentNode?.replaceChild(frag, textNode);
    };

    document.querySelectorAll<HTMLElement>("h1, h2, h3, h4").forEach((h) => {
      if (h.dataset.hwDone) return;
      h.dataset.hwDone = "1";
      h.setAttribute("aria-label", (h.textContent ?? "").trim());
      const texts: Text[] = [];
      (function walk(node: Node): void {
        node.childNodes.forEach((c) => {
          if (c.nodeType === 3 && (c.textContent ?? "").trim()) texts.push(c as Text);
          else if (c.nodeType === 1) walk(c);
        });
      })(h);
      texts.forEach(splitText);
    });

    const letters = Array.from(
      document.querySelectorAll<HTMLElement>("[data-hw-letter]"),
    );
    if (letters.length === 0) return;

    // Letter centers in document coords, measured only on load/resize/font-ready
    // via the offset chain (immune to CSS transforms, so entrance tweens don't corrupt it).
    let centers: { x: number; y: number }[] = [];
    const measure = (): void => {
      centers = letters.map((el) => {
        let x = 0;
        let y = 0;
        for (
          let n: HTMLElement | null = el;
          n;
          n = n.offsetParent as HTMLElement | null
        ) {
          x += n.offsetLeft;
          y += n.offsetTop;
        }
        return { x: x + el.offsetWidth / 2, y: y + el.offsetHeight / 2 };
      });
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    if (document.fonts) document.fonts.ready.then(measure).catch(() => {});

    const factors = new Float32Array(letters.length);
    const lastW = new Int16Array(letters.length);
    let cx = -1e5;
    let cy = -1e5;
    let lastT = 0;
    const onMove = (e: MouseEvent): void => {
      cx = e.clientX;
      cy = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = window.requestAnimationFrame(function frame(now: number) {
      const dt = Math.min(0.1, (now - (lastT || now)) / 1000);
      lastT = now;
      const a = 1 - Math.exp(-dt / TAU);
      const mx = cx + window.scrollX;
      const my = cy + window.scrollY;
      for (let i = 0; i < letters.length; i++) {
        const c = centers[i];
        const el = letters[i];
        if (!c || !el) continue;
        const dx = mx - c.x;
        const dy = my - c.y;
        const target = Math.min(Math.max(1 - Math.hypot(dx, dy) / REACH, 0), 1);
        const prev = factors[i] ?? 0;
        const f = prev + (target - prev) * a;
        factors[i] = f;
        const w = Math.round(FROM + (TO - FROM) * f);
        if (w !== (lastW[i] ?? -1)) {
          el.style.fontVariationSettings = `'wght' ${w}`;
          lastW[i] = w;
        }
      }
      raf = window.requestAnimationFrame(frame);
    });

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("mousemove", onMove);
    };
  }, [pathname]);

  return null;
}
