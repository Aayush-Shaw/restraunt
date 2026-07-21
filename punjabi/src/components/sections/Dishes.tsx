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
        <div className="mt-18 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-10 gap-y-14 max-[640px]:grid-cols-2 max-[640px]:gap-x-4 max-[640px]:gap-y-9">
          {HOME_DISHES.map((dish) => (
            <DishCard key={dish.name} dish={dish} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
