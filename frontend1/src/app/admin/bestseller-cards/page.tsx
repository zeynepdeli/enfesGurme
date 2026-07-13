"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { BestsellerCard } from "@/types";
import { useBestsellerCardMutations } from "@/hooks/use-bestseller-card-mutations";
import { CrudPageLayout } from "@/components/admin/shared/layouts/crud-page-layout";
import { DataTable } from "@/components/admin/shared/data-display/data-table";
import { FormDialog } from "@/components/admin/shared/form-dialog";

import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Trophy } from "lucide-react";
import { BestsellerCardForm } from "@/components/admin/bestseller-cards/best-seller-card-form";

export default function BestsellerCardsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<BestsellerCard | null>(null);

  const { data: cards } = useQuery({
    queryKey: ["bestseller-cards"],
    queryFn: async () => {
      const res = await api.get<BestsellerCard[]>("/api/bestseller-cards/all");
      return res.data ?? [];
    },
  });

  const { create, update, remove } = useBestsellerCardMutations();

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
      render: (card: BestsellerCard) => (
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
      width: "20%",
      render: (card: BestsellerCard) => (
        <span className="font-semibold">{card.title}</span>
      ),
    },
    {
      key: "description",
      label: "Açıklama",
      width: "30%",
      render: (card: BestsellerCard) => (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {card.description}
        </p>
      ),
    },
    {
      key: "price",
      label: "Fiyat",
      width: "10%",
      render: (card: BestsellerCard) => (
        <span className="font-bold text-green-600">{card.price} TL</span>
      ),
    },
    {
      key: "order",
      label: "Sıra",
      width: "10%",
      render: (card: BestsellerCard) => <span>#{card.order + 1}</span>,
    },
    {
      key: "status",
      label: "Durum",
      width: "10%",
      render: (card: BestsellerCard) => (
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
      onClick: (card: BestsellerCard) => {
        setEditing(card);
        setIsOpen(true);
      },
    },
    {
      label: "",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive" as const,
      onClick: (card: BestsellerCard) => {
        if (confirm("Silmek istediğinize emin misiniz?"))
          remove.mutate(card.id);
      },
    },
  ];

  return (
    <>
      <CrudPageLayout
        title="En Çok Satanlar"
        description="Ana sayfada gösterilen en çok satan kartları yönetin (maks. 5)"
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
            icon: <Trophy className="h-16 w-16 text-muted-foreground" />,
            title: "Henüz kart yok",
            description: "İlk en çok satan kartı oluşturun",
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
        description="Kart bilgilerini girin"
      >
        <BestsellerCardForm
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
