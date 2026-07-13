import type { Metadata } from "next";
import {
  Inter,
  Playfair_Display,
  Cormorant_Garamond,
  Merienda,
  Caveat_Brush,
} from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Montserrat } from "next/font/google";
import { AppBackground } from "@/components/shop/layout/app-background";

const caveatBrush = Caveat_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-caveat-brush",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-montserrat",
});

const merienda = Merienda({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merienda",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const res = await fetch(`${apiUrl}/api/site-seo`, {
      cache: "no-store",
    });

    const json = await res.json();
    const seo = json.data;

    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords
        ? seo.keywords.split(",").map((item: string) => item.trim())
        : [],
      openGraph: {
        title: seo.ogTitle || seo.title,
        description: seo.ogDescription || seo.description,
        siteName: seo.siteName,
        images: seo.ogImage ? [seo.ogImage] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: seo.twitterTitle || seo.title,
        description: seo.twitterDesc || seo.description,
        images: seo.twitterImage ? [seo.twitterImage] : [],
      },
      robots: {
        index: seo.robotsIndex,
        follow: seo.robotsFollow,
      },
    };
  } catch {
    return {
      title: "Enfes Gurme - Geleneksel Lezzetler",
      description: "Gaziantep'in geleneksel gurme lezzetleri",
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable} ${merienda.variable} ${montserrat.variable} ${caveatBrush.variable}`}
    >
      <body
        className={`
          ${inter.variable}
          ${playfair.variable}
          ${cormorant.variable}
          ${merienda.variable}
          min-h-screen
          bg-[#f6efdd]
          text-[#2c1a0e]
          antialiased
        `}
      >
        <AppBackground />

        <div className="relative z-10">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
