import type { Metadata } from "next";
import { Jost, Lora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { IconSpotlight } from "@/components/fx/IconSpotlight";
import { HeadingWeight } from "@/components/fx/HeadingWeight";
import { MotionProvider } from "@/components/fx/MotionProvider";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartIsland } from "@/components/cart/CartIsland";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { Foodie } from "@/components/foodie/Foodie";
import { CONTACT } from "@/data/site";

const jost = Jost({ subsets: ["latin"], variable: "--font-jost", display: "swap" });
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_URL = "https://indiangrill.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Indian Grill — Charcoal-Fired Punjabi Kitchen, Edmonton",
    template: "%s | Indian Grill",
  },
  description: CONTACT.blurb,
  keywords: [
    "Indian restaurant Edmonton",
    "Punjabi food Edmonton",
    "tandoori chicken Edmonton",
    "butter chicken Edmonton",
    "best Indian food Edmonton",
    "charcoal grill restaurant",
    "Indian Grill",
    "non-veg Punjabi kitchen",
  ],
  authors: [{ name: "Indian Grill" }],
  creator: "Indian Grill",
  publisher: "Indian Grill",
  formatDetection: { telephone: true, address: true },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔥</text></svg>",
  },
  openGraph: {
    type: "website",
    siteName: "Indian Grill",
    locale: "en_CA",
    title: "Indian Grill — Charcoal-Fired Punjabi Kitchen, Edmonton",
    description: CONTACT.blurb,
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/images/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "Indian Grill — Charcoal-Fired Punjabi Kitchen",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Indian Grill — Charcoal-Fired Punjabi Kitchen, Edmonton",
    description: CONTACT.blurb,
    images: [`${SITE_URL}/images/og-image.webp`],
  },
  other: {
    "theme-color": "#0a0a0a",
  },
};

// JSON-LD structured data for Google rich results / GEO local business SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: CONTACT.name,
  description: CONTACT.blurb,
  url: SITE_URL,
  telephone: CONTACT.phoneDisplay,
  image: `${SITE_URL}/images/og-image.webp`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "10132 104 St NW",
    addressLocality: "Edmonton",
    addressRegion: "AB",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 53.5441,
    longitude: -113.5065,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "11:00",
    closes: "23:00",
  },
  servesCuisine: ["Indian", "Punjabi"],
  priceRange: "$$",
  menu: `${SITE_URL}/menu`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${jost.variable} ${lora.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <CartProvider>
          <BookingProvider>
            <IconSpotlight />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <CartIsland />
            <Foodie />
          </BookingProvider>
        </CartProvider>
        <MotionProvider />
        <HeadingWeight />
      </body>
    </html>
  );
}
