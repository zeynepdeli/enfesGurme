import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Enfes Gurme - Geleneksel Lezzetler",
  description: "Gaziantep’in geleneksel gurme lezzetleri",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body
        className={`
          ${inter.variable}
          ${playfair.variable}
          ${cormorant.variable}
          min-h-screen
          bg-[#f6efdd]
          text-[#2c1a0e]
          antialiased
        `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
