// h2 / page-head: clamp display type, uppercase, with the red accent word on its own line.
export function SectionHeading({
  as = "h2",
  lead,
  accent,
  id,
  reveal = false,
}: {
  as?: "h1" | "h2";
  lead: string;
  accent: string;
  id?: string;
  reveal?: boolean;
}) {
  const Tag = as;
  return (
    <Tag
      id={id}
      data-reveal={reveal ? "" : undefined}
      className="font-display text-[clamp(4rem,9vw,8rem)] leading-[1.02] font-medium uppercase text-balance"
    >
      {lead} <span className="block text-brand">{accent}</span>
    </Tag>
  );
}
