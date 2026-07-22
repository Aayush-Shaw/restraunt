import Link from "next/link";
import type { ReactNode } from "react";

// Every CTA in the source is the red button. The hero's magnetic variant lives
// in MagneticCTAButton.tsx — deliberately separate, so it stays hero-only.
const cls =
  "inline-flex items-center justify-center rounded-full font-display font-medium whitespace-nowrap cursor-pointer bg-brand text-white hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[.98] px-8 py-[14px]";

export function Button({
  href,
  type = "button",
  className = "",
  children,
}: {
  href?: string;
  type?: "button" | "submit";
  className?: string;
  children: ReactNode;
}) {
  if (href) {
    return (
      <Link href={href} className={`${cls} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={`${cls} ${className}`}>
      {children}
    </button>
  );
}
