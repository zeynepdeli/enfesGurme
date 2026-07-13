"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  RotateCcw,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type OrderStatus = "preparing" | "shipped" | "delivered" | "cancelled";

interface OrderProduct {
  name: string;
  emoji: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  products: OrderProduct[];
  shipping: number;
  trackingNo?: string;
}

const ORDERS: Order[] = [
  {
    id: "SIP-2024-1842",
    date: "22 Nisan 2024",
    status: "shipped",
    trackingNo: "TK8847219034",
    products: [
      { name: "Çiğ Antep Fıstığı", emoji: "🥜", quantity: 2, price: 1350 },
      { name: "Divle Obruk Peyniri", emoji: "🧀", quantity: 1, price: 2500 },
    ],
    shipping: 250,
  },
  {
    id: "SIP-2024-1701",
    date: "10 Nisan 2024",
    status: "delivered",
    trackingNo: "TK7723109012",
    products: [
      { name: "Çiğ Antep Fıstığı", emoji: "🥜", quantity: 3, price: 1350 },
    ],
    shipping: 250,
  },
  {
    id: "SIP-2024-1603",
    date: "2 Nisan 2024",
    status: "preparing",
    products: [
      { name: "Divle Obruk Peyniri", emoji: "🧀", quantity: 2, price: 2500 },
    ],
    shipping: 250,
  },
  {
    id: "SIP-2024-1490",
    date: "18 Mart 2024",
    status: "cancelled",
    products: [
      { name: "Çiğ Antep Fıstığı", emoji: "🥜", quantity: 1, price: 1350 },
    ],
    shipping: 250,
  },
];

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  preparing: {
    label: "Hazırlanıyor",
    color: "#7a3b1e",
    bg: "#f8ead1",
    icon: <Clock size={14} />,
  },
  shipped: {
    label: "Kargoda",
    color: "#315f7a",
    bg: "#e7eef2",
    icon: <Truck size={14} />,
  },
  delivered: {
    label: "Teslim Edildi",
    color: "#476f3c",
    bg: "#e6efdf",
    icon: <CheckCircle size={14} />,
  },
  cancelled: {
    label: "İptal Edildi",
    color: "#8f2f2f",
    bg: "#f4dfdc",
    icon: <XCircle size={14} />,
  },
};

const HEADER_HEIGHT = 116;
const SIDEBAR_WIDTH = 240;

const FILTERS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "preparing", label: "Hazırlanıyor" },
  { key: "shipped", label: "Kargoda" },
  { key: "delivered", label: "Teslim Edildi" },
  { key: "cancelled", label: "İptal" },
];

