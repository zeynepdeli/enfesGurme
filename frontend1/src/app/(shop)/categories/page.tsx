"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Category } from "@/types";
import { ProductGrid } from "@/components/products/product-grid";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const { id } = useParams();


  const { data: category } = useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const response = await api.get<Category>(`/api/categories/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const params = useParams();
console.log("params:", params);


  return (
    <ProductGrid
      categoryId={id as string}
      title={category?.name}
      subtitle="Handcrafted selections from Gaziantep's finest dairies"
    />
  );
}
