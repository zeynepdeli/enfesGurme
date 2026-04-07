"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCart } from "@/hooks/use-cart";
import { Address } from "@/types";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AddressForm,
  AddressFormData,
} from "@/components/shop/checkout/address-form";
import { MapPin, Plus } from "lucide-react";

export default function CheckoutPage() {
  const queryClient = useQueryClient();
  const { items } = useCart();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response = await api.get<Address[]>("/api/addresses");
      return response.data || [];
    },
  });

  const createAddress = useMutation({
    mutationFn: async (data: AddressFormData) => {
      const response = await api.post("/api/addresses", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setIsAddressDialogOpen(false);
    },
  });

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          icon="🛒"
          title="Sepetiniz boş"
          description="Sipariş vermek için önce sepete ürün ekleyin"
          action={{
            label: "Ürünlere Dön",
            onClick: () => (window.location.href = "/products"),
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Sipariş Ver</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sol: Adres Seçimi */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg border mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Teslimat Adresi</h2>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddressDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Adres
              </Button>
            </div>

            {isLoading ? (
              <LoadingSpinner text="Adresler yükleniyor..." />
            ) : addresses && addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedAddressId === address.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{address.title}</span>
                          {address.isDefault && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Varsayılan
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {address.fullName} - {address.phone}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.address}, {address.district}/{address.city}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Henüz kayıtlı adresiniz yok. Lütfen yeni adres ekleyin.
              </p>
            )}
          </div>
        </div>

        {/* Sağ: Sipariş Özeti */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border sticky top-4">
            <h2 className="text-xl font-bold mb-4">Sipariş Özeti</h2>
            <p className="text-sm text-muted-foreground">
              {selectedAddressId ? "✓ Adres seçildi" : "Lütfen adres seçin"}
            </p>
          </div>
        </div>
      </div>

      {/* Yeni Adres Modal */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Yeni Adres Ekle</DialogTitle>
          </DialogHeader>
          <AddressForm
            onSubmit={(data) => createAddress.mutate(data)}
            onCancel={() => setIsAddressDialogOpen(false)}
            isLoading={createAddress.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
