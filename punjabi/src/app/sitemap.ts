import type { MetadataRoute } from "next";

// const SITE = "https://punjabi-restraunt-canada-by-aayushshaw.vercel.app";
const SITE = "https://indiangrill.vercel.app";
const lastModified = new Date("2026-07-18");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, lastModified, priority: 1.0 },
    { url: `${SITE}/menu`, lastModified, priority: 0.9 },
    { url: `${SITE}/contact`, lastModified, priority: 0.8 },
    { url: `${SITE}/story`, lastModified, priority: 0.7 },
    { url: `${SITE}/reviews`, lastModified, priority: 0.6 },
    { url: `${SITE}/login`, lastModified, priority: 0.3 },
  ];
}
