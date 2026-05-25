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
import { Search, X, SlidersHorizontal } from "lucide-react";
import { OrderStatus } from "@/types";

interface OrderFiltersProps {
  onFilterChange: (filters: OrderFilterValues) => void;
}

export interface OrderFilterValues {
  search: string;
  status: OrderStatus | "all";
  startDate: string;
  endDate: string;
}

export function OrderFilters({ onFilterChange }: OrderFiltersProps) {
  const [filters, setFilters] = useState<OrderFilterValues>({
    search: "",
    status: "all",
    startDate: "",
    endDate: "",
  });

  const handleFilterChange = (key: keyof OrderFilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: OrderFilterValues = {
      search: "",
      status: "all",
      startDate: "",
      endDate: "",
    };

    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.startDate ||
    filters.endDate;

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
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]" />

      <div className="pointer-events-none absolute inset-[6px] z-[2] rounded-[16px] border border-[#d6c49a]/70" />

      <div className="relative z-10">
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
            style={{ backgroundImage: "url('/bkrr.png')" }}
          >
            <SlidersHorizontal size={19} />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a67c3d]">
              Sipariş Yönetimi
            </span>

            <h3 className="font-serif text-xl font-black italic text-[#2c1a0e]">
              Filtreler
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="search" className={labelClassName}>
              Müşteri Ara
            </Label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a3b1e]/55" />

              <Input
                id="search"
                placeholder="İsim veya email..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className={`pl-10 ${inputClassName}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className={labelClassName}>
              Sipariş Durumu
            </Label>

            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger id="status" className={inputClassName}>
                <SelectValue placeholder="Tüm durumlar" />
              </SelectTrigger>

              <SelectContent className="border-[#d0bc90] bg-[#efe6cf] text-[#2c1a0e]">
                <SelectItem value="all">Tüm durumlar</SelectItem>
                <SelectItem value="PENDING">Bekliyor</SelectItem>
                <SelectItem value="CONFIRMED">Onaylandı</SelectItem>
                <SelectItem value="SHIPPED">Kargoda</SelectItem>
                <SelectItem value="DELIVERED">Teslim Edildi</SelectItem>
                <SelectItem value="CANCELLED">İptal Edildi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate" className={labelClassName}>
              Başlangıç Tarihi
            </Label>

            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className={labelClassName}>
              Bitiş Tarihi
            </Label>

            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-5 border-t border-[#3d3020]/10 pt-4">
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
              Filtreleri Temizle
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
