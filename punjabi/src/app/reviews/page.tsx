import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { Reviews } from "@/components/sections/Reviews";

export const metadata: Metadata = buildMetadata({
  title: "Reviews — Indian Grill, Edmonton",
  description:
    "What guests say about Indian Grill in Edmonton, AB — butter chicken, seekh kebabs, and mutton curry worth crossing a border for.",
  path: "reviews",
});

export default function ReviewsPage() {
  return <Reviews as="h1" pageFirst />;
}
