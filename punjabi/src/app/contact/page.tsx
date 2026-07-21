import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { BookSection } from "@/components/sections/BookSection";
import { Faq } from "@/components/sections/Faq";

export const metadata: Metadata = buildMetadata({
  title: "Book a Table — Indian Grill, Edmonton",
  description:
    "Visit Indian Grill in Edmonton, AB — non-vegetarian Punjabi kitchen, open daily 11am–11pm. Call us to reserve a table; online booking coming soon.",
  path: "contact",
});

export default function ContactPage() {
  return (
    <>
      <BookSection as="h1" pageFirst />
      <Faq />
    </>
  );
}
