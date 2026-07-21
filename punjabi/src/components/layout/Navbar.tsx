"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS } from "@/data/site";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile box when clicking outside it. `open` is only ever true on mobile.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const glass = scrolled
    ? "bg-surface/55 backdrop-blur-[16px]"
    : "bg-transparent";
  const pillH = "h-12 max-[860px]:h-10"; // shared pill height, tablet + desktop

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-100 px-10 py-5 max-[860px]:px-5 max-[860px]:py-3.5"
    >
      {/* Container — morphs into a full-width box on mobile when the menu opens */}
      <div
        className={`mx-auto max-w-310 transition-all duration-500 max-[640px]:overflow-hidden max-[640px]:rounded-(--radius) max-[640px]:border max-[640px]:[corner-shape:squircle] ${
    open
      ? "max-[640px]:border-white/10 max-[640px]:bg-surface/92 max-[640px]:shadow-2xl max-[640px]:backdrop-blur-lg"
      : "max-[640px]:border-transparent"
  }`}
      >
        {/* Top row */}
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            open ? "max-[640px]:p-3" : ""
          }`}
        >
          <Logo
            className={`${pillH} flex items-center rounded-full px-5 text-[1.25rem] transition-[background] duration-300 max-[860px]:px-3.5 max-[860px]:text-[1.1rem] ${
              open ? "bg-transparent" : glass
            }`}
          />

          <nav
            className={`${pillH} flex items-center gap-1 rounded-full p-1.5 transition-[background] duration-300 ${glass} max-[640px]:hidden`}
          >
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full font-display px-5 py-2 text-[.9rem] transition-[color,background] hover:bg-white/[.07] hover:text-cream max-[860px]:px-3.25 max-[860px]:py-1.75 max-[860px]:text-[.82rem] ${
                    active ? "bg-white/9 text-cream" : "text-muted"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <Button
            href="/contact"
            pulse
            className={`${pillH} px-5! max-[860px]:px-3.5! max-[860px]:text-[.92rem] max-[640px]:hidden`}
          >
            Book a Table
          </Button>

          {/* Hamburger → X (mobile only) */}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`relative hidden h-10.5 w-10.5 items-center justify-center rounded-full transition-[background] duration-300 max-[640px]:inline-flex ${
              open ? "" : "bg-surface/55 backdrop-blur-lg"
            }`}
          >
            <span
              className={`absolute h-0.5 w-4.5 rounded-full bg-cream transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-1"
              }`}
            />
            <span
              className={`absolute h-0.5 w-4.5 rounded-full bg-cream transition-transform duration-300 ${
                open ? "-rotate-45" : "translate-y-1"
              }`}
            />
          </button>
        </div>

        {/* Mobile accordion — two columns, links only */}
        <div
          className={`hidden overflow-hidden px-3 transition-all duration-500 ease-in-out max-[640px]:block ${
            open ? "max-h-72 pb-4 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="grid grid-cols-2 gap-1 text-center">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2.5 font-display text-[.95rem] transition-colors hover:text-cream ${
                    active ? "text-cream" : "text-muted"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
