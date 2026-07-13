"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Clock,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";

import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { EmptyState } from "@/components/shared/empty-state";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    slug: string;
  };
};

type Order = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
};

function getOrderStatus(status: string) {
  switch (status) {
    case "PENDING":
      return {
        label: "WhatsApp / Ödeme Onayı Bekliyor",
        icon: Clock,
        className: "border-amber-200 bg-amber-50 text-amber-700",
      };

    case "PAID":
    case "CONFIRMED":
      return {
        label: "Onaylandı",
        icon: PackageCheck,
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };

    case "SHIPPED":
      return {
        label: "Kargoda",
        icon: Truck,
        className: "border-blue-200 bg-blue-50 text-blue-700",
      };

    case "DELIVERED":
      return {
        label: "Teslim Edildi",
        icon: PackageCheck,
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };

    case "CANCELLED":
      return {
        label: "İptal Edildi",
        icon: XCircle,
        className: "border-red-200 bg-red-50 text-red-700",
      };

    default:
      return {
        label: status,
        icon: Clock,
        className: "border-[#d8bf8a] bg-[#fff5ea] text-[#7a3b1e]",
      };
  }
}

export default function OrdersPage() {
  const router = useRouter();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await api.get<Order[]>("/api/orders/my-orders");
      return res.data || [];
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Siparişler yükleniyor..." fullScreen />;
  }

  if (!orders?.length) {
    return (
      <main className="min-h-screen bg-[#f6efdd] px-4 pt-36">
        <EmptyState
          icon="📦"
          title="Henüz sipariş talebiniz yok"
          description="Ürünleri sepete ekleyerek WhatsApp üzerinden sipariş talebi gönderebilirsiniz."
          action={{
            label: "Ürünlere Git",
            onClick: () => router.push("/products"),
          }}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6efdd] px-4 pb-20 pt-32 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 border-b border-[#3d3020]/10 pb-5">
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]">
            Hesabım
          </span>

          <h1 className="mt-2 font-serif text-4xl font-black italic text-[#2c1a0e]">
            Sipariş Taleplerim
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5e4734]/75">
            WhatsApp üzerinden gönderilen talepler ödeme/stok onayı sonrası
            işleme alınır.
          </p>
        </div>

        <div className="space-y-5">
          {orders.map((order) => {
            const status = getOrderStatus(order.status);
            const Icon = status.icon;

            return (
              <div
                key={order.id}
                className="relative overflow-hidden rounded-[20px] border border-[#d0bc90] bg-[#efe6cf] p-5 shadow-[0_10px_22px_rgba(120,92,58,0.12)]"
              >
                <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]" />
                <div className="pointer-events-none absolute inset-[7px] z-[2] rounded-[15px] border border-[#d6c49a]/70" />

                <div className="relative z-10">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a67c3d]">
                        Talep No
                      </p>

                      <h2 className="mt-1 font-serif text-2xl font-black text-[#2c1a0e]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </h2>

                      <p className="mt-1 text-xs text-[#5e4734]/70">
                        {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>

                    <div
                      className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${status.className}`}
                    >
                      <Icon size={14} />
                      {status.label}
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 border-t border-[#3d3020]/10 pt-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between gap-4 text-sm text-[#5e4734]"
                      >
                        <span>
                          {item.product?.name || "Ürün"}{" "}
                          <span className="text-[#3d3020]/40">
                            × {item.quantity}
                          </span>
                        </span>

                        <span className="font-bold text-[#2c1a0e]">
                          ₺
                          {(Number(item.price) * item.quantity).toLocaleString(
                            "tr-TR",
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[#3d3020]/10 pt-4">
                    <span className="text-sm font-bold text-[#5e4734]">
                      Toplam
                    </span>

                    <span className="font-serif text-2xl font-black text-[#7a3b1e]">
                      ₺{Number(order.total).toLocaleString("tr-TR")}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push(`/orders/${order.id}`)}
                    className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7a3b1e] transition hover:text-[#3d3020]"
                  >
                    Detayları Gör
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
