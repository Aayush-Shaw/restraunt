import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Container } from "@/components/ui/Container";
import { CONTACT, NAV_LINKS } from "@/data/site";

const colHead =
  "mb-1 font-display text-[.85rem] font-semibold uppercase tracking-[0.12em] text-cream";
const colLink = "mb-1 block text-[.95rem] text-muted transition-colors hover:text-cream";
const colText = "mb-1 block text-[.95rem] text-muted";

export function Footer() {
  return (
    <footer className="pt-8 pb-1">
      {/* Stays 2-up down to the smallest phone: Explore and Visit are short
          enough to sit side by side, and one centered column ran ~900px tall. */}
      <Container className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-start gap-8 max-[1024px]:grid-cols-2 max-[1024px]:gap-6 max-[640px]:grid-cols-[1fr_1.3fr] max-[640px]:gap-4">
        <div className="max-[640px]:col-span-2">
          <Logo />
          <p className="my-4 max-w-[30ch] text-[.95rem] text-muted">
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

        <div className="max-[640px]:col-span-2 text-center">
          <h4 className={colHead}>Book</h4>
          <p className={colText}>Friday and Saturday nights go fast.</p>
          <Button href="/contact" className="mt-1.5 px-20">
            Book a Table
          </Button>
        </div>
      </Container>
      <p className="mt-8 text-center text-[.8rem] text-muted opacity-60 max-[640px]:mt-4">
        © 2026 Indian Grill. All rights reserved.
      </p>
    </footer>
  );
}
