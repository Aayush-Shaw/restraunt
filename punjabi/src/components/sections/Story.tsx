import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StoryStack } from "@/components/sections/StoryStack";

const STORY_TEXT =
  '"Pind" means village. Our recipes come from one — handed down through three generations of cooks who never wrote anything down. We brought the marinades, the patience, and the fire to Canada. The tandoor is clay, the charcoal is real, and nothing leaves the kitchen until it would pass at a Punjabi wedding.';

export function Story({
  as = "h2",
  pageFirst = false,
}: {
  as?: "h1" | "h2";
  pageFirst?: boolean;
}) {
  return (
    <Section pageFirst={pageFirst}>
      <Container className="grid grid-cols-[1.1fr_1fr] items-center gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-10">
        <div data-reveal="">
          <SectionHeading as={as} lead="From the" accent="Pind" />
          <p className="my-5 max-w-[46ch] text-[1.05rem] text-muted">{STORY_TEXT}</p>
        </div>
        <StoryStack />
      </Container>
    </Section>
  );
}
