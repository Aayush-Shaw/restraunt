import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { REVIEWS } from "@/data/site";

export function Reviews({
  as = "h2",
  pageFirst = false,
}: {
  as?: "h1" | "h2";
  pageFirst?: boolean;
}) {
  return (
    <Section pageFirst={pageFirst}>
      <Container>
        <SectionHeading as={as} lead="Guests" accent="Say" reveal />
        <div className="mt-4 md:mt-6 lg:mt-8 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 md:gap-6 lg:gap-8">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.cite} review={review} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
