import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { CONTACT } from "@/data/site";

function AddressCard() {
  return (
    <div
      data-reveal=""
      className="mt-auto flex flex-col gap-1 rounded-(--radius) border border-white/8 bg-surface/30 px-7 py-6 [corner-shape:squircle]"
    >
      <strong className="text-[1.1rem] font-semibold">{CONTACT.name}</strong>
      {/* TODO(launch): +1 (780) 555-0123 is a placeholder. Address & hours are real. */}
      <p className="text-[.95rem] text-muted">{CONTACT.address}</p>
      <p className="text-[.95rem] text-muted">{CONTACT.hours}</p>
      <p className="text-[.95rem]">
        <a href={CONTACT.phoneHref} className="text-muted transition-colors hover:text-cream">
          {CONTACT.phoneDisplay}
        </a>
      </p>
    </div>
  );
}

function MapEmbed() {
  return (
    <div data-reveal="" className="mt-24 h-120 max-[900px]:mt-16 max-[900px]:h-80">
      {/* Map pin only — points at Empire Banquet Hall, Calgary (from the shared
          Google Maps link). The address text elsewhere is left as-is. */}
      <iframe
        src="https://www.google.com/maps?q=EMPIRE+BANQUET+HALL,+4826+11+St+NE,+Calgary,+AB+T2E+2W7&ftid=0x537165a9fa68dff3:0xf208dd17989f34cf&output=embed"
        loading="lazy"
        title="Indian Grill location on Google Maps"
        className="h-full w-full border-0 filter-[grayscale(1)_invert(.92)_contrast(.85)]"
      />
    </div>
  );
}

export function BookSection({
  as = "h2",
  pageFirst = false,
}: {
  as?: "h1" | "h2";
  pageFirst?: boolean;
}) {
  return (
    <Section pageFirst={pageFirst} noPadBottom>
      <Container className="grid grid-cols-[1.1fr_1fr] items-stretch gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-10">
        <div className="flex min-w-0 flex-col">
          <SectionHeading as={as} lead="Book a" accent="Table" reveal />
          <p data-reveal="" className="my-5 max-w-[46ch] text-[1.05rem] text-muted">
            Friday and Saturday nights go fast. Call us to reserve — online booking is coming soon.
          </p>
          <AddressCard />
        </div>
        <BookingWizard />
      </Container>
      <MapEmbed />
    </Section>
  );
}
