import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import Image from "next/image";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Antep Peynirim - Geleneksel Lezzetler",
  description: "Antep peyniri ve geleneksel lezzetler",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body
        className={`${inter.variable} ${playfair.variable} bg-[#3F2008] min-h-screen`}
      >
        {/* Üst sol köşe fotoğrafı */}
        <div className="fixed top-0 left-[-25px] w-[320px] h-[170px] pointer-events-none z-0 overflow-hidden">
          <Image
            src="/zeugma.png"
            alt=""
            fill
            className="object-cover opacity-100 blur-[2px]"
            style={{
              maskImage:
                "radial-gradient(ellipse at top left, black 20%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at top left, black 20%, transparent 75%)",
            }}
          />
        </div>

        {/* z-20 — içerik */}
        <div className="relative z-20">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
