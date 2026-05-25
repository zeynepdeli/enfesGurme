"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
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

  /* PRODUCTS */
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

  /* CATEGORIES */
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<Category[]>("/api/categories");
      return response.data || [];
    },
  });

  const { create, update, remove } = useProductMutations();

  /* FILTER */
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();

        const matchesName = product.name.toLowerCase().includes(searchLower);

        const matchesDescription = product.description
          .toLowerCase()
          .includes(searchLower);

        if (!matchesName && !matchesDescription) return false;
      }

      if (filters.categoryId && product.categoryId !== filters.categoryId) {
        return false;
      }

      if (filters.minPrice && product.price < parseFloat(filters.minPrice)) {
        return false;
      }

      if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) {
        return false;
      }

      if (filters.inStock !== null) {
        const hasStock = product.stock > 0;

        if (filters.inStock && !hasStock) return false;

        if (!filters.inStock && hasStock) return false;
      }

      return true;
    });
  }, [products, filters]);

  /* CRUD */
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
        {
          id: editingProduct.id,
          data,
        },
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

  /* COLUMNS */
  const columns = [
    {
      key: "product",
      label: "Ürün",
      width: "35%",

      render: (product: Product) => (
        <div className="flex items-center gap-4">
          {/* IMAGE */}
          <div
            className="
              relative h-14 w-14 shrink-0 overflow-hidden rounded-full

              border border-[#d8bf8a]

              shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.18)]
            "
          >
            {/* BKRR */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/bkrr.png')",
              }}
            />

            {/* IMAGE */}
            {product.images?.[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="h-6 w-6 text-[#2c1a0e]" />
              </div>
            )}
          </div>

          {/* TEXT */}
          <div className="min-w-0">
            <div className="font-serif text-lg font-black text-[#2c1a0e]">
              {product.name}
            </div>

            <div className="mt-1 text-xs text-[#5e4734]/60">
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
        <p className="line-clamp-2 text-sm leading-relaxed text-[#5e4734]/70">
          {product.description}
        </p>
      ),
    },

    {
      key: "price",
      label: "Fiyat",
      width: "15%",

      render: (product: Product) => (
        <span className="font-black text-[#7a3b1e]">₺{product.price}</span>
      ),
    },

    {
      key: "stock",
      label: "Stok",
      width: "10%",

      render: (product: Product) => (
        <span
          className={`
            inline-flex items-center rounded-full
            px-3 py-1 text-xs font-bold

            ${
              product.stock > 10
                ? "bg-[#dcebd4] text-[#476f3c]"
                : product.stock > 0
                  ? "bg-[#efe3cf] text-[#7a3b1e]"
                  : "bg-[#f4dfdc] text-[#8f2f2f]"
            }
          `}
        >
          {product.stock} adet
        </span>
      ),
    },

    {
      key: "status",
      label: "Durum",
      width: "10%",

      render: (product: Product) => (
        <span
          className={`
            inline-flex items-center rounded-full
            px-3 py-1 text-xs font-bold

            ${
              product.isActive
                ? "bg-[#dcebd4] text-[#476f3c]"
                : "bg-[#f4dfdc] text-[#8f2f2f]"
            }
          `}
        >
          {product.isActive ? "Aktif" : "Pasif"}
        </span>
      ),
    },
  ];

  /* ACTIONS */
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

  /* LOADING */
  if (isLoading) {
    return <LoadingSpinner text="Ürünler yükleniyor..." fullScreen />;
  }

  /* ERROR */
  if (error) {
    return <ErrorMessage message={(error as Error).message} />;
  }

  return (
    <>
      <CrudPageLayout
        title="Ürünler"
        description="Ürünleri yönetin"
        onCreateClick={handleCreate}
        createButtonText="Yeni Ürün"
      >
        {/* FILTERS */}
        <ProductFilters
          categories={categories || []}
          onFilterChange={setFilters}
        />

        {/* RESULT + TOGGLE */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-[#5e4734]/70">
            {filteredProducts.length} ürün bulundu
          </p>

          {/* TOGGLE */}
          <div className="flex gap-2">
            <Button
              variant={layout === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setLayout("grid")}
              className={
                layout === "grid"
                  ? `
                    border-2 border-transparent
                    text-[#e8dcc0]
                  `
                  : ""
              }
              style={
                layout === "grid"
                  ? {
                      backgroundImage: `
                        linear-gradient(#524528, #524528),
                        linear-gradient(to right, #6b3f18, #c8893a, #e8b060, #c8893a, #6b3f18)
                      `,
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                    }
                  : {}
              }
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Grid
            </Button>

            <Button
              variant={layout === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setLayout("table")}
              className={
                layout === "table"
                  ? `
                    border-2 border-transparent
                    text-[#e8dcc0]
                  `
                  : ""
              }
              style={
                layout === "table"
                  ? {
                      backgroundImage: `
                        linear-gradient(#524528, #524528),
                        linear-gradient(to right, #6b3f18, #c8893a, #e8b060, #c8893a, #6b3f18)
                      `,
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                    }
                  : {}
              }
            >
              <Table className="mr-2 h-4 w-4" />
              Tablo
            </Button>
          </div>
        </div>

        {/* DATA */}
        {layout === "grid" ? (
          <CardGrid
            data={filteredProducts}
            columns={columns}
            actions={actions}
            emptyState={{
              icon: <Package className="h-16 w-16 text-[#5e4734]/40" />,

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
              icon: <Package className="h-16 w-16 text-[#5e4734]/40" />,

              title: "Ürün bulunamadı",

              description: "Filtreleri değiştirmeyi deneyin",
            }}
          />
        )}
      </CrudPageLayout>

      {/* DIALOG */}
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
