"use client";

import { useState } from "react";
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
import { Pencil, Trash2, LayoutGrid, Table } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FolderTree } from "lucide-react";

export default function CategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [layout, setLayout] = useState<"grid" | "table">("grid");

  // Fetch categories
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

  // Mutations hook
  const { create, update, remove } = useCategoryMutations();

  // Handlers
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

  // Columns
  const columns = [
    {
      key: "name",
      label: "Kategori",
      width: "40%",
      render: (category: Category) => (
        <div className="flex items-center gap-3">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-10 h-10 rounded-full object-cover border"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <FolderTree className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <div>
            <div className="font-semibold text-lg">{category.name}</div>
            <div className="text-xs text-muted-foreground font-mono mt-1">
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
        <p className="text-sm text-muted-foreground line-clamp-2">
          {category.description || "Açıklama yok"}
        </p>
      ),
    },
    {
      key: "products",
      label: "Ürün Sayısı",
      width: "20%",
      render: (category: Category) => (
        <Badge variant="secondary">{category._count?.products || 0} ürün</Badge>
      ),
    },
  ];

  // Actions
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

  if (isLoading) {
    return <LoadingSpinner text="Kategoriler yükleniyor..." fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <>
      <CrudPageLayout
        title="Kategoriler"
        description="Ürün kategorilerini yönetin"
        onCreateClick={handleCreate}
        createButtonText="Yeni Kategori"
      >
        {/* Toggle */}
        <div className="flex gap-2 mb-4">
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

        {/* Data Display */}
        {layout === "grid" ? (
          <CardGrid
            data={categories || []}
            columns={columns}
            actions={actions}
            emptyState={{
              icon: <FolderTree className="h-16 w-16 text-muted-foreground" />,
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
              icon: <FolderTree className="h-16 w-16 text-muted-foreground" />,
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

      {/* Dialog */}
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
