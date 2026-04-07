// CategoriesSection.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Category } from "@/types";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ProductCard } from "@/components/products/product-card";
import Image from "next/image";

export function CategoriesSection() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<Category[]>("/api/categories");
      return response.data || [];
    },
  });

  return (
    <section className="py-12 px-4 relative overflow-hidden">
      {/* Eyebrow */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="w-8 h-px bg-white/30" />
        <span className="text-[10px] tracking-[0.22em] uppercase text-white/40 font-light">
          Curated Collections
        </span>
        <div className="w-8 h-px bg-white/30" />
      </div>

      {/* Title */}
      <h2
        className="text-center text-[32px] font-light tracking-wide text-white mb-10 leading-tight"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Our <em className="italic">Heritage</em> Collections
      </h2>

      <div className="flex flex-col md:flex-row gap-20 items-center justify-around">
        {/* Sol — hero fotoğraf */}
        <div className="relative flex-shrink-0 w-[280px]">
          <div className="relative w-[580px] h-[560px] rounded-sm overflow-hidden border border-white/10 bg-white/5">
            <Image
              src="/salcaKadınGörsel.png"
              alt="Heritage collection"
              fill
              className="object-cover"
              style={{
                maskImage:
                  "radial-gradient(circle at 60% 40%, black 55%, rgba(0,0,0,0.6) 70%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(circle at 60% 40%, black 55%, rgba(0,0,0,0.6) 70%, transparent 100%)",
              }}
            />
          </div>
        </div>

        {/* Sağ — kategori kartları */}
        {isLoading ? (
          <LoadingSpinner text="Kategoriler yükleniyor..." />
        ) : (
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-10">
            {categories?.map((category, i) => (
              <div
                key={category.id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${i * 0.07}s`,
                  animationFillMode: "both",
                }}
              >
                <ProductCard
                  layout="vertical"
                  imageStyle="circle"
                  href={`/categories/${category.id}`}
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
                  imageWidth={145}
                  card={{ w: 140, h: 175 }}
                  frame={{ w: 150, h: 185 }}
                  offset={{ top: 5, left: 5 }}
                  showPrice={false}
                  showDescription={false}
                  showStock={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