function SidePanel() {
  return (
    <aside
      className="
        fixed left-0 z-20 hidden overflow-hidden
        px-4 py-6
        lg:flex lg:w-[240px] lg:flex-col lg:justify-between
      "
      style={{
        top: HEADER_HEIGHT,
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#efe3cb_0%,#e8dcc4_14%,#c9c29d_36%,#b7b08a_52%,#cec6a3_70%,#e7dbc3_88%,#efe3cb_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.32),transparent_34%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,248,236,0.18),transparent_38%)]" />

      <img
        src="/wo.png"
        alt=""
        className="absolute left-[8%] top-[-6%] w-[72%] opacity-[0.11] mix-blend-multiply"
      />

      <img
        src="/wo.png"
        alt=""
        className="absolute left-[25%] top-[42%] w-[62%] rotate-[10deg] opacity-[0.09] mix-blend-multiply"
      />

  
    </aside>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");

  const filteredOrders =
    activeFilter === "all"
      ? ORDERS
      : ORDERS.filter((o) => o.status === activeFilter);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getTotal = (order: Order) =>
    order.products.reduce((sum, p) => sum + p.price * p.quantity, 0) +
    order.shipping;

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#f6efdd]"
      style={{ paddingTop: HEADER_HEIGHT }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 opacity-25 mix-blend-multiply">
        <img
          src="/heroB.png"
          alt=""
          className="fixed h-full w-full object-cover"
        />
      </div>

      <SidePanel />

      <div
        className="relative z-10 min-h-[calc(100vh-116px)] lg:pl-[240px]"
        style={
          {
            "--sidebar-width": `${SIDEBAR_WIDTH}px`,
          } as React.CSSProperties
        }
      >
        <main className="px-5 pb-24 pt-10 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1680px]">
            <div className="mb-10 flex flex-col gap-4 border-b border-[#3d3020]/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]">
                  Hesabım
                </span>

                <h1 className="mt-2 font-serif text-4xl font-black italic text-[#2c1a0e] md:text-5xl">
                  Siparişlerim
                </h1>
              </div>

              <button
                onClick={() => router.push("/products")}
                className="flex w-fit items-center gap-2 text-sm font-semibold text-[#6b3f18]/70 transition hover:text-[#6b3f18]"
              >
                <ArrowLeft size={16} />
                Alışverişe devam et
              </button>
            </div>

            <div className="mb-8 flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const isActive = activeFilter === f.key;

                return (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    style={
                      isActive
                        ? {
                            backgroundImage: "url('/cardDuvar.png')",
                          }
                        : undefined
                    }
                    className={`
                      relative overflow-hidden rounded-full border px-4 py-2
                      text-sm font-bold transition-all
                      ${
                        isActive
                          ? "border-[#d8bf8a] bg-cover bg-center text-[#460e07] shadow-[0_8px_14px_rgba(120,92,58,0.12),inset_0_1px_2px_rgba(255,255,255,0.65)]"
                          : "border-[#d0bc90]/70 bg-[#efe6cf]/65 text-[#5e4734] hover:border-[#bc7b56]"
                      }
                    `}
                  >
                    {isActive && (
                      <>
                        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(255,252,245,0.42),rgba(214,194,160,0.10))]" />
                        <div className="pointer-events-none absolute inset-[3px] z-[2] rounded-full border border-[#e0c896]/50" />
                      </>
                    )}

                    <span className="relative z-10">
                      {f.label}
                      {f.key === "all" && (
                        <span className="ml-2 text-xs opacity-70">
                          ({ORDERS.length})
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="relative overflow-hidden rounded-[20px] border border-[#d0bc90] bg-[#efe6cf]/70 py-28 text-center">
                <Package className="mx-auto mb-4 text-[#a67c3d]" size={36} />
                <p className="font-serif text-lg italic text-[#3d3020]/55">
                  Bu kategoride sipariş bulunmuyor.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredOrders.map((order) => {
                  const cfg = STATUS_CONFIG[order.status];
                  const isOpen = expandedId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="
                        relative overflow-hidden rounded-[20px]
                        border border-[#d0bc90]
                        bg-[#efe6cf]
                        shadow-[0_10px_22px_rgba(120,92,58,0.12),inset_0_1px_2px_rgba(255,255,255,0.55)]
                      "
                    >
                      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]" />
                      <div className="pointer-events-none absolute inset-[6px] z-[2] rounded-[15px] border border-[#d6c49a]/70" />

                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="relative z-10 flex w-full items-center gap-5 px-5 py-5 text-left sm:px-6"
                      >
                        <div
                          className="
                            flex h-12 w-12 shrink-0 items-center justify-center
                            overflow-hidden rounded-full bg-cover bg-center
                            text-[#2c1a0e]
                            shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.28),0_1px_2px_rgba(80,35,10,0.15)]
                          "
                          style={{
                            backgroundImage: "url('/bkrr.png')",
                          }}
                        >
                          <Package size={21} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-serif text-lg font-black text-[#2c1a0e]">
                              {order.id}
                            </span>

                            <span
                              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                              style={{
                                color: cfg.color,
                                backgroundColor: cfg.bg,
                              }}
                            >
                              {cfg.icon}
                              {cfg.label}
                            </span>
                          </div>

                          <p className="mt-1 text-xs font-medium text-[#5e4734]/60">
                            {order.date} ·{" "}
                            {order.products.reduce((a, p) => a + p.quantity, 0)}{" "}
                            ürün
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-4">
                          <span className="text-lg font-black text-[#7a3b1e]">
                            ₺{getTotal(order).toLocaleString("tr-TR")}
                          </span>

                          {isOpen ? (
                            <ChevronUp
                              size={19}
                              className="text-[#3d3020]/45"
                            />
                          ) : (
                            <ChevronDown
                              size={19}
                              className="text-[#3d3020]/45"
                            />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="relative z-10 border-t border-[#3d3020]/10 px-5 py-5 sm:px-6">
                          <div className="mb-5 space-y-3">
                            {order.products.map((p, i) => (
                              <div
                                key={i}
                                className="
                                  flex items-center gap-4 rounded-[14px]
                                  border border-[#d0bc90]/70
                                  bg-[#efe3cf]/70 p-3
                                "
                              >
                                <div
                                  className="
                                    flex h-11 w-11 shrink-0 items-center justify-center
                                    overflow-hidden rounded-full bg-cover bg-center
                                    text-2xl
                                    shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.20)]
                                  "
                                  style={{
                                    backgroundImage: "url('/bkrr.png')",
                                  }}
                                >
                                  {p.emoji}
                                </div>

                                <div className="flex-1">
                                  <p className="font-serif text-sm font-black text-[#2c1a0e]">
                                    {p.name}
                                  </p>

                                  <p className="text-xs text-[#5e4734]/65">
                                    {p.quantity} adet × ₺
                                    {p.price.toLocaleString("tr-TR")}
                                  </p>
                                </div>

                                <span className="font-black text-[#2c1a0e]">
                                  ₺
                                  {(p.price * p.quantity).toLocaleString(
                                    "tr-TR",
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="mb-5 space-y-2 border-t border-[#3d3020]/10 pt-4 text-sm">
                            <div className="flex justify-between text-[#5e4734]">
                              <span>Kargo</span>
                              <span>₺{order.shipping}</span>
                            </div>

                            <div className="flex justify-between text-base font-black text-[#2c1a0e]">
                              <span>Toplam</span>
                              <span className="text-[#7a3b1e]">
                                ₺{getTotal(order).toLocaleString("tr-TR")}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {order.status === "shipped" && order.trackingNo && (
                              <Button
                                variant="outline"
                                className="rounded-full border-[#315f7a] bg-transparent text-[#315f7a] hover:bg-[#e7eef2]"
                              >
                                <Truck size={15} className="mr-2" />
                                Kargoyu Takip Et
                              </Button>
                            )}

                            {order.status === "delivered" && (
                              <Button
                                variant="outline"
                                className="rounded-full border-[#bc7b56] bg-transparent text-[#7a3b1e] hover:bg-[#efe3cf]"
                              >
                                <Star size={15} className="mr-2" />
                                Değerlendir
                              </Button>
                            )}

                            {(order.status === "delivered" ||
                              order.status === "shipped") && (
                              <Button
                                variant="outline"
                                className="rounded-full border-[#d0bc90] bg-transparent text-[#5e4734] hover:bg-[#efe3cf]"
                              >
                                <RotateCcw size={15} className="mr-2" />
                                İade / Değişim
                              </Button>
                            )}

                            {order.status === "preparing" && (
                              <Button
                                variant="outline"
                                className="rounded-full border-red-300 bg-transparent text-red-500 hover:bg-red-50"
                              >
                                <XCircle size={15} className="mr-2" />
                                Siparişi İptal Et
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              className="rounded-full border-[#d0bc90] bg-transparent text-[#5e4734] hover:bg-[#efe3cf]"
                              onClick={() => router.push("/products")}
                            >
                              Tekrar Sipariş Ver
                            </Button>
                          </div>

                          {order.trackingNo && (
                            <p className="mt-4 text-xs text-[#3d3020]/40">
                              Takip No:{" "}
                              <span className="font-mono">
                                {order.trackingNo}
                              </span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
