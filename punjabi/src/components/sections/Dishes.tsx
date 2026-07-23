import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DishCard } from "@/components/ui/DishCard";
import { HOME_DISHES } from "@/data/dishes";

// Home "Signature Fire" grid — the original six hardcoded cards.
export function Dishes() {
  return (
    <Section>
      <Container>
        <SectionHeading lead="Signature" accent="Fire" reveal />
        <p data-reveal="" className="my-5 max-w-[46ch] text-[1.05rem] text-muted">
          {"Six dishes off the charcoal we'd put against anyone's. Marinated overnight, cooked over live flame, finished with ghee."}
        </p>
        {/* Columns: 4 at ≥1440px, 3 up to 1439px, 2 on mobile. Below 1440px only
            the first 6 cards show (3×2); at ≥1440px all 8 show (4×2). */}
        <div className="mt-18 grid grid-cols-4 gap-8 max-[1439px]:grid-cols-3 max-[1439px]:[&>*:nth-child(n+7)]:hidden max-[900px]:gap-6 max-[900px]:grid-cols-2 max-[640px]:gap-4">
          {HOME_DISHES.map((dish) => (
            <DishCard key={dish.name} dish={dish} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
