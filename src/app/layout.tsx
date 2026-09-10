import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import { site } from "@/content/site";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const sans = Inter({
  variable: "--font-sans-body",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lecce28.com"),
  title: {
    default: "Lecce28 — Elevate your beauty. Embrace your wellness.",
    template: "%s — Lecce28",
  },
  description:
    "Lecce 28 is a luxury beauty brand built on naturally derived formulas that drive ingredient education and awareness. Free shipping on purchases over 100 dollars.",
  openGraph: {
    title: "Lecce28",
    description: site.tagline,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-sand-50 text-ink">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
