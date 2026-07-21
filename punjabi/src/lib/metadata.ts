import type { Metadata } from "next";

// Per-page metadata builder — keeps title/description/OG/Twitter in sync
// without copy-pasting the block across every route.
interface PageMetaInput {
  title: string;
  description: string;
  path?: string; // "" = home, otherwise the route segment ("menu", "story", ...)
  ogImage?: string;
}

export function buildMetadata({
  title,
  description,
  path = "",
  ogImage = "/images/hero-tandoori.jpg",
}: PageMetaInput): Metadata {
  const url = path ? `/${path}` : "/";
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: "Indian Grill",
      locale: "en_CA",
      title,
      description,
      url,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
