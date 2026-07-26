import type { Metadata } from "next";

// Per-page metadata builder — keeps title/description/OG/Twitter in sync
// without copy-pasting the block across every route.

const SITE = "https://indiangrill.vercel.app";

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
  ogImage = "/images/og-image.webp",
}: PageMetaInput): Metadata {
  const url = path ? `${SITE}/${path}` : `${SITE}/`;
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${SITE}${ogImage}`;
  const ogImageObj = {
    url: ogImageUrl,
    width: 1200,
    height: 630,
    alt: title,
    type: "image/webp" as const,
  };
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
      images: [ogImageObj],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageObj],
    },
  };
}
