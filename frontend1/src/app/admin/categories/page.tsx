"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Category } from "@/types";
import { useCategoryMutations } from "@/hooks/use-category-mutations";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";
import { CrudPageLayout } from "@/components/admin/shared/layouts";
import { CardGrid } from "@/components/admin/shared/data-display/card-grid";
import { DataTable } from "@/components/admin/shared/data-display/data-table";
import { FormDialog } from "@/components/admin/shared/form-dialog";
import { CategoryForm } from "@/components/admin/categories/category-form";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, LayoutGrid, Table, FolderTree } from "lucide-react";

export default function CategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [layout, setLayout] = useState<"grid" | "table">("grid");

  /* FETCH */
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<Category[]>("/api/categories");
      return response.data || [];
    },
  });

  /* MUTATIONS */
  const { create, update, remove } = useCategoryMutations();

  /* HANDLERS */
  const handleCreate = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      remove.mutate(id);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingCategory) {
      update.mutate(
        { id: editingCategory.id, data },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingCategory(null);
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
    setEditingCategory(null);
  };

  /* LOADING */
  if (isLoading) {
    return <LoadingSpinner text="Kategoriler yükleniyor..." fullScreen />;
  }

  /* ERROR */
  if (error) {
    return <ErrorMessage message={(error as Error).message} />;
  }

  /* COLUMNS */
  const columns = [
    {
      key: "name",
      label: "Kategori",
      width: "40%",
      render: (category: Category) => (
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
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <FolderTree className="h-6 w-6 text-[#2c1a0e]" />
              </div>
            )}
          </div>

          {/* TEXT */}
          <div className="min-w-0">
            <div className="font-serif text-lg font-black text-[#2c1a0e]">
              {category.name}
            </div>

            <div className="mt-1 font-mono text-xs text-[#5e4734]/55">
              /{category.slug}
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "description",
      label: "Açıklama",
      width: "40%",
      render: (category: Category) => (
        <p className="line-clamp-2 text-sm leading-relaxed text-[#5e4734]/70">
          {category.description || "Açıklama yok"}
        </p>
      ),
    },

    {
      key: "products",
      label: "Ürün Sayısı",
      width: "20%",
      render: (category: Category) => (
        <div
          className="
            inline-flex items-center rounded-full
            border border-[#d0bc90]
            bg-[#efe3cf]/70
            px-3 py-1
            text-xs font-bold text-[#7a3b1e]
          "
        >
          {category._count?.products || 0} ürün
        </div>
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
      onClick: (category: Category) => handleDelete(category.id),
    },
  ];

  return (
    <>
      <CrudPageLayout
        title="Kategoriler"
        description="Ürün kategorilerini yönetin"
        onCreateClick={handleCreate}
        createButtonText="Yeni Kategori"
      >
        {/* TOGGLE */}
        <div className="mb-5 flex gap-2">
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

        {/* GRID */}
        {layout === "grid" ? (
          <CardGrid
            data={categories || []}
            columns={columns}
            actions={actions}
            emptyState={{
              icon: <FolderTree className="h-16 w-16 text-[#5e4734]/40" />,

              title: "Henüz kategori yok",

              description: "İlk kategoriyi oluşturarak başlayın",

              action: {
                label: "Kategori Ekle",
                onClick: handleCreate,
              },
            }}
          />
        ) : (
          <DataTable
            data={categories || []}
            columns={columns}
            actions={actions}
            emptyState={{
              icon: <FolderTree className="h-16 w-16 text-[#5e4734]/40" />,

              title: "Henüz kategori yok",

              description: "İlk kategoriyi oluşturarak başlayın",

              action: {
                label: "Kategori Ekle",
                onClick: handleCreate,
              },
            }}
          />
        )}
      </CrudPageLayout>

      {/* DIALOG */}
      <FormDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        title={editingCategory ? "Kategori Düzenle" : "Yeni Kategori"}
        description="Kategori bilgilerini girin"
      >
        <CategoryForm
          category={editingCategory}
          onSubmit={handleSubmit}
          isLoading={create.isPending || update.isPending}
          onCancel={handleCloseDialog}
        />
      </FormDialog>
    </>
  );
}
