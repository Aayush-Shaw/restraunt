import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Container } from "@/components/ui/Container";
import { CONTACT, NAV_LINKS } from "@/data/site";

const colHead =
  "mb-4 font-display text-[.85rem] font-semibold uppercase tracking-[0.12em] text-cream";
const colLink = "mb-2.5 block text-[.95rem] text-muted transition-colors hover:text-cream";
const colText = "mb-2.5 block text-[.95rem] text-muted";

export function Footer() {
  return (
    <footer className="border-t border-white/[.07] pt-[72px] pb-6">
      <Container className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-start gap-12 max-[1024px]:grid-cols-2 max-[1024px]:gap-x-8 max-[1024px]:gap-y-10 max-[640px]:grid-cols-1 max-[640px]:gap-10 max-[640px]:text-center">
        <div>
          <Logo />
          <p className="mt-4 mb-5 max-w-[30ch] text-[.95rem] text-muted max-[640px]:mx-auto">
            {CONTACT.blurb}
          </p>
          <SocialLinks />
        </div>

        <nav aria-label="Quick links">
          <h4 className={colHead}>Explore</h4>
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={colLink}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div>
          <h4 className={colHead}>Visit</h4>
          {/* TODO(launch): +1 (780) 555-0123 is a placeholder. Address & hours are real. */}
          <p className={colText}>{CONTACT.address}</p>
          <p className="mb-2.5 text-[.95rem]">
            <a href={CONTACT.phoneHref} className="text-muted transition-colors hover:text-cream">
              {CONTACT.phoneDisplay}
            </a>
          </p>
          <p className={colText}>{CONTACT.hours}</p>
        </div>

        <div>
          <h4 className={colHead}>Book</h4>
          <p className={colText}>Friday and Saturday nights go fast.</p>
          <Button href="/contact" className="mt-1.5">
            Book a Table
          </Button>
        </div>
      </Container>
      <p className="mt-14 text-center text-[.8rem] text-muted opacity-60">
        © 2026 Indian Grill. All rights reserved.
      </p>
    </footer>
  );
}
