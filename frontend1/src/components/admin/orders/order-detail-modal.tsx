"use client";

import Image from "next/image";
import { Order, OrderStatus } from "@/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return "bg-[#dcebd4] text-[#476f3c]";

      case "CANCELLED":
        return "bg-[#f4dfdc] text-[#8f2f2f]";

      case "SHIPPED":
        return "bg-[#d9e8ef] text-[#315f7a]";

      default:
        return "bg-[#efe3cf] text-[#7a3b1e]";
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

  const SectionTitle = ({
    icon,
    title,
  }: {
    icon: React.ReactNode;
    title: string;
  }) => (
    <div className="mb-4 flex items-center gap-3">
      <div
        className="
          flex h-10 w-10 items-center justify-center
          overflow-hidden rounded-full
          border border-[#d8bf8a]
          bg-cover bg-center
          text-[#2c1a0e]
          shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.28)]
        "
        style={{
          backgroundImage: "url('/bkrr.png')",
        }}
      >
        {icon}
      </div>

      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a67c3d]">
          Sipariş
        </span>

        <h3 className="font-serif text-xl font-black italic text-[#2c1a0e]">
          {title}
        </h3>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-h-[92vh] overflow-y-auto border border-[#d0bc90]
          bg-[#efe6cf] p-0
          shadow-[0_18px_45px_rgba(120,92,58,0.22),inset_0_1px_2px_rgba(255,255,255,0.55)]
          sm:max-w-4xl
        "
      >
        {/* BG */}
        <div
          className="
            pointer-events-none absolute inset-0 z-[1]
            bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]
          "
        />

        {/* INNER BORDER */}
        <div
          className="
            pointer-events-none absolute inset-[7px] z-[2]
            rounded-[18px]
            border border-[#d6c49a]/70
          "
        />

        <div className="relative z-10">
          {/* HEADER */}
          <DialogHeader
            className="
              border-b border-[#3d3020]/10
              px-7 py-6 text-left
            "
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a67c3d]">
                  Sipariş Detayı
                </span>

                <DialogTitle
                  className="
                    mt-2 font-serif text-3xl
                    font-black italic text-[#2c1a0e]
                  "
                >
                  #{order.id.slice(0, 8).toUpperCase()}
                </DialogTitle>

                <DialogDescription className="mt-2 text-sm text-[#5e4734]/65">
                  Sipariş detaylarını görüntülüyorsunuz
                </DialogDescription>
              </div>

              <div
                className={`
                  inline-flex items-center rounded-full
                  px-4 py-2 text-xs font-bold uppercase tracking-[0.14em]

                  ${getStatusStyles(order.status)}
                `}
              >
                {getStatusLabel(order.status)}
              </div>
            </div>
          </DialogHeader>

          {/* CONTENT */}
          <div className="space-y-7 px-7 py-6">
            {/* CUSTOMER */}
            <section>
              <SectionTitle
                icon={<User className="h-4 w-4" />}
                title="Müşteri Bilgileri"
              />

              <div
                className="
                  rounded-[18px]
                  border border-[#d0bc90]
                  bg-[#efe3cf]/65
                  p-5
                "
              >
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-bold text-[#2c1a0e]">Ad Soyad:</span>{" "}
                    <span className="text-[#5e4734]/75">
                      {order.user?.name || "Bilinmiyor"}
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-[#2c1a0e]">Email:</span>{" "}
                    <span className="text-[#5e4734]/75">
                      {order.user?.email || "Bilinmiyor"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ADDRESS */}
            <section>
              <SectionTitle
                icon={<MapPin className="h-4 w-4" />}
                title="Teslimat Adresi"
              />

              <div
                className="
                  rounded-[18px]
                  border border-[#d0bc90]
                  bg-[#efe3cf]/65
                  p-5
                "
              >
                <div className="space-y-2 text-sm text-[#5e4734]/75">
                  <p className="font-serif text-lg font-black text-[#2c1a0e]">
                    {order.address.title}
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
            </section>

            {/* ITEMS */}
            <section>
              <SectionTitle
                icon={<Package className="h-4 w-4" />}
                title={`Sipariş Kalemleri (${order.items.length})`}
              />

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="
                      flex flex-col gap-4 rounded-[18px]
                      border border-[#d0bc90]
                      bg-[#efe3cf]/65
                      p-4
                      sm:flex-row sm:items-center
                    "
                  >
                    {/* IMAGE */}
                    <div
                      className="
                        relative h-20 w-20 shrink-0 overflow-hidden rounded-[14px]
                        border border-[#d8bf8a]
                        bg-cover bg-center
                      "
                      style={{
                        backgroundImage: "url('/bkrr.png')",
                      }}
                    >
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Package className="h-8 w-8 text-[#2c1a0e]" />
                        </div>
                      )}
                    </div>

                    {/* INFO */}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif text-lg font-black text-[#2c1a0e]">
                        {item.product.name}
                      </h4>

                      <p className="mt-1 text-sm text-[#5e4734]/65">
                        Adet: {item.quantity}
                      </p>
                    </div>

                    {/* PRICE */}
                    <div className="text-left sm:text-right">
                      <p className="font-black text-[#7a3b1e]">
                        {Number(item.price).toFixed(2)} TL
                      </p>

                      <p className="mt-1 text-sm text-[#5e4734]/60">
                        Toplam:{" "}
                        {(Number(item.price) * item.quantity).toFixed(2)} TL
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SUMMARY */}
            <section>
              <SectionTitle
                icon={<CreditCard className="h-4 w-4" />}
                title="Sipariş Özeti"
              />

              <div
                className="
                  rounded-[18px]
                  border border-[#d0bc90]
                  bg-[#efe3cf]/65
                  p-5
                "
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#5e4734]/70">Ara Toplam</span>

                    <span className="font-bold text-[#2c1a0e]">
                      {Number(order.total).toFixed(2)} TL
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#5e4734]/70">Kargo</span>

                    <span className="font-bold text-[#476f3c]">Ücretsiz</span>
                  </div>

                  <div className="border-t border-[#3d3020]/10 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xl font-black italic text-[#2c1a0e]">
                        Toplam
                      </span>

                      <span className="text-2xl font-black text-[#7a3b1e]">
                        {Number(order.total).toFixed(2)} TL
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* DATE */}
            <div
              className="
                flex items-center gap-2 rounded-full
                border border-[#d0bc90]
                bg-[#efe3cf]/60
                px-4 py-3 text-sm text-[#5e4734]/70
              "
            >
              <Calendar className="h-4 w-4" />
              Sipariş Tarihi:{" "}
              {format(new Date(order.createdAt), "dd MMMM yyyy HH:mm", {
                locale: tr,
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
