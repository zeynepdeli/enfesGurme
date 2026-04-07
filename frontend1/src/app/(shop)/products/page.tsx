"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Category } from "@/types";
import { CategorySidebar } from "@/components/products/category-sidebar";
import { ProductGrid } from "@/components/products/product-grid";
import { useProductFilters } from "@/hooks/use-product-filters";
// useSearchParams için Suspense boundary zorunlu (Next.js 13+)
export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ShopLayout />
    </Suspense>
  );
}

function ShopLayout() {
  const { filters } = useProductFilters();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get<Category[]>("/api/categories");
      return res.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const activeCategory = categories.find((c) => c.id === filters.categoryId);
  const title = activeCategory?.name ?? "Tüm Ürünler";
  const subtitle = activeCategory
    ? `Gaziantep'in en iyileri — ${activeCategory.name}`
    : "Gaziantep'in en seçkin lezzetleri";

  return (
    <div className="mt-8 h-screen">
      {/* Sayfa Başlığı */}
      <div className="px-8 pt-10   relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" />
        <h1
          className="text-4xl md:text-5xl font-bold text-[#f0ead8] mb-1 leading-tight transition-all duration-300"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {title}
        </h1>
        <p className="text-sm text-[#7da882] font-light">{subtitle}</p>
      </div>

      {/* Süsleme */}
      <div className="flex gap-3 px-8 my-5 opacity-30">
        <div className="flex-1 h-px bg-white/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#c8a44a]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#c8a44a]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#c8a44a]" />
        <div className="flex-1 h-px bg-white/20" />
      </div>

      {/*
        Grid: [Kategori Sidebar] [Ürün Filtresi] [Ürün Listesi]
        - 1024px altı: filtre sidebar gizlenir
        - 640px altı:  kategori sidebar gizlenir (mobil)
      */}
      <div className="px-8 grid grid-cols-[180px_1fr] gap-6 items-start max-[640px]:grid-cols-1">
        {/* Kategori Sidebar — masaüstü */}
        <div className="max-[640px]:hidden">
          <CategorySidebar />
        </div>

        {/* Ürün Grid */}
        <main className="mt-10">
          <ProductGrid />
        </main>
      </div>
    </div>
  );
}
