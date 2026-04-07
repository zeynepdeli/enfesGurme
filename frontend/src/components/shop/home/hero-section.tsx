"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { Category } from "@/types";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function HeroSection() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<Category[]>("/api/categories");
      return response.data || [];
    },
  });

  return (
    <section className="relative flex items-center pt-16 px-2 sm:px-4">
      <div className="w-full max-w-[1600px] mx-auto">
        <div className="relative">
          {/* Fotoğraf */}
          <div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-0 hidden sm:block"
            style={{
              right: "-10px",
              width: "clamp(480px, 55vw, 840px)",
              height: "clamp(360px, 42vw, 660px)",
            }}
          >
            <Image
              src="/heroPlate.png"
              alt=""
              fill
              priority
              className="object-contain"
              style={{
                maskImage:
                  "radial-gradient(circle 72% 78% at 62% 20%, black 65%, rgba(0,0,0,0.6) 60%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(circle 72% 78% at 62% 50%, black 35%, rgba(0,0,0,0.6) 60%, transparent 100%)",
              }}
            />
          </div>

          {/* Glass container */}
          <div
            className="relative z-10 rounded-2xl sm:rounded-3xl shadow-[0_6px_30px_rgba(0,0,0,0.1)] min-h-[420px] sm:min-h-[460px] p-5 sm:p-8 md:p-10"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.04) 40%, transparent 75%)",
            }}
          >
            {/* Backdrop blur sol yarı */}
            <div
              className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none"
              style={{
                backdropFilter: "blur(0px)",
                WebkitBackdropFilter: "blur(10px)",
                maskImage:
                  "linear-gradient(to right, black 0%, black 55%, transparent 70%)",
                WebkitMaskImage:
                  "linear-gradient(to right, black 0%, black 45%, transparent 70%)",
              }}
            />

            {/* Hafif iç parlaklık */}
            <div
              className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, rgba(255,255,255,0.04) 0%, transparent 60%)",
              }}
            />

            <div className="relative z-10 grid md:grid-cols-2 py-2 sm:py-4 items-center">
              {/* SOL — metin */}
              <div>
                <div className="inline-flex items-center mt-8 sm:mt-12 gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 text-xs sm:text-sm text-white/90 rounded-full bg-white/10 border border-white/15">
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#c8a44a]" />
                  Gaziantep'in Lezzeti
                </div>

                <h1
                  className="text-4xl sm:text-5xl md:text-6xl mb-4 font-bold leading-tight text-white drop-shadow-lg"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Lezzetin En İyisini <br />
                  <span className="text-[#c8a44a]">Keşfet</span>
                </h1>

                <p className="mb-2 text-sm sm:text-base text-white/75 max-w-sm leading-relaxed">
                  Gaziantep'in köklü mutfağından gelen eşsiz tatları modern
                  sofralara taşıyoruz.
                </p>

                <p className="text-[#c8a44a] font-semibold mb-6 sm:mb-8 text-xs sm:text-sm">
                  15₺'den başlayan fiyatlarla
                </p>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Link href="/products">
                    <Button className="w-full sm:w-auto bg-white text-[#3F2008] hover:bg-white/90 font-semibold px-5 sm:px-6 rounded-full text-sm">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Sipariş Ver
                    </Button>
                  </Link>
                  <Link href="/categories">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 rounded-full text-sm"
                    >
                      Keşfet
                    </Button>
                  </Link>
                </div>
              </div>

              {/* SAĞ — boş */}
              <div />
            </div>

            {/* Ürün kartları */}
            <div className="relative z-30 grid grid-cols-2 md:grid-cols-4 gap-x-3 sm:gap-x-5 gap-y-3 sm:gap-y-4 mt-6 sm:mt-8">
              {categories?.slice(0, 4).map((category) => (
                <ProductCard
                  key={category.id}
                  layout="horizontal"
                  product={{
                    name: category.name,
                    price: 0,
                    slug: "",
                    description: "",
                    stock: 0,
                    images: category.image
                      ? [{ url: category.image, alt: category.name }]
                      : [],
                  }}
                  
                  imageOffset={{ left: 110, top: -40 }}
                  card={{ w: 225, h: 100 }}
                  frame={{ w: 240, h: 110 }}
                  offset={{ top: 5, left: 10 }}
                  showPrice={false}
                  showDescription={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
