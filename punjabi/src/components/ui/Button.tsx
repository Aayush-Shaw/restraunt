import Link from "next/link";
import type { ReactNode } from "react";

const base =
  "inline-flex items-center justify-center rounded-full font-display font-medium whitespace-nowrap cursor-pointer bg-brand text-white transition-[transform,filter] duration-200 ease-out hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[.98]";

// Every CTA in the source is the red button; size + pulse are the only variants.
export function Button({
  href,
  type = "button",
  lg = false,
  pulse = false,
  className = "",
  children,
}: {
  href?: string;
  type?: "button" | "submit";
  lg?: boolean;
  pulse?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const size = lg ? "px-[44px] py-[18px] text-[1.05rem]" : "px-8 py-[14px]";
  const cls = [base, size, pulse ? "btn-pulse" : "", className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls}>
      {children}
    </button>
  );
}
