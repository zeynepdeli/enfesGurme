// src/components/admin/orders/order-detail-modal.tsx

import { Order, OrderStatus } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, Package, Calendar, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface OrderDetailModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailModal({
  order,
  open,
  onOpenChange,
}: OrderDetailModalProps) {
  if (!order) return null;

  const getStatusVariant = (
    status: OrderStatus,
  ): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "DELIVERED":
        return "default";
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      PENDING: "Bekliyor",
      CONFIRMED: "Onaylandı",
      SHIPPED: "Kargoda",
      DELIVERED: "Teslim Edildi",
      CANCELLED: "İptal Edildi",
    };
    return labels[status];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Sipariş Detayı</span>
            <Badge variant={getStatusVariant(order.status)}>
              {getStatusLabel(order.status)}
            </Badge>
          </DialogTitle>
          <DialogDescription>Sipariş ID: {order.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Müşteri Bilgileri */}
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <User className="h-5 w-5" />
              Müşteri Bilgileri
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p>
                <span className="font-medium">Ad Soyad:</span>{" "}
                {order.user?.name || "Bilinmiyor"}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {order.user?.email || "Bilinmiyor"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Teslimat Adresi */}
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5" />
              Teslimat Adresi
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p>
                <span className="font-medium">{order.address.title}</span>
              </p>
              <p>{order.address.fullName}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.address}</p>
              <p>
                {order.address.district}, {order.address.city}
              </p>
              {order.address.zipCode && (
                <p>Posta Kodu: {order.address.zipCode}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Ürünler */}
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Package className="h-5 w-5" />
              Sipariş Kalemleri ({order.items.length} ürün)
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  {item.product.images?.[0] ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Adet: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {Number(item.price).toFixed(2)} TL
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Toplam: {(Number(item.price) * item.quantity).toFixed(2)}{" "}
                      TL
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Özet */}
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5" />
              Sipariş Özeti
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Ara Toplam:</span>
                <span>{Number(order.total).toFixed(2)} TL</span>
              </div>
              <div className="flex justify-between">
                <span>Kargo:</span>
                <span className="text-green-600">Ücretsiz</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Toplam:</span>
                <span className="text-green-600">
                  {Number(order.total).toFixed(2)} TL
                </span>
              </div>
            </div>
          </div>

          {/* Tarih Bilgisi */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Sipariş Tarihi:{" "}
            {format(new Date(order.createdAt), "dd MMMM yyyy HH:mm", {
              locale: tr,
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
