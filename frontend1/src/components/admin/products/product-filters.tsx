"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, X, PackageSearch, Filter } from "lucide-react";

import { Category } from "@/types";

interface ProductFiltersProps {
  categories: Category[];
  onFilterChange: (filters: ProductFilterValues) => void;
}

export interface ProductFilterValues {
  search: string;
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean | null;
}

export function ProductFilters({
  categories,
  onFilterChange,
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<ProductFilterValues>({
    search: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    inStock: null,
  });

  const handleFilterChange = (key: keyof ProductFilterValues, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: ProductFilterValues = {
      search: "",
      categoryId: "",
      minPrice: "",
      maxPrice: "",
      inStock: null,
    };

    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.categoryId ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.inStock !== null;

  const labelClassName =
    "text-[11px] font-bold uppercase tracking-[0.18em] text-[#7a3b1e]";

  const inputClassName = `
    border-[#d0bc90]
    bg-[#fff5ea]/70
    text-[#2c1a0e]
    placeholder:text-[#5e4734]/45
    focus-visible:border-[#bc7b56]
    focus-visible:ring-[#bc7b56]/25
  `;

  return (
    <div
      className="
        relative mb-6 overflow-hidden rounded-[22px]
        border border-[#d0bc90]
        bg-[#efe6cf]
        p-5
        shadow-[0_10px_22px_rgba(120,92,58,0.12),inset_0_1px_2px_rgba(255,255,255,0.55)]
      "
    >
      {/* BG */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]" />

      {/* INNER BORDER */}
      <div className="pointer-events-none absolute inset-[6px] z-[2] rounded-[16px] border border-[#d6c49a]/70" />

      <div className="relative z-10">
        {/* HEADER */}
        <div className="mb-5 flex items-center gap-3">
          <div
            className="
              flex h-11 w-11 items-center justify-center
              overflow-hidden rounded-full
              border border-[#d8bf8a]
              bg-cover bg-center
              text-[#2c1a0e]
              shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.28)]
            "
            style={{
              backgroundImage: "url('/bkrr.png')",
            }}
          >
            <PackageSearch size={18} />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a67c3d]">
              Ürün Yönetimi
            </span>

            <h3 className="font-serif text-xl font-black italic text-[#2c1a0e]">
              Filtreler
            </h3>
          </div>
        </div>

        {/* FILTER GRID */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* SEARCH */}
          <div className="space-y-2">
            <Label htmlFor="search" className={labelClassName}>
              Ürün Ara
            </Label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a3b1e]/55" />

              <Input
                id="search"
                placeholder="Ürün adı..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className={`pl-10 ${inputClassName}`}
              />
            </div>
          </div>

          {/* CATEGORY */}
          <div className="space-y-2">
            <Label htmlFor="category" className={labelClassName}>
              Kategori
            </Label>

            <Select
              value={filters.categoryId || "all"}
              onValueChange={(value) =>
                handleFilterChange("categoryId", value === "all" ? "" : value)
              }
            >
              <SelectTrigger id="category" className={inputClassName}>
                <SelectValue placeholder="Tüm kategoriler" />
              </SelectTrigger>

              <SelectContent className="border-[#d0bc90] bg-[#efe6cf] text-[#2c1a0e]">
                <SelectItem value="all">Tüm kategoriler</SelectItem>

                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* MIN PRICE */}
          <div className="space-y-2">
            <Label htmlFor="minPrice" className={labelClassName}>
              Minimum Fiyat
            </Label>

            <Input
              id="minPrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="0 TL"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              className={inputClassName}
            />
          </div>

          {/* MAX PRICE */}
          <div className="space-y-2">
            <Label htmlFor="maxPrice" className={labelClassName}>
              Maksimum Fiyat
            </Label>

            <Input
              id="maxPrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="1000 TL"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-5 flex flex-col gap-4 border-t border-[#3d3020]/10 pt-5 sm:flex-row sm:items-end sm:justify-between">
          {/* STOCK */}
          <div className="space-y-2">
            <Label htmlFor="inStock" className={labelClassName}>
              Stok Durumu
            </Label>

            <Select
              value={
                filters.inStock === null ? "all" : filters.inStock.toString()
              }
              onValueChange={(value) =>
                handleFilterChange(
                  "inStock",
                  value === "all" ? null : value === "true",
                )
              }
            >
              <SelectTrigger
                id="inStock"
                className={`w-full sm:w-[220px] ${inputClassName}`}
              >
                <SelectValue placeholder="Tümü" />
              </SelectTrigger>

              <SelectContent className="border-[#d0bc90] bg-[#efe6cf] text-[#2c1a0e]">
                <SelectItem value="all">Tümü</SelectItem>

                <SelectItem value="true">Stokta Var</SelectItem>

                <SelectItem value="false">Stokta Yok</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="
                  rounded-full
                  border-[#bc7b56]
                  bg-[#fff5ea]/60
                  text-xs font-bold uppercase tracking-[0.14em]
                  text-[#6b3f18]
                  hover:bg-[#efe3cf]
                "
              >
                <X className="mr-2 h-4 w-4" />
                Temizle
              </Button>
            )}

            <Button
              className="
                rounded-full border-2 border-transparent
                bg-transparent px-5
                text-xs font-bold uppercase tracking-[0.16em]
                text-[#e8dcc0]
                shadow-none
                transition-all duration-300
                hover:brightness-110
              "
              style={{
                backgroundImage: `
                  linear-gradient(#524528, #524528),
                  linear-gradient(to right, #6b3f18, #c8893a, #e8b060, #c8893a, #6b3f18)
                `,
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                boxShadow:
                  "0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtrele
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
