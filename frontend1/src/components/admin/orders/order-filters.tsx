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

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Müşteri Arama */}
          <div className="space-y-2">
            <Label htmlFor="search">Müşteri Ara</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="İsim veya email..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Durum */}
          <div className="space-y-2">
            <Label htmlFor="status">Sipariş Durumu</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Tüm durumlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm durumlar</SelectItem>
                <SelectItem value="PENDING">Bekliyor</SelectItem>
                <SelectItem value="CONFIRMED">Onaylandı</SelectItem>
                <SelectItem value="SHIPPED">Kargoda</SelectItem>
                <SelectItem value="DELIVERED">Teslim Edildi</SelectItem>
                <SelectItem value="CANCELLED">İptal Edildi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Başlangıç Tarihi */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Başlangıç Tarihi</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </div>

          {/* Bitiş Tarihi */}
          <div className="space-y-2">
            <Label htmlFor="endDate">Bitiş Tarihi</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>
        </div>

        {/* Temizle Butonu */}
        {hasActiveFilters && (
          <div className="mt-4">
            <Button variant="outline" onClick={handleReset}>
              <X className="h-4 w-4 mr-2" />
              Filtreleri Temizle
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
