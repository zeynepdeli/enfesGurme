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

import { LoadingSpinner } from "@/components/shared/loading-spinner";

import {
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  ShoppingCart,
  MapPin,
  Package,
  Crown,
} from "lucide-react";

import { format } from "date-fns";
import { tr } from "date-fns/locale";

import Image from "next/image";

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
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],

    queryFn: async () => {
      const response = await api.get<User>(`/api/users/admin/${userId}`);

      return response.data;
    },

    enabled: !!userId && open,
  });

  const getRoleBadge = (role: string) => {
    return role === "ADMIN"
      ? {
          label: "ADMIN",
          className: "border-[#c8893a] bg-[#fff0cf] text-[#7a3b1e]",
        }
      : {
          label: "KULLANICI",
          className: "border-[#d0bc90] bg-[#efe3cf] text-[#5e4734]",
        };
  };

  const getOrderStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        label: string;
        className: string;
      }
    > = {
      DELIVERED: {
        label: "Teslim Edildi",
        className: "bg-[#dcebd4] text-[#476f3c] border-[#9dc38f]",
      },

      CANCELLED: {
        label: "İptal Edildi",
        className: "bg-[#f4dfdc] text-[#8f2f2f] border-[#d5a4a4]",
      },

      PENDING: {
        label: "Bekliyor",
        className: "bg-[#efe3cf] text-[#7a3b1e] border-[#d0bc90]",
      },

      CONFIRMED: {
        label: "Onaylandı",
        className: "bg-[#e7e0cc] text-[#6b5534] border-[#cab489]",
      },

      SHIPPED: {
        label: "Kargoda",
        className: "bg-[#e4edf8] text-[#355c8d] border-[#9db9de]",
      },
    };

    return (
      variants[status] || {
        label: status,
        className: "bg-[#efe3cf] text-[#5e4734] border-[#d0bc90]",
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-h-[92vh] overflow-y-auto
          border-[#d0bc90]
          bg-[#f6efdd]
          p-0
          sm:max-w-5xl
        "
      >
        {/* BG */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]" />

        {/* INNER */}
        <div className="pointer-events-none absolute inset-[8px] z-[2] rounded-[24px] border border-[#d6c49a]/70" />

        {isLoading ? (
          <div className="relative z-10 py-16">
            <LoadingSpinner text="Kullanıcı bilgileri yükleniyor..." />
          </div>
        ) : user ? (
          <div className="relative z-10">
            {/* HEADER */}
            <div
              className="
                relative overflow-hidden
                border-b border-[#d0bc90]/70
                px-7 py-7
              "
            >
              {/* BAKIR BG */}
              <div
                className="
                  absolute inset-0 opacity-[0.10]
                  bg-cover bg-center
                "
                style={{
                  backgroundImage: "url('/bkrr.png')",
                }}
              />

              <DialogHeader>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    <div
                      className="
                        relative flex h-20 w-20 items-center justify-center
                        overflow-hidden rounded-full
                        border border-[#d8bf8a]
                        bg-cover bg-center
                        shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.28)]
                      "
                      style={{
                        backgroundImage: "url('/bkrr.png')",
                      }}
                    >
                      <UserIcon className="h-9 w-9 text-[#2c1a0e]" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]">
                        Kullanıcı Profili
                      </span>

                      <DialogTitle className="mt-2 font-serif text-3xl font-black italic text-[#2c1a0e]">
                        {user.name}
                      </DialogTitle>

                      <DialogDescription className="mt-2 flex items-center gap-2 text-[#5e4734]/75">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </DialogDescription>
                    </div>
                  </div>

                  {/* ROLE */}
                  <Badge
                    className={`
                      w-fit rounded-full border px-5 py-2
                      text-xs font-bold uppercase tracking-[0.16em]
                      ${getRoleBadge(user.role).className}
                    `}
                  >
                    {user.role === "ADMIN" && (
                      <Crown className="mr-2 h-3.5 w-3.5" />
                    )}

                    {getRoleBadge(user.role).label}
                  </Badge>
                </div>
              </DialogHeader>
            </div>

            {/* CONTENT */}
            <div className="space-y-6 p-7">
              {/* USER INFO */}
              <div
                className="
                  rounded-[22px]
                  border border-[#d0bc90]
                  bg-[#efe6cf]/65
                  p-5
                "
              >
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="
                      flex h-10 w-10 items-center justify-center
                      overflow-hidden rounded-full
                      border border-[#d8bf8a]
                      bg-cover bg-center
                    "
                    style={{
                      backgroundImage: "url('/bkrr.png')",
                    }}
                  >
                    <UserIcon className="h-4 w-4 text-[#2c1a0e]" />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a67c3d]">
                      Profil
                    </span>

                    <h3 className="font-serif text-xl font-black italic text-[#2c1a0e]">
                      Kullanıcı Bilgileri
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* ITEM */}
                  <div className="rounded-[16px] border border-[#d6c49a]/70 bg-[#fff8ee]/70 p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#7a3b1e]">
                      <UserIcon className="h-4 w-4" />

                      <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                        Ad Soyad
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-[#2c1a0e]">
                      {user.name}
                    </p>
                  </div>

                  {/* ITEM */}
                  <div className="rounded-[16px] border border-[#d6c49a]/70 bg-[#fff8ee]/70 p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#7a3b1e]">
                      <Mail className="h-4 w-4" />

                      <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                        Email
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-[#2c1a0e] break-all">
                      {user.email}
                    </p>
                  </div>

                  {/* ITEM */}
                  <div className="rounded-[16px] border border-[#d6c49a]/70 bg-[#fff8ee]/70 p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#7a3b1e]">
                      <Shield className="h-4 w-4" />

                      <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                        Rol
                      </span>
                    </div>

                    <Badge
                      className={`
                        rounded-full border px-4 py-1
                        text-[10px] font-bold uppercase tracking-[0.14em]
                        ${getRoleBadge(user.role).className}
                      `}
                    >
                      {getRoleBadge(user.role).label}
                    </Badge>
                  </div>

                  {/* ITEM */}
                  <div className="rounded-[16px] border border-[#d6c49a]/70 bg-[#fff8ee]/70 p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#7a3b1e]">
                      <Calendar className="h-4 w-4" />

                      <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                        Kayıt Tarihi
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-[#2c1a0e]">
                      {format(new Date(user.createdAt), "dd MMMM yyyy HH:mm", {
                        locale: tr,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* ORDERS */}
                <div
                  className="
                    relative overflow-hidden rounded-[22px]
                    border border-[#d0bc90]
                    bg-[#efe6cf]
                    p-6
                  "
                >
                  <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(255,248,236,0.9),rgba(239,227,207,0.55))]" />

                  <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className="
                          flex h-11 w-11 items-center justify-center
                          overflow-hidden rounded-full
                          border border-[#d8bf8a]
                          bg-cover bg-center
                        "
                        style={{
                          backgroundImage: "url('/bkrr.png')",
                        }}
                      >
                        <ShoppingCart className="h-5 w-5 text-[#2c1a0e]" />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a67c3d]">
                          İstatistik
                        </span>

                        <h3 className="font-serif text-xl font-black italic text-[#2c1a0e]">
                          Siparişler
                        </h3>
                      </div>
                    </div>

                    <div className="text-5xl font-black text-[#7a3b1e]">
                      {user._count?.orders || 0}
                    </div>

                    <p className="mt-2 text-sm text-[#5e4734]/65">
                      Toplam sipariş sayısı
                    </p>
                  </div>
                </div>

                {/* ADDRESSES */}
                <div
                  className="
                    relative overflow-hidden rounded-[22px]
                    border border-[#d0bc90]
                    bg-[#efe6cf]
                    p-6
                  "
                >
                  <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(255,248,236,0.9),rgba(239,227,207,0.55))]" />

                  <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className="
                          flex h-11 w-11 items-center justify-center
                          overflow-hidden rounded-full
                          border border-[#d8bf8a]
                          bg-cover bg-center
                        "
                        style={{
                          backgroundImage: "url('/bkrr.png')",
                        }}
                      >
                        <MapPin className="h-5 w-5 text-[#2c1a0e]" />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a67c3d]">
                          İstatistik
                        </span>

                        <h3 className="font-serif text-xl font-black italic text-[#2c1a0e]">
                          Adresler
                        </h3>
                      </div>
                    </div>

                    <div className="text-5xl font-black text-[#7a3b1e]">
                      {user._count?.addresses || 0}
                    </div>

                    <p className="mt-2 text-sm text-[#5e4734]/65">
                      Kayıtlı adres sayısı
                    </p>
                  </div>
                </div>
              </div>

              {/* ORDERS */}
              {user.orders && user.orders.length > 0 && (
                <div
                  className="
                    rounded-[22px]
                    border border-[#d0bc90]
                    bg-[#efe6cf]/65
                    p-5
                  "
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div
                      className="
                        flex h-10 w-10 items-center justify-center
                        overflow-hidden rounded-full
                        border border-[#d8bf8a]
                        bg-cover bg-center
                      "
                      style={{
                        backgroundImage: "url('/bkrr.png')",
                      }}
                    >
                      <Package className="h-4 w-4 text-[#2c1a0e]" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a67c3d]">
                        Siparişler
                      </span>

                      <h3 className="font-serif text-xl font-black italic text-[#2c1a0e]">
                        Son Siparişler
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {user.orders.map((order) => {
                      const status = getOrderStatusBadge(order.status);

                      return (
                        <div
                          key={order.id}
                          className="
                            flex flex-col gap-4 rounded-[18px]
                            border border-[#d6c49a]/70
                            bg-[#fff8ee]/70
                            p-4
                            lg:flex-row lg:items-center lg:justify-between
                          "
                        >
                          <div>
                            <div className="font-mono text-sm font-bold text-[#2c1a0e]">
                              #{order.id.slice(0, 8)}
                            </div>

                            <div className="mt-2 text-xs text-[#5e4734]/60">
                              {format(
                                new Date(order.createdAt),
                                "dd MMM yyyy HH:mm",
                                {
                                  locale: tr,
                                },
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-lg font-black text-[#7a3b1e]">
                              {Number(order.total).toFixed(2)} TL
                            </span>

                            <Badge
                              className={`
                                rounded-full border px-4 py-1
                                text-[10px] font-bold uppercase tracking-[0.14em]
                                ${status.className}
                              `}
                            >
                              {status.label}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ADDRESSES */}
              {user.addresses && user.addresses.length > 0 && (
                <div
                  className="
                      rounded-[22px]
                      border border-[#d0bc90]
                      bg-[#efe6cf]/65
                      p-5
                    "
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div
                      className="
                          flex h-10 w-10 items-center justify-center
                          overflow-hidden rounded-full
                          border border-[#d8bf8a]
                          bg-cover bg-center
                        "
                      style={{
                        backgroundImage: "url('/bkrr.png')",
                      }}
                    >
                      <MapPin className="h-4 w-4 text-[#2c1a0e]" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a67c3d]">
                        Adresler
                      </span>

                      <h3 className="font-serif text-xl font-black italic text-[#2c1a0e]">
                        Kayıtlı Adresler
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {user.addresses.map((address) => (
                      <div
                        key={address.id}
                        className="
                            rounded-[18px]
                            border border-[#d6c49a]/70
                            bg-[#fff8ee]/70
                            p-4
                          "
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="font-semibold text-[#2c1a0e]">
                            {address.title}
                          </span>

                          {address.isDefault && (
                            <Badge
                              className="
                                  rounded-full
                                  border-[#c8893a]
                                  bg-[#fff0cf]
                                  text-[#7a3b1e]
                                "
                            >
                              Varsayılan
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm leading-relaxed text-[#5e4734]/75">
                          {address.district}, {address.city}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="relative z-10 py-16 text-center text-[#5e4734]/60">
            Kullanıcı bulunamadı
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
