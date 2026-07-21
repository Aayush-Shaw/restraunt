import Link from "next/link";

export function Logo({
  href = "/",
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`font-display font-semibold tracking-wider ${className}`}
    >
      INDIAN<span className="text-brand">GRILL</span>
    </Link>
  );
}
