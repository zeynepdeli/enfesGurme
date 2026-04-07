"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Category } from "@/types";
import { useProductFilters } from "@/hooks/use-product-filters";
import { Layers, ChevronRight } from "lucide-react";

export function CategorySidebar() {
  const { filters, setCategory } = useProductFilters();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get<Category[]>("/api/categories");
      return res.data || [];
    },
  });

  const totalCount = categories.reduce(
    (acc, c) => acc + (c._count?.products ?? 0),
    0,
  );

  return (
    <aside>
      {/* Title */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <Layers size={13} className="text-[#c8a44a]" />
        <span className="text-xs uppercase tracking-[0.2em] text-[#c8a44a] font-semibold">
          Kategoriler
        </span>
      </div>

      {/* All */}
      <CategoryItem
        label="Tüm Ürünler"
        count={totalCount}
        isActive={!filters.categoryId}
        onClick={() => setCategory(null)}
      />

      {/* Divider */}
      <div className="my-3 h-px bg-white/10" />

      {/* Categories */}
      {isLoading ? (
        <CategorySkeleton />
      ) : (
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat.id}>
              <CategoryItem
                label={cat.name}
                count={cat._count?.products}
                isActive={filters.categoryId === cat.id}
                onClick={() => setCategory(cat.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function CategoryItem({ label, count, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        group w-full flex items-center justify-between
        px-3 py-2.5 rounded-lg text-sm transition-all
        ${
          isActive
            ? "bg-[#1a3a1d] border border-[#c8a44a]/40 text-[#f0ead8]"
            : "text-[#7da882] hover:text-[#f0ead8] hover:bg-white/5"
        }
      `}
    >
      <div className="flex items-center gap-2">
        <span
          className={`
            w-1.5 h-1.5 rounded-full transition
            ${
              isActive
                ? "bg-[#c8a44a] scale-125"
                : "bg-white/20 group-hover:bg-white/50"
            }
          `}
        />
        {label}
      </div>

      <div className="flex items-center gap-2">
        {count !== undefined && (
          <span
            className={`
              text-[10px] px-2 py-0.5 rounded-full
              ${isActive ? "bg-[#c8a44a]/20 text-[#c8a44a]" : "text-[#4a6e50]"}
            `}
          >
            {count}
          </span>
        )}

        <ChevronRight
          size={12}
          className={`
            transition
            ${
              isActive
                ? "opacity-100 text-[#c8a44a]"
                : "opacity-0 group-hover:opacity-50"
            }
          `}
        />
      </div>
    </button>
  );
}

function CategorySkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-9 rounded-lg bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}
