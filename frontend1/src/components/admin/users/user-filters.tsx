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

interface UserFiltersProps {
  onFilterChange: (filters: UserFilterValues) => void;
}

export interface UserFilterValues {
  search: string;
  role: "all" | "USER" | "ADMIN";
  startDate: string;
  endDate: string;
}

export function UserFilters({ onFilterChange }: UserFiltersProps) {
  const [filters, setFilters] = useState<UserFilterValues>({
    search: "",
    role: "all",
    startDate: "",
    endDate: "",
  });

  const handleFilterChange = (key: keyof UserFilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: UserFilterValues = {
      search: "",
      role: "all",
      startDate: "",
      endDate: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.role !== "all" ||
    filters.startDate ||
    filters.endDate;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Kullanıcı Arama */}
          <div className="space-y-2">
            <Label htmlFor="search">Kullanıcı Ara</Label>
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

          {/* Rol */}
          <div className="space-y-2">
            <Label htmlFor="role">Kullanıcı Rolü</Label>
            <Select
              value={filters.role}
              onValueChange={(value) => handleFilterChange("role", value)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Tüm roller" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm roller</SelectItem>
                <SelectItem value="USER">USER</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Başlangıç Tarihi */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Kayıt Başlangıç</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </div>

          {/* Bitiş Tarihi */}
          <div className="space-y-2">
            <Label htmlFor="endDate">Kayıt Bitiş</Label>
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
