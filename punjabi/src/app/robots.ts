import type { MetadataRoute } from "next";

// TODO(deploy): point host/sitemap at the production origin.
const SITE = "https://aayush-shaw.github.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
