"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Product, Category } from "@/types";
import { useProductMutations } from "@/hooks/use-product-mutations";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { CrudPageLayout } from "@/components/admin/shared/layouts/crud-page-layout";
import { CardGrid } from "@/components/admin/shared/data-display/card-grid";
import { DataTable } from "@/components/admin/shared/data-display/data-table";
import { FormDialog } from "@/components/admin/shared/form-dialog";
import { ProductForm } from "@/components/admin/products/product-form";
import {
  ProductFilters,
  ProductFilterValues,
} from "@/components/admin/products/product-filters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Pencil, Trash2, LayoutGrid, Table } from "lucide-react";

export default function ProductsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [layout, setLayout] = useState<"grid" | "table">("table");
  const [filters, setFilters] = useState<ProductFilterValues>({
    search: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    inStock: null,
  });

  // Fetch products
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get<Product[]>("/api/products");
      return response.data || [];
    },
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<Category[]>("/api/categories");
      return response.data || [];
    },
  });

  const { create, update, remove } = useProductMutations();

  // Client-side filtreleme
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      // Arama
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(searchLower);
        const matchesDescription = product.description
          .toLowerCase()
          .includes(searchLower);
        if (!matchesName && !matchesDescription) return false;
      }

      // Kategori
      if (filters.categoryId && product.categoryId !== filters.categoryId) {
        return false;
      }

      // Min Fiyat
      if (filters.minPrice && product.price < parseFloat(filters.minPrice)) {
        return false;
      }

      // Max Fiyat
      if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) {
        return false;
      }

      // Stok Durumu
      if (filters.inStock !== null) {
        const hasStock = product.stock > 0;
        if (filters.inStock && !hasStock) return false;
        if (!filters.inStock && hasStock) return false;
      }

      return true;
    });
  }, [products, filters]);

  const handleCreate = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      remove.mutate(id);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingProduct) {
      update.mutate(
        { id: editingProduct.id, data },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingProduct(null);
          },
        },
      );
    } else {
      create.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const columns = [
    {
      key: "product",
      label: "Ürün",
      width: "35%",
      render: (product: Product) => (
        <div className="flex items-center gap-3">
          {product.images?.[0] ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-12 h-12 rounded object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div>
            <div className="font-semibold">{product.name}</div>
            <div className="text-xs text-muted-foreground">
              {product.category?.name || "Kategorisiz"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      label: "Açıklama",
      width: "30%",
      render: (product: Product) => (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      ),
    },
    {
      key: "price",
      label: "Fiyat",
      width: "15%",
      render: (product: Product) => (
        <span className="font-bold text-green-600">{product.price} TL</span>
      ),
    },
    {
      key: "stock",
      label: "Stok",
      width: "10%",
      render: (product: Product) => (
        <Badge
          variant={
            product.stock > 10
              ? "default"
              : product.stock > 0
                ? "secondary"
                : "destructive"
          }
        >
          {product.stock} adet
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Durum",
      width: "10%",
      render: (product: Product) => (
        <Badge variant={product.isActive ? "default" : "secondary"}>
          {product.isActive ? "Aktif" : "Pasif"}
        </Badge>
      ),
    },
  ];

  const actions = [
    {
      label: "Düzenle",
      icon: <Pencil className="h-4 w-4" />,
      variant: "outline" as const,
      onClick: handleEdit,
    },
    {
      label: "",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive" as const,
      onClick: (product: Product) => handleDelete(product.id),
    },
  ];

  if (isLoading) {
    return <LoadingSpinner text="Ürünler yükleniyor..." fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <>
      <CrudPageLayout
        title="Ürünler"
        description="Ürünleri yönetin"
        onCreateClick={handleCreate}
        createButtonText="Yeni Ürün"
      >
        {/* Filtreleme */}
        <ProductFilters
          categories={categories || []}
          onFilterChange={setFilters}
        />

        {/* Sonuç Sayısı */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} ürün bulundu
          </p>

          {/* Toggle */}
          <div className="flex gap-2">
            <Button
              variant={layout === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setLayout("grid")}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={layout === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setLayout("table")}
            >
              <Table className="h-4 w-4 mr-2" />
              Tablo
            </Button>
          </div>
        </div>

        {/* Data Display */}
        {layout === "grid" ? (
          <CardGrid
            data={filteredProducts}
            columns={columns}
            actions={actions}
            emptyState={{
              icon: <Package className="h-16 w-16 text-muted-foreground" />,
              title: "Ürün bulunamadı",
              description: "Filtreleri değiştirmeyi deneyin",
            }}
          />
        ) : (
          <DataTable
            data={filteredProducts}
            columns={columns}
            actions={actions}
            emptyState={{
              icon: <Package className="h-16 w-16 text-muted-foreground" />,
              title: "Ürün bulunamadı",
              description: "Filtreleri değiştirmeyi deneyin",
            }}
          />
        )}
      </CrudPageLayout>

      {/* Dialog */}
      <FormDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        title={editingProduct ? "Ürün Düzenle" : "Yeni Ürün"}
        description="Ürün bilgilerini girin"
        maxWidth="lg"
      >
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          isLoading={create.isPending || update.isPending}
          onCancel={handleCloseDialog}
        />
      </FormDialog>
    </>
  );
}
