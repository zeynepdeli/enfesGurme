"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { User } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  ShoppingCart,
  MapPin,
  Package,
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface UserDetailModalProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailModal({
  userId,
  open,
  onOpenChange,
}: UserDetailModalProps) {
  // Modal açıkken kullanıcı detayını çek
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await api.get<User>(`/api/users/admin/${userId}`);
      return response.data;
    },
    enabled: !!userId && open, // userId var ve modal açıksa çalış
  });

  const getRoleBadgeVariant = (role: string): "default" | "secondary" => {
    return role === "ADMIN" ? "default" : "secondary";
  };

  const getOrderStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      DELIVERED: "default",
      CANCELLED: "destructive",
      PENDING: "secondary",
      CONFIRMED: "secondary",
      SHIPPED: "secondary",
    };
    return variants[status] || "secondary";
  };

  const getOrderStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "Bekliyor",
      CONFIRMED: "Onaylandı",
      SHIPPED: "Kargoda",
      DELIVERED: "Teslim Edildi",
      CANCELLED: "İptal Edildi",
    };
    return labels[status] || status;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="py-8">
            <LoadingSpinner text="Kullanıcı bilgileri yükleniyor..." />
          </div>
        ) : user ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Kullanıcı Detayı</span>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role}
                </Badge>
              </DialogTitle>
              <DialogDescription>{user.email}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Kullanıcı Bilgileri */}
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <UserIcon className="h-5 w-5" />
                  Kullanıcı Bilgileri
                </h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p>
                    <span className="font-medium">Ad Soyad:</span> {user.name}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Rol:</span>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Kayıt Tarihi:</span>
                    {format(new Date(user.createdAt), "dd MMMM yyyy HH:mm", {
                      locale: tr,
                    })}
                  </p>
                </div>
              </div>

              <Separator />

              {/* İstatistikler */}
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Package className="h-5 w-5" />
                  İstatistikler
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary">
                      {user._count?.orders || 0}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Toplam Sipariş
                    </div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary">
                      {user._count?.addresses || 0}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Kayıtlı Adres
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Son Siparişler */}
              {user.orders && user.orders.length > 0 && (
                <>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-3">
                      <ShoppingCart className="h-5 w-5" />
                      Son Siparişler (Son 5)
                    </h3>
                    <div className="space-y-3">
                      {user.orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-mono text-sm">
                              {order.id.slice(0, 8)}...
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(
                                new Date(order.createdAt),
                                "dd MMM yyyy HH:mm",
                                { locale: tr },
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-green-600">
                              {Number(order.total).toFixed(2)} TL
                            </span>
                            <Badge variant={getOrderStatusBadge(order.status)}>
                              {getOrderStatusLabel(order.status)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              {/* Adresler */}
              {user.addresses && user.addresses.length > 0 && (
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5" />
                    Kayıtlı Adresler
                  </h3>
                  <div className="space-y-3">
                    {user.addresses.map((address) => (
                      <div
                        key={address.id}
                        className="bg-muted/50 p-4 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{address.title}</span>
                          {address.isDefault && (
                            <Badge variant="outline">Varsayılan</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {address.district}, {address.city}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Kullanıcı bulunamadı
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
