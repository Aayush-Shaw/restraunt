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
        <div className="mt-[72px] grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.cite} review={review} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
