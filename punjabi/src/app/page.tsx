import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { Hero } from "@/components/sections/Hero";
import { Dishes } from "@/components/sections/Dishes";
import { Story } from "@/components/sections/Story";
import { Reviews } from "@/components/sections/Reviews";
import { BookSection } from "@/components/sections/BookSection";

export const metadata: Metadata = buildMetadata({
  title: "Indian Grill — Charcoal-Fired Punjabi Kitchen, Edmonton",
  description:
    "Authentic non-veg Punjabi food in Canada. Tandoori chicken, butter chicken, kebabs — straight off the charcoal. Book a table at Indian Grill, Edmonton.",
  path: "",
});

export default function Home() {
  return (
    <>
      <Hero />
      <Dishes />
      <Story />
      <Reviews />
      <BookSection />
    </>
  );
}
