"use client";

import { Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import { Category } from "@/types";
import {
  CategoryMobileTabs,
  CategorySidebar,
} from "@/components/products/category-sidebar";
import { ProductGrid } from "@/components/products/product-grid";
import { useProductFilters } from "@/hooks/use-product-filters";

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ShopLayout />
    </Suspense>
  );
}

function ShopLayout() {
  const { filters } = useProductFilters();
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6efdd]">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-30 mix-blend-multiply">
        <img
          src="/heroB.png"
          alt=""
          className="fixed h-full w-full object-cover"
        />
      </div>

      <div className="relative z-10 pt-32 sm:pt-36 md:pt-40 lg:pt-36 xl:pt-40">
        <div className="mx-auto w-full max-w-[1900px] px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 2xl:px-10">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[260px_1fr] xl:grid-cols-[300px_1fr] 2xl:grid-cols-[340px_1fr]">
            <aside className="hidden lg:sticky lg:top-32 lg:block">
              <div className="relative mb-5 h-32 w-full overflow-hidden rounded-[18px]">
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#eee1c9_5%,#c4be98_36%,#b3ad84_52%,#c9c39f_80%,#e8dcc5_98%,#f0e4cd_100%)]" />

                <img
                  src="/fıstıkYapragı.png"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-[0.16] mix-blend-multiply"
                />
              </div>

              <h2 className="mb-4 border-b border-[#a67c3d]/20 pb-2 font-serif text-[15px] font-bold uppercase tracking-widest text-[#a67c3d]">
                Kategoriler
              </h2>

              <div className="text-[14px]">
                <CategorySidebar />
              </div>
            </aside>

            <div className="flex min-w-0 flex-col gap-5">
              <div className="flex flex-col gap-4 border-b border-[#3d3020]/10 pb-5 md:flex-row md:items-end md:justify-between md:pb-6">
                <h2 className="font-serif text-[26px] font-bold tracking-wide text-[#460d07] sm:text-[30px] md:text-[36px] xl:text-[42px]">
                  {title.toUpperCase()}
                </h2>

                <div className="relative w-full md:w-[320px] xl:w-[380px]">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3d3020]/40" />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ürünlerde ara..."
                    className="
                      w-full rounded-full border border-[#3d3020]/15
                      bg-[#efe6d6] py-2.5 pl-11 pr-4
                      text-sm shadow-sm transition-all
                      placeholder:text-[#3d3020]/40
                      focus:outline-none focus:ring-2 focus:ring-[#a67c3d]/20
                    "
                  />
                </div>
              </div>

              <CategoryMobileTabs />

              <main className="overflow-visible">
                <ProductGrid externalSearch={searchTerm} />
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
