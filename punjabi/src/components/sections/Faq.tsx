import type { ReactNode } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CONTACT } from "@/data/site";

const menuLink = (
  <Link href="/menu" className="text-gold">
    menu
  </Link>
);

const phoneLink = (
  <a href={CONTACT.phoneHref} className="text-gold">
    {CONTACT.phoneDisplay}
  </a>
);

function FaqItem({ q, children }: { q: string; children: ReactNode }) {
  return (
    <details className="group rounded-2xl border border-white/10 bg-white/[.03] px-6 [corner-shape:squircle]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-[18px] font-display text-[1.1rem] font-medium focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold [&::-webkit-details-marker]:hidden">
        {q}
        <span
          aria-hidden="true"
          className="text-[1.6rem] leading-none text-brand transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <p className="mb-0 max-w-[62ch] pb-5 text-muted">{children}</p>
    </details>
  );
}

// Native details/summary — accessible and keyboard-operable, no JS.
export function Faq() {
  return (
    <Section aria-labelledby="faq-head">
      <Container>
        <SectionHeading id="faq-head" lead="Good to" accent="Know" reveal />
        <div data-reveal="" className="mt-12 flex max-w-[760px] flex-col gap-3">
          <FaqItem q="How do I make a reservation?">
            {"Our online booking form is coming soon. For now, call us directly at "}
            {phoneLink}
            {" to reserve a table. We're open daily, 11:00 AM to 11:00 PM."}
          </FaqItem>
          <FaqItem q="What kind of food does Indian Grill serve?">
            {"We're a non-vegetarian Punjabi (North Indian) restaurant in Edmonton, AB. Everything is charcoal-fired or tandoor-cooked — signature dishes include butter chicken, tandoori chicken, seekh kebab, rara gosht, and biryani."}
          </FaqItem>
          <FaqItem q="Can I choose how spicy my dish is?">
            {"Every dish on our "}
            {menuLink}
            {" is marked with a spice level, from mild to extra hot. Prefer it milder or hotter? Let us know when you order and the kitchen will adjust where it can."}
          </FaqItem>
          <FaqItem q="Do you have allergen information?">
            {"Yes. Each dish on the "}
            {menuLink}
            {" is labelled with common allergens — dairy, gluten, nuts, fish, and shellfish. Ask our staff about any specific dietary needs before you order."}
          </FaqItem>
          <FaqItem q="What's the price range?">
            {"Most mains run about $13 to $23. Starters, breads, rice, and drinks are less. See the full "}
            {menuLink}
            {" for prices."}
          </FaqItem>
          <FaqItem q="Where are you located and when are you open?">
            {"10132 104 St NW, Edmonton, AB. Open daily, 11:00 AM to 11:00 PM."}
          </FaqItem>
        </div>
      </Container>
    </Section>
  );
}
