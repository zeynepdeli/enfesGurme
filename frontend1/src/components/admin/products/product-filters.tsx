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
import { Card, CardContent } from "@/components/ui/card";
import { Search, X } from "lucide-react";
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
    const newFilters = { ...filters, [key]: value };
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

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Arama */}
          <div className="space-y-2">
            <Label htmlFor="search">Ürün Ara</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Ürün adı..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Kategori */}
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select
              value={filters.categoryId || "all"}
              onValueChange={(value) =>
                handleFilterChange("categoryId", value === "all" ? "" : value)
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Tüm kategoriler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm kategoriler</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Min Fiyat */}
          <div className="space-y-2">
            <Label htmlFor="minPrice">Min Fiyat (TL)</Label>
            <Input
              id="minPrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            />
          </div>

          {/* Max Fiyat */}
          <div className="space-y-2">
            <Label htmlFor="maxPrice">Max Fiyat (TL)</Label>
            <Input
              id="maxPrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="1000"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            />
          </div>
        </div>

        {/* Stok Durumu ve Temizle */}
        <div className="flex items-end gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="inStock">Stok Durumu</Label>
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
              <SelectTrigger id="inStock" className="w-[180px]">
                <SelectValue placeholder="Tümü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="true">Stokta Var</SelectItem>
                <SelectItem value="false">Stokta Yok</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button variant="outline" onClick={handleReset}>
              <X className="h-4 w-4 mr-2" />
              Filtreleri Temizle
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
