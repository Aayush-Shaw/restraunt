import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { Story } from "@/components/sections/Story";

export const metadata: Metadata = buildMetadata({
  title: "Our Story — Indian Grill, Edmonton",
  description:
    "Pind means village. Three generations of Punjabi recipes, a real clay tandoor, and live charcoal — now at Indian Grill in Edmonton, AB.",
  path: "story",
  ogImage: "/images/story-fire.jpg",
});

export default function StoryPage() {
  return <Story as="h1" pageFirst />;
}
