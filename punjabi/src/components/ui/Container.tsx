import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-310 px-8 gap-8 max-[900px]:gap-6 max-[900px]:px-6 max-[860px]:px-4 max-[860px]:gap-4 ${className}`}>
      {children}
    </div>
  );
}
