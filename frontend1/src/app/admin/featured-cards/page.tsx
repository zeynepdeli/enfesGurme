"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FeaturedCard } from "@/types";
import { useFeaturedCardMutations } from "@/hooks/use-featured-card-mutations";
import { CrudPageLayout } from "@/components/admin/shared/layouts/crud-page-layout";
import { DataTable } from "@/components/admin/shared/data-display/data-table";
import { FormDialog } from "@/components/admin/shared/form-dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Star } from "lucide-react";
import { FeaturedCardForm } from "@/components/admin/featured-cards/featured-card-form";

export default function FeaturedCardsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<FeaturedCard | null>(null);

  const { data: cards, isLoading } = useQuery({
    queryKey: ["featured-cards"],
    queryFn: async () => {
      const res = await api.get<FeaturedCard[]>("/api/featured-cards/all");
      return res.data ?? [];
    },
  });

  const { create, update, remove } = useFeaturedCardMutations();

  const handleSubmit = (data: any) => {
    if (editing) {
      update.mutate(
        { id: editing.id, data },
        {
          onSuccess: () => {
            setIsOpen(false);
            setEditing(null);
          },
        },
      );
    } else {
      create.mutate(data, { onSuccess: () => setIsOpen(false) });
    }
  };

  const columns = [
    {
      key: "image",
      label: "Görsel",
      width: "10%",
      render: (card: FeaturedCard) => (
        <img
          src={card.imageUrl}
          alt={card.title}
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      key: "title",
      label: "Başlık",
      width: "25%",
      render: (card: FeaturedCard) => (
        <span className="font-semibold">{card.title}</span>
      ),
    },
    {
      key: "description",
      label: "Açıklama",
      width: "35%",
      render: (card: FeaturedCard) => (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {card.description}
        </p>
      ),
    },
    {
      key: "order",
      label: "Sıra",
      width: "10%",
      render: (card: FeaturedCard) => (
        <span className="text-sm">#{card.order + 1}</span>
      ),
    },
    {
      key: "status",
      label: "Durum",
      width: "10%",
      render: (card: FeaturedCard) => (
        <Badge variant={card.isActive ? "default" : "secondary"}>
          {card.isActive ? "Aktif" : "Pasif"}
        </Badge>
      ),
    },
  ];

  const actions = [
    {
      label: "Düzenle",
      icon: <Pencil className="h-4 w-4" />,
      variant: "outline" as const,
      onClick: (card: FeaturedCard) => {
        setEditing(card);
        setIsOpen(true);
      },
    },
    {
      label: "",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive" as const,
      onClick: (card: FeaturedCard) => {
        if (confirm("Silmek istediğinize emin misiniz?"))
          remove.mutate(card.id);
      },
    },
  ];

  return (
    <>
      <CrudPageLayout
        title="Öne Çıkan Kartlar"
        description="Ana sayfada gösterilen öne çıkan kartları yönetin (maks. 4)"
        onCreateClick={() => {
          setEditing(null);
          setIsOpen(true);
        }}
        createButtonText="Yeni Kart"
      >
        <DataTable
          data={cards ?? []}
          columns={columns}
          actions={actions}
          emptyState={{
            icon: <Star className="h-16 w-16 text-muted-foreground" />,
            title: "Henüz kart yok",
            description: "İlk öne çıkan kartı oluşturun",
          }}
        />
      </CrudPageLayout>

      <FormDialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsOpen(false);
            setEditing(null);
          }
        }}
        title={editing ? "Kartı Düzenle" : "Yeni Kart"}
        description="Görsel URL, başlık ve açıklama girin"
      >
        <FeaturedCardForm
          card={editing}
          onSubmit={handleSubmit}
          isLoading={create.isPending || update.isPending}
          onCancel={() => {
            setIsOpen(false);
            setEditing(null);
          }}
        />
      </FormDialog>
    </>
  );
}
