"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { ProductCard } from "@/components/products/product-card";
import { ProductListSkeleton } from "@/components/products/product-list-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorMessage } from "@/components/shared/error-message";
import { useProductFilters } from "@/hooks/use-product-filters";

export function ProductGrid() {
  const { filters: urlFilters } = useProductFilters();
  const categoryId = urlFilters.categoryId;

  const [search, setSearch] = useState("");

  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", categoryId],
    queryFn: async () => {
      const url = categoryId
        ? `/api/products?categoryId=${categoryId}`
        : "/api/products";
      const response = await api.get<Product[]>(url);
      return response.data || [];
    },
  });

  const filtered = (products ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col  gap-6">
      {/* Arama */}
      <div className="relative mb-6 mt-[-48px]">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a6e50] pointer-events-none"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ürün ara…"
          className="w-full border border-white/10 bg-transparent rounded-lg pl-8 pr-3 py-2.5 text-sm text-[#dce8dd] placeholder:text-[#4a6e50] outline-none focus:border-[#3d7544] transition-colors"
        />
      </div>

      {isLoading && <ProductListSkeleton />}

      {error && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <ErrorMessage message={(error as Error).message} />
          <button
            onClick={() => refetch()}
            className="text-sm text-[#7da882] border border-white/10 rounded-lg px-4 py-2 hover:border-[#5fa866] hover:text-[#5fa866] transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <EmptyState
          title="Ürün bulunamadı"
          description="Arama veya filtreleri değiştirmeyi deneyin"
        />
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mt-12">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              imageStyle="circle"
              imageWidth={200}
              imageHeight={170}
              card={{ w: 190, h: 260 }}
              frame={{ w: 200, h: 270 }}
              offset={{ top: 5, left: 5 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
