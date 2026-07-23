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

const jost = Jost({ subsets: ["latin"], variable: "--font-jost", display: "swap" });
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  // TODO(deploy): point metadataBase at the production origin.
  metadataBase: new URL("https://aayush-shaw.github.io"),
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔥</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${jost.variable} ${lora.variable}`}>
      <body>
        <CartProvider>
          <IconSpotlight />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartIsland />
        </CartProvider>
        <MotionProvider />
        <HeadingWeight />
      </body>
    </html>
  );
}
