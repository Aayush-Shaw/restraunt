import type { ReactNode } from "react";

// section { padding: 120px 0 } with the 1024px step-down to 96px.
// page-first pages push the top padding to clear the fixed nav.
export function Section({
  children,
  pageFirst = false,
  noPadBottom = false,
  className = "",
  id,
  "aria-labelledby": ariaLabelledby,
}: {
  children: ReactNode;
  pageFirst?: boolean;
  noPadBottom?: boolean;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
}) {
  const top = pageFirst
    ? "pt-[180px] max-[1024px]:pt-[150px]"
    : "pt-[120px] max-[1024px]:pt-[96px]";
  const bottom = noPadBottom ? "" : "pb-[120px] max-[1024px]:pb-[96px]";
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={`${top} ${bottom} ${className}`}
    >
      {children}
    </section>
  );
}
