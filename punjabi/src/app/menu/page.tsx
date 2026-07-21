import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MenuFilters } from "@/components/sections/MenuFilters";

export const metadata: Metadata = buildMetadata({
  title: "Menu — Indian Grill, Edmonton",
  description:
    "The full Indian Grill menu — non-vegetarian Punjabi dishes: tandoori and grill, curries, biryani, breads, and more. Charcoal-fired in Edmonton, AB. Filter by course.",
  path: "menu",
});

export default function MenuPage() {
  return (
    <Section pageFirst>
      <Container>
        <SectionHeading as="h1" lead="Signature" accent="Fire" reveal />
        <p data-reveal="" className="my-5 max-w-[46ch] text-[1.05rem] text-muted">
          {"Off the charcoal, marinated overnight, cooked over live flame, finished with ghee. Filter by course to find your table's order."}
        </p>
        <MenuFilters />
      </Container>
    </Section>
  );
}
