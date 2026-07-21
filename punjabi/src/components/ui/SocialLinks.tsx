import { SOCIALS } from "@/data/site";

export function SocialLinks() {
  return (
    <div className="flex gap-3.5 max-[640px]:justify-center">
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          aria-label={s.label}
          className="grid h-9.5 w-9.5 place-items-center rounded-full border border-white/15 text-muted transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-cream hover:text-cream"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4.25 w-4.25 fill-current">
            <path d={s.path} />
          </svg>
        </a>
      ))}
    </div>
  );
}
